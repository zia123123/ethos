const express = require('express');
const router = express.Router();


// Middlewares
//const auth_regional = require('./middlewares/auth-regional');

//
//const AuditPolicy = require('./policy/AuditPolicy');




const AuthenController = require('./controller/AuthenController');
const ProductController = require('./controller/ProductController');

const SupplierController = require('./controller/SupplierController');

const ProvincesController = require('./controller/ProvincesController');

const NinjaOriginController = require('./controller/NinjaOriginController');

const DistrictController = require('./controller/DistrictController');

const CityAgencyController = require('./controller/CityAgencyController');

const WarehouseController = require('./controller/WarehouseController');

const DomainController = require('./controller/DomainController');


const ProductStockController = require('./controller/ProductStockController');


const OfficeController = require('./controller/OfficeController');


const MappingController = require('./controller/MappingController');


const ForgetPassController = require('./controller/ForgetPassController');




const multer = require('multer')
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
router.post('/api/ethos/login', AuthenController.signIn);
router.get('/api/ethos/advertiser', AuthenController.getAdvertiser);
router.get('/api/ethos/cs', AuthenController.getCustomer);
router.get('/api/ethos/cs/:id', MappingController.getCustomerService);



//product
router.post('/api/product/create', ProductController.create);
router.get('/api/product/', ProductController.index);
router.get('/api/product/:id', ProductController.find, ProductController.show);
router.patch('/api/product/update/:id', ProductController.find,ProductController.updateProduct);



//supplier
router.post('/api/supplier/create', SupplierController.create);
router.get('/api/supplier/', SupplierController.index);
router.get('/api/supplier/:id', SupplierController.find, SupplierController.show);
router.patch('/api/supplier/update/:id', SupplierController.find,SupplierController.updateStock);


//province
router.post('/api/province/create', ProvincesController.create);
router.get('/api/province/', ProvincesController.index);
router.get('/api/province/:id', ProvincesController.find, ProvincesController.show);
router.patch('/api/province/update/:id', ProvincesController.find,ProvincesController.update);

//ninja
router.post('/api/ninjaorigin/create', NinjaOriginController.create);
router.get('/api/ninja/', NinjaOriginController.index);
router.get('/api/ninja/:id', NinjaOriginController.find, NinjaOriginController.show);
router.patch('/api/ninja/update/:id', NinjaOriginController.find,NinjaOriginController.update);

//district
router.post('/api/disctrict/create', DistrictController.create);
router.get('/api/disctrict/', DistrictController.index);
router.get('/api/disctrict/:id', DistrictController.find, DistrictController.show);
router.patch('/api/disctrict/update/:id', DistrictController.find,DistrictController.updateProduct);

//CityAgencyController
router.post('/api/cityagency/create', CityAgencyController.create);
router.get('/api/cityagency/', CityAgencyController.index);
router.get('/api/cityagency/:id', CityAgencyController.find, CityAgencyController.show);
router.patch('/api/cityagency/update/:id', CityAgencyController.find,CityAgencyController.updateProduct);


//warehouse
router.post('/api/warehouse/create', WarehouseController.create);
router.get('/api/warehouse/', WarehouseController.index);
router.get('/api/warehouse/:id', WarehouseController.find, WarehouseController.show);
router.patch('/api/warehouse/update/:id', WarehouseController.find,WarehouseController.update);



//domain
router.post('/api/domain/create', DomainController.create);
router.get('/api/domain/', DomainController.index);
router.get('/api/domain/:id', DomainController.find, DomainController.show);
router.patch('/api/domain/update/:id', DomainController.find,DomainController.update);



//ProductStockController
router.post('/api/stock/create', ProductStockController.create);
router.get('/api/stock/', ProductStockController.index);
router.get('/api/stock/:id', ProductStockController.find, ProductStockController.show);
router.patch('/api/stock/update/:id', ProductStockController.find,ProductStockController.update);


//office
router.post('/api/office/create', OfficeController.create);
router.get('/api/office/', OfficeController.index);
router.get('/api/office/:id', OfficeController.find, OfficeController.show);
router.patch('/api/office/update/:id', OfficeController.find,OfficeController.update);


//mapping
router.post('/api/mapping/create', MappingController.create);
router.get('/api/mapping/', MappingController.index);
router.get('/api/mapping/:id', MappingController.find, MappingController.show);
router.patch('/api/mapping/update/:id', MappingController.find,MappingController.update);


//forgetpaswor
router.post('/api/forget/create', ForgetPassController.create);
router.patch('/api/forget/update', ForgetPassController.updatePassword);

module.exports = router;