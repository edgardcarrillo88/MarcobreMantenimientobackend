const mongoose = require('mongoose')

const dbconnect = (app) => {

    console.log("conectandose a mongodb");
    mongoose.connect(`mongodb+srv://CALA:${process.env.MONGO_DB_PASS}@cluster0.wxzehsb.mongodb.net/Project?retryWrites=true&w=majority`)
    .then((reuslt) => {
            const PORT = process.env.PORT || 4000
            app.listen(PORT, () => {
                console.log(`Servidor ${PORT}`)
            })

            console.log("Conexión exitosa a la base de datos")
        }
        )
        .catch((err) => console.log(err))
}

module.exports = dbconnect