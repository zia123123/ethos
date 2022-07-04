const express = require('express');
const router = express.Router();
const mime = require('mime-types');


// Middlewares
//const auth_regional = require('./middlewares/auth-regional');

//


const OngkirController = require('./controller/OngkirController');

const CatalogControoler = require('./controller/CatalogControoler');

const SaldoController = require('./controller/SaldoController');

const MapCsController = require('./controller/MapCsController');

const PengajuanBiayaController = require('./controller/PengajuanBiayaController');




const DfodController = require('./controller/DfodController');
const AuthenController = require('./controller/AuthenController');

const ProductController = require('./controller/ProductController');

const SupplierController = require('./controller/SupplierController');

const ProvincesController = require('./controller/ProvincesController');

const NinjaOriginController = require('./controller/NinjaOriginController');
const IklanController = require('./controller/IklanController');
const GroupControoler = require('./controller/GroupControoler');



const ReturController = require('./controller/ReturController');


const DistrictController = require('./controller/DistrictController');

const CityAgencyController = require('./controller/CityAgencyController');

const WarehouseController = require('./controller/WarehouseController');

const DomainController = require('./controller/DomainController');

const BiayaIklanController = require('./controller/BiayaIklanController');


const ProductStockController = require('./controller/ProductStockController');


const OfficeController = require('./controller/OfficeController');

const MapGrouController = require('./controller/MapGrouController');


const MappingController = require('./controller/MappingController');


const ForgetPassController = require('./controller/ForgetPassController');


const CustomerController = require('./controller/CustomerController');

const GroupCsController = require('./controller/GroupCsController');

const MapGroupCsController = require('./controller/MapGroupCsController');
const BiayaopController = require('./controller/BiayaopController');


const FTransaksiController = require('./controller/FTransaksiController');

const TransaksiController = require('./controller/TransaksiController');

const StatusController = require('./controller/StatusController');

const MappingProduct = require('./controller/MappingProduct');


const ExpedisiController = require('./controller/ExpedisiController');


const DaExpedisiController = require('./controller/DaExpedisiController');

const MappingNorekController = require('./controller/MappingNorekController');

const KeranjangController = require('./controller/KeranjangController');

const NorekController = require('./controller/NorekController');

const DroupOutController = require('./controller/DroupOutController');

const UnitController = require('./controller/UnitController');

const InbondController = require('./controller/InbondController');
const Ekpedisicontroller = require('./controller/Ekpedisicontroller');
const DashboardController = require('./controller/DashboardController');
const MutationController = require('./controller/MutationController');
const MutationDetailController = require('./controller/MutationDetailController');
const LeadController = require('./controller/LeadController');
const TransaksiTempController = require('./controller/TransaksiTempController');


const multer = require('multer')
var multerGoogleStorage = require("multer-cloud-storage");
var uploadHandler = multer({
  storage:  multerGoogleStorage.storageEngine({
    autoRetry: true,
    //contentType: "image/png",
    bucket: 'ethos-kreatif-app.appspot.com',
    projectId: 'ethos-kreatif-app',
    keyFilename: 'ethos-firestore-key.json',
    filename: function(req, file, next){
        const ext = file.mimetype.split('/')[1]
        next(null, file.fieldname+ '-' +Date.now()+ '.' +ext)
    }
  })
});
const multerConf = {
    storage: multer.diskStorage({
        destination : function(req,file, next){
            next(null,'./app/public/images')
        },
        filename: function(req, file, next){
            const ext = file.mimetype.split('/')[1]
            next(null, file.fieldname+ '-' +Date.now()+ '.' +ext)
        }
    }),
    Filefilter: function(req,file,next){
        if(!file){
            next()
        }
        const image = file.mimetype.startsWidth('images/')
        if(image){
            next(null,true)
        }else{
            next({
                message: "File Not Supported"
            }, false)
        }
    }
};


