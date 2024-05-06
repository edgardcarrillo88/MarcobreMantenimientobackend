const multer = require('multer');

// console.log("ejecutando middleware daily report");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).fields([
  { name: 'files', maxCount: 10 },
  { name: 'photos', maxCount: 10 },
]);

module.exports = upload;
