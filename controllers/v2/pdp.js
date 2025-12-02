//Librerias
const xlsx = require("xlsx");
const mongoose = require("mongoose");

//Modelos Parada de Planta
const taskmodel = require("../../models/v2/ParadaPlanta/Cronograma/activities");
const updatemodel = require("../../models/v2/ParadaPlanta/Cronograma/updates");

//Parada de Planta
const uploadexcel = (req, res) => {
  console.log("ejecutando carga de datos de cronograma de parada de planta.");
  console.log(req.body);
  const bufferData = req.file.buffer;
  const workbook = xlsx.read(bufferData, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = xlsx.utils.sheet_to_json(worksheet);

  const dataPromises = excelData.map(async (rowData) => {
    try {
      const fechainicio = new Date((rowData.inicioplan - 25569) * 86400 * 1000);
      fechainicio.setMilliseconds(fechainicio.getMilliseconds() + 100);
      rowData.inicioplan = fechainicio;

      const fechafin = new Date((rowData.finplan - 25569) * 86400 * 1000);
      fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
      rowData.finplan = fechafin;

      const data = new taskmodel(rowData);
      await data.save();
    } catch (error) {
      console.error("Error al guardar el dato:", error);
    }
  });
  Promise.all(dataPromises)
    .then(() => {
      console.log("Todos los datos guardados en la base de datos");
      res.status(200).json({ message: "Datos guardados en la base de datos" });
    })
    .catch((error) => {
      console.error("Error al guardar los datos:", error);
      res.status(500).json({ error: "Error al guardar los datos" });
    });
};

const getfiltersdata = async (req, res) => {
  console.log("ejecutando datos para filtros");

  const uniqueResponsables = await taskmodel.distinct("responsable");
  const uniqueContratistas = await taskmodel.distinct("contratista");
  console.log(uniqueContratistas);
  const uniqueEstados = await taskmodel.distinct("estado");

  const data = [];

  for (let i = 0; i < uniqueResponsables.length; i++) {
    const uniqueValueObject = {
      responsable: uniqueResponsables[i],
      contratista: uniqueContratistas[i],
      estado: uniqueEstados[i],
    };
    data.push(uniqueValueObject);
  }

  res.status(200).json({ data });
};

const GetThirdParty = async (req, res) => {
  console.log("Iniciando el proceso de obtener datos de contratistas");

  try {
    const response = await taskmodel.distinct("contratista");
    const Contratistas = response.map((item, index) => ({
      uid: item,
      name: item,
    }));
    res.status(200).json({ Contratistas });
  } catch (error) {
    console.log("Error en la ejecución");
    console.log(error);
  }
};

const GetEspecialidad = async (req, res) => {
  console.log("Ejecutando obtener especialidades");
  try {
    const response = await taskmodel.distinct("especialidad");
    const Especialidades = response.map((item, index) => ({
      uid: item,
      name: item,
    }));
    console.log("Respuesta exitosa");
    res.status(200).json({ Especialidades });
  } catch (error) {
    console.log("Error en la ejecución");
    console.log(error);
    res.status(500).json({ error: "Error al obtener las especialidades" });
  }
};

const getscheduledata = async (req, res) => {
  console.log("ejecutando request getalldata");
  const data = await taskmodel.find({}).sort({ id: 1 });
  res.status(200).json({ data });
};

const statusupdate = async (req, res) => {
  console.log("actualizando status");
  const { fechaActual } = req.body;

  const fecha = new Date(fechaActual);
  // console.log("Fecha original:", fecha);

  const fechacorregida = fecha.setHours(fecha.getHours() - 5);
  // console.log("Fecha después de restar 5 horas:", fechacorregida);

  const data = await taskmodel.find({}).sort({ id: 1 });

  data.map(async (task) => {
    const fechainiciobd = new Date(task.inicioplan);
    const fechafinbd = new Date(task.finplan);
    const fechafrontend = new Date(fechacorregida);

    if (!task.inicioreal && String(task.ActividadCancelada).trim().toLocaleLowerCase()==="no") {
      // console.log("No iniciado");

      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          estado: "No iniciado",
        },
      });
    }

    if (fechafrontend > fechainiciobd && task.avance > 0 && task.avance < 100 && String(task.ActividadCancelada).trim().toLocaleLowerCase()==="no") {
      // console.log("tarea atrasada");
      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          estado: "En curso",
        },
      });
    }

    if (fechafrontend > fechainiciobd && task.avance === 0 && String(task.ActividadCancelada).trim().toLocaleLowerCase()==="no") {
      // console.log("tarea atrasada");
      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          estado: "Atrasado",
        },
      });
    }

    if (fechafrontend > fechafinbd && task.avance !== 100 && String(task.ActividadCancelada).trim().toLocaleLowerCase()==="no") {
      // console.log("tarea atrasada");
      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          estado: "Atrasado",
        },
      });
    }

    if (task.avance === 100 && String(task.ActividadCancelada).trim().toLocaleLowerCase()==="no") {
      // console.log("Finalizado");
      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          estado: "Finalizado",
        },
      });
    }

       if (String(task.ActividadCancelada).trim().toLocaleLowerCase()==="si") {
      // console.log("Finalizado");
      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          estado: "Cancelado",
        },
      });
    }


  });
};

