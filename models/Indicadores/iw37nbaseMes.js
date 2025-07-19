const mongoose = require('mongoose')

const iw37nbaseMesschema = mongoose.Schema({
    Orden: String,
    "Revisión": String,
    Semana: String,
    Anho: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const iw37nbaseMes = mongoose.model('iw37nbaseMes', iw37nbaseMesschema, 'iw37nbaseMes')
module.exports = iw37nbaseMes