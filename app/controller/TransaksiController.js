const {
    returs,deliveryfods, transaksis,statustranksasis,keranjangs,products,
    daexpedisis,customers,warehouses,auths,buktibayars,product_stocks,
    districts,cityregencies,province, mapgroup, group, metodepembayarans, Sequelize 
   } = require('../models/index');
const { Op } = require("sequelize");
const { exportstocsv }  = require("export-to-csv"); 
const { Parser } = require('json2csv');
const { generate } = require("csv-generate");
const converter = require('json-2-csv');
const fs = require("fs")
const csvdir = "./app/public/docs"
const apiResponse = require("../helpers/apiResponse");
const xl = require('excel4node');


module.exports = {

    //create
    async create(req, res) { 
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var tanggal = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        // let keranjangdata =  req.body.products.replace(/\\n/g, '')
        let keranjangdata =  req.body.products
        let datakeranjang = eval(keranjangdata)
        let result = await transaksis.create({
            nama: req.body.nama,
            customerId: req.body.customerId,
            districtId: req.body.districtId,
            provinceId: req.body.provinceId,
            provinsiname: req.body.provinsiname,
            cityname: req.body.cityname,
            districtname: req.body.districtname,
            cityregencyId: req.body.cityregencyId,
            warehouseId: req.body.warehouseId,
            groupname: req.body.groupname,
            idGroup: req.body.idGroup,
            // invoiceId: req.body.warehouseId,
            expedisiName: req.body.expedisiName,
            authId: req.body.authId,
            groupId: req.body.groupId,
            createdAt: tanggal,
            idtransaksi: req.body.idtransaksi,
            products: keranjangdata,
            discount: req.body.discount,
            typebayar: req.body.typebayar,
            pembayaran: req.body.pembayaran,
            status:  req.body.status,
            logstatus:  req.body.logstatus,
            ongkoskirim:  req.body.ongkoskirim,
            subsidi:  req.body.subsidi,
            memotransaksi: req.body.memotransaksi,
            leadsId: req.body.leadsId,
        }).then(result => {
            let keranjang = keranjangs.bulkCreate(datakeranjang, { individualHooks: true })
            // let keranjung = keranjangs.findAll({
            //     where: {
            //         transaksiId: {
            //         [Op.like]: req.body.idtransaksi,
            //     },
            // },
            // }).then(keranjung =>{
            let quantity = 0;
            for(var i=0;i<datakeranjang.length;i++){
                quantity = datakeranjang[i].jumlahproduct
                let stok = product_stocks.create({ 
                    productId: datakeranjang[i].productId,
                    warehouseId: req.body.warehouseId,
                    quantity: quantity,
                    inbound:false,
                    nodeliverorder: datakeranjang[i].id,
                    remark: "-"
                });
                let product = products.findOne({
                    where: {
                        id:  datakeranjang[i].productId
                    },
                }).then(product =>{
                    product.quantity = (parseInt(product.quantity) - parseInt(quantity));
                    product.save()
                })
            }
            // apiResponse.successResponseWithData(res, "SUCCESS", req.keranjang);
            // })
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await transaksis.findOne({
            where: {
               id: req.params.id
            },
            include: [ 
                { model: daexpedisis,
                    attributes: ['namabank','biayatambahan','norekening','biayacod','createdAt','totalharga'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['firstname'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['firstname'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['firstname'],
                },
                
            ]
        }).then(result => {
            req.transaksi = result;
            next();
            });
    },
    async finddelete(req, res, next) {
        let transaksi = await transaksis.findByPk(req.params.id);
        if (!transaksi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.transaksi = transaksi;
            next();
        }
    },
    async index(req, res) {
      
        let metodebayar = parseInt(req.query.metodebayar)
        let status = req.query.status
        let nama = req.query.nama
        //let statusbarang = req.query.statusbarang
        
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:59.000Z"
    
     
        if( status == null ){
            status = ""
        }
        // if( statusbarang == null ){
        //     statusbarang = ""
        // }
        if( nama == null ){
            nama = ""
        }
        if(isNaN(parseFloat(metodebayar))){
            metodebayar = ""
        }
    
        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                authId: req.params.userid,
                [Op.and]: [
                    {
                    status: {    
                        [Op.like]: '%'+status+'%'
                    }
                     },
                    //  {
                    //     statusbarang: {    
                    //         [Op.like]: '%'+statusbarang+'%'
                    //     }
                    //      },
                     {
                        pembayaran: {    
                            [Op.like]: '%'+metodebayar+'%'
                        }
                        
                         },
                         {
                            nama: {    
                                [Op.like]: '%'+nama+'%'
                            }
                             },
                  ],
             },
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi',],
                        // include: [ 
                        //     { model: daexpedisis,
                        //         attributes: ['id'],
                        //     }
                        // ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexGudang(req, res) {
        let warehouseId = req.query.warehouseId
        let status = req.query.status
        let paymentMethod = req.query.paymentMethod
        let expedition = req.query.expedition
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let searchWords = []
        let search = req.query.search

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                searchWords.push({
                    [Op.or]:[
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            orderNumber:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            invoiceId:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$customer.notelp$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            expedisiName:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$warehouse.name$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$daexpedisis.totalharga$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$metodepembayaran.nama$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                    ],
                })
            })
        }

        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        if( warehouseId == null ){
            warehouseId = ""
        }
        if( status == null ){
            status = ""
        }
        if( paymentMethod == null ){
            paymentMethod = ""
        }
        if( expedition == null ){
            expedition = ""
        }

        let filter ={ 
            where: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                createdAt: {
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                status: {
                    [Op.and]:[
                        {[Op.like]: '%'+status+'%'},
                        {
                            [Op.or]: [
                                // {
                                //     [Op.like]: '%K%'
                                // },
                                {
                                    [Op.like]: '%G%'
                                },
                            ]
                        },
                    ]
                    
                },
                typebayar: {
                    [Op.like]: '%'+paymentMethod+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedition+'%'
                },
                [Op.and]:searchWords,
            },
            order: [
                ['id', 'DESC'],
            ],
            include: [ 
                { model: warehouses,
                    attributes: ['name'],
                }, { model: customers,
                    attributes: ['notelp'],
                },
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['notelp','firstname'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['notelp','firstname'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['notelp','firstname'],
                },
                { model: metodepembayarans,
                    attributes: ['nama'],
                },
            ]
        }
        let count = await transaksis.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await transaksis.findAll(filter).then(result => {
            console.log(count);
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async indexGudangRiwayat(req, res) {
        let warehouseId = req.query.warehouseId
        let expedition = req.query.expedition
        let paymentMethod = req.query.paymentMethod
        let transactionStatus = req.query.transactionStatus
        let paymentStatus = req.query.paymentStatus
        let searchWords = []
        let search = req.query.search

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                searchWords.push({
                    [Op.or]:[
                        {
                            invoiceId:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            awb:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            expedisiName:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$warehouse.name$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$metodepembayaran.nama$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$authWarehouse.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        Sequelize.where(Sequelize.literal("(CASE WHEN `transaksis`.`status` = 'A' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'B' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'B' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'C' THEN 'Menunggu Pembayaran' WHEN `transaksis`.`status` = 'D' THEN 'Verifikasi Finance' WHEN `transaksis`.`status` = 'E' THEN 'Kurang Bayar' WHEN `transaksis`.`status` = 'F' THEN 'Lunas' WHEN `transaksis`.`status` = 'G' THEN 'Siap Kirim' WHEN `transaksis`.`status` = 'H' THEN 'Dikirim' WHEN `transaksis`.`status` = 'I' THEN 'Sukses' WHEN `transaksis`.`status` = 'J' THEN 'Gagal' WHEN `transaksis`.`status` = 'K' THEN 'Return' WHEN `transaksis`.`status` = 'L' THEN 'Cancel' WHEN `transaksis`.`status` = 'M' THEN 'Sudah Bayar' WHEN `transaksis`.`status` = 'N' THEN 'DFOD' WHEN `transaksis`.`status` = 'O' THEN 'Kirim Ulang' END)"),{
                            [Op.like]: `%${word}%`
                        }),
                    ]
                })
            })
        }

        const date = new Date();
        let startDate = new Date(0),
            endDate   = new Date(date.setDate(date.getDate() + 1));

        if (req.query.startDate) {
            startDate = req.query.startDate + 'T00:00:00'
        }
        if (req.query.endDate) {
            endDate = req.query.endDate + 'T23:59:59'
        }

        if( warehouseId == null ){
            warehouseId = ""
        }
        if( expedition == null ){
            expedition = ""
        }
        if( paymentMethod == null ){
            paymentMethod = ""
        }
        if( transactionStatus == null ){
            transactionStatus = ""
        }
        if( paymentStatus == null ){
            paymentStatus = ""
        }

        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await transaksis.count(
            { 
                where: {
                    warehouseId: {
                        [Op.like]: '%'+warehouseId+'%'
                    },
                    createdAt: {
                        [Op.and]: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    },
                    expedisiName: {
                        [Op.like]: '%'+expedition+'%'
                    },
                    typebayar: {
                        [Op.like]: '%'+paymentMethod+'%'
                    },
                    pembayaran: {
                        [Op.like]: '%'+paymentStatus+'%'
                    },
                    status: {
                        [Op.and]:[
                            {[Op.like]: '%'+transactionStatus+'%'},
                            {
                                [Op.or]: [
                                    {
                                        [Op.like]: '%H%'
                                    },
                                    {
                                        [Op.like]: '%N%'
                                    },
                                    {
                                        [Op.like]: '%I%'
                                    },
                                ]
                            }
                        ]
                    },
                    [Op.and]: searchWords,
                },
                include: [ 
                    { model: warehouses,
                        attributes: ['name'],
                    }, { model: customers,
                        attributes: ['notelp'],
                    },
                    { model: daexpedisis,
                        attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                    },
                    { model: auths,
                        as:'auth',
                        attributes: ['notelp','firstname'],
                    },
                    { model: auths,
                        as:'authWarehouse',
                        attributes: ['notelp','firstname'],
                    },
                    { model: auths,
                        as:'authFinance',
                        attributes: ['notelp','firstname'],
                    },
                ]
            },
            
        )
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                createdAt: {
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                expedisiName: {
                    [Op.like]: '%'+expedition+'%'
                },
                typebayar: {
                    [Op.like]: '%'+paymentMethod+'%'
                },
                pembayaran: {
                    [Op.like]: '%'+paymentStatus+'%'
                },
                status: {
                    [Op.and]:[
                        {[Op.like]: '%'+transactionStatus+'%'},
                        {
                            [Op.or]: [
                                {
                                    [Op.like]: '%H%'
                                },
                                {
                                    [Op.like]: '%N%'
                                },
                                {
                                    [Op.like]: '%I%'
                                },
                            ]
                        }
                    ]
                },
                [Op.and]: searchWords
              },
            attributes:[
                'id',
                'createdAt',
                'tanggalAWB',
                'invoiceId',
                'awb',
                'nama',
                'expedisiName',
                'typebayar',
                'tanggalVerifikasi',
                'tanggalAWB',
                'status',
                'ongkoskirim',
                'customerId',
                'memotransaksi',
                'subsidi',
            ],
            order: [
                ['tanggalAWB', 'DESC'],
            ],
            include: [ 
                { model: warehouses,
                    attributes: ['name'],
                }, { model: customers,
                    attributes: ['notelp'],
                },
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['notelp','firstname'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['notelp','firstname'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['notelp','firstname'],
                },
                { model: metodepembayarans,
                    attributes: ['nama'],
                },
            ]
        }).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },



    async riwayatall(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        let status = req.query.status
        let warehouseId = req.query.warehouseId
        let paymentMethod = {[Op.like]: '%%'}
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        
        if( warehouseId == null ){
            warehouseId = ""
        }
        if( status == null ){
            status = ""
        }
        if( req.query.paymentMethod != null ){
            paymentMethod = req.query.paymentMethod
        }
        if( search == null ){
            search = ""
        }

        let count = await transaksis.count(
            {
                where: {
                    createdAt :  {
                        [Op.and]: {
                          [Op.gte]: startDate,
                          [Op.lte]: endDate
                        }
                    },
                    status: {
                        [Op.and]:[
                            {
                                [Op.or]: [
                                    {
                                        [Op.like]: '%H%'
                                    },
                                    {
                                        [Op.like]: '%N%'
                                    },
                                    {
                                        [Op.like]: '%I%'
                                    },
                                ]
                            },
                            {
                                [Op.like]: `%${status}%`
                            }
                        ]
                    },
                    warehouseId:{
                        [Op.like]: `%${warehouseId}%`
                    },
                    typebayar: paymentMethod,
                    [Op.or]:[
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            '$customer.notelp$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            invoiceId:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            '$warehouse.name$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            awb:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            expedisiName:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            '$daexpedisis.totalharga$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
                },
                include: [ 
                    { model: warehouses,
                    },
                     { model: customers,
                    },
                    { model: daexpedisis,
                    },
                    { model: auths,
                        as:'auth',
                       
                    }
                ]
            }
        )
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                status: {
                    [Op.and]:[
                        {
                            [Op.or]: [
                                {
                                    [Op.like]: '%H%'
                                },
                                {
                                    [Op.like]: '%N%'
                                },
                                {
                                    [Op.like]: '%I%'
                                },
                            ]
                        },
                        {
                            [Op.like]: `%${status}%`
                        }
                    ]
                },
                typebayar: paymentMethod,
                warehouseId:{
                    [Op.like]: `%${warehouseId}%`
                },
                [Op.or]:[
                    {
                        '$auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        nama:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$customer.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        invoiceId:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$warehouse.name$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awb:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        expedisiName:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$daexpedisis.totalharga$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                ],
            },
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: warehouses,
                            },
                             { model: customers,
                            },
                            { model: daexpedisis,
                            },
                            { model: auths,
                                as:'auth',
                               
                            }
            ]
        }).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelGudang(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.like]: '%G%'
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
        //    console.log(result)
            class Transaksi {
                constructor(
                    Sender,
                    SenderPhone,
                    Invoice,
                    prd1,
                    sku1,
                    qty1,
                    weight1,
                    prd2,
                    sku2,
                    qty2,
                    weight2,
                    prd3,
                    sku3,
                    qty3,
                    weight3,
                    RecepientName,
                    RecepientPhone,
                    ReceipentAddress,
                    ReceipentProvince,
                    ReceipentCity,
                    ReceipentDistrict,
                    ReceipentKodePos,
                    awb,
                    expedition,
                    totalHarga,
                    tag,
                    gudangPost,
                    ongkos,
                    typebayar,
                    subsidi,
                    namacs,
                    memo,
                    // prd4,
                    // sku4,
                    // qty4,
                    // weight4,
                    // prd5,
                    // sku5,
                    // qty5,
                    // weight5,
                ) {
                  this.Sender = Sender; //1
                  this.SenderPhone = SenderPhone; //2
                  this.Invoice = Invoice; //3
                  this.prd1 = prd1; //4
                  this.sku1 = sku1; //5
                  this.qty1 = qty1; //6
                  this.weight1 = weight1; //7
                  this.prd2 = prd2; //8
                  this.sku2 = sku2; //9
                  this.qty2 = qty2; //10
                  this.weight2 = weight2; //11
                  this.prd3 = prd3; // 12
                  this.sku3 = sku3; // 13
                  this.qty3 = qty3; // 14
                  this.weight3 = weight3; // 15
                //   this.prd4 = prd4; 
                //   this.sku4 = sku4; 
                //   this.qty4 = qty4; 
                //   this.weight4 = weight4; 
                //   this.prd5 = prd5; 
                //   this.sku5 = sku5; 
                //   this.qty5 = qty5; 
                //   this.weight5 = weight5; 
                  this.RecepientName = RecepientName; // 16
                  this.RecepientPhone = RecepientPhone; // 17
                  this.ReceipentAddress = ReceipentAddress; // 18
                  this.ReceipentProvince = ReceipentProvince; // 19
                  this.ReceipentCity = ReceipentCity; // 20
                  this.ReceipentDistrict = ReceipentDistrict; // 21
                  this.ReceipentKodePos = ReceipentKodePos; // 22
                  this.awb = awb; // 23
                  this.expedition = expedition; // 24
                  this.totalHarga = totalHarga; // 25
                  this.tag = tag; // 26
                  this.gudangPost = gudangPost; // 27
                  this.typebayar = typebayar; // 29
                  this.ongkos = ongkos; // 28
                  this.subsidi = subsidi; // 30
                  this.namacs = namacs; // 31
                  this.memo = memo; // 32
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct,weight) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                      this.weight = weight;
                    }
                  }
                var  KeranjangArray = [];
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","","",""));
                    }else{
                        KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct,datakeranjang[j].weight));
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }           
                TransaksiArray.push(new Transaksi(
                    "FHG", // 1
                    result[i].auth.notelp, // 2
                    result[i].invoiceId, // 3
                    KeranjangArray[0].namaproduct, // 4
                    KeranjangArray[0].sku, // 5
                    KeranjangArray[0].jumlahproduct.toString(), // 6
                    KeranjangArray[0].weight.toString(), // 7
                    KeranjangArray[1].namaproduct, // 8
                    KeranjangArray[1].sku, // 9
                    KeranjangArray[1].jumlahproduct.toString(), // 10
                    KeranjangArray[1].weight.toString(), // 11
                    KeranjangArray[2].namaproduct, // 12
                    KeranjangArray[2].sku, // 13
                    KeranjangArray[2].jumlahproduct.toString(), // 14
                    KeranjangArray[2].weight.toString(), // 15
                    result[i].customer.nama, // 16
                    result[i].customer.notelp, // 17
                    result[i].customer.alamat, // 18
                    result[i].customer.provinsiname, // 19
                    result[i].customer.cityname, // 20
                    result[i].customer.districtname, // 21
                    result[i].customer.postalcode, // 22
                    result[i].awb, // 23
                    result[i].expedisiName, // 24
                    result[i].daexpedisis.totalharga.toString(), // 25
                    result[i].auth.firstname, // 26
                    result[i].warehouse.name, // 27
                    type, // 28
                    result[i].ongkoskirim.toString(), // 29
                    result[i].subsidi.toString(), // 30
                    result[i].auth.firstname, // 31
                    result[i].memotransaksi, // 32
                    // KeranjangArray[3].namaproduct, 
                    // KeranjangArray[3].sku, 
                    // KeranjangArray[3].jumlahproduct.toString(),
                    // KeranjangArray[3].weight.toString(),
                    // KeranjangArray[4].namaproduct,
                    // KeranjangArray[4].sku,
                    // KeranjangArray[4].jumlahproduct.toString(),
                    // KeranjangArray[4].weight.toString(),
                ));
            }
          // console.log(KeranjangArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Sender",
                "Sender Phone No.",
                "Invoice",
                "Nama Produk 1",
                "SKU 1",
                "Qty 1",
                "Weight",
                "Nama Produk 2",
                "SKU 2",
                "Qty 2",
                "Weight",
                "Nama Produk 3",
                "SKU 3",
                "Qty 3",
                "Weight",
                "Recepient Name",
                "Recipient Phone No",
                "Recipient Address",
                "Recipient Provinsi",
                "Recipient Kabupaten / Kota",
                "Recipient Kecamatan",
                "Recipient Kode POS",   
                "AWB",
                "3PL",
                "Total Harga Pesanan",
                "TAG",
                "Warehouse",
                "Ongkos Pengiriman",
                "TypeBayar",
                "Subsidi Pengiriman",
                "Nama CS",
                "Memo",
                ""
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    // console.log('record: '+record);
                    // console.log('columnName: '+columnName);
                    // console.log('columnIndex: '+columnIndex);
                    // console.log('rowIndex: '+rowIndex);
                    // console.log('record [columnName]: '+record [columnName]);
                    // console.log('==========================================');
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelGudangRiwayat(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%H%'
                        },
                        {
                            [Op.like]: '%N%'
                        },
                        {
                            [Op.like]: '%I%'
                        },
                    ]
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
            //  console.log(result)
              class Transaksi {
                  constructor(
                      Sender,
                      SenderPhone,
                      Invoice,
                      prd1,
                      sku1,
                      qty1,
                      weight1,
                      prd2,
                      sku2,
                      qty2,
                      weight2,
                      prd3,
                      sku3,
                      qty3,
                      weight3,
                      RecepientName,
                      RecepientPhone,
                      ReceipentAddress,
                      ReceipentProvince,
                      ReceipentCity,
                      ReceipentDistrict,
                      ReceipentKodePos,
                      awb,
                      expedition,
                      totalHarga,
                      tag,
                      gudangPost,
                      ongkos,
                      typebayar,
                      subsidi,
                      namacs,
                      memo,
                      aa
                  ) {
                    this.Sender = Sender; //1
                    this.SenderPhone = SenderPhone; //2
                    this.Invoice = Invoice; //3
                    this.prd1 = prd1; //4
                    this.sku1 = sku1; //5
                    this.qty1 = qty1; //6
                    this.weight1 = weight1; //7
                    this.prd2 = prd2; //8
                    this.sku2 = sku2; //9
                    this.qty2 = qty2; //10
                    this.weight2 = weight2; //11
                    this.prd3 = prd3; // 12
                    this.sku3 = sku3; // 13
                    this.qty3 = qty3; // 14
                    this.weight3 = weight3; // 15
                    this.RecepientName = RecepientName; // 16
                    this.RecepientPhone = RecepientPhone; // 17
                    this.ReceipentAddress = ReceipentAddress; // 18
                    this.ReceipentProvince = ReceipentProvince; // 19
                    this.ReceipentCity = ReceipentCity; // 20
                    this.ReceipentDistrict = ReceipentDistrict; // 21
                    this.ReceipentKodePos = ReceipentKodePos; // 22
                    this.awb = awb; // 23
                    this.expedition = expedition; // 24
                    this.totalHarga = totalHarga; // 25
                    this.tag = tag; // 26
                    this.gudangPost = gudangPost; // 27
                    this.typebayar = typebayar; // 29
                    this.ongkos = ongkos; // 28
                    this.subsidi = subsidi; // 30
                    this.namacs = namacs; // 31
                    this.memo = memo; // 32
                  }
                }
              var  TransaksiArray = [];
            
              for(var i=0;i<result.length;i++){
                  class Keranjang {
                      constructor(namaproduct,sku,jumlahproduct,weight) {
                        this.namaproduct = namaproduct;
                        this.sku = sku;
                        this.jumlahproduct = jumlahproduct;
                        this.weight = weight;
                      }
                    }
                  var  KeranjangArray = [];
                  let keranjangdata =  result[i].products.replace(/\\n/g, '')
                  let datakeranjang = eval(keranjangdata)
                  for(var j=0;j<=3;j++){
                      if(datakeranjang[j] === undefined){
                          KeranjangArray.push(new Keranjang("","","",""));
                      }else{
                          KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct,datakeranjang[j].weight));
                      }
                     
                  }    
                  if(result[i].typebayar == 1){
                    var type = "Transfer"
                  }else{
                    var type = "COD"
                  }           
                  TransaksiArray.push(new Transaksi(
                      "FHG", // 1
                      result[i].auth.notelp, // 2
                      result[i].invoiceId, // 3
                      KeranjangArray[0].namaproduct, // 4
                      KeranjangArray[0].sku, // 5
                      KeranjangArray[0].jumlahproduct.toString(), // 6
                      KeranjangArray[0].weight.toString(), // 7
                      KeranjangArray[1].namaproduct, // 8
                      KeranjangArray[1].sku, // 9
                      KeranjangArray[1].jumlahproduct.toString(), // 10
                      KeranjangArray[1].weight.toString(), // 11
                      KeranjangArray[2].namaproduct, // 12
                      KeranjangArray[2].sku, // 13
                      KeranjangArray[2].jumlahproduct.toString(), // 14
                      KeranjangArray[2].weight.toString(), // 15
                      result[i].customer.nama, // 16
                      result[i].customer.notelp, // 17
                      result[i].customer.alamat, // 18
                      result[i].customer.provinsiname, // 19
                      result[i].customer.cityname, // 20
                      result[i].customer.districtname, // 21
                      result[i].customer.postalcode, // 22
                      result[i].awb, // 23
                      result[i].expedisiName, // 24
                      result[i].daexpedisis.totalharga.toString(), // 25
                      result[i].auth.firstname, // 26
                      result[i].warehouse.name, // 27
                      type, // 28
                      result[i].ongkoskirim.toString(), // 29
                      result[i].subsidi.toString(), // 30
                      result[i].auth.firstname, // 31
                      result[i].memotransaksi, // 32
                      "aa" // 33
                  ));
              }
            // console.log(KeranjangArray)
              const wb = new xl.Workbook();
              const ws = wb.addWorksheet('Data Transaksi');
              const headingColumnNames = [
                  "Sender",
                  "Sender Phone No.",
                  "Invoice",
                  "Nama Produk 1",
                  "SKU 1",
                  "Qty 1",
                  "Weight",
                  "Nama Produk 2",
                  "SKU 2",
                  "Qty 2",
                  "Weight",
                  "Nama Produk 3",
                  "SKU 3",
                  "Qty 3",
                  "Weight",
                  "Recepient Name",
                  "Recipient Phone No",
                  "Recipient Address",
                  "Recipient Provinsi",
                  "Recipient Kabupaten / Kota",
                  "Recipient Kecamatan",
                  "Recipient Kode POS",   
                  "AWB",
                  "3PL",
                  "Total Harga Pesanan",
                  "TAG",
                  "Warehouse",
                  "Ongkos Pengiriman",
                  "TypeBayar",
                  "Subsidi Pengiriman",
                  "Nama CS",
                  "Memo",
                  ""
              ]
              let headingColumnIndex = 1;
              headingColumnNames.forEach(heading => {
                  ws.cell(1, headingColumnIndex++)
                      .string(heading)
              });
              let rowIndex = 2;
              TransaksiArray.forEach( record => {
                  let columnIndex = 1;
                  Object.keys(record ).forEach(columnName =>{
                      console.log('record: '+record);
                      console.log('columnName: '+columnName);
                      console.log('columnIndex: '+columnIndex);
                      console.log('rowIndex: '+rowIndex);
                      console.log('record [columnName]: '+record [columnName]);
                      console.log('==========================================');
                      ws.cell(rowIndex,columnIndex++)
                          .string(record [columnName])
                  });
                  rowIndex++;
              }); 
              var filename = +Date.now()+'-transaksidata.xlsx'
              returnData = {
                  metadata: {
                      link: filename,
                  }
              }
              wb.write(filename,res);
              //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
              //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
             //return apiResponse.successResponseWithData(res, "SUCCESS", result);
              }).catch(function (err){
                  return apiResponse.ErrorResponse(res, err);
              });
    },


    async ExcelTemplateGudang(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                status: {
                    [Op.like]: '%G%'
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi'],
              order: [
                ['id', 'DESC'],
            ],
        }).then(result => {
            class Invoice {
                constructor(invoiceId,awb) {
                  this.invoiceId = invoiceId;
                  this.awb = awb;
                }
              }
              var  InvoiceArray = [];  
            for(var i=0;i<result.length;i++){
                InvoiceArray.push(new Invoice(
                result[i].invoiceId,
                ""
              ));
            }
           console.log(result.length)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Invoice",
                "AWB",
                ""
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            InvoiceArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async ExcelFinance(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.or]: [
                        {
                    [Op.like]: '%D%'
                  },
                  {
                    [Op.like]: '%C%'
                  }, {
                    [Op.like]: '%E%'
                  }
                ]
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening'],
                            },
            ]
        }).then(result => {
          //  console.log(result)
            class Transaksi {
                constructor(Invoice,part1,qty1,RecepientName,RecepientNo,RecepientAdress,memo,awb,expedisi,ongkos,tag,warehousename,typebayar,ongkir,subsidi,gudangAlamat,namacs,gudangPost,aa) {
                  this.Invoice = Invoice;
                  this.part1 = part1;
                  this.qty1 = qty1;
                  this.RecepientName = RecepientName;
                  this.RecepientNo = RecepientNo;
                  this.RecepientAdress = RecepientAdress;
                  this.memo = memo;
                  this.awb = awb;
                  this.expedisi = expedisi;
                  this.ongkos = ongkos;
                  this.tag = tag;
                  this.warehousename = warehousename;
                  this.typebayar = typebayar;
                  this.ongkir = ongkir;
                  this.subsidi = subsidi;
                  this.namacs = namacs;
                  this.gudangAlamat = gudangAlamat;
                  this.gudangPost = gudangPost;
                  this.aa = aa;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct,supervisor,advertiser,domain,hpp) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                      this.supervisor = supervisor;
                      this.advertiser = advertiser;
                      this.domain = domain;
                      this.hpp = hpp;
                    }
                  }
                var  KeranjangArray = [];
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        KeranjangArray.push(new Keranjang(
                            datakeranjang[j].namaproduct,
                            datakeranjang[j].sku,
                            datakeranjang[j].jumlahproduct
                            
                            ));
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }           
                TransaksiArray.push(new Transaksi(
                result[i].invoiceId,
                KeranjangArray[0].namaproduct,KeranjangArray[0].sku,KeranjangArray[0].jumlahproduct.toString(),
               
                result[i].customer.nama,
                result[i].customer.notelp,
                result[i].customer.alamat,
                result[i].awb,
                result[i].expedisiName,
                result[i].daexpedisis.totalharga.toString(),
                result[i].auth.firstname,
                result[i].warehouse.name,
                type,
                result[i].ongkoskirim.toString(),
                result[i].subsidi.toString(),
                result[i].auth.firstname,
                result[i].memotransaksi,
                "aa"));
            }
          // console.log(KeranjangArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Invoice",
                "Nama Produk 1",
                "SKU 1",
                "Qty 1",
                "Recepient Name",
                "Recipient Phone No",
                "Recipient Address",
                "AWB",
                "3PL",
                "Total Harga Pesanan",
                "TAG",
                "Warehouse",
                "Ongkos Pengiriman",
                "TypeBayar",
                "Subsidi Pengiriman",
                "Nama CS",
                "Memo",
                ""
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelFinanceRiwayat(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.or]: [
                        {
                    [Op.like]: '%F%'
                  },
                  {
                    [Op.like]: '%G%'
                  },
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                  {
                    [Op.like]: '%J%'
                  },
                  {
                    [Op.like]: '%K%'
                  },
                  {
                    [Op.like]: '%L%'
                  },
                  {
                    [Op.like]: '%M%'
                  }
                  ,
                  {
                    [Op.like]: '%N%'
                  },
                  {
                    [Op.like]: '%O%'
                  }
                ]
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
          //  console.log(result)
            class Transaksi {
                constructor(SenderPhone,Invoice,part1,qty1,part2,qty2,part3,qty3,RecepientName,RecepientNo,RecepientAdress,RecepientProvinsi,RecepientKota,RecepientKecamatan,RecepientKodePos,memo,awb,expedisi,ongkos,tag,warehousename,typebayar,ongkir,subsidi,gudangAlamat,namacs,gudangPost,aa) {
                  this.SenderPhone = SenderPhone;
                  this.Invoice = Invoice;
                  this.part1 = part1;
                  this.qty1 = qty1;
                  this.part2 = part2;
                  this.qty2 = qty2;
                  this.part3 = part3;
                  this.qty3 = qty3;
                  this.RecepientName = RecepientName;
                  this.RecepientNo = RecepientNo;
                  this.RecepientAdress = RecepientAdress;
                  this.RecepientProvinsi = RecepientProvinsi;
                  this.RecepientKota = RecepientKota;
                  this.RecepientKecamatan = RecepientKecamatan;
                  this.RecepientKodePos = RecepientKodePos;
                  this.memo = memo;
                  this.awb = awb;
                  this.expedisi = expedisi;
                  this.ongkos = ongkos;
                  this.tag = tag;
                  this.warehousename = warehousename;
                  this.typebayar = typebayar;
                  this.ongkir = ongkir;
                  this.subsidi = subsidi;
                  this.namacs = namacs;
                  this.gudangAlamat = gudangAlamat;
                  this.gudangPost = gudangPost;
                  this.aa = aa;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct,supervisor) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                      this.supervisor = supervisor;
                    }
                  }
                var  KeranjangArray = [];
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct,datakeranjang[j].supervisor));
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }           
                TransaksiArray.push(new Transaksi("FHG",result[i].auth.notelp,result[i].invoiceId,
                KeranjangArray[0].namaproduct,KeranjangArray[0].sku,KeranjangArray[0].jumlahproduct.toString(),
                KeranjangArray[1].namaproduct, KeranjangArray[1].sku,KeranjangArray[1].jumlahproduct.toString(),
                KeranjangArray[2].namaproduct,KeranjangArray[2].sku,KeranjangArray[2].jumlahproduct.toString(),
                KeranjangArray[0].supervisor,
                result[i].customer.nama,result[i].customer.notelp,
                result[i].customer.alamat,result[i].customer.provinsiname,
                result[i].customer.cityname,result[i].customer.districtname,
                result[i].customer.postalcode,result[i].awb,result[i].expedisiName,
                result[i].daexpedisis.totalharga.toString(),result[i].auth.firstname,
                result[i].warehouse.name,
                type,
                result[i].ongkoskirim.toString(),
                result[i].subsidi.toString(),
                result[i].auth.firstname,
                result[i].memotransaksi,
                "aa"));
            }




          // console.log(KeranjangArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Sender",
                "Sender Phone No.",
                "Invoice",
                "Nama Produk 1",
                "SKU 1",
                "Qty 1",
                "Nama Produk 2",
                "SKU 2",
                "Qty 2",
                "Nama Produk 3",
                "SKU 3",
                "Qty 3",
                "Supervisor",
                "Recepient Name",
                "Recipient Phone No",
                "Recipient Address",
                "Recipient Provinsi",
                "Recipient Kabupaten / Kota",
                "Recipient Kecamatan",
                "Recipient Kode POS",   
                "AWB",
                "3PL",
                "Total Harga Pesanan",
                "TAG",
                "Warehouse",
                "Ongkos Pengiriman",
                "TypeBayar",
                "Subsidi Pengiriman",
                "Nama CS",
                "MEMO",
                ""
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

  
    async indexAll(req, res) {
        let invoiceId = req.query.invoiceId
        if( invoiceId == null ){
            invoiceId = ""
        }
        let result = await transaksis.findAll({
            where: {
                [Op.and]: [
                    {
                        invoiceId: {    
                        [Op.like]: '%'+invoiceId+'%'
                    }
                     },
                  ],
                        status: {
                            [Op.or]: [
                                {
                            [Op.like]: '%D%'
                          },
                          {
                            [Op.like]: '%C%'
                          }, {
                            [Op.like]: '%E%'
                          }
                        ]
                     },
              },
              order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['firstname'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                },
            ]
             
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async indexFinanceWeb(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let bank = req.query.bank 

        let searchWords = []
        let search = req.query.search

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                searchWords.push({
                    [Op.or]:[
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        // {
                        //     '$customer.notelp$':{
                        //         [Op.like]: `%${word}%`
                        //     }
                        // },
                        {
                            '$daexpedisis.totalharga$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$daexpedisis.namabank$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$daexpedisis.norekening$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            orderNumber:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        // {
                        //     invoiceId:{
                        //         [Op.like]: `%${word}%`
                        //     }
                        // },
                    ],
                })
            })
        }
        
        const date = new Date();
        let startDate = new Date(0),
            endDate   = new Date(date.setDate(date.getDate() + 1));

        if (req.query.startDate) {
            startDate = Math.floor(new Date(req.query.startDate * 1))
            startDate = new Date(startDate)
        }
        if (req.query.endDate) {
            endDate = Math.floor(new Date(req.query.endDate * 1)) 
            endDate = new Date(endDate) 
        }

        if( bank == null ){
            bank = ""
        }
        const count = await transaksis.count({
            where: {
                createdAt :  {
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                    status: {
                        [Op.or]: [
                        {
                            [Op.like]: '%D%'
                        },
                        // {
                        // [Op.like]: '%C%'
                        // }, 
                        {
                            [Op.like]: '%E%'
                        }
                    ]
                    },
                    '$daexpedisis.namabank$': {
                        [Op.like]: `%${bank}%`
                    },
                    [Op.and]: searchWords
              },
            include: [ 
                { model: daexpedisis,
                    // attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    // attributes: ['firstname', 'notelp'],
                },
                { model: buktibayars,
                    // required: true,
                    // attributes: ['link'],
                },
                { model: customers,
                    // attributes: ['notelp','nama'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['firstname', 'notelp'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['firstname', 'notelp'],
                },
            ]
        })          
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            subQuery:false,
            where: {
                createdAt :  {
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                    status: {
                        [Op.or]: [
                        {
                            [Op.like]: '%D%'
                        },
                        // {
                        // [Op.like]: '%C%'
                        // }, 
                        {
                            [Op.like]: '%E%'
                        }
                    ]
                    },
                    '$daexpedisis.namabank$': {
                        [Op.like]: `%${bank}%`
                    },
                    [Op.and]: searchWords
              },
            order: [
                ['createdAt', 'ASC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim', 'discount', 'memotransaksi', 'tanggalVerifikasi', 'tanggalAWB', 'orderNumber'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['firstname', 'notelp'],
                },
                { model: buktibayars,
                    // required: true,
                    attributes: ['link'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['firstname', 'notelp'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['firstname', 'notelp'],
                },
            ]
             
        }).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async indexFinanceExcel(req, res) {
        let result = await transaksis.findAll({
            where: {
                        status: {
                            [Op.or]: [
                                {
                            [Op.like]: '%D%'
                          },
                          {
                            [Op.like]: '%C%'
                          }, {
                            [Op.like]: '%E%'
                          }
                        ]
                     },
              },
              order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['firstname'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
            ]
             
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    

    async indexLunasRetur(req, res) {
         let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
         let status = req.query.status
         let invoiceId = req.query.invoiceId
         let namabank = req.query.namabank

         let searchWords = []
        let search = req.query.search

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                searchWords.push({
                    [Op.or]:[
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            orderNumber:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            invoiceId:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$daexpedisis.totalharga$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$daexpedisis.namabank$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$daexpedisis.norekening$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$authFinance.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        Sequelize.where(Sequelize.literal("(CASE WHEN `transaksis`.`status` = 'A' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'B' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'B' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'C' THEN 'Menunggu Pembayaran' WHEN `transaksis`.`status` = 'D' THEN 'Verifikasi Finance' WHEN `transaksis`.`status` = 'E' THEN 'Kurang Bayar' WHEN `transaksis`.`status` = 'F' THEN 'Lunas' WHEN `transaksis`.`status` = 'G' THEN 'Siap Kirim' WHEN `transaksis`.`status` = 'H' THEN 'Dikirim' WHEN `transaksis`.`status` = 'I' THEN 'Sukses' WHEN `transaksis`.`status` = 'J' THEN 'Gagal' WHEN `transaksis`.`status` = 'K' THEN 'Return' WHEN `transaksis`.`status` = 'L' THEN 'Cancel' WHEN `transaksis`.`status` = 'M' THEN 'Sudah Bayar' WHEN `transaksis`.`status` = 'N' THEN 'DFOD' WHEN `transaksis`.`status` = 'O' THEN 'Kirim Ulang' END)"),{
                            [Op.like]: `%${word}%`
                        }),
                    ],
                })
            })
        }
         
         const date = new Date();
         let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
             endDate   = new Date(date.setDate(date.getDate() + 1));
 
         if (req.query.startDate) {
             startDate = req.query.startDate+'T00:00:00'
         }
         if (req.query.endDate) {
             endDate = req.query.endDate+'T23:59:59'
         }

        if( invoiceId == null ){
            invoiceId = ""
        }
        if( namabank == null ){
            namabank = ""
        }
        if( status == null ){
            status = ""
        }

        const count = await transaksis.count({
            subQuery:false,
            where:{
                status: {
                    [Op.or]: [
                //         {
                //     [Op.like]: '%F%'
                //   },
                  {
                    [Op.like]: '%G%'
                  },
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                //   {
                //     [Op.like]: '%J%'
                //   },
                  {
                    [Op.like]: '%K%'
                  },
                //   {
                //     [Op.like]: '%L%'
                //   },
                //   {
                //     [Op.like]: '%M'
                //   },
                  {
                    [Op.like]: '%N'
                  },
                ]
             },
             typebayar: 1,
             createdAt :  {
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
             //authId: req.params.userid,
                [Op.and]: [
                    {
                    status: {    
                        [Op.like]: '%'+status+'%'
                    }
                     },
                     {
                        invoiceId: {    
                            [Op.like]: '%'+invoiceId+'%'
                        }
                         },
                    {
                        [Op.and]: searchWords
                    }
                  ],
              },
              include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                    where: {
                        namabank: {
                            [Op.or]: [
                                {
                            [Op.like]: '%'+namabank+'%'
                          },
                        ]
                     },
                    },
                },
                { model: auths,
                    as:'auth',
                    attributes: ['firstname'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['firstname'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['firstname'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                    order:[
                        ['id', 'DESC']
                    ],
                    limit: 1
                },
            ]
       })
        
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            subQuery:false,
            where:{
                status: {
                    [Op.or]: [
                //         {
                //     [Op.like]: '%F%'
                //   },
                  {
                    [Op.like]: '%G%'
                  },
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                //   {
                //     [Op.like]: '%J%'
                //   },
                  {
                    [Op.like]: '%K%'
                  },
                //   {
                //     [Op.like]: '%L%'
                //   },
                //   {
                //     [Op.like]: '%M'
                //   },
                  {
                    [Op.like]: '%N'
                  }
                ]
             },
             typebayar: 1,
             createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
             //authId: req.params.userid,
                [Op.and]: [
                    {
                    status: {    
                        [Op.like]: '%'+status+'%'
                    }
                     },
                     {
                        invoiceId: {    
                            [Op.like]: '%'+invoiceId+'%'
                        }
                    },
                    {
                        [Op.and]: searchWords
                    }
                  ],
              },
              order: [
                ['tanggalVerifikasi', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim', 'updateFinance', 'updatedAt', 'tanggalVerifikasi', 'authIDFinance'],
            include: [ 
                { model: daexpedisis,
                    where: {
                        namabank: {
                            [Op.or]: [
                                {
                            [Op.like]: '%'+namabank+'%'
                          },
                        ]
                     },
                    },
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    as:'auth',
                    attributes: ['firstname'],
                },
                { model: auths,
                    as:'authFinance',
                    attributes: ['firstname'],
                },
                { model: auths,
                    as:'authWarehouse',
                    attributes: ['firstname'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                    order:[
                        ['id', 'DESC']
                    ],
                    limit: 1
                },
            ]
             
        }).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahClosing(req, res) {  
        transaksis.count({ 
            where: {
                [Op.and]: [
                    {
                        status: req.query.status
                     },
                     {
                        authId: req.query.authId
                        },
                  ],
                status: req.query.status
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahPenghasilan(req, res) {
        let result = await keranjangs.sum('price',{ 
            where: {
                authId: req.query.authId
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


   
    async jumlahLead(req, res) {
        let result = await transaksis.count().then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async jumlahOnprogress(req, res) {
        let result = await transaksis.count()({ 
            where: {
                status: {
                  [Op.like]: '%D%'
                }
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahRetur(req, res) {
        let result = await Op.query('Select count(price) as penghasilan,createdAt as created_at from keranjans group by createdAt', 
        { raw: true }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    
    async findAddLog(req, res, next) {
        let transaksi = await transaksis.findByPk(req.params.id);
        if (!transaksi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.transaksi = transaksi;
            next();
        }
    },

    async createBuktibayar(req, res, next) {
        var link = req.files[0].filename
        let result = await buktibayars.create({
            link: "https://storage.googleapis.com/ethos-kreatif-app.appspot.com/"+link,
            transaksisId: req.params.id,
            memoTransfer: req.body.memoTransfer
        }).then(result => {
            let transaksi = transaksis.findOne({
                where: {
                    id:  req.params.id
                },
            }).then(transaksi =>{
                transaksi.status = 'D';
                transaksi.save()
            })
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async findByuser(req, res) {
        let result = await transaksis.findAll({
            where: {
               authId: req.params.userid,
            //    name: req.params.clue,
            },
            attributes: ['id', 'nama','createdAt','pembayaran','status','products'],
            // include: [ 
            //     { model: keranjangs,
            //         where: {
            //             transaksiId:  transaksis.idtransaksi
            //         },
            //         attributes: ['id'],
            //         include: [ 
            //             { model: products,
            //                 attributes: ['name'],
            //             }
            //         ]
            //     }
            // ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async   getDetail(req, res) {
        let result = await transaksis.findOne({
            where: {
                    id: req.params.id,
            },
            //attributes: ['id', 'nama','status','districtId','memotransaksi','idtransaksi','expedisiName'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga', 'subsidicod'],
                },
                { model: customers,
                },
                { model: warehouses,
                    include: [ { model: districts,
                        attributes: ['name']
                    },
                    { model: cityregencies,
                        attributes: ['name']
                    },
                    { model: province,
                        attributes: ['name']
                    }]
                   
                },
                { model: buktibayars,
                    attributes: ['link', 'memoTransfer'],
                },
                { model: auths,
                    as: 'auth',
                    attributes: ['firstname', 'notelp'],
                },
                { model: auths,
                    as: 'authFinance',
                    attributes: ['firstname', 'notelp'],
                },
                { model: auths,
                    as: 'authWarehouse',
                    attributes: ['firstname', 'notelp'],
                },
                
            ]
            
        }).then(result => {

            
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    

    async createdeliveryfods(req, res) { 
        var link = req.files[0].filename
        let result = await deliveryfods.create({
            awbpengembalian: req.body.awbpengembalian,
            expedisipengembalian: req.body.expedisipengembalian,
            awbpengiriman: req.body.awbpengiriman,
            transaksisId: req.params.id,
            authId: req.body.authId,
            expedisipengiriman: req.body.expedisipengiriman,
            typedfod: req.body.typedfod,
            kondisibarang: req.body.kondisibarang,
            biayapengembalian: req.body.biayapengembalian,
            biayapengiriman: req.body.biayapengiriman,
            evidance: "https://storage.googleapis.com/ethos-kreatif-app.appspot.com/"+link,
            keterangan: req.body.keterangan,
            state: req.body.state,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },
      async createretur(req, res) { 
        let result = await returs.create({
            awbpengembalian: req.body.awbpengembalian,
            expedisipengembalian: req.body.expedisipengembalian,
            awbpengiriman: req.body.awbpengiriman,
            transaksisId: req.params.id,
            authId: req.body.authId,
            expedisipengiriman: req.body.expedisipengiriman,
            typedfod: req.body.typedfod,
            kondisibarang: req.body.kondisibarang,
            biayapengembalian: req.body.biayapengembalian,
            biayapengiriman: req.body.biayapengiriman,
            keterangan: req.body.keterangan,
            state: req.body.state,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async filterTransaksi(req, res) {
        let result = await transaksis.findAll({
            where: {
                [Op.or]: [
                    {
                        nama: {
                            [Op.like]: '%'+req.params.clue+'%'
                     }
                    }
                    
                ]
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.transaksi);
    },

    // Update
    // async updatestatus(req, res) {
    //     req.transaksi.name = req.body.name;
    //     req.transaksi.save().then(transaksi => {
    //     return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
    //     })
    // },

    // add log
    async addlogstatus(req, res) {
        req.transaksi.status = req.body.logstatus;
        req.transaksi.sudahbayar = req.body.sudahbayar;
        req.transaksi.updateFinance = req.body.updateFinance;
        req.transaksi.awb = req.body.awb;
        req.transaksi.memoCancel = req.body.memoCancel;
        req.transaksi.authIDFinance = req.body.verificationFinanceId;
        req.transaksi.authIDWarehouse = req.body.verificationWarehouseId;
        req.transaksi.kurangbayar = req.body.kurangbayar;
        req.transaksi.statusbarang = req.body.statusbarang;
        req.transaksi.leadsId = req.body.leadsId;
        req.transaksi.logstatus = req.transaksi.logstatus+"#"+req.body.logstatus;
        if (req.body.verificationFinanceId != null) {
            req.transaksi.tanggalVerifikasi = new Date();
        }
        if (req.body.verificationWarehouseId != null) {
            req.transaksi.tanggalAWB = new Date();
        }
        req.transaksi.save().then(transaksi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
        })
    },

    async uploadBuktibayar(req, res) {
        var link = req.files.buktibayar == null ? null : req.files.buktibayar[0].filename
        req.transaksi.buktibayar =  'images/'+link;
        req.transaksi.invoiceId = req.body.invoiceId;
        req.transaksi.status = 'D';
        req.transaksi.save().then(transaksi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
        })
    },


    // Delete
    async delete(req, res) {
        req.transaksi.destroy().then(transaksi => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

    async importPermintaanPesanan(req, res){
        let error = ''
        let success = ''
        const orders = req.body.data
        console.log(orders);
        console.log(req.body.inputer);

        for (let index = 0; index < orders.length; index++) {
            if (orders[index]['Nama Pelanggan'] === undefined) {
                if (error) {
                    error += ', '
                }
                error += `Nama Pelanggan index ke-${index+1} tidak ada`
                continue
            }
            if (orders[index]['Nama Pelanggan'].length == 0) {
                if (error) {
                    error += ', '
                }
                error += `Nama Pelanggan index ke-${index+1} kosong`
                continue
            }
            if (orders[index].AWB === undefined) {
                if (error) {
                    error += ', '
                }
                error += `AWB index ke-${index+1} tidak ada`
                continue
            }
            if (orders[index].AWB.length > 0) {
                const customer = orders[index]['Nama Pelanggan'].split(',')
                const customerName = customer[0]
                const orderNumber = customer[1]

                transaksis.update(
                    {
                        status: "H", 
                        awb: orders[index].AWB,
                        authIDWarehouse: parseInt(req.body.inputer),
                        tanggalAWB: new Date()
                    },
                    {
                        where: {
                            nama: customerName,
                            orderNumber: orderNumber
                        }
                    }
                )
                if (success) {
                    success += ', '
                }
                success += `AWB dan Status dari Nama Pelanggan index ke-${index+1} berhasil diubah`
            }
        }
        console.log('Success:', success);
        console.log('Error:',error);
        return apiResponse.successResponseWithData(res, "SUCCESS", success);
    },

    async getidInvoice(req, res) {
        let result = await transaksis.count().then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result+1);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async dashboardGudang(req, res) {
        const tempDate = new Date()
        let date = tempDate.toISOString().split('T')[0]

        if (req.query.date != null) {
            date = req.query.date
        }

        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.like]: '%'+date+'%'
                },
            },
            attributes: [
                'status',
                [Sequelize.literal(`
                    CASE WHEN status = 'A' THEN 'Temp Transaksi'
                    WHEN status = 'B' THEN 'New Transaksi'
                    WHEN status = 'C' THEN 'Menunggu Pembayaran'
                    WHEN status = 'D' THEN 'Verifikasi Finance'
                    WHEN status = 'E' THEN 'Kurang Bayar'
                    WHEN status = 'F' THEN 'Lunas'
                    WHEN status = 'G' THEN 'Siap Kirim'
                    WHEN status = 'H' THEN 'Dikirim'
                    WHEN status = 'I' THEN 'Sukses'
                    WHEN status = 'J' THEN 'Gagal'
                    WHEN status = 'K' THEN 'Return'
                    WHEN status = 'L' THEN 'Cancel'
                    WHEN status = 'M' THEN 'Sudah Bayar'
                    END
                `), 'nama_status'],
                [Sequelize.literal('COUNT(status)'), 'jumlah'],
                // 'createdAt'
            ],
            group: ['status'],
            order: ['status'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        })
    },

    async daftarTransaksi(req, res) {
        let warehouseId = req.query.warehouseId
        let expedition = req.query.expedition
        let paymentMethod = req.query.paymentMethod
        let transactionStatus = req.query.transactionStatus

        let searchWords = []
        let search = req.query.search

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                searchWords.push({
                    [Op.or]:[
                        {
                            orderNumber:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            invoiceId:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            awb:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            expedisiName:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$warehouse.name$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$metodepembayaran.nama$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        Sequelize.where(Sequelize.literal("(CASE WHEN `transaksis`.`status` = 'A' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'B' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'B' THEN 'New Transaksi' WHEN `transaksis`.`status` = 'C' THEN 'Menunggu Pembayaran' WHEN `transaksis`.`status` = 'D' THEN 'Verifikasi Finance' WHEN `transaksis`.`status` = 'E' THEN 'Kurang Bayar' WHEN `transaksis`.`status` = 'F' THEN 'Lunas' WHEN `transaksis`.`status` = 'G' THEN 'Siap Kirim' WHEN `transaksis`.`status` = 'H' THEN 'Dikirim' WHEN `transaksis`.`status` = 'I' THEN 'Sukses' WHEN `transaksis`.`status` = 'J' THEN 'Gagal' WHEN `transaksis`.`status` = 'K' THEN 'Return' WHEN `transaksis`.`status` = 'L' THEN 'Cancel' WHEN `transaksis`.`status` = 'M' THEN 'Sudah Bayar' WHEN `transaksis`.`status` = 'N' THEN 'DFOD' WHEN `transaksis`.`status` = 'O' THEN 'Kirim Ulang' END)"),{
                            [Op.like]: `%${word}%`
                        }),
                    ],
                })
            })
        }

        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        if( search == null ){
            search = ""
        }
        if( warehouseId == null ){
            warehouseId = ""
        }
        if( expedition == null ){
            expedition = ""
        }
        if( paymentMethod == null ){
            paymentMethod = ""
        }
        if( transactionStatus == null ){
            transactionStatus = ""
        }
        // if( paymentStatus == null ){
        //     paymentStatus = ""
        // }

        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await transaksis.count(
            { 
                where: {
                    warehouseId: {
                        [Op.like]: '%'+warehouseId+'%'
                    },
                    createdAt: {
                        [Op.and]: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    },
                    expedisiName: {
                        [Op.like]: '%'+expedition+'%'
                    },
                    typebayar: {
                        [Op.like]: '%'+paymentMethod+'%'
                    },
                    // pembayaran: {
                    //     [Op.like]: '%'+paymentStatus+'%'
                    // },
                    status: {
                        [Op.and]:[
                            {[Op.like]: '%'+transactionStatus+'%'},
                            {
                                [Op.or]: [
                                    {
                                        [Op.like]: '%L%'
                                    },
                                    {
                                        [Op.like]: '%G%'
                                    },
                                    {
                                        [Op.like]: '%H%'
                                    },
                                    {
                                        [Op.like]: '%I%'
                                    },
                                    {
                                        [Op.like]: '%K%'
                                    },
                                    {
                                        [Op.like]: '%N%'
                                    },
                                ]
                            }
                        ]
                    },
                    [Op.and]: searchWords
                },
                include: [ 
                    { model: warehouses,
                        attributes: ['name'],
                    }, { model: customers,
                        attributes: ['notelp'],
                    },
                    { model: daexpedisis,
                        attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                    },
                    { model: auths,
                        as:'auth',
                        attributes: ['notelp','firstname'],
                    },
                    { model: metodepembayarans,
                        attributes: ['nama'],
                    },
                ]
            },
            
        )
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                createdAt: {
                    [Op.and]: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                expedisiName: {
                    [Op.like]: '%'+expedition+'%'
                },
                typebayar: {
                    [Op.like]: '%'+paymentMethod+'%'
                },
                // pembayaran: {
                //     [Op.like]: '%'+paymentStatus+'%'
                // },
                status: {
                    [Op.and]:[
                        {[Op.like]: '%'+transactionStatus+'%'},
                        {
                            [Op.or]: [
                                {
                                    [Op.like]: '%L%'
                                },
                                {
                                    [Op.like]: '%G%'
                                },
                                {
                                    [Op.like]: '%H%'
                                },
                                {
                                    [Op.like]: '%I%'
                                },
                                {
                                    [Op.like]: '%K%'
                                },
                                {
                                    [Op.like]: '%N%'
                                },
                            ]
                        }
                    ]
                },
                [Op.and]: searchWords,
              },
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: warehouses,
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            },
                            { model: daexpedisis,
                                attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname'],
                            },
                            { model: metodepembayarans,
                                attributes: ['nama'],
                            },
            ]
        }).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelRiwayatAll(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        // let typebayar = req.query.typebayar
        // if(isNaN(parseFloat(typebayar))){
        //     typebayar = ""
        // }

        // let expedisiName = req.query.expedisiName
        // if( expedisiName == null ){
        //     expedisiName = ""
        // }

        // let warehouseId = req.query.warehouseId
        // if( warehouseId == null ){
        //     warehouseId = ""
        // }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                  status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%H%'
                        },
                        {
                            [Op.like]: '%N%'
                        }, 
                        {
                            [Op.like]: '%I%'
                        }
                    ]
                  },
                // [Op.and]: {
                // warehouseId: {
                //     [Op.like]: '%'+warehouseId+'%'
                // },
                // typebayar: {
                //     [Op.like]: '%'+typebayar+'%'
                // },
                // expedisiName: {
                //     [Op.like]: '%'+expedisiName+'%'
                // },
                // status: {
                //     [Op.or]: [
                //         {
                //     [Op.like]: '%D%'
                //   },
                //   {
                //     [Op.like]: '%C%'
                //   }, {
                //     [Op.like]: '%E%'
                //   }
                // ]
                //   },
                // }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi', 'orderNumber'],
              order: [
                ['id', 'DESC'],
            ],
            include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening'],
                            },
            ]
        }).then(result => {
        //    console.log(result)
            class Transaksi {
                constructor(orderNumber, Invoice,part1,qty1,RecepientName,RecepientNo,RecepientAdress,memo,awb,expedisi,ongkos,tag,warehousename,typebayar,ongkir,subsidi,gudangAlamat,namacs,gudangPost,aa) {
                  this.orderNumber = orderNumber;
                  this.Invoice = Invoice;
                  this.part1 = part1;
                  this.qty1 = qty1;
                  this.RecepientName = RecepientName;
                  this.RecepientNo = RecepientNo;
                  this.RecepientAdress = RecepientAdress;
                  this.memo = memo;
                  this.awb = awb;
                  this.expedisi = expedisi;
                  this.ongkos = ongkos;
                  this.tag = tag;
                  this.warehousename = warehousename;
                  this.typebayar = typebayar;
                  this.ongkir = ongkir;
                  this.subsidi = subsidi;
                  this.namacs = namacs;
                  this.gudangAlamat = gudangAlamat;
                  this.gudangPost = gudangPost;
                  this.aa = aa;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct,supervisor,advertiser,domain,hpp) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                      this.supervisor = supervisor;
                      this.advertiser = advertiser;
                      this.domain = domain;
                      this.hpp = hpp;
                    }
                  }
                var  KeranjangArray = [];
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        KeranjangArray.push(new Keranjang(
                            datakeranjang[j].namaproduct,
                            datakeranjang[j].sku,
                            datakeranjang[j].jumlahproduct
                            
                            ));
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }           
                TransaksiArray.push(new Transaksi(
                result[i].orderNumber,
                result[i].invoiceId,
                KeranjangArray[0].namaproduct,KeranjangArray[0].sku,KeranjangArray[0].jumlahproduct.toString(),
               
                result[i].customer.nama,
                result[i].customer.notelp,
                result[i].customer.alamat,
                result[i].awb,
                result[i].expedisiName,
                (result[i].daexpedisis == null? '' : result[i].daexpedisis.totalharga.toString()),
                result[i].auth.firstname,
                result[i].warehouse.name,
                type,
                result[i].ongkoskirim.toString(),
                result[i].subsidi.toString(),
                result[i].auth.firstname,
                result[i].memotransaksi,
                "aa"));
            }
        //   console.log(TransaksiArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Order Number",
                "Invoice",
                "Nama Produk 1",
                "SKU 1",
                "Qty 1",
                "Recepient Name",
                "Recipient Phone No",
                "Recipient Address",
                "AWB",
                "3PL",
                "Total Harga Pesanan",
                "TAG",
                "Warehouse",
                "Ongkos Pengiriman",
                "TypeBayar",
                "Subsidi Pengiriman",
                "Nama CS",
                "Memo",
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    console.log('columnName: '+columnName);
                    console.log('columnIndex: '+columnIndex);
                    console.log('rowIndex: '+rowIndex);
                    console.log('record [columnName]: '+record [columnName]);
                    console.log('==========================================');
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelVerifikasiPembayaran(req, res) {
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        // let typebayar = req.query.typebayar
        // if(isNaN(parseFloat(typebayar))){
        //     typebayar = ""
        // }

        let bank = req.query.bank
        if( bank == null ){
            bank = ""
        }

        // let warehouseId = req.query.warehouseId
        // if( warehouseId == null ){
        //     warehouseId = ""
        // }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                  status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%D%'
                        },
                        // {
                        //     [Op.like]: '%C%'
                        // }, 
                        {
                            [Op.like]: '%E%'
                        }
                    ]
                },
                '$daexpedisis.namabank$': {
                    [Op.like]: `%${bank}%`
                },
              },
              attributes: ['id', 'invoiceId','awb','ongkoskirim','subsidi', 'discount', 'products','expedisiName','typebayar','memotransaksi', 'expedisiName', 'status', 'createdAt', 'updateFinance'],
              order: [
                ['id', 'DESC'],
            ],
            include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname'], [Sequelize.literal('`auth->mapgroups->group`.`internal`'), 'groupinternal']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                                where:{
                                                    internal: 1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening', 'biayatambahan', 'biayacod'],
                            },
            ]
        }).then(result => {
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        //    console.log(result)
            class Transaksi {
                constructor(
                    warehousename,
                    typebayar,
                    Invoice,
                    groupInternal,
                    awb,
                    date,
                    RecepientName, 
                    RecepientNo,
                    RecepientAdress,
                    namabank,
                    norekening,
                    expedisiName,
                    expedisiPackage,
                    products,
                    ongkir,
                    subsidi,
                    discount,
                    biayatambahan,
                    biayacod,
                    kodeunik,
                    totalHarga,
                    memo,
                    verifikator,
                    namacs,
                    namaadv,
                    namagrup,
                    namaja,
                    statustranksasi
                ) {
                    this.warehousename = warehousename;
                    this.typebayar = typebayar;
                    this.Invoice = Invoice;
                    this.groupInternal = groupInternal;
                    this.awb = awb;
                    this.date = date;
                    this.RecepientName = RecepientName;
                    this.RecepientNo = RecepientNo;
                    this.RecepientAdress = RecepientAdress;
                    this.namabank = namabank;
                    this.norekening = norekening;
                    this.expedisiName = expedisiName;
                    this.expedisiPackage = expedisiPackage;
                    this.products = products;
                    this.ongkir = ongkir;
                    this.subsidi = subsidi;
                    this.discount = discount;
                    this.biayatambahan = biayatambahan;
                    this.biayacod = biayacod;
                    this.kodeunik = kodeunik;
                    this.totalHarga = totalHarga;
                    this.memo = memo;
                    this.verifikator = verifikator;
                    this.namacs = namacs;
                    this.namaadv = namaadv;
                    this.namagrup = namagrup;
                    this.namaja = namaja;
                    this.statustranksasi = statustranksasi;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                let products = ''
                let adv = '-'
                for(var j=0;j<datakeranjang.length;j++){
                    if (products != '') {
                        products += ', '
                    }
                    products += datakeranjang[j].sku+'-'+datakeranjang[j].jumlahproduct

                    if (datakeranjang[j].advertiser != '' && adv == '-') {
                        adv = datakeranjang[j].advertiser
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }
                
                let statustranksasi
                if (result[i].status == 'D') {
                    statustranksasi = 'Verifikasi Finance'
                }
                else if (result[i].status == 'E') {
                    statustranksasi = 'Kurang Bayar'
                }

                let phoneNumber = result[i].customer.notelp
                if (phoneNumber[0] == '0') {
                    phoneNumber = '+62'+phoneNumber.substring(1)
                }else if (phoneNumber[0] != 6 && phoneNumber[0] != '+') {
                    phoneNumber = '+62' + phoneNumber
                }

                const expedition = result[i].expedisiName.split('(')

                const expeditionName = expedition[0]
                let expeditionPackage = '-'
                if (expedition[1] !== undefined) {
                expeditionPackage = expedition[1].replace(')', '')
                }

                const auth = JSON.parse(JSON.stringify(result[i].auth))
                const date = new Date(result[i].createdAt)

                let groupInternal = 'Partner'
                if (auth.groupinternal == 1) {
                    groupInternal = 'Ethos'
                }

                TransaksiArray.push(new Transaksi(
                    result[i].warehouse.name,
                    type,
                    result[i].invoiceId,
                    groupInternal,
                    result[i].awb,
                    [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'),
                    result[i].customer.nama,
                    phoneNumber,
                    result[i].customer.alamat,
                    result[i].daexpedisis.namabank,
                    result[i].daexpedisis.norekening,
                    expeditionName,
                    expeditionPackage,
                    products,
                    result[i].ongkoskirim.toString(),
                    result[i].subsidi.toString(),
                    result[i].discount.toString(),
                    result[i].daexpedisis.biayatambahan.toString(),
                    result[i].daexpedisis.biayacod == null ? '' : result[i].daexpedisis.biayacod.toString(),
                    (result[i].id%999).toString(),
                    result[i].daexpedisis.totalharga.toString(),
                    result[i].memotransaksi,
                    result[i].updateFinance,
                    result[i].auth.firstname,
                    adv,
                    auth.groupname,
                    auth.groupname,
                    statustranksasi     
                ));
            }
        //   console.log(TransaksiArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Gudang",
                "Metode Pembayaran",
                "Nomor Invoice",
                "Group",
                "Nomor AWB",
                "Tanggal & Jam",
                "Nama Pelanggan",
                "Nomor HP Pelanggan",
                "Alamat Pelanggan",
                "Bank",
                "Nomor Rekening",
                "Ekspedisi",
                "Paket Ekspedisi",
                "Produk",
                "Ongkos Kirim",
                "Subsidi Ongkos Kirim",
                "Diskon Transaksi",
                "Biaya Tambahan",
                "Admin COD",
                "Kode Unik",
                "Total Harga Pesanan",
                "Memo Transaksi",
                "Verifikator",
                "Nama CS",
                "Nama ADV",
                "Nama Grup",
                "Nama JA",
                "Status Transaksi",
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    console.log('columnName: '+columnName);
                    console.log('columnIndex: '+columnIndex);
                    console.log('rowIndex: '+rowIndex);
                    console.log('record [columnName]: '+record [columnName]);
                    console.log('==========================================');
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelLabel(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%H%'
                        },
                        {
                            [Op.like]: '%N%'
                        },
                        {
                            [Op.like]: '%I%'
                        },
                    ]
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi', 'idtransaksi', 'createdAt', 'orderNumber'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
            //  console.log(result)
              class Transaksi {
                  constructor(
                      Sender,
                      SenderPhone,
                      warehouseName,
                      date,
                      orderNumber,
                      Invoice,
                      RecepientName,
                      RecepientPhone,
                      ReceipentAddress,
                      awb,
                      expedition,
                      typebayar,
                      totalHarga,
                      ReceipentProvince,
                      ReceipentCity,
                      ReceipentDistrict,
                      notes,
                      packingKayu,
                      memo,
                      tag,
                      namagrup,
                      products,
                  ) {
                    this.Sender = Sender; 
                    this.SenderPhone = SenderPhone; 
                    this.warehouseName = warehouseName; 
                    this.date = date; 
                    this.orderNumber = orderNumber; 
                    this.Invoice = Invoice;
                    this.RecepientName = RecepientName;
                    this.RecepientPhone = RecepientPhone;
                    this.ReceipentAddress = ReceipentAddress;
                    this.awb = awb;
                    this.expedition = expedition;
                    this.typebayar = typebayar;
                    this.totalHarga = totalHarga;
                    this.ReceipentProvince = ReceipentProvince;
                    this.ReceipentCity = ReceipentCity;
                    this.ReceipentDistrict = ReceipentDistrict;
                    this.notes = notes;
                    this.packingKayu = packingKayu;
                    this.memo = memo;
                    this.tag = tag;
                    this.namagrup = namagrup;
                    this.products = products;
                  }
                }
              var  TransaksiArray = [];
            
              for(var i=0;i<result.length;i++){
                //   class Keranjang {
                //       constructor(namaproduct,sku,jumlahproduct,weight) {
                //         this.namaproduct = namaproduct;
                //         this.sku = sku;
                //         this.jumlahproduct = jumlahproduct;
                //         this.weight = weight;
                //       }
                //     }
                //   var  KeranjangArray = [];
                  let keranjangdata =  result[i].products.replace(/\\n/g, '')
                  let datakeranjang = eval(keranjangdata)
                  let products = '';
                  let productsSpace = '';
                  let productNotes = '';
                  let adv = '-'
                  let spv = '-'

                  for(var j=0;j<datakeranjang.length;j++){
                    //   if(datakeranjang[j] === undefined){
                    //       KeranjangArray.push(new Keranjang("","","",""));
                    //   }else{
                    //       KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct,datakeranjang[j].weight));
                    //   }
                    if (products != '') {
                        products += ', '
                    }
                     products += datakeranjang[j].sku+'-'+datakeranjang[j].jumlahproduct

                    if (productsSpace != '') {
                        productsSpace += ' '
                    }
                     productsSpace += datakeranjang[j].sku+'          '+datakeranjang[j].jumlahproduct
                    
                    if (productNotes != '') {
                        productNotes += ', '
                    }
                     productNotes += datakeranjang[j].namaproduct+' '+datakeranjang[j].jumlahproduct

                    if (datakeranjang[j].advertiser != '' && adv == '-') {
                        adv = datakeranjang[j].advertiser
                    }

                    if (datakeranjang[j].supervisor != '' && spv == '-') {
                        spv = datakeranjang[j].supervisor
                    }
                  }    

                  if(result[i].typebayar == 1){
                    var type = "Transfer"
                  }else{
                    var type = "COD"
                  }
                  const memo = result[i].memotransaksi.toUpperCase()
                  let packingKayu = 'false'

                  if (memo.includes('PACKING KAYU') && memo.includes('TIDAK PERLU PACKING KAYU') == false) {
                      packingKayu = 'true'
                  }

                  const auth = JSON.parse(JSON.stringify(result[i].auth))
                  const date = new Date(result[i].createdAt)

                  TransaksiArray.push(new Transaksi(
                      "FHG", 
                      result[i].auth.notelp, 
                      result[i].warehouse.name, 
                      [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'), 
                      result[i].orderNumber, 
                      result[i].invoiceId, 
                      result[i].customer.nama, 
                      result[i].customer.notelp, 
                      result[i].customer.alamat, 
                      result[i].awb, 
                      result[i].expedisiName, 
                      type, 
                      result[i].daexpedisis == null? '0' : result[i].daexpedisis.totalharga.toString(), 
                      result[i].customer.provinsiname, 
                      result[i].customer.cityname, 
                      result[i].customer.districtname,
                      productNotes, 
                      packingKayu, 
                      result[i].memotransaksi, 
                      result[i].auth.firstname + ' | ' + result[i].expedisiName + ' | ' + type + ' | ' + adv + ' | ' + spv, 
                      auth.groupname, 
                      productsSpace
                  ));
              }
            // console.log(KeranjangArray)
              const wb = new xl.Workbook();
              const ws = wb.addWorksheet('Data Transaksi');
              const headingColumnNames = [
                  "Sender",
                  "Sender Phone No.",
                  "Warehouse",
                  "Tanggal & Jam",
                  "Order Number",
                  "Invoice",
                  "Recipient Name",
                  "Recipient Phone No",
                  "Recipient Address",
                  "AWB",
                  "3PL",
                  "Metode Pembayaran",
                  "Total Harga Pesanan",
                  "Provinsi",
                  "Kabupaten / Kota",
                  "Kecamatan",
                  "Notes",
                  "Packing Kayu",
                  "Memo Transaksi",
                  "Tag",
                  "NamaGroup",
                  "Product1",
              ]
              let headingColumnIndex = 1;
              headingColumnNames.forEach(heading => {
                  ws.cell(1, headingColumnIndex++)
                      .string(heading)
              });
              let rowIndex = 2;
              TransaksiArray.forEach( record => {
                  let columnIndex = 1;
                  Object.keys(record ).forEach(columnName =>{
                    //   console.log('record: '+record);
                    //   console.log('columnName: '+columnName);
                    //   console.log('columnIndex: '+columnIndex);
                    //   console.log('rowIndex: '+rowIndex);
                    //   console.log('record [columnName]: '+record [columnName]);
                    //   console.log('==========================================');
                      ws.cell(rowIndex,columnIndex++)
                          .string(record [columnName])
                  });
                  rowIndex++;
              }); 
              var filename = +Date.now()+'-transaksidata.xlsx'
              returnData = {
                  metadata: {
                      link: filename,
                  }
              }
              if (TransaksiArray.length == 0) {
                return apiResponse.successResponseWithData(res, "Error", {message: 'Tidak ada data'});
              }
              wb.write(filename,res);
              //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
              //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
             //return apiResponse.successResponseWithData(res, "SUCCESS", result);
              }).catch(function (err){
                  console.log(err);
                  return apiResponse.ErrorResponse(res, err);
              });
    },

    async ExcelShipper(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%H%'
                        },
                        {
                            [Op.like]: '%N%'
                        },
                        {
                            [Op.like]: '%I%'
                        },
                    ]
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi', 'idtransaksi', 'createdAt'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
            //  console.log(result)
              class Transaksi {
                  constructor(
                      tenantCode,
                      invoiceNo,
                      soNumber,
                      soQuantity,
                      partNo,
                      uom,
                      uomQuantity,
                      customerName,
                      customerPhoneNo,
                      customerAddress,
                      zip,
                      expDate,
                      awb,
                      courier,
                      notes,
                      tag,
                  ) {
                    this.tenantCode = tenantCode; 
                    this.invoiceNo = invoiceNo; 
                    this.soNumber = soNumber; 
                    this.soQuantity = soQuantity; 
                    this.partNo = partNo;
                    this.uom = uom;
                    this.uomQuantity = uomQuantity;
                    this.customerName = customerName;
                    this.customerPhoneNo = customerPhoneNo;
                    this.customerAddress = customerAddress;
                    this.zip = zip;
                    this.expDate = expDate;
                    this.awb = awb;
                    this.courier = courier;
                    this.notes = notes;
                    this.tag = tag;
                  }
                }
              var  TransaksiArray = [];
            
              for(var i=0;i<result.length;i++){
                  let keranjangdata =  result[i].products.replace(/\\n/g, '')
                  let datakeranjang = eval(keranjangdata)
                  let tag = '-'

                  if (warehouseId == 3) {
                      tag = 'Shipper|Kapuk'
                  }
                  else if (warehouseId == 4) {
                      tag = 'Shipper|Tandes'
                  }

                  const expedition = result[i].expedisiName.split('(')

                  const expeditionName = expedition[0]
                  let expeditionPackage = '-'
                  if (expedition[1] !== undefined) {
                    expeditionPackage = expedition[1].replace(')', '')
                  }
                  
                  for(var j=0;j<datakeranjang.length;j++){
                    TransaksiArray.push(new Transaksi(
                        "FHG", 
                        result[i].invoiceId,
                        result[i].invoiceId,
                        datakeranjang[j].jumlahproduct.toString(), 
                        datakeranjang[j].sku, 
                        'EA', 
                        '1', 
                        result[i].customer.nama,  
                        result[i].customer.notelp, 
                        result[i].customer.alamat, 
                        '',
                        '',
                        result[i].awb, 
                        expeditionName, 
                        'HUBUNGI PENERIMA', 
                        tag
                    ));
                  }     
              }
            // console.log(KeranjangArray)
              const wb = new xl.Workbook();
              const ws = wb.addWorksheet('Data Transaksi');
              const headingColumnNames = [
                  "TenantCode",
                  "InvoiceNo",
                  "SONumber",
                  "SOQuantity",
                  "PartNo",
                  "UoM",
                  "UoMQuantity",
                  "CustomerName",
                  "CustomerPhoneno",
                  "CustomerAddress",
                  "Zip",
                  "ExpDate",
                  "AWBNo",
                  "Courier",
                  "Notes",
                  "TAG",
              ]
              let headingColumnIndex = 1;
              headingColumnNames.forEach(heading => {
                  ws.cell(1, headingColumnIndex++)
                      .string(heading)
              });
              let rowIndex = 2;
              TransaksiArray.forEach( record => {
                  let columnIndex = 1;
                  Object.keys(record ).forEach(columnName =>{
                    //   console.log('record: '+record);
                    //   console.log('columnName: '+columnName);
                    //   console.log('columnIndex: '+columnIndex);
                    //   console.log('rowIndex: '+rowIndex);
                    //   console.log('record [columnName]: '+record [columnName]);
                    //   console.log('==========================================');
                      ws.cell(rowIndex,columnIndex++)
                          .string(record [columnName])
                  });
                  rowIndex++;
              }); 
              var filename = +Date.now()+'-transaksidata.xlsx'
              returnData = {
                  metadata: {
                      link: filename,
                  }
              }
              wb.write(filename,res);
              //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
              //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
             //return apiResponse.successResponseWithData(res, "SUCCESS", result);
              }).catch(function (err){
                  console.log(err);
                  return apiResponse.ErrorResponse(res, err);
              });
    },

    async ExcelPermintaanPesanan(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.like]: '%G%'
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar','memotransaksi', 'idtransaksi', 'createdAt', 'orderNumber'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname'], [Sequelize.literal('`auth->mapgroups->group`.`internal`'), 'groupinternal']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
            //  console.log(result)
              class Transaksi {
                  constructor(
                      datetime,
                      paymentMethod,
                      warehouseName,
                      expedition,
                      expeditionPackage,
                      group,
                      orderNumber,
                      customerName,
                      customerPhoneNo,
                      customerAddress,
                      ReceipentProvince,
                      ReceipentCity,
                      ReceipentDistrict,
                      memo,
                      weightTotal,
                      quatityTotal,
                      products,
                      totalHarga,
                      ongkoskirim,
                      subsidi,
                      packingKayu
                  ) {
                    this.datetime = datetime; 
                    this.paymentMethod = paymentMethod; 
                    this.warehouseName = warehouseName; 
                    this.expedition = expedition; 
                    this.expeditionPackage = expeditionPackage;
                    this.group = group;
                    this.orderNumber = orderNumber;
                    this.customerName = customerName;
                    this.customerPhoneNo = customerPhoneNo;
                    this.customerAddress = customerAddress;
                    this.ReceipentProvince = ReceipentProvince;
                    this.ReceipentCity = ReceipentCity;
                    this.ReceipentDistrict = ReceipentDistrict;
                    this.memo = memo;
                    this.weightTotal = weightTotal;
                    this.quatityTotal = quatityTotal;
                    this.products = products;
                    this.totalHarga = totalHarga;
                    this.ongkoskirim = ongkoskirim;
                    this.subsidi = subsidi;
                    this.packingKayu = packingKayu;
                  }
                }
              var  TransaksiArray = [];
            
              for(var i=0;i<result.length;i++){
                //   class Keranjang {
                //       constructor(namaproduct,sku,jumlahproduct,weight) {
                //         this.namaproduct = namaproduct;
                //         this.sku = sku;
                //         this.jumlahproduct = jumlahproduct;
                //         this.weight = weight;
                //       }
                //     }
                //   var  KeranjangArray = [];
                  let keranjangdata =  result[i].products.replace(/\\n/g, '')
                  let datakeranjang = eval(keranjangdata)
                  let products = '';
                  let productNotes = '';
                  let adv = '-'
                  let weightTotal = 0
                  let quantityTotal = 0
                  let spv = '-'

                  for(var j=0;j<datakeranjang.length;j++){
                    if (products != '') {
                        products += ', '
                    }
                     products += datakeranjang[j].sku+'-'+datakeranjang[j].jumlahproduct
                    
                    if (productNotes != '') {
                        productNotes += ', '
                    }
                     productNotes += datakeranjang[j].namaproduct+' '+datakeranjang[j].jumlahproduct

                    if (datakeranjang[j].advertiser != '' && adv == '-') {
                        adv = datakeranjang[j].advertiser
                    }

                    if (datakeranjang[j].supervisor != '' && spv == '-') {
                        spv = datakeranjang[j].supervisor
                    }

                    weightTotal += (datakeranjang[j].jumlahproduct*datakeranjang[j].weight)
                    quantityTotal += datakeranjang[j].jumlahproduct
                  }    

                  if(result[i].typebayar == 1){
                    var type = "Transfer"
                  }else{
                    var type = "COD"
                  }
                  const memo = result[i].memotransaksi.toUpperCase()
                  const expedition = result[i].expedisiName.split('(')

                  const expeditionName = expedition[0]
                  let expeditionPackage = '-'
                  if (expedition[1] !== undefined) {
                    expeditionPackage = expedition[1].replace(')', '')
                  }

                  const auth = JSON.parse(JSON.stringify(result[i].auth))
                  const date = new Date(result[i].createdAt)

                  let groupInternal = 'Partner'
                  if (auth.groupinternal == 1) {
                      groupInternal = 'Ethos'
                  }

                let phoneNumber = result[i].customer.notelp
                if (phoneNumber[0] == '0') {
                    phoneNumber = '+62'+phoneNumber.substring(1)
                }else if (phoneNumber[0] != 6 && phoneNumber[0] != '+') {
                    phoneNumber = '+62' + phoneNumber
                }

                  let packingKayu = 'false'

                  if (memo.includes('PACKING KAYU') && memo.includes('TIDAK PERLU PACKING KAYU') == false) {
                      packingKayu = 'true'
                  }

                  TransaksiArray.push(new Transaksi(
                    [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'), 
                      type, 
                      result[i].warehouse.name,
                      expeditionName, 
                      expeditionPackage, 
                      auth.groupname,
                      result[i].orderNumber,
                      result[i].customer.nama+','+result[i].orderNumber, 
                      phoneNumber, 
                      result[i].customer.alamat, 
                      result[i].customer.provinsiname, 
                      result[i].customer.cityname, 
                      result[i].customer.districtname,
                      result[i].memotransaksi + '|' + products + '|' + auth.firstname + '|' + type + '|' + adv + '|' + spv + '|' + auth.groupname, 
                      (weightTotal/1000).toString(),
                      quantityTotal.toString(),
                      productNotes, 
                      result[i].daexpedisis.totalharga.toString(),
                      result[i].ongkoskirim.toString(),
                      result[i].subsidi.toString(),
                      packingKayu
                  ));
              }
            // console.log(KeranjangArray)
            // return 0
              const wb = new xl.Workbook();
              const ws = wb.addWorksheet('Data Transaksi');
              const headingColumnNames = [
                  "Tanggal & jam Transaksi",
                  "Metode Pembayaran",
                  "Gudang",
                  "Ekspedisi",
                  "Paket Ekspedisi",
                  "Nama Group",
                  "Order Number",
                  "Nama Pelanggan",
                  "Nomor Telephone Pelanggan",
                  "Alamat Pelanggan",
                  "Provinsi",
                  "Kabupaten / Kota",
                  "Kecamatan",
                  "Memo Transaksi",
                  "Total Berat (Kg)",
                  "Jumlah Barang (Qty)",
                  "Produk",
                  "Harga Total Pemesanan",
                  "Ongkos Kirim",
                  "Subsidi Ongkos Kirim",
                  "Packing Kayu"
              ]
              let headingColumnIndex = 1;
              headingColumnNames.forEach(heading => {
                  ws.cell(1, headingColumnIndex++)
                      .string(heading)
              });
              let rowIndex = 2;
              TransaksiArray.forEach( record => {
                  let columnIndex = 1;
                  Object.keys(record ).forEach(columnName =>{
                    //   console.log('record: '+record);
                    //   console.log('columnName: '+columnName);
                    //   console.log('columnIndex: '+columnIndex);
                    //   console.log('rowIndex: '+rowIndex);
                    //   console.log('record [columnName]: '+record [columnName]);
                    //   console.log('==========================================');
                      ws.cell(rowIndex,columnIndex++)
                          .string(record [columnName])
                  });
                  rowIndex++;
              }); 
              var filename = +Date.now()+'-transaksidata.xlsx'
              returnData = {
                  metadata: {
                      link: filename,
                  }
              }
              wb.write(filename,res);
              //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
              //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
             //return apiResponse.successResponseWithData(res, "SUCCESS", result);
              }).catch(function (err){
                  console.log(err);
                  return apiResponse.ErrorResponse(res, err);
              });
    },

    async ExcelRequestKonfirmasiDFOD(req, res) {
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        // let typebayar = req.query.typebayar
        // if(isNaN(parseFloat(typebayar))){
        //     typebayar = ""
        // }

        let bank = req.query.bank
        if( bank == null ){
            bank = ""
        }

        // let warehouseId = req.query.warehouseId
        // if( warehouseId == null ){
        //     warehouseId = ""
        // }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                  status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%N%'
                        },
                        // {
                        //     [Op.like]: '%C%'
                        // }, 
                        // {
                        //     [Op.like]: '%E%'
                        // }
                    ]
                },
                '$daexpedisis.namabank$': {
                    [Op.like]: `%${bank}%`
                },
              },
              attributes: ['id', 'invoiceId','awb','ongkoskirim','subsidi', 'discount', 'products','expedisiName','typebayar','memotransaksi', 'expedisiName', 'status', 'createdAt', 'updateFinance', 'orderNumber'],
              order: [
                ['id', 'DESC'],
            ],
            include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname'], [Sequelize.literal('`auth->mapgroups->group`.`internal`'), 'groupinternal']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                                where:{
                                                    internal: 1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening', 'biayatambahan', 'biayacod'],
                            },
                            { model: auths,
                                as:'authFinance',
                                attributes: ['notelp','firstname'],
                            },
            ]
        }).then(result => {
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        //    console.log(result)
            class Transaksi {
                constructor(
                    warehousename,
                    typebayar,
                    orderNumber,
                    Invoice,
                    groupInternal,
                    awb,
                    date,
                    RecepientName, 
                    RecepientNo,
                    RecepientAdress,
                    namabank,
                    norekening,
                    expedisiName,
                    expedisiPackage,
                    products,
                    ongkir,
                    subsidi,
                    discount,
                    biayatambahan,
                    biayacod,
                    kodeunik,
                    totalHarga,
                    memo,
                    verifikator,
                    namacs,
                    namaadv,
                    namagrup,
                    namaja,
                    statustranksasi
                ) {
                    this.warehousename = warehousename;
                    this.typebayar = typebayar;
                    this.orderNumber = orderNumber;
                    this.Invoice = Invoice;
                    this.groupInternal = groupInternal;
                    this.awb = awb;
                    this.date = date;
                    this.RecepientName = RecepientName;
                    this.RecepientNo = RecepientNo;
                    this.RecepientAdress = RecepientAdress;
                    this.namabank = namabank;
                    this.norekening = norekening;
                    this.expedisiName = expedisiName;
                    this.expedisiPackage = expedisiPackage;
                    this.products = products;
                    this.ongkir = ongkir;
                    this.subsidi = subsidi;
                    this.discount = discount;
                    this.biayatambahan = biayatambahan;
                    this.biayacod = biayacod;
                    this.kodeunik = kodeunik;
                    this.totalHarga = totalHarga;
                    this.memo = memo;
                    this.verifikator = verifikator;
                    this.namacs = namacs;
                    this.namaadv = namaadv;
                    this.namagrup = namagrup;
                    this.namaja = namaja;
                    this.statustranksasi = statustranksasi;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                let products = ''
                let adv = '-'
                let spv = '-'
                for(var j=0;j<datakeranjang.length;j++){
                    if (products != '') {
                        products += ', '
                    }
                    products += datakeranjang[j].sku+'-'+datakeranjang[j].jumlahproduct

                    if (datakeranjang[j].advertiser != '' && adv == '-') {
                        adv = datakeranjang[j].advertiser
                    }

                    if (datakeranjang[j].supervisor != '' && spv == '-') {
                        spv = datakeranjang[j].supervisor
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }
                
                let statustranksasi
                if (result[i].status == 'N') {
                    statustranksasi = 'DFOD'
                }

                let phoneNumber = result[i].customer.notelp
                if (phoneNumber[0] == '0') {
                    phoneNumber = '+62'+phoneNumber.substring(1)
                }else if (phoneNumber[0] != 6 && phoneNumber[0] != '+') {
                    phoneNumber = '+62' + phoneNumber
                }

                const expedition = result[i].expedisiName.split('(')

                const expeditionName = expedition[0]
                let expeditionPackage = '-'
                if (expedition[1] !== undefined) {
                expeditionPackage = expedition[1].replace(')', '')
                }

                const auth = JSON.parse(JSON.stringify(result[i].auth))
                const date = new Date(result[i].createdAt)

                let groupInternal = 'Partner'
                if (auth.groupinternal == 1) {
                    groupInternal = 'Ethos'
                }

                TransaksiArray.push(new Transaksi(
                    result[i].warehouse.name,
                    type,
                    result[i].orderNumber,
                    result[i].invoiceId,
                    groupInternal,
                    result[i].awb,
                    [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'),
                    result[i].customer.nama,
                    phoneNumber,
                    result[i].customer.alamat,
                    result[i].daexpedisis.namabank,
                    result[i].daexpedisis.norekening,
                    expeditionName,
                    expeditionPackage,
                    products,
                    result[i].ongkoskirim.toString(),
                    result[i].subsidi.toString(),
                    result[i].discount.toString(),
                    result[i].daexpedisis.biayatambahan.toString(),
                    result[i].daexpedisis.biayacod == null ? '' : result[i].daexpedisis.biayacod.toString(),
                    (result[i].id%999).toString(),
                    result[i].daexpedisis.totalharga.toString(),
                    result[i].memotransaksi,
                    result[i].authFinance == null ? '-' : result[i].authFinance.firstname,
                    result[i].auth.firstname,
                    adv,
                    auth.groupname,
                    spv,
                    statustranksasi     
                ));
            }
        //   console.log(TransaksiArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Gudang",
                "Metode Pembayaran",
                "Order Number",
                "Nomor Invoice",
                "Group",
                "Nomor AWB",
                "Tanggal & Jam",
                "Nama Pelanggan",
                "Nomor HP Pelanggan",
                "Alamat Pelanggan",
                "Bank",
                "Nomor Rekening",
                "Ekspedisi",
                "Paket Ekspedisi",
                "Produk",
                "Ongkos Kirim",
                "Subsidi Ongkos Kirim",
                "Diskon Transaksi",
                "Biaya Tambahan",
                "Admin COD",
                "Kode Unik",
                "Total Harga Pesanan",
                "Memo Transaksi",
                "Verifikator",
                "Nama CS",
                "Nama ADV",
                "Nama Grup",
                "Nama JA",
                "Status Transaksi",
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    // console.log('columnName: '+columnName);
                    // console.log('columnIndex: '+columnIndex);
                    // console.log('rowIndex: '+rowIndex);
                    // console.log('record [columnName]: '+record [columnName]);
                    // console.log('==========================================');
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelRiwayatVerifikasi(req, res) {
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        // let typebayar = req.query.typebayar
        // if(isNaN(parseFloat(typebayar))){
        //     typebayar = ""
        // }

        let bank = req.query.bank
        if( bank == null ){
            bank = ""
        }

        // let warehouseId = req.query.warehouseId
        // if( warehouseId == null ){
        //     warehouseId = ""
        // }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                  status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%G%'
                        },
                        {
                            [Op.like]: '%H%'
                        }, 
                        {
                            [Op.like]: '%I%'
                        },
                        {
                            [Op.like]: '%K%'
                        },
                        {
                            [Op.like]: '%N%'
                        },
                    ]
                },
                typebayar: 1,
                '$daexpedisis.namabank$': {
                    [Op.like]: `%${bank}%`
                },
              },
              attributes: ['id', 'invoiceId','awb','ongkoskirim','subsidi', 'discount', 'products','expedisiName','typebayar','memotransaksi', 'expedisiName', 'status', 'createdAt', 'updateFinance', 'orderNumber'],
              order: [
                ['id', 'DESC'],
            ],
            include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname'], [Sequelize.literal('`auth->mapgroups->group`.`internal`'), 'groupinternal']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                                where:{
                                                    internal: 1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening', 'biayatambahan', 'biayacod', 'subsidicod'],
                            },
                            { model: deliveryfods,
                                attributes: ['awbpengembalian','awbpengiriman'],
                            },
                            { model: returs,
                                attributes: ['keterangan','typedfod'],
                            },
                            { model: auths,
                                as:'authFinance',
                                attributes: ['notelp','firstname'],
                            },
                            { model: auths,
                                as:'authWarehouse',
                                attributes: ['notelp','firstname'],
                            },
            ]
        }).then(result => {
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        //    console.log(result)
            class Transaksi {
                constructor(
                    warehousename,
                    typebayar,
                    orderNumber,
                    Invoice,
                    groupInternal,
                    awb,
                    date,
                    RecepientName, 
                    RecepientNo,
                    RecepientAdress,
                    namabank,
                    norekening,
                    expedisiName,
                    expedisiPackage,
                    products,
                    ongkir,
                    subsidi,
                    discount,
                    biayatambahan,
                    biayacod,
                    subsidicod,
                    kodeunik,
                    totalHarga,
                    memo,
                    packingKayu,
                    verifikator,
                    tipecs,
                    namacs,
                    namaadv,
                    namagrup,
                    namaja,
                    statustranksasi
                ) {
                    this.warehousename = warehousename;
                    this.typebayar = typebayar;
                    this.orderNumber = orderNumber;
                    this.Invoice = Invoice;
                    this.groupInternal = groupInternal;
                    this.awb = awb;
                    this.date = date;
                    this.RecepientName = RecepientName;
                    this.RecepientNo = RecepientNo;
                    this.RecepientAdress = RecepientAdress;
                    this.namabank = namabank;
                    this.norekening = norekening;
                    this.expedisiName = expedisiName;
                    this.expedisiPackage = expedisiPackage;
                    this.products = products;
                    this.ongkir = ongkir;
                    this.subsidi = subsidi;
                    this.discount = discount;
                    this.biayatambahan = biayatambahan;
                    this.biayacod = biayacod;
                    this.subsidicod = subsidicod;
                    this.kodeunik = kodeunik;
                    this.totalHarga = totalHarga;
                    this.memo = memo;
                    this.packingKayu = packingKayu;
                    this.verifikator = verifikator;
                    this.tipecs = tipecs;
                    this.namacs = namacs;
                    this.namaadv = namaadv;
                    this.namagrup = namagrup;
                    this.namaja = namaja;
                    this.statustranksasi = statustranksasi;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                let products = ''
                let adv = '-'
                let spv = '-'
                for(var j=0;j<datakeranjang.length;j++){
                    if (products != '') {
                        products += ', '
                    }
                    products += datakeranjang[j].sku+'-'+datakeranjang[j].jumlahproduct

                    if (datakeranjang[j].advertiser != '' && adv == '-') {
                        adv = datakeranjang[j].advertiser
                    }
                    if (datakeranjang[j].supervisor != '' && spv == '-') {
                        spv = datakeranjang[j].supervisor
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }
                
                let statustranksasi
                if (result[i].status == 'G') {
                    statustranksasi = 'Siap Kirim'
                }
                else if (result[i].status == 'H') {
                    statustranksasi = 'Dikirim'
                }
                else if (result[i].status == 'I') {
                    statustranksasi = 'Sukses'
                }
                else if (result[i].status == 'K') {
                    statustranksasi = 'Return'
                }
                else if (result[i].status == 'N') {
                    statustranksasi = 'DFOD'
                }

                let phoneNumber = result[i].customer.notelp
                if (phoneNumber[0] == '0') {
                    phoneNumber = '+62'+phoneNumber.substring(1)
                }else if (phoneNumber[0] != 6 && phoneNumber[0] != '+') {
                    phoneNumber = '+62' + phoneNumber
                }

                const expedition = result[i].expedisiName.split('(')

                const expeditionName = expedition[0]
                let expeditionPackage = '-'
                if (expedition[1] !== undefined) {
                expeditionPackage = expedition[1].replace(')', '')
                }

                const auth = JSON.parse(JSON.stringify(result[i].auth))
                const date = new Date(result[i].createdAt)

                let groupInternal = 'Eksternal'
                let tipecs = 'CRM'
                if (auth.groupinternal == 1) {
                    groupInternal = 'Internal'
                    tipecs = 'CSA'
                }

                const memo = result[i].memotransaksi.toUpperCase()
                let packingKayu = 'false'

                if (memo.includes('PACKING KAYU') && memo.includes('TIDAK PERLU PACKING KAYU') == false) {
                    packingKayu = 'true'
                }

                TransaksiArray.push(new Transaksi(
                    result[i].warehouse.name,
                    type,
                    result[i].orderNumber,
                    result[i].invoiceId,
                    groupInternal,
                    result[i].awb + ',' + (result[i].deliveryfod == null? '' : result[i].deliveryfod.awbpengembalian) + ',' + (result[i].deliveryfod == null? '' : result[i].deliveryfod.awbpengiriman),
                    [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'),
                    result[i].customer.nama,
                    phoneNumber,
                    result[i].customer.alamat,
                    result[i].daexpedisis.namabank,
                    result[i].daexpedisis.norekening,
                    expeditionName,
                    expeditionPackage,
                    products,
                    result[i].ongkoskirim.toString(),
                    result[i].subsidi.toString(),
                    result[i].discount.toString(),
                    result[i].daexpedisis.biayatambahan.toString(),
                    result[i].daexpedisis.biayacod == null ? '' : result[i].daexpedisis.biayacod.toString(),
                    result[i].daexpedisis.subsidicod == null ? '' : result[i].daexpedisis.subsidicod.toString(),
                    (result[i].id%999).toString(),
                    result[i].daexpedisis.totalharga.toString(),
                    result[i].memotransaksi + '|' + result[i].memoCancel + '|' + (result[i].retur == null? '' : result[i].retur.keterangan) + '|' + (result[i].retur == null? '' : result[i].retur.typedfod),
                    packingKayu,
                    (result[i].authFinance == null? '' : result[i].authFinance.firstname) + ',' + (result[i].authWarehouse == null? '' : result[i].authWarehouse.firstname),
                    tipecs,
                    result[i].auth.firstname,
                    adv,
                    auth.groupname,
                    spv,
                    statustranksasi     
                ));
            }
        //   console.log(TransaksiArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Gudang",
                "Metode Pembayaran",
                "Order Number",
                "Nomor Invoice",
                "Group",
                "Nomor AWB",
                "Tanggal & Jam Penjualan",
                "Nama Pelanggan",
                "Nomor HP Pelanggan",
                "Alamat Pelanggan",
                "Bank",
                "Nomor Rekening",
                "Ekspedisi",
                "Paket Ekspedisi",
                "Produk",
                "Ongkos Kirim",
                "Subsidi Ongkos Kirim",
                "Diskon Transaksi",
                "Biaya Tambahan",
                "Admin COD",
                "Subsidi COD",
                "Kode Unik",
                "Total Harga Pesanan",
                "Memo",
                "Packing Kayu",
                "Verifikator & Inputer",
                "Tipe CS",
                "Nama CS",
                "Nama ADV",
                "Nama Grup",
                "Nama JA",
                "Status Transaksi",
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    // console.log('columnName: '+columnName);
                    // console.log('columnIndex: '+columnIndex);
                    // console.log('rowIndex: '+rowIndex);
                    // console.log('record [columnName]: '+record [columnName]);
                    // console.log('==========================================');
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelDaftarTransaksi(req, res) {
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        // let typebayar = req.query.typebayar
        // if(isNaN(parseFloat(typebayar))){
        //     typebayar = ""
        // }

        let bank = req.query.bank
        if( bank == null ){
            bank = ""
        }

        // let warehouseId = req.query.warehouseId
        // if( warehouseId == null ){
        //     warehouseId = ""
        // }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                  status: {
                    [Op.or]: [
                        {
                            [Op.like]: '%L%'
                        },
                        {
                            [Op.like]: '%G%'
                        },
                        {
                            [Op.like]: '%H%'
                        },
                        {
                            [Op.like]: '%I%'
                        },
                        {
                            [Op.like]: '%K%'
                        },
                        {
                            [Op.like]: '%N%'
                        },
                    ]
                },
                '$daexpedisis.namabank$': {
                    [Op.like]: `%${bank}%`
                },
              },
              attributes: ['id', 'invoiceId','awb','ongkoskirim','subsidi', 'discount', 'products','expedisiName','typebayar','memotransaksi', 'expedisiName', 'status', 'createdAt', 'updateFinance', 'orderNumber'],
              order: [
                ['id', 'DESC'],
            ],
            include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                as:'auth',
                                attributes: ['notelp','firstname', [Sequelize.literal('`auth->mapgroups->group`.`name`'), 'groupname'], [Sequelize.literal('`auth->mapgroups->group`.`internal`'), 'groupinternal']],
                                include:[
                                    {
                                        model: mapgroup,
                                        attributes:[
                                            // 'nama'
                                        ],
                                        include:[
                                            {
                                                model: group,
                                                attributes:[
                                                    
                                                ],
                                                where:{
                                                    internal: 1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening', 'biayatambahan', 'biayacod', 'subsidicod'],
                            },
                            { model: deliveryfods,
                                attributes: ['awbpengembalian','awbpengiriman'],
                            },
                            { model: returs,
                                attributes: ['keterangan','typedfod'],
                            },
                            { model: auths,
                                as:'authFinance',
                                attributes: ['notelp','firstname'],
                            },
                            { model: auths,
                                as:'authWarehouse',
                                attributes: ['notelp','firstname'],
                            },
            ]
        }).then(result => {
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        //    console.log(result)
            class Transaksi {
                constructor(
                    warehousename,
                    typebayar,
                    orderNumber,
                    Invoice,
                    groupInternal,
                    awb,
                    date,
                    RecepientName, 
                    RecepientNo,
                    RecepientAdress,
                    namabank,
                    norekening,
                    expedisiName,
                    expedisiPackage,
                    products,
                    ongkir,
                    subsidi,
                    discount,
                    biayatambahan,
                    biayacod,
                    subsidicod,
                    kodeunik,
                    totalHarga,
                    memo,
                    packingKayu,
                    verifikator,
                    tipecs,
                    namacs,
                    namaadv,
                    namagrup,
                    namaja,
                    statustranksasi
                ) {
                    this.warehousename = warehousename;
                    this.typebayar = typebayar;
                    this.orderNumber = orderNumber;
                    this.Invoice = Invoice;
                    this.groupInternal = groupInternal;
                    this.awb = awb;
                    this.date = date;
                    this.RecepientName = RecepientName;
                    this.RecepientNo = RecepientNo;
                    this.RecepientAdress = RecepientAdress;
                    this.namabank = namabank;
                    this.norekening = norekening;
                    this.expedisiName = expedisiName;
                    this.expedisiPackage = expedisiPackage;
                    this.products = products;
                    this.ongkir = ongkir;
                    this.subsidi = subsidi;
                    this.discount = discount;
                    this.biayatambahan = biayatambahan;
                    this.biayacod = biayacod;
                    this.subsidicod = subsidicod;
                    this.kodeunik = kodeunik;
                    this.totalHarga = totalHarga;
                    this.memo = memo;
                    this.packingKayu = packingKayu;
                    this.verifikator = verifikator;
                    this.tipecs = tipecs;
                    this.namacs = namacs;
                    this.namaadv = namaadv;
                    this.namagrup = namagrup;
                    this.namaja = namaja;
                    this.statustranksasi = statustranksasi;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                let products = ''
                let adv = '-'
                let spv = '-'
                for(var j=0;j<datakeranjang.length;j++){
                    if (products != '') {
                        products += ', '
                    }
                    products += datakeranjang[j].sku+'-'+datakeranjang[j].jumlahproduct

                    if (datakeranjang[j].advertiser != '' && adv == '-') {
                        adv = datakeranjang[j].advertiser
                    }
                    if (datakeranjang[j].supervisor != '' && spv == '-') {
                        spv = datakeranjang[j].supervisor
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }
                
                let statustranksasi
                if (result[i].status == 'G') {
                    statustranksasi = 'Siap Kirim'
                }
                else if (result[i].status == 'H') {
                    statustranksasi = 'Dikirim'
                }
                else if (result[i].status == 'I') {
                    statustranksasi = 'Sukses'
                }
                else if (result[i].status == 'K') {
                    statustranksasi = 'Return'
                }
                else if (result[i].status == 'N') {
                    statustranksasi = 'DFOD'
                }
                else if (result[i].status == 'L') {
                    statustranksasi = 'Cancel'
                }

                let phoneNumber = result[i].customer.notelp
                if (phoneNumber[0] == '0') {
                    phoneNumber = '+62'+phoneNumber.substring(1)
                }else if (phoneNumber[0] != 6 && phoneNumber[0] != '+') {
                    phoneNumber = '+62' + phoneNumber
                }

                const expedition = result[i].expedisiName.split('(')

                const expeditionName = expedition[0]
                let expeditionPackage = '-'
                if (expedition[1] !== undefined) {
                expeditionPackage = expedition[1].replace(')', '')
                }

                const auth = JSON.parse(JSON.stringify(result[i].auth))
                const date = new Date(result[i].createdAt)

                let groupInternal = 'Eksternal'
                let tipecs = 'CRM'
                if (auth.groupinternal == 1) {
                    groupInternal = 'Internal'
                    tipecs = 'CSA'
                }

                const memo = result[i].memotransaksi.toUpperCase()
                let packingKayu = 'false'

                if (memo.includes('PACKING KAYU') && memo.includes('TIDAK PERLU PACKING KAYU') == false) {
                    packingKayu = 'true'
                }

                TransaksiArray.push(new Transaksi(
                    result[i].warehouse.name,
                    type,
                    result[i].orderNumber,
                    result[i].invoiceId,
                    groupInternal,
                    result[i].awb + ',' + (result[i].deliveryfod == null? '' : result[i].deliveryfod.awbpengembalian) + ',' + (result[i].deliveryfod == null? '' : result[i].deliveryfod.awbpengiriman),
                    [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'),
                    result[i].customer.nama,
                    phoneNumber,
                    result[i].customer.alamat,
                    result[i].daexpedisis.namabank,
                    result[i].daexpedisis.norekening,
                    expeditionName,
                    expeditionPackage,
                    products,
                    result[i].ongkoskirim.toString(),
                    result[i].subsidi.toString(),
                    result[i].discount.toString(),
                    result[i].daexpedisis.biayatambahan.toString(),
                    result[i].daexpedisis.biayacod == null ? '' : result[i].daexpedisis.biayacod.toString(),
                    result[i].daexpedisis.subsidicod == null ? '' : result[i].daexpedisis.subsidicod.toString(),
                    (result[i].id%999).toString(),
                    result[i].daexpedisis.totalharga.toString(),
                    result[i].memotransaksi + '|' + result[i].memoCancel + '|' + (result[i].retur == null? '' : result[i].retur.keterangan) + '|' + (result[i].retur == null? '' : result[i].retur.typedfod),
                    packingKayu,
                    (result[i].authFinance == null? '' : result[i].authFinance.firstname) + ',' + (result[i].authWarehouse == null? '' : result[i].authWarehouse.firstname),
                    tipecs,
                    result[i].auth.firstname,
                    adv,
                    auth.groupname,
                    spv,
                    statustranksasi     
                ));
            }
        //   console.log(TransaksiArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Gudang",
                "Metode Pembayaran",
                "Order Number",
                "Nomor Invoice",
                "Group",
                "Nomor AWB",
                "Tanggal & Jam Penjualan",
                "Nama Pelanggan",
                "Nomor HP Pelanggan",
                "Alamat Pelanggan",
                "Bank",
                "Nomor Rekening",
                "Ekspedisi",
                "Paket Ekspedisi",
                "Produk",
                "Ongkos Kirim",
                "Subsidi Ongkos Kirim",
                "Diskon Transaksi",
                "Biaya Tambahan",
                "Admin COD",
                "Subsidi COD",
                "Kode Unik",
                "Total Harga Pesanan",
                "Memo",
                "Packing Kayu",
                "Verifikator & Inputer",
                "Tipe CS",
                "Nama CS",
                "Nama ADV",
                "Nama Grup",
                "Nama JA",
                "Status Transaksi",
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    console.log('columnName: '+columnName);
                    console.log('columnIndex: '+columnIndex);
                    console.log('rowIndex: '+rowIndex);
                    console.log('record [columnName]: '+record [columnName]);
                    console.log('==========================================');
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },

}
