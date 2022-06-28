const { customers,districts,cityregencies,province,keranjangs } = require('../models/index');
const { Op } = require("sequelize");
const { generate } = require("csv-generate");
const converter = require('json-2-csv');
const fs = require("fs")
const csvdir = "./app/public/docs"

const  assert = require('assert');
const apiResponse = require("../helpers/apiResponse");

  
module.exports = {

    //create
    async create(req, res) { 
        let phoneNumber = null
        if (req.body.notelp != null) {
            phoneNumber = req.body.notelp

            if (req.body.kode != null) {
                const kode = req.body.kode 
                const lengthKode = kode.length
                const checkCodePhone = phoneNumber.substring(0, lengthKode)
    
                if (checkCodePhone != kode) {
                    if (phoneNumber[0] == 0) {
                        phoneNumber = kode + '' + phoneNumber.substring(1)
                    }else{
                        phoneNumber = kode + '' + phoneNumber
                    }
                }else{
                    if (phoneNumber[lengthKode] == 0) {
                        phoneNumber = kode + '' + phoneNumber.substring(lengthKode+1)
                    }
                }
            }
        }

        let result = await customers.create({
            warehouseId: req.body.warehouseId,
            idorigin: req.body.idorigin,
            nama: req.body.nama,
            authId: req.body.authId,
            notelp: phoneNumber,
            notelp2: req.body.notelp2,
            provinsiname: req.body.provinsiname,
            cityname: req.body.cityname,
            districtname: req.body.districtname,
            email: req.body.email,
            destinations: req.body.destinations,
            alamat: req.body.alamat,
            rt:req.body.rt,
            rw:req.body.rw,
            groupId:req.body.groupId,
            kelurahan: req.body.kelurahan,
            memoid: req.body.memoid,
            jeniskelamin:req.body.jeniskelamin,
            pekerjaan:req.body.pekerjaan,
            postalcode: req.body.postalcode,
            provinceId: req.body.provinceId,
            cityregencyId: req.body.cityregencyId,
            districtId: req.body.districtId,
            // lead: req.lead.id   
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
                    {
                        nama: {
                            [Op.like]: '%'+req.params.clue+'%'
                          }
                     },
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
           
        }).then(result => {
          
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async myCustomer(req, res) {
        let clue = req.query.clue
        if( clue == null ){
            clue = ""
        }
        let result = await customers.findAll({
            where: {
                authId: req.query.authId,
                [Op.or]: [
                    {
                        nama: {
                            [Op.like]: '%'+req.query.clue+'%'
                          }
                     },
                ]
             },
             include: [ 
                { model: keranjangs,
                    attributes: ['namaproduct'],
                },   
            ]   
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async myGroup(req, res) {
        let clue = req.query.clue
        if( clue == null ){
            clue = ""
        }
        let result = await customers.findAll({
            where: {
                groupId: req.query.groupId,
                [Op.or]: [
                    {
                        nama: {
                            [Op.like]: '%'+req.query.clue+'%'
                          }
                     },
                ]
             },
             include: [ 
                { model: keranjangs,
                    attributes: ['namaproduct'],
                },   
            ]   
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async jumlahLead(req, res) {
        let result = await customers.count({ 
            where: {
                        authId: req.query.authId
                     },
              }
        ).then(result => {
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
        
        req.customer.warehouseId = req.body.warehouseId;
        req.customer.idorigin = req.body.idorigin;
        req.customer.nama = req.body.nama;
        req.customer.notelp = req.body.notelp;
        req.customer.notelp2 = req.body.notelp2;
        req.customer.email = req.body.email;
        req.customer.alamat = req.body.alamat;
        req.customer.rt =  req.body.rt,
        req.customer.rw =  req.body.rw,
        req.customer.memoid =  req.body.memoid,
        req.customer.provinsiname =  req.body.provinsiname,
        req.customer.cityname =  req.body.cityname,
        req.customer.districtname =  req.body.districtname,
        req.customer.destinations =  req.body.destinations,
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

    async getCustomerPhoneNumbers(req, res) {
        let search = ''

        if (req.query.search != null) {
            search = req.query.search
        }
        let result = await customers.findAll({
            where:{
                notelp:{
                    [Op.like]: `%${search}%`
                }
            },
           attributes:['notelp'],
           group: ['notelp'],
           order: ['notelp']
        }).then(result => {
          
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async getCustomerByPhoneNumber(req, res) {
        let phoneNumber = req.params.phone
        let result = await customers.findAll({
            limit:1,
            where:{
                notelp:phoneNumber
            },
           order: [['createdAt', 'DESC']]
        }).then(result => {
          
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async createByLead(req, res) { 
        let result = await customers.create({
            // warehouseId: req.body.warehouseId,
            // idorigin: req.body.idorigin,
            nama: req.lead.nama,
            authId: req.lead.authId,
            notelp: req.lead.no_hp,
            lead: req.lead.id,
            // notelp2: req.body.notelp2,
            // provinsiname: req.body.provinsiname,
            // cityname: req.body.cityname,
            // districtname: req.body.districtname,
            // email: req.body.email,
            // destinations: req.body.destinations,
            // alamat: req.body.alamat,
            // rt:req.body.rt,
            // rw:req.body.rw,
            // groupId:req.body.groupId,
            // kelurahan: req.body.kelurahan,
            // memoid: req.body.memoid,
            // jeniskelamin:req.body.jeniskelamin,
            // pekerjaan:req.body.pekerjaan,
            // postalcode: req.body.postalcode,
            // provinceId: req.body.provinceId,
            // cityregencyId: req.body.cityregencyId,
            // districtId: req.body.districtId,    
        }).then(result => {
            returnData = {
                result,
                lead: req.lead
            }
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", returnData);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

}
