const { transaksis,statustranksasis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

      
  
    //create
    async create(req, res) { 
        let result = await transaksis.create({
            nama: req.body.nama,
            notelp: req.body.notelp,
            alamat: req.body.alamat,
            domainId: req.body.domainId,
            warehouseId: req.body.warehouseId,
            expedisiId: req.body.expedisiId,
            authId: req.body.idpembuat,
            discount: req.body.discount,
            totalharga: req.body.totalharga,
            typebayar: req.body.typebayar,
            statustransaksiId: req.body.statustransaksi,
            memo: req.body.memo,
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
            attributes: ['id', 'nama','createdAt','typebayar'],
            include: [ 
                { model: statustranksasis,
                    attributes: ['nama'],
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
            attributes: ['id', 'nama','createdAt','typebayar'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async findByuser(req, res) {
        let result = await transaksis.findAll({
            where: {
               authId: req.params.userid
            },
            attributes: ['id', 'nama','createdAt','typebayar'],
            include: [ 
                { model: statustranksasis,
                    attributes: ['nama'],
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
                    {typebayar:  req.params.clue},
                    {statustransaksiId:  req.params.clue},
                ]
            },
            attributes: ['id', 'nama','createdAt','typebayar'],
            include: [ 
                { model: statustranksasis,
                    attributes: ['nama'],
                }
            ]
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

    // Delete
    async delete(req, res) {
        req.transaksi.destroy().then(province => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
