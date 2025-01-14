const mongoose = require('mongoose')

const HistoryActivitiesschema = mongoose.Schema({
    id: String,
    idtask:Number,
    comentario: String,      
    inicio: Date,
    fin: Date,
    avance: Number,
    usuario: String,
    vigente: String,
    ActividadCancelada: String,
    Validado: String,
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const HistoryActivities = mongoose.model('HistoryActivities',HistoryActivitiesschema, 'HistoryActivities')
module.exports = HistoryActivities