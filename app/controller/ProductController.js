const { products } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  

    //create
    async create(req, res) { 
        let result = await products.create({
            name: req.body.name,
            expiry_date: req.body.expiry_date,
            conversion: req.body.conversion,
            price: req.body.price,
            is_active: true,
            supplierId: req.body.supplierId,
            interval_year_expiry_date: req.body.interval_year_expiry_date
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let product = await products.findByPk(req.params.id);
        if (!product) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.product = product;
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
        let result = await products.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.product);
    },

    // Update
    async updateProduct(req, res) {
        req.product.name = req.body.name;
        req.product.expiry_date = req.body.expiry_date;
        req.product.conversion = req.body.conversion;
        req.product.price = req.body.price;
        req.product.is_active = req.body.is_active;
        req.product.interval_year_expiry_date = req.body.interval_year_expiry_date;
        req.product.supplierId = req.body.supplierId;
        req.product.save().then(product => {
        return apiResponse.successResponseWithData(res, "SUCCESS", product);
        })
    },

    // Delete
    async delete(req, res) {
        req.product.destroy().then(product => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
