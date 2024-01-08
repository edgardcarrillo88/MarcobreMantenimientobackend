//const path = require('path')
const multer = require('multer')

console.log("ejecutando middleware form falla");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

module.exports = upload



// var Storagefile = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null, 'filesuploaded/')
//     },
//     filename: function (req, file, cb){
//         let ext = path.extname(file.originalname)
//         cb(null,Date.now() + ext)
//         console.log(Date.now() + ext);
//     } 
// })


// var upload = multer({
//     storage: Storagefile
// })


// module.exports = upload