router.post('/api/ethos/register', AuthenController.signUp); 
router.post('/api/ethos/production/login', AuthenController.signIn);
router.post('/api/ethos/loginfinance', AuthenController.signInFinance);
router.get('/api/ethos/advertiser', AuthenController.getListAdvertiser);
router.get('/api/ethos/listuser', AuthenController.getListUser);
router.get('/api/ethos/cs', AuthenController.getCustomer);
router.get('/api/ethos/cs/:id', MappingController.getCustomerService);

router.put('/api/ethos/update/:id', AuthenController.find, AuthenController.update);
router.delete('/api/ethos/delete/:id', AuthenController.find, AuthenController.delete);

router.get('/api/ethos/user/:id', AuthenController.find, AuthenController.show);

router.get('/api/ethos/user/', AuthenController.index);

//product
router.post('/api/product/create',uploadHandler.any(), ProductController.create);
router.get('/api/product/', ProductController.index);
router.get('/api/suppproduct/', ProductController.indexBySupp);
router.get('/api/product/:id', ProductController.find, ProductController.show);
router.patch('/api/product/update/:id',ProductController.findUpdate,uploadHandler.any(),ProductController.updateProduct);
router.delete('/api/product/delete/:id', ProductController.finddelete,ProductController.delete);
    


//pengajuanbiayaiklan
router.post('/api/pengajuanbiaya/create', PengajuanBiayaController.create);
router.get('/api/pengajuanbiaya/', PengajuanBiayaController.index);
router.get('/api/pengajuanbiaya/finance', PengajuanBiayaController.indexfinance);
router.get('/api/pengajuanbiaya/supervisor', PengajuanBiayaController.indexsupervisor);
router.get('/api/pengajuanbiaya/advertiser', PengajuanBiayaController.indexadvertiser);
//router.get('/api/suppproduct/', PengajuanBiayaController.indexBySupp);
router.get('/api/pengajuanbiaya/:id', PengajuanBiayaController.find, PengajuanBiayaController.show);
router.patch('/api/pengajuanbiaya/update/:id', PengajuanBiayaController.find,PengajuanBiayaController.update);
router.delete('/api/pengajuanbiaya/delete/:id', PengajuanBiayaController.find,PengajuanBiayaController.delete);



//mapcs
router.post('/api/mapcs/create', MapCsController.create);
router.get('/api/mapcs/', MapCsController.index);
router.get('/api/mapcs/getdatacs', MapCsController.getDataCs);
router.get('/api/mapcs/:id', MapCsController.find, MapCsController.show);
router.patch('/api/mapcs/update/:id', MapCsController.find,MapCsController.update);
router.delete('/api/mapcs/delete/:id', MapCsController.find,MapCsController.delete);

//supplier
router.post('/api/supplier/create', SupplierController.create);
router.get('/api/supplier/', SupplierController.index);
router.get('/api/supplier/:id', SupplierController.find, SupplierController.show);
router.patch('/api/supplier/update/:id', SupplierController.find,SupplierController.updateStock);
router.delete('/api/supplier/delete/:id', SupplierController.find,SupplierController.delete);


router.get('/api/getidinvoice', TransaksiController.getidInvoice);


//inbond
router.post('/api/inbond/create', InbondController.create);
router.get('/api/inbond/', InbondController.index);
router.get('/api/inbond/:id', InbondController.find, InbondController.show);
router.patch('/api/inbond/update/:id', InbondController.find,InbondController.update);
router.delete('/api/inbond/delete/:id', InbondController.find,InbondController.delete);


//catalog
router.post('/api/catalog/create', CatalogControoler.create);
router.post('/api/rangesicepat/create', CatalogControoler.createrange);
router.get('/api/catalog/', CatalogControoler.index);
router.get('/api/catalog/:id', CatalogControoler.find, CatalogControoler.show);
router.patch('/api/catalog/update/:id', CatalogControoler.find,CatalogControoler.update);
router.delete('/api/catalog/delete/:id', CatalogControoler.find,CatalogControoler.delete);

