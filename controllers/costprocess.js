const xlsx = require('xlsx');

//Mantto Mina
const actualmodel = require('../models/cost')
const budgetmodel = require('../models/budget')

//Mantto Planta
const actualPlantamodel = require('../models/costplanta')
const budgetPlantamodel = require('../models/budgetplanta')

const mongoose = require('mongoose')

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
                }
                else {
                    console.log("cargando el budget de mina");
                    const data = new budgetmodel(rowData);
                    await data.save();
                }

            } catch (error) {
                console.error('Error al guardar el dato:', error);
            }
        } else {
            try {
                if (req.body.type === "true") {
                    console.log("cargando el actual de planta");
                    const data = new actualPlantamodel(rowData);
                    await data.save();
                }
                else {
                    console.log("cargando el budget de planta");
                    const data = new budgetPlantamodel(rowData);
                    await data.save();
                }

            } catch (error) {
                console.error('Error al guardar el dato:', error);
            }
        }
    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}

const getalldataactual = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await actualmodel.find({})
    res.status(200).json(data)

}

const getalldatabudget = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await budgetmodel.find({})
    res.status(200).json(data)

}

const deleteallActual = async (req, res) => {
    console.log("borrando todo");
    actualmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del actual eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const deleteallBudget = async (req, res) => {
    console.log("borrando todos los datos del ppto de mantto mina");
    budgetmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del budget eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}


//Mantto Planta
const getalldataactualplanta = async (req, res) => {

    console.log("ejecutando get all data planta");
    // const data = await actualPlantamodel.find({})
    // const data = await actualPlantamodel.find({ Mes: { $ne: 0 } })
    // res.status(200).json(data)


    try {
        //const batchSize = 1000; // Tamaño del lote

        // Establecemos el encabezado Content-Type como JSON
        res.setHeader('Content-Type', 'application/json');

        res.write('['); // Comenzamos el arreglo JSON

        let isFirst = true; // Para determinar si es el primer elemento del arreglo

        //let skip = 0;

        const cursor = actualPlantamodel.find({ Mes: { $ne: 0 } })
            .lean()
            .cursor(); // Obtener un stream de documentos

        cursor.on('data', (item) => {
            // Envía los datos al cliente línea por línea en formato JSON
            if (!isFirst) {
                res.write(',');
            } else {
                isFirst = false;
            }
            res.write(JSON.stringify(item));
            console.log("ejecutando");
        });

        cursor.on('end', () => {
            res.write(']'); // Finalizamos el arreglo JSON
            res.end(); // Finalizamos la respuesta
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

const getalldatabudgetplanta = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await budgetPlantamodel.find({})
    res.status(200).json(data)

}

const deleteallActualplanta = async (req, res) => {
    console.log("borrando todo");
    actualPlantamodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del actual eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const deleteallBudgetplanta = async (req, res) => {
    console.log("borrando todos los datos del ppto de Mantto Planta");
    budgetPlantamodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del budget eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const UpdateSingleMonth = async (req, res) => {

    console.log("Ejecutando actualización por fila");
    const { RowId, MesValue } = req.body;
    console.log(req.body);

    if (!MesValue) {
        return res.status(400).send("Falta información necesaria para la actualización.");
    }

    try {
        const data = await actualPlantamodel.findByIdAndUpdate(RowId, { Mes: MesValue }, { new: true });
        if (!data) {
            return res.status(404).send("No se encontró el documento para actualizar.");
        }
        res.status(200).send("Actualización exitosa");
    } catch (error) {
        console.error("Error al actualizar:", error.message);
        res.status(500).send("Error al actualizar el documento.");
    }

}

const UpdateGroupMonth = async (req, res) => {
    console.log(req.body);
    console.log("Ejecutando actualización por grupo");

    const dataUpdated = req.body.map(async (item) => {
        const data = await actualPlantamodel.findByIdAndUpdate(item._id, { Mes: parseInt(item.Mes) }, { new: true });
    })
    Promise.all(dataUpdated)
        .then(() => {
            console.log('Todos los datos guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
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

    UpdateSingleMonth,
    UpdateGroupMonth
}