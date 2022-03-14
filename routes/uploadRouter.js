//Enable file uploading 
const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');//installed and req'd multer middleware library to set up an Express server to accept file uploads

//customized storage
const storage = multer.diskStorage({//diskStorage provided by multer give obj config settings
    destination: (req, file, cb) => {//set destination prop takes a f(x) needs req obj, file & callback f(x)
        cb(null, 'public/images');//used callbak passed null-no err, then path want save file to
    },
    filename: (req, file, cb) => {//set up filename similar to destination
        cb(null, file.originalname)//this make sure name file on server same as name of file on client; if don't set by def multer give random string
    }
});

//created file filter
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {//used regex exp look for file ext
        return cb(new Error('You can upload only image files!'), false);//rejects file upload
    }
    cb(null, true);//no err accept file
};

//call multer f(x), now multer module config to enable img file uploads
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

//set up Router
const uploadRouter = express.Router();

//Config upload router to handle var http req's and only allow post req's
uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})//added multer using upload const-expect single upload of file f/imageFile
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);//sends file back to client confirms file rec'd correctly
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

//exported router
module.exports = uploadRouter;