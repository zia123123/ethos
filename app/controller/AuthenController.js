const { auths } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const apiResponse = require("../helpers/apiResponse");

module.exports = {
    
    signUp(req, res) {
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
        auths.create({
            email: req.body.email,
            password: password,
            status: true,
            firstname: req.body.firstname,
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

    signIn(req, res) {
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

}