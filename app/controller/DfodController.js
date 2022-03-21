const { dfod } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await dfod.create({
            awbpengembalian: req.body.awbpengembalian,
            expedisipengembalian: req.body.expedisipengembalian,
            awbpengiriman: req.body.awbpengiriman,
            transaksisId: req.body.transaksisId,
            expedisipengiriman: req.body.expedisipengiriman,
            typedfod: req.body.typedfod,
            kondisibarang: req.body.kondisibarang,
            biayapengembalian: req.body.biayapengembalian,
            biayapengiriman: req.body.biayapengiriman,
            evidance: req.body.evidance,
            keterangan: req.body.keterangan,
            state: req.body.state,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

      async find(req, res, next) {
        let result = await dfod.findOne({
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
        let result = await dfod.findAll({
            
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // async indexKu(req, res) {
    //     let result = await group.findAll({
    //         where: {
    //             authId: req.query.id,
    //     },
    //     }).then(result => {
    //         return apiResponse.successResponseWithData(res, "SUCCESS", result);
    //         }).catch(function (err){
    //             return apiResponse.ErrorResponse(res, err);
    //         });
    // },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        req.result.awbpengembalian = req.body.awbpengembalian;  
        req.result.expedisipengembalian = req.body.expedisipengembalian;
        req.result.awbpengiriman = req.body.awbpengiriman;    
        req.result.expedisipengiriman = req.body.expedisipengiriman;    
        req.result.typedfod = req.body.typedfod;    
        req.result.kondisibarang = req.body.kondisibarang;    
        req.result.biayapengembalian = req.body.biayapengembalian;  
        req.result.evidance = req.body.evidance;  
        req.result.keterangan = req.body.keterangan;
        req.result.state = req.body.state;
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
