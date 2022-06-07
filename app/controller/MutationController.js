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
                }
            },
            having: 
                Sequelize.where(Sequelize.literal('(CASE WHEN COUNT(mutation_details.id) > 0 THEN (SUM(CASE WHEN mutation_details.invoice IS NOT NULL THEN 1 ELSE 0 END)/COUNT(mutation_details.id)) * 100 ELSE 0 END)'), 
                    {
                        [Op.like]: `%${search}%`
                    }
                ),
            attributes: [
                'id',
                [Sequelize.literal('SUM(CASE WHEN mutation_details.invoice IS NOT NULL THEN 1 ELSE 0 END)'), 'success_data'],
                [Sequelize.literal('COUNT(mutation_details.id)'), 'all_data'],
                [Sequelize.literal('CASE WHEN COUNT(mutation_details.id) > 0 THEN (SUM(CASE WHEN mutation_details.invoice IS NOT NULL THEN 1 ELSE 0 END)/COUNT(mutation_details.id)) * 100 ELSE 0 END'), 'success_percentage'],
                'createdAt',
                'updatedAt',
            ],
            include:[
                {
                    model: mutation_details,
                    attributes: []
                }
            ],
            group:['id'],
            raw: true
        }
        let count = await mutation.count(filter)

        if (isNaN(limit) == false && isNaN(page) == false) {
            filter['offset'] = (page - 1) * limit
            filter['limit'] = limit
            filter['subQuery'] = false
        }

        let result = await mutation.findAll(filter).then(result => {
            var totalPage = (parseInt(count.length) / limit) + 1
            returnData = {
                result,
                metadata: {
                    page: page,
                    count: result.length,
                    totalPage: parseInt(totalPage),
                    totalData:  count.length,
                }
            }
            
            return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
            // return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            return apiResponse.ErrorResponse(res, err);
        });
    }
}