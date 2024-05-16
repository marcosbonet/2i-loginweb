import dotenv from "dotenv";
import app from "./app";
import sequelize from "./database"; // Cambiado a la configuración de SQLite

dotenv.config();

async function main() {
  try {
    await sequelize.authenticate(); // Verifica la conexión a la base de datos
    console.log("Connection to SQLite has been established successfully.");

    app.listen(app.get("port"), () => {
      console.log("Server on port", app.get("port"));
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
