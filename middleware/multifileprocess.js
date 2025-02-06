const multer = require('multer');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).fields([
  { name: 'file', maxCount: 5 }
]);

const processFiles = (req, res, next) => {
  if (req.files && req.files.file) {
    req.files.file = req.files.file.map(file => {
      return {
        name: file.originalname, // Nombre original del archivo
        lastModified: Date.now(), // Establecer fecha de modificación actual
        lastModifiedDate: new Date(), // Fecha de modificación actual
        webkitRelativePath: '', // No hay valor para esto, así que lo dejamos vacío
        size: file.size, // Tamaño del archivo
        type: file.mimetype, // Tipo MIME del archivo
        buffer: file.buffer // Buffer para subir el archivo a DigitalOcean
      };
    });
  }
  next();
};

module.exports = { upload, processFiles };