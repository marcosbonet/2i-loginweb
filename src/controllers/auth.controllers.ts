import { Request, Response } from "express";
import { pool } from "../database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Obtener los datos del cuerpo de la solicitud
  const { nickname, nombre, apellido, direccion, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM login WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const response = await pool.query(
      "INSERT INTO login(nickname, nombre, apellido, direccion, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [nickname, nombre, apellido, direccion, email, hashedPassword]
    );

    const userId = response.rows[0].id;
    const user = response.rows;

    const token = jwt.sign({ id: userId }, "token", {
      expiresIn: "1d",
    });
    return res
      .header("auth-token", token)
      .json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM login WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token: string = jwt.sign(
      { id: user.rows[0].id },
      process.env.TOKEN_SECRET || ""
    );

    return res.header("auth-token", token).json({ token });
  } catch (e) {
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};
export const profile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Obtener el id del usuario desde req.userId
    const id = req.userId;

    // Consultar la base de datos para obtener el perfil del usuario
    const response = await pool.query("SELECT * FROM login WHERE id = $1", [
      id,
    ]);

    // Devolver el perfil del usuario como respuesta
    return res.json(response.rows);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json("Error interno del servidor");
  }
};
