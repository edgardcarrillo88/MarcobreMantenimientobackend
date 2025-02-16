const mongoose = require('mongoose')

const spcompromisosschema = mongoose.Schema({
    SP: String,
    PosSP: String,
    Partida: String,
    TextoBreve: String,
    Monto: Number,
    FechaSolicitud: Date,
    IndicadorBorrado: String,
    Concluida: String,
    Periodo: Number,
    Forecast: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const spcompromisos = mongoose.model('spcompromisos', spcompromisosschema, 'spcompromisos')
module.exports = spcompromisos