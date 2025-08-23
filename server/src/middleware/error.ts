import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Solicitud inválida", issues: err.errors });
  }
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Error interno del servidor" });
};
