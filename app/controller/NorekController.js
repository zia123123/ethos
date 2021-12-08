const { nomorekenings,auths } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await nomorekenings.create({
            nama_bank: req.body.nama_bank,
            nomor: req.body.nomor,
            authId: req.body.cs_id,
            createdBy: req.body.createdBy,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let nomorekening = await nomorekenings.findByPk(req.params.id);
        if (!nomorekening) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.nomorekening = nomorekening;
            next();
        }
    },
    async index(req, res) {
        let result = await nomorekenings.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async getNorekBycs(req, res) {
        let result = await nomorekenings.findAll({
            where:{
                authId: req.params.id
            },
            attributes: ['id', 'nomor','nama_bank','createdBy',],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async getNorekByfinance(req, res) {
        let result = await nomorekenings.findAll({
            where:{
                createdBy: req.params.id
            },
            attributes: ['id', 'nomor','nama_bank','createdBy','authId'],
            include: [ 
                { model: auths,
                    attributes: ['id','firstname'],
                }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.nomorekening);
    },

    // Update
    async update(req, res) {
        req.nomorekening.nama_bank = req.body.nama_bank;
        req.nomorekening.nomor = req.body.nomor;
        req.nomorekening.authId = req.body.authId;
        req.nomorekening.createdBy = req.body.createdBy;
        req.nomorekening.save().then(nomorekening => {
        return apiResponse.successResponseWithData(res, "SUCCESS", nomorekening);
        })
    },

    // Delete
    async delete(req, res) {
        req.nomorekening.destroy().then(nomorekening => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
