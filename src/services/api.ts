// Cliente API liviano y utilidades de autenticación
// Lee la URL base desde variables de Vite: VITE_API_URL

type ImportMetaEnv = { VITE_API_URL?: string };
type ImportMetaWithEnv = { env?: ImportMetaEnv };
export const API_BASE: string =
  (import.meta as unknown as ImportMetaWithEnv).env?.VITE_API_URL || "";

const TOKEN_KEY = "miia_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // no hacer nada si el almacenamiento no está disponible
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignorar errores de almacenamiento
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  // Cuando es false, no adjuntar cabecera Authorization
  auth?: boolean;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (!API_BASE) {
    throw new Error(
      "API_BASE no está configurado. Define VITE_API_URL en tu entorno para habilitar llamadas al backend.",
    );
  }

  const { method = "GET", body, headers = {}, auth = true } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Respuesta no-JSON; mantener texto crudo
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data &&
      (data as Record<string, unknown>)["message"]
        ? String((data as Record<string, unknown>)["message"])
        : res.statusText || "La solicitud falló";
    throw new Error(msg);
  }

  return data as T;
}

// Helpers de conveniencia
export const api = {
  get: <T = unknown>(
    path: string,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) => request<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, "method"> = {},
  ) => request<T>(path, { ...options, method: "POST", body }),
  put: <T = unknown>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, "method"> = {},
  ) => request<T>(path, { ...options, method: "PUT", body }),
  patch: <T = unknown>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, "method"> = {},
  ) => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T = unknown>(
    path: string,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) => request<T>(path, { ...options, method: "DELETE" }),
};

// Endpoints específicos de autenticación
export interface LoginResponse {
  token: string;
  user: { id: string; username: string; name: string; role?: string };
}

export async function authLogin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>(
    "/auth/login",
    { username, password },
    { auth: false },
  );
  setToken(res.token);
  return res;
}

// Validación de sesión
export interface MeResponse {
  user: { id: string; username: string; name: string; role?: string };
}

export async function authMe(): Promise<MeResponse> {
  // Usa token de Authorization adjuntado por request() cuando auth=true (por defecto)
  const res = await api.get<MeResponse>("/auth/me");
  return res;
}
