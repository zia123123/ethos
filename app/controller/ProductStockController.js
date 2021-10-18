const { product_stocks } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {




    //create
    async create(req, res) { 
        let result = await product_stocks.create({
            productId: req.body.productId,
            warehouseId: req.body.warehouseId,
            quantity: req.body.quantity,
            remark: req.body.remark,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let product_stock = await product_stocks.findByPk(req.params.id);
        if (!product_stock) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.product_stock = product_stock;
            next();
        }
    },

    async index(req, res) {
        let result = await product_stocks.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.product_stock);
    },

    // Update
    async update(req, res) {
        req.product_stock.productId = req.body.productId;
        req.product_stock.warehouseId = req.body.warehouseId;
        req.product_stock.quantity = req.body.quantity;
        req.product_stock.remark = req.body.remark;
        req.product_stock.save().then(product_stock => {
        return apiResponse.successResponseWithData(res, "SUCCESS", product_stock);
        })
    },

    // Delete
    async delete(req, res) {
        req.product_stock.destroy().then(product_stock => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
