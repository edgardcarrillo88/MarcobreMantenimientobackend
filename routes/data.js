const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');

const upload = require('../middleware/fileprocess');


datarouter.post('/registerform',upload.array('files'),datacontroller.registerform)
datarouter.get('/getalldata',datacontroller.getalldata)
datarouter.get('/getsingledata',datacontroller.getsingledata)
datarouter.get('/filters',datacontroller.getfiltersdata)
datarouter.get('/schedule',datacontroller.getscheduledata)
datarouter.put('/updatestatus',datacontroller.statusupdate)
datarouter.get('/filtereddata',datacontroller.filtereddata)

module.exports = datarouter