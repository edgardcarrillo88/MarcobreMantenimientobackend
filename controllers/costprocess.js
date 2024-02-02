const xlsx = require('xlsx');
const actualmodel = require('../models/cost')
const budgetmodel = require('../models/budget')

const actualPlantamodel = require('../models/costplanta')
const budgetPlantamodel = require('../models/budgetplanta')

const mongoose = require('mongoose')


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

const getalldataactualplanta = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await actualPlantamodel.find({})
    res.status(200).json(data)

}

const getalldatabudgetplanta = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await budgetPlantamodel.find({})
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
    console.log("borrando todo");
    budgetmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del budget eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
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
    console.log("borrando todo");
    budgetPlantamodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del budget eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
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
    deleteallBudgetplanta
}