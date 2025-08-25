export function getConfig() {
  const port = Number(process.env.PORT || 4000);
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"; // Vite dev
  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
  const ollamaFallbackModel =
    process.env.OLLAMA_FALLBACK_MODEL || "llama3.1:8b-instruct";

  const routerGeneralModel =
    process.env.ROUTER_GENERAL_MODEL || "qwen2.5:7b-instruct";

  const numPredictRaw = process.env.OLLAMA_NUM_PREDICT;
  const temperatureRaw = process.env.OLLAMA_TEMPERATURE;
  const topPRaw = process.env.OLLAMA_TOP_P;
  const keepAlive = process.env.OLLAMA_KEEP_ALIVE || "5m";

  const numPredict = numPredictRaw ? Number(numPredictRaw) : undefined;
  const temperature = temperatureRaw ? Number(temperatureRaw) : undefined;
  const topP = topPRaw ? Number(topPRaw) : undefined;

  return {
    port,
    corsOrigin,
    ollamaHost,
    ollamaFallbackModel,
    routerGeneralModel,
    ollamaOptions: {
      numPredict: Number.isFinite(numPredict) ? (numPredict as number) : 256,
      temperature: Number.isFinite(temperature) ? (temperature as number) : 0.6,
      topP: Number.isFinite(topP) ? (topP as number) : 0.9,
      keepAlive,
    },
  } as const;
}
