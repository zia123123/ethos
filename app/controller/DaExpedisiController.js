const { daexpedisis,transaksis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
     
     
        var harga = (parseInt(req.body.totalharga) - (parseInt(req.body.transaksiId) % 999));
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
                if(transaksi.warehouseId != 1 && transaksi.expedisiName == "sicepat" ){
                    let rangesicepat = rangesicepat.findOne({
                        where: {
                            id: 1
                        },
                    }).then(rangesicepat =>{
                       transaksi.awb = (rangesicepat.kode+1)
                       rangesicepat.kode = (rangesicepat.kode+1)
                    })
                }
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
