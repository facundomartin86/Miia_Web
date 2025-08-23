# Configuración de entorno

- **VITE_API_URL**: URL base del backend utilizada por el cliente de API en `src/services/api.ts`.
  - Ejemplo: `http://localhost:4000`
  - Si no está definida, `AuthContext` utiliza login de prueba (usuario: `admin`, clave: `miia2025`).

## Configuración

1. Copia `.env.example` a `.env.local` (no se versiona) y edítalo según tu entorno.
2. Reinicia el servidor de desarrollo tras cambiar variables.

## Flujo de Autenticación

- En login, si `VITE_API_URL` está definida, la app llama a `POST /auth/login` con `{ username, password }`.
  - Respuesta esperada: `{ token, user: { id, username, name, role? } }`.
  - El token se guarda en `localStorage` bajo `miia_token` y se envía en `Authorization: Bearer <token>` para peticiones autenticadas.
- Si `VITE_API_URL` no está definida, la app usa login de prueba (sin red) y guarda la info de usuario en `localStorage` (`miia_auth`).
- En logout, se limpian `miia_auth` y `miia_token`.

### Validación de sesión

- Si `VITE_API_URL` está definida y existe un `miia_token` en `localStorage`, al cargar la app se invoca `GET /auth/me` para validar la sesión y recuperar al usuario.
  - En éxito: se setea el estado autenticado y se persiste `miia_auth` con los datos del usuario.
  - En error (por ejemplo 401/403): se limpia la sesión (`miia_auth`) y el token (`miia_token`). No se recurre al mock si el backend está configurado.
- Si `VITE_API_URL` no está definida, se restaura la sesión mock leyendo `miia_auth` (si existe) sin realizar llamadas de red.
