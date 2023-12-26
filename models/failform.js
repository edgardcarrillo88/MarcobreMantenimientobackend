const mongoose = require('mongoose')

const planesaccionSchema = mongoose.Schema({
    ActividadPlan: String,
    FechaPlanPendiente: String,
    ResponsablePlanPendiente: String,
})
const componentesSchema = mongoose.Schema({
    DescripcionComponente: String,      
    NoParte: String,      
    Cantidad: Number,      
    Costo: Number,   
})
const estrategiamanttoSchema = mongoose.Schema({
    ActividadEstrategiaMantto: String,
    FechaEstrategiaMantto: String,
    ResponsableEstrategiaMantto: String,
})
const planespreventivosSchema = mongoose.Schema({
    PlanAccion: String,      
    FechaPlan: String,      
    Responsable: String, 
})
const estrategiaSAPSchema = mongoose.Schema({
    ActividadEstrategia: String,      
    ResponsableEstrategia: String,      
    ResponsableFrecuencia: String,      
    FechaEstrategiaSAP: String,
})


const failformschema = mongoose.Schema({
    tag: String,
    equipo: String,
    modelo: String,      
    FechaEvento: String,      
    Tiempodentencion: Number,      
    OT: String,      
    DescripcionFalla: String,      
    TrabajoRealizado: String,      
    DefinicionProblema: String,      
    Primerxq: String,      
    Segundoxq: String,      
    Tercerxq: String,      
    Cuartoxq: String,      
    Quintoxq: String,      
    Reportado: String,      
    Supervisor: String, 

    listaplanes: [planesaccionSchema],
    listaestrategia: [estrategiamanttoSchema],
    listacomponentes: [componentesSchema],
      
    UltimasActividades: String,      
    Frecuencia: String,      
    listapreventivos: [planespreventivosSchema],
    listaestrategiaSAP:[estrategiaSAPSchema],
    IngConfiabilidad: String,
    SrConfiabilidad: String,
    
    images: [{data: Buffer,contentType: String}],

    Id:Number,
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const failform = mongoose.model('failform',failformschema, 'failform')
module.exports = failform