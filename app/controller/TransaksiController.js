const {
    returs,deliveryfods, transaksis,statustranksasis,keranjangs,products,
    daexpedisis,customers,warehouses,auths,buktibayars,product_stocks,
    districts,cityregencies,province, mapgroup, group, Sequelize 
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
        let keranjangdata =  req.body.products.replace(/\\n/g, '')
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
            invoiceId: req.body.warehouseId,
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
        }).then(result => {
            let keranjang = keranjangs.bulkCreate(datakeranjang, { individualHooks: true }).then(keranjang =>{
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            })
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
        let search = req.query.search
        let expedition = req.query.expedition

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
        if( status == null ){
            status = ""
        }
        if( paymentMethod == null ){
            paymentMethod = ""
        }
        if( expedition == null ){
            expedition = ""
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
                    [Op.or]:[
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            invoiceId:{
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
                            '$daexpedisis.totalharga$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
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
                        attributes: ['notelp','firstname'],
                    }
                ]
            }
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
                [Op.or]:[
                    {
                        '$auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        invoiceId:{
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
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            },
                            { model: daexpedisis,
                                attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
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
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        })
    },

    async indexGudangRiwayat(req, res) {
      
        let warehouseId = req.query.warehouseId
        let expedition = req.query.expedition
        let paymentMethod = req.query.paymentMethod
        let transactionStatus = req.query.transactionStatus
        let paymentStatus = req.query.paymentStatus
        let search = req.query.search

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
                    [Op.or]:[
                        {
                            invoiceId:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            awb:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            expedisiName:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
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
                        attributes: ['notelp','firstname'],
                    }
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
                [Op.or]:[
                    {
                        invoiceId:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awb:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        nama:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        expedisiName:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$auth.firstname$':{
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
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            },
                            { model: daexpedisis,
                                attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
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



    async riwayatall(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        let status = req.query.status
        let warehouseId = req.query.warehouseId
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
        let search = req.query.search 
        let bank = req.query.bank 
        
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

        if( bank == null ){
            bank = ""
        }
        const count = await transaksis.count({where: {
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
            [Op.or]:[
                {
                    '$auth.firstname$':{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    '$customer.notelp$':{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    '$daexpedisis.totalharga$':{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    '$daexpedisis.namabank$':{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    '$daexpedisis.namabank$':{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    '$daexpedisis.norekening$':{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    nama:{
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    invoiceId:{
                        [Op.like]: `%${search}%`
                    }
                },
            ],
            },
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    attributes: ['firstname', 'notelp'],
                },
                { model: buktibayars,
                    // required: true,
                    attributes: ['link'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
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
                    [Op.or]:[
                    {
                        '$auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$customer.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$daexpedisis.totalharga$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$daexpedisis.namabank$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$daexpedisis.namabank$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$daexpedisis.norekening$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        nama:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        invoiceId:{
                            [Op.like]: `%${search}%`
                        }
                    },
                ],
              },
              order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim', 'discount', 'memotransaksi'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    attributes: ['firstname', 'notelp'],
                },
                { model: buktibayars,
                    // required: true,
                    attributes: ['link'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
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
         let search = req.query.search 
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
                                invoiceId:{
                                    [Op.like]: `%${search}%`
                                }
                            },
                        ],
                    }
                  ],
              },
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
                    attributes: ['firstname'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
                { model: buktibayars,
                    attributes: ['link'],
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
                                invoiceId:{
                                    [Op.like]: `%${search}%`
                                }
                            },
                        ],
                    }
                  ],
              },
              order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim', 'updateFinance', 'updatedAt'],
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
                    attributes: ['firstname'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
                { model: buktibayars,
                    attributes: ['link'],
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
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
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
                    attributes: ['link'],
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
        req.transaksi.updateFinance = req.body.updateFinance;
        req.transaksi.kurangbayar = req.body.kurangbayar;
        req.transaksi.statusbarang = req.body.statusbarang;
        req.transaksi.logstatus = req.transaksi.logstatus+"#"+req.body.logstatus;
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
        const orders = req.body

        for (let index = 0; index < orders.length; index++) {
            if (orders[index].Invoice === undefined) {
                if (error) {
                    error += ', '
                }
                error += `Invoice index ke-${index+1} tidak ada`
                continue
            }
            if (orders[index].Invoice.length == 0) {
                if (error) {
                    error += ', '
                }
                error += `Invoice index ke-${index+1} kosong`
                continue
            }
            if (orders[index].AWB.length > 0) {
                transaksis.update(
                    {
                        status: "H", 
                        awb: orders[index].AWB
                    },
                    {
                        where: {invoiceId: orders[index].Invoice}
                    }
                )
                if (success) {
                    success += ', '
                }
                success += `AWB dan Status dari Invoice index ke-${index+1} berhasil diubah`
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
        // let paymentStatus = req.query.paymentStatus
        let search = req.query.search

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
                    [Op.or]:[
                        {
                            invoiceId:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            awb:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            expedisiName:{
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${search}%`
                            }
                        },
                    ],
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
                        attributes: ['notelp','firstname'],
                    }
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
                [Op.or]:[
                    {
                        invoiceId:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awb:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        nama:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        expedisiName:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$auth.firstname$':{
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
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            },
                            { model: daexpedisis,
                                attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
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
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga','namabank','norekening'],
                            },
            ]
        }).then(result => {
        //    console.log(result)
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
        //   console.log(TransaksiArray)
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
              attributes: ['id', 'invoiceId','awb','ongkoskirim','subsidi', 'discount', 'products','expedisiName','typebayar','memotransaksi', 'expedisiName', 'status', 'createdAt'],
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
                    awb,
                    date,
                    RecepientName, 
                    RecepientNo,
                    RecepientAdress,
                    namabank,
                    norekening,
                    expedisiName,
                    prd1,
                    domain1,
                    qty1,
                    price1,
                    sku1,
                    prd2,
                    qty2,
                    price2,
                    ongkir,
                    subsidi,
                    discount,
                    biayatambahan,
                    biayacod,
                    kodeunik,
                    totalHarga,
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
                    this.awb = awb;
                    this.date = date;
                    this.RecepientName = RecepientName;
                    this.RecepientNo = RecepientNo;
                    this.RecepientAdress = RecepientAdress;
                    this.namabank = namabank;
                    this.norekening = norekening;
                    this.expedisiName = expedisiName;
                    this.prd1 = prd1;
                    this.domain1 = domain1;
                    this.qty1 = qty1;
                    this.price1 = price1;
                    this.sku1 = sku1;
                    this.prd2 = prd2;
                    this.qty2 = qty2;
                    this.price2 = price2;
                    this.ongkir = ongkir;
                    this.subsidi = subsidi;
                    this.discount = discount;
                    this.biayatambahan = biayatambahan;
                    this.biayacod = biayacod;
                    this.kodeunik = kodeunik;
                    this.totalHarga = totalHarga;
                    // this.verifikator = verifikator;
                    this.namacs = namacs;
                    this.namaadv = namaadv;
                    this.namagrup = namagrup;
                    this.namaja = namaja;
                    this.statustranksasi = statustranksasi;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct,supervisor,advertiser,linkdomain,hpp, price) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                      this.supervisor = supervisor;
                      this.advertiser = advertiser;
                      this.linkdomain = linkdomain;
                      this.hpp = hpp;
                      this.price = price;
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
                            datakeranjang[j].jumlahproduct,
                            datakeranjang[j].supervisor,
                            datakeranjang[j].advertiser,
                            datakeranjang[j].linkdomain,
                            datakeranjang[j].hpp,
                            datakeranjang[j].price,
                            
                            ));
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

                const auth = JSON.parse(JSON.stringify(result[i].auth))
                const date = new Date(result[i].createdAt)

                TransaksiArray.push(new Transaksi(
                    result[i].warehouse.name,
                    type,
                    result[i].invoiceId,
                    result[i].awb,
                    [(date.getDate()),
                        (date.getMonth()+1),
                        date.getFullYear()].join('/') +' ' +
                       [date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()].join(':'),
                    result[i].customer.nama,
                    result[i].customer.notelp,
                    result[i].customer.alamat,
                    result[i].daexpedisis.namabank,
                    result[i].daexpedisis.norekening,
                    result[i].expedisiName,
                    KeranjangArray[0].namaproduct,
                    KeranjangArray[0].linkdomain,
                    KeranjangArray[0].jumlahproduct.toString(),
                    KeranjangArray[0].price == null? '': KeranjangArray[0].price.toString(),
                    KeranjangArray[0].sku,
                    KeranjangArray[1].namaproduct,
                    KeranjangArray[1].jumlahproduct.toString(),
                    KeranjangArray[1].price == null? '': KeranjangArray[1].price.toString(),
                    result[i].ongkoskirim.toString(),
                    result[i].subsidi.toString(),
                    result[i].discount.toString(),
                    result[i].daexpedisis.biayatambahan.toString(),
                    result[i].daexpedisis.biayacod == null ? '' : result[i].daexpedisis.biayacod.toString(),
                    (result[i].id%999).toString(),
                    result[i].daexpedisis.totalharga.toString(),
                    'verifikator',
                    result[i].auth.firstname,
                    KeranjangArray[0].advertiser,
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
                "Invoice Number",
                "Nomor AWB",
                "Tanggal & Jam Invoice",
                "Nama Pelanggan",
                "Nomor HP Pelanggan",
                "Alamat Pelanggan",
                "Bank",
                "Nomor Rekening",
                "Ekspedisi",
                "*ProductName_1",
                "Link Domain",
                "*Quantity_1",
                "*UnitPrice_1",
                "SKU_1",
                "*ProductName_2",
                "*Quantity_2",
                "*UnitPrice_2",
                "Ongkos Kirim",
                "Subsidi Ongkos Kirim",
                "Diskon Transaksi",
                "Biaya Tambahan",
                "Admin COD",
                "Kode Unik",
                "Total Harga Pesanan",
                // "Verifikator",
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
                      result[i].invoiceId, 
                      result[i].customer.nama+'|'+result[i].idtransaksi+'|'+products, 
                      result[i].customer.notelp, 
                      result[i].customer.alamat, 
                      result[i].awb, 
                      result[i].expedisiName, 
                      type, 
                      result[i].daexpedisis.totalharga.toString(), 
                      result[i].customer.provinsiname, 
                      result[i].customer.cityname, 
                      result[i].customer.districtname,
                      productNotes, 
                      packingKayu, 
                      result[i].memotransaksi, 
                      result[i].auth.firstname + ' | ' + result[i].expedisiName + ' | ' + type + ' | ' + adv + ' | ' + auth.groupname, 
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
                      tag = 'Shipper|Kosambi'
                  }
                  else if (warehouseId == 4) {
                      tag = 'Shipper|Tambak Sawah'
                  }
                  
                  for(var j=0;j<datakeranjang.length;j++){
                    TransaksiArray.push(new Transaksi(
                        "FHG", 
                        result[i].invoiceId,
                        result[i].invoiceId,
                        datakeranjang[j].jumlahproduct, 
                        datakeranjang[j].sku, 
                        'EA', 
                        '1', 
                        result[i].customer.nama,  
                        result[i].customer.notelp, 
                        result[i].customer.alamat, 
                        '',
                        '',
                        result[i].awb, 
                        result[i].expedisiName, 
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
                      invoiceNumber,
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
                  ) {
                    this.datetime = datetime; 
                    this.paymentMethod = paymentMethod; 
                    this.warehouseName = warehouseName; 
                    this.expedition = expedition; 
                    this.expeditionPackage = expeditionPackage;
                    this.group = group;
                    this.invoiceNumber = invoiceNumber;
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
                  if (phoneNumber[0] == 0) {
                      phoneNumber[0] = '+'
                      phoneNumber.replace('+', '+62')
                  }else if (phoneNumber[0] != 6) {
                      phoneNumber = '+62' + phoneNumber
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
                      groupInternal,
                      result[i].invoiceId,
                      result[i].customer.nama+'|'+result[i].idtransaksi, 
                      phoneNumber, 
                      result[i].customer.alamat, 
                      result[i].customer.provinsiname, 
                      result[i].customer.cityname, 
                      result[i].customer.districtname,
                      result[i].memotransaksi + '|' + products + '|' + auth.firstname + '|' + type + '|' + adv + '|' + auth.groupname + '|' + auth.groupname, 
                      (weightTotal/1000).toString(),
                      quantityTotal.toString(),
                      productNotes, 
                      result[i].daexpedisis.totalharga.toString(),
                      result[i].ongkoskirim.toString(),
                      result[i].subsidi.toString(),
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
                  "Group",
                  "Invoice Number",
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

}
