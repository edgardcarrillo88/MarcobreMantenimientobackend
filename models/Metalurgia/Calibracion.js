const mongoose = require("mongoose");

const Metalurgia_Calibracionschema = mongoose.Schema(
  {
    dataset: String,
    fecha: Date,
    turno: String,
    tph: Number,
    p80: Number,
    head_cucn_pct: Number,
    head_cur_pct: Number,
    head_ag_gpt: Number,
    cur_cut: Number,
    ag_cut: Number,
    date_hour: Date,
    rec_cu_pct: Number,
    head_cus_pct: Number,
    head_fe_pct: Number,
    cu_qc: Number,
    cus_cut: Number,
    cucn_cut: Number,
    fet_cut: Number,
    ag_fet: Number,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Metalurgia_Calibracion = mongoose.model(
  "Metalurgia_Calibracion",
  Metalurgia_Calibracionschema,
  "Metalurgia_Calibracion"
);
module.exports = Metalurgia_Calibracion;
