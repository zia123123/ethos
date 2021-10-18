const { domains } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await domains.create({
            name: req.body.name,
            url: req.body.url,
            type: req.body.type,
            authId: req.body.authId,
            description: req.body.description,
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

    // Update
    async update(req, res) {
        req.domain.name = req.body.name;
        req.domain.url = req.body.url;
        req.domain.type = req.body.type;
        req.domain.authId = req.body.authId;
        req.domain.description = req.body.description;
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
