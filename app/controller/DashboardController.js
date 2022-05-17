"use strict";
const {
    transaksis, 
    daexpedisis, 
    auths,
    mapgroup,
    group,
    dfods
   } = require('../models/index');
const { Op, where, Sequelize } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");
const sequelize = new Sequelize("mysql::ethos:");

module.exports = {

    async omset (req, res){
        let startDate = '2015-01-01T00:00:00.000Z',
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let result = await transaksis.findAll({
            attributes: [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'I' then daexpedisis.totalHarga else 0 end)`), 'success'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
            ],
            raw: true,
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                }
            },
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetProduct (req, res){
        // let startDate = req.query.startDate+"T00:00:00.000Z"
        // let endDate = req.query.endDate+"T17:00:00.000Z"

        let result = await transaksis.findAll({
            attributes: [
                'cityname',
                [sequelize.fn('sum', 
                sequelize.cast( 
                sequelize.fn('left', 
                sequelize.fn('substring_index', sequelize.col('products'), 'jumlahproduct: ', -1), 
                sequelize.fn('locate', ',', 
                sequelize.fn('substring_index', sequelize.col('products'), 'jumlahproduct: ', -1))), 'UNSIGNED')), 'jumlah_produk']
            ],
            where:{
                status: 'I',
                // createdAt :  {
                //     [Op.and]: {
                //       [Op.gte]: startDate,
                //       [Op.lte]: endDate
                //     }
                // }
            },
            group: ['cityname'],
            order: [sequelize.col('jumlah_produk')]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetInternal (req, res){
        let startDate = '2015-01-01T00:00:00.000Z',
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }
        
        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
            },
            attributes: 
            [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'I' then daexpedisis.totalHarga else 0 end)`), 'success'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        internal: 1
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async omsetPartner (req, res){
        let startDate = '2015-01-01T00:00:00.000Z',
            endDate   = new Date

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
            },
            attributes: 
            [
                [sequelize.fn('date', sequelize.col('transaksis.createdAt')), 'date'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'I' then daexpedisis.totalHarga else 0 end)`), 'success'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' then daexpedisis.totalHarga else 0 end)`), 'return'],
                [sequelize.literal(`SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)`), 'omset'],
                [sequelize.literal(`SUM(SUM( CASE WHEN transaksis.status = 'K' OR transaksis.status = 'I' then daexpedisis.totalHarga WHEN dfod.biayapengembalian > 0 OR dfod.biayapengiriman > 0 then dfod.biayapengembalian + dfod.biayapengiriman else 0 end)) Over (Order by date(transaksis.createdAt))`), 'kumulatif_omset'],
            ],
            include: [
                { 
                    model: daexpedisis,
                    attributes: [
                        // [sequelize.fn('sum', sequelize.col('daexpedisis.totalharga')), 'totalomset'],
                    ],
                },
                { 
                    model: dfods,
                    attributes: [],
                },
                { 
                    model: auths,
                    required: true,
                    attributes:[
                        // 'nama'
                    ],
                    include:[
                        {
                            model: mapgroup,
                            required: true,
                            attributes:[
                                // 'nama'
                            ],
                            include:[
                                {
                                    model: group,
                                    required: true,
                                    attributes:[
                                        // 'nama'
                                    ],
                                    where:{
                                        internal: 0
                                    }
                                }
                            ]
                        }
                    ]
                },
            ],
            raw: true,
            group: [sequelize.fn('date', sequelize.col('transaksis.createdAt'))]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },
}