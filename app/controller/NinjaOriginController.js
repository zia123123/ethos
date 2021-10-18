const { ninjaorigins } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await ninjaorigins.create({
            origin: req.body.origin,
            index: req.body.index,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let ninjaorigin = await ninjaorigins.findByPk(req.params.id);
        if (!ninjaorigin) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.ninjaorigin = ninjaorigin;
            next();
        }
    },

    async index(req, res) {
        let result = await ninjaorigins.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.ninjaorigin);
    },

    // Update
    async update(req, res) {
        req.ninjaorigin.origin = req.body.origin;
        req.ninjaorigin.index = req.body.index;
        req.ninjaorigin.save().then(ninjaorigin => {
        return apiResponse.successResponseWithData(res, "SUCCESS", ninjaorigin);
        })
    },

    // Delete
    async delete(req, res) {
        req.ninjaorigin.destroy().then(ninjaorigin => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
