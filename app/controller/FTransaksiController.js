const { metodepembayarans, nomorekenings,typepelanggans, statustranksasis, jenispakets } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async createMPembayaran(req, res) { 
        let result = await metodepembayarans.create({
            nama: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async indexMPembayaran(req, res) {
        let result = await metodepembayarans.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


     //create
     async createnomorekenings(req, res) { 
        let result = await nomorekenings.create({
            nomor: req.body.nomor,
            nama_bank: req.body.nama_bank
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

      //index
    async indexnomorekenings(req, res) {
        let result = await nomorekenings.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


      //create
      async createtypepelanggans(req, res) { 
        let result = await typepelanggans.create({
            nama: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

      //index
    async indextypepelanggans(req, res) {
        let result = await typepelanggans.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


        //create
        async createstatustranksasis(req, res) { 
            let result = await statustranksasis.create({
                nama: req.body.name,
            }).then(result => {
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            }).catch(function (err)  {
                return apiResponse.ErrorResponse(res, err);
            });
          },
    
          //index
        async indexstatustranksasis(req, res) {
            let result = await statustranksasis.findAll({
            }).then(result => {
                return apiResponse.successResponseWithData(res, "SUCCESS", result);
                }).catch(function (err){
                    return apiResponse.ErrorResponse(res, err);
                });
        },

          //create
          async createjenispakets(req, res) { 
            let result = await jenispakets.create({
                nama: req.body.name,
            }).then(result => {
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            }).catch(function (err)  {
                return apiResponse.ErrorResponse(res, err);
            });
          },
    
          //index
        async indexsjenispakets(req, res) {
            let result = await jenispakets.findAll({
            }).then(result => {
                return apiResponse.successResponseWithData(res, "SUCCESS", result);
                }).catch(function (err){
                    return apiResponse.ErrorResponse(res, err);
                });
        },
   
 

}
