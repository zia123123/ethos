const { ratecard, Sequelize } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    async index(req, res) {
        let whereCondition = {}

        if (req.query.ekspedisiId != null) {
            whereCondition.ekspedisiId = req.query.ekspedisiId
        }
        if (req.query.gudang != null) {
            whereCondition.gudang = req.query.gudang
        }
        if (req.query.provinsi != null) {
            whereCondition.provinsi = req.query.provinsi
        }
        if (req.query.kabupaten_kota != null) {
            whereCondition.kabupaten_kota = req.query.kabupaten_kota
        }
        if (req.query.kecamatan != null) {
            whereCondition.kecamatan = req.query.kecamatan
        }
        if (req.query.paket != null) {
            whereCondition.paket = req.query.paket
        }
        if (req.query.region != null) {
            whereCondition.region = req.query.region
        }
        if (req.query.cityCode != null) {
            whereCondition.cityCode = req.query.cityCode
        }

        console.log(whereCondition);
        let result = await ratecard.findAll({
            where: whereCondition
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            return apiResponse.ErrorResponse(res, err);
        });
    },

}
