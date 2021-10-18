const { offices } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await offices.create({
            name: req.body.name,
            address: req.body.address,
            sub_district: req.body.sub_district,
            phone_number: req.body.phone_number,
            is_active: true,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let office = await offices.findByPk(req.params.id);
        if (!office) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.office = office;
            next();
        }
    },
    async index(req, res) {
        let result = await offices.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.office);
    },

    // Update
    async update(req, res) {
        req.office.name = req.body.name;
        req.office.address = req.body.address;
        req.office.sub_district = req.body.sub_district;
        req.office.phone_number = req.body.phone_number;
        req.office.save().then(office => {
        return apiResponse.successResponseWithData(res, "SUCCESS", office);
        })
    },

    // Delete
    async delete(req, res) {
        req.office.destroy().then(office => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
