import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as chatRouter } from "./routes/chat";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/error";
import { getConfig } from "./utils/config";

export const app = express();
dotenv.config();
const config = getConfig();

app.use(cors({ origin: config.corsOrigin, credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0" });
});

app.use("/chat", chatRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

// Ejecutar servidor solo cuando se ejecuta directamente, no en tests
if (typeof require !== "undefined" && require.main === module) {
  const host = "0.0.0.0"; // escuchar en todas las interfaces
  const server = app.listen(config.port, host, () => {
    const addr = server.address();
    if (typeof addr === "object" && addr) {
      console.log(`MiiA server running on http://${addr.address}:${addr.port}`);
    } else {
      console.log(`MiiA server running on port ${config.port}`);
    }
  });
}
