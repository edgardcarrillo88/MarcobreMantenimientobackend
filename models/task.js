const mongoose = require('mongoose')

const taskschema = mongoose.Schema({
    id: Number,
    nivel: Number,
    WBS: String,
    descripcion:String,
    OT: String,
    TAG: String,
    inicioplan: String,
    finplan: String,
    avance: Number,
    estado: String,
    responsable: String,
    contratista: String,
    especialidad: String,
    comentarios: String,
    inicioreal: String,
    finreal: String,
    area: String,
    hh: Number,
    curva:String,
    lastupdate: String,       
    rutacritica: String,   
    ActividadCancelada: String,
    SupResponsable: String,
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


const task = mongoose.model('task',taskschema, 'task')
module.exports = task