const { mapprice,auths,products,groupId } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await mapprice.create({
            groupId: req.body.groupId,
            productId: req.body.productId,
            hpp: req.body.hpp,
            status: req.body.status,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await mapprice.findByPk(req.params.id);
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },
    async index(req, res) {
        let result = await mapprice.findAll({
            include: [ { model: products,
                attributes: ['id', 'name'] },
                { model: group,
                    attributes: ['id', 'name'] },
            ],
            attributes: ['id','status','hpp','createdAt']
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async getByGroup(req, res) {
        let result = await mapcs.findAll({
            where:{
                groupId: req.query.groupId
            },
            include: [ { model: products,
                attributes: ['id', 'name'] },
            ],
            attributes: ['id','status','hpp','createdAt']
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
        req.result.hpp = req.body.hpp;
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
