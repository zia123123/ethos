const { transaksis,statustranksasis,keranjangs,products } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

      
  
    //create
    async create(req, res) { 
        let keranjangdata =  req.body.products.replace(/\\n/g, '')
        let datakeranjang = eval(keranjangdata)
        let result = await transaksis.create({
            nama: req.body.nama,
            customerId: req.body.customerId,
            districtId: req.body.districtId,
            provinceId: req.body.provinceId,
            cityregencyId: req.body.cityregencyId,
            warehouseId: req.body.warehouseId,
            invoiceId: req.body.warehouseId,
            expedisiName: req.body.expedisiName,
            authId: req.body.authId,
            idtransaksi: req.body.idtransaksi,
            products: keranjangdata,
            discount: req.body.discount,
            totalharga: req.body.totalharga,
            pembayaran: req.body.pembayaran,
            status:  req.body.status,
            logstatus:  req.body.logstatus,
            memotransaksi: req.body.memotransaksi,
        }).then(result => {
            let keranjang = keranjangs.bulkCreate(datakeranjang, { individualHooks: true }).then(keranjang =>{
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            })
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
          
        }).then(result => {
            req.transaksi = result;
            next();
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async index(req, res) {
        let result = await transaksis.findAll({
            attributes: ['id', 'nama','createdAt','pembayaran','status'],
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
    

    async filterTransaksi(req, res) {
        let result = await transaksis.findAll({
            where: {
                [Op.or]: [
                    {nama: req.params.clue},
                ]
            },
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
