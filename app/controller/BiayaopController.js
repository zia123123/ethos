const { biayaop } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 

        let result = await biayaop.create({
            type: req.body.type,
            nama: req.body.nama,
            keterangan: req.body.keterangan,
            jumlahtagihan: req.body.jumlahtagihan,
            tanggal: req.body.tanggal,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

      ///
    async find(req, res, next) {
        let result = await biayaop.findOne({
            where: {
                    id: req.params.id,
            },
        });
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },

    async index(req, res) {
        let result = await biayaop.findAll({
          
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        req.result.type = req.body.type;
        req.result.nama = req.body.nama;
        req.result.keterangan = req.body.keterangan;
        req.result.jumlahtagihan = req.body.jumlahtagihan;
        req.result.tanggal = req.body.tanggal;
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },

    // Delete
    async delete(req, res) {
        req.result.destroy().then(result => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
