const mongoose = require('mongoose')

const AndamiosReporteHistorialschema = mongoose.Schema({
    Planta: String,
    Area: String,
    TAG: String,
    Responsable: String,
    Fecha:String,
    Detalle: String,
    Status:String,
    Usuario: String,
    CantidadCuerpos: Number,
    idAndamio: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const AndamiosReporteHistorial = mongoose.model('AndamiosReporteHistorial', AndamiosReporteHistorialschema, 'AndamiosReporteHistorial')
module.exports = AndamiosReporteHistorial