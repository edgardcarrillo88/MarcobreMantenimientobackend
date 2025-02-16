const mongoose = require('mongoose')

const occompromisosschema = mongoose.Schema({
    OC: String,
    OCPos: String,
    Fecha: Date,
    Proveedor: String,
    TextoBreve: String,
    IndicadorBorrado: String,
    ValorOC: Number,
    PorEntregar: Number,
    Moneda: String,
    CarryOverUSD: Number,
    TipoCompromiso: String,
    Monto: Number,
    Partida: String,
    Periodo: Number,
    Forecast: String,
    Comentario: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const occompromisos = mongoose.model('occompromisos', occompromisosschema, 'occompromisos')
module.exports = occompromisos