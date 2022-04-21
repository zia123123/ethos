const { products,product_stocks,suppliers,warehouses } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: 'ethos-firestore-key.json' });
const bucketName = 'dev-edmms';

module.exports = {
  

    //create
    async create(req, res) { 

        var link = req.files[0].filename
        let result = await products.create({
            name: req.body.name,
            expiry_date: req.body.expiry_date,
            conversion: req.body.conversion,
            price: req.body.price,
            weight: req.body.weight,
            discount: req.body.discount,
            is_active: true,
            quantity: 0,
            hpp: req.body.hpp,
            sku: req.body.sku,
            unitId: req.body.unitId,
            link: "https://storage.googleapis.com/ethos-kreatif-app.appspot.com/"+link,
            supplierId: req.body.supplierId,
            interval_year_expiry_date: req.body.interval_year_expiry_date
        }).then(result => {
           
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },
      async finddelete(req, res, next) {
        let product = await products.findByPk(req.params.id);
        if (!product) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.product = product;
            next();
        }
    },

      async find(req, res) {
        let result = await products.findOne({
            where: {
                id: req.params.id,
             },            include: [ 
                { model: product_stocks,
                    attributes: ['quantity','warehouseId'],
                },
                { model: suppliers,
                    attributes: ['name'],
                }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async findUpdate(req, res, next) {
        let product = await products.findByPk(req.params.id);
        if (!product) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.product = product;
            next();
        }
    },

    async index(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await products.count({
            // where: {
            //     status: {
            //         [Op.or]: [
            //             {
            //         [Op.like]: '%D%'
            //     },
            //     {
            //         [Op.like]: '%C%'
            //     }, {
            //         [Op.like]: '%E%'
            //     }
            //     ]
            //     },
            // }
        })
        let result = await products.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            attributes: ['weight','id', 'name','expiry_date','price','link','discount','quantity','sku','hpp'],
            include: [ 
                // { model: product_stocks,
                //     attributes: ['quantity','warehouseId'],
                //     include: [ 
                //         { model: warehouses,
                //             attributes: ['name'],
                //         }
                //     ]
                // },
                { model: suppliers,
                    attributes: ['name'],
                }
            ]
        }).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async indexBySupp(req, res) {
        let result = await products.findAll({
            where: {
                supplierId: req.query.supplierId,
             },
            attributes: ['weight','id', 'name','expiry_date','price','link','discount','quantity','sku'],
            include: [ 
                // { model: product_stocks,
                //     attributes: ['quantity','warehouseId'],
                //     include: [ 
                //         { model: warehouses,
                //             attributes: ['name'],
                //         }
                //     ]
                // },
                { model: suppliers,
                    attributes: ['name'],
                }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexWarehouse(req, res) {
        let result = await product_stocks.findAll({
            where: {
                warehouseId:  req.params.warehouseId
            },
            attributes: ['quantity','id'],
            include: [ 
                { model: products,
                    attributes: ['weight','id', 'name','expiry_date','price','link','discount','quantity','sku'],
                },
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
        req.product.hpp = req.body.hpp;
        req.product.weight = req.body.weight;
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
