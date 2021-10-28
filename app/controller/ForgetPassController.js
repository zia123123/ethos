const { forgetpasswords, auths} = require('../models/index');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');

const authConfig = require('../../config/auth');
const apiResponse = require("../helpers/apiResponse");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { update } = require('./ProvincesController');
 const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'noreply@ethos.co.id',
      pass: '*d7EeZ3h'
    }
  }));


module.exports = {
  
    //create
    async create(req, res) { 
      const code = Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;
    let auth = await auths.findOne({
        where: {
            email: req.body.email}
        
        }
  );  
    if (!auth) {
    return apiResponse.notFoundResponse(res, "Akun Email Anda Tidak Terdaftar");
    } else {
      let result =  forgetpasswords.create({
        email: req.body.email,
        token: code,
    }).then(result => {
        const mailOptions = {
            from: 'ziakasep05@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Berikut token untuk melakukan reset password '+code
          };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 
        return apiResponse.successResponse(res, "SUCCESS CREATE");
    }).catch(function (err)  {
        return apiResponse.ErrorResponse(res, err);
    });
      return apiResponse.successResponse(res, "Success, Harap Check Email");
    }
      },

    async updatePassword(req, res, next) {
        let forgetpassword = await forgetpasswords.findOne({
            where: {
              [Op.or]: [
                {token: req.body.token}
            ]
            },
        });
        if (!forgetpassword) {
          return apiResponse.notFoundResponse(res, "Token Sudah Tidak Berlaku");
        } else {
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
        let auth = auths.findOne({
            where: {
                email: forgetpassword.email
            },
        }).then(auth =>{
            auth.password = password;
            auth.save()
        })
        forgetpassword.destroy()
        return apiResponse.successResponse(res, "Success, Update Password");
        }
    },

    // Delete
    async delete(req, res) {
        req.forgetpassword.destroy().then(forgetpassword => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
