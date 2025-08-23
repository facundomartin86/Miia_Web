import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router as chatRouter } from "./routes/chat";
import { errorHandler } from "./middleware/error";
import { getConfig } from "./utils/config";

const app = express();
const config = getConfig();

app.use(cors({ origin: config.corsOrigin, credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0" });
});

app.use("/chat", chatRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`MiiA server running on http://localhost:${config.port}`);
});
