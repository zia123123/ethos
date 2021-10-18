const { prices } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {


    //create
    async create(req, res) { 
        let result = await prices.create({
            typeTransaksi: req.body.typeTransaksi,
            hpp: req.body.hpp,
            price: req.body.price,
            stock: req.body.stock,
            start: req.body.start,
            end: req.body.end,
            namadomain: req.body.namadomain,
            productId: req.body.productId,
            url: req.body.url,
            keterangan: req.body.keterangan,
            status: true,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let price = await prices.findByPk(req.params.id);
        if (!price) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.price = price;
            next();
        }
    },
    // async findRt(req, res, next) {
    //     let vote = await votes.findAll({
    //         where: {
    //             [Op.or]: [
    //                 {rt: req.params.rt},
    //                 {rw: true}
    //             ]
    //         },
    //     });
    //     if (!vote) {
    //     return apiResponse.notFoundResponse(res, "Not Fond");
    //     } else {
    //         req.vote = vote;
    //         next();
    //     }
    // },


    async index(req, res) {
        let result = await prices.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.price);
    },

    // Update
    async updateStock(req, res) {
        req.product.nama = req.body.nama;
        req.product.stock = req.body.stock;
        req.product.save().then(product => {
        return apiResponse.successResponseWithData(res, "SUCCESS", product);
        })
    },

    // Delete
    async delete(req, res) {
        req.product.destroy().then(vote => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
