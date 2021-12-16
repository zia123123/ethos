const { keranjangs } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await keranjangs.create({
              namaproduct: req.body.namaproduct,
              jumlahproduct: req.body.jumlahproduct,
              linkdomain: req.body.linkdomain,
              linkphoto: req.body.linkphoto,
              discount: req.body.discount,
              transaksiId: req.body.transaksiId,
              productId: req.body.productId,
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
    async findByIdtransaksi(req, res) {
        let result = await keranjangs.findAll({
            where: {
                transaksiId: {
                [Op.like]: req.params.transaksiId,
            },
        },
        attributes: ['id', 'namaproduct','jumlahproduct','linkdomain','linkphoto','discount','price'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async sumtotal(req, res) {
        let result = await keranjangs.sum('price',{
            where: {
                transaksiId: {
                [Op.like]: req.params.transaksiId,
            },
        },
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

    // Update
    async update(req, res) {
        req.keranjang.namaproduct = req.body.namaproduct;
        req.keranjang.jumlahproduct = req.body.jumlahproduct;
        req.keranjang.linkdomain = req.body.linkdomain;
        req.keranjang.linkphoto = req.body.linkphoto;
        req.keranjang.discount = req.body.discount;
        req.keranjang.transaksiId = req.body.transaksiId;
        req.keranjang.save().then(keranjang => {
        return apiResponse.successResponseWithData(res, "SUCCESS", keranjang);
        })
    },

    // Delete
    async delete(req, res) {
        req.keranjang.destroy().then(keranjang => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
