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
    return res.status(400).json(error.message);
  }
  const { nickname, nombre, apellido, direccion, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM login WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .send(existingUser.rows)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await pool.query(
      "INSERT INTO login(nickname, nombre, apellido, direccion, email, password) VALUES ($1, $2, $3, $4, $5, $6) ",
      [nickname, nombre, apellido, direccion, email, hashedPassword]
    );
    const resp = response.rows;
    return res.status(200).json({
      message: "Usuario registrado correctamente",
      resp,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { error } = signinValidation(req.body);
  if (error) {
    return res.status(400).json(error.message);
  }
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM login ");
    console.log(user);
    if (user.rows.length === 0) {
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
    console.log(e);
    return res.status(500).json("Internal server error");
  }
};

export const profile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json("Access Denied");
    const payload = jwt.verify(token, process.env["TOKEN_SECRET"] || "");
    if (!payload) return res.status(404).json("Login required");
    const resp = await pool.query("SELECT * FROM login ");
    const response = resp.rows[resp.rowCount! - 1];
    return res.json(resp);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json("Error interno del servidor");
  }
};
