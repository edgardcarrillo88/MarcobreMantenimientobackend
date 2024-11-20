const express = require('express');
const costrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const costcontroller = require('../controllers/costprocess.js');
const datacontroller = require('../controllers/dataprocess.js');

costrouter.post('/',Upload.single('file'),costcontroller.uploadexcel)


//Budget
costrouter.get('/getalldatabudget',costcontroller.getalldatabudget)
costrouter.post('/deletebudget',costcontroller.deleteallBudget)
costrouter.post('/deletebudgetplanta',costcontroller.deleteallBudgetplanta)
costrouter.get('/getalldatabudgetplanta',costcontroller.getalldatabudgetplanta)

//Actual
costrouter.get('/getalldataactual',costcontroller.getalldataactual)
costrouter.post('/deleteactual',costcontroller.deleteallActual)
costrouter.post('/deleteactualplanta',costcontroller.deleteallActualplanta)
costrouter.get('/getalldataactualplanta',costcontroller.getalldataactualplanta)
costrouter.get('/getalldataactualplantaPowerBI',costcontroller.GetAllDataActualForPowerBI)
costrouter.get('/getalldataactualplantaPowerExcel',costcontroller.GetAllDataActualForPowerExcel)
costrouter.post('/borrardatosactual',costcontroller.borrandoDatosActualFiltrado)
costrouter.post('/borrardatosprovant',costcontroller.borrandoDatosProvAntFiltrado)
costrouter.post('/cojudeces',costcontroller.ArreglandoCojudecesQueHice)


//Forecast
costrouter.post('/updatesinglemonth',costcontroller.UpdateSingleMonth)
costrouter.post('/updategroupmonth',costcontroller.UpdateGroupMonth)
costrouter.post('/temp',costcontroller.Temporal)

//Provisiones
costrouter.post('/loadprovisiones',costcontroller.LoadProvisiones)
costrouter.get('/getalldataprovisiones',costcontroller.GetAllDataProvisiones)
costrouter.get('/getalldataprovisionesContratistas',costcontroller.GetAllDataProvisionesContratistas)
costrouter.post('/deletealldataprovisiones',costcontroller.DeleteAllDataProvisiones)
costrouter.get('/GetAllDataProvisionesForPowerBI',costcontroller.GetAllDataProvisionesForPowerBI)


costrouter.post('/updatestatusprovisiones',costcontroller.UpdateStatusProvisiones)





module.exports = costrouter