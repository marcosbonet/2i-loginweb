import { Request, Response } from "express";
import { pool } from "../database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpValidation, signinValidation } from "../libs/joi";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error } = signUpValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message }); // Envía una respuesta de error con un mensaje JSON
  }
  const { nickname, nombre, apellido, direccion, email, password } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM login ");

    if (existingUser.rows[existingUser.rows.length - 1] === email) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await pool.query(
      "INSERT INTO login(nickname, nombre, apellido, direccion, email, password) VALUES ($1, $2, $3, $4, $5, $6) ",
      [nickname, nombre, apellido, direccion, email, hashedPassword]
    );
    const resp = response.rows;
    return res.json({
      message: "Usuario registrado correctamente",
      existingUser,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { error } = signinValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message }); // Envía una respuesta de error con un mensaje JSON
  }
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM login ");

    if (user.rows[user.rowCount! - 1].length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[user.rowCount! - 1].password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token: string = jwt.sign(
      { id: user.rows[0].id },
      process.env.TOKEN_SECRET || ""
    );
    const profile = user.rows;
    return res.json({ token, profile });
  } catch (e) {
    console.error("Error al iniciar sesión:", e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const profile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Acceso denegado" });
    const payload = jwt.verify(token, process.env["TOKEN_SECRET"] || "");
    if (!payload)
      return res.status(404).json({ message: "Inicio de sesión requerido" });
    const resp = await pool.query("SELECT * FROM login ");
    const response = resp.rows[resp.rowCount! - 1];
    return res.json(response);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
