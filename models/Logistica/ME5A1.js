const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ME5A1schema = mongoose.Schema(
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

ME5A1schema.plugin(mongoosePaginate);

const ME5A1 = mongoose.model(
  "ME5A1",
  ME5A1schema,
  "ME5A1"
);

module.exports = ME5A1;
