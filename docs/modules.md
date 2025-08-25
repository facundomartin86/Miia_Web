# Análisis de Módulos del Dashboard

Este documento resume el estado actual de los módulos principales de la app (Inicio, Chat, Navegador, Memoria, Seguridad, Configuración), sus objetos UI/estado, funcionalidades existentes, faltantes y plan de desarrollo propuesto por fases.

## Inicio (`DashboardHome`)

- **Objetos/Componentes**: tarjetas de módulos, métricas/resumen, accesos rápidos.
- **Estado**: estático (mock de estadísticas y acciones).
- **Faltantes**:
  - Datos reales de uso (nº chats, items de memoria, estado de seguridad).
  - Acciones rápidas contextuales (último chat, última URL).
- **Plan**:
  - Fase 1: Fuente de datos desde `localStorage`/contextos.
  - Fase 2: Endpoint backend `/stats` consolidado y polling/lazy fetch.

## Chat (`ChatModule`)

- **Objetos/Estado**: lista `messages`, input de texto, estados de voz (escucha/habla), placeholders de TTS/STT.
- **Existente**: simulación de respuesta IA, UI de conversación, controles básicos.
- **Modo mock local**: cuando no hay `VITE_API_URL`, el Chat genera la respuesta de forma local con latencia configurable y opción de error simulado (controles: `Latencia (ms)` y `Simular error`). En este modo, el toggle de streaming (SSE) aparece deshabilitado porque requiere backend.
- **Faltantes**:
  - Integración real con backend LLM/adapter (`POST /chat`).
  - Historial persistente por conversación, títulos automáticos.
  - Adjuntos (archivos/imágenes) y streaming de tokens.
  - Comandos/acciones (crear nota, guardar en memoria).
- **Plan**:
  - Fase 1: `POST /chat` (texto->texto) + persistencia local por `conversationId`.
  - Fase 2: streaming SSE/WebSocket; adjuntos; comandos con router de herramientas. El streaming solo está disponible cuando hay backend configurado (`VITE_API_URL`).

## Navegador (`BrowserModule`)

- **Objetos/Estado**: `url`, modo análisis, resultados/insights, botones "Aprender"/"Extraer".
- **Existente**: simulación de carga/análisis.
- **Faltantes**:
  - Backend de scraping/resumen (`GET /browser/fetch?url=...`).
  - Extractor de datos (metadatos, enlaces, tablas) y guardar a Memoria.
  - Manejo de errores (CORS, timeouts, URL inválida) y cacheo.
- **Plan**:
  - Fase 1: fetch + resumen + UI de estados.
  - Fase 2: extracción estructurada + export (CSV/JSON) + vinculación con Memoria.

## Memoria (`MemoryModule`)

- **Objetos/Estado**: lista de items con `id`, `type`, `tags`, `size`, filtros, búsqueda.
- **Existente**: render de items mock, filtros locales, acciones (descargar, borrar) simuladas.
- **Faltantes**:
  - CRUD real: `GET/POST/DELETE /memory`, subida de archivos, descarga con permisos.
  - Indexación/búsqueda semántica (más adelante), etiquetas persistentes.
  - Paginación y tamaños reales.
- **Plan**:
  - Fase 1: CRUD REST con validación y toasts de feedback.
  - Fase 2: búsqueda avanzada (servidor) y adjuntar a Chat.

## Seguridad (`SecurityModule`)

- **Objetos/Estado**: toggles (firewall, cifrado, monitoreo, auto-defensa), eventos recientes, puntaje.
- **Existente**: UI y estado local, lista mock de eventos.
- **Faltantes**:
  - Persistencia de configuración por usuario (`/security/settings`).
  - Fuente real de eventos (`/security/events`) y severidad.
  - Pruebas automáticas de salud/seguridad y recomendaciones.
- **Plan**:
  - Fase 1: persistencia + feed de eventos (mock server o backend real).
  - Fase 2: análisis y recomendaciones con scoring dinámico.

## Configuración (`SettingsModule`)

- **Objetos/Estado**: secciones (voz, IA, seguridad, UI), export/reset, `miia.settings` en `localStorage`.
- **Existente**: UI completa y persistencia local.
- **Faltantes**:
  - Sincronización con backend por usuario/rol (`/settings/me`).
  - Import/export firmado y validado; migraciones de esquema.
- **Plan**:
  - Fase 1: `/settings/me` GET/PUT con validación.
  - Fase 2: versiones de esquema, import/export JSON firmado.

---

## Plan de Desarrollo por Fases

- **Fase A: Autenticación (en curso)**
  - `/auth/login` (JWT), `/auth/me` (opcional), roles (admin/user).
  - Frontend: `AuthContext` ya preparado para backend con `VITE_API_URL`.

- **Fase B: Chat básico**
  - `POST /chat` (no streaming). Persistencia local por conversación. Tests de UI.

- **Fase C: Navegador básico**
  - `GET /browser/fetch` + resumen. Manejo de errores y timeouts.

- **Fase D: Memoria CRUD**
  - `GET/POST/DELETE /memory` con paginación. UI de toasts/confirm.

- **Fase E: Seguridad settings + eventos**
  - Persistencia de toggles + feed de eventos inicial.

- **Fase F: Configuración backend**
  - `/settings/me` + export/import básico.

---

## Criterios de Aceptación (por módulo)

- **Autenticación**: login válido devuelve token y usuario; rutas protegidas redirigen; logout limpia `miia_auth`/`miia_token`.
- **Chat**: enviar mensaje y recibir respuesta desde backend; historial visible; error UI si backend falla.
- **Navegador**: analizar URL válida y mostrar resumen; error claro en URL inválida/timeout.
- **Memoria**: crear, listar y borrar item; filtros y búsqueda funcionales.
- **Seguridad**: toggles persistentes entre sesiones; eventos listados desde backend/mock.
- **Configuración**: leer/guardar settings por usuario; export/import funcionando.
