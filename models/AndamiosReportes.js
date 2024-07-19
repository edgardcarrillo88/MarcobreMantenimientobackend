const mongoose = require('mongoose')

const AndamiosReporteschema = mongoose.Schema({
    Planta: String,
    Area: String,
    TAG: String,
    Responsable: String,
    Fecha:String,
    Detalle: String,
    Status:String,
    Usuario: String,
    CantidadCuerpos: Number,
    
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const AndamiosReporte = mongoose.model('AndamiosReporte', AndamiosReporteschema, 'AndamiosReporte')
module.exports = AndamiosReporte