const mongoose = require('mongoose')

const equiposplantaschema = mongoose.Schema({
    Planta: String,
    Area: String,
    TAG: String,
    DescripcionEquipo: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const equiposplanta = mongoose.model('equiposplanta', equiposplantaschema, 'equiposplanta')
module.exports = equiposplanta