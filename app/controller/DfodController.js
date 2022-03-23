const { deliveryfods,transaksis,auths,customers } = require('../models/index');
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
                            attributes: ['firstname','role'],
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
        let result = await deliveryfods.findAll({
            include: [ 
                { model: transaksis,
                    attributes: ['awb','invoiceId'],
                    include: [ 
                        { model: customers,
                            attributes: ['nama'],
                        },
                        { model: auths,
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
