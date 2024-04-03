const nodemailer = require('nodemailer');

const SendMessage = (req,res) =>{

    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: "edgard.carrilloi@marcobre.com",
          pass: "sgbycwlhbckcycyc",
        },
      });

      const mailOptions = {
        from: 'edgard.carrilloi@marcobre.com', // Debe ser la misma dirección de correo configurada arriba
        to: 'edgard.carrilloi@marcobre.com', // Reemplaza con la dirección de correo del destinatario
        subject: 'Correo de prueba Nodejs',
        text: 'Contenido del correo electrónico'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Correo electrónico enviado: ' + info.response);
        }
      });

}


module.exports = {
SendMessage
}