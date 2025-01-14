const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ZMM003JP14schema = mongoose.Schema(
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
    "Denominación 2 del gr.artículos": String,
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

ZMM003JP14schema.plugin(mongoosePaginate);

const ZMM003JP14 = mongoose.model(
  "ZMM003JP14",
  ZMM003JP14schema,
  "ZMM003JP14"
);

module.exports = ZMM003JP14;
