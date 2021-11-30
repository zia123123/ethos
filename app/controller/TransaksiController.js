const { transaksis,statustranksasis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

      
  
    //create
    async create(req, res) { 
        let result = await transaksis.create({
            name: req.body.nama,
            notelp1: req.body.notelp,
            notelp2: req.body.notelp2,
            districtId: req.body.districtId,
            alamat: req.body.kecamatan+", "+req.body.kota+", "+req.body.provinsi,
            gudang: req.body.gudang,
            expedisisId: req.body.expedisiId,
            authId: req.body.idpembuat,
            discount: req.body.discount,
            totalharga: req.body.totalharga,
            pembayaran: req.body.pembayaran,
            status:  req.body.status,
            products:  req.body.products,
            logstatus:  req.body.logstatus,
            memotransaksi: req.body.memotransaksi,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await transaksis.findAll({
            where: {
               id: req.params.id
            },
            attributes: ['id', 'name','createdAt','pembayaran'],
        }).then(result => {
            req.transaksi = result;
            next();
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async index(req, res) {
        let result = await transaksis.findAll({
            attributes: ['id', 'name','createdAt','pembayaran','status'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexAll(req, res) {
        let result = await transaksis.findAll({
          
        }).then(result => {
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

    async findByuser(req, res) {
        let result = await transaksis.findAll({
            where: {
               authId: req.params.userid
            },
            attributes: ['id', 'name','createdAt','pembayaran','status','products'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    

    async filterTransaksi(req, res) {
        let result = await transaksis.findAll({
            where: {
                [Op.or]: [
                    {name: req.params.clue},
                    {pembayaran:  req.params.clue},
                    {status:  req.params.clue},
                ]
            },
            attributes: ['id', 'name','createdAt','pembayaran','status']
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
        req.transaksi.logstatus = req.transaksi.logstatus+"#"+req.body.logstatus;
        req.transaksi.save().then(transaksi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
        })
    },

    // Delete
    async delete(req, res) {
        req.transaksi.destroy().then(province => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
