const xlsx = require('xlsx');
const actualmodel = require('../models/cost')
const budgetmodel = require('../models/budget')
const mongoose = require('mongoose')

const uploadexcel = (req, res) => {

    console.log("ejecutando carga de costos");
    //const filepath = req.file.path
    const bufferData = req.file.buffer;
    console.log(req.body.type);
    //const workbook = xlsx.readFile(filepath)
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {
        try {
            if(req.body.type==="true"){
                const data = new actualmodel(rowData);
                await data.save();
            }
            else {
                const data = new budgetmodel(rowData);
                await data.save();
            }

        } catch (error) {
            console.error('Error al guardar el dato:', error);
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
    console.log("borrando todo");
    budgetmodel.deleteMany({})
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
    deleteallActual,
    deleteallBudget
}