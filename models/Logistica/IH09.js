const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const IH09schema = mongoose.Schema(
  {
    S: String,
    MatGestStk: String,
    Material: String,
    "Texto breve de material": String,
    Fabricante: String,
    "N° PiezFbr": String,
    UMB: String,
    TpMt: String,
    "Grupo art.": String,
    "Creado por": String,
    "Creado el": String,
    "Modif.por": String,
    "Últ.modif.": String,
    Semana: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

IH09schema.plugin(mongoosePaginate);

const IH09 = mongoose.model(
  "IH09",
  IH09schema,
  "IH09"
);

module.exports = IH09;
