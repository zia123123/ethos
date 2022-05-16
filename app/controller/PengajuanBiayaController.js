const { pengajuanbiaya } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await pengajuanbiaya.create({
                namabank: req.body.namabank,
                akun: req.body.akun,
                superVisorId: req.body.superVisorId,
                supervisorName: req.body.supervisorName,
                nominal: req.body.nominal, 
                status:  req.body.status,
                tanggalapproval:  req.body.tanggalapproval,
                tanggaltrf:  req.body.tanggaltrf,
                disetujui:  req.body.disetujui,
                createdAt: req.body.createdAt,
                groupId:  req.body.name,
                authId: req.body.name,
                productId: req.body.name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let pengajuanbiayas = await pengajuanbiaya.findByPk(req.params.id);
        if (!pengajuanbiayas) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.pengajuanbiayas = pengajuanbiayas;
            next();
        }
    },
    async index(req, res) {
        let result = await pengajuanbiayas.findAll({
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
  
        req.pengajuanbiayas.namabank = req.body.namabank;
        req.pengajuanbiayas.akun = req.body.akun;
        req.pengajuanbiayas.superVisorId = req.body.superVisorId;
        req.pengajuanbiayas.supervisorName = req.body.supervisorName;
        req.pengajuanbiayas.nominal = req.body.nominal;
        req.pengajuanbiayas.status = req.body.status;
        req.pengajuanbiayas.tanggalapproval = req.body.tanggalapproval;
        req.pengajuanbiayas.tanggaltrf = req.body.tanggaltrf;
        req.pengajuanbiayas.disetujui = req.body.disetujui;
        req.pengajuanbiayas.namabank = req.body.namabank;
        req.pengajuanbiayas.namabank = req.body.namabank;
        req.pengajuanbiayas.namabank = req.body.namabank;
        req.pengajuanbiayas.namabank = req.body.namabank;


     
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
