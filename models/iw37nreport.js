const mongoose = require('mongoose')

const iw37nreportschema = mongoose.Schema({
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
    "tempField": String,
    Semana: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const iw37nreport = mongoose.model('iw37nreport', iw37nreportschema, 'iw37nreport')
module.exports = iw37nreport