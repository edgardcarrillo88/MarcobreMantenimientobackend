const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const MB52schema = mongoose.Schema(
  {
    Material: String,
    "Ce.": String,
    "Alm.": String,
    "Trans./Trasl.": String,
    Semana: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

MB52schema.plugin(mongoosePaginate);

const MB52 = mongoose.model(
  "MB52",
  MB52schema,
  "MB52"
);

module.exports = MB52;
