const { urlencoded } = require('express');
const mongoose = require('mongoose')


// const RecursosSchema = mongoose.Schema({
//     key: String,      
//     Recurso: String,      
//     Cantidad: String, 
// })
// const MaterialesSchema = mongoose.Schema({
//     key: String,      
//     'Cod. SAP': String,      
//     'N° Parte': String,      
//     Descripcion: String,
//     Cantidad: Number,
//     'Unidad Medida': String,
//     Caracteristicas: String,
// })

const MaterialesSchema = new mongoose.Schema({   
    codSAP: String,      
    noParte: String,      
    descripcion: String,
    cantidad: Number,
    um: String,
    caracteristicas: String,
});

const FilesSchema = new mongoose.Schema({
    name: String,
    lastModified: Date,
    lastModifiedDate: Date,
    webkitRelativePath: String,
    size: Number,
    type: String,
    buffer: Buffer 
})

// Definir el esquema de Aviso
const backlogschema = new mongoose.Schema({
    DescripcionBreve: { type: String, required: true },
    DescripcionDetallada: { type: String, required: true },
    TipoAviso: { type: String, required: true },
    TipoPlanta: { type: String, required: true },
    Equipo: { type: String, required: true },
    Prioridad: { type: String, required: true },
    PuestoTrabajo: { type: String, required: true },

    FechaRequerida: { type: Date, required: true },
    TiempoEjecucion: { type: Number, required: true },

    ToggleAndamios: { type: Boolean, required: true },
    ToggleCamionGrua: { type: Boolean, required: true },
    ToggleTelescopica: { type: Boolean, required: true },
    ToggleServicioEspecializado: { type: Boolean, required: true },
    
    CantidadCamionGrua: { type: Number, required: false },
    CantidadTelescopica: { type: Number, required: false },
    ServicioEspecializado: { type: String, required: false },

    ToggleParadaEquipo: { type: Boolean, required: false },
    ToggleParadaNoAplica: { type: Boolean, required: false },
    ToggleParadaProceso: { type: Boolean, required: false },
    ToggleParadaPlanta: { type: Boolean, required: false },

    LaborMecanicos: { type: Number, required: true },
    LaborSoldadores: { type: Number, required: true },
    LaborElectricistas: { type: Number, required: true },
    LaborInstrumentistas: { type: Number, required: true },
    LaborVigias: { type: Number, required: true },
    
    ToggleMateriales: { type: Boolean, required: true },
    ArrayMateriales: { type: [MaterialesSchema], required: false },
    FilesData: { type: [FilesSchema], required: false },
    Status: { type: String, default: 'Pendiente', required: false },

    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
}
);


const backlog = mongoose.model('backlog',backlogschema, 'backlog')
module.exports = backlog