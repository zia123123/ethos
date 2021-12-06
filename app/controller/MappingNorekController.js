const { mappingnoreks } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");


module.exports = {
    //create
    async create(req, res) { 
        let result = await mappingnoreks.create({
            keterangan: req.body.keterangan,
            authId: req.body.id_cs,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let mappingnorek = await mappingnoreks.findByPk(req.params.id);
        if (!mappingnorek) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.mappingnorek = mappingnorek;
            next();
        }
    },

    async index(req, res) {
        let result = await mappingnoreks.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.mappingnorek);
    },

    // Update
    async update(req, res) {
        req.mappingnorek.authId = req.body.csId;
        req.mappingnorek.save().then(mappingnorek => {
        return apiResponse.successResponseWithData(res, "SUCCESS", mappingnorek);
        })
    },

    // Delete
    async delete(req, res) {
        req.mappingnorek.destroy().then(mappingnorek => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
