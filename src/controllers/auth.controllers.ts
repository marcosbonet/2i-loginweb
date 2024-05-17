import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpValidation, signinValidation } from "../libs/joi";
import { User } from "../entity/Users";
import { checkDatabase } from "../database/checkdatabase";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  checkDatabase();
  const { error } = signUpValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { nickname, nombre, apellido, direccion, email, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);

  try {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      nickname,
      nombre,
      apellido,
      direccion,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);

    return res.json({ message: "Usuario registrado correctamente" });
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

  const { email, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = bcrypt.compare(password, user.password!);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET || "");
    return res.json({ token, profile: user });
  } catch (e) {
    console.error("Error al iniciar sesión:", e);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
export const profile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // try {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  const payload = jwt.verify(token, process.env["TOKEN_SECRET"] || "") as {
    id: number;
    iat: number;
  };
  if (!payload)
    return res.status(404).json({ message: "Inicio de sesión requerido" });

  const userRepository = AppDataSource.getRepository(User);
  console.log(userRepository);
  const user = await userRepository.findOne({ where: { id: payload.id } });
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  return res.json(user);
  // } catch (error) {
  //   console.error("Error al obtener el perfil del usuario:", error);
  //   return res.status(500).json({ message: "Error interno del servidor" });
  // }
};
