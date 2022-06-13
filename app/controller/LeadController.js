const { lead } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");


module.exports = {
    //create
    async create(req, res) { 
        let result = await lead.create({
            sumber: "customer",
            authId: req.body.authId,
            productId: req.body.productId,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

}
