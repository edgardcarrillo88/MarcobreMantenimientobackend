const mongoose = require('mongoose')

const Contratistasschema = mongoose.Schema({
    Empresa:String,
    DNI: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const Contratistas = mongoose.model('Contratistas', Contratistasschema, 'Contratistas')
module.exports = Contratistas