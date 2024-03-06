const xlsx = require('xlsx');
const schedule = require('node-schedule');
const mongoose = require('mongoose')
const axios = require('axios')

const taskmodel = require('../models/task')
const updatemodel = require('../models/updates')
const Induccionmodel = require('../models/induccionPdP')
const PersonalContratistamodel = require('../models/personalcontratistas')

const failformmodel = require('../models/failform')
const dailyreportmodel = require('../models/dailyreport')

const polinestagmodel = require('../models/polinestag')
const polinesreportmodel = require('../models/polinesreport')

const baseindicadoresmodel = require('../models/baseindicadores')
const iw37nbasemodel = require('../models/iw37nbase')
const iw37nreportmodel = require('../models/iw37nreport')
const iw39reportmodel = require('../models/iw39report')



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
    const data = await polinesreportmodel.find({})
    res.status(200).json({ data })
}

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
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);



    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
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



    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
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



    const dataPromises = excelData.map(async (rowData) => {

        try {

            console.log("cargando datos");
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
    const data = await iw39reportmodel.find({})
    res.status(200).json(data)

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
                // const Objeto = coincidenciaAnterior[0];

                // // Verificar si el objeto ya ha sido creado anteriormente
                // const objetoRepetido = objetosCreados.find(obj =>
                //     obj.Tag === Objeto.Tag && obj.Ubicacion === Objeto.Ubicacion &&
                //     obj.Bastidor === Objeto.Bastidor && obj.Posicion === Objeto.Posicion
                // );

                // if (!objetoRepetido) {

                //     const nuevoObjeto = new polinesreportmodel({
                //         Tag: Objeto.Tag,
                //         Ubicacion: Objeto.Ubicacion,
                //         Bastidor: Objeto.Bastidor,
                //         Posicion: Objeto.Posicion,
                //         Fecha: today,
                //         Estado: Objeto.Posicion,
                //         TipoReporte: "Automático",
                //         Usuario: "Automático",
                //     });

                //     objetosCreados.push(Objeto);

                //     await nuevoObjeto.save();
                //     console.log('Se creó un nuevo objeto en la Base de Datos de reporte de polines:', nuevoObjeto);
                // } else {
                //     console.log('El objeto ya ha sido creado anteriormente:', objetoRepetido);
                // }

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

                // return nuevoObjeto.save().then(nuevoObjetoCreado => {
                //     console.log('Se creó un nuevo objeto en la Base de Datos de reporte de polines:', nuevoObjetoCreado);
                // }).catch(error => {
                //     console.error('Error al crear un nuevo objeto en la Base de Datos de reporte de polines:', error);
                // });
            } else {
                console.log('No se encontraron coincidencias en la Base de Datos de reporte de polines para el día anterior.');
                // return Promise.resolve(); // Resuelve la promesa si no hay coincidencias
            }
        }));

        // res.status(200).send('Proceso completado correctamente.');
        console.log('Proceso completado correctamente.');
    } catch (error) {
        console.error('Error en el proceso:', error);
        // res.status(500).send('Error en el servidor.');
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
        res.status(200).send({Message: "Registro realizado con éxito", Informacion: response.data})
        const Registro = new Induccionmodel({
            FechaInicio,
            FechaFin,
            dni: DNI,
            nombres:response.data.nombres,
            apellidoPaterno:response.data.apellidoPaterno,
            apellidoMaterno:response.data.apellidoMaterno,
        });
        await Registro.save();
        console.log("Registro realizado con éxito");
    } catch (error) {
        console.log("Error al realizar registro");
        res.status(404).send({Message: "Error al realizar registro"})
    }

}

const ObtenerRegistroInduccion = async (req,res) =>{

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

const ObtenerRegistroContratistas = async (req,res) =>{

    console.log("Obteniendo registros de inducción");
    const data = await PersonalContratistamodel.find({})
    res.status(200).json(data)

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
    RegistroInduccion,
    ObtenerRegistroInduccion,
    ObtenerRegistroContratistas,
    uploadexcelPersonalContratistas,

    getpolinesdata,
    deleteallpolines,
    DeletePolinesReport,
    registerpolines,
    getpolinesregisterdata,

    uploadexcelIndicadoresMantto,
    uploadexceliw37nbase,
    uploadexceliw37nreport,
    uploadexceliw39report,

    deleteallIndicadores,
    deleteallIW37nBase,
    deleteallIw37nreport,
    deleteallIW39,
    DeleteDataIW37nBase,

    getalldataIndicadores,
    getalldataIW37nBase,
    getalldataIW37nReport,
    getalldataIW39Report,

    pruebacronologica,
    prueba,
    borrandoDatosAutomaticos
}