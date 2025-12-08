const mongoose = require('mongoose')

const Condicion2schema = mongoose.Schema({
    StatusSistema: String,
    StatusKPI: String,
    UbicacionTecnica: String,
    UT: String,
    Area: String,
    SubArea: String,
    Ptotrabajo:String,
    Denominacion:String,
    AreaResponsable:String,
    Empresa:String,
    TipoContrato:String,
    PtoTrbRes:String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const Condicion2 = mongoose.model('Condicion2', Condicion2schema, 'Condicion2')
module.exports = Condicion2