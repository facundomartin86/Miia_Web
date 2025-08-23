# Contribución a MiiA_Web

## Flujo de ramas (Git Flow clásico)

- `main`: estable (tags `vX.Y.Z`)
- `develop`: integración
- `feature/*`: nuevas funcionalidades (desde `develop`)
- `fix/*`: hotfix/bugfix
- `release/*`: preparación de release, merge a `main` y `develop`

## Commits

Usar Conventional Commits. Ejemplos:

- `feat(settings): persistencia con localStorage`
- `fix(browser): enter navega con onKeyDown`
- `docs(readme): añade guía rápida`

## Pull Requests

- Describe el problema, la solución y cómo probarlo.
- Adjunta capturas si aplica.
- Mantén cambios pequeños y enfocados.

## Calidad de código

- ESLint + Prettier obligatorios.
- `npm run typecheck` debe pasar.
- Tests (cuando estén disponibles) deben pasar.

## Hooks de git

Usaremos Husky + lint-staged:

- Pre-commit: Prettier, ESLint y typecheck sin emitir.
