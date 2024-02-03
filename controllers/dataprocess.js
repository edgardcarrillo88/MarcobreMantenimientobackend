const xlsx = require('xlsx');
const taskmodel = require('../models/task')
const updatemodel = require('../models/updates')
const failformmodel = require('../models/failform')
const dailyreportmodel = require('../models/dailyreport')
const polinestagmodel = require('../models/polinestag')
const mongoose = require('mongoose')

const uploadexcel = (req, res) => {

    const filepath = req.file.path
    const workbook = xlsx.readFile(filepath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {
        try {
            rowData.curva = 'Linea base'

            console.log(rowData.inicioplan);
            const fechainicio = new Date((rowData.inicioplan - 25569) * 86400 * 1000);
            fechainicio.setMilliseconds(fechainicio.getMilliseconds() + 100);
            // const fechainicioFormateada = format(fechainicio, 'dd/MM/yyyy HH:mm');
            // rowData.inicioplan = fechainicioFormateada;
            console.log(fechainicio);
            rowData.inicioplan = fechainicio.toISOString();
            console.log(rowData.inicioplan);

            console.log(rowData.finplan);
            const fechafin = new Date((rowData.finplan - 25569) * 86400 * 1000);
            fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
            // const fechafinFormateada = format(fechafin, 'dd/MM/yyyy HH:mm');
            //rowData.finplan = fechafinFormateada;
            console.log(fechafin);
            rowData.finplan = fechafin.toISOString();
            console.log(rowData.finplan);

            const data = new taskmodel(rowData);
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

const uploadexcelTemp = (req, res) => {

    console.log("ejecutando carga de datos");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);



    const dataPromises = excelData.map(async (rowData) => {

            try {

                    console.log("cargando datos");
                    const data = new polinestagmodel(rowData);
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

const registerform = async (req, res) => {

    //Determinar el ID
    console.log("ejecutando request registerform");

    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const images = req.files.map(file => {
        return {
            data: file.buffer,
            contentType: file.mimetype
        };
    });

    const initaldata = JSON.parse(req.body.initaldata);

    const lastRecord = await failformmodel.findOne().sort({ Id: -1 }).limit(1);
    const newCount = (lastRecord && lastRecord.Id) ? lastRecord.Id + 1 : 1;
    initaldata.Id = newCount

    //Transformar el formato fecha de la categoría "Principal"
    let newinicio;

    if (initaldata.FechaEvento) {
        const [fechainicio, horainicio] = initaldata.FechaEvento.split('T');
        const [anhoinicio, mesinicio, diainicio] = fechainicio.split('-');
        const [horasinicio, minutosinicio] = horainicio.split(':');
        newinicio = `${diainicio}/${mesinicio}/${anhoinicio}, ${horasinicio}:${minutosinicio}`;
    }

    initaldata.FechaEvento = newinicio

    const listaplanes = JSON.parse(req.body.listaplanes || '[]');
    const listaestrategia = JSON.parse(req.body.listaestrategia || '[]');
    const listacomponentes = JSON.parse(req.body.listacomponentes || '[]');
    const listapreventivos = JSON.parse(req.body.listapreventivos || '[]');
    const listaestrategiaSAP = JSON.parse(req.body.listaestrategiaSAP || '[]');

    //Guardando la información de categoría "Principal"
    const dataPrincipal = new failformmodel({
        ...initaldata,
        listaplanes,
        listaestrategia,
        listacomponentes,
        listapreventivos,
        listaestrategiaSAP,
        Id: newCount,
        images
    });
    await dataPrincipal.save();
    res.status(200).json(dataPrincipal)

}

const dailyreport = async (req, res) => {

    //Determinar el ID
    console.log("ejecutando register daily report");

    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('req.photos:', req.photos);

    const files = req.files.files.map(file => {
        return {
            data: file.buffer,
            contentType: file.mimetype
        };
    });

    const photos = req.files.photos.map(file => {
        return {
            data: file.buffer,
            contentType: file.mimetype
        };
    });

    const initaldata = JSON.parse(req.body.initaldata);

    const lastRecord = await dailyreportmodel.findOne().sort({ Id: -1 }).limit(1);
    const newCount = (lastRecord && lastRecord.Id) ? lastRecord.Id + 1 : 1;
    initaldata.Id = newCount

    // //Transformar el formato fecha de la categoría "Principal"
    let newinicio;

    if (initaldata.FechaInicio) {
        const [fechainicio, horainicio] = initaldata.FechaInicio.split('T');
        const [anhoinicio, mesinicio, diainicio] = fechainicio.split('-');
        const [horasinicio, minutosinicio] = horainicio.split(':');
        newinicio = `${diainicio}/${mesinicio}/${anhoinicio}, ${horasinicio}:${minutosinicio}`;
    }

    initaldata.FechaInicio = newinicio


    let newfin;

    if (initaldata.FechaFin) {
        const [fechafin, horafin] = initaldata.FechaFin.split('T');
        const [anhofin, mesfin, diafin] = fechafin.split('-');
        const [horasfin, minutosfin] = horafin.split(':');
        newfin = `${diafin}/${mesfin}/${anhofin}, ${horasfin}:${minutosfin}`;
    }

    initaldata.FechaFin = newfin

    const listacomponentes = JSON.parse(req.body.listacomponentes || '[]');

    //Guardando la información de categoría "Principal"
    const dataPrincipal = new dailyreportmodel({
        ...initaldata,
        listacomponentes,
        Id: newCount,
        files,
        photos
    });
    await dataPrincipal.save();
    res.status(200).json(dataPrincipal)

}

const getalldata = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await failformmodel.find({})
    res.status(200).json(data)

}

const getalldatadailyreport = async (req, res) => {

    console.log("ejecutando get all data");
    const data = await dailyreportmodel.find({})
    // console.log(data);
    res.status(200).json(data)

}

const getsingledata = async (req, res) => {

    console.log("ejecutando get single data");
    // console.log(req.query.Id);
    const data = await failformmodel.findOne({ Id: req.query.Id })
    // console.log(data);
    res.status(200).json(data)

}

const getfiltersdata = async (req, res) => {
    console.log("ejecutando datos para filtros");

    const uniqueResponsables = await taskmodel.distinct('responsable');
    const uniqueContratistas = await taskmodel.distinct('contratista');
    const uniqueEstados = await taskmodel.distinct('estado');

    const data = [];

    for (let i = 0; i < uniqueResponsables.length; i++) {
        const uniqueValueObject = {
            responsable: uniqueResponsables[i],
            contratista: uniqueContratistas[i],
            estado: uniqueEstados[i],
        };
        data.push(uniqueValueObject);
    }

    res.status(200).json({ data })
}

const getscheduledata = async (req, res) => {
    console.log("ejecutando request getalldata");
    const data = await taskmodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}

const statusupdate = async (req, res) => {
    console.log("actualizando status");
    const { fechaActual } = req.body;
    const data = await taskmodel.find({}).sort({ id: 1 })

    data.map(async (task) => {
        const fechainiciobd = new Date(task.inicioplan)
        const fechafinbd = new Date(task.finplan)
        const fechafrontend = new Date(fechaActual)


        if (task.avance === undefined) {
            // console.log("No iniciado");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "No iniciado"
                }
            })
        }

        if (fechafrontend > fechainiciobd && task.avance === undefined) {
            // console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Atrasado"
                }
            })
        }

        if (fechafrontend > fechafinbd && task.avance !== 100) {
            // console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Atrasado"
                }
            })
        }



        if (task.avance === 100) {
            // console.log("Finalizado");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Finalizado"
                }
            })
        }
    })
}