//dropput
router.post('/api/dropout/create', DroupOutController.create);
router.get('/api/dropout/', DroupOutController.index);
router.get('/api/dropout/:id', DroupOutController.find, DroupOutController.show);
router.delete('/api/dropout/delete/:id', DroupOutController.find,DroupOutController.delete);

//province
router.post('/api/province/create', ProvincesController.create);
router.get('/api/province/', ProvincesController.index);
router.get('/api/province/:id', ProvincesController.find, ProvincesController.show);
router.patch('/api/province/update/:id', ProvincesController.find,ProvincesController.update);


//unit
router.post('/api/unit/create', UnitController.create);
router.get('/api/unit/', UnitController.index);
router.get('/api/unit/:id', UnitController.find, UnitController.show);
router.patch('/api/unit/update/:id', UnitController.find,UnitController.update);
router.delete('/api/unit/delete/:id', UnitController.find,UnitController.delete);


//ninja
router.post('/api/ninjaorigin/create', NinjaOriginController.create);
router.get('/api/ninja/', NinjaOriginController.index);
router.get('/api/ninja/:id', NinjaOriginController.find, NinjaOriginController.show);
router.patch('/api/ninja/update/:id', NinjaOriginController.find,NinjaOriginController.update);

//ekpedisi
router.post('/api/ekpedisi/create', Ekpedisicontroller.create);
router.get('/api/ekpedisiinternal/', Ekpedisicontroller.indexInternal);
router.get('/api/ekpedisiexternal/', Ekpedisicontroller.indexExternal);
router.get('/api/ekpedisi/:id', Ekpedisicontroller.find, Ekpedisicontroller.show);
router.patch('/api/ekpedisi/update/:id', Ekpedisicontroller.find,Ekpedisicontroller.update);
router.delete('/api/ekpedisi/delete/:id', Ekpedisicontroller.find,Ekpedisicontroller.delete);

//district
router.post('/api/disctrict/create', DistrictController.create);
router.get('/api/disctrict/:id', DistrictController.index);
//router.get('/api/disctrict/:id', DistrictController.find, DistrictController.show);
//router.patch('/api/disctrict/update/:id', DistrictController.find,DistrictController.updateProduct);

//CityAgencyController
router.post('/api/cityagency/create', CityAgencyController.create);
router.get('/api/cityagency/:id', CityAgencyController.index);
//router.get('/api/cityagency/:id', CityAgencyController.find, CityAgencyController.show);
//router.patch('/api/cityagency/update/:id', CityAgencyController.find,CityAgencyController.updateProduct);


//warehouse
router.post('/api/warehouse/create', WarehouseController.create);
router.get('/api/warehouse/', WarehouseController.index);
router.get('/api/warehouse/all', WarehouseController.indexAll);

router.get('/api/warehouse/:id', WarehouseController.find, WarehouseController.show);
router.patch('/api/warehouse/update/:id', WarehouseController.find,WarehouseController.update);
router.delete('/api/warehouse/delete/:id', WarehouseController.find,WarehouseController.delete);

router.get('/api/destination/', WarehouseController.indexDestionaios);



//domain
router.post('/api/domain/create', DomainController.create);
router.get('/api/domain/', DomainController.index);
router.get('/api/domain/:id', DomainController.find, DomainController.show);
router.patch('/api/domain/update/:id', DomainController.find,DomainController.update);
router.delete('/api/domain/delete/:id', DomainController.find,DomainController.delete);



//ProductStockController

router.post('/api/stock/create', ProductStockController.create);
router.get('/api/stock/', ProductStockController.index);
router.get('/api/stock/warehouse/:warehouseId', ProductController.indexWarehouse);
//router.get('/api/stock/:id', ProductStockController.find, ProductStockController.show);
router.patch('/api/stock/update/:id', ProductStockController.find,ProductStockController.update);
router.delete('/api/stock/delete/:id', ProductStockController.find, ProductStockController.delete);




