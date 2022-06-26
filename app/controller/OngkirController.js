const { ninja,sicepat,jnt,idexpress } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async indexninja(req, res) {
        let kecamatan = req.query.kecamatan
        let kota = req.query.kota
        let gudang = req.query.gudang
        let result = await ninja.findOne({
            where: {
                kecamatan: {
                    [Op.like]: '%'+kecamatan+'%'
                },
                kota: {
                [Op.like]: '%'+kota+'%'
             }
        },
            attributes: [[gudang,'harga']]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },  
    async indexsicepat(req, res) {
        let kecamatan = req.query.kecamatan
        let kota = req.query.kota
        let gudang = req.query.gudang
        let result = await sicepat.findOne({
            where: {
                kecamatan: {
                    [Op.like]: '%'+kecamatan+'%'
                },
                kota: {
                [Op.like]: '%'+kota+'%'
             }
        },
            attributes: [[gudang,'harga']]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },  
    async indexjnt(req, res) {
        let kecamatan = req.query.kecamatan
        let kota = req.query.kota
        let gudang = req.query.gudang
        let result = await jnt.findOne({
            where: {
                kecamatan: {
                    [Op.like]: '%'+kecamatan+'%'
                },
                kota: {
                [Op.like]: '%'+kota+'%'
             }
        },
            attributes: [[gudang,'harga']]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },  

    async indexidexpress(req, res) {
        let kecamatan = req.query.kecamatan
        let kota = req.query.kota
        let gudang = req.query.gudang
        let result = await idexpress.findOne({
            where: {
                kecamatan: {
                    [Op.like]: '%'+kecamatan+'%'
                },
                kota: {
                [Op.like]: '%'+kota+'%'
             }
        },
            attributes: [[gudang,'harga']]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },



}
