const express = require('express');
const router = express.Router();


// Middlewares
//const auth_regional = require('./middlewares/auth-regional');

//
//const AuditPolicy = require('./policy/AuditPolicy');




const AuthenController = require('./controller/AuthenController');
const ProductController = require('./controller/ProductController');
const PriceController = require('./controller/PriceController');


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

//product
router.post('/api/product/create', ProductController.create);
router.get('/api/product/', ProductController.index);
router.get('/api/product/:id', ProductController.find, ProductController.show);
router.patch('/api/product/update/:id', ProductController.find,ProductController.updateStock);

//price
router.post('/api/prices/create', PriceController.create);
router.get('/api/prices/', PriceController.index);
router.get('/api/prices/:id', PriceController.find, PriceController.show);



module.exports = router;