const { suppliers } = require('../models/index');
const { Op } = require("sequelize");
const jsonexport = require('jsonexport');
const fs = require('fs');
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    //create
    async create(req, res) { 
        let result = await suppliers.create({
            name: req.body.name,
            address_line_one: req.body.address_line_one,
            address_line_two: req.body.address_line_two,
            district: req.body.district,
            sub_district: req.body.sub_district,
            phone: req.body.phone,
            npwp: req.body.npwp,
            bank_account_no: req.body.bank_account_no,
            name_of_director: req.body.name_of_director,
            is_active: true,
            bank_name: req.body.bank_name,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let supplier = await suppliers.findByPk(req.params.id);
        if (!supplier) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.supplier = supplier;
            next();
        }
    },

    async index(req, res) {
        let result = await suppliers.findAll({
        }).then(result => {
            class Supplier {
                constructor(id,nama) {
                  this.id = id;
                  this.nama = nama;
                }
              }
              var  SupplierArray  = [];
            for(var i=0;i<result.length;i++){
                    SupplierArray.push(new Supplier(result[i].id,result[i].name));
            }
            

            // var data = json(result)
            // console.log(data);
            jsonexport(SupplierArray, function(err, csv) {
              if (err) return console.error(err);
              fs.writeFile('app/public/docs/cars.csv', csv, function(err) {
                if (err) return console.error(err);
                console.log('cars.csv saved');
              });
            });
    
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.supplier);
    },

    // Update
    async updateStock(req, res) {
        req.supplier.npwp = req.body.npwp;
        req.supplier.nama = req.body.nama;
        req.supplier.address_line_one = req.body.address_line_one;
        req.supplier.address_line_two = req.body.address_line_two;
        req.supplier.district = req.body.district;
        req.supplier.sub_district = req.body.sub_district;
        req.supplier.phone = req.body.phone;
        req.supplier.bank_account_no = req.body.bank_account_no;
        req.supplier.name_of_director = req.body.name_of_director;
        req.supplier.is_active = req.body.is_active;
        req.supplier.bank_name = req.body.bank_name;
        req.supplier.save().then(supplier => {
        return apiResponse.successResponseWithData(res, "SUCCESS", supplier);
        })
    },

    // Delete
    async delete(req, res) {
        req.supplier.destroy().then(supplier => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
