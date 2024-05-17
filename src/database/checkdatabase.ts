import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";

export const checkDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log(
        "Database has been initialized and synchronized successfully."
      );
    } else {
      console.log("Database connection already established.");
    }

    // Verifica si la tabla 'user' ya existe
    const userRepository = AppDataSource.getRepository(User);
    const userTableExists = await userRepository.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='user';"
    );

    if (!userTableExists.length) {
      console.log("Creating 'user' table...");
      await userRepository.query(`
        CREATE TABLE user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nickname VARCHAR(40),
          nombre VARCHAR(40),
          apellido VARCHAR(40),
          direccion VARCHAR(40),
          email TEXT,
          password VARCHAR(150)
        );
      `);
      console.log("User table created successfully.");
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};
