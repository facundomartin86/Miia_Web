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

```
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
├─ package.json
└─ vite.config.ts
```

## Entorno

- Variables: ver `docs/environment.md`.
- Ejemplo: copiar `.env.example` a `.env.local` y ajustar `VITE_API_URL`.

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