//office
router.post('/api/office/create', OfficeController.create);
router.get('/api/office/', OfficeController.index);
router.get('/api/office/:id', OfficeController.find, OfficeController.show);
router.patch('/api/office/update/:id', OfficeController.find,OfficeController.update);

//office
router.post('/api/office/create', OfficeController.create);
router.get('/api/office/', OfficeController.index);
router.get('/api/office/:id', OfficeController.find, OfficeController.show);
router.patch('/api/office/update/:id', OfficeController.find,OfficeController.update);


//iklan
router.post('/api/iklan/create', IklanController.create);
router.get('/api/iklan/', IklanController.index);
router.get('/api/iklan/:id', IklanController.find, IklanController.show);
router.patch('/api/iklan/update/:id', IklanController.find,IklanController.update);
router.delete('/api/iklan/delete/:id', IklanController.find,IklanController.delete);

//iklan
router.post('/api/group/create', GroupControoler.create);
router.get('/api/group/', GroupControoler.index);
router.get('/api/group/my/', GroupControoler.indexKu);
router.get('/api/group/:id', GroupControoler.find, GroupControoler.show);
router.patch('/api/group/update/:id', GroupControoler.find,GroupControoler.update);
router.delete('/api/group/delete/:id', GroupControoler.find,GroupControoler.delete);




//iklan
router.post('/api/mapgroup/create', MapGrouController.create);
router.get('/api/mapgroup/', MapGrouController.myUser);
router.get('/api/mapgroup/:id', MapGrouController.find, MapGrouController.show);
router.patch('/api/mapgroup/update/:id', MapGrouController.find,MapGrouController.update);
router.delete('/api/mapgroup/delete/:id', MapGrouController.find,MapGrouController.delete);

//biaya iklan
router.post('/api/biayaiklan/create', BiayaIklanController.create);
router.get('/api/biayaiklan/', BiayaIklanController.index);
router.get('/api/biayaiklan/:id', BiayaIklanController.find, BiayaIklanController.show);
router.patch('/api/biayaiklan/update/:id', BiayaIklanController.find,BiayaIklanController.update);
router.delete('/api/biayaiklan/delete/:id', BiayaIklanController.find,BiayaIklanController.delete);



router.post('/api/saldo/create',uploadHandler.any(), SaldoController.create);
router.get('/api/saldo/', SaldoController.index);
router.get('/api/saldo/:id', SaldoController.find, SaldoController.show);
router.patch('/api/saldo/update/:id', SaldoController.find,SaldoController.update);
router.delete('/api/saldo/delete/:id', SaldoController.find,SaldoController.delete);

//customer
router.post('/api/customer/create', CustomerController.create);
router.get('/api/customer/', CustomerController.index);
router.get('/api/groupcustomer/', CustomerController.myGroup);
router.get('/api/mycustomer/', CustomerController.myCustomer);
router.get('/api/customerlead/', CustomerController.jumlahLead);
router.get('/api/customer/:id', CustomerController.find, CustomerController.show);
router.get('/api/customer/filter/:clue', CustomerController.filterCustomer);

router.patch('/api/customer/update/:id', CustomerController.find,CustomerController.update);


//groupcs
router.post('/api/groupcs/create', GroupCsController.create);
router.get('/api/groupcs/', GroupCsController.index);
router.get('/api/groupcs/:id', GroupCsController.find, GroupCsController.show);
router.patch('/api/groupcs/update/:id', GroupCsController.find,GroupCsController.update);

//mapGroupCs
router.post('/api/mapgroup/create', MapGroupCsController.create);
router.get('/api/mapgroup/', MapGroupCsController.index);
router.get('/api/mapgroup/:id', MapGroupCsController.find, MapGroupCsController.show);
router.patch('/api/mapgroup/update/:id', MapGroupCsController.find,MapGroupCsController.update);


