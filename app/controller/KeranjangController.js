const { keranjangs,product_stocks,products,transaksis } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {
  
    //create
    async create(req, res) { 
        let result = await keranjangs.create({
              namaproduct: req.body.namaproduct,
              jumlahproduct: req.body.jumlahproduct,
              linkdomain: req.body.linkdomain,
              linkphoto: req.body.linkphoto,
              hpp: req.body.hpp,
              discount: req.body.discount,
              transaksiId: req.body.transaksiId,
              productId: req.body.productId,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let keranjang = await keranjangs.findByPk(req.params.id);
        if (!keranjang) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.keranjang = keranjang;
            next();
        }
    },

    async index(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        let result = await keranjangs.findAll({
            createdAt :  {
                [Op.and]: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate
                }
              },
            where: {
                authId: {
                [Op.like]: req.query.authId,
            },
        },
        attributes: ['id', 'namaproduct','jumlahproduct','price','createdAt'],
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async penghasilan(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                    authId: {
                        [Op.like]: req.query.authId,
                    },
                    status: {
                        [Op.or]: [
                            {
                                [Op.like]: '%H%'
                            },
                            {
                                [Op.like]: '%I%'
                            },
                        ]
                      },
                }
              },
              attributes: ['createdAt','products','expedisiName','typebayar'],
              order: [
                ['id', 'DESC'],
            ],
        }).then(result => {
            var KeranjangArray = [];
            var total = 0;
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,price,jumlahproduct) {
                      this.namaproduct = namaproduct;
                      this.price = price;
                      this.jumlahproduct = jumlahproduct;
                    }
                  }
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                       j=3;
                    }else{
                        KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].price,datakeranjang[j].jumlahproduct));
                        total += datakeranjang[j].price
                    }
                }          
            }
           returnData = {
                status: 200,
                message: "SUCCESS",
                data: KeranjangArray,
                totalpenhasilan:  total,
        }
 
        return res.status(200).json(returnData);
        // return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           // wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           return apiResponse.successResponseWithData(res, "SUCCESS", KeranjangArray);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async findByIdtransaksi(req, res) {
        let result = await keranjangs.findAll({
            where: {
                transaksiId: {
                [Op.like]: req.params.transaksiId,
            },
        },
        attributes: ['id', 'namaproduct','jumlahproduct','linkdomain','linkphoto','discount','price','weight'],
        }).then(result => {
            // let keranjang = keranjangs.sum('price',{
            //     where: {
            //         transaksiId: {
            //         [Op.like]: req.params.transaksiId,
            //     },
            // },
            // }).then(keranjang =>{
            //     return apiResponse.successResponseWithTwoData(res, "SUCCESS", result, keranjang);
            // })
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async sumtotal(req, res) {
        let result = await keranjangs.sum('price',{
            where: {
                transaksiId: {
                [Op.like]: req.params.transaksiId,
            },
        },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async array(req, res) {
 
    },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.keranjang);
    },

    // Update
    async update(req, res) {
        req.keranjang.namaproduct = req.body.namaproduct;
        req.keranjang.jumlahproduct = req.body.jumlahproduct;
        req.keranjang.linkdomain = req.body.linkdomain;
        req.keranjang.linkphoto = req.body.linkphoto;
        req.keranjang.discount = req.body.discount;
        req.keranjang.transaksiId = req.body.transaksiId;
        req.keranjang.save().then(keranjang => {
        return apiResponse.successResponseWithData(res, "SUCCESS", keranjang);
        })
    },

    // Delete
    async delete(req, res) {
        req.keranjang.destroy().then(keranjang => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
