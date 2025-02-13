const mongoose = require('mongoose')

const evaluacionschema = mongoose.Schema({

    answer: {
        "1": String,
        "2": String,
        "3": String,
        "4": String,
        "5": String,
        "6": String,
        "7": String,
        "8": String,
        "9": String,
        "10": String,
        DNI: String,
        Fecha: String,
        Nombre:String,
        Cargo: String,
        Empresa: String,
    },
    Nota: Number,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const evaluacion = mongoose.model('evaluacion', evaluacionschema, 'evaluacion')
module.exports = evaluacion