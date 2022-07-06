const {
    mutation, mutation_details, nomorekenings, Sequelize 
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
        const finish = req.query.finish
        let queryFinish = {[Op.like]: `%%`}

        if( search == null ){
            search = ""
        }

        if (finish == 100) {
            queryFinish = {[Op.like]: `%100%`}
        }else if (finish == 0) {
            queryFinish = {[Op.lt]: 100}
        }

        const date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1),
            endDate   = new Date(date.setDate(date.getDate() + 1));

        if (req.query.startDate) {
            startDate = Math.floor(req.query.startDate) 
        }
        if (req.query.endDate) {
            endDate = Math.floor(req.query.endDate)
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
                Sequelize.where(Sequelize.literal(`(CASE WHEN COUNT(mutation_details.id) > 0 THEN (SUM(CASE WHEN mutation_details.invoice IS NOT NULL THEN 1 ELSE 0 END)/COUNT(mutation_details.id)) * 100 ELSE 0 END)`),queryFinish
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
                },
                {
                    model: nomorekenings,
                    // required: true,
                    attributes: ['nomor', 'nama_bank', 'nama']
                },
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
    },

    async detail(req, res){
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        let search = req.query.search
        const mutationId = req.params.id

        if( search == null ){
            search = ""
        }

        const date = new Date();
        let startDate = new Date(0),
            endDate   = date.setDate(date.getDate() + 1);

        if (req.query.startDate) {
            startDate = Math.floor(req.query.startDate) 
        }
        if (req.query.endDate) {
            endDate = Math.floor(req.query.endDate)
        }

        let mutationDate = {[Op.ne]: null}
        if (req.query.mutationStartDate != null || req.query.mutationEndDate != null) {
            const mutationStartDate = new Date(req.query.mutationStartDate)
            const mutationEndDate = new Date(req.query.mutationEndDate)
            mutationDate = {
                [Op.and]: {
                    [Op.gte]: mutationStartDate,
                    [Op.lte]: mutationEndDate 
                  }
            }
        }

        let filter = 
        {
            where:{
                mutationId: mutationId,
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                },
                date: mutationDate,
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
                    include:[
                        {
                            model: nomorekenings,
                        }
                    ]
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

    // async import(req, res){
    //     console.log(req.body.norekeningId);
    //     const createMutation = await mutation.create({
    //         norekeningsId: req.body.norekeningId
    //     }).then(result => {
    //         const orders = req.body.dataExcel
    //         const mutationDetail = orders.map(function(row){
    //             return {
    //                 date: row.Tanggal,
    //                 description: row.Deskripsi,
    //                 debit: row.Debit,
    //                 kredit: row.Kredit,
    //                 saldo: row.Saldo,
    //                 mutationId:result.id,
    //                 norekening:req.body.norekening
    //             }
    //         })
    //         mutation_details.bulkCreate(mutationDetail).catch(function (err)  {
    //             console.log(err);
    //         })
    //         return apiResponse.successResponseWithData(res, "SUCCESS", orders);
    //     }).catch(function (err)  {
    //         return apiResponse.ErrorResponse(res, err);
    //     });
    // },

    async import(req, res){
        const createMutation = await mutation.create({
            norekeningsId: req.body.norekeningsId
        }).then(result => {
            const orders = req.body.dataExcel
            const mutationDetail = orders.map(async row =>{
                const date = new Date(row.Tanggal+' 00:00:00')
                const userTimezoneOffset = date.getTimezoneOffset() * 60000;

                const mutationDetails = await mutation_details.findOne({
                    where: {
                        norekeningsId:req.body.norekeningsId,
                        date: new Date(date.getTime() - userTimezoneOffset),
                        description: row.Deskripsi,
                        debit: row.Debit,
                        kredit: row.Kredit,
                        saldo: row.Saldo,
                    }
                }).then(resultMutationDetail => {
                    if (resultMutationDetail == null) {
                        mutation_details.create({
                            date: new Date(date.getTime() - userTimezoneOffset),
                            description: row.Deskripsi,
                            debit: row.Debit,
                            kredit: row.Kredit,
                            saldo: row.Saldo,
                            mutationId:result.id,
                            norekeningsId:req.body.norekeningsId
                        })
                    }
                    
                }).catch(function (err)  {
                    console.log(err);
                });
            })
            
            return apiResponse.successResponseWithData(res, "SUCCESS", orders);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async find(req, res, next) {
        let result = await mutation.findByPk(req.params.id,{
            include:[
                {
                    model: mutation_details,
                }
            ]
        });
        if (!result) {
            return apiResponse.notFoundResponse(res, "Not Found");
        } else {
            req.mutation = result;
            next();
        }
    },

    async delete(req, res) {
        req.mutation.destroy().then(mutation => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

    async findDetail(req, res, next) {
        let result = await mutation_details.findByPk(req.params.id,{
            include:[
                {
                    model: mutation,
                }
            ]
        });
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Found");
        } else {
            req.mutation = result;
            next();
        }
    },
}