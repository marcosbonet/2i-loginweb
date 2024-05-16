import sequelize from "../database";

export const checkDatabase = async () => {
  try {
    const checkTableQuery = `
      SELECT name FROM sqlite_master WHERE type='table' AND name='login';
    `;
    const [results] = await sequelize.query(checkTableQuery);

    if (results.length === 0) {
      const createTableQuery = `
        CREATE TABLE login (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nickname VARCHAR(40),
          nombre VARCHAR(40),
          apellido VARCHAR(40),
          direccion VARCHAR(40),
          email TEXT,
          password VARCHAR(150)
        );
      `;
      await sequelize.query(createTableQuery);
    }
  } catch (error) {
    console.error("Error al verificar y/o crear la tabla:", error);
    throw error;
  }
};
