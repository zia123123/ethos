const { auths,mapgroup,group} = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const apiResponse = require("../helpers/apiResponse");
const exportUsersToExcel = require('../helpers/exportService');
const xl = require('excel4node');

module.exports = {

    signUp(req, res) {
        let type = req.body.type
        if( type == "" ){
           var datatype = ""
        }else{
           var datatype = "-"+req.body.type
        }
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
        auths.create({
            email: req.body.email,
            nik: req.body.nik,
            noktp: req.body.noktp,
            alamat: req.body.alamat,
            notelp: req.body.notelp,
            tempatlahir: req.body.tempatlahir,
            jeniskelamin: req.body.jeniskelamin,
            statuskawin: req.body.statuskawin,  
            statuskaryawan: req.body.statuskaryawan,  
            tanggalmasuk: req.body.tanggalmasuk,  
            tanggalkeluar: req.body.tanggalkeluar, 
            posisi: req.body.posisi, 
            level: req.body.level,
            namabank: req.body.namabank,
            norekening: req.body.norekening,
            password: password,
            status: true,
            firstname: req.body.firstname+datatype,
            role: req.body.role
        }).then(auths => {
            let token = jwt.sign({ auth: auths }, authConfig.secret, {
                expiresIn: authConfig.expires
            });
            res.json({
                auth : auths,
                token: token,
            });
        }).catch(err => {
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async getListUser(req, res) {
        let result = await auths.findAll({
            where:{
                role: req.query.roleid
            },
            attributes: ['id','email', 'firstname']
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async getListAdvertiser(req, res) {
        let result = await auths.findAll({
            where:{
                role: 5
            },
            attributes: ['id','email', 'firstname']

        }).then(result => {
          
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    

    async getCustomer(req, res) {
        let result = await auths.findAll({
            where:{
                role: 2
            },
            attributes: ['id','email', 'firstname']
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    signIn(req, res) {          
        let { email, password } = req.body;
        auths.findOne({
            where: {
                email: email
            },
            include: [ 
                { model: mapgroup,
                    attributes: ['id'],
                    include: [ 
                        { model: group,  
                        }
                    ]
                }
            ]
        }).then(auths => {
            if (!auths) {
                res.status(404).json({ message: "Maaf Akun tidak di temukan" });
            } else {
                if (bcrypt.compareSync(password, auths.password)) {
                    let token = jwt.sign({ auths: auths }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });
                    res.json({
                        status: 200,
                        message:"SUCCESS",
                        data: auths,
                        token: token
                    })
                } else {
                    res.status(401).json({ msg: "Password Salah" })
                }
            }
        }     
        ).catch(err => {
            return apiResponse.ErrorResponse(res, err);
        })     
    },

    signInFinance(req, res) {          
        let { email, password } = req.body;
        auths.findOne({
            where: {
                email: email
            },
        }).then(auths => {
            if (!auths) {
                res.status(404).json({ message: "Maaf Akun tidak di temukan" });
            } else {
                if (bcrypt.compareSync(password, auths.password)) {
                    let token = jwt.sign({ auths: auths }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });
                    res.json({
                        status: 200,
                        message:"SUCCESS",
                        data: auths,
                        token: token
                    })
                } else {
                    res.status(401).json({ msg: "Password Salah" })
                }
            }
        }     
        ).catch(err => {
            return apiResponse.ErrorResponse(res, err);
        })     
    },

    async find(req, res, next) {
        let user = await auths.findByPk(req.params.id);
        if (!user) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.user = user;
            next();
        }
    },

    async index(req, res) {
        let result = await auths.findAll({
            attributes: ['id', 'firstname'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.user);
    },

}