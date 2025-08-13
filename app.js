const express = require('express')
require('dotenv').config()
const dbconnect = require("./database")
const cors = require('cors')
const app = express()
const formcontroller = require('./routes/data')
const formcontrollerv2 = require('./routes/v2/data')
const filecontroller = require('./routes/files')
const costcontroller = require('./routes/cost')
const messagecontroller = require('./routes/v1/whatsapp/message')
const compression = require('compression');
const path = require('path')
const {pruebacronologica} = require('./controllers/dataprocess')

dbconnect(app)
// pruebacronologica()

// app.use(cors({credentials: true}))

app.use(cors({
  // origin: [process.env.URL_PAGE, "http://localhost:3001","*",process.env.URL_PAGE_2],
  origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }));
  
app.use(compression());
app.use(express.json({ limit: '50mb' }))


app.use('/api/v1/data',formcontroller)
app.use('/api/v2/data',formcontrollerv2)
app.use('/api/v1/files',filecontroller) 
app.use('/api/v1/cost',costcontroller) 
app.use('/api/v1/messages',messagecontroller) 

app.use(express.static(path.join(__dirname,'public')))