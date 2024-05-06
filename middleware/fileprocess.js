const multer = require('multer')

// console.log("ejecutando middleware form falla");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

module.exports = upload


