const mongoose = require('mongoose')

const iw47schema = mongoose.Schema({
    Orden: String,
    Motivo: String,
    Semana: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const iw47 = mongoose.model('iw47', iw47schema, 'iw47')
module.exports = iw47