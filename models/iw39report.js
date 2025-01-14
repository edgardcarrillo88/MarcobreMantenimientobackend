const mongoose = require('mongoose')

const iw39reportschema = mongoose.Schema({
    Orden: String,
    "Status del sistema": String,
    Semana: String,
    "StatUsu": String,
    P: String,
    "Ubicación técnica": String,
    "CpoClasif": String,
    "Texto breve": String,
    "PtoTrbRes": String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const iw39report = mongoose.model('iw39report', iw39reportschema, 'iw39report')
module.exports = iw39report