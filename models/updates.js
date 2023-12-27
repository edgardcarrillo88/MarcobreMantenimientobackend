const mongoose = require('mongoose')

const updatetaskschema = mongoose.Schema({
    id: String,
    idtask:Number,
    comentario: String,      
    inicio: String,
    fin: String,
    avance: Number,
    usuario: String,
    vigente: String,
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const update = mongoose.model('update',updatetaskschema, 'update')
module.exports = update