const { transaksis,statustranksasis,keranjangs,products,daexpedisis,customers,warehouses,auths,buktibayars,product_stocks    } = require('../models/index');
const { Op } = require("sequelize");
const apiResponse = require("../helpers/apiResponse");

module.exports = {

      
  
    //create
    async create(req, res) { 
        let keranjangdata =  req.body.products.replace(/\\n/g, '')
        let datakeranjang = eval(keranjangdata)
        let result = await transaksis.create({
            nama: req.body.nama,
            customerId: req.body.customerId,
            districtId: req.body.districtId,
            provinceId: req.body.provinceId,
            cityregencyId: req.body.cityregencyId,
            warehouseId: req.body.warehouseId,
            invoiceId: req.body.warehouseId,
            expedisiName: req.body.expedisiName,
            authId: req.body.authId,
            idtransaksi: req.body.idtransaksi,
            products: keranjangdata,
            discount: req.body.discount,
            typebayar: req.body.typebayar,
            pembayaran: req.body.pembayaran,
            status:  req.body.status,
            logstatus:  req.body.logstatus,
            ongkoskirim:  req.body.ongkoskirim,
            subsidi:  req.body.subsidi,
            memotransaksi: req.body.memotransaksi,
        }).then(result => {
            let keranjang = keranjangs.bulkCreate(datakeranjang, { individualHooks: true }).then(keranjang =>{
                return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
            })
            let keranjung = keranjangs.findAll({
                where: {
                    transaksiId: {
                    [Op.like]: req.body.idtransaksi,
                },
            },
            }).then(keranjung =>{
            let quantity = 0;
            for(var i=0;i<keranjung.length;i++){
                quantity = keranjung[i].jumlahproduct
                let stok = product_stocks.create({ 
                    productId: keranjung[i].productId,
                    warehouseId: req.body.warehouseId,
                    quantity: quantity,
                    inbound:false,
                    nodeliverorder: keranjung[i].id,
                    remark: "-"
                });
                let product = products.findOne({
                    where: {
                        id:  keranjung[i].productId
                    },
                }).then(product =>{
                    product.quantity = (parseInt(product.quantity) - parseInt(quantity));
                    product.save()
                })
            }
            apiResponse.successResponseWithData(res, "SUCCESS", req.keranjang);
            })
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },

    async find(req, res, next) {
        let result = await transaksis.findOne({
            where: {
               id: req.params.id
            },
            include: [ 
                { model: daexpedisis,
                    attributes: ['namabank','biayatambahan','norekening','biayacod','createdAt','totalharga'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                },
                { model: auths,
                    attributes: ['firstname'],
                },
                
            ]
        }).then(result => {
            req.transaksi = result;
            next();
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async index(req, res) {
        let result = await transaksis.findAll({
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi'],
                        // include: [ 
                        //     { model: daexpedisis,
                        //         attributes: ['id'],
                        //     }
                        // ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexGudang(req, res) {
        let result = await transaksis.findAll({
                        include: [ 
                            { model: warehouses,
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            }
                        ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexAll(req, res) {
        let result = await transaksis.findAll({
            where: {
                        status: {
                            [Op.or]: [
                                {
                            [Op.like]: '%D%'
                          },
                          {
                            [Op.like]: '%C%'
                          }, {
                            [Op.like]: '%E%'
                          }
                        ]
                     },
              },
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    attributes: ['firstname'],
                },
                { model: buktibayars,
                    attributes: ['link'],
                },
            ]
             
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async indexLunasRetur(req, res) {
        let result = await transaksis.findAll({
            where: {
                status: {
                    [Op.or]: [
                        {
                    [Op.like]: '%F%'
                  },
                  {
                    [Op.like]: '%K%'
                  }
                ]
             },
               
              },
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    attributes: ['firstname'],
                }
            ]
             
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahClosing(req, res) {
        let result = await transaksis.count()({ 
            where: {
                status: {
                  [Op.like]: '%I%'
                }
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahLead(req, res) {
        let result = await transaksis.count().then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    async jumlahOnprogress(req, res) {
        let result = await transaksis.count()({ 
            where: {
                status: {
                  [Op.like]: '%D%'
                }
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahRetur(req, res) {
        let result = await transaksis.count()({ 
            where: {
                status: {
                  [Op.like]: '%K%'
                }
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    
    async findAddLog(req, res, next) {
        let transaksi = await transaksis.findByPk(req.params.id);
        if (!transaksi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.transaksi = transaksi;
            next();
        }
    },

    async createBuktibayar(req, res, next) {
        var link = req.files.buktibayar == null ? null : req.files.buktibayar[0].filename
        let result = await buktibayars.create({
            link: 'images/'+link,
            transaksisId: req.params.id,
        }).then(result => {
            let transaksi = transaksis.findOne({
                where: {
                    id:  req.params.id
                },
            }).then(transaksi =>{
                transaksi.status = 'D';
                transaksi.invoiceId = req.body.invoiceId;
                transaksi.save()
            })
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
    },

    async findByuser(req, res) {
        let result = await transaksis.findAll({
            where: {
               authId: req.params.userid,
            //    name: req.params.clue,
            },
            attributes: ['id', 'nama','createdAt','pembayaran','status','products'],
            // include: [ 
            //     { model: keranjangs,
            //         where: {
            //             transaksiId:  transaksis.idtransaksi
            //         },
            //         attributes: ['id'],
            //         include: [ 
            //             { model: products,
            //                 attributes: ['name'],
            //             }
            //         ]
            //     }
            // ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async   getDetail(req, res) {
        let result = await transaksis.findOne({
            where: {
                    id: req.params.id,
            },
            //attributes: ['id', 'nama','status','districtId','memotransaksi','idtransaksi','expedisiName'],
            include: [ 
                { model: daexpedisis,
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: customers,
                  
                },
                { model: buktibayars,
                    attributes: ['link'],
                },
                
            ]
            
        }).then(result => {

            
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    

    async filterTransaksi(req, res) {
        let result = await transaksis.findAll({
            where: {
                [Op.or]: [
                    {
                        nama: {
                            [Op.like]: '%'+req.params.clue+'%'
                     }
                    }
                    
                ]
            },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    // Show
    async show(req, res) {
        return apiResponse.successResponseWithData(res, "SUCCESS", req.transaksi);
    },

    // Update
    // async updatestatus(req, res) {
    //     req.transaksi.name = req.body.name;
    //     req.transaksi.save().then(transaksi => {
    //     return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
    //     })
    // },

    // add log
    async addlogstatus(req, res) {
        req.transaksi.status = req.body.logstatus;
        req.transaksi.sudahbayar = req.body.sudahbayar;
        req.transaksi.kurangbayar = req.body.kurangbayar;
        req.transaksi.statusbarang = req.body.statusbarang;
        req.transaksi.logstatus = req.transaksi.logstatus+"#"+req.body.logstatus;
        req.transaksi.save().then(transaksi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
        })
    },

    async uploadBuktibayar(req, res) {
        var link = req.files.buktibayar == null ? null : req.files.buktibayar[0].filename
        req.transaksi.buktibayar =  'images/'+link;
        req.transaksi.invoiceId = req.body.invoiceId;
        req.transaksi.status = 'D';
        req.transaksi.save().then(transaksi => {
        return apiResponse.successResponseWithData(res, "SUCCESS", transaksi);
        })
    },


    // Delete
    async delete(req, res) {
        req.transaksi.destroy().then(province => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
