import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./data-source";

dotenv.config();

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Connected to SQLite database successfully.");

    app.listen(app.get("port"), () => {
      console.log("Server on port", app.get("port"));
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