//status transaksi
router.post('/api/status/create', StatusController.create);
router.get('/api/status/', StatusController.index);
router.get('/api/status/:id', StatusController.find, StatusController.show);
router.patch('/api/status/update/:id', StatusController.find,StatusController.update);


//status transaksi
router.post('/api/expedisi/create', ExpedisiController.create);
router.get('/api/expedisi/', ExpedisiController.index);
router.get('/api/expedisi/:id', ExpedisiController.find, ExpedisiController.show);
router.patch('/api/expedisi/update/:id', ExpedisiController.find,ExpedisiController.update);

//DFOD
router.post('/api/dfod/create/:id',uploadHandler.any(), TransaksiController.createdeliveryfods);
router.get('/api/dfod/', DfodController.index);
router.get('/api/dfod/riwayat', DfodController.indexriwayat);
router.get('/api/dfod/:id', DfodController.find, DfodController.show);
router.patch('/api/dfod/update/:id', DfodController.find,DfodController.update);

//biayaop
router.post('/api/biayaop/create', BiayaopController.create);
router.get('/api/biayaop/', BiayaopController.index);
router.get('/api/biayaop/:id', BiayaopController.find, BiayaopController.show);
router.patch('/api/biayaop/update/:id', BiayaopController.find,BiayaopController.update);
router.patch('/api/biayaop/delete/:id', BiayaopController.find,BiayaopController.delete);


//retur
router.post('/api/retur/create/:id', TransaksiController.createretur);
router.get('/api/retur/', ReturController.index);
router.get('/api/retur/riwayat', ReturController.indexriwayat);
router.get('/api/retur/:id', ReturController.find, ReturController.show);
router.patch('/api/retur/update/:id', ReturController.find,ReturController.update);


//forgetpaswor
router.post('/api/dataexpedisi/create', DaExpedisiController.create);
router.get('/api/dataexpedisi', DaExpedisiController.index);



//KEBUTUHAN TRANSAKSI
router.post('/api/metodebayar/create', FTransaksiController.createMPembayaran);
router.get('/api/metodebayar/', FTransaksiController.indexMPembayaran);
router.post('/api/nomorrekening/create', FTransaksiController.createnomorekenings);
router.get('/api/nomorrekening/', FTransaksiController.indexnomorekenings);
router.post('/api/typep/create', FTransaksiController.createtypepelanggans);
router.get('/api/typep/', FTransaksiController.indextypepelanggans);
router.post('/api/statusT/create', FTransaksiController.createstatustranksasis);
router.get('/api/statusT/', FTransaksiController.indexstatustranksasis);
router.post('/api/jenispaket/create', FTransaksiController.createjenispakets);
router.get('/api/jenispaket/', FTransaksiController.indexsjenispakets);


//transaksi
router.post('/api/transaksi/productionnew/create', TransaksiController.create);
router.get('/api/transaksi/cs/:userid', TransaksiController.index);
router.get('/api/transaksi/all', TransaksiController.indexAll);
router.get('/api/transaksi/gudang', TransaksiController.indexGudang);
router.get('/api/transaksi/dashboard-gudang', TransaksiController.dashboardGudang);
router.post('/api/transaksi/gudang/import', TransaksiController.importPermintaanPesanan);
router.get('/api/transaksi/gudangriwyat', TransaksiController.indexGudangRiwayat);
router.get('/api/financeweb', TransaksiController.indexFinanceWeb);
router.get('/api/transaksi/excelfinance', TransaksiController.indexFinanceExcel);
router.get('/api/transaksi/daftartransaksi', TransaksiController.daftarTransaksi);
router.get('/api/transaksi/:id', TransaksiController.find, TransaksiController.show);
router.get('/api/transaksi/user/:userid', TransaksiController.findByuser);
router.get('/api/transaksi/detail/:id', TransaksiController.getDetail);
router.get('/api/jumlah/closing', TransaksiController.jumlahClosing);
router.get('/api/jumlah/penghasilan', TransaksiController.jumlahPenghasilan);

