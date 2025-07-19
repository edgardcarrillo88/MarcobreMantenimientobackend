
const mongoose = require('mongoose')


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
const InspeccionesPdPschema = new mongoose.Schema({
    empresa: { type: String, required: true },
    categoria: { type: String, required: true },

    fecha: { type: Date, required: true },
    hora: { type: String, required: true },

    area: { type: String, required: true },
    descripcion: { type: String, required: true },

    esObservacionSeguridad: { type: Boolean, required: false },
    tipoRiesgo: { type: String, required: false },
    nivelRiesgo: { type: String, required: false },

    FilesData: { type: [FilesSchema], required: true },
    Status: { type: String, default: 'Pendiente', required: false },
    User: { type: String, required: true },
    email: { type: String, required: true },

    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
}
);


const InspeccionesPdP = mongoose.model('InspeccionesPdP',InspeccionesPdPschema, 'InspeccionesPdP')
module.exports = InspeccionesPdP