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
        let date = req.query.date
        let product = req.query.product
        // let paymentMethod = req.query.paymentMethod
        let warehouseId = req.query.warehouseId

        if (warehouseId == null) {
            warehouseId = ""
        }
        if (date == null) {
            startDate = new Date("2015-01-01 07:00:00")
            endDate = new Date()
        }else{
            startDate = new Date(date + " 07:00:00")
            endDate = new Date(date + " 06:59:59").setDate(new Date(startDate).getDate() + 1)
        }
        if (product == null) {
            product = ""
        }

        const count = await product_stocks.count(
            {
                where: {
                    warehouseId: {
                        [Op.like]: '%'+warehouseId+'%'
                    },
                    createdAt: {
                        [Op.like]: '%'+date+'%'
                    },
                },
            }
        )
        let result = await product_stocks.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
            },
            order: [
                ['id', 'DESC'],
            ],
            include: [ 
                { 
                    model: products,
                    where:{
                        name: {
                            [Op.like]: '%'+product+'%'
                        },
                    }
                },
                { 
                    model: warehouses,
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
