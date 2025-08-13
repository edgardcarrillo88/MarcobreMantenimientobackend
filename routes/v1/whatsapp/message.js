const express = require('express');
const messagerouter = express.Router();
const whatsappController  = require('../../../controllers/v1/whatsapp/controller.js');

messagerouter.get('/webhook',whatsappController.verifyWebhook)
messagerouter.post('/webhook',whatsappController.receiveMessage)
messagerouter.post('/sendtemplate',whatsappController.Sendtemplate)


module.exports = messagerouter