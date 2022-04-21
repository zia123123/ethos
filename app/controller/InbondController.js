const { inbond,suppliers,catalog } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await inbond.create({
            supplierId: req.body.supplierId,
            status: "Konfirmasi Finance"
        }).then(result => {
           
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await inbond.findOne({
            where: {
                    id: req.params.id,
            },
        });
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },

    async index(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await inbond.count({
            // where: {
            //     status: {
            //         [Op.or]: [
            //             {
            //         [Op.like]: '%D%'
            //     },
            //     {
            //         [Op.like]: '%C%'
            //     }, {
            //         [Op.like]: '%E%'
            //     }
            //     ]
            //     },
            // }
        })
        let result = await inbond.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            include: [ { model: suppliers,
                attributes: ['name'],
               
            }]
        }).then(result => {
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

    async indexKu(req, res) {
        let result = await inbond.findAll({
            where: {
                authId: req.query.id,
        },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {

        req.result.totalbarangpesan = req.body.totalbarangpesan; 
        req.result.totalbarangsampai = req.body.totalbarangsampai; 
        req.result.status = req.body.status;  
        req.result.nopo = req.body.nopo;  
        req.result.totalharga = req.body.totalharga;    
        req.result.totalterbayar = req.body.totalterbayar;
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },

    // Delete
    async delete(req, res) {
        req.result.destroy().then(result => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
