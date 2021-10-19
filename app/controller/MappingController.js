const { mappingadvertisers,auths } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await mappingadvertisers.create({
            advertiserId: req.body.advertiserId,
            cserviceId: req.body.cserviceId,
            start: req.body.start,
            expired: req.body.expired,
            keterangan: req.body.keterangan,
            is_active: true,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let mappingadvertiser = await mappingadvertisers.findByPk(req.params.id);
        if (!mappingadvertiser) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.mappingadvertiser = mappingadvertiser;
            next();
        }
    },
    async index(req, res) {
        let result = await mappingadvertisers.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async getCustomerService(req, res) {
        let result = await mappingadvertisers.findAll({
            where:{
                advertiserId: req.params.id
            },
            include: [ { model: auths,
                attributes: ['id', 'firstname'] },
            ],
            attributes: ['id','start', 'expired','keterangan']
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.mappingadvertiser);
    },

    // Update
    async update(req, res) {
        req.mappingadvertiser.advertiserId = req.body.advertiserId;
        req.mappingadvertiser.cserviceId = req.body.cserviceId;
        req.mappingadvertiser.start = req.body.start;
        req.mappingadvertiser.expired = req.body.expired;
        req.mappingadvertiser.keterangan = req.body.keterang
        req.mappingadvertiser.save().then(mappingadvertiser => {
        return apiResponse.successResponseWithData(res, "SUCCESS", mappingadvertiser);
        })
    },

    // Delete
    async delete(req, res) {
        req.mappingadvertiser.destroy().then(mappingadvertiser => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
