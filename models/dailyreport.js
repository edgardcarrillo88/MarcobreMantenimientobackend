const mongoose = require('mongoose')

const componentesSchema = mongoose.Schema({
    DescripcionComponente: String,      
    NoParte: String,      
    Cantidad: Number,      
    Costo: Number,   
})

const dailyreportschema = mongoose.Schema({
    Contratista: String,
    FechaInicio: String,
    FechaFin: String,      
    DescripcionActividad: String,      
    Conclusiones: String,   
    Recomendaciones: String,      
    Nombre: String,      
    Posicion: String,      

    listacomponentes: [componentesSchema],

    files: [{data: Buffer,contentType: String}],
    photos: [{data: Buffer,contentType: String}],

    Id:Number,
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const dailyreport = mongoose.model('dailyreport',dailyreportschema, 'dailyreport')
module.exports = dailyreport