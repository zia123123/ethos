const { cityregencies,sequelize} = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await cityregencies.create({
            name: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let cityregency = await cityregencies.findByPk(req.params.id);
        if (!cityregency) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.cityregency = cityregency;
            next();
        }
    },

    async index(req, res) {
        let result = await sequelize.query(
            'SELECT id,name FROM reg_regencies WHERE province_id = :id',
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
        return apiResponse.successResponseWithData(res, "SUCCESS", req.cityregency);
    },

    // Update
    async updateProduct(req, res) {
        req.cityregency.name = req.body.name;
        req.cityregency.save().then(cityregency => {
        return apiResponse.successResponseWithData(res, "SUCCESS", cityregency);
        })
    },

    // Delete
    async delete(req, res) {
        req.cityregency.destroy().then(cityregency => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
