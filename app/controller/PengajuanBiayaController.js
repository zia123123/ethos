const { pengajuanbiaya,auths,product,group } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; 
        var tanggal = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        let result = await pengajuanbiaya.create({
                namabank: req.body.namabank,
                akun: req.body.akun,
                superVisorId: req.body.superVisorId,
                supervisorName: req.body.supervisorName,
                nominal: req.body.nominal, 
                status:  req.body.status,
                platform:  req.body.platform,
                tanggalapproval:  req.body.tanggalapproval,
                tanggaltrf:  req.body.tanggaltrf,
                disetujui:  req.body.disetujui,
                createdAt: tanggal,
                groupId:  req.body.groupId,
                authId: req.body.authId,
                productId: req.body.productId,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let pengajuanbiayas = await pengajuanbiaya.findByPk(req.params.id);
        if (!pengajuanbiayas) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.pengajuanbiayas = pengajuanbiayas;
            next();
        }
    },

    async index(req, res) {
        let result = await pengajuanbiaya
        .findAll({
            include: [ 
                { model: auths,
                    attributes: ['notelp','firstname'],
                },
                { model: products,
                    attributes: ['name'],
                },
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexadvertiser(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let authId = parseInt(req.query.authId)
        const count = await pengajuanbiaya.count({ 
                where: {
                    authId: {
                        [Op.like]: '%'+authId+'%'
                    },
                }}
        )
        let result = await pengajuanbiaya.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                authId: {
                    [Op.like]: '%'+authId+'%'
                },
            },
            include: [ 
                { model: auths,
                    attributes: ['notelp','firstname'],
                },
                { model: products,
                    attributes: ['name'],
                },
                { model: group,
                    attributes: ['name'],
                },
            ]
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
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },



    async indexsupervisor(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let superVisorId = parseInt(req.query.superVisorId)
        const count = await pengajuanbiaya.count({ 
                where: {
                    superVisorId: {
                        [Op.like]: '%'+superVisorId+'%'
                    },
                    status: {
                        [Op.or]: [
                        {
                        [Op.like]: '%1%'
                            },
                    ]
                      },
                },
                include: [ 
                    { model: auths,
                        attributes: ['notelp','firstname'],
                    },
                    { model: products,
                        attributes: ['name'],
                    },
                    { model: group,
                        attributes: ['name'],
                    },
                ]
            }
              
        )
        let result = await pengajuanbiaya.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                superVisorId: {
                    [Op.like]: '%'+superVisorId+'%'
                },
                status: {
                    [Op.or]: [
                    {
                    [Op.like]: '%1%'
                        },
                    {
                    [Op.like]: '%2%'
                  },
                ]
                  },

            }
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
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexfinance(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await pengajuanbiaya.count({ 
                where: {
                    status: {
                        [Op.or]: [
                        {
                        [Op.like]: '%2%'
                            },
                        {
                        [Op.like]: '%3%'
                      },
                      {
                        [Op.like]: '%4%'
                      },
                    ]
                      },
                }}
        )
        let result = await pengajuanbiaya.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                status: {
                    [Op.or]: [
                    {
                    [Op.like]: '%2%'
                        },
                    {
                    [Op.like]: '%3%'
                  },
                ]
                  },

            },
            include: [ 
                { model: auths,
                    attributes: ['notelp','firstname'],
                },
                { model: products,
                    attributes: ['name'],
                },
                { model: group,
                    attributes: ['name'],
                },
            ]
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
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.pengajuanbiayas);
    },

    // Update
    async update(req, res) {
        req.pengajuanbiayas.namabank = req.body.namabank;
        req.pengajuanbiayas.akun = req.body.akun;
        req.pengajuanbiayas.superVisorId = req.body.superVisorId;
        req.pengajuanbiayas.supervisorName = req.body.supervisorName;
        req.pengajuanbiayas.nominal = req.body.nominal;
        req.pengajuanbiayas.status = req.body.status;
        req.pengajuanbiayas.tanggalapproval = req.body.tanggalapproval;
        req.pengajuanbiayas.tanggaltrf = req.body.tanggaltrf;
        req.pengajuanbiayas.disetujui = req.body.disetujui;
        req.pengajuanbiayas.productId = req.body.productId;
        req.pengajuanbiayas.save().then(pengajuanbiayas => {
        return apiResponse.successResponseWithData(res, "SUCCESS", pengajuanbiayas);
        })
    },

    // Delete
    async delete(req, res) {
        req.pengajuanbiayas.destroy().then(pengajuanbiayas => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
