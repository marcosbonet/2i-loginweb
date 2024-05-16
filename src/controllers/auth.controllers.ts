import { Request, Response } from "express";
import sequelize from "../database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpValidation, signinValidation } from "../libs/joi";
type User = {
  id: number;
  nickname: string;
  nombre: string;
  apellido: string;
  direccion: string;
  email: string;
  password: string;
};

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error } = signUpValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const { nickname, nombre, apellido, direccion, email, password } = req.body;

  try {
    const users = "SELECT * FROM login ";
    const usersList = await sequelize.query(users);
    const user = usersList[0][usersList[0].length - 1] as User;
    if (user.email === email) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery =
      "INSERT INTO login (nickname, nombre, apellido, direccion, email, password) VALUES (?, ?, ?, ?, ?, ?) ";
    const response = await sequelize.query(insertUserQuery, {
      replacements: [
        nickname,
        nombre,
        apellido,
        direccion,
        email,
        hashedPassword,
      ],
    });

    return res.json({
      message: "Usuario registrado correctamente",
      response,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { error } = signinValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const { password } = req.body;
    const userQuery = "SELECT * FROM login";
    const users = await sequelize.query(userQuery);
    const user = users[0][users[0].length - 1] as User;

    if (users[0][users[0].length] === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token: string = jwt.sign(
      { id: user.id },
      process.env.TOKEN_SECRET || ""
    );
    const profile = user;
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
    const users = await sequelize.query("SELECT * FROM login ");
    console.log(users);
    const response = users[0][users[0].length - 1];
    return res.json(response);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
