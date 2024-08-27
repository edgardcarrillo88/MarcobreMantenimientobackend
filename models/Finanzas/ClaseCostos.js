const mongoose = require('mongoose')

const clasecostosschema = mongoose.Schema({

    ClaseCosto: String,
    DescripcionClaseCosto: String,
    CategoriaHijo: String,
    CategoriaPadre: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const clasecostos = mongoose.model('clasecostos', clasecostosschema, 'clasecostos')
module.exports = clasecostos