const mongoose = require('mongoose')

const NCRschema = mongoose.Schema({
    AreaMantenimiento:String,
    Aviso: String,
    OT: String,
    OC: String,
    FechaAviso: Date,
    Descripcion: String,
    Planta: String,
    CodSistma: String,
    Sistema: String,
    CodSubsistema: String,
    Subsistema: String,
    CodMaterial: String,
    DescripcionMaterial: String,
    MontoReclamado: String,
    MontoRecuperado: String,
    Proveedor: String,
    Estado: String,
    FechaEjecucion: Date,
    FechaCierre: Date,
    Flota: String,
    Modelo: String,
    Equipo: String,
    Comentario: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const NCR = mongoose.model('NCR', NCRschema, 'NCR')
module.exports = NCR