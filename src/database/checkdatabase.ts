import { pool } from "../database";

export const checkDatabase = async () => {
  try {
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'login'
      );
    `;
    const tableExists = await pool.query(checkTableQuery);

    if (!tableExists.rows[0].exists) {
      const createDataBase = `CREATE DATABASE logindatabase;
      `;
      const createTableQuery = `
        CREATE TABLE login (
          id SERIAL PRIMARY KEY,
          nickname VARCHAR(40),
          nombre VARCHAR(40),
          apellido VARCHAR(40),
          direccion VARCHAR(40),
          email TEXT,
          password VARCHAR(150)
        );
      `;
      await pool.query(createDataBase);
      await pool.query(createTableQuery);
    }
  } catch (error) {
    console.error("Error al verificar y/o crear la tabla:", error);
    throw error;
  }
};
