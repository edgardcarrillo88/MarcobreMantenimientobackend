const mongoose = require('mongoose')

const actualschema = mongoose.Schema({
    Gerencia: String,
    Planta: String,
    Area: String,
    SubArea: String,
    Categoria: String,
    CeCo: String,
    DescripcionCeCo: String,
    ClaseCosto: String,
    DescripcionClaseCosto:String,
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


const actual = mongoose.model('actual', actualschema, 'actual')
module.exports = actual