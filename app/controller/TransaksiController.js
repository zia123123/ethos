const {
    returs,deliveryfods, transaksis,statustranksasis,keranjangs,products,
    daexpedisis,customers,warehouses,auths,buktibayars,product_stocks,
    districts,cityregencies,province 
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

    //create
    async create(req, res) { 
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var tanggal = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        let keranjangdata =  req.body.products.replace(/\\n/g, '')
        let datakeranjang = eval(keranjangdata)
        let result = await transaksis.create({
            nama: req.body.nama,
            customerId: req.body.customerId,
            districtId: req.body.districtId,
            provinceId: req.body.provinceId,
            provinsiname: req.body.provinsiname,
            cityname: req.body.cityname,
            districtname: req.body.districtname,
            cityregencyId: req.body.cityregencyId,
            warehouseId: req.body.warehouseId,
            invoiceId: req.body.warehouseId,
            expedisiName: req.body.expedisiName,
            authId: req.body.authId,
            groupId: req.body.groupId,
            createdAt: tanggal,
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
            // let keranjung = keranjangs.findAll({
            //     where: {
            //         transaksiId: {
            //         [Op.like]: req.body.idtransaksi,
            //     },
            // },
            // }).then(keranjung =>{
            let quantity = 0;
            for(var i=0;i<datakeranjang.length;i++){
                quantity = datakeranjang[i].jumlahproduct
                let stok = product_stocks.create({ 
                    productId: datakeranjang[i].productId,
                    warehouseId: req.body.warehouseId,
                    quantity: quantity,
                    inbound:false,
                    nodeliverorder: datakeranjang[i].id,
                    remark: "-"
                });
                let product = products.findOne({
                    where: {
                        id:  datakeranjang[i].productId
                    },
                }).then(product =>{
                    product.quantity = (parseInt(product.quantity) - parseInt(quantity));
                    product.save()
                })
            }
            // apiResponse.successResponseWithData(res, "SUCCESS", req.keranjang);
            // })
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
            });
    },
    async finddelete(req, res, next) {
        let transaksi = await transaksis.findByPk(req.params.id);
        if (!transaksi) {
        return apiResponse.notFoundResponse(res, "Not Fond");
        } else {
            req.transaksi = transaksi;
            next();
        }
    },
    async index(req, res) {
      
        let metodebayar = parseInt(req.query.metodebayar)
        let status = req.query.status
        let nama = req.query.nama
        //let statusbarang = req.query.statusbarang
        
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:59.000Z"
    
     
        if( status == null ){
            status = ""
        }
        // if( statusbarang == null ){
        //     statusbarang = ""
        // }
        if( nama == null ){
            nama = ""
        }
        if(isNaN(parseFloat(metodebayar))){
            metodebayar = ""
        }
    
        let result = await transaksis.findAll({
            where:{
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                authId: req.params.userid,
                [Op.and]: [
                    {
                    status: {    
                        [Op.like]: '%'+status+'%'
                    }
                     },
                    //  {
                    //     statusbarang: {    
                    //         [Op.like]: '%'+statusbarang+'%'
                    //     }
                    //      },
                     {
                        pembayaran: {    
                            [Op.like]: '%'+metodebayar+'%'
                        }
                        
                         },
                         {
                            nama: {    
                                [Op.like]: '%'+nama+'%'
                            }
                             },
                  ],
             },
            order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi',],
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

 //CONTOH PAGINATION

    async indexGudang(req, res) {
      
        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await transaksis.count({ where: {
            warehouseId: warehouseId}})
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
             },
                status: {
                    [Op.or]: [
                  {
                    [Op.like]: '%K%'
                  },
                  {
                    [Op.like]: '%G%'
                  },
                  
                ]
             },
              },
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: warehouses,
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            },
                            { model: daexpedisis,
                                attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
                            }
            ]
        }).then(result => {
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
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async indexGudangRiwayat(req, res) {
      
        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await transaksis.count({ where: {
            warehouseId: warehouseId}})
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
             },
                status: {
                    [Op.or]: [
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%N%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                ]
             },
              },
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: warehouses,
                                attributes: ['name'],
                            }, { model: customers,
                                attributes: ['notelp'],
                            },
                            { model: daexpedisis,
                                attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
                            }
            ]
        }).then(result => {
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
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },



    async riwayatall(req, res) {
       
        let result = await transaksis.findAll({
           
            where: {
                status: {
                    [Op.or]: [
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%N%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                ]
             },
              },
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: warehouses,
                            },
                             { model: customers,
                            },
                            { model: daexpedisis,
                            },
                            { model: auths,
                               
                            }
            ]
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelGudang(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.like]: '%H%'
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
          //  console.log(result)
            class Transaksi {
                constructor(SenderPhone,Invoice,part1,qty1,part2,qty2,part3,qty3,RecepientName,RecepientNo,RecepientAdress,RecepientProvinsi,RecepientKota,RecepientKecamatan,RecepientKodePos,memo,awb,expedisi,ongkos,tag,warehousename,typebayar,ongkir,subsidi,gudangKota,gudangAlamat,gudangPost,namacs,aa) {
                  this.SenderPhone = SenderPhone;
                  this.Invoice = Invoice;
                  this.part1 = part1;
                  this.qty1 = qty1;
                  this.part2 = part2;
                  this.qty2 = qty2;
                  this.part3 = part3;
                  this.qty3 = qty3;
                  this.RecepientName = RecepientName;
                  this.RecepientNo = RecepientNo;
                  this.RecepientAdress = RecepientAdress;
                  this.RecepientProvinsi = RecepientProvinsi;
                  this.RecepientKota = RecepientKota;
                  this.RecepientKecamatan = RecepientKecamatan;
                  this.RecepientKodePos = RecepientKodePos;
                  this.memo = memo;
                  this.awb = awb;
                  this.expedisi = expedisi;
                  this.ongkos = ongkos;
                  this.tag = tag;
                  this.warehousename = warehousename;
                  this.typebayar = typebayar;
                  this.ongkir = ongkir;
                  this.subsidi = subsidi;
                  this.gudangKota = gudangKota;
                  this.gudangAlamat = gudangAlamat;
                  this.gudangPost = gudangPost;
                  this.namacs = namacs;
                  this.aa = aa;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                    }
                  }
                var  KeranjangArray = [];
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct));
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }           
                TransaksiArray.push(new Transaksi("FHG",result[i].auth.notelp,result[i].invoiceId,
                KeranjangArray[0].namaproduct,KeranjangArray[0].sku,KeranjangArray[0].jumlahproduct.toString(),
                KeranjangArray[1].namaproduct, KeranjangArray[1].sku,KeranjangArray[1].jumlahproduct.toString(),
                KeranjangArray[2].namaproduct,KeranjangArray[2].sku,KeranjangArray[2].jumlahproduct.toString(),
                result[i].customer.nama,result[i].customer.notelp,
                result[i].customer.alamat,result[i].customer.provinsiname,
                result[i].customer.cityname,result[i].customer.districtname,
                result[i].customer.postalcode,result[i].awb,result[i].expedisiName,
                result[i].daexpedisis.totalharga.toString(),result[i].auth.firstname,
                result[i].warehouse.name,
                type,
                result[i].ongkoskirim.toString(),
                result[i].subsidi.toString(),
                result[i].warehouse.address,
                result[i].warehouse.postalcode,
                result[i].auth.firstname,
                "aa"));
            }
          // console.log(KeranjangArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Sender",
                "Sender Phone No.",
                "Invoice",
                "Nama Produk 1",
                "SKU 1",
                "Qty 1",
                "Nama Produk 2",
                "SKU 2",
                "Qty 2",
                "Nama Produk 3",
                "SKU 3",
                "Qty 3",
                "Recepient Name",
                "Recipient Phone No",
                "Recipient Address",
                "Recipient Provinsi",
                "Recipient Kabupaten / Kota",
                "Recipient Kecamatan",
                "Recipient Kode POS",   
                "AWB",
                "3PL",
                "COD",
                "TAG",
                "Warehouse",
                "TypeBayar",
                "Ongkos Pengiriman",
                "Subsidi Pengiriman",
                "Kota Pengirim",
                "Alamat Pengirim",
                "Kode Pos Pengirim",
                ""
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async ExcelFinance(req, res) {
        let startDate = req.query.startDate+"T00:00:00.000Z"
        let endDate = req.query.endDate+"T23:59:00.000Z"
        

        let typebayar = req.query.typebayar
        if(isNaN(parseFloat(typebayar))){
            typebayar = ""
        }

        let expedisiName = req.query.expedisiName
        if( expedisiName == null ){
            expedisiName = ""
        }

        let warehouseId = req.query.warehouseId
        if( warehouseId == null ){
            warehouseId = ""
        }

        
        let result = await transaksis.findAll({
            where: {
                createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
                [Op.and]: {
                warehouseId: {
                    [Op.like]: '%'+warehouseId+'%'
                },
                typebayar: {
                    [Op.like]: '%'+typebayar+'%'
                },
                expedisiName: {
                    [Op.like]: '%'+expedisiName+'%'
                },
                status: {
                    [Op.or]: [
                        {
                    [Op.like]: '%F%'
                  },
                  {
                    [Op.like]: '%G%'
                  },
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                  {
                    [Op.like]: '%J%'
                  },
                  {
                    [Op.like]: '%K%'
                  },
                  {
                    [Op.like]: '%L%'
                  },
                  {
                    [Op.like]: '%M%'
                  }
                  ,
                  {
                    [Op.like]: '%N%'
                  },
                  {
                    [Op.like]: '%O%'
                  }
                ]
                  },
                }
              },
              attributes: ['invoiceId','awb','ongkoskirim','subsidi','products','expedisiName','typebayar'],
              order: [
                ['id', 'DESC'],
            ],
                        include: [ 
                            { model: customers,
            
                            },
                            { model: warehouses,
                                include: [ {
                                     model: districts,
                                    attributes: ['name']
                                },
                                { model: cityregencies,
                                    attributes: ['name']
                                },
                                { model: province,
                                    attributes: ['name']
                                }]
                            },
                            { model: auths,
                                attributes: ['notelp','firstname'],
                            },
                            { model: daexpedisis,
                                attributes: ['totalharga'],
                            },
            ]
        }).then(result => {
          //  console.log(result)
            class Transaksi {
                constructor(SenderPhone,Invoice,part1,qty1,part2,qty2,part3,qty3,RecepientName,RecepientNo,RecepientAdress,RecepientProvinsi,RecepientKota,RecepientKecamatan,RecepientKodePos,memo,awb,expedisi,ongkos,tag,warehousename,typebayar,ongkir,subsidi,gudangKota,gudangAlamat,gudangPost,namacs,aa) {
                  this.SenderPhone = SenderPhone;
                  this.Invoice = Invoice;
                  this.part1 = part1;
                  this.qty1 = qty1;
                  this.part2 = part2;
                  this.qty2 = qty2;
                  this.part3 = part3;
                  this.qty3 = qty3;
                  this.RecepientName = RecepientName;
                  this.RecepientNo = RecepientNo;
                  this.RecepientAdress = RecepientAdress;
                  this.RecepientProvinsi = RecepientProvinsi;
                  this.RecepientKota = RecepientKota;
                  this.RecepientKecamatan = RecepientKecamatan;
                  this.RecepientKodePos = RecepientKodePos;
                  this.memo = memo;
                  this.awb = awb;
                  this.expedisi = expedisi;
                  this.ongkos = ongkos;
                  this.tag = tag;
                  this.warehousename = warehousename;
                  this.typebayar = typebayar;
                  this.ongkir = ongkir;
                  this.subsidi = subsidi;
                  this.gudangKota = gudangKota;
                  this.gudangAlamat = gudangAlamat;
                  this.gudangPost = gudangPost;
                  this.namacs = namacs;
                  this.aa = aa;
                }
              }
            var  TransaksiArray = [];
          
            for(var i=0;i<result.length;i++){
                class Keranjang {
                    constructor(namaproduct,sku,jumlahproduct) {
                      this.namaproduct = namaproduct;
                      this.sku = sku;
                      this.jumlahproduct = jumlahproduct;
                    }
                  }
                var  KeranjangArray = [];
                let keranjangdata =  result[i].products.replace(/\\n/g, '')
                let datakeranjang = eval(keranjangdata)
                for(var j=0;j<=3;j++){
                    if(datakeranjang[j] === undefined){
                        KeranjangArray.push(new Keranjang("","",""));
                    }else{
                        KeranjangArray.push(new Keranjang(datakeranjang[j].namaproduct,datakeranjang[j].sku,datakeranjang[j].jumlahproduct));
                    }
                   
                }    
                if(result[i].typebayar == 1){
                  var type = "Transfer"
                }else{
                  var type = "COD"
                }           
                TransaksiArray.push(new Transaksi("FHG",result[i].auth.notelp,result[i].invoiceId,
                KeranjangArray[0].namaproduct,KeranjangArray[0].sku,KeranjangArray[0].jumlahproduct.toString(),
                KeranjangArray[1].namaproduct, KeranjangArray[1].sku,KeranjangArray[1].jumlahproduct.toString(),
                KeranjangArray[2].namaproduct,KeranjangArray[2].sku,KeranjangArray[2].jumlahproduct.toString(),
                result[i].customer.nama,result[i].customer.notelp,
                result[i].customer.alamat,result[i].customer.provinsiname,
                result[i].customer.cityname,result[i].customer.districtname,
                result[i].customer.postalcode,result[i].awb,result[i].expedisiName,
                result[i].daexpedisis.totalharga.toString(),result[i].auth.firstname,
                result[i].warehouse.name,
                type,
                result[i].ongkoskirim.toString(),
                result[i].subsidi.toString(),
                result[i].warehouse.address,
                result[i].warehouse.postalcode,
                result[i].auth.firstname,
                "aa"));
            }
          // console.log(KeranjangArray)
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Data Transaksi');
            const headingColumnNames = [
                "Sender",
                "Sender Phone No.",
                "Invoice",
                "Nama Produk 1",
                "SKU 1",
                "Qty 1",
                "Nama Produk 2",
                "SKU 2",
                "Qty 2",
                "Nama Produk 3",
                "SKU 3",
                "Qty 3",
                "Recepient Name",
                "Recipient Phone No",
                "Recipient Address",
                "Recipient Provinsi",
                "Recipient Kabupaten / Kota",
                "Recipient Kecamatan",
                "Recipient Kode POS",   
                "AWB",
                "3PL",
                "COD",
                "TAG",
                "Warehouse",
                "TypeBayar",
                "Ongkos Pengiriman",
                "Subsidi Pengiriman",
                "Kota Pengirim",
                "Alamat Pengirim",
                "Kode Pos Pengirim",
                ""
            ]
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });
            let rowIndex = 2;
            TransaksiArray.forEach( record => {
                let columnIndex = 1;
                Object.keys(record ).forEach(columnName =>{
                    ws.cell(rowIndex,columnIndex++)
                        .string(record [columnName])
                });
                rowIndex++;
            }); 
            var filename = +Date.now()+'-transaksidata.xlsx'
            returnData = {
                metadata: {
                    link: filename,
                }
            }
            wb.write(filename,res);
            //var data = fs.readFileSync(path.resolve(__dirname, 'transaksidata.xlsx'))
            //return apiResponse.successResponseWithData(res, "SUCCESS", returnData);
           //return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

  
    async indexAll(req, res) {
        let invoiceId = req.query.invoiceId
        if( invoiceId == null ){
            invoiceId = ""
        }
        let result = await transaksis.findAll({
            where: {
                [Op.and]: [
                    {
                        invoiceId: {    
                        [Op.like]: '%'+invoiceId+'%'
                    }
                     },
                  ],
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
              order: [
                ['id', 'DESC'],
            ],
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


    async indexFinanceWeb(req, res) {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await transaksis.count({where: {
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
         },}})          
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
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
              order: [
                ['id', 'DESC'],
            ],
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
                { model: customers,
                    attributes: ['notelp','nama'],
                },
            ]
             
        }).then(result => {
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
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },


    async indexFinanceExcel(req, res) {
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
              order: [
                ['id', 'DESC'],
            ],
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
                { model: customers,
                    attributes: ['notelp','nama'],
                },
            ]
             
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },
    

    async indexLunasRetur(req, res) {
         let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const count = await transaksis.count({
            where: {
                status: {
                        [Op.or]: [
                            {
                        [Op.like]: '%F%'
                      },
                      {
                        [Op.like]: '%G%'
                      },
                      {
                        [Op.like]: '%H%'
                      },
                      {
                        [Op.like]: '%I%'
                      },
                      {
                        [Op.like]: '%J%'
                      },
                      {
                        [Op.like]: '%K%'
                      },
                      {
                        [Op.like]: '%L%'
                      },
                      {
                        [Op.like]: '%M%'
                      }
                      ,
                      {
                        [Op.like]: '%N%'
                      },
                      {
                        [Op.like]: '%O%'
                      }
                    ]
                },
            }
       })
         let status = req.query.status
         let invoiceId = req.query.invoiceId
         let namabank = req.query.namabank
         let startDate = req.query.startDate+"T00:00:00.000Z"
         let endDate = req.query.endDate+"T17:00:00.000Z"

        if( invoiceId == null ){
            invoiceId = ""
        }
        if( namabank == null ){
            namabank = ""
        }
        if( status == null ){
            status = ""
        }
        
        let result = await transaksis.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            where:{
                status: {
                    [Op.or]: [
                        {
                    [Op.like]: '%F%'
                  },
                  {
                    [Op.like]: '%G%'
                  },
                  {
                    [Op.like]: '%H%'
                  },
                  {
                    [Op.like]: '%I%'
                  },
                  {
                    [Op.like]: '%J%'
                  },
                  {
                    [Op.like]: '%K%'
                  },
                  {
                    [Op.like]: '%L%'
                  },
                  {
                    [Op.like]: '%M'
                  }
                ]
             },
               createdAt :  {
                    [Op.and]: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                    }
                  },
             //authId: req.params.userid,
                [Op.and]: [
                    {
                    status: {    
                        [Op.like]: '%'+status+'%'
                    }
                     },
                     {
                        invoiceId: {    
                            [Op.like]: '%'+invoiceId+'%'
                        }
                         },
                  ],
              },
              order: [
                ['id', 'DESC'],
            ],
            attributes: ['id', 'nama','createdAt','pembayaran','status','idtransaksi','invoiceId','subsidi','ongkoskirim'],
            include: [ 
                { model: daexpedisis,
                    where: {
                        namabank: {
                            [Op.or]: [
                                {
                            [Op.like]: '%'+namabank+'%'
                          },
                        ]
                     },
                    },
                    attributes: ['biayatambahan','norekening','biayacod','createdAt','namabank','totalharga'],
                },
                { model: auths,
                    attributes: ['firstname'],
                },
                { model: customers,
                    attributes: ['notelp','nama'],
                },
            ]
             
        }).then(result => {
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
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahClosing(req, res) {
        let result = await transaksis.count({ 
            where: {
                [Op.and]: [
                    {
                        status: req.query.status
                     },
                     {
                        authId: req.query.authId
                        },
                  ],
                status: req.query.status
              },
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS", result);
            }).catch(function (err){
                return apiResponse.ErrorResponse(res, err);
            });
    },

    async jumlahPenghasilan(req, res) {
        let result = await keranjangs.sum('price',{ 
            where: {
                authId: req.query.authId
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
        var link = req.files[0].filename
        let result = await buktibayars.create({
            link: "https://storage.googleapis.com/ethos-kreatif-app.appspot.com/"+link,
            transaksisId: req.params.id,
        }).then(result => {
            let transaksi = transaksis.findOne({
                where: {
                    id:  req.params.id
                },
            }).then(transaksi =>{
                transaksi.status = 'D';
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
                { model: warehouses,
                    include: [ { model: districts,
                        attributes: ['name']
                    },
                    { model: cityregencies,
                        attributes: ['name']
                    },
                    { model: province,
                        attributes: ['name']
                    }]
                   
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
    

    async createdeliveryfods(req, res) { 
        var link = req.files[0].filename
        let result = await deliveryfods.create({
            awbpengembalian: req.body.awbpengembalian,
            expedisipengembalian: req.body.expedisipengembalian,
            awbpengiriman: req.body.awbpengiriman,
            transaksisId: req.params.id,
            authId: req.body.authId,
            expedisipengiriman: req.body.expedisipengiriman,
            typedfod: req.body.typedfod,
            kondisibarang: req.body.kondisibarang,
            biayapengembalian: req.body.biayapengembalian,
            biayapengiriman: req.body.biayapengiriman,
            evidance: "https://storage.googleapis.com/ethos-kreatif-app.appspot.com/"+link,
            keterangan: req.body.keterangan,
            state: req.body.state,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
            return apiResponse.ErrorResponse(res, err);
        });
      },
      async createretur(req, res) { 
        let result = await returs.create({
            awbpengembalian: req.body.awbpengembalian,
            expedisipengembalian: req.body.expedisipengembalian,
            awbpengiriman: req.body.awbpengiriman,
            transaksisId: req.params.id,
            authId: req.body.authId,
            expedisipengiriman: req.body.expedisipengiriman,
            typedfod: req.body.typedfod,
            kondisibarang: req.body.kondisibarang,
            biayapengembalian: req.body.biayapengembalian,
            biayapengiriman: req.body.biayapengiriman,
            keterangan: req.body.keterangan,
            state: req.body.state,
        }).then(result => {
            return apiResponse.successResponseWithData(res, "SUCCESS CREATE", result);
        }).catch(function (err)  {
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
            order: [
                ['id', 'DESC'],
            ],
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
        req.transaksi.awb = req.body.awb;
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
        req.transaksi.destroy().then(transaksi => {
            res.json({ msg: "Berhasil di delete" });
        })
    },

}
