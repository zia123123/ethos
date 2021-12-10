const { transaksis,statustranksasis,keranjangs,products,daexpedisis,customers    } = require('../models/index');
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
                    attributes: ['biayatambahan','norekening','biayacod','createdAt'],
                }
            ]
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

    async indexAll(req, res) {
        let result = await transaksis.findAll({
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank'],
                }
            ]
             
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async jumlahClosing(req, res) {
        let result = await transaksis.count()({ 
            where: {
                [Op.or]: [
                    {status: 'I'},
                ]
             },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahLead(req, res) {
        let result = await transaksis.count()({ 
            where: {
                [Op.LIKE]: [
                    {status: 'A'},
                ]
             },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async jumlahOnprogress(req, res) {
        let result = await transaksis.count()({ 
            where: {
                status: 'D'
             },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahRetur(req, res) {
        let result = await transaksis.count()({ 
            where: {
                status: 'K'
             },
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

    async getDetail(req, res) {
        let result = await transaksis.findOne({
            where: {
                    id: req.params.id,
            },
            //attributes: ['id', 'nama','status','districtId','memotransaksi','idtransaksi','expedisiName'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt'],
                },
                { model: customers,
                }
            ]
            
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
