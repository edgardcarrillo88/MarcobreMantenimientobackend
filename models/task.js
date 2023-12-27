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
    comentarios: String,
    inicioreal: String,
    finreal: String,
    area: String,
    hh: Number,
    curva:String,
    lastupdate: String,       
    rutacritica: String,       
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const task = mongoose.model('task',taskschema, 'task')
module.exports = task