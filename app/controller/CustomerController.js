const { customers } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await customers.create({
            nama: req.body.nama,
            notelp: req.body.notelp,
            email: req.body.email,
            alamat: req.body.alamat,
            rt:req.body.rt,
            rw:req.body.rw,
            memoid: req.body.memoid,
            province:req.body.province,
            jeniskelamin:req.body.jeniskelamin,
            pekerjaan:req.body.pekerjaan,
            kelurahan: req.body.kelurahan,
            postalcode: req.body.postalcode,
            city: req.body.city,
            districtId: req.body.districtId,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let customer = await customers.findByPk(req.params.id);
        if (!customer) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.customer = customer;
            next();
        }
    },

    async index(req, res) {
        let result = await customers.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.customer);
    },

    // Update
    async update(req, res) {
        req.customer.nama = req.body.nama;
        req.customer.notelp = req.body.notelp;
        req.customer.email = req.body.email;
        req.customer.alamat = req.body.alamat +", RT :" +req.body.rt +", RW :" +req.body.rw +", Kecamatan :" +req.body.kecamatan +", Kelurahan :"+ req.body.kelurahan;
        req.customer.postalcode = req.body.postalcode;
        req.customer.city = req.body.city;
        req.customer.districtId = req.body.districtId;
        req.customer.provinceId = req.body.provinceId;
        req.customer.cityregencyId = req.body.cityregencyId;
        req.customer.save().then(customer => {
        return apiResponse.successResponseWithData(res, "SUCCESS", customer);
        })
    },

    // Delete
    async delete(req, res) {
        req.customer.destroy().then(customer => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
