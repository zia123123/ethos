const { returs,transaksis,auths,customers, daexpedisis, Sequelize } = require('../models/index');
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
        let result = await returs.create({
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
        let result = await returs.findOne({
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
                            attributes: ['id','firstname','role'],
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

        if( search == null ){
            search = ""
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

        let filter = {
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                state: 1,
                [Op.or]:[
                    {
                        '$transaksis->auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis->customer.nama$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis->customer.notelp$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis.awb$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$transaksis.invoiceId$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        keterangan:{
                            [Op.like]: `%${search}%`
                        }
                    },
                ],
            },
            include: [ 
                { model: transaksis,
                    attributes: ['awb','invoiceId', 'tanggalVerifikasi', 'tanggalAWB'],
                    include: [ 
                        { model: customers,
                            attributes: ['id','nama','notelp'],
                        },
                        { model: auths,
                            as:'auth',
                            attributes: [
                                'firstname',
                                'role', 
                                'notelp',
                                [Sequelize.literal('CASE WHEN typebayar = 1 THEN "Transfer" WHEN typebayar = 2 THEN "COD" ELSE 0 END'), 'payment_method']
                            ],
                            // where: Sequelize.where(Sequelize.literal(``))
                        },
                        { model: auths,
                            as:'authFinance',
                            attributes: ['firstname']
                        },
                        { model: auths,
                            as:'authWarehouse',
                            attributes: ['firstname']
                        },
                        { model: daexpedisis,
                            attributes: ['totalharga'],
                        },
                    ]
                },
                
            ]
        }

        let count = await returs.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
        }

        let result = await returs.findAll(filter).then(result => {
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
                console.log(err);
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async indexriwayat(req, res) {
        let result = await returs.findAll({
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
             }
            },
            include: [ 
                { model: transaksis,
                    attributes: ['awb','invoiceId'],
                    include: [ 
                        { model: customers,
                            attributes: ['nama','notelp'],
                        },
                        { model: auths,
                            as:'auth',
                            attributes: ['firstname','role'],
                        },
                        
                    ]
                },
                
            ]
            
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
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
