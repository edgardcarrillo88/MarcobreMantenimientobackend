const mongoose = require('mongoose')

const costschema = mongoose.Schema({
    Gerencia: String,
    Planta: String,
    Area: String,
    SubArea: String,
    Categoria: String,
    CeCo: String,
    DescripcionCeCo: String,
    ClaseCosto: String,
    Responsable: String,
    Especialidad: String,
    TAG: String,
    Partida: String,
    DescripcionPartida: String,
    Comentarios: String,
    Mes: Number,
    Monto: Number,
    PptoForecast: String,
    CN: String,
    Proveedor: String,
    TxtPedido: String,
    OC: String,
    Posicion: String,
    Fecha: String,
    Justificacion: String,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const cost = mongoose.model('cost', costschema, 'cost')
module.exports = cost