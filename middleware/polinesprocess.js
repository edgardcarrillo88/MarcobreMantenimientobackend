const multer = require('multer');

console.log("ejecutando middleware polines");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).fields([
  { name: 'files', maxCount: 10 }
]);

module.exports = upload;
