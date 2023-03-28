const express = require("express");
const { dbConnection } = require("./database/config");

const cors = require("cors");
//require("dotenv").config({ path: "./config.env" });

require("dotenv").config();

// crear el servidor de express
const app = express();

// base de datos

dbConnection();

/// cors

app.use(cors());

// lectura y parseo del body

app.use(express.json());

//rutas

app.use("/api/auth", require("./routes/auth"));

app.use("/api/event", require("./routes/events"));

/// directorio publicoPORT=4000
app.use(express.static("public"));

/// escuchar peticion
// app.listen(process.env.PORT, () => {
//   console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
// });

const port = process.env.PORT || 4000;

app.listen(port);

console.log("App listen on Port   " + port);
