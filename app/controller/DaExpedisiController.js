const { daexpedisis,transaksis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
     var harga = parseInt(req.body.totalharga)
      if(parseInt(req.body.transaksiId) % 2 === 0) {
        harga = ( harga - (parseInt(req.body.transaksiId) % 999));
      }else{
        harga = ( harga + (parseInt(req.body.transaksiId) % 999));
      }
        let result = await daexpedisis.create({
            ongkoskirim: req.body.ongkoskirim,
            subsidi: req.body.subsidi,
            transaksisId: req.body.transaksiId,
            namabank: req.body.namabank,
            totalharga: harga,
            biayatambahan: req.body.biayatambahan,
            norekening: req.body.norekening ,
            biayacod: req.body.biayacod,
        }).then(result => {
            let transaksi = transaksis.findOne({
                where: {
                    id: req.body.transaksiId
                },
            }).then(transaksi =>{
                transaksi.invoiceId = req.body.invoiceId;
                transaksi.save()
            })
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
