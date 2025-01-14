const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ZMM003JP11schema = mongoose.Schema(
  {
    "Ce.": String,
    Material : String,
    "Texto breve de material": String,
    "Alm.": String,
    LibrUtliz: String,
    "Stock cons": String,
    UMB: String,
    Lote: String,
    "N° pieza fabricante": String,
    "Ubic.": String,
    "Grupo art.": String,
    "Denom.gr.artículos 2": String,
    "Denom.Característica planificación neces": String,
    CaP: String,
    "Denom.Grupo planificación necesidades": String,
    "Denom.Proveedor": String,
    Semana: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ZMM003JP11schema.plugin(mongoosePaginate);

const ZMM003JP11 = mongoose.model(
  "ZMM003JP11",
  ZMM003JP11schema,
  "ZMM003JP11"
);

module.exports = ZMM003JP11;
