const { iklans } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await iklans.create({
            url: req.body.url,
            namaproduct: req.body.namaproduct,
            status:false,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let iklan = await iklans.findByPk(req.params.id);
        if (!iklan) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.iklan = iklan;
            next();
        }
    },

    async index(req, res) {
        let result = await iklans.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.iklan);
    },

    // Update
    async update(req, res) {

        req.iklan.url = req.body.url;        
        req.iklan.namaproduct = req.body.namaproduct;
        req.iklan.status = req.body.status;
        req.iklan.save().then(iklan => {
        return apiResponse.successResponseWithData(res, "SUCCESS", iklan);
        })
    },

    // Delete
    async delete(req, res) {
        req.iklan.destroy().then(iklan => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