const filtereddata = async (req, res) => {
  console.log("ejecutando request filtereddata");
  const { id } = req.query;
  const data = await taskmodel.find({ id });
  res.status(200).json(data[0]);
};

const updatedata = async (req, res) => {
  console.log(req.body);
  const {
    id,
    idtask,
    comentario,
    inicio,
    fin,
    avance,
    usuario,
    lastupdate,
    ActividadCancelada,
    vigente,
    Labor,
    NoLabor,
    estado,
  } = req.body;

  // const formatearFecha = (fecha) => {
  //     if (!fecha) return null;
  //     const [fechaParte, horaParte] = fecha.split('T');
  //     const [anio, mes, dia] = fechaParte.split('-');
  //     const [hora, minutos] = horaParte.split(':');
  //     return `${dia}/${mes}/${anio}, ${hora}:${minutos}`;
  // };

  // const newinicio = formatearFecha(inicio);
  // const newfin = formatearFecha(fin);

  const data = await taskmodel.findByIdAndUpdate(
    id,
    {
      $set: {
        comentarios: comentario,
        inicioreal: inicio,
        finreal: fin,
        avance: avance,
        usuario: usuario,
        lastupdate: lastupdate,
        ActividadCancelada: ActividadCancelada,
        Labor: Labor,
        NoLabor: NoLabor,
        estado: estado,
      },
    },
    { new: true }
  );

  const updated = await updatemodel.insertMany({ idtask });

  // if (updated) {
  //     await Promise.all(updated.map(async (item) => {
  //         await updatemodel.findByIdAndUpdate(item._id, {
  //             $set: {
  //                 vigente: "No"
  //             }
  //         })
  //     }))
  // }

  // req.body.inicio = newinicio;
  // req.body.fin = newfin;
  // req.body.idtask = idtask;
  // const dataupdated = new updatemodel(req.body)
  // await dataupdated.save();

  console.log("ejecutando request updatedata");
  res.status(200).json(data);
};

const getdatahistory = async (req, res) => {
  console.log("ejecutando get data history");
  const data = await updatemodel.find({}).sort({ id: 1 });
  res.status(200).json({ data });
};

const deleteschedule = async (req, res) => {
  console.log("borrando todos los dato del cronograma");
  taskmodel
    .deleteMany({})
    .then(() => {
      console.log("Todos los datos del cronograma eliminados correctamente");
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
    });
};

const deletehistorydata = async (req, res) => {
  console.log(
    "borrando todos los dato del historial de actualización del cronograma"
  );
  updatemodel
    .deleteMany({})
    .then(() => {
      console.log(
        "Todos los datos de actualización del cronograma eliminados correctamente"
      );
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
    });
};

const GetValidationData = async (req, res) => {
  console.log("ejecutando get data history");
  const datatask = await updatemodel.find({
    vigente: "Si",
  });
  const data = datatask.filter((item) => item.Validado !== "Si");

  res.status(200).json({ data });
};

const UpdateValidation = async (req, res) => {
  console.log("ACtualización validación");
  console.log(req.body);
  const data = await updatemodel.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        Validado: "Si",
      },
    },
    { new: true }
  );
  console.log(data);
  res.status(200).json({ data });
};

