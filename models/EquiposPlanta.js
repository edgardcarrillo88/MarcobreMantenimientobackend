const mongoose = require('mongoose')

const equiposplantaschema = mongoose.Schema({
    Equipo: String,
    Denominacion: String,
    CentroPlanificacion: String,
    TipoEquipo: String,
    IndicadorABC: String,
    TAG: String,
    CentroCosto: String,
    Planta: String,
    UT: String,
    GrupoPlanificacion: String,
    GrupoAutorizacion: String,
    DenominacionUT: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const equiposplanta = mongoose.model('equiposplanta', equiposplantaschema, 'equiposplanta')
module.exports = equiposplanta