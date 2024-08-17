const express = require('express');
const filesrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const filecontroller = require('../controllers/dataprocess');

filesrouter.post('/',Upload.single('file'),filecontroller.uploadexcel)
filesrouter.post('/updatebaseline',Upload.single('file'),filecontroller.UpdateBaseLine)
filesrouter.post('/deleteactivities',Upload.single('file'),filecontroller.DeleteActivities)
filesrouter.post('/loaddatatemp',Upload.single('file'),filecontroller.uploadexcelTemp)

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



// filesrouter.post('/valorizaciones',Upload.single('file'),filecontroller.valorizaciones)
// filesrouter.get('/dataedp',filecontroller.dataedp)
// filesrouter.post('/deleteallEdp',filecontroller.deleteallEdp)


//Provisiones
filesrouter.post('/loadprovisionestemp',Upload.single('file'),filecontroller.LoadProvisionesTemp)
filesrouter.post('/loadprovisiones',Upload.single('file'),filecontroller.LoadProvisionesTemp)


module.exports = filesrouter
