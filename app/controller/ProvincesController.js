const { provinces } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await provinces.create({
            name: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let province = await provinces.findByPk(req.params.id);
        if (!district) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.province = province;
            next();
        }
    },

    async index(req, res) {
        let result = await provinces.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.province);
    },

    // Update
    async update(req, res) {
        req.province.name = req.body.name;
        req.province.save().then(province => {
        return apiResponse.successResponseWithData(res, "SUCCESS", province);
        })
    },

    // Delete
    async delete(req, res) {
        req.province.destroy().then(province => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
