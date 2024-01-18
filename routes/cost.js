const express = require('express');
const filesrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const filecontroller = require('../controllers/costprocess.js');

filesrouter.post('/',Upload.single('file'),filecontroller.uploadexcel)
filesrouter.get('/getalldata',filecontroller.getalldata)

module.exports = filesrouter