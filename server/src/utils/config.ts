export function getConfig() {
  const port = Number(process.env.PORT || 4000);
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"; // Vite dev
  const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";
  const ollamaFallbackModel =
    process.env.OLLAMA_FALLBACK_MODEL || "llama3.1:8b-instruct";
  return { port, corsOrigin, ollamaHost, ollamaFallbackModel };
}