const filtereddata = async (req, res) => {
    console.log("ejecutando request filtereddata");
    const { id } = req.query
    const data = await taskmodel.find({ id })
    res.status(200).json(data[0])
}

const updatedata = async (req, res) => {
    const { id, idtask, comentario, inicio, fin, avance, usuario, lastupdate, ActividadCancelada, vigente } = req.body;

    const formatearFecha = (fecha) => {
        if (!fecha) return null;
        const [fechaParte, horaParte] = fecha.split('T');
        const [anio, mes, dia] = fechaParte.split('-');
        const [hora, minutos] = horaParte.split(':');
        return `${dia}/${mes}/${anio}, ${hora}:${minutos}`;
    };

    const newinicio = formatearFecha(inicio);
    const newfin = formatearFecha(fin);

    const data = await taskmodel.findByIdAndUpdate(id, {
        $set: {
            comentarios: comentario,
            inicioreal: inicio,
            finreal: fin,
            avance: avance,
            usuario: usuario,
            lastupdate: lastupdate,
            ActividadCancelada: ActividadCancelada
        }
    }, { new: true })

    const updated = await updatemodel.find({ idtask })

    if (updated) {
        await Promise.all(updated.map(async (item) => {
            await updatemodel.findByIdAndUpdate(item._id, {
                $set: {
                    vigente: "No"
                }
            })
        }))
    }

    req.body.inicio = newinicio;
    req.body.fin = newfin;
    req.body.idtask = idtask;
    const dataupdated = new updatemodel(req.body)
    await dataupdated.save();

    console.log("ejecutando request updatedata");
    res.status(200).json(data)
}

const getdatahistory = async (req, res) => {
    console.log("ejecutando get data history");
    const data = await updatemodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}




const getpolinesdata = async(req,res) =>{
    console.log("ejecutando request getpolinesdata");
    const data = await polinestagmodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}

const deleteallpolines = async (req, res) => {
    console.log("borrando todos los polines");
    polinestagmodel.deleteMany({})
        .then(() => {
            console.log('Todos los polines eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

module.exports = {
    registerform,
    getalldata,
    getsingledata,
    getfiltersdata,
    getscheduledata,
    statusupdate,
    uploadexcel,
    filtereddata,
    dailyreport,
    getalldatadailyreport,
    updatedata,
    getdatahistory,
    uploadexcelTemp,
    getpolinesdata,
    deleteallpolines
}