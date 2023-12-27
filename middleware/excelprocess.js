const path = require('path')
const multer = require('multer')

var Storagefile = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'filesuploaded/')
    },
    filename: function (req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null,Date.now() + ext)
        console.log(Date.now() + ext);
    } 
})

var Upload = multer({
    storage: Storagefile
})

module.exports = Upload