# MiiA_Web

MiiA (Mi Inteligencia Artificial) es una app web personal enfocada en desarrollo y automatización. Esta base es frontend (React + Vite + Tailwind), preparada para integrar backend, memoria y módulos de IA.

## Características

- UI modular: Dashboard, Chat, Navegador, Memoria, Seguridad, Configuración.
- Persistencia local de preferencias (localStorage).
- Preparada para autenticación y backend.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Scripts

```bash
npm run dev         # servidor de desarrollo
npm run build       # construir producción
npm run preview     # previsualizar build
npm run lint        # linting con ESLint
npm run format      # formateo con Prettier
npm run typecheck   # verificación de tipos (TypeScript)
npm test            # ejecutar tests (Vitest)
npm run test:watch  # tests en watch
```

## Estructura

```text
MiiA_Web/
├─ docs/                  # documentación (prompt, arquitectura, roadmap)
├─ public/                # estáticos (imágenes, favicon)
├─ src/
│  ├─ components/
│  │  ├─ Auth/
│  │  ├─ Dashboard/
│  │  └─ Modules/
│  ├─ contexts/
│  ├─ App.tsx
│  └─ main.tsx
├─ server/                # backend Node.js + TypeScript (Express)
├─ package.json
└─ vite.config.ts
```

## Entorno

- Variables: ver `docs/environment.md`.
- Ejemplo: copiar `.env.example` a `.env.local` y ajustar `VITE_API_URL` y `VITE_APP_VERSION` (opcional).
- Si `VITE_API_URL` está definida, al iniciar se valida la sesión con `GET /auth/me` usando el `miia_token`. Si falla, se limpia la sesión y no se usa mock. Sin backend, se usa el login/mock (admin/miia2025) y se restaura `miia_auth` local.
- `VITE_APP_VERSION` controla el texto de versión mostrado en la barra lateral (fallback por defecto: `v1.0.0`).

## Backend (server)

Backend mínimo en `server/` con Express (TypeScript), CORS y validación con Zod.

### Requisitos (backend)

- Node.js 18+

### Instalación y ejecución

```bash
cd server
npm install
npm run dev      # desarrollo (nodemon + ts-node)
# npm run build  # compilar a dist/
# npm start      # ejecutar compilado
```

### Variables de entorno (server/.env)

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
# Inferencia local Ollama (sin tokens)
OLLAMA_HOST=http://localhost:11434
# Modelo de fallback si el seleccionado no está instalado/disponible
OLLAMA_FALLBACK_MODEL=llama3.1:8b-instruct
```

### Endpoints mínimos

- `GET /health` → `{ status: "ok", version: "0.1.0" }`
- `POST /chat` → proveedor configurable: `mock` | `ollama` | `auto`
- `POST /chat/stream` → SSE (streaming) cuando el proveedor lo soporta (Ollama)

Payload ejemplo (`POST /chat`):

```json
{
  "messages": [{ "role": "user", "content": "Hola MiiA, ¿qué puedes hacer?" }],
  "provider": "auto"
}
```

Respuesta ejemplo:

```json
{
  "message": { "role": "assistant", "content": "Entendido: \"Hola...\"" },
  "usage": { "provider": "mock" }
}
```

### Integración con el frontend (Chat)

- Si quieres usar el backend real, configura en la raíz del proyecto: `./.env.local` con `VITE_API_URL=http://localhost:4000`.
- El componente `src/components/Modules/ChatModule.tsx` envía el historial y el mensaje del usuario a `POST /chat` y muestra la respuesta. También soporta `POST /chat/stream` (SSE) cuando está activo el toggle "Usar streaming".
- **Procesador de Markdown**: Las respuestas de la IA se renderizan con formato markdown básico:
  - **Texto en negrita**: `**texto**` → **texto**
  - _Texto en cursiva_: `*texto*` → _texto_
  - Listas numeradas con números resaltados en cyan
  - Preservación de saltos de línea
- **Reconocimiento de voz**: Botón de micrófono para dictar mensajes usando Web Speech API
- Selector de proveedor: `Auto (router)` | `Ollama` | `Mock`. En `Auto`, el backend elige un modelo en función del texto (heurística simple).
- Cuando no hay backend (`VITE_API_URL` vacío/no definido), el Chat funciona en modo mock local: genera una respuesta simulada con latencia y, si se desea, error simulado. En este modo, el toggle de streaming aparece deshabilitado ya que requiere backend.

## Chat de voz (STT/TTS y streaming)

El módulo `ChatModule` soporta conversación por voz bidireccional usando Web Speech API (sin dependencias externas):

