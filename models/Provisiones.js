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
    NoEDP: String,
    VersionEDP: String,
    Glosa: String,
    Monto: Number,
    Moneda: String,
    Status: String,
    Responsable: String,
    Correo: String,
    Partida: String,
    DescripcionPartida: String,
    DescripcionServicio: String,
    SolicitudReprovision: String,
    Pagado: String,
    Planta: String,
    TipoProvision: String,

    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })

    provisionesschema.plugin(mongoosePaginate);

const provisiones = mongoose.model('provisiones', provisionesschema, 'provisiones')
module.exports = provisiones