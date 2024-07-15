const mongoose = require('mongoose')

const iw29schema = mongoose.Schema({
    Aviso: String,
    Orden: String,
    Fecha: Date,
    CpoClasif: String,
    "Descripción": String,
    "Cl.": String,
    "Stat.sist.": String,
    "StatUsu": String,
    "PtoTrbRes": String,
    "CePl": String,
    "GP": String,
    "Ubicac.técnica": String,
    "Denom.ubic.técnica": String,
    Equipo: String,
    "Denominación objeto": String,
    A: String,
    P: String,
    AMa: String,
    "Creado por": String,
    "Creado el": Date,
    "Modif.por": String,
    "Modif.el": Date,
    "Autor aviso": String,
    Semana: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const iw29 = mongoose.model('iw29', iw29schema, 'iw29')
module.exports = iw29