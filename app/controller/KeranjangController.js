const { keranjangs } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await keranjangs.create({
            productId: req.body.productId,
            transaksiId: req.body.transaksiId,
            namaproduct: req.body.namaproduct,
            jumlah: req.body.jumlah,
            price: req.body.price,
            domain: req.body.domain,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let keranjang = await keranjangs.findByPk(req.params.id);
        if (!keranjang) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.keranjang = keranjang;
            next();
        }
    },

    async index(req, res) {
        let result = await keranjangs.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.keranjang);
    },
    // Delete
    async delete(req, res) {
        req.keranjang.destroy().then(keranjang => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
