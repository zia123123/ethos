const {
    mutation, mutation_details, Sequelize 
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


module.exports = {

    //index
    async index(req, res){
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search

        if( search == null ){
            search = ""
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
                [Op.or]:[
                    {
                        description:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        debit:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        invoice:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        bank:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        date:{
                            [Op.like]: `%${search}%`
                        }
                    },
                ]
            },
            include:[
                {
                    model: mutation,
                    required: true,
                    attributes: []
                }
            ],
        }
        let count = await mutation_details.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await mutation_details.findAll(filter).then(result => {
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

    async indexByInvoice(req, res){
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        let invoice = req.params.id

        if( search == null ){
            search = ""
        }

        // const date = new Date();
        // let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
        //     endDate   = date.setDate(date.getDate() + 1);

        // if (req.query.startDate) {
        //     startDate = req.query.startDate+"T00:00:00.000Z"    
        // }
        // if (req.query.endDate) {
        //     endDate = req.query.endDate+"T23:59:59.000Z"    
        // }

        let filter = 
        {
            where:{
                // createdAt :  {
                //     [Op.and]: {
                //       [Op.gte]: startDate,
                //       [Op.lte]: endDate
                //     }
                // },
                invoice: invoice,
                [Op.or]:[
                    {
                        description:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        debit:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        invoice:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        bank:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        date:{
                            [Op.like]: `%${search}%`
                        }
                    },
                ]
            },
            include:[
                {
                    model: mutation,
                    required: true,
                    attributes: []
                }
            ],
        }
        let count = await mutation_details.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await mutation_details.findAll(filter).then(result => {
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

    async update(req, res){
        const orders = req.body
        for (let index = 0; index < orders.length; index++){
            if (orders[index].invoice != null && orders[index].id != null) {
                mutation_details.update(
                    {
                        invoice: orders[index].invoice
                    },
                    {
                        where: {
                            id: orders[index].id
                        }
                    }
                )
            }
        }
        return apiResponse.successResponseWithData(res, "SUCCESS", orders)
    },
}