const mongoose = require('mongoose')

const habitacionesschema = mongoose.Schema({
    Empresa: String,
    DNI: String,
    Nombres: String,
    Apellidos: String,
    TipoHabitacion: String,
    Sexo: String,
    Fingreso: String,
    Fsalida: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const habitaciones = mongoose.model('habitaciones', habitacionesschema, 'habitaciones')
module.exports = habitaciones