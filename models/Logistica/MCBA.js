const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const MCBAschema = mongoose.Schema(
  {
    Material: String,
    "Último consumo": String,
    Semana: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

MCBAschema.plugin(mongoosePaginate);

const MCBA = mongoose.model(
  "MCBA",
  MCBAschema,
  "MCBA"
);

module.exports = MCBA;
