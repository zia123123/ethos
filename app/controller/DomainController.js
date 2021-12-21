const { domains } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await domains.create({
            url: req.body.url,
            authId: req.body.advertiserid,
            productId: req.body.productId,
            nameproduct: req.body.nameproduct,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let domain = await domains.findByPk(req.params.id);
        if (!domain) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.domain = domain;
            next();
        }
    },

    async index(req, res) {
        let result = await domains.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.domain);
    },




    async updateDataIklan(req, res) {
        req.domain.url = req.body.url;
        req.domain.productId = req.body.productId;
        req.domain.nameproduct = req.body.nameproduct;
        req.domain.status = req.body.status;
        req.domain.save().then(domain => {
        return apiResponse.successResponseWithData(res, "SUCCESS", domain);
        })
    },

    async updateBiayaIklan(req, res) {
        req.domain.biayaiklan = req.body.biayaiklan;
        req.domain.save().then(domain => {
        return apiResponse.successResponseWithData(res, "SUCCESS", domain);
        })
    },

    // Delete
    async delete(req, res) {
        req.domain.destroy().then(domain => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
