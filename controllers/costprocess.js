const xlsx = require('xlsx');
const costmodel = require('../models/cost')
const mongoose = require('mongoose')

const uploadexcel = (req, res) => {

    console.log("ejecutando carga de costos");
    const filepath = req.file.path
    const workbook = xlsx.readFile(filepath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {
        try {

            const data = new costmodel(rowData);
            console.log(rowData.Title);
            await data.save();

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

const getalldata = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await costmodel.find({})
    res.status(200).json(data)

}

const deleteall = async (req, res) => {
    console.log("borrando todo");
    costmodel.deleteMany({})
        .then(() => {
            console.log('Todos los documentos eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

module.exports = {
    uploadexcel,
    getalldata,
    deleteall
}