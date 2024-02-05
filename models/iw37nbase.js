const mongoose = require('mongoose')

const iw37nschema = mongoose.Schema({
    CpoClasif: String,
    "Denomin.": String,
    Orden: String,
    "Texto breve": String,
    "Op.": String,
    "Cl.": String,
    "Texto": String,
    "DurNor": String,
    "Nº": String,
    " Trabajo": String,
    "PtoTbjoOp": String,
    "Aviso": String,
    "Revisión": String,
    "Inic.extr.": String,
    "PtoTrbRes": String,
    "StatUsu": String,
    "Stat.sist.": String,
    "Ubic.técn.": String,
    "Trbjo real": String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const iw37n = mongoose.model('iw37n', iw37nschema, 'iw37n')
module.exports = iw37n