//Librerias
const xlsx = require('xlsx');
const schedule = require('node-schedule');
const mongoose = require('mongoose')
const axios = require('axios')
const { S3, PutObjectCommand } = require('@aws-sdk/client-s3')
const { v4: uuidv4 } = require('uuid')


//Modelos Parada de Planta
const taskmodel = require('../models/task')
const updatemodel = require('../models/updates')
const Induccionmodel = require('../models/induccionPdP')
const PersonalContratistamodel = require('../models/personalcontratistas')
const EvaluacionPdPmodel = require('../models/evaluacionpdp')

//Modelos Reporte de Falla
const failformmodel = require('../models/failform')
const dailyreportmodel = require('../models/dailyreport')

//Modelos Reporte de Polines
const polinestagmodel = require('../models/polinestag')
const polinesreportmodel = require('../models/polinesreport')

//Modelos Indicadores de Mantenimiento
const baseindicadoresmodel = require('../models/baseindicadores')
const iw37nbasemodel = require('../models/iw37nbase')
const iw37nreportmodel = require('../models/iw37nreport')
const iw39reportmodel = require('../models/iw39report')
const iw29reportmodel = require('../models/iw29report')
const RosterModel = require('../models/roster')

//Modelos GestionAndamios
const EquiposPlantareportmodel = require('../models/EquiposPlanta')
const AndamiosReporte = require('../models/AndamiosReportes')
const AndamiosReporteHistorial = require('../models/AndamiosReportesHistorial')

//Modelos Backlog
const Backlogreportmodel = require('../models/BacklogReport');
const update = require('../models/updates');

//Modelos NCR
NCRReportModel = require('../models/NCR')



