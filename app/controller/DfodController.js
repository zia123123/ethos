const { deliveryfods,transaksis,auths,customers, Sequelize } = require('../models/index');
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
        var link = req.files[0].filename
        var empid = parseInt(req.body.transaksi_Id)
        let result = await deliveryfods.create({
            awbpengembalian: req.body.awbpengembalian,
            expedisipengembalian: req.body.expedisipengembalian,
            awbpengiriman: req.body.awbpengiriman,
            transaksisId: empid,
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

      async find(req, res, next) {
        let result = await deliveryfods.findOne({
            where: {
                    id: req.params.id,
            },
            include: [ 
                { model: transaksis,
                   
                    include: [ 
                        { model: customers,
                          
                        },
                        { model: auths,
                            as:'auth',
                            attributes: ['id','firstname','role', 'notelp'],
                        },
                        
                    ]
                },
                
            ]
        });
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },

    async index(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        const finish = req.query.finish
        let type = req.query.type

        if( search == null ){
            search = ""
        }
        if( type == null ){
            type = ""
        }

        const date = new Date();
        let startDate = new Date(0),
            endDate   = new Date(date.setDate(date.getDate() + 1));

        if (req.query.startDate) {
            startDate = Math.floor(req.query.startDate) 
        }
        if (req.query.endDate) {
            endDate = Math.floor(req.query.endDate)
        }

        let filter = 
        {
            
            where: {
                state: 1,
                typedfod: {
                    [Op.like]: `%${type}%`
                },
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                [Op.or]:[
                    {
                        '$transaksis->auth.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis->customer.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awbpengiriman:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awbpengembalian:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis->auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                ]
            },
            include: [ 
                { model: transaksis,
                    attributes: [
                        'awb',
                        'invoiceId', 
                        [Sequelize.literal('CASE WHEN typebayar = 1 THEN "Transfer" WHEN typebayar = 2 THEN "COD" ELSE 0 END'), 'payment_method'],
                        'orderNumber'
                    ],
                    include: [ 
                        { model: customers,
                            attributes: ['nama','notelp'],
                        },
                        { model: auths,
                            as:'auth',
                            attributes: ['firstname','role', 'notelp'],
                        },
                        
                    ]
                },
                
            ]
                
            
        }
        let count = await deliveryfods.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await deliveryfods.findAll(filter).then(result => {
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


    async indexriwayat(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        const finish = req.query.finish
        let type = req.query.type

        if( search == null ){
            search = ""
        }
        if( type == null ){
            type = ""
        }

        const date = new Date();
        let startDate = new Date(0),
            endDate   = new Date(date.setDate(date.getDate() + 1));

        if (req.query.startDate) {
            startDate = Math.floor(req.query.startDate) 
        }
        if (req.query.endDate) {
            endDate = Math.floor(req.query.endDate)
        }

        let filter = 
        { 
            where: {
                state: {
                    [Op.or]: [
                        {
                            [Op.like]: '%2%'
                        },
                        {
                            [Op.like]: '%3%'
                        }
                    ]
                },
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                typedfod: {
                    [Op.like]: `%${type}%`
                },
                [Op.or]:[
                    {
                        '$transaksis->auth.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis->customer.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awbpengiriman:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        awbpengembalian:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis->auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                ]
            },
            include: [ 
                { model: transaksis,
                    attributes: ['awb','invoiceId', 'orderNumber'],
                    include: [ 
                        { model: customers,
                            attributes: ['nama','notelp'],
                        },
                        { model: auths,
                            as:'auth',
                            attributes: ['firstname','role', 'notelp'],
                        },
                        
                    ]
                },
                
            ]
        }
        let count = await deliveryfods.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await deliveryfods.findAll(filter).then(result => {
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
    // async indexKu(req, res) {
    //     let result = await group.findAll({
    //         where: {
    //             authId: req.query.id,
    //     },
    //     }).then(result => {
    //         return apiResponse.successResponseWithData(res, "SUCCESS", result);
    //         }).catch(function (err){
    //             return apiResponse.ErrorResponse(res, err);
    //         });
    // },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        const date = new Date()
        const offset = date.getTimezoneOffset()

        req.result.awbpengembalian = req.body.awbpengembalian;  
        req.result.expedisipengembalian = req.body.expedisipengembalian;
        req.result.awbpengiriman = req.body.awbpengiriman;    
        req.result.expedisipengiriman = req.body.expedisipengiriman;    
        req.result.typedfod = req.body.typedfod;    
        req.result.kondisibarang = req.body.kondisibarang;    
        req.result.biayapengembalian = req.body.biayapengembalian;  
        req.result.evidance = req.body.evidance;  
        req.result.keterangan = req.body.keterangan;
        req.result.state = req.body.state;
        req.result.spvAuthId = req.body.spvAuthId;
        req.result.ccAuthId = req.body.ccAuthId;
        if (req.body.spvAuthId != null) {
            req.result.tanggal_spv = new Date(date.getTime() - (offset*60*1000)) 
        }
        if (req.body.ccAuthId != null) {
            req.result.tanggal_cc = new Date(date.getTime() - (offset*60*1000)) 
        }
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },

    // Delete
    async delete(req, res) {
        req.result.destroy().then(result => {
            res.json({ msg: "Berhasil di delete" });
        })
    },


}
