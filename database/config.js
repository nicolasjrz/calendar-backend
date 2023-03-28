const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const dbConnection = async () => {
  try {
    console.log(process.env.DB_CNN);
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB ONLINE");
  } catch (error) {
    console.log(error);
    throw new Error("error a la hora de inicializar la base de datos");
  }
};

module.exports = { dbConnection };
