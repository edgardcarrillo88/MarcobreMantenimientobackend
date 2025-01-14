const xlsx = require("xlsx");
const zlib = require("zlib");

//Mantto Mina
const actualmodel = require("../models/cost");
const budgetmodel = require("../models/budget");

//Mantto Planta
const actualPlantamodel = require("../models/costplanta");
const budgetPlantamodel = require("../models/budgetplanta");

//Modelo Provisiones
const ProvisionesModel = require("../models/Provisiones")


const mongoose = require("mongoose");
const { promises } = require("dns");

//Manto Mina
const uploadexcel = (req, res) => {
  console.log("ejecutando carga de costos");
  const bufferData = req.file.buffer;
  const workbook = xlsx.read(bufferData, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = xlsx.utils.sheet_to_json(worksheet);

  const dataPromises = excelData.map(async (rowData) => {
    if (req.body.area === "true") {
      try {
        if (req.body.type === "true") {
          // console.log("cargando el actual de mina");
          const data = new actualmodel(rowData);
          await data.save();
        } else {
          // console.log("cargando el budget de mina");
          const data = new budgetmodel(rowData);
          await data.save();
        }
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
    } else {
      try {
        if (req.body.type === "true") {
          // console.log("cargando el actual de planta");
          const data = new actualPlantamodel(rowData);
          await data.save();
        } else {
          // console.log("cargando el budget de planta");
          const data = new budgetPlantamodel(rowData);
          await data.save();
        }
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
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


const getalldataactual = async (req, res) => {
  console.log("ejecutando get all data");
  const data = await actualmodel.find({});
  res.status(200).json(data);
};

const getalldatabudget = async (req, res) => {
  console.log("ejecutando get all data");
  const data = await budgetmodel.find({});
  res.status(200).json(data);
};

const deleteallActual = async (req, res) => {
  console.log("borrando todo");
  actualmodel
    .deleteMany({})
    .then(() => {
      console.log("Todos los datos del actual eliminados correctamente");
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
    });
};

const deleteallBudget = async (req, res) => {
  console.log("borrando todos los datos del ppto de mantto mina");
  budgetmodel
    .deleteMany({})
    .then(() => {
      console.log("Todos los datos del budget eliminados correctamente");
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
    });
};


//Mantto Planta
const getalldataactualplanta = async (req, res) => {

  console.log("ejecutando get all data planta");

  const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 20;
  const limit = parseInt(req.query.perPage) || 10;
  const mes = parseInt(req.query.Mes) || 0;
  const planta = req.query.Planta;

  console.log(req.query);


  let query = {
    Mes: { $ne: 0 },
  };

  if (planta) {
    query.Planta = planta;
  }

  if (req.query.Categoria) {
    query.Categoria = { $regex: req.query.Categoria, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }

  if (req.query.Partida) {
    query.Partida = { $regex: req.query.Partida, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }

  if (req.query.CategoriaActual) {
    query.CategoriaActual = { $regex: req.query.CategoriaActual, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }

  if (req.query.OC) {
    query.OC = { $regex: req.query.OC, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }

  if (mes) [(query.Mes = mes)];

  if (req.query.Proveedor) {
    query.Proveedor = { $regex: req.query.Proveedor, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }

  if (req.query.TAG) {
    query.TAG = { $regex: req.query.TAG, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }

  if (req.query.TxtPedido) {
    query.TxtPedido = { $regex: req.query.TxtPedido, $options: 'i' }; // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  }


  console.log(query);


  const data = await actualPlantamodel.paginate(query, { page, limit });
  res.status(200).json(data);
  console.log("Respuesta exitosa");
};

const GetAllDataActualForPowerBI = async (req, res) => {

  try {

    res.setHeader('Content-Type', 'application/json');

    res.write('[');

    let isFirst = true;

    const cursor = actualPlantamodel.find({ Mes: { $ne: 0 } })
      .lean()
      .cursor();

    cursor.on('data', (item) => {
      if (!isFirst) {
        res.write(',');
      } else {
        isFirst = false;
      }
      res.write(JSON.stringify(item));
      // console.log(cursor);
    });

    cursor.on('end', () => {
      res.write(']');
      res.end();
      console.log("Finalizado");
    });

    cursor.on('error', (error) => {
      console.error('Error al leer los datos:', error);
      res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
    });

  } catch (error) {
    console.error('Error al leer los datos:', error);
    res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  }


}

const GetAllDataActualForPowerExcel = async (req, res) => {

  try {

    res.setHeader('Content-Type', 'application/json');

    res.write('[');

    let isFirst = true;

    const cursor = actualPlantamodel.find({})
      .lean()
      .cursor();

    cursor.on('data', (item) => {
      if (!isFirst) {
        res.write(',');
      } else {
        isFirst = false;
      }
      res.write(JSON.stringify(item));
      // console.log(cursor);
    });

    cursor.on('end', () => {
      res.write(']');
      res.end();
      console.log("Finalizado");
    });

    cursor.on('error', (error) => {
      console.error('Error al leer los datos:', error);
      res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
    });

  } catch (error) {
    console.error('Error al leer los datos:', error);
    res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  }


}

const borrandoDatosActualFiltrado = async (req, res) => {

  console.log("Borrando datos reales del mes:", req.body.Mes);

  console.log(parseFloat(req.body.Mes));

  try {
    await actualPlantamodel.deleteMany({
      Mes: parseFloat(req.body.Mes),
      CategoriaActual: { $in: ["Real"] }
    });
    res.status(200).send('Todos los datos filtrados del actual eliminados correctamente');
    console.log('Todos los datos filtrados del actual eliminados correctamente');
  } catch (error) {
    console.error('Error al eliminar documentos:', error);
    res.status(500).send('Error al eliminar documentos');
  }

}


const borrandoDatosProvAntFiltrado = async (req, res) => {

  console.log("Borrando datos ProvAnt del mes:", req.body.Mes);

  console.log(parseFloat(req.body.Mes));

  try {
    await actualPlantamodel.deleteMany({
      Mes: parseFloat(req.body.Mes),
      CategoriaActual: { $in: ["ProvAnt"] }
    });
    res.status(200).send('Todos los datos ProvAnt del actual eliminados correctamente');
    console.log('Todos los datos ProvAnt del actual eliminados correctamente');
  } catch (error) {
    console.error('Error al eliminar documentos:', error);
    res.status(500).send('Error al eliminar documentos');
  }

}


const getalldatabudgetplanta = async (req, res) => {
  console.log("ejecutando get all data");
  // const data = await budgetPlantamodel.find({});
  // res.status(200).json(data);


  try {

    res.setHeader('Content-Type', 'application/json');

    res.write('[');

    let isFirst = true;

    const cursor = budgetPlantamodel.find({ Mes: { $ne: 0 } })
      .lean()
      .cursor();

    cursor.on('data', (item) => {
      if (!isFirst) {
        res.write(',');
      } else {
        isFirst = false;
      }
      res.write(JSON.stringify(item));
      // console.log(cursor);
    });

    cursor.on('end', () => {
      res.write(']');
      res.end();
      console.log("Finalizado Get all data budget planta");
    });

    cursor.on('error', (error) => {
      console.error('Error al leer los datos:', error);
      res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
    });

  } catch (error) {
    console.error('Error al leer los datos:', error);
    res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  }


};

const deleteallActualplanta = async (req, res) => {
  console.log("borrando todo");
  actualPlantamodel
    .deleteMany({})
    .then(() => {
      console.log("Todos los datos del actual eliminados correctamente");
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
    });
};

const deleteallBudgetplanta = async (req, res) => {
  console.log("borrando todos los datos del ppto de Mantto Planta");
  budgetPlantamodel
    .deleteMany({})
    .then(() => {
      console.log("Todos los datos del budget eliminados correctamente");
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
    });
};


const ArreglandoCojudecesQueHice = async (req, res) => {
  console.log("Corrienda la cojudeces esta");

  try {
    const update = await actualPlantamodel.updateMany(
      { "Planta": "Gerencia de Mantenimiento" },
      { $set: { "Planta": "Gerencia Mantenimiento" } }
    )
    res.status(200).json(update);
  } catch (error) {
    res.status(400).json({ Message: "Error", error })
    console.log(error);
  }
}


//Forecast

const UpdateSingleMonth = async (req, res) => {
  console.log("Ejecutando actualización por fila");
  const { RowId, MesValue, MesMonto, TipoActual } = req.body;
  console.log(req.body);

  if (!MesValue && !MesMonto) {
    console.log("Falta información necesaria para la actualización.");
    return res
      .status(202)
      .send("Falta información necesaria para la actualización.");
  }

  if (TipoActual === "Real") {
    console.log("No se pueden eliminar datos reales");
    return res
      .status(202)
      .send("No se pueden eliminar datos reales");
  }

  try {
    const data = await actualPlantamodel.findByIdAndUpdate(
      RowId,
      { Mes: MesValue, Monto: MesMonto },
      { new: true }
    );
    if (!data) {
      return res
        .status(404)
        .send("No se encontró el documento para actualizar.");
    }
    console.log("Actualización exitosa");
    res.status(200).send("Actualización exitosa");
  } catch (error) {
    console.error("Error al actualizar:", error.message);
    res.status(500).send("Error al actualizar el documento.");
  }
};

const UpdateGroupMonth = async (req, res) => {
  console.log(req.body);
  console.log("Ejecutando actualización por grupo");


  const FilterValue = req.body.filter((item) => {
    return item.TipoActual === "Real"
  })


  if (FilterValue.length>0) {
    console.log("No se pueden actualizar datos reales");
    return res
      .status(202)
      .send("No se pueden actualizar datos reales");
  }


  const dataUpdated = req.body.map(async (item) => {
    const data = await actualPlantamodel.findByIdAndUpdate(
      item._id,
      { Mes: parseInt(item.Mes) },
      { new: true }
    );
  });
  Promise.all(dataUpdated)
    .then(() => {
      console.log("Todos los datos guardados en la base de datos");
      res.status(200).json("Datos Actualizados en la base de datos");
    })
    .catch((error) => {
      console.error("Error al guardar los datos:", error);
      res.status(500).json("Error al guardar los datos");
    });
};


const Temporal = async (req, res) => {

  console.log("Borrando datos filtrados");
  console.log(parseFloat(req.query.Mes));
  mesValue = parseFloat(req.query.Mes)


  try {

    await actualPlantamodel.deleteMany({
      Mes: { $gte: mesValue },
      // Especialidad: "Parada de Planta"
    });

    console.log("Ok");
    res.status(200).send('Todos los datos filtrados del actual eliminados correctamente');

  } catch (error) {
    console.log(error);
  }

}

//Provisiones

const LoadProvisiones = async (req, res) => {
  console.log("Guardadndo datos de provisiones");
  console.log(req.body);

  try {
    const PreData = req.body.map(async (item) => {
      const data = new ProvisionesModel(item)
      return data.save()
    })

    await Promise.all(PreData)

    res.status(200).json({ Message: "Datos guaraddos de manera correcta" })
    console.log("Datos guardados de manera correcta");

  } catch (error) {
    res.status(500).json({ Message: "Error al guardar los datos: ", error })
  }

}

const GetAllDataProvisiones = async (req, res) => {
  console.log("ejecutando get all data provisiones");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.perPage) || 10;
  const planta = req.query.Planta;

  console.log(req.query);


  let query = {
  };

  // console.log(query);
  console.log("page: ", page);
  console.log("Limit: ", limit);

  const convertExcelDateToDate = (excelDate) => {
    return new Date((excelDate - 25569) * 86400 * 1000);
  };

  const data = await ProvisionesModel.paginate(query, { page, limit });

  const GroupData = await ProvisionesModel.aggregate([
    { $match: query },
    // { $group: { _id: null, total: { $sum: "$Monto" } } },
    // { $group: { _id: "$Moneda", total: { $sum: "$Monto" } } },
    {
      $group: {
        _id: {
          Glosa: "$Glosa",
          NombreProveedor: "$NombreProveedor",
          DescripcionServicio: "$DescripcionServicio",
          //  Planta:"$Planta",
          Partida: "$Partida",
          Status: "$Status",
          Moneda: "$Moneda",
          FechaEnvio: "$FechaEnvioProvision"
        },
        Monto: { $sum: "$Monto" }

      }
    },
  ]);

  // console.log(GroupData);
  const GroupProcesed = GroupData.map(obj => (
    {
      ...obj._id,
      Monto: obj.Monto,
      FechaEnvio: convertExcelDateToDate(Number(obj._id.FechaEnvio)),
    }
  ))

  res.status(200).json({ data, GroupProcesed });
}

const GetAllDataProvisionesForPowerBI = async (req, res) => {

  console.log("Ejecutando Get data provisiones");

  try {

    res.setHeader('Content-Type', 'application/json');

    res.write('[');

    let isFirst = true;

    const cursor = ProvisionesModel.find({})
      .lean()
      .cursor();

    cursor.on('data', (item) => {
      if (!isFirst) {
        res.write(',');
      } else {
        isFirst = false;
      }
      res.write(JSON.stringify(item));
      // console.log(cursor);
    });

    cursor.on('end', () => {
      res.write(']');
      res.end();
      console.log("Finalizado");
    });

    cursor.on('error', (error) => {
      console.error('Error al leer los datos:', error);
      res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
    });

  } catch (error) {
    console.error('Error al leer los datos:', error);
    res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  }

}

const DeleteAllDataProvisiones = async (req, res) => {
  console.log("borrando todos los datos de provisiones Pendientes de aprobación");
  ProvisionesModel.deleteMany({
    Status: "Pendiente Aprobación"
  })
    .then(() => {
      console.log("Todos los datos de provisiones eliminados correctamente");
      res.status(200).json({ Message: "Datos eliminados de manera correcta" })
    })
    .catch((error) => {
      console.error("Error al eliminar documentos:", error);
      res.status(400).json(error)
    });
}

const GetAllDataProvisionesContratistas = async (req, res) => {
  console.log("Obteniendo datos de contratistas");
  try {
    const response = await ProvisionesModel.distinct('NombreProveedor');
    const Contratistas = response.map((item, index) => (
      {
        uid: item,
        name: item,
      }
    ))
    res.status(200).json({ Contratistas });
  } catch (error) {
    console.log("Error en la ejecución");
    console.log(error);
  }

}

const UpdateStatusProvisiones = async (req, res) => {
  console.log("Ejecutando actualización de status de provisiones");
  const { status, Glosa } = req.body;
  console.log(status);
  console.log(Glosa);

  if (!status || !Glosa) {
    return res.status(400).json({ Message: "Faltan parámetros necesarios" });
  }

  try {
    const update = await ProvisionesModel.updateMany(
      { "Glosa": Glosa },
      { $set: { "Status": status } }
    )
    res.status(200).json({ Message: "Actualización exitosa" });
  } catch (error) {
    res.status(400).json({ Message: "Error", error })
    console.log(error);
  }

}


module.exports = {
  uploadexcel,
  getalldataactual,
  getalldatabudget,
  getalldataactualplanta,
  getalldatabudgetplanta,
  deleteallActual,
  deleteallBudget,
  deleteallActualplanta,
  deleteallBudgetplanta,
  GetAllDataActualForPowerBI,
  GetAllDataActualForPowerExcel,
  borrandoDatosActualFiltrado,

  UpdateSingleMonth,
  UpdateGroupMonth,

  Temporal,
  LoadProvisiones,
  DeleteAllDataProvisiones,
  GetAllDataProvisiones,

  ArreglandoCojudecesQueHice,
  GetAllDataProvisionesForPowerBI,
  GetAllDataProvisionesContratistas,
  UpdateStatusProvisiones,
  borrandoDatosProvAntFiltrado
};
