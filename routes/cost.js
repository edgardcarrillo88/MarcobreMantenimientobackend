const express = require('express');
const costrouter = express.Router()
const Upload =  require('../middleware/excelprocess')
const costcontroller = require('../controllers/costprocess.js');

costrouter.post('/',Upload.single('file'),costcontroller.uploadexcel)
costrouter.get('/getalldataactual',costcontroller.getalldataactual)
costrouter.get('/getalldatabudget',costcontroller.getalldatabudget)
costrouter.post('/deleteactual',costcontroller.deleteallActual)
costrouter.post('/deletebudget',costcontroller.deleteallBudget)

costrouter.post('/deleteactualplanta',costcontroller.deleteallActualplanta)
costrouter.post('/deletebudgetplanta',costcontroller.deleteallBudgetplanta)

costrouter.get('/getalldataactualplanta',costcontroller.getalldataactualplanta)
costrouter.get('/getalldatabudgetplanta',costcontroller.getalldatabudgetplanta)

module.exports = costrouter