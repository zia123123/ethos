const { ratecard, Sequelize } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    async index(req, res) {
        let searchWords = []
        let search = req.query.search

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                searchWords.push({
                    [Op.or]:[
                        {
                            provinsi:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            kabupaten_kota:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            kecamatan:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            paket:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            region:{
                                [Op.like]: `%${word}%`
                            }
                        },
                    ],
                })
            })
        }

        let whereCondition = {
            [Op.and]:searchWords,
        }

        if (req.query.ekspedisiId != null) {
            whereCondition.ekspedisiId = req.query.ekspedisiId
        }
        if (req.query.warehouseId != null) {
            whereCondition.warehouseId = req.query.warehouseId
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

        let filter = {
            where: whereCondition
        }
        let count = await ratecard.count(filter)

        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await ratecard.findAll(filter).then(result => {
            var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count,
                }
            }
            
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
        }).catch(function (err){
            return apiResponse.ErrorResponse(res, err);
        });
    },

}