//Parada de Planta
const uploadexcel = (req, res) => {

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


        // console.log("-------");
        // console.log(task.id);
        // console.log(task.inicioreal);
        // console.log(!task.inicioreal);
        // console.log(task.avance===0);
        // console.log("-------");


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
    const { id, idtask, comentario, inicio, fin, avance, usuario, lastupdate, ActividadCancelada, vigente, Labor, NoLabor } = req.body;

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
            ActividadCancelada: ActividadCancelada,
            Labor: Labor,
            NoLabor: NoLabor
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

const TemporalParadaDePlanta = async (req, res) => {

    console.log("Borrando datos filtrados");


    try {
        await taskmodel.deleteMany({
            BloqueRC: "Cambio Liners"
        });

        // const data = await taskmodel.find({
        //     BloqueRC: "Cambio Liners"
        // })
        // console.log(data.length);


        console.log("Ok");
        res.status(200).send('Datos eliminados');

    } catch (error) {
        console.log(error);
    }

}





//Reporte  de Falla
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




//Reporte de Polines

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

const getpolinesdata = async (req, res) => {
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

const DeletePolinesReport = async (req, res) => {
    console.log("borrando todos los reportes de polines");
    polinesreportmodel.deleteMany({})
        .then(() => {
            console.log('Todos los reportes de polines eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const registerpolines = async (req, res) => {

    console.log("ejecutando registro de inspección de polines");

    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    let files = [];
    if (req.files && req.files.files) {
        const files = req.files.files.map(file => {
            return {
                data: file.buffer,
                contentType: file.mimetype
            };
        });
    }

    const initialData = JSON.parse(req.body.initaldata);
    console.log(initialData);

    try {
        for (const data of initialData) {
            const polinesData = {
                Tag: data.Tag,
                Ubicacion: data.Ubicacion,
                Bastidor: data.Bastidor,
                Posicion: data.Posicion,
                Estado: data.Estado,
                Descripcion: data.Descripcion,
                Reportante: data.Reportante,
                Fecha: Date(data.Fecha),
                TipoReporte: data.TipoReporte,
                Usuario: data.Usuario,
                photos: files
            };

            const dataPrincipal = new polinesreportmodel(polinesData);
            await dataPrincipal.save();

        }

        res.status(200).json({ success: true, message: "Datos de polines registrados correctamente" });

    } catch (error) {
        console.error('Error al registrar datos de polines:', error);
        res.status(500).json({ success: false, message: "Error al registrar datos de polines" });
    }

}

const getpolinesregisterdata = async (req, res) => {
    console.log("ejecutando request getpolinesregister");
    // const data = await polinesreportmodel.find({})
    // res.status(200).json({ data })


    try {
        //const batchSize = 1000; // Tamaño del lote

        // Establecemos el encabezado Content-Type como JSON
        res.setHeader('Content-Type', 'application/json');

        res.write('['); // Comenzamos el arreglo JSON

        let isFirst = true; // Para determinar si es el primer elemento del arreglo

        //let skip = 0;

        const cursor = polinesreportmodel.find({})
            .select('Tag Ubicacion Bastidor Posicion Fecha Estado Descripcion TipoReporte Usuario')
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
        });

        cursor.on('end', () => {
            res.write(']'); // Finalizamos el arreglo JSON
            res.end(); // Finalizamos la respuesta
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

const GetPOlinesReportStream = async (req, res) => {

    console.log("ejecutando request getpolinesregister");

    try {
        let skip = 0;
        const batchSize = 1000; // Tamaño del lote

        let documentsProcessed = 0;

        // Establecemos el encabezado Content-Type como JSON
        res.setHeader('Content-Type', 'application/json');

        res.write('['); // Comenzamos el arreglo JSON

        let isFirst = true; // Para determinar si es el primer elemento del arreglo

        while (true) {
            const data = await polinesreportmodel.find({})
                .select('Tag Ubicacion Bastidor Posicion Fecha Estado Descripcion TipoReporte Usuario')
                .skip(skip)
                .limit(batchSize)

            if (data.length === 0) {
                // Si no hay más documentos, salir del bucle
                break;
            }

            // Envía los datos al cliente línea por línea en formato JSON
            data.forEach(item => {
                if (!isFirst) {
                    res.write(','); // Agregamos una coma si no es el primer elemento
                } else {
                    isFirst = false;
                }
                // res.write(JSON.stringify({ data: item }));
                res.write(JSON.stringify({ item }));
                console.log(documentsProcessed);
                documentsProcessed++;
            });

            // Si se ha procesado un lote completo, continuar con el siguiente
            skip += batchSize;


        }

        res.write(']'); // Finalizamos el arreglo JSON
        res.end(); // Finalizamos la respuesta

        console.log(`Se procesaron ${documentsProcessed} documentos.`);

    } catch (error) {
        console.error('Error al leer los datos:', error);
        res.status(500).json({ error: 'Ocurrió un error al leer los datos.' });
    }

}

const GetPOlinesReportStreamDos = async (req, res) => {

    console.log("ejecutando request getpolinesregister");

    try {
        //const batchSize = 1000; // Tamaño del lote

        // Establecemos el encabezado Content-Type como JSON
        res.setHeader('Content-Type', 'application/json');

        res.write('['); // Comenzamos el arreglo JSON

        let isFirst = true; // Para determinar si es el primer elemento del arreglo

        //let skip = 0;

        const cursor = polinesreportmodel.find({})
            .select('Tag Ubicacion Bastidor Posicion Fecha Estado Descripcion TipoReporte Usuario')
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
        });

        cursor.on('end', () => {
            res.write(']'); // Finalizamos el arreglo JSON
            res.end(); // Finalizamos la respuesta
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

const pruebacronologica = (req, res) => {

    // // Cada segundo
    // const rule = new schedule.RecurrenceRule()
    // rule.second = new schedule.Range(0,59)

    // const job = schedule.scheduleJob(rule, function(){
    //     console.log("Función programada");
    // })

    const rule = new schedule.RecurrenceRule();
    rule.tz = 'America/Bogota'; // Establece la zona horaria UTC-5 (Bogotá)
    rule.hour = 0; // Hora (en UTC-5)
    rule.minute = 1; // Minuto
    rule.second = 0; // Segundo

    const job = schedule.scheduleJob(rule, async function () {
        console.log("Función programada para ejecutarse todos los días a las 00:01 UTC-5");
        prueba(req, res)
    });


}

const prueba = async (req, res) => {

    try {

        const objetosCreados = [];

        const today = new Date();
        today.setDate(today.getDate() - 1);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        console.log(today);
        console.log(yesterday);

        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const YesterdaystartOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const YesterdayendOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);

        const BasePolines = await polinestagmodel.find();

        // Consultas de coincidencias del día actual y anterior en paralelo
        const [coincidenciasDelDia, coincidenciasAyer] = await Promise.all([
            polinesreportmodel.find({
                Fecha: { $gte: startOfDay, $lt: endOfDay },
                $or: BasePolines.map(({ Tag, Ubicacion, Bastidor, Posicion }) => ({ Tag, Ubicacion, Bastidor, Posicion }))
            }),
            polinesreportmodel.find({
                Fecha: { $gte: YesterdaystartOfDay, $lt: YesterdayendOfDay },
                $or: BasePolines.map(({ Tag, Ubicacion, Bastidor, Posicion }) => ({ Tag, Ubicacion, Bastidor, Posicion }))
            })
        ]);

        // Procesamiento de las coincidencias
        await Promise.all(BasePolines.map(async docN1 => {
            const { Tag, Ubicacion, Bastidor, Posicion } = docN1;

            // Procesamiento de coincidencias del día actual
            const CoincidenciaDelDia = coincidenciasDelDia.filter(coincidencia =>
                coincidencia.Tag === Tag && coincidencia.Ubicacion === Ubicacion &&
                coincidencia.Bastidor === Bastidor && coincidencia.Posicion === Posicion
            );

            // Procesamiento de coincidencias del día anterior
            const coincidenciaAnterior = coincidenciasAyer.filter(coincidencia =>
                coincidencia.Tag === Tag && coincidencia.Ubicacion === Ubicacion &&
                coincidencia.Bastidor === Bastidor && coincidencia.Posicion === Posicion
            );

            // Manejo de coincidencias del día anterior
            if (CoincidenciaDelDia.length === 0 && coincidenciaAnterior.length !== 0) {


                const nuevosObjetos = coincidenciaAnterior.map(Objeto => {
                    // Verificar si el objeto ya ha sido creado anteriormente
                    const objetoRepetido = objetosCreados.find(obj =>
                        obj.Tag === Objeto.Tag && obj.Ubicacion === Objeto.Ubicacion &&
                        obj.Bastidor === Objeto.Bastidor && obj.Posicion === Objeto.Posicion && obj.Estado === Objeto.Estado
                    );

                    if (!objetoRepetido) {
                        const nuevoObjeto = {
                            Tag: Objeto.Tag,
                            Ubicacion: Objeto.Ubicacion,
                            Bastidor: Objeto.Bastidor,
                            Posicion: Objeto.Posicion,
                            Fecha: today,
                            Estado: Objeto.Estado,
                            TipoReporte: "Automático",
                            Usuario: "Automático",
                        };

                        objetosCreados.push(nuevoObjeto); // Agregar nuevo objeto al array objetosCreados

                        return nuevoObjeto;
                    }
                }).filter(objeto => objeto); // Filtrar los objetos que no son nulos

                if (nuevosObjetos.length > 0) {
                    // Guardar los nuevos objetos en la base de datos
                    await polinesreportmodel.insertMany(nuevosObjetos);
                    console.log('Se crearon nuevos objetos en la Base de Datos de reporte de polines:', nuevosObjetos);
                } else {
                    console.log('Todos los objetos ya han sido creados anteriormente.');
                }


            } else {
                console.log('No se encontraron coincidencias en la Base de Datos de reporte de polines para el día anterior.');
            }
        }));

        BasePolines.forEach(async (item) => {
            item.Estado = "";
            await item.save();
        });





        console.log('Proceso completado correctamente.');

    } catch (error) {
        console.error('Error en el proceso:', error);
    }
}

const borrandoDatosAutomaticos = async (req, res) => {

    console.log("Borrando todos los polines con TipoReporte igual a 'Automático'");
    try {
        await polinesreportmodel.deleteMany({ TipoReporte: 'Automático' });
        console.log('Todos los polines con TipoReporte igual a "Automático" han sido eliminados correctamente');
        res.status(200).send('Todos los polines con TipoReporte igual a "Automático" han sido eliminados correctamente');
    } catch (error) {
        console.error('Error al eliminar documentos:', error);
        res.status(500).send('Error al eliminar documentos');
    }

}

const CambioPolines = async (req, res) => {

    console.log("ejecutando registro de cambio de polines");

    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    let files = [];
    if (req.files && req.files.files) {
        const files = req.files.files.map(file => {
            return {
                data: file.buffer,
                contentType: file.mimetype
            };
        });
    }

    // const initialData = JSON.parse(req.body.initaldata);
    // console.log(initialData);

    try {
        for (const data of req.body) {
            const polinesData = {
                Tag: data.Tag,
                Ubicacion: data.Ubicacion,
                Bastidor: data.Bastidor,
                Posicion: data.Posicion,
                Estado: "Cambio",
                _id: data._id
            };

            // const dataPrincipal = new polinestagmodel(polinesData);
            console.log(polinesData._id);
            const dataPrincipal = await polinestagmodel.findByIdAndUpdate(polinesData._id, {
                $set: {
                    Estado: "Cambio"
                }
            }, { new: true });
            console.log(dataPrincipal);
            // await dataPrincipal.save();

        }

        res.status(200).json({ success: true, message: "Datos de polines registrados correctamente" });

    } catch (error) {
        console.error('Error al registrar datos de polines:', error);
        res.status(500).json({ success: false, message: "Error al registrar datos de polines" });
    }

}

const GetLastPolinesReport = async (req, res) => {

    console.log("ejecutando request de ultimo reporte");

    const LastDate = new Date();
    LastDate.setDate(LastDate.getDate());
    LastDate.setHours(0, 0, 0, 0);

    const LastTwoDate = new Date();
    LastTwoDate.setDate(LastTwoDate.getDate() - 1);
    LastTwoDate.setHours(0, 0, 0, 0);

    const data = await polinesreportmodel.find({
        Fecha: { $lt: LastDate, $gt: LastTwoDate },
    })

    // const LastDateData = data.data.data.filter(object => {
    //     const ObjectDate = new Date(object.Fecha)

    //     return ObjectDate < LastDate && object.Bastidor === "1" && object.Tag === "3232-CV-315" && object.Ubicacion === "Carga"
    // })

    console.log(data);
    res.status(200).json({ data })

}




//Reporte de Indicadores de Mantenimiento
const uploadexcelIndicadoresMantto = (req, res) => {

    console.log("ejecutando carga de datos de indicadores mantto");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);



    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            const data = new baseindicadoresmodel(rowData);
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

const uploadexceliw37nbase = (req, res) => {

    console.log("ejecutando carga de datos iw37nbase");
    console.log(req.file);
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const hoy = new Date();

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo - 1;
    }

    const numeroDeSemana = getWeekNumber(hoy);

    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            rowData.Semana = numeroDeSemana;
            const data = new iw37nbasemodel(rowData);
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

const uploadexceliw37nreport = (req, res) => {

    console.log("ejecutando carga de datos de IW37nReport");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const hoy = new Date();

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo - 1;
    }

    const numeroDeSemana = getWeekNumber(hoy);

    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            rowData.Semana = numeroDeSemana;
            const data = new iw37nreportmodel(rowData);
            await data.save();

        } catch (error) {
            console.error('Error al guardar el dato:', error);
        }

    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos guardados de IW37nReport en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}

const uploadexceliw39report = (req, res) => {

    console.log("ejecutando carga de datos de iw39report");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const hoy = new Date();

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo - 1;
    }

    const numeroDeSemana = getWeekNumber(hoy);

    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            rowData.Semana = numeroDeSemana;
            const data = new iw39reportmodel(rowData);
            await data.save();

        } catch (error) {
            console.error('Error al guardar el dato:', error);
        }

    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos de iw39report guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}

const uploadexceliw29report = (req, res) => {

    console.log("ejecutando carga de datos de iw29report");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const hoy = new Date();

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo - 1;
    }

    const numeroDeSemana = getWeekNumber(hoy);

    const dataPromises = excelData.map(async (rowData) => {

        try {
            console.log("cargando datos");
            rowData.Semana = numeroDeSemana;
            const data = new iw29reportmodel(rowData);
            await data.save();

        } catch (error) {
            console.error('Error al guardar el dato:', error);
        }

    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos de iw29report guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}

const uploadexcelroster = async (req, res) => {

    console.log("borrando todos los datos del Roster");
    await RosterModel.deleteMany({})


    console.log("ejecutando carga de datos de Roster");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            const data = new RosterModel(rowData);
            await data.save();

        } catch (error) {
            console.error('Error al guardar el dato:', error);
        }

    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos del Roster guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })

}

const deleteallIndicadores = async (req, res) => {
    console.log("borrando todos los datos de indicadores");
    baseindicadoresmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos de indicadores eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const deleteallIW37nBase = async (req, res) => {
    console.log("borrando todos los datos de Iw37n Base");
    iw37nbasemodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos de Iw37n Base eliminados correctamente');
            res.status(200).json({ Message: "Ok" })
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const deleteallIw37nreport = async (req, res) => {
    console.log("borrando todos los datos de IW37n Report");
    iw37nreportmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos de IW37n Report eliminados correctamente');
            res.status(200).send("Todos los datos de IW37n Report eliminados correctamente")
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const deleteallIW39 = async (req, res) => {
    console.log("borrando todos los datos de IW39");
    iw39reportmodel.deleteMany({})
        .then(() => {
            console.log('Todos los datos de IW39 eliminados correctamente');
            res.status(200).send('Todos los datos de IW39 eliminados correctamente')
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}

const getalldataIndicadores = async (req, res) => {

    console.log("ejecutando get all data de Indicadores");
    const data = await baseindicadoresmodel.find({})
    res.status(200).json(data)

}

const getalldataIW37nBase = async (req, res) => {

    console.log("ejecutando get all data de IW37nBase");
    const data = await iw37nbasemodel.find({})
    res.status(200).json(data)

}

const DeleteDataIW37nBase = async (req, res) => {
    console.log("Borrando los datos del IW37N Base");
    try {
        await iw37nbasemodel.deleteMany({ "Revisión": 'SEM09-24' });
        console.log('Todos los datos de la semana borrados');
        res.status(200).send('Todos los datos de la semana borrados');
    } catch (error) {
        console.error('Error al eliminar documentos:', error);
        res.status(500).send('Error al eliminar documentos');
    }
}

const getalldataIW37nReport = async (req, res) => {

    console.log("ejecutando get all data de IW37nReport");
    const data = await iw37nreportmodel.find({})
    res.status(200).json(data)

}

const getalldataIW39Report = async (req, res) => {

    console.log("ejecutando get all data de IW39Report");
    // const data = await iw39reportmodel.find({})
    // res.status(200).json(data)



    try {

        res.setHeader('Content-Type', 'application/json');

        res.write('[');

        let isFirst = true;

        const cursor = iw39reportmodel.find({})
            .lean()
            .cursor();

        cursor.on('data', (item) => {
            if (!isFirst) {
                res.write(',');
            } else {
                isFirst = false;
            }
            res.write(JSON.stringify(item));
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

const getalldataIW29Report = async (req, res) => {

    console.log("ejecutando get all data de IW29Report");
    // const data = await iw39reportmodel.find({})
    // res.status(200).json(data)



    try {

        res.setHeader('Content-Type', 'application/json');

        res.write('[');

        let isFirst = true;

        const cursor = iw29reportmodel.find({})
            .lean()
            .cursor();

        cursor.on('data', (item) => {
            if (!isFirst) {
                res.write(',');
            } else {
                isFirst = false;
            }
            res.write(JSON.stringify(item));
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

const updatetempReportIndicadores = async (req, res) => {
    console.log("Actualización de objetos");

    // const iw37nbasemodel = require('../models/iw37nbase')
    // const iw37nreportmodel = require('../models/iw37nreport')
    // const iw39reportmodel = require('../models/iw39report')


    const hoy = new Date();

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo - 2;
    }

    const numeroDeSemana = getWeekNumber(hoy);

    try {
        const data = await iw39reportmodel.updateMany(
            {},
            { $set: { Semana: numeroDeSemana } }
        );
        res.status(200).json({ Message: "Oki doki de indicadores", semana: numeroDeSemana })
        console.log("Objetos actualizados");
    } catch (error) {
        res.status(500).json({ Message: "Error al actualizar los indicadores", error: error.message })
    }
}


const TemporalEliminarSemana = async (req, res) => {

    console.log("Borrando datos filtrados");
    console.log(req.query.Mes);
  
  
    try {
  
      await iw39reportmodel.deleteMany({
        Semana: { $gte: req.query.Mes },
        // Especialidad: "Parada de Planta"
      });
  
      console.log("Ok");
      res.status(200).send('Todos los datos iw39 eliminados correctamente');
  
    } catch (error) {
      console.log(error);
    }
  
  }




//Inducción Parada de Planta
const RegistroInduccion = async (req, res) => {

    console.log(req.body);
    const { FechaInicio, FechaFin, DNI } = req.body
    const apiUrl = `${process.env.API_URL}${DNI}`

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN_DNI}`
            }
        })
        console.log(response.data);
        res.status(200).send({ Message: "Registro realizado con éxito", Informacion: response.data })
        const Registro = new Induccionmodel({
            FechaInicio,
            FechaFin,
            dni: DNI,
            nombres: response.data.nombres,
            apellidoPaterno: response.data.apellidoPaterno,
            apellidoMaterno: response.data.apellidoMaterno,
        });
        await Registro.save();
        console.log("Registro realizado con éxito");
    } catch (error) {
        console.log("Error al realizar registro");
        res.status(404).send({ Message: "Error al realizar registro" })
    }

}

const ObtenerRegistroInduccion = async (req, res) => {

    console.log("Obteniendo registros de inducción");
    const data = await Induccionmodel.find({})
    res.status(200).json(data)

}

const uploadexcelPersonalContratistas = (req, res) => {

    console.log("ejecutando carga de datos de personal de contratistas");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);



    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            const data = new PersonalContratistamodel(rowData);
            await data.save();

        } catch (error) {
            console.error('Error al guardar el dato:', error);
        }

    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos guardados de Personal contratista en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}

const ObtenerRegistroContratistas = async (req, res) => {

    console.log("Obteniendo registros de inducción");
    const data = await PersonalContratistamodel.find({})
    res.status(200).json(data)

}

const EvaluacionPdP = async (req, res) => {
    console.log("Guardando respuesta de evaluación");
    console.log(req.body);
    const DNI = req.body.answers.DNI
    const apiUrl = `${process.env.API_URL}${DNI}`

    try {

        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN_DNI}`
            }
        })
        console.log(response.data);


        if (response.data.success) {
            req.body.answers.Nombre = `${response.data.nombres} ${response.data.apellidoPaterno} ${response.data.apellidoMaterno}`;
        } else {
            console.log("Error");
            //return res.status(400).json({ message: "No se encontró información válida para el DNI proporcionado" });
        }

        const data = new EvaluacionPdPmodel({
            answer: req.body.answers,
            Nota: req.body.score,
        });


        await data.save();
        res.status(200).json({ message: "Datos guardados de manera satisfactoria", Informacion: req.body.answers.Nombre })
        console.log("Correcto");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error al guardar la información" })
    }


}

const ObtenerDatosEvaluacionPdP = async (req, res) => {
    console.log("obteniendo datos de evaluaciones");

    try {
        const response = await EvaluacionPdPmodel.find({})
        res.status(200).json({ Message: "Todo Oki doki", data: response })
    } catch (error) {
        res.status(500).json({ Message: error })
    }
}


//Reporte Backlog

const CrearPreAviso = async (req, res) => {
    console.log("Creando pre aviso");
    console.log(req.body);

    try {
        const data = new Backlogreportmodel(
            req.body
        );

        await data.save();
        console.log("Todo OK");
        res.status(200).json({ message: "Todo Ok" })
    } catch (error) {
        console.log("Error");
        res.status(500).json({ message: "Nada Ok" })
    }
}

const GuardarImagenPreAviso = async (req, res) => {

    try {
        const file = req.file;
        console.log(file)

        const endpoint = 'https://nyc3.digitaloceanspaces.com'


        const s3Client = new S3({
            forcePathStyle: false,
            endpoint: endpoint,
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY,
                secretAccessKey: process.env.DIGITAL_OCEAN_SECRET_KEY
            }
        })

        const fileextension = file.originalname.split(".").pop()
        console.log(`${uuidv4()}.${fileextension}`);

        const bucketparams = {
            Bucket: 'mantenimientomarcobre',
            Key: `${uuidv4()}.${fileextension}`,
            Body: file.buffer,
            ACL: 'public-read',
        }

        const result = await s3Client.send(new PutObjectCommand(bucketparams))

        res.status(200).json({ Message: "Oki doki" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error })
    }

}





//Reporte de andamios
const Temporal = async (req, res) => {

    console.log("holi boli");
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
            // const data = new EquiposPlantareportmodel(rowData);
            const data = new NCRReportModel(rowData)
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

const GetEquiposPlanta = async (refq, res) => {
    console.log("ejecutando get all data de Equipos Planta");
    const data = await EquiposPlantareportmodel.find({})
    res.status(200).json(data)
}

const getalldataandamios = async (req, res) => {
    console.log("ejecutando Get all data andamios");

    try {
        const data = await AndamiosReporte.find({})
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error })
    }
}

const RegistrarAndamios = async (req, res) => {
    console.log("Ejecutando guardar reporte andamios");

    console.log(req.body);
    try {

        const data = new AndamiosReporte(
            req.body
        );

        const datahistorial = new AndamiosReporteHistorial(
            req.body
        );

        await data.save();
        await datahistorial.save();
        res.status(200).json({ Message: "todo ok" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Error al guardar" })
    }

}

const GetSingleDataAndamios = async (req, res) => {
    console.log("ejecutando get single datos andamios");

    try {
        const _id = req.query.id
        console.log(_id);
        const data = await AndamiosReporte.find({
            _id
        })
        console.log(data);
        const { __v, deleted, createdAt, updatedAt, ...rest } = data[0]._doc;
        console.log("----");
        console.log(rest);
        res.status(200).json({ data: rest, update: "SI" })
    } catch (error) {
        const data = []
        console.log("Respondiendo con error");
        res.status(200).json({ data, update: "NO" })
    }
}

const ActualizarAndamios = async (req, res) => {
    console.log("Ejecutando actualización de reporte andamios");

    console.log(req.body);

    const {
        Planta,
        Area,
        TAG,
        Responsable,
        Fecha,
        Detalle,
        Status,
        CantidadCuerpos,
        _id
    } = req.body

    console.log(_id);

    try {

        const data = await AndamiosReporte.findByIdAndUpdate(_id, {
            $set: {
                Planta,
                Area,
                TAG,
                Responsable,
                Fecha,
                Detalle,
                Status,
                CantidadCuerpos,
            }
        }, { new: true })

        const { _id: ignored, ...rest } = req.body;

        const datahistorial = new AndamiosReporteHistorial({
            ...rest,
            idAndamio: _id,
            updatedAt: new Date()
        });

        await datahistorial.save();
        res.status(200).json({ Message: "todo ok" })

    } catch (error) {

        console.log(error);
        res.status(500).json({ Message: "Error al guardar" })

    }
}


//Gestion NCR

const GetSingleDataNCR = async (req, res) => {
    console.log("Ejecutando Get single Data NCR");
    try {
        const _id = req.query.id
        console.log(_id);
        const data = await NCRReportModel.find({
            _id
        })
        console.log(data);
        const { __v, deleted, createdAt, updatedAt, ...rest } = data[0]._doc;
        console.log("----");
        console.log(rest);
        res.status(200).json({ data: rest, update: "SI" })
    } catch (error) {
        res.status(500).json({ Message: error })
    }
}


const CrearNCR = async (req, res) => {
    console.log("Ejecutando crear NCR");
    try {
        res.status(200).json({ Message: "Todo ok" })
    } catch (error) {
        res.status(500).json({ Message: error })
    }
}


const GetAllDataNCR = async (req, res) => {
    console.log("Ejecutando Get all Data NCR");
    try {
        const data = await NCRReportModel.find({})
        console.log(data);
        res.status(200).json({ Message: "Todo ok", data })
    } catch (error) {
        res.status(500).json({ Message: error })
    }
}

module.exports = {
    Temporal,
    GetEquiposPlanta,

    registerform,
    getalldata,
    getsingledata,
    getfiltersdata,

    CrearPreAviso,
    GuardarImagenPreAviso,

    getalldataandamios,
    RegistrarAndamios,
    GetSingleDataAndamios,
    ActualizarAndamios,

    CrearNCR,
    GetAllDataNCR,
    GetSingleDataNCR,

    getscheduledata,
    deleteschedule,
    deletehistorydata,
    statusupdate,
    uploadexcel,
    filtereddata,
    dailyreport,
    getalldatadailyreport,
    updatedata,
    getdatahistory,
    uploadexcelTemp,
    GetValidationData,
    UpdateValidation,
    UpdateBaseLine,
    DeleteActivities,

    RegistroInduccion,
    ObtenerRegistroInduccion,
    ObtenerRegistroContratistas,
    uploadexcelPersonalContratistas,

    getpolinesdata,
    deleteallpolines,
    DeletePolinesReport,
    registerpolines,
    getpolinesregisterdata,
    CambioPolines,
    GetLastPolinesReport,
    GetPOlinesReportStream,
    GetPOlinesReportStreamDos,

    uploadexcelIndicadoresMantto,
    uploadexceliw37nbase,
    uploadexceliw37nreport,
    uploadexceliw39report,
    uploadexceliw29report,
    uploadexcelroster,

    deleteallIndicadores,
    deleteallIW37nBase,
    deleteallIw37nreport,
    deleteallIW39,
    DeleteDataIW37nBase,

    getalldataIndicadores,
    getalldataIW37nBase,
    getalldataIW37nReport,
    getalldataIW39Report,
    getalldataIW29Report,
    TemporalEliminarSemana,    

    pruebacronologica,
    prueba,
    borrandoDatosAutomaticos,

    EvaluacionPdP,
    TemporalParadaDePlanta,
    ObtenerDatosEvaluacionPdP,
    updatetempReportIndicadores
}