- Reconocimiento de voz (STT): dictas tu mensaje con el micrófono y se envía automáticamente al dejar de hablar.
- Síntesis de voz (TTS): MiiA puede leer en voz alta sus respuestas.
- Streaming SSE: las respuestas se reciben en tiempo real; si el TTS automático está activado, se leen oraciones completas a medida que llegan.

Ubicación: `src/components/Modules/ChatModule.tsx`.

### Controles en la UI

- Botón Micrófono: activa/desactiva escucha. Al finalizar la frase, se envía el texto automáticamente.
- Botón Leer última respuesta: reproduce por voz el último mensaje de la IA.
- Checkbox “Respuesta por voz automática”: activa/desactiva TTS automático. Este toggle está disponible en:
  - Configuración superior (header del Chat)
  - Footer (debajo de la caja de texto)
    Ambos toggles están sincronizados y controlan el mismo estado.
- Toggle “Usar streaming (SSE)”: habilita recepción por tokens (requiere backend).

### Comportamiento

- Con streaming + “Respuesta por voz automática” activado:
  - Se detectan oraciones completas durante el streaming y se reproducen en tiempo real.
  - Al finalizar, si queda texto sin puntuación, también se reproduce.
- Sin streaming + “Respuesta por voz automática” activado:
  - La última respuesta recibida se reproduce automáticamente.
- En cualquier modo puedes usar “Leer última respuesta” para reproducir manualmente.

### Requisitos y notas

- Navegador con Web Speech API (Chrome/Edge recomendado).
- Dar permiso de micrófono para usar STT.
- Backend recomendado para streaming SSE (`/chat/stream`). Sin backend, el modo mock funciona sin streaming.

### Solución de problemas

- Si el TTS no suena: verifica que el sistema tenga voces instaladas y el navegador permita reproducción de audio.
- Si el micrófono no funciona: revisa permisos del navegador y sistema operativo.
- Revisa la consola del navegador para mensajes de error de STT/TTS.

### Ollama (local, sin tokens)

1. Instalar Ollama: <https://ollama.com>
1. Ejecutar Ollama (por defecto en `http://localhost:11434`).
1. Descargar modelos sugeridos:

```bash
ollama pull llama3.1:8b
ollama pull qwen2.5-coder:7b
ollama pull deepseek-r1:7b
```

1. Verifica `server/.env` → `OLLAMA_HOST=http://localhost:11434`.
1. Ejecutar backend: `npm run dev` en `server/`.

Nota: si un modelo elegido por el router no está disponible, el servidor reintentará automáticamente con `OLLAMA_FALLBACK_MODEL`.

## Autenticación

- Backend configurable mediante `VITE_API_URL` (Vite). Cuando existe:
  - En el arranque, `AuthProvider` valida la sesión con `GET /auth/me`.
  - Mientras valida/restaura la sesión, se expone `isInitializing` y las rutas protegidas muestran un spinner “Restaurando sesión…”.
  - Si la validación falla, se limpia la sesión y se redirige a login.
- Sin backend (`VITE_API_URL` vacío/no definido):
  - Modo mock de desarrollo. Acceso con `admin` / `miia2025`.
  - La sesión se persiste en `localStorage` bajo la clave `miia_auth`.
- Rutas protegidas: `ProtectedRoute` redirige a `/login?returnTo=...` si no hay sesión.

Archivos relevantes:

- `src/contexts/AuthContext.tsx`: contexto de auth, `isInitializing`, login/logout.
- `src/components/Auth/ProtectedRoute.tsx`: protección de rutas y spinner inicial.
- `src/components/Auth/Login.tsx`: formulario de login con mensajes según modo backend/mock.

## CI

- GitHub Actions ejecuta lint, typecheck, build y tests en `main` y `develop`.
- Workflow: `.github/workflows/ci.yml`.

## Documentación de Módulos

- Análisis y plan por fases: `docs/modules.md`.

## Flujo de trabajo (Git Flow clásico)

- main: estable (releases)
- develop: integración
- feature/\*: nuevas funcionalidades
- fix/\*: correcciones
- release/\*: preparación de versiones

## Convención de commits

Usar Conventional Commits:

- feat: nueva funcionalidad
- fix: corrección
- docs: documentación
- style: formato (sin cambios de lógica)
- refactor: refactorizaciones
- test: tests
- chore: tareas varias

## Versionado

- SemVer: MAJOR.MINOR.PATCH
- Mantener `CHANGELOG.md` (Keep a Changelog)

## Licencia

Pendiente.
