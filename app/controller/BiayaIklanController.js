const { biayaiklan,domains,products } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await biayaiklan.create({
            domainId: req.body.domainId,
            productId: req.body.productId,
            namacs: req.body.namacs,
            biayaiklan: req.body.biayaiklan,
            status:true,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await biayaiklan.findOne({
            where: {
                    id: req.params.id,
            },
            include: [ { model: domains,
                attributes: ['url']
            },
            { model: products,
                attributes: ['name']
            }]
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
        const count = await biayaiklan.count({
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
        let result = await biayaiklan.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            include: [ { model: domains,
                attributes: ['url']
            },
            { model: products,
                attributes: ['name']
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

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        req.result.domainId = req.body.domainId;        
        req.result.productId = req.body.productId;
        req.result.namacs = req.body.namacs;
        req.result.status = req.body.status;
        req.result.biayaiklan = req.body.biayaiklan;
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
