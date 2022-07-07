const {
    transaksis, transaksis_temp,
    daexpedisis,customers,warehouses,auths,buktibayars,
    districts,cityregencies,province, leads, Sequelize 
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
    async index(req, res) {
      
        let metodebayar = parseInt(req.query.metodebayar)
        let status = req.query.status
        let nama = req.query.nama
        //let statusbarang = req.query.statusbarang
        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
    
     
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
    
        let result = await transaksis_temp.findAll({
            where:{
                // createdAt :  {
                //     [Op.and]: {
                //       [Op.gte]: startDate,
                //       [Op.lte]: endDate
                //     }
                //   },
                // authId: req.params.userid,
                // [Op.and]: [
                //     {
                //     status: {    
                //         [Op.like]: '%'+status+'%'
                //     }
                //      },
                //     //  {
                //     //     statusbarang: {    
                //     //         [Op.like]: '%'+statusbarang+'%'
                //     //     }
                //     //      },
                //      {
                //         pembayaran: {    
                //             [Op.like]: '%'+metodebayar+'%'
                //         }
                        
                //          },
                //          {
                //             nama: {    
                //                 [Op.like]: '%'+nama+'%'
                //             }
                //              },
                //   ],
             },
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi',],
            include: [ 
                { 
                    model: leads,
                    where:{
                        authId: req.params.userid
                    }
                }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    
    async find(req, res, next) {
        let transaksi = await transaksis_temp.findByPk(req.params.id);
        if (!transaksi) {
        return apiResponse.notFoundResponse(res, "Not Found");
        } else {
            req.transaksi = transaksi;
            next();
        }
    },

    async show(req, res) {
        let result = await transaksis_temp.findOne({
            where: {
                id: req.params.id,
            },
            include: [ 
                { 
                    model: leads,
                },
            ]
            
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async update(req, res) {
        const date = new Date()
        const offset = date.getTimezoneOffset()

        req.transaksi.nama = req.body.nama;
        req.transaksi.idtransaksi = req.body.idtransaksi;
        req.transaksi.customerId = req.body.customerId;
        req.transaksi.authId = req.body.authId;
        req.transaksi.expedisiName = req.body.expedisiName;
        req.transaksi.provinceId = req.body.provinceId;
        req.transaksi.cityregencyId = req.body.cityregencyId;
        req.transaksi.warehouseId = req.body.warehouseId;
        req.transaksi.invoiceId = req.body.invoiceId;
        req.transaksi.typebayar = req.body.typebayar;
        req.transaksi.awb = req.body.awb;
        req.transaksi.so = req.body.so;
        req.transaksi.jumlahproduct = req.body.jumlahproduct;
        req.transaksi.noref = req.body.noref;
        req.transaksi.statusbarang = req.body.statusbarang;
        req.transaksi.pembayaran = req.body.pembayaran;
        req.transaksi.status = req.body.logstatus;
        req.transaksi.logstatus = (req.transaksi.logstatus == null? req.body.logstatus : req.transaksi.logstatus+"#"+req.body.logstatus);
        req.transaksi.products = req.body.products;
        req.transaksi.discount = req.body.discount;
        req.transaksi.ongkoskirim = req.body.ongkoskirim;
        req.transaksi.subsidi = req.body.subsidi;
        req.transaksi.provinsiname = req.body.provinsiname;
        req.transaksi.cityname = req.body.cityname;
        req.transaksi.districtname = req.body.districtname;
        req.transaksi.memotransaksi = req.body.memotransaksi;
        req.transaksi.sudahbayar = req.body.sudahbayar;
        req.transaksi.kurangbayar = req.body.kurangbayar;
        req.transaksi.groupname = req.body.groupname;
        req.transaksi.idgroup = req.body.idgroup;
        req.transaksi.updateFinance = req.body.updateFinance;
        req.transaksi.leadsId = req.body.leadsId;
        req.transaksi.authIDFinance = req.body.verificationFinanceId;
        req.transaksi.authIDWarehouse = req.body.verificationWarehouseId;
        req.transaksi.orderNumber = req.body.orderNumber;
        req.transaksi.memoCancel = req.body.memoCancel;
        req.transaksi.noreksId = req.body.noreksId;
        req.transaksi.biayatambahan = req.body.biayatambahan;
        req.transaksi.biayacod = req.body.biayacod;
        req.transaksi.subsidicod = req.body.subsidicod;
        req.transaksi.totalharga = req.body.totalharga;
        req.transaksi.packingKayu = req.body.packingKayu;
        if (req.body.verificationFinanceId != null) {
            req.transaksi.tanggalVerifikasi = new Date(date.getTime() - (offset*60*1000)) 
        }
        if (req.body.verificationWarehouseId != null) {
            req.transaksi.tanggalAWB = new Date(date.getTime() - (offset*60*1000)) 
        }
        req.transaksi.save().then(transaksi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
        })
    },

    async showByLead(req, res) {
        let result = await transaksis_temp.findOne({
            where: {
                leadsId: req.params.id,
            },
            include: [ 
                { 
                    model: leads,
                },
            ]
            
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

}
