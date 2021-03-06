const { warehouses,province,cityregencies,districts,destination } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await warehouses.create({
            name: req.body.name,
            status: req.body.status,
            provinceId: req.body.provinceId,
            cityregencyId: req.body.cityregencyId,
            districtId: req.body.districtId,
            city: req.body.city,
            idorigin: req.body.idorigin,
            statusGudang: req.body.statusGudang,
            address: req.body.address,
            expedition_data: req.body.expedition_data,
            postalcode: req.body.postalcode,
            address_line_two: req.body.address_line_two,
            village: req.body.village,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let warehouse = await warehouses.findByPk(req.params.id);
        if (!warehouse) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.warehouse = warehouse;
            next();
        }
    },

    async index(req, res) {
        let result = await warehouses.findAll({
            attributes: ['id','name','idorigin'],
            include: [
                { model: districts,
                attributes: ['name']
            },
            { model: cityregencies,
                attributes: ['name']
            },
            { model: province,
                attributes: ['name']
            }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async indexDestionaios(req, res) {
        let result = await destination.findOne({    
            where: {
                [Op.and]: [
                    {
                        subdistrict: {
                            [Op.like]: '%'+req.query.kecamatan+'%'
                          },
                          city: {
                            [Op.like]: '%'+req.query.kota+'%'
                          },            
                       },
                  ]
               
            
            },
            attributes: ['destination_code'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    
    async indexAll(req, res) {
        let result = await warehouses.findAll({
            include: [
                { model: districts,
                attributes: ['name']
            },
            { model: cityregencies,
                attributes: ['name']
            },
            { model: province,
                attributes: ['name']
            }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.warehouse);
    },

    // Update
    async update(req, res) {
        req.warehouse.name = req.body.name;
        req.warehouse.status = req.body.status;
        req.warehouse.provinceId = req.body.provinceId;
        req.warehouse.cityregencyId = req.body.cityregencyId;
        req.warehouse.districtId = req.body.districtId;
        req.warehouse.city = req.body.city;
        req.warehouse.idorigin = req.body.idorigin;
        req.warehouse.statusGudang = req.body.statusGudang;
        req.warehouse.address = req.body.address;
        req.warehouse.expedition_data = req.body.expedition_data;
        req.warehouse.postalcode = req.body.postalcode;
        req.warehouse.address_line_two = req.body.address_line_two;
        req.warehouse.village = req.body.village;
        req.warehouse.save().then(warehouse => {
        return apiResponse.successResponseWithData(res, "SUCCESS", warehouse);
        })
    },

    // Delete
    async delete(req, res) {
        req.warehouse.destroy().then(warehouse => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
