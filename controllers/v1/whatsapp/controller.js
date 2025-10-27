const axios = require("axios");
const userModel = require("../../../models/v1/users/users");

const token = process.env.WHATSAPP_VERIFY_TOKEN;
const whatsappEndpoint =
  "https://graph.facebook.com/v22.0/207032509162094/messages";
const accessToken = process.env.WHATSAPP_TOKEN;

const verifyWebhook = async (req, res) => {
  console.log("Holi");
  const mode = req.query["hub.mode"];
  const verify_token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && verify_token === token) {
    console.log("Verificación exitosa");
    return res.status(200).send(challenge);
  } else {
    console.log("Verificación fallida");
    return res.status(403).send({ Message: "Conexión fallida" });
  }
};

const receiveMessage = async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.entry) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);

    for (const entry of body.entry) {
      const changes = entry.changes;
      for (const change of changes) {
        const value = change.value;
        const message = value?.messages?.[0];
        const contact = value?.contacts?.[0];

        if (message || contact) {
          const mensaje = message.text?.body
            ? message.text.body
            : message.interactive?.button_reply?.id;
          console.log("-------");
          console.log("messaage: ", message);
          console.log("from: ", message.from);
          console.log(
            "Fecha y Hora: ",
            new Date(parseInt(message.timestamp) * 1000).toISOString()
          );
          console.log("mensaje: ", mensaje);
          console.log("contacto: ", contact.profile.name);
          console.log("wa_id: ", contact.wa_id);
          console.log("Type: ", message.type);
          console.log("-------");

          const response = await FunctionResponseMessage(
            message.from,
            mensaje,
            contact.profile.name,
            contact.wa_id,
            message.type
          );
        }
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

const Sendtemplate = async (req, res) => {
  console.log("Enviando plantilla");
  try {
    const to = req.body.phone.number; // Número destino
    const templateName = req.body.plantilla.anchorKey; // Nombre de plantilla configurada en Meta
    const language = "es_MX";

    const response = await WhatsappTemplate(to, templateName, language, []);
    console.log("Plantilla enviada");
    return res.status(200).send({ Message: "Plantilla enviada" });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ Message: error });
  }
};

const WhatsappTemplate = async (
  to,
  templateName,
  language,
  components = []
) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: language,
      },
      components,
    },
  };
  try {
    const response = await axios.post(whatsappEndpoint, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const FunctionResponseMessage = async (from, message, name, wa_id, type) => {

  console.log("Buscando celular registrado");
  const userresponse = await userModel.findOne({ celular: from });
  const empresa = userresponse?.empresa;
  console.log("Empresa: ", empresa);

  if (!userresponse) {
    console.log("Usuario no registrado");
    const NoAuthorizedPayload = {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        body: "Hola, no estas autorizado para consultar información, favor de solicitar acceso a través de Edgard Carrillo (9873329094)",
      },
    };

    const response = await axios.post(whatsappEndpoint, NoAuthorizedPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } else {
    const Mainpayload = {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: `¡Bienvenido ${name}! Selecciona una opción:` },
        header: {
          type: "image",
          image: {
            link: "https://media.istockphoto.com/id/1487215270/es/foto/analista-inform%C3%A1tico-que-trabaja-con-la-base-de-datos-de-informaci%C3%B3n-para-analizar-los-datos.jpg?b=1&s=612x612&w=0&k=20&c=rc3qyOHt-eap1Ap9GCsvRsrf2J33bL0ENjZpxTgS87c=",
          },
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: { id: "PdPMainOpcion1", title: "Parada de Planta" },
            },
            {
              type: "reply",
              reply: { id: "opcion2", title: "Indicadores Mantto" },
            },
            { type: "reply", reply: { id: "opcion3", title: "Costos Mantto" } },
          ],
        },
      },
    };

    const PdPpayload = {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: `${name}, Selecciona una opción:` },
        header: {
          type: "image",
          image: {
            link: "https://images.pexels.com/photos/3780477/pexels-photo-3780477.jpeg",
          },
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: { id: "PdPopcion1", title: "Reporte General" },
            },
            {
              type: "reply",
              reply: { id: "PdPopcion2", title: "Reporte Area" },
            },
            {
              type: "reply",
              reply: { id: "PdPopcion3", title: "Reporte Empresa" },
            },
          ],
        },
      },
    };

    const ListPayload = {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "📊 Reportes disponibles",
        },
        body: {
          text: "Selecciona una de las opciones para continuar:",
        },
        footer: {
          text: "Menú de reportes",
        },
        action: {
          button: "Ver opciones", // Texto del botón que abre la lista
          sections: [
            {
              title: "📂 Reportes",
              rows: [
                {
                  id: "PdPopcion1",
                  title: "Reporte General",
                  description: "Reporte global de la operación",
                },
                {
                  id: "PdPopcion2",
                  title: "Reporte Área",
                  description: "Reporte específico por área",
                },
                {
                  id: "PdPopcion3",
                  title: "Reporte Empresa",
                  description: "Reporte de toda la empresa",
                },
                {
                  id: "PdPopcion4",
                  title: "Menu Principal",
                  description: "Regresa al menú principal",
                },
              ],
            },
          ],
        },
      },
    };

    const payloads = {
      PdPMainOpcion1: {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: `${name}, Selecciona una opción:` },
          header: {
            type: "image",
            image: {
              link: "https://images.pexels.com/photos/3780477/pexels-photo-3780477.jpeg",
            },
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: { id: "PdPopcion1", title: "Reporte General" },
              },
              {
                type: "reply",
                reply: { id: "PdPopcion2", title: "Reporte Area" },
              },
              {
                type: "reply",
                reply: { id: "PdPopcion3", title: "Reporte Empresa" },
              },
            ],
          },
        },
      },

      opcion2: {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: "Aquí están los indicadores de mantenimiento 📊" },
      },
      opcion3: {
        messaging_product: "whatsapp",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: `${name}, Selecciona una opción:` },
          header: {
            type: "image",
            image: {
              link: "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg",
            },
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: { id: "KPIopcion1", title: "Status de partida" },
              },
              {
                type: "reply",
                reply: { id: "KPIopcion2", title: "Reporte Diario" },
              },
              {
                type: "reply",
                reply: { id: "KPIopcion3", title: "Reporte General" },
              },

            ],
          },
        },
      },
      PdPopcion1: {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: "Reporte General 📄" },
      },
      PdPopcion2: {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: "Reporte por Área 🏭" },
      },
      PdPopcion3: {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: "Reporte Empresa 🌎" },
      },
    };

    try {
      if (type === "text") {
        console.log("Respuesta a Mensaje de tipo text");
        const response = await axios.post(whatsappEndpoint, Mainpayload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response;
      }

      if (type === "interactive") {
        console.log("Respuesta a Mensaje interactivo");

        if (
          message.slice(0, 3) !== "PdP" &&
          empresa.toLowerCase() !== "marcobre"
        ) {
          console.log("Usuario no autorizado");
          const NoAuthorizedPayload = {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: {
              body: "Hola, no estas autorizado para revisar esta información",
            },
          };

          const response = await axios.post(
            whatsappEndpoint,
            NoAuthorizedPayload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else {
          const selectedPayload = payloads[message] || {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: "Opción no reconocida ❌" },
          };

          const response = await axios.post(whatsappEndpoint, selectedPayload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return response;
        }
      }
    } catch (error) {
      return error;
    }
  }
};

module.exports = {
  verifyWebhook,
  receiveMessage,
  Sendtemplate,
};
