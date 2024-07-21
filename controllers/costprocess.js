const xlsx = require("xlsx");
const zlib = require("zlib");

//Mantto Mina
const actualmodel = require("../models/cost");
const budgetmodel = require("../models/budget");

//Mantto Planta
const actualPlantamodel = require("../models/costplanta");
const budgetPlantamodel = require("../models/budgetplanta");

const mongoose = require("mongoose");

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
          console.log("cargando el actual de mina");
          const data = new actualmodel(rowData);
          await data.save();
        } else {
          console.log("cargando el budget de mina");
          const data = new budgetmodel(rowData);
          await data.save();
        }
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
    } else {
      try {
        if (req.body.type === "true") {
          console.log("cargando el actual de planta");
          const data = new actualPlantamodel(rowData);
          await data.save();
        } else {
          console.log("cargando el budget de planta");
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
  const limit = parseInt(req.query.limit) || 20;
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

  // zlib.gzip(JSON.stringify(data), (err, compressedData) => {
  //     if (err) {
  //       console.error("Error al comprimir los datos:", err);
  //       res.status(500).send("Error interno del servidor");
  //     } else {
  //       // Configurar los encabezados de respuesta para indicar que se envía una respuesta comprimida
  //       res.setHeader('Content-Type', 'application/json');
  //       res.setHeader('Content-Encoding', 'gzip');
  //       res.status(200).send(compressedData);
  //     }
  //   });

  // try {
  //     //const batchSize = 1000; // Tamaño del lote

  //     // Establecemos el encabezado Content-Type como JSON
  //     res.setHeader('Content-Type', 'application/json');

  //     res.write('['); // Comenzamos el arreglo JSON

  //     let isFirst = true; // Para determinar si es el primer elemento del arreglo

  //     //let skip = 0;

  //     const cursor = actualPlantamodel.find({ Mes: { $ne: 0 } })
  //         .lean()
  //         .cursor(); // Obtener un stream de documentos

  //     cursor.on('data', (item) => {
  //         // Envía los datos al cliente línea por línea en formato JSON
  //         if (!isFirst) {
  //             res.write(',');
  //         } else {
  //             isFirst = false;
  //         }
  //         res.write(JSON.stringify(item));
  //         console.log("ejecutando");
  //         console.log(cursor);
  //     });

  //     cursor.on('end', () => {
  //         res.write(']'); // Finalizamos el arreglo JSON
  //         res.end(); // Finalizamos la respuesta
  //         console.log("Finalizado");
  //     });

  //     cursor.on('error', (error) => {
  //         console.error('Error al leer los datos:', error);
  //         res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  //     });

  // } catch (error) {
  //     console.error('Error al leer los datos:', error);
  //     res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  // }

  //-----------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------

  // try {
  //     const cursor = actualPlantamodel.find({ Mes: { $ne: 0 } })
  //         .lean()
  //         .cursor();

  //     cursor.on('data', (item) => {
  //         // Envía cada objeto como una línea separada
  //         res.write(JSON.stringify(item) + '\n');
  //     });

  //     cursor.on('end', () => {
  //         res.end();
  //     });

  //     cursor.on('error', (error) => {
  //         console.error('Error al leer los datos:', error);
  //         res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  //     });

  // } catch (error) {
  //     console.error('Error al leer los datos:', error);
  //     res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
  // }
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

const borrandoDatosActualFiltrado = async (req, res) => {

  console.log("Borrando datos filtrados");

  console.log(parseFloat(req.body.Mes));

  try {
    await actualPlantamodel.deleteMany({
      Mes: parseFloat(req.body.Mes),
      CategoriaActual: { $in: ["Real", "ProvAnt"] }
    });
    res.status(200).send('Todos los datos filtrados del actual eliminados correctamente');
    console.log('Todos los datos filtrados del actual eliminados correctamente');
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

const UpdateSingleMonth = async (req, res) => {
  console.log("Ejecutando actualización por fila");
  const { RowId, MesValue, MesMonto } = req.body;
  console.log(req.body);

  if (!MesValue && !MesMonto) {
    return res
      .status(400)
      .send("Falta información necesaria para la actualización.");
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
      res.status(200).json({ message: "Datos guardados en la base de datos" });
    })
    .catch((error) => {
      console.error("Error al guardar los datos:", error);
      res.status(500).json({ error: "Error al guardar los datos" });
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
  borrandoDatosActualFiltrado,

  UpdateSingleMonth,
  UpdateGroupMonth,

  Temporal,
};
