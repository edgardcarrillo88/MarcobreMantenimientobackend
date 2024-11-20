const express = require('express');
const filesrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const filecontroller = require('../controllers/dataprocess');



//Indicadores de Mantenimiento
filesrouter.post('/loadindicadores',Upload.single('file'),filecontroller.uploadexcelIndicadoresMantto)
filesrouter.post('/loadiw37nbase',Upload.single('file'),filecontroller.uploadexceliw37nbase)
filesrouter.post('/loadiw37nreport',Upload.single('file'),filecontroller.uploadexceliw37nreport)
filesrouter.post('/loadiw39report',Upload.single('file'),filecontroller.uploadexceliw39report)
filesrouter.post('/loadiw29report',Upload.single('file'),filecontroller.uploadexceliw29report)
filesrouter.post('/loadroster',Upload.single('file'),filecontroller.uploadexcelroster)

//Parada de planta
filesrouter.post('/loadpersonalcontratista',Upload.single('file'),filecontroller.uploadexcelPersonalContratistas)
filesrouter.post('/loadhabitaciones',Upload.single('file'),filecontroller.LoadHabitaciones)
filesrouter.post('/',Upload.single('file'),filecontroller.uploadexcel)
filesrouter.post('/updatebaseline',Upload.single('file'),filecontroller.UpdateBaseLine)
filesrouter.post('/deleteactivities',Upload.single('file'),filecontroller.DeleteActivities)
filesrouter.post('/loaddatatemp',Upload.single('file'),filecontroller.uploadexcelTemp)


// filesrouter.post('/valorizaciones',Upload.single('file'),filecontroller.valorizaciones)
// filesrouter.get('/dataedp',filecontroller.dataedp)
// filesrouter.post('/deleteallEdp',filecontroller.deleteallEdp)


//Costos
filesrouter.post('/loadprovisionestemp',Upload.single('file'),filecontroller.LoadProvisionesTemp) //Provisiones
filesrouter.post('/loaddatafinanzas',Upload.single('file'),filecontroller.LoadDataFinanzas) //Provisiones

filesrouter.post('/updatedatacompromisos',Upload.single('file'),filecontroller.UpdateDataCompromisos) //Forecast
filesrouter.post('/updatedatapartidasprovisiones',Upload.single('file'),filecontroller.UpdateDataPartidasProvisiones) //Forecast

module.exports = filesrouter
