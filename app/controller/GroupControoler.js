const { group,mapgroup,auths } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await group.create({
            authId: req.body.supervisorId,
            name: req.body.name,
            status: true,
            ppn: req.body.ppn,
            internal: req.body.internal,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await group.findOne({
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
        let result = await group.findAll({
            include: [ { model: mapgroup,
                attributes: ['id'],
                include: [ { model: auths,
                    attributes: ['firstname']
                }]
            }]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexKu(req, res) {
        let search = req.query.search

        if( search == null ){
            search = ""
        }

        let result = await group.findAll({
            where: {
                authId: req.query.id,
                [Op.or]:[
                    {
                        name:{
                            [Op.like]: `%${search}%`
                        }
                    },
                ],
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
        req.result.name = req.body.name;  
        req.result.ppn = req.body.ppn;
        req.result.status = req.body.status;    
        req.result.internal = req.body.internal;
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
