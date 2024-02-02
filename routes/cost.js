const express = require('express');
const filesrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const filecontroller = require('../controllers/costprocess.js');

filesrouter.post('/',Upload.single('file'),filecontroller.uploadexcel)
filesrouter.get('/getalldataactual',filecontroller.getalldataactual)
filesrouter.get('/getalldatabudget',filecontroller.getalldatabudget)
filesrouter.post('/deleteactual',filecontroller.deleteallActual)
filesrouter.post('/deletebudget',filecontroller.deleteallBudget)

filesrouter.post('/deleteactualplanta',filecontroller.deleteallActualplanta)
filesrouter.post('/deletebudgetplanta',filecontroller.deleteallBudgetplanta)

filesrouter.get('/getalldataactualplanta',filecontroller.getalldataactualplanta)
filesrouter.get('/getalldatabudgetplanta',filecontroller.getalldatabudgetplanta)

module.exports = filesrouter