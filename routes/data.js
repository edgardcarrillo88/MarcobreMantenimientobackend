const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');

const upload = require('../middleware/fileprocess');
const uploadMiddleware = require('../middleware/dailyprocess');
const uploadMiddlewarePolines = require('../middleware/polinesprocess');


datarouter.post('/registerform',upload.array('files'),datacontroller.registerform)
datarouter.get('/getalldata',datacontroller.getalldata)

datarouter.post('/dailyreport',uploadMiddleware,datacontroller.dailyreport)
datarouter.get('/getalldatadailyreport',datacontroller.getalldatadailyreport)

datarouter.get('/getsingledata',datacontroller.getsingledata)
datarouter.get('/filters',datacontroller.getfiltersdata)
datarouter.get('/schedule',datacontroller.getscheduledata)
datarouter.put('/updatestatus',datacontroller.statusupdate)
datarouter.get('/filtereddata',datacontroller.filtereddata)

datarouter.put('/updatedata',datacontroller.updatedata)

datarouter.get('/polines',datacontroller.getpolinesdata)
datarouter.post('/deletepolines',datacontroller.deleteallpolines)
datarouter.post('/polinesreport',uploadMiddlewarePolines,datacontroller.registerpolines)
datarouter.get('/getpolinesreport',datacontroller.getpolinesregisterdata)


module.exports = datarouter