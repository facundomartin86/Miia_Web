import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Solicitud inválida", issues: err.errors });
  }
  console.error("Unhandled error:", err);
  const isProd = process.env.NODE_ENV === "production";
  const payload: Record<string, unknown> = {
    message: "Error interno del servidor",
  };
  if (!isProd) {
    payload.detail = err?.message || String(err);
  }
  return res.status(500).json(payload);
};
