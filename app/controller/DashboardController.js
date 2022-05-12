"use strict";
const {
    transaksis, 
    daexpedisis, 
    customers,
    groups 
   } = require('../models/index');
const { Op, where, Sequelize } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");
const sequelize = new Sequelize("mysql::memory:");

module.exports = {

    async omset (req, res){
        let result = await transaksis.findAll({
            where:{
                status: 'I'
            },
            attributes: [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                // { 
                //     model: customers,
                //     attributes:[
                //         // 'nama'
                //     ]
                // },
                // {
                //     model: groups,
                //     where:{
                //         internal: 1
                //     }
                // }
            ],
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    }
}