import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define la interfaz IPayload para el payload del token JWT
export interface IPayload {
  _id: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const TokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json("Access Denied");
    const payload = jwt.verify(
      token,
      process.env["TOKEN_SECRET"] || ""
    ) as IPayload;
    req.userId = payload._id;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token");
  }
};
