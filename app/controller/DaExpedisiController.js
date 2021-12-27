const { daexpedisis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await daexpedisis.create({
            ongkoskirim: req.body.ongkoskirim,
            subsidi: req.body.subsidi,
            transaksisId: req.body.transaksiId,
            namabank: req.body.namabank,
            biayatambahan: req.body.biayatambahan,
            norekening: req.body.norekening ,
            biayacod: req.body.biayacod,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async index(req, res) {
        let result = await daexpedisis.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


}
