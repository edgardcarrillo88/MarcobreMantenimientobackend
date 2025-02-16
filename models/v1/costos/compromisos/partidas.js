const mongoose = require('mongoose')

const partidascompromisosschema = mongoose.Schema({

    Partida: String,
    DescripcionPartida: String,
    Especialidad: String,
    Monto: Number,
    
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const partidascompromisos = mongoose.model('partidascompromisos', partidascompromisosschema, 'partidascompromisos')
module.exports = partidascompromisos