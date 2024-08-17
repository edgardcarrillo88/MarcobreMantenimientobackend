const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');
const controllerprueba = require('../controllers/message');
const upload = require('../middleware/fileprocess');
const UploadExcel =  require('../middleware/excelprocess')
const uploadMiddleware = require('../middleware/dailyprocess');
const uploadMiddlewarePolines = require('../middleware/polinesprocess');


//Data Planta
datarouter.post('/cargaequiposplanta',UploadExcel.single('file'),datacontroller.Temporal)
datarouter.get('/getdataequiposplanta',datacontroller.GetEquiposPlanta)


//Reporte rápido de Falla
datarouter.post('/registerform',upload.array('files'),datacontroller.registerform)
datarouter.get('/getalldata',datacontroller.getalldata)
datarouter.get('/getsingledata',datacontroller.getsingledata)


//Reporte diario de contratistas
datarouter.post('/dailyreport',uploadMiddleware,datacontroller.dailyreport)
datarouter.get('/getalldatadailyreport',datacontroller.getalldatadailyreport)

//Reporte de andamios
datarouter.post('/guardardatosandamios',datacontroller.RegistrarAndamios)
datarouter.post('/actualizardatosandamios',datacontroller.ActualizarAndamios)
datarouter.get('/getalldataandamios',datacontroller.getalldataandamios)
datarouter.get('/getsingledataandamios',datacontroller.GetSingleDataAndamios)



//Reporte Backlog
datarouter.post('/crearpreaviso',datacontroller.CrearPreAviso)
datarouter.post('/uploadimagebacklog',UploadExcel.single('file'),datacontroller.GuardarImagenPreAviso)


//Gestión de NCR
datarouter.post('/crearsolicitudncr',datacontroller.CrearNCR)
datarouter.get('/getalldatancr',datacontroller.GetAllDataNCR)
datarouter.get('/getsingledatancr',datacontroller.GetSingleDataNCR)




//Parada de Planta
datarouter.get('/schedule',datacontroller.getscheduledata)
datarouter.get('/taskhistorydata',datacontroller.getdatahistory)
datarouter.post('/deleteschedule',datacontroller.deleteschedule)
datarouter.post('/deleteschedulehistorydata',datacontroller.deletehistorydata)


datarouter.get('/filters',datacontroller.getfiltersdata)
datarouter.put('/updatestatus',datacontroller.statusupdate)
datarouter.get('/filtereddata',datacontroller.filtereddata)
datarouter.put('/updatedata',datacontroller.updatedata)

datarouter.post('/registroinduccion',datacontroller.RegistroInduccion)
datarouter.get('/getinducciondata',datacontroller.ObtenerRegistroInduccion)
datarouter.get('/getcontratistas',datacontroller.ObtenerRegistroContratistas)

datarouter.get('/gettaskupdates',datacontroller.GetValidationData)
datarouter.post('/updatevalidation',datacontroller.UpdateValidation)

datarouter.post('/evaluacionpdp',datacontroller.EvaluacionPdP)
datarouter.get('/obtenerdatosevaluacion',datacontroller.ObtenerDatosEvaluacionPdP)
datarouter.post('/temporalparadadeplanta',datacontroller.TemporalParadaDePlanta)

datarouter.get('/getalldatahabitaciones',datacontroller.GetAllDataHabitaciones)





//Registro de Polines
datarouter.post('/loaddatatemp',datacontroller.uploadexcelTemp)
datarouter.get('/polines',datacontroller.getpolinesdata)
datarouter.post('/deletepolines',datacontroller.deleteallpolines)
datarouter.post('/polinesreport',uploadMiddlewarePolines,datacontroller.registerpolines)
datarouter.post('/deletereportpolines',datacontroller.DeletePolinesReport)
datarouter.get('/getpolinesreport',datacontroller.getpolinesregisterdata)
datarouter.post('/eliminarautomaticos',datacontroller.borrandoDatosAutomaticos)
datarouter.post('/cambiopolines',datacontroller.CambioPolines)
datarouter.get('/getlastpolinesreport',datacontroller.GetLastPolinesReport)
datarouter.get('/pruebastream',datacontroller.GetPOlinesReportStream)
datarouter.get('/pruebastreamDos',datacontroller.GetPOlinesReportStreamDos)


//Status de Indicadores de Mantenimiento
datarouter.post('/deleteindicadores',datacontroller.deleteallIndicadores)

datarouter.post('/deleteIW37nBase',datacontroller.deleteallIW37nBase)
datarouter.post('/deleteindIW37Report',datacontroller.deleteallIw37nreport)
datarouter.post('/deleteindIW39Report',datacontroller.deleteallIW39)
datarouter.post('/deleteIW37nBaseSemana',datacontroller.DeleteDataIW37nBase)

datarouter.get('/getalldataIndicadores',datacontroller.getalldataIndicadores)
datarouter.get('/getalldataIW37nBase',datacontroller.getalldataIW37nBase)
datarouter.get('/getalldataIW37Report',datacontroller.getalldataIW37nReport)
datarouter.get('/getalldataIW39Report',datacontroller.getalldataIW39Report)
datarouter.get('/getalldataIW29Report',datacontroller.getalldataIW29Report)

datarouter.post('/temporalactualizacionsemanasindicadores',datacontroller.updatetempReportIndicadores)
datarouter.post('/temporaleleiminarsemana',datacontroller.TemporalEliminarSemana)



//Envío de mensajes
datarouter.post('/prueba',controllerprueba.SendMessage)


module.exports = datarouter