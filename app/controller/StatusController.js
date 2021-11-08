const { statustranksasis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await statustranksasis.create({
            nama: req.body.nama,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let statustranksasi = await statustranksasis.findByPk(req.params.id);
        if (!statustranksasi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.statustranksasi = statustranksasi;
            next();
        }
    },

    async index(req, res) {
        let result = await statustranksasis.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.statustranksasi);
    },

    // Update
    async update(req, res) {
        req.statustranksasi.name = req.body.name;
        req.statustranksasi.save().then(statustranksasi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", statustranksasi);
        })
    },

    // Delete
    async delete(req, res) {
        req.statustranksasi.destroy().then(statustranksasi => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
