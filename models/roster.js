const mongoose = require('mongoose')

const Rosterschema = mongoose.Schema({
    DNI:String,
    SAP: String,
    Nombres: String,
    Guardia: String,
    Cargo: String,
    Area: String,
    Zona: String,
    Fecha: Date,
    Tipo: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const Roster = mongoose.model('Roster', Rosterschema, 'Roster')
module.exports = Roster