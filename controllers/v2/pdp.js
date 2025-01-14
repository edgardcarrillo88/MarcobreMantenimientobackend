//Librerias
const xlsx = require('xlsx');

//Modelos Parada de Planta
const taskmodel = require('../../models/v2/ParadaPlanta/Cronograma/activities')
const updatemodel = require('../../models/v2/ParadaPlanta/Cronograma/updates')


//Parada de Planta
const uploadexcel = (req, res) => {

    console.log("ejecutando carga de datos de cronograma de parada de planta");
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

const getfiltersdata = async (req, res) => {
    console.log("ejecutando datos para filtros");

    const uniqueResponsables = await taskmodel.distinct('responsable');
    const uniqueContratistas = await taskmodel.distinct('contratista');
    console.log(uniqueContratistas);
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

const GetThirdParty = async (req, res) => {
    console.log("Iniciando el proceso de obtener datos de contratistas");

    try {
        const response = await taskmodel.distinct('contratista');
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

const GetEspecialidad = async (req, res) => {
    console.log("Ejecutando obtener especialidades");
    try {
        const response = await taskmodel.distinct('especialidad');
        const Especialidades = response.map((item, index) => (
            {
                uid: item,
                name: item,
            }
        ))
        console.log("Respuesta exitosa");
        res.status(200).json({ Especialidades });
    } catch (error) {
        console.log("Error en la ejecución");
        console.log(error);
        res.status(500).json({ error: 'Error al obtener las especialidades' });
    }
}

const getscheduledata = async (req, res) => {
    console.log("ejecutando request getalldata");
    const data = await taskmodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}

const statusupdate = async (req, res) => {

    console.log("actualizando status");
    const { fechaActual } = req.body;

    const fecha = new Date(fechaActual);
    // console.log("Fecha original:", fecha);

    const fechacorregida = fecha.setHours(fecha.getHours() - 5);
    // console.log("Fecha después de restar 5 horas:", fechacorregida);




    const data = await taskmodel.find({}).sort({ id: 1 })

    data.map(async (task) => {
        const fechainiciobd = new Date(task.inicioplan)
        const fechafinbd = new Date(task.finplan)
        const fechafrontend = new Date(fechacorregida)


        if (!task.inicioreal) {
            // console.log("No iniciado");

            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "No iniciado"
                }
            })
        }


        if (fechafrontend > fechainiciobd && task.avance > 0 && task.avance < 100) {
            // console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "En curso"
                }
            })
        }


        if (fechafrontend > fechainiciobd && task.avance === 0) {
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

    console.log(req.body);
    const { id, idtask, comentario, inicio, fin, avance, usuario, lastupdate, ActividadCancelada, vigente, Labor, NoLabor, estado } = req.body;

    // const formatearFecha = (fecha) => {
    //     if (!fecha) return null;
    //     const [fechaParte, horaParte] = fecha.split('T');
    //     const [anio, mes, dia] = fechaParte.split('-');
    //     const [hora, minutos] = horaParte.split(':');
    //     return `${dia}/${mes}/${anio}, ${hora}:${minutos}`;
    // };

    // const newinicio = formatearFecha(inicio);
    // const newfin = formatearFecha(fin);

    const data = await taskmodel.findByIdAndUpdate(id, {
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
            estado: estado
        }
    }, { new: true })

    const updated = await updatemodel.find({ idtask })

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
    res.status(200).json(data)
}

const getdatahistory = async (req, res) => {
    console.log("ejecutando get data history");
    const data = await updatemodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}

const deleteschedule = async (req, res) => {
    console.log("borrando todos los dato del cronograma");
    taskmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos del cronograma eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const deletehistorydata = async (req, res) => {
    console.log("borrando todos los dato del historial de actualización del cronograma");
    updatemodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos de actualización del cronograma eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const GetValidationData = async (req, res) => {
    console.log("ejecutando get data history");
    const datatask = await updatemodel.find({
        vigente: "Si"
    })
    const data = datatask.filter(item => item.Validado !== "Si")

    res.status(200).json({ data })
}

const UpdateValidation = async (req, res) => {
    console.log("ACtualización validación");
    console.log(req.body);
    const data = await updatemodel.findByIdAndUpdate(req.body._id, {
        $set: {
            Validado: "Si"
        }
    }, { new: true })
    console.log(data);
    res.status(200).json({ data })
}

const UpdateBaseLine = (req, res) => {

    console.log("ejecutando carga de datos");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {
        try {
            rowData.curva = 'Linea base'

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
                }
            })

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

const DeleteActivities = (req, res) => {

    console.log("ejecutando eliminación de actividades especificas");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {
        try {

            console.log(rowData.id);

        } catch (error) {
            console.error('Error al eliminar la actividad:', error);
        }
    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todas las actibidades ingresadas fueron eliminadas');
            res.status(200).json({ message: 'Datos eliminados de la base de datos' });
        })
        .catch((error) => {
            console.error('Error al eliminar los datos:', error);
            res.status(500).json({ error: 'Error al eliminar los datos' });
        })
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
}