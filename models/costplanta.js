const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const actualplantaschema = mongoose.Schema(
  {
    IdPpto: String,
    Gerencia: String,
    Planta: String,
    Area: String,
    SubArea: String,
    Categoria: String,
    CeCo: String,
    DescripcionCeCo: String,
    ClaseCosto: String,
    DescripcionClaseCosto: String,
    Responsable: String,
    Especialidad: String,
    TAG: String,
    Partida: String,
    DescripcionPartida: String,
    CategoriaActual: String,
    Mes: Number,
    Monto: Number,
    PptoForecast: String,
    Proveedor: String,
    TxtPedido: String,
    OC: String,
    Posicion: String,
    Fecha: String,
    Justificacion: String,
    CN: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

actualplantaschema.plugin(mongoosePaginate);

const actualplanta = mongoose.model(
  "actualplanta",
  actualplantaschema,
  "actualplanta"
);

module.exports = actualplanta;
