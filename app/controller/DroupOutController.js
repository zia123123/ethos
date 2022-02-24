const { catalog,products,rangesicepat,inbond,dropout } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await dropout.create({
            productId: req.body.productId,
            inbondId: req.body.inbondId,
            nomordo: req.body.nomordo,
            jumlahbarang: req.body.jumlahbarang,
        }).then(result => {
            let rinbond = inbond.findOne({
                where: {
                    id: req.body.inbondId
                },
            }).then(rinbond =>{
                let product = products.findOne({
                    where: {
                        id:  req.body.productId
                    },
                }).then(product =>{
                    product.quantity = (parseInt(product.quantity) + parseInt(req.body.jumlahbarang));
                    product.save()
                })
                rinbond.totalbarangsampai =  rinbond.totalbarangsampai+parseInt(req.body.jumlahbarang)
                rinbond.save()
            })
          
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },


    async find(req, res, next) {
        let result = await dropout.findOne({
            where: {
                    id: req.params.id,
            },
        });
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },

    async index(req, res) {
        let result = await dropout.findAll({
            where: {
                inbondId: req.query.inbondId,
                },
            include: [ { model: products,
                attributes: ['name'],
            }]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexKu(req, res) {
        let result = await dropout.findAll({
            where: {
                authId: req.query.id,
        },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        req.result.jumlahbarang = req.body.jumlahbarang;
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },

    // Delete
    async delete(req, res) {
        let rinbond = inbond.findOne({
            where: {
                id: req.result.inbondId
            },
        }).then(rinbond =>{
            rinbond.totalbarangpesan =  rinbond.totalbarangsampai-req.result.jumlahbarang
            rinbond.save()
        })
        req.result.destroy().then(result => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
