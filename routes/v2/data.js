const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../../controllers/v2/pdp');
const Upload =  require('../../middleware/excelprocess')

//Parada de Planta
datarouter.post('/loadactivities',Upload.single('file'),datacontroller.uploadexcel)
datarouter.get('/schedule',datacontroller.getscheduledata)
datarouter.get('/taskhistorydata',datacontroller.getdatahistory)
datarouter.post('/deleteschedule',datacontroller.deleteschedule)
datarouter.post('/deleteschedulehistorydata',datacontroller.deletehistorydata)

datarouter.get('/filters',datacontroller.getfiltersdata)
datarouter.get('/thirdparty',datacontroller.GetThirdParty)
datarouter.get('/especialidad',datacontroller.GetEspecialidad)
datarouter.put('/updatestatus',datacontroller.statusupdate)
datarouter.get('/filtereddata',datacontroller.filtereddata)
datarouter.put('/updatedata',datacontroller.updatedata)

datarouter.get('/gettaskupdates',datacontroller.GetValidationData)
datarouter.post('/updatevalidation',datacontroller.UpdateValidation)




module.exports = datarouter