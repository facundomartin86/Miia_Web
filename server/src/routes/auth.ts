import { Router } from "express";
import { z } from "zod";

export const authRouter = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Mock login: acepta admin/miia2025 y devuelve token fijo
authRouter.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Body inválido" });
  }
  const { username, password } = parsed.data;
  if (username === "admin" && password === "miia2025") {
    return res.json({
      token: "mock-token",
      user: { id: "1", username: "admin", name: "Usuario Principal" },
    });
  }
  return res.status(401).json({ message: "Credenciales inválidas" });
});

// Mock me: si hay Authorization, devuelve usuario fijo
authRouter.get("/me", (req, res) => {
  const auth = req.header("authorization") || req.header("Authorization");
  if (!auth) {
    return res.status(401).json({ message: "No autorizado" });
  }
  return res.json({
    user: { id: "1", username: "admin", name: "Usuario Principal" },
  });
});
