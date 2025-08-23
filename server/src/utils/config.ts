export function getConfig() {
  const port = Number(process.env.PORT || 4000);
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"; // Vite dev
  return { port, corsOrigin };
}
