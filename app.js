const express = require('express')
require('dotenv').config()
const dbconnect = require("./database")
const cors = require('cors')
const app = express()
const formcontroller = require('./routes/data')
const filecontroller = require('./routes/files')
const costcontroller = require('./routes/cost')
const path = require('path')

dbconnect(app)

// app.use(cors({credentials: true}))
app.use(cors({
    origin: process.env.URL_PAGE, // Reemplaza con el origen correcto de tu frontend
    credentials: true, // Permite el intercambio de cookies a través de las solicitudes
  }));
app.use(express.json())

app.use('/api/v1/data',formcontroller)
app.use('/api/v1/files',filecontroller) 
app.use('/api/v1/cost',costcontroller) 

app.use(express.static(path.join(__dirname,'public')))