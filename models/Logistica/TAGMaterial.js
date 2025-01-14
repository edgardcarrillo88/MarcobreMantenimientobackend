const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const TAGMaterialschema = mongoose.Schema(
  {
    CodMaterial: String,
    TAG: String,
    Criticidad: String,
    Tipo: String,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

TAGMaterialschema.plugin(mongoosePaginate);

const TAGMaterial = mongoose.model(
  "TAGMaterial",
  TAGMaterialschema,
  "TAGMaterial"
);

module.exports = TAGMaterial;
