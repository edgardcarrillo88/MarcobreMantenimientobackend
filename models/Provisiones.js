const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");

const provisionesschema = mongoose.Schema({
    ClaseCosto: String,
    DescClaseCosto: String,
    CeCo: String,
    DescCeCo: String,
    CodProveedor: String,
    NombreProveedor: String,
    FechaEnvioProvision: String,
    FechaEjecucionServicio: String,
    OC: String,
    Posicion: String,
    DescripcionServicio: String,
    Moneda: String,
    Monto: Number,
    NoEDP: String,
    VersionEDP: String,
    Partida: String,
    Glosa: String,
    TipoProvision: String,
    Status: String,
    Responsable: String,
    Correo: String,
    DescripcionPartida: String,
    SolicitudReprovision: String,
    Pagado: String,
    Planta: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })

    provisionesschema.plugin(mongoosePaginate);

const provisiones = mongoose.model('provisiones', provisionesschema, 'provisiones')
module.exports = provisiones