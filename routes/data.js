const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');
const controllerprueba = require('../controllers/message');
const uploadfile = require('../middleware/fileprocess');
const {upload, processFiles} = require('../middleware/multifileprocess');
const UploadExcel =  require('../middleware/excelprocess')
const uploadMiddleware = require('../middleware/dailyprocess');
const uploadMiddlewarePolines = require('../middleware/polinesprocess');


//Data Planta
datarouter.post('/cargaequiposplanta',UploadExcel.single('file'),datacontroller.Temporal)
datarouter.get('/getdataequiposplanta',datacontroller.GetEquiposPlanta)


//Reporte rápido de Falla
datarouter.post('/registerform',uploadfile.array('files'),datacontroller.registerform)
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
// datarouter.post('/crearpreaviso',datacontroller.CrearPreAviso)
// datarouter.post('/uploadimagebacklog',UploadExcel.single('file'),datacontroller.GuardarImagenPreAviso)
datarouter.post('/uploadimagebacklog',upload, processFiles,datacontroller.GuardarDatosPreAvisos)
datarouter.get('/getalldataBacklog',datacontroller.GetAllDataBacklog)
datarouter.get('/getsingleavisos',datacontroller.GetSingleAviso)
datarouter.post('/updateaviso',upload, processFiles, datacontroller.UpdateAviso)


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
datarouter.get('/thirdparty',datacontroller.GetThirdParty)
datarouter.get('/especialidad',datacontroller.GetEspecialidad)
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
datarouter.get('/validateusers',datacontroller.UserValidation)





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
datarouter.post('/deleteindIW47Report',datacontroller.deleteallIW47)

datarouter.get('/getalldataIndicadores',datacontroller.getalldataIndicadores)
datarouter.get('/getalldataIW37nBase',datacontroller.getalldataIW37nBase)
datarouter.get('/getalldataIW37Report',datacontroller.getalldataIW37nReport)
datarouter.get('/getalldataIW39Report',datacontroller.getalldataIW39Report)
datarouter.get('/getalldataIW29Report',datacontroller.getalldataIW29Report)
datarouter.get('/getalldataIW47Report',datacontroller.getalldataIW47Report)


datarouter.get('/getsingleweekdataIW37nBase',datacontroller.GetSingleWeekIW37nBase)
datarouter.get('/getsingleweekdataIW37Report',datacontroller.GetSingleWeekIW37nReport)
datarouter.get('/getsingleweekdataIW39Report',datacontroller.GetSingleWeekIW39Report)
datarouter.get('/getsingleweekdataIW29Report',datacontroller.GetSingleWeekIW29Report)
datarouter.get('/getsingleweekdataIW47Report',datacontroller.GetSingleWeekIW47Report)

datarouter.get('/normalizardatos',datacontroller.normalizardatos)
datarouter.post('/normalizarobjectos',datacontroller.NormalizarObjectToString)

datarouter.post('/temporalactualizacionsemanasindicadores',datacontroller.updatetempReportIndicadores)
datarouter.post('/temporaleleiminarsemana',datacontroller.TemporalEliminarSemana)


//Logistica Status de Materiales
datarouter.post('/deletematerial',datacontroller.DeleteAllMaterial)
datarouter.get('/getallmaterial',datacontroller.GetAllMaterial)




//Envío de mensajes
datarouter.post('/prueba',controllerprueba.SendMessage)


module.exports = datarouter