router.get('/api/keranjang/penghasilan', KeranjangController.penghasilan);


router.get('/api/riwayatall', TransaksiController.riwayatall);
router.get('/api/transaksi/retur', TransaksiController.jumlahRetur);
router.get('/api/transaksi/lead', TransaksiController.jumlahLead);
router.get('/api/transaksi/progress', TransaksiController.jumlahOnprogress);
router.get('/api/getexcel/', TransaksiController.ExcelGudang);
router.get('/api/getexcelStatusBarang/', TransaksiController.ExcelGudangRiwayat);
router.get('/api/getexcelFinanceRiwayat/', TransaksiController.ExcelFinanceRiwayat);
router.get('/api/getexcelFinance/', TransaksiController.ExcelFinance);
router.get('/api/getexcelTemplateGudang/', TransaksiController.ExcelTemplateGudang);
router.get('/api/getexcelRiwayatAll/', TransaksiController.ExcelRiwayatAll);
router.get('/api/getexcelVerifikasiPembayaran/', TransaksiController.ExcelVerifikasiPembayaran);
router.get('/api/getexcelLabel/', TransaksiController.ExcelLabel);
router.get('/api/getexcelShipper/', TransaksiController.ExcelShipper);
router.get('/api/getexcelPermintaanPesanan/', TransaksiController.ExcelPermintaanPesanan);
router.get('/api/getexcelRequestKonfirmasiDFOD/', TransaksiController.ExcelRequestKonfirmasiDFOD);
router.get('/api/getexcelRiwayatVerifikasi/', TransaksiController.ExcelRiwayatVerifikasi);
router.get('/api/getexcelDaftarTransaksi/', TransaksiController.ExcelDaftarTransaksi);




router.delete('/api/transaksi/delete/:id',TransaksiController.finddelete, TransaksiController.delete);
router.get('/api/lunasretur/transaksi', TransaksiController.indexLunasRetur);
router.put('/api/transaksi/buktibayar/:id',uploadHandler.any(),TransaksiController.createBuktibayar);
router.get('/api/transaksi/filter/:clue', TransaksiController.filterTransaksi);
router.put('/api/transaksi/addlog/:id', TransaksiController.findAddLog, TransaksiController.addlogstatus);




//mapproduct
router.post('/api/mapproduct/create', MappingProduct.create);
router.get('/api/mapproduct/', MappingProduct.index);
router.get('/api/mapproduct/:id', MappingProduct.find, MappingProduct.show);
router.get('/api/mapproduct/product/:domainId', MappingProduct.findBydomain);

 
//mappingnorek

//mapGroupCs
router.post('/api/mapnorek/create', MappingNorekController.create);
router.get('/api/mapnorek/', MappingNorekController.index);
router.get('/api/mapnorek/:id', MappingNorekController.find, MappingNorekController.show);
router.patch('/api/mapnorek/update/:id', MappingNorekController.find,MappingNorekController.update);


router.post('/api/norek/create', NorekController.create);
router.get('/api/norek/', NorekController.index);
router.get('/api/norek/cs/:id', NorekController.getNorekBycs);
router.get('/api/norek/finance/:id', NorekController.getNorekByfinance);
router.get('/api/norek/:id', NorekController.find, NorekController.show);
router.patch('/api/norek/update/:id', NorekController.find,NorekController.update);
router.delete('/api/norek/:id', NorekController.find, NorekController.delete);


router.get('/api/ongkir/ninja', OngkirController.indexninja);
router.get('/api/ongkir/sicepat', OngkirController.indexsicepat);
router.get('/api/ongkir/jnt', OngkirController.indexjnt);
router.get('/api/ongkir/idexpress', OngkirController.indexidexpress);




