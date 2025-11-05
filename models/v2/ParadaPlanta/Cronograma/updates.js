const mongoose = require("mongoose");

const HistoryActivitiesschema = mongoose.Schema(
  {
    id: Number,
    inicioreal: Date,
    finreal: Date,
    avance: Number,
    comentarios: String,
    usuario: String,
    ActividadCancelada: String,
    Labor: {
      Mecanicos: { type: Number, default: 0 },
      Soldadores: { type: Number, default: 0 },
      Vigias: { type: Number, default: 0 },
      Electricista: { type: Number, default: 0 },
      Instrumentista: { type: Number, default: 0 },
    },
    NoLabor: {
      Andamios: { type: Boolean, default: false },
      CamionGrua: { type: Boolean, default: false },
      Telescopica: { type: Boolean, default: false },
    },
    deleted: { type: Boolean, default: false },
},
  {
    timestamps: true,
  }
);

const HistoryActivities = mongoose.model(
  "HistoryActivities",
  HistoryActivitiesschema,
  "HistoryActivities"
);
module.exports = HistoryActivities;
