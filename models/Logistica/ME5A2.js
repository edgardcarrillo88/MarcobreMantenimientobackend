const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ME5A2schema = mongoose.Schema(
  {
    "Sol.pedido": String,
    "PosicionOrden" : String,
    "TipoPosicion": String,
    Semana: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ME5A2schema.plugin(mongoosePaginate);

const ME5A2 = mongoose.model(
  "ME5A2",
  ME5A2schema,
  "ME5A2"
);

module.exports = ME5A2;