//keranjang
router.post('/api/keranjang/create', KeranjangController.create);
router.get('/api/keranjang/', KeranjangController.index);

router.get('/api/keranjang/sumtotal/:transaksiId', KeranjangController.sumtotal);
router.get('/api/keranjang/byidtransaksi/:transaksiId', KeranjangController.findByIdtransaksi);
router.get('/api/keranjang/:id', KeranjangController.find, KeranjangController.show);
router.patch('/api/keranjang/update/:id', KeranjangController.find,KeranjangController.update);

router.get('/api/keranjang/outbond/:transaksiId', KeranjangController.array);

//dashboard ceo
router.get('/api/dashboard-ceo/omset', DashboardController.omset);
router.get('/api/dashboard-ceo/omset-produk-kota', DashboardController.omsetProdukKota);
router.get('/api/dashboard-ceo/omset-internal', DashboardController.omsetInternal);
router.get('/api/dashboard-ceo/omset-partner', DashboardController.omsetPartner);
router.get('/api/dashboard-ceo/sku-by-group', DashboardController.skuByGroup);
router.get('/api/dashboard-ceo/omset-produk-utama', DashboardController.omsetProdukUtama);
router.get('/api/dashboard-ceo/adv-by-group', DashboardController.advByGroup);
router.get('/api/dashboard-ceo/sku-by-adv-and-group', DashboardController.skuByAdvAndGroup);
router.get('/api/dashboard-ceo/closing-rate-adv', DashboardController.closingRateAdv);
router.get('/api/dashboard-ceo/omset-pencapaian-group', DashboardController.omsetPencapaianGroup);
router.get('/api/dashboard-ceo/cs-by-group-adv-product', DashboardController.csByGroupAdvProduct);
router.get('/api/dashboard-ceo/closing-rate-adv-cs', DashboardController.closingRateAdvCs);

router.get('/api/mutation/', MutationController.index);
router.get('/api/mutation/:id', MutationController.detail);
router.post('/api/mutation', MutationController.import);
router.delete('/api/mutation/delete/:id', MutationController.find, MutationController.delete);
router.delete('/api/mutation/delete-detail/:id', MutationController.findDetail, MutationController.delete);

router.get('/api/mutation-detail/', MutationDetailController.index);
router.get('/api/mutation-detail/invoice-null', MutationDetailController.indexInvoiceNull);
router.get('/api/mutation-detail/invoice/:id', MutationDetailController.indexByInvoice);
router.patch('/api/mutation-detail/update', MutationDetailController.update);

router.get('/api/lead/', LeadController.index);
router.get('/api/lead/cs/:id', LeadController.indexByCS);
router.post('/api/lead/', LeadController.getLeadByCsPhoneNumberDomain, LeadController.create);
router.get('/api/lead/:id', LeadController.find, LeadController.show);
router.put('/api/lead/:id', LeadController.find, LeadController.update);

router.get('/api/mapgroups/cs-null-by-auth-domain', MapGrouController.csNullByAuthDomain);

router.get('/api/customer-phone-number/', CustomerController.getCustomerPhoneNumbers);
router.get('/api/customer-phone-number/:phone', CustomerController.getCustomerByPhoneNumber);

router.get('/api/lead-after-domain/', LeadController.getLeadByPhoneNumberDomainCs, CustomerController.createByLead);

router.get('/api/dashboard-mobile/closingRateCs/:id', DashboardController.closingRateCs);
router.get('/api/mapcsByProduct/', MapCsController.indexByProduct);

router.get('/api/transaksi-temp/cs/:userid', TransaksiTempController.index);
router.get('/api/transaksi-temp/:id', TransaksiTempController.show);
router.put('/api/transaksi-temp/:id', TransaksiTempController.find, TransaksiTempController.update);

module.exports = router;
