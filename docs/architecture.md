# Arquitectura de MiiA_Web

## Visión general

- Frontend: React + Vite + Tailwind (TS)
- Backend (futuro): Node.js o Python (APIs REST/GraphQL)
- Memoria: SQLite/PostgreSQL (local primero, opción remota después)
- IA: integraciones externas iniciales (Ollama/HF), evolución a modelos locales

## Módulos frontend

- Dashboard (layout, sidebar, home)
- Chat (texto/voz)
- Navegador integrado
- Memoria
- Seguridad
- Configuración

## Estados y persistencia

- UI y preferencias en `localStorage` (sin backend)
- Contextos: `AuthContext`, `ThemeContext`

## Temas abiertos

- Autenticación real y tokens
- API de memoria y sincronización
- Seguridad (cifrado local, CSP)
- Telemetría opcional (local-first)
