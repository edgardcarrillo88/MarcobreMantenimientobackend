const express = require('express');
const filesrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const filecontroller = require('../controllers/dataprocess');

filesrouter.post('/',Upload.single('file'),filecontroller.uploadexcel)
filesrouter.post('/loaddatatemp',Upload.single('file'),filecontroller.uploadexcelTemp)

//Indicadores de Mantenimiento
filesrouter.post('/loadindicadores',Upload.single('file'),filecontroller.uploadexcelIndicadoresMantto)
filesrouter.post('/loadiw37nbase',Upload.single('file'),filecontroller.uploadexceliw37nbase)
filesrouter.post('/loadiw37nreport',Upload.single('file'),filecontroller.uploadexceliw37nreport)
filesrouter.post('/loadiw39report',Upload.single('file'),filecontroller.uploadexceliw39report)
filesrouter.post('/loadroster',Upload.single('file'),filecontroller.uploadexcelroster)

//Parada de planta
filesrouter.post('/loadpersonalcontratista',Upload.single('file'),filecontroller.uploadexcelPersonalContratistas)


// filesrouter.post('/valorizaciones',Upload.single('file'),filecontroller.valorizaciones)
// filesrouter.get('/dataedp',filecontroller.dataedp)
// filesrouter.post('/deleteallEdp',filecontroller.deleteallEdp)

module.exports = filesrouter
