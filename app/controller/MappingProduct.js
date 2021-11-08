const { mappingproducts,products } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await mappingproducts.create({
            keterangan: req.body.keterangan,
            productId: req.body.productId,
            domainId: req.body.domainId,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let mappingproduct = await mappingproducts.findByPk(req.params.id);
        if (!mappingproduct) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.mappingproduct = mappingproduct;
            next();
        }
    },

    async index(req, res) {
        let result = await mappingproducts.findAll({
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async findBydomain(req, res) {
        let result = await mappingproducts.findAll({
            where: {
                domainId: req.params.domainId
            },
            attributes: [],
            include: [ { model: products,
                attributes: ['id', 'name','price'],
               },
             ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.mappingproduc);
    },
    // Delete
    async delete(req, res) {
        req.mappingproduct.destroy().then(mappingproduct => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
