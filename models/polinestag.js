const mongoose = require('mongoose')

const polinesschema = mongoose.Schema({
    Key: String,
    Item: String,
    Tag: String,
    Ubicacion: String,
    Tipo: String,
    Bastidor: String,
    Sector: String,
    Posicion: String,
    Estado: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const polines = mongoose.model('polines', polinesschema, 'polines')
module.exports = polines