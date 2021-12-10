const { products,product_stocks } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  

    //create
    async create(req, res) { 
        var link = req.files.link == null ? null : req.files.link[0].filename
        let result = await products.create({
            name: req.body.name,
            expiry_date: req.body.expiry_date,
            conversion: req.body.conversion,
            price: req.body.price,
            discount: req.body.discount,
            is_active: true,
            link: 'http://34.101.240.70:3000/images/'+link,
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

    async index(req, res) {
        let result = await products.findAll({
            attributes: ['id', 'name','expiry_date','price','link','discount'],
            include: [ 
                { model: product_stocks,
                    attributes: ['quantity','warehouseId'],
                }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexWarehouse(req, res) {
        let result = await products.findAll({
            attributes: ['id', 'name','expiry_date','price','link','discount'],
            include: [ 
                { model: product_stocks,
                    where: {
                        warehouseId:  req.params.warehouseId
                    },
                    attributes: ['quantity'],
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
        return apiResponse.successResponseWithData(res, "SUCCESS", req.product);
    },

    // Update
    async updateProduct(req, res) {
        req.product.name = req.body.name;
        req.product.expiry_date = req.body.expiry_date;
        req.product.conversion = req.body.conversion;
        req.product.price = req.body.price;
        req.product.discount = req.body.discount;
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
