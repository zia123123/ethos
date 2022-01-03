const { districts,sequelize } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await districts.create({
            name: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let district = await districts.findByPk(req.params.id);
        if (!district) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.district = district;
            next();
        }
    },

    async index(req, res) {
        let result = await sequelize.query(
            'SELECT id,name FROM reg_districts WHERE regency_id = :id',
            {
              replacements: { id: req.params.id },
              type: sequelize.QueryTypes.SELECT}
          ).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.district);
    },

    // Update
    async updateProduct(req, res) {
        req.district.name = req.body.name;
        req.district.save().then(district => {
        return apiResponse.successResponseWithData(res, "SUCCESS", district);
        })
    },

    // Delete
    async delete(req, res) {
        req.district.destroy().then(district => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
