const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ME2Lschema = mongoose.Schema(
  {
    "Doc.compr.": String,
    "Pos." : String,
    "Fecha doc.": String,
    "Prov./Ce.sumin.": String,
    GCp: String,
    Material: String,
    "Texto breve": String,
    "Ce.": String,
    "Cantidad": String,
    "Valor neto": String,
    UMA: String,
    "Por entregar": String,
    "Mon.": String,
    "Fe.entrega": String,
    Lib: String,
    "Sol. pedido": String,
    "P" : String,
    Semana: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ME2Lschema.plugin(mongoosePaginate);

const ME2L = mongoose.model(
  "ME2L",
  ME2Lschema,
  "ME2L"
);

module.exports = ME2L;
