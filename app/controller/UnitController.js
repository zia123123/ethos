const { units } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await units.create({
            name: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let unit = await units.findByPk(req.params.id);
        if (!unit) {
        return unit.notFoundResponse(res, "Not Fond");
        } else {
            req.unit = unit;
            next();
        }
    },

    async index(req, res) {
        let result = await units.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.unit);
    },

    // Update
    async update(req, res) {
        req.unit.name = req.body.name;
        req.unit.save().then(unit => {
        return apiResponse.successResponseWithData(res, "SUCCESS", unit);
        })
    },

    // Delete
    async delete(req, res) {
        req.unit.destroy().then(unit => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
