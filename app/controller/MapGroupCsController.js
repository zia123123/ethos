const { mapgroupcs } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");


module.exports = {
    //create
    async create(req, res) { 
        let result = await mapgroupcs.create({
            keterangan: req.body.keterangan,
            groupcsId: req.body.groupcsId,
            authId: req.body.id_cs,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let mapgroupcs = await mapgroupcs.findByPk(req.params.id);
        if (!mapgroupcs) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.mapgroupcs = mapgroupcs;
            next();
        }
    },

    async index(req, res) {
        let result = await mapgroupcs.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.mapgroupcs);
    },

    // Update
    async update(req, res) {
        req.mapgroupcs.groupcsId = req.body.groupcsId;
        req.mapgroupcs.csId = req.body.csId;
        req.mapgroupcs.save().then(mapgroupcs => {
        return apiResponse.successResponseWithData(res, "SUCCESS", mapgroupcs);
        })
    },

    // Delete
    async delete(req, res) {
        req.mapgroupcs.destroy().then(mapgroupcs => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
