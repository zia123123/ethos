const { mapgroup,auths,group,mapcs, Sequelize } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

    //create
    async create(req, res) { 
        let result = await mapgroup.create({
            authId: req.body.authId,
            groupId: req.body.groupId,
            type:  req.body.type,
            status:true,
        }).then(result => {
            let auth = auths.findOne({
                where: {
                    id:  req.body.authId
                },
            }).then(auth =>{
                auth.status = false;
                auth.save()
            })
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await mapgroup.findOne({
            where: {
                    id: req.params.id,
            },
        });
        if (!result) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.result = result;
            next();
        }
    },

    async index(req, res) {
        let result = await mapgroup.findAll({
            attributes: ['id','createdAt','type'],
            include: [ 
                { model: auths,
                    as:'auth',
                    attributes: ['firstname'],
                },
                
            ]

        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async myUser(req, res) {
        let search = req.query.search

        if( search == null ){
            search = ""
        }

        let result = await mapgroup.findAll({
            attributes: ['id','createdAt','status','type'],
            where:{
                groupId: req.query.groupId,
                [Op.or]:[
                    {
                        type:{
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        '$auth.firstname$':{
                            [Op.like]: `%${search}%`
                        }
                    },
                ],
            },
            include: [ 
                { model: auths,
                    as:'auth',
                    attributes: ['id', 'firstname'],
                },
                
            ]

        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.result);
    },

    // Update
    async update(req, res) {
        req.result.status = req.body.status;
        req.result.save().then(result => {
        return apiResponse.successResponseWithData(res, "SUCCESS", result);
        })
    },

    // Delete
    async delete(req, res) {
        let auth = auths.findOne({
            where: {
                id:   req.result.authId
            },
        }).then(auth =>{
            auth.status = true;
            auth.save()
            req.result.destroy().then(result => {
                res.json({ msg: "Berhasil di delete" });
           })
            
        })
    },

    async csNullByAuthDomain(req, res){
        const authId = req.query.authId
        const domainId = req.query.domainId
        const role = req.query.role

        let result = await mapgroup.findAll({
            attributes: ['id','createdAt','type'],
            include: [ 
                { model: auths,
                    as:'auth',
                    required: true,
                    attributes: ['id', 'firstname'],
                    where:{
                        role: role
                    },

                    include:[
                        {
                            model: mapcs,
                            required: false,
                            where:{
                                domainId: domainId,
                                id: {
                                    [Op.eq]: null
                                }
                            }
                        }
                    ]
                },
            ],
            where:{
                groupId: Sequelize.literal(`groupId = (SELECT groupId FROM mapgroups where authId = ${authId})`)
            }

        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
        }).catch(function (err){
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        });
    }

}
