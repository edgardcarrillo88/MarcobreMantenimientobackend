const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');
const upload = require('../middleware/fileprocess');


datarouter.post('/registerform',upload.array('files'),datacontroller.registerform)
datarouter.get('/getalldata',datacontroller.getalldata)
datarouter.get('/getsingledata',datacontroller.getsingledata)

module.exports = datarouter