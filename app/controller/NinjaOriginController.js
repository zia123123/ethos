const { expedisis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await expedisis.create({
            name: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let expedisi = await expedisis.findByPk(req.params.id);
        if (!expedisi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.expedisi = expedisi;
            next();
        }
    },

    async index(req, res) {
        let result = await expedisis.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.expedisi);
    },

    // Update
    async update(req, res) {
        req.expedisi.name = req.body.name;
        req.expedisi.save().then(expedisi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", expedisi);
        })
    },

    // Delete
    async delete(req, res) {
        req.expedisi.destroy().then(ninjaorigin => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
