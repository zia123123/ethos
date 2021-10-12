const express = require('express');
const router = express.Router();


// Middlewares
//const auth_regional = require('./middlewares/auth-regional');

//
//const AuditPolicy = require('./policy/AuditPolicy');





const BeritaController = require('./controller/BeritaController');
const UserController = require('./controller/UserController');
const VoteController = require('./controller/VoteController');

const VotedController = require('./controller/VotedController');

const CalonController = require('./controller/CalonController');


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

//createvalidate
router.post('/api/validate/', UserController.createValidate);
//user
router.get('/api/user/', UserController.index);
router.post('/api/validate/', UserController.createValidate);

router.patch('/api/update/validate/:id', UserController.findValidate, UserController.updateValidate);

router.put('/api/nama/update/:id', UserController.findValidate, UserController.updateNama);

router.put('/api/updatert/user/:id', UserController.findValidate, UserController.updateRt);

router.get('/api/validate/index', UserController.indexvalidate);
router.post('/api/user/create', UserController.signupUser);
router.post('/api/login', UserController.signInUser);
router.post('/api/user/cekktp',UserController.cektp, UserController.cekstatus);
router.get('/api/user/getdata/:ktp',UserController.cektpku, UserController.show);
//update to true
router.post('/api/user/totrue',UserController.cektp, UserController.updateTrue);
//RESET PASSWORD
router.get('/api/user/reset/:ktp', UserController.findKtp,UserController.updatePassword);


//berita
router.post('/api/berita/create',multer(multerConf).fields([{
    name: 'photo', maxCount: 1
    }
]), BeritaController.create);
router.get('/api/berita/', BeritaController.index);
router.patch('/api/berita/update/:id',BeritaController.find, BeritaController.update);
router.get('/api/berita/:id',BeritaController.find, BeritaController.show);
router.patch('/api/berita/delete/:id',BeritaController.find, BeritaController.delete);

//vote
router.post('/api/vote/create',multer(multerConf).fields([{
    name: 'photo', maxCount: 1
    }
]), VoteController.create);
router.get('/api/vote/', VoteController.index);
router.patch('/api/vote/update/:id',VoteController.find, VoteController.update);
router.get('/api/vote/:id',VoteController.find, VoteController.show);
router.get('/api/vote/rt/:rt',VoteController.findRt, VoteController.show);
router.delete('/api/vote/delete/:id',VoteController.find, VoteController.delete);

//calon
router.post('/api/calon/create',multer(multerConf).fields([{
    name: 'photo', maxCount: 1
    }
]), CalonController.create);
router.get('/api/calon/:voteId', CalonController.indexCalon);

router.patch('/api/calon/update/:id',CalonController.find, CalonController.update);
router.get('/api/calon/:id',CalonController.find, CalonController.show);
router.patch('/api/calon/delete/:id',CalonController.find, CalonController.delete);

router.get('/api/all/calon/', CalonController.indexAll);
//voted
router.post('/api/voted/create', VotedController.create);
router.get('/api/voted/:voteid/:ktp', VotedController.find);
router.get('/api/voted/vote', VotedController.index);
router.get('/api/voted/all', VotedController.indeAll);
router.get('/api/log/:voteId', VotedController.index);

router.get('/api/bar/:voteid', VotedController.indexBar);




module.exports = router;