const multer = require('multer')

console.log("Ejecutando middleware excel");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

module.exports = upload