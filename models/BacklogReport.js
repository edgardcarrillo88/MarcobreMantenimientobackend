const mongoose = require('mongoose')


const RecursosSchema = mongoose.Schema({
    key: String,      
    Recurso: String,      
    Cantidad: String, 
})
const MaterialesSchema = mongoose.Schema({
    key: String,      
    'Cod. SAP': String,      
    'N° Parte': String,      
    Descripcion: String,
    Cantidad: Number,
    'Unidad Medida': String,
    Caracteristicas: String,
})


const backlogschema = mongoose.Schema({
    DescripcionBreve: String,
    DescripcionDetallada: String,
    TipoAviso: String,
    Planta: String,
    Equipo: String,

    ToogleAviso: String,
    NoAviso: String,
    FechaEstimadaEjecucion: Date,
    TiempoEjecucion: Number,

    ToogleAndamios: String,
    AndamiosCantidad: Number,
    ToogleGruaTelescopica: String,
    GruatelescopicaCantidad: Number,
    ToogleCamionGrua: String,
    CamionGruaCantidad: Number,
    TooglePdP: String,
    PdPCantidad: Number,
    ToogleServicioEspecializado: String,
    ServicioEspecializadoDetalle: String,

    RecursosLabor: [RecursosSchema],
    Materiales: [MaterialesSchema],
    
    images: [{data: Buffer,contentType: String}],

    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
}
)


const backlog = mongoose.model('backlog',backlogschema, 'backlog')
module.exports = backlog