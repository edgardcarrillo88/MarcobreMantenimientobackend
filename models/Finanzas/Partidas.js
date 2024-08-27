const mongoose = require('mongoose')

const partidasschema = mongoose.Schema({
    Responsable: String,
    Partida: String,
    CategoriaPartida: String,
    DescripcionPartida: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const partidas = mongoose.model('partidas', partidasschema, 'partidas')
module.exports = partidas