const mongoose = require('mongoose')

const Activitiesschema = mongoose.Schema({
    id: Number,
    nivel: Number,
    WBS: String,
    descripcion:String,
    OT: String,
    TAG: String,
    inicioplan: Date,
    finplan: Date,
    avance: Number,
    estado: String,
    responsable: String,
    contratista: String,
    especialidad: String,
    BloqueRC: String,
    comentarios: String,
    inicioreal: {type: Date, default: null},
    finreal: {type: Date, default: null},
    area: String,
    hh: Number,
    curva:String,
    lastupdate: String,       
    rutacritica: String,   
    ActividadCancelada: String,
    SupResponsable: String,
    Otros:String,
    Labor: {
        Mecanicos: { type: Number, default: 0 },
        Soldadores: { type: Number, default: 0 },
        Vigias: { type: Number, default: 0 },
        Electricista: { type: Number, default: 0 },
        Instrumentista: { type: Number, default: 0 }
      },
    NoLabor: {
        Andamios: { type: Boolean, default: false },
        CamionGrua: { type: Boolean, default: false },
        Telescopica: { type: Boolean, default: false }
      },   
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const Activities = mongoose.model('Activities',Activitiesschema, 'Activities')
module.exports = Activities