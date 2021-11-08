const { dataexpedisis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await dataexpedisis.create({
            ongkoskirim: req.body.name,
            subsidi: req.body.subsidi,
            transaksiId: req.body.transaksiId,
            biayatambahan: req.body.biayatambahan,
            norekening: req.body.norekening,
            biayacod: req.body.biayacod,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let dataexpedisi = await dataexpedisis.findByPk(req.params.id);
        if (!dataexpedisi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.dataexpedisi = dataexpedisi;
            next();
        }
    },
    async index(req, res) {
        let result = await dataexpedisis.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.dataexpedisi);
    },

    // Update
    async update(req, res) {
        req.dataexpedisi.ongkoskirim = req.body.name;
        req.dataexpedisi.subsidi = req.body.subsidi;
        req.dataexpedisi.transaksiId = req.body.transaksiId;
        req.dataexpedisi.biayatambahan = req.body.biayatambahan;
        req.dataexpedisi.norekening = req.body.norekening;
        req.dataexpedisi.biayacod = req.body.biayacod;
        req.dataexpedisi.save().then(office => {
        return apiResponse.successResponseWithData(res, "SUCCESS", dataexpedisi);
        })
    },

    // Delete
    async delete(req, res) {
        req.dataexpedisi.destroy().then(dataexpedisi => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
