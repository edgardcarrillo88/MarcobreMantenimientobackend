const mongoose = require('mongoose')

const statusSchema = mongoose.Schema({
    // Estado: String 
})

const polinesreportschema = mongoose.Schema({
    Tag: String,
    Ubicacion: String,
    Bastidor: String,
    Posicion: String,      
    Fecha: String,      
    Estado: String,   
    Descripcion: String,      
    Reportante: String,
    Fecha:Date,
    photos: [{data: Buffer,contentType: String}],
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const polinesreport = mongoose.model('polinesreport',polinesreportschema, 'polinesreport')
module.exports = polinesreport