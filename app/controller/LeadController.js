const {
    leads, auths, products, domains, customers, Sequelize 
   } = require('../models/index');
const { Op } = require("sequelize");
const { exportstocsv }  = require("export-to-csv"); 
const { Parser } = require('json2csv');
const { generate } = require("csv-generate");
const converter = require('json-2-csv');
const fs = require("fs")
const csvdir = "./app/public/docs"
const apiResponse = require("../helpers/apiResponse");
const xl = require('excel4node');
const { isArray } = require('util');


module.exports = {

    //index
    async index(req, res){
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        let searchWords = []

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                console.log(word);
                searchWords.push({
                    [Op.or]:[
                        {
                            leads_number:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            no_hp:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            sumber:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            type:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        // {
                        //     '$product.name$':{
                        //         [Op.like]: `%${word}%`
                        //     }
                        // },
                        {
                            '$domain.url$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                    ]
                })
            })
        }

        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 0, 0),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let filter = 
        {
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                [Op.and]: searchWords
            },
            include:[
                {
                    model: auths,
                    as: 'auth',
                    required: true,
                    // attributes: []
                },
                // {
                //     model: products,
                //     required: true,
                //     // attributes: []
                // },
                {
                    model: domains,
                    required: true,
                    // attributes: []
                },
            ],
            order:[
                ['id', 'DESC']
            ]
        }
        let count = await leads.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await leads.findAll(filter).then(result => {
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
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async create(req, res, next){
        if (req.lead != null) {
            req.body.no_hp = req.body.notelp
            
            if (req.lead.length != 0) {
                req.lead = req.lead[req.lead.length - 1]
                next()
                return 
            }
        }
        if (req.phone != null) {
            req.body.no_hp = req.phone
        }

        let result = await leads.create({
            authId: req.body.authId,
            productId: req.body.productId,
            domainId: req.body.domainId,
            no_hp: req.body.no_hp,
            nama: req.body.nama,
            sumber: req.body.sumber,
            type: req.body.type,
        }).then(result => {
            if (req.lead != null ) {
                req.lead = result
                next()
            }else{
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            }
        }).catch(function (err)  {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
        
    },

    async find(req, res, next) {
        let result = await leads.findByPk(req.params.id,{
            include:[
                {
                    model: auths,
                    as: 'auth',
                    required: true,
                    // attributes: []
                },
                {
                    model: products,
                    required: true,
                    // attributes: []
                },
                {
                    model: domains,
                    required: true,
                    // attributes: []
                },
            ],
        });
        if (!result) {
            return apiResponse.notFoundResponse(res, "Not Found");
        } else {
            req.lead = result;
            next();
        }
    },

    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.lead);
    },

    async update(req, res) {
        req.lead.no_hp = req.body.no_hp
        req.lead.nama = req.body.nama
        req.lead.sumber = req.body.sumber
        req.lead.type = req.body.type
        req.lead.authId = req.body.authId
        req.lead.productId = req.body.productId
        req.lead.domainId = req.body.domainId
        req.lead.save().then(lead => {
            return apiResponse.successResponseWithData(res, "SUCCESS", lead);
        })
    },

    async indexByCS(req, res){
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        let csId = req.params.id
        let searchWords = []

        if( search == null ){
            search = ""
        }else{
            const words = search.toLowerCase().split(' ')
            words.forEach(word => {
                console.log(word);
                searchWords.push({
                    [Op.or]:[
                        {
                            leads_number:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            no_hp:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            nama:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            sumber:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            type:{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$auth.firstname$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                        {
                            '$domain.url$':{
                                [Op.like]: `%${word}%`
                            }
                        },
                    ]
                })
            })
        }

        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = req.query.startDate+"T00:00:00.000Z"    
        }
        if (req.query.endDate) {
            endDate = req.query.endDate+"T23:59:59.000Z"    
        }

        let filter = 
        {
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                authId: csId,
                [Op.and]: searchWords
            },
            order:[
                ['id', 'DESC']
            ],
            include:[
                {
                    model: auths,
                    as: 'auth',
                    required: true,
                    // attributes: []
                },
                {
                    model: domains,
                    required: true,
                    include:[
                        {
                            model: products,
                            required: true,
                            // attributes: []
                        },
                    ]
                    // attributes: []
                },
            ],
        }
        let count = await leads.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await leads.findAll(filter).then(result => {
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
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async getLeadByPhoneNumberDomainCs(req, res, next){
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let csId = req.query.csId
        let phoneNumber = req.query.phoneNumber
        let domain = req.query.domainId

        let filter = 
        {
            where:{
                authId: csId,
                no_hp: phoneNumber,
                domainId: domain
            },
            include:[
                {
                    model: auths,
                    as: 'auth',
                    required: true,
                    // attributes: []
                },
                // {
                //     model: products,
                //     required: true,
                //     // attributes: []
                // },
                {
                    model: domains,
                    required: true,
                    // attributes: []
                },
                {
                    model: customers,
                    required: false,
                    // attributes: []
                },
            ],
        }
        let count = await leads.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await leads.findAll(filter).then(result => {
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

            if (result[0].customer) {
                return apiResponse.successResponseWithData(res, "SUCCESS", returnData);    
            }
            
            req.lead = result[0]
            next()
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async findLeadNull(req, res, next) {
        let csId = req.body.authId
        let domainId = req.body.domainId
        let phoneNumber = req.body.notelp

        let result = await leads.findAll(
            {
                where:{
                    authId: csId,
                    no_hp: phoneNumber,
                    domainId: domainId
                },
                include:[
                    {
                        model: auths,
                        as: 'auth',
                        required: true,
                        // attributes: []
                    },
                    // {
                    //     model: products,
                    //     required: true,
                    //     // attributes: []
                    // },
                    {
                        model: domains,
                        required: true,
                        // attributes: []
                    },
                    {
                        model: customers,
                        required: false,
                        // attributes: []
                    },
                ],
            }
        )
        req.lead = result;
        next();
    },

    async getLeadByCsPhoneNumberDomain(req, res, next){
        let csId = req.body.authId
        let phoneNumber = req.body.no_hp
        let domain = req.body.domainId

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

        let filter = 
        {
            where:{
                authId: csId,
                no_hp: phoneNumber,
                domainId: domain
            },
            include:[
                {
                    model: auths,
                    as: 'auth',
                    required: true,
                    // attributes: []
                },
                // {
                //     model: products,
                //     required: true,
                //     // attributes: []
                // },
                {
                    model: domains,
                    required: true,
                    // attributes: []
                },
                {
                    model: customers,
                    required: false,
                    // attributes: []
                },
            ],
        }
        // let count = await leads.count(filter)

        let result = await leads.findAll(filter).then(result => {
            // var totalPage = (parseInt(count) / limit) + 1
            returnData = {
                result
            }

            if (result[0]) {
                return apiResponse.ErrorResponse(res, "Error. Lead sudah terdaftar");    
            }
            
            req.phone = phoneNumber
            next()
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    },
}