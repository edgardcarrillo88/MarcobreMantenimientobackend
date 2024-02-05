const mongoose = require('mongoose')

const baseindicadoresschema = mongoose.Schema({
    StatusSistema: String,
    StatusKPI: String,
    UT: String,
    Area: String,
    SubArea: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const baseindicadores = mongoose.model('baseindicadores', baseindicadoresschema, 'baseindicadores')
module.exports = baseindicadores