import { Request, Response } from "express";
import { signup } from "./auth.controllers";
import { pool } from "../database";

jest.mock("../database", () => ({
  pool: {
    query: jest.fn().mockResolvedValue({
      rows: [{ id: 24 }], // Simula que ya existe un usuario con el mismo correo electrónico
    }),
  },
}));

describe("Auth controllers", () => {
  test("signup function should return a token when registering a new user", async () => {
    // Mock request and response objects
    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;
    const req = {
      body: {
        id: "testuser",
        nickname: "testuser",
        nombre: "testuser",
        apellido: "testuser",
        direccion: "testuser",
        email: email,
        password: "testuser",
      },
    } as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      header: jest.fn(),
    } as unknown as Response;

    // Call the signup function
    await signup(req, res);

    // Assert that the response contains a token
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    );
  });
});
