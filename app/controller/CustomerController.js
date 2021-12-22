const { customers,districts,cityregencies,provinces } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await customers.create({
            nama: req.body.nama,
            notelp: req.body.notelp,
            notelp2: req.body.notelp2,
            email: req.body.email,
            alamat: req.body.alamat,
            rt:req.body.rt,
            rw:req.body.rw,
            kelurahan: req.body.kelurahan,
            memoid: req.body.memoid,
            jeniskelamin:req.body.jeniskelamin,
            pekerjaan:req.body.pekerjaan,
            postalcode: req.body.postalcode,
            provinceId: req.body.provinceId,
            cityregencyId: req.body.cityregencyId,
            districtId: req.body.districtId,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let customer = await customers.findOne({
            where: {
                id: req.params.id,
            },
            include: [ { model: districts,
                attributes: ['name']
            },
            { model: cityregencies,
                attributes: ['name']
            },
            { model: provinces,
                attributes: ['name']
            }]
        }).then(customer => {
            req.customer = customer;
            next();
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async filterCustomer(req, res) {
        let result = await customers.findAll({
            where: {
                [Op.or]: [
                    {nama: req.params.clue},
                    {notelp: req.params.clue},
                ]
            },
        
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async index(req, res) {
        let result = await customers.findAll({
            include: [ { model: districts,
                attributes: ['name']
            },
            { model: cityregencies,
                attributes: ['name']
            },
            { model: provinces,
                attributes: ['name']
            }]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.customer);
    },

    // Update
    async update(req, res) {
        req.customer.nama = req.body.nama;
        req.customer.notelp = req.body.notelp;
        req.customer.notelp2 = req.body.notelp2;
        req.customer.email = req.body.email;
        req.customer.alamat = req.body.alamat;
        req.customer.rt =  req.body.rt,
        req.customer.rw =  req.body.rw,
        req.customer.kelurahan =  req.body.kelurahan,
        req.customer.postalcode = req.body.postalcode;
        req.customer.pekerjaan = req.body.pekerjaan;
        req.customer.jeniskelamin = req.body.jeniskelamin;
        req.customer.districtId = req.body.districtId;
        req.customer.provinceId = req.body.provinceId;
        req.customer.cityregencyId = req.body.cityregencyId;
        req.customer.save().then(customer => {
        return apiResponse.successResponseWithData(res, "SUCCESS", customer);
        })
    },

    // Delete
    async delete(req, res) {
        req.customer.destroy().then(customer => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
