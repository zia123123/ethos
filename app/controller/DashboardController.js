"use strict";
const {
    transaksis, 
    daexpedisis, 
    auths,
    mapgroup,
    group,
    dfods
   } = require('../models/index');
const { Op, where, Sequelize } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");
const sequelize = new Sequelize("mysql::ethos:");

module.exports = {

    async omset (req, res){
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let result = await transaksis.findAll({
            attributes: [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'I' then daexpedisis.totalHarga else 0 end)`), 'success'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
            ],
            raw: true,
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                }
            },
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetProdukKota (req, res){
        if (req.query.productId == null) {
            return apiResponse.ErrorResponse(res, 'Produk tidak boleh kosong');
        }

        const productId = req.query.productId
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
        endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let result = await transaksis.findAll({
            attributes: [
                'cityname',
                'products'
            ],
            where:{
                status: 'I',
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                }
            },
        }).then(result => {
            var  KeranjangArray = [];
            for (let i = 0; i < result.length; i++) {
                class Keranjang { //dapetin dari produk
                    constructor(cityname, jumlahproduct) {
                      this.city_name = cityname;
                      this.jumlah_product = jumlahproduct;
                    }
                  }
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                // console.log(keranjangdata);
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<datakeranjang.length;j++){
                    if (datakeranjang[j].productId != productId) {
                        continue
                    }
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        let obj = KeranjangArray.find(o => o.city_name === result[i].cityname)
                        if (obj === undefined) {
                            KeranjangArray.push(new Keranjang(result[i].cityname, datakeranjang[j].jumlahproduct));
                        }else{
                            let add = KeranjangArray.find((o, index) => {
                                if (o.city_name === result[i].cityname) {
                                    KeranjangArray[index].jumlah_product += datakeranjang[j].jumlahproduct
                                    return true; // stop searching
                                }
                            });
                        }
                    }
                } 
            }
            KeranjangArray.sort((a, b) => {
                return a.jumlah_product - b.jumlah_product;
            });
            return apiResponse.successResponseWithData(res, "SUCCESS", KeranjangArray);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetInternal (req, res){
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        
        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
            },
            attributes: 
            [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'I' then daexpedisis.totalHarga else 0 end)`), 'success'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        internal: 1
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetPartner (req, res){
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
            },
            attributes: 
            [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'I' then daexpedisis.totalHarga else 0 end)`), 'success'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        internal: 0
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async skuByGroup (req, res){
        let groupId = ''
        if (req.query.groupId != null) {
            groupId = req.query.groupId
        }

        let result = await transaksis.findAll({
            where:{
                status: 'I',
            },
            attributes: 
            [
                'products',
                // [sequelize.cast( 
                // sequelize.fn('left', 
                // sequelize.fn('substring_index', sequelize.col('products'), 'productId: ', -1), 
                // sequelize.fn('locate', ',', 
                // sequelize.fn('substring_index', sequelize.col('products'), 'productId: ', -1))), 'UNSIGNED'), 'id_produk'],

                // [sequelize.literal(`left(substring_index(products, 'namaproduct: "', -1), locate(',', substring_index(products, 'namaproduct: ', -1))-3)`), 'nama_produk'],

                // [sequelize.literal(`left(substring_index(products, 'sku: "', -1), locate(',', substring_index(products, 'sku: ', -1))-3)`), 'sku_produk'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        id: {
                                            [Op.like]: '%'+groupId+'%'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
        }).then(result => {
            var  KeranjangArray = [];
            for (let i = 0; i < result.length; i++) {
                class Keranjang { //dapetin dari produk
                    constructor(productId, namaproduct, sku, jumlahproduct) {
                      this.product_id = productId;
                      this.nama_product = namaproduct;
                      this.sku = sku;
                      this.jumlah_product = jumlahproduct;
                    }
                  }
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                // console.log(keranjangdata);
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<datakeranjang.length;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        let obj = KeranjangArray.find(o => o.nama_product === datakeranjang[j].namaproduct);
                        if (obj === undefined) {
                            KeranjangArray.push(new Keranjang(datakeranjang[j].productId, datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct));
                        }
                    }
                } 
            }
            return apiResponse.successResponseWithData(res, "SUCCESS", KeranjangArray);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetProdukUtama (req, res){
        if (req.query.groupId == null) {
            return apiResponse.ErrorResponse(res, 'Group tidak boleh kosong');
        }
        if (req.query.productId == null) {
            return apiResponse.ErrorResponse(res, 'Produk tidak boleh kosong');
        }

        const groupId = req.query.groupId
        const productId = req.query.productId
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let result = await transaksis.findAll({
            where:{
                status: 'I',
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                }
            },
            attributes: 
            [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                'products',
                'daexpedisis.totalHarga',
                'auth->mapgroups->group.name',
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        id: groupId
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
        }).then(result => {
            var  KeranjangArray = [];
            for (let i = 0; i < result.length; i++) {
                class Keranjang { //dapetin dari produk
                    constructor(date, groupname, productId, namaproduct, sku, jumlahproduct, totalharga) {
                      this.date = date;
                      this.group_name = groupname;
                      this.product_id = productId;
                      this.nama_product = namaproduct;
                      this.sku = sku;
                      this.jumlah_product = jumlahproduct;
                      this.total_harga = totalharga;
                    }
                  }
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                // console.log(keranjangdata);
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<datakeranjang.length;j++){
                    if (datakeranjang[j].productId != productId) {
                        continue
                    }
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        let obj = KeranjangArray.find(o => o.date === result[i].date)
                        if (obj === undefined) {
                            KeranjangArray.push(new Keranjang(result[i].date, result[i].name, datakeranjang[j].productId, datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct, datakeranjang[j].jumlahproduct * datakeranjang[j].price));
                        }else{
                            let add = KeranjangArray.find((o, index) => {
                                if (o.date === result[i].date) {
                                    KeranjangArray[index].jumlah_product += datakeranjang[j].jumlahproduct
                                    KeranjangArray[index].total_harga += datakeranjang[j].jumlahproduct * datakeranjang[j].price;
                                    return true; // stop searching
                                }
                            });
                        }
                    }
                } 
            }
            KeranjangArray.sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            });
            return apiResponse.successResponseWithData(res, "SUCCESS", KeranjangArray);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async advByGroup (req, res){
        if (req.query.groupId == null) {
            return apiResponse.ErrorResponse(res, 'Group tidak boleh kosong');
        }

        const groupId = req.query.groupId

        let result = await mapgroup.findAll({
            attributes: 
            [
                'group.name',
                [sequelize.col('auth.id'), 'auth_id'],
                'auth.firstname'
            ],
            include: [
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include: [
                        {
                            model: transaksis,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],   
                        }
                    ]
                },
                { 
                    model: group,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    where:{
                        id: groupId
                    },
                },
            ],
            raw: true,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async skuByAdvAndGroup (req, res){
        if (req.query.groupId == null) {
            return apiResponse.ErrorResponse(res, 'Group tidak boleh kosong');
        }

        if (req.query.authId == null) {
            return apiResponse.ErrorResponse(res, 'Adv tidak boleh kosong');
        }

        const groupId = req.query.groupId
        const authId = req.query.authId

        let result = await transaksis.findAll({
            where:{
                authId: authId
            },
            attributes: 
            [
                'auth->mapgroups->group.name',
                'auth.firstname',
                'products'
            ],
            include: [
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        id: groupId
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
        }).then(result => {
            var  KeranjangArray = [];
            for (let i = 0; i < result.length; i++) {
                class Keranjang { //dapetin dari produk
                    constructor(productId, namaproduct, sku, jumlahproduct) {
                      this.product_id = productId;
                      this.nama_product = namaproduct;
                      this.sku = sku;
                      this.jumlah_product = jumlahproduct;
                    }
                  }
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                // console.log(keranjangdata);
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<datakeranjang.length;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        let obj = KeranjangArray.find(o => o.nama_product === datakeranjang[j].namaproduct);
                        if (obj === undefined) {
                            KeranjangArray.push(new Keranjang(datakeranjang[j].productId, datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct));
                        }
                    }
                } 
            }
            console.log(KeranjangArray);
            return apiResponse.successResponseWithData(res, "SUCCESS", KeranjangArray);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async closingRateAdv (req, res){
        if (req.query.groupId == null) {
            return apiResponse.ErrorResponse(res, 'Group tidak boleh kosong');
        }

        if (req.query.authId == null) {
            return apiResponse.ErrorResponse(res, 'Adv tidak boleh kosong');
        }

        if (req.query.productId == null) {
            return apiResponse.ErrorResponse(res, 'Produk tidak boleh kosong');
        }

        const groupId = req.query.groupId
        const authId = req.query.authId
        const productId = req.query.productId

        let result = await transaksis.findAll({
            where:{
                authId: authId
            },
            attributes: 
            [
                'auth->mapgroups->group.name',
                'auth.firstname',
                'products',
                'transaksis.status',
            ],
            include: [
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        id: groupId
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
        }).then(result => {
            console.log(result.length);
            var  KeranjangArray = [];
            for (let i = 0; i < result.length; i++) {
                class Keranjang { //dapetin dari produk
                    constructor(productId, namaproduct, sku, jumlahproduct, groupname, advname, status) {
                      this.product_id = productId;
                      this.nama_product = namaproduct;
                      this.sku = sku;
                      this.jumlah_product = jumlahproduct;
                      this.group_name = groupname;
                      this.adv_name = advname;
                      this.lead = 0;
                      this.closing = 0;
                      if (status == 'A') {
                        this.lead = jumlahproduct;
                      }else if(status == 'I'){
                        this.closing = jumlahproduct;
                      }
                      this.sum_of_cr = 0;
                    }
                  }
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                // console.log(keranjangdata);
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<datakeranjang.length;j++){
                    if (datakeranjang[j].productId != productId) {
                        continue
                    }
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        let obj = KeranjangArray.find(o => o.nama_product === datakeranjang[j].namaproduct)
                        if (obj === undefined) {
                            KeranjangArray.push(new Keranjang(datakeranjang[j].productId, datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct, result[i].name, result[i].firstname, result[i].status));
                        }else{
                            let add = KeranjangArray.find((o, index) => {
                                if (o.nama_product === datakeranjang[j].namaproduct) {
                                    if (result[i].status == 'A') {
                                        KeranjangArray[index].lead += datakeranjang[j].jumlahproduct;
                                    }else if(result[i].status == 'I'){
                                        KeranjangArray[index].closing += datakeranjang[j].jumlahproduct;
                                    }
                                    KeranjangArray[index].jumlah_product += datakeranjang[j].jumlahproduct
                                    if (KeranjangArray[index].lead != 0) {
                                        KeranjangArray[index].sum_of_cr = (KeranjangArray[index].closing/KeranjangArray[index].lead) * 100
                                    }
                                    return true; // stop searching
                                }
                            });
                        }
                    }
                } 
            }
            console.log(KeranjangArray);
            return apiResponse.successResponseWithData(res, "SUCCESS", KeranjangArray);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetPencapaianGroup (req, res){
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        
        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                status: 'I'
            },
            attributes: 
            [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                'auth->mapgroups->group.internal',
                'daexpedisis.totalHarga',
                // [sequelize.literal(`SUM( CASE WHEN auth->mapgroups->group.internal = 1 then daexpedisis.totalHarga else 0 end)`), 'internal'],
                // [sequelize.literal(`SUM( CASE WHEN auth->mapgroups->group.internal = 0 then daexpedisis.totalHarga else 0 end)`), 'partner'],
                // [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                // [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                // [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
            // group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },
}