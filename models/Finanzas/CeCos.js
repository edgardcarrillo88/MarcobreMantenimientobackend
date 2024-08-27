const mongoose = require('mongoose')

const cecosschema = mongoose.Schema({
    CeCo: String,
    DescripcionCeCo: String,
    TipoOpex: String,
    TipoCosto: String,
    TipoOperacion: String,
    Planta: String,
    Proceso: String,
    SubArea: String,
    Gerencia: String,
    Area: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const cecos = mongoose.model('cecos', cecosschema, 'cecos')
module.exports = cecos