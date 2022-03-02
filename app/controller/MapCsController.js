const { mapcs,auths,domains } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await mapcs.create({
            authId: req.body.authId,
            domainId: req.body.domainId,
            status: req.body.status,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await mapcs.findByPk(req.params.id);
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },
    async index(req, res) {
        let result = await mapcs.findAll({
            where:{
                authId: req.query.authId
            },
            attributes: ['id', 'status'],
            include: [ { model: domains,
                attributes: ['id', 'url','productId'], 
                include: [ { model: auths,
                    attributes: ['id', 'firstname'] },
                ],},
            ],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async getDataCs(req, res) {
        let result = await mapcs.findAll({
            where:{
                domainId: req.query.domainId
            },
            include: [ { model: auths,
                attributes: ['id', 'firstname'] },
            ],
            attributes: ['id','status', 'createdAt']
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
        req.result.status = req.body.status;
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },

    // Delete
    async delete(req, res) {
        req.result.destroy().then(result => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
