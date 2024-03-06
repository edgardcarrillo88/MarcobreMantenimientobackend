const mongoose = require('mongoose')

const Induccionschema = mongoose.Schema({
    FechaInicio:String,
    FechaFin: String,
    dni: String,
    nombres: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    SubArea: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const Induccion = mongoose.model('Induccion', Induccionschema, 'Induccion')
module.exports = Induccion