const UpdateBaseLine = (req, res) => {
  console.log("ejecutando carga de datos");
  const bufferData = req.file.buffer;
  const workbook = xlsx.read(bufferData, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = xlsx.utils.sheet_to_json(worksheet);

  const dataPromises = excelData.map(async (rowData) => {
    try {
      rowData.curva = "Linea base";

      console.log(rowData.inicioplan);
      const fechainicio = new Date((rowData.inicioplan - 25569) * 86400 * 1000);
      fechainicio.setMilliseconds(fechainicio.getMilliseconds() + 100);
      console.log(fechainicio);
      rowData.inicioplan = fechainicio.toISOString();
      console.log(rowData.inicioplan);

      console.log(rowData.finplan);
      const fechafin = new Date((rowData.finplan - 25569) * 86400 * 1000);
      fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
      console.log(fechafin);
      rowData.finplan = fechafin.toISOString();
      console.log(rowData.finplan);

      // const data = new taskmodel(rowData);
      // await data.save();

      const data = await taskmodel.findByIdAndUpdate(task._id, {
        $set: {
          inicioplan: "No iniciado",
          finplan: "No iniciado",
          responsable: "No iniciado",
          contratista: "No iniciado",
        },
      });
    } catch (error) {
      console.error("Error al guardar el dato:", error);
    }
  });
  Promise.all(dataPromises)
    .then(() => {
      console.log("Todos los datos guardados en la base de datos");
      res.status(200).json({ message: "Datos guardados en la base de datos" });
    })
    .catch((error) => {
      console.error("Error al guardar los datos:", error);
      res.status(500).json({ error: "Error al guardar los datos" });
    });
};

const DeleteActivities222 = (req, res) => {
  console.log("ejecutando eliminación de actividades especificas");
  const bufferData = req.file.buffer;
  const workbook = xlsx.read(bufferData, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = xlsx.utils.sheet_to_json(worksheet);

  const dataPromises = excelData.map(async (rowData) => {
    try {
      console.log(rowData.id);
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
    }
  });
  Promise.all(dataPromises)
    .then(() => {
      console.log("Todas las actibidades ingresadas fueron eliminadas");
      res.status(200).json({ message: "Datos eliminados de la base de datos" });
    })
    .catch((error) => {
      console.error("Error al eliminar los datos:", error);
      res.status(500).json({ error: "Error al eliminar los datos" });
    });
};

const DeleteActivities = (req, res) => {};

const MassiveUpdate = async (req, res) => {
  try {
    console.log("Ejecutando la actualización masiva de actividades");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    //const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const worksheet = workbook.Sheets["ReportePdP"];

    const excelData = xlsx.utils.sheet_to_json(worksheet).filter((item) => {
      try {
        return !(
          Number(item.avance) == 0 &&
          item.ActividadCancelada.toLowerCase() === "no" &&
          String(item.comentarios || "").trim() === "" &&
          String(item.inicioreal || "").trim() === "" &&
          String(item.finreal || "").trim() === "" &&
          Number(item.Mecanicos) == 0 &&
          Number(item.Soldadores) == 0 &&
          Number(item.Vigias) == 0 &&
          Number(item.Electricista) == 0 &&
          Number(item.Instrumentista) == 0 &&
          String(item.Andamios).trim().toLowerCase() === "false" &&
          String(item.CamionGrua).trim().toLowerCase() === "false" &&
          String(item.Telescopica).trim().toLowerCase() === "false"
        );
      } catch (error) {
        return true;
      }
    });

    const dataPromises = await Promise.all(
      excelData.map(async (rowData) => {
        try {
          const fechainicio = new Date(
            (rowData.inicioreal - 25569) * 86400 * 1000
          );
          fechainicio.setMilliseconds(fechainicio.getMilliseconds() + 100);
          rowData.inicioreal = fechainicio;

          const fechafin = new Date((rowData.finreal - 25569) * 86400 * 1000);
          fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
          rowData.finreal = fechafin;

          if (!mongoose.Types.ObjectId.isValid(rowData._id)) {
            rowData.Errors = ["ID inválido"];
            rowData.Message = "ID inválido";
            rowData.isValid = false;
            return rowData;
          }

          const response = await taskmodel.findById(rowData._id);

          console.log(rowData);

          rowData.Errors = [];

          if (!response) {
            rowData.Errors = ["Actividad no encontrada"];
            rowData.Message = "Actividad no encontrada";
            rowData.isValid = false;

            return rowData;
          }

          if (
            isNaN(rowData.avance) ||
            Number(rowData.avance) > 100 ||
            Number(rowData.avance) < 0 ||
            Number(rowData.avance) < Number(response.avance)
          ) {
            rowData.Errors.push(
              `Columna Avance (G): Avance inválido (Excel=${rowData.avance}, Base de datos=${response.avance})`
            );
          }

          if (
            rowData.ActividadCancelada?.toLowerCase() !== "no" &&
            rowData.ActividadCancelada?.toLowerCase() !== "si"
          ) {
            rowData.Errors.push(
              "Columna Actividad cancelada (K): Actividad Cancelada inválido"
            );
          }

          if (
            !String(rowData.comentarios).trim() ||
            rowData.comentarios?.[0] === "-" ||
            rowData.comentarios?.[0] === "+" ||
            rowData.comentarios?.[0] === "=" ||
            rowData.comentarios === undefined
          ) {
            rowData.Errors.push(
              "Columna Comentarios (L): Comentarios vacíos o con caracteres prohibidos"
            );
          }

          const comentarios = String(rowData.comentarios || "").trim();
          const avance = Number(rowData.avance);
          const fechaInicio = new Date(rowData.inicioreal);

          if (
            rowData.ActividadCancelada?.toLowerCase() === "no" &&
            comentarios !== "" &&
            (isNaN(avance) || avance === 0 || isNaN(fechaInicio.getTime()))
          ) {
            rowData.Errors.push(
              "Columna Fechas (M y N): Comentarios sin avances o fechas"
            );
          }

          const inicio = new Date(rowData.inicioreal);
          const fin = new Date(rowData.finreal);

          const isInicioValido = inicio instanceof Date && !isNaN(inicio);
          const isFinValido = fin instanceof Date && !isNaN(fin);

          const hoy = new Date();

          const unaSemanaAntes = new Date(hoy);
          unaSemanaAntes.setDate(hoy.getDate() -5);

          const unaSemanaDespues = new Date(hoy);
          unaSemanaDespues.setDate(hoy.getDate() + 5);

          if (
            (isInicioValido && isFinValido && inicio > fin) || // inicio después de fin
            (isFinValido && !isInicioValido) || // hay fin pero no inicio
            (Number(rowData.avance) > 0 && !isInicioValido) || // hay avance pero no inicio
            (Number(rowData.avance) === 100 &&
              (!isFinValido || !isInicioValido)) // avance 100 pero falta alguna fecha
          ) {
            rowData.Errors.push(
              "Columna Fechas (M y N): Errores en las fechas de inicio y/o fin"
            );
          }

          if (Number(rowData.avance) < 100 && isFinValido) {
            rowData.Errors.push(
              "Columna Avance (G): Tiene fecha fin, pero avance menor a 100%"
            );
          }

          if (isInicioValido) {
            if (inicio < unaSemanaAntes || inicio > unaSemanaDespues) {
              rowData.Errors.push(
                "Fecha inicio fuera de rango (±5 días del día actual)"
              );
            }
          }

          if (isFinValido) {
            if (fin < unaSemanaAntes || fin > unaSemanaDespues) {
              rowData.Errors.push(
                "Fecha fin fuera de rango (±5 días del día actual)"
              );
            }
          }

          if (
            isNaN(Number(rowData.Mecanicos)) ||
            isNaN(Number(rowData.Soldadores)) ||
            isNaN(Number(rowData.Vigias)) ||
            isNaN(Number(rowData.Electricista)) ||
            isNaN(Number(rowData.Instrumentista))
          ) {
            rowData.Errors.push(
              "Columnas Labor (O, P, Q, R, S): Valores no numéricos en los campos Mecanicos, Soldadores, Vigias, Electricista o Instrumentista"
            );
          }

          const isBooleanValue = (value) => {
            if (typeof value === "boolean") return true;
            if (typeof value !== "string") return false;
            const v = value.trim().toLowerCase();
            return v === "verdadero" || v === "falso";
          };

          if (
            !isBooleanValue(rowData.Andamios) ||
            !isBooleanValue(rowData.CamionGrua) ||
            !isBooleanValue(rowData.Telescopica)
          ) {
            rowData.Errors.push(
              "Columnas No Labor (T, U, V): Valores no booleanos en los campos Andamios, CamionGrua o Telescopica"
            );
          }

          if (rowData.Errors.length > 0) {
            rowData.Message = rowData.Errors.join(" | ");
          }

          rowData.isValid = rowData.Errors.length === 0;

          return rowData;
        } catch (error) {
          console.log(rowData.id);
          console.error("Error al guardar el dato:", error);
          return null;
        }
      })
    );

    const ValidationBoolean = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        if (value.trim().toLowerCase() === "verdadero") return true;
        if (value.trim().toLowerCase() === "falso") return false;
      }
    };

    if (dataPromises.filter((item) => item.isValid === false).length > 0) {
      console.log("Se proceso pero no se guardo");
      res.status(200).json({
        message: "Datos procesados",
        datos: dataPromises,
      });
    } else {
      await Promise.all(
        excelData
          .filter(
            (item) =>
              !(
                Number(item.avance) === 0 &&
                item.ActividadCancelada.toLowerCase() === "no"
              )
          )
          .map(async (item) => {
            const parseDate = (value) => {
              const date = new Date(value);
              return date instanceof Date && !isNaN(date) ? date : undefined;
            };

            const object = {
              avance: Number(item.avance),
              ActividadCancelada: String(item.ActividadCancelada),
              comentarios: String(item.comentarios),
              Labor: {
                Mecanicos: Number(item.Mecanicos),
                Soldadores: Number(item.Soldadores),
                Vigias: Number(item.Vigias),
                Electricista: Number(item.Electricista),
                Instrumentista: Number(item.Instrumentista),
              },
              NoLabor: {
                Andamios: ValidationBoolean(item.Andamios),
                CamionGrua: ValidationBoolean(item.CamionGrua),
                Telescopica: ValidationBoolean(item.Telescopica),
              },
            };

            const fechaInicio = parseDate(item.inicioreal);
            const fechaFin = parseDate(item.finreal);

            if (fechaInicio instanceof Date && !isNaN(fechaInicio))
              object.inicioreal = fechaInicio.setHours(fechaInicio.getHours()+5);
            if (fechaFin instanceof Date && !isNaN(fechaFin))
              object.finreal = fechaFin.setHours(fechaFin.getHours()+5);

            const objectId = { ...object };
            objectId.id = item.id;

            const updatedTask = await taskmodel.findByIdAndUpdate(
              item._id,
              {
                $set: object,
              },
              { new: true }
            );
            //------------------------------------------------------
            await updatemodel.create(objectId);
            //------------------------------------------------------
            return updatedTask;
          })
      );
      console.log("Se guardaron los datos");

      const tempObject = {
        fechaActual: new Date().toISOString()
      }
        

      const fakeRes = {
        status: (code) => ({
          json: (data) => console.log("Response:", code, data),
        }),
      };

      statusupdate({ body: tempObject }, fakeRes);
      res.status(200).json({ message: "Datos Guardados", datos: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar las actividades" });
  }
};

const updateDatesActivities = async (req,res) =>{

  const response = await taskmodel.updateMany(
  {},
  [
    {
      $set: {
        inicioplan: {
          $dateFromParts: {
            year: 2025,
            month: { $month: "$inicioplan" },
            day: { $dayOfMonth: "$inicioplan" },
            hour: { $hour: "$inicioplan" },
            minute: { $minute: "$inicioplan" },
            second: { $second: "$inicioplan" },
            millisecond: { $millisecond: "$inicioplan" }
          }
        },
        finplan: {
          $dateFromParts: {
            year: 2025,
            month: { $month: "$finplan" },
            day: { $dayOfMonth: "$finplan" },
            hour: { $hour: "$finplan" },
            minute: { $minute: "$finplan" },
            second: { $second: "$finplan" },
            millisecond: { $millisecond: "$finplan" }
          }
        },
        inicioreal: {
          $dateFromParts: {
            year: 2025,
            month: { $month: "$inicioreal" },
            day: { $dayOfMonth: "$inicioreal" },
            hour: { $hour: "$inicioreal" },
            minute: { $minute: "$inicioreal" },
            second: { $second: "$inicioreal" },
            millisecond: { $millisecond: "$inicioreal" }
          }
        },
        finreal: {
          $dateFromParts: {
            year: 2025,
            month: { $month: "$finreal" },
            day: { $dayOfMonth: "$finreal" },
            hour: { $hour: "$finreal" },
            minute: { $minute: "$finreal" },
            second: { $second: "$finreal" },
            millisecond: { $millisecond: "$finreal" }
          }
        }
      }
    }
  ]
);

res.status(200).json({"message":"Datos Actualizados"});

}





module.exports = {
  getfiltersdata,
  getscheduledata,
  GetThirdParty,
  GetEspecialidad,
  deleteschedule,
  deletehistorydata,
  statusupdate,
  uploadexcel,
  filtereddata,
  updatedata,
  getdatahistory,
  GetValidationData,
  UpdateValidation,
  UpdateBaseLine,
  DeleteActivities,
  MassiveUpdate,
  updateDatesActivities
};
