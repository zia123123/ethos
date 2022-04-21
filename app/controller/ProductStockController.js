const { product_stocks,products,warehouses } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await product_stocks.create({
            inbound: req.body.inbound,
            nodeliverorder: req.body.nodeliverorder,
            nopurchase: req.body.nopurchase,
            productId: req.body.productId,
            warehouseId: req.body.warehouseId,
            nopo: req.body.nopo,
            quantity: req.body.quantity,
            remark: req.body.remark,
        }).then(result => {
            let product = products.findOne({
                where: {
                    id:  req.body.productId
                },
            }).then(product =>{
                product.quantity = (parseInt(product.quantity) + parseInt(req.body.quantity));
                product.save()
            })
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
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await product_stocks.count()
        let result = await product_stocks.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [
                ['id', 'DESC'],
            ],
            include: [ 
                { model: products,
                },
                { model: warehouses,
                    attributes: ['name'],
                }
            ],

        }).then(result => {
            // var totaldatanya = 0
            // let totaldata = product_stocks.count().then(totaldata =>{
            //     totaldatanya = totaldata.length 
            // })
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

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.product_stock);
    },

    // Update
    async update(req, res) {

        req.product_stock.inbound = req.body.inbound;
        req.product_stock.nodeliverorder = req.body.nodeliverorder;
        req.product_stock.nopurchase = req.body.nopurchase;
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
