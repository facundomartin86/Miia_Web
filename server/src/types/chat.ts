export type Role = "user" | "assistant" | "system";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatOptions {
  /** Simula latencia en milisegundos antes de responder */
  simulateLatencyMs?: number;
  /** Fuerza un error del proveedor para probar manejo de errores */
  simulateError?: boolean;
  /** Indica si se desea streaming (SSE) */
  stream?: boolean;
}

export interface ChatRequest {
  conversationId?: string;
  messages: Message[];
  provider?: "mock" | "ollama" | "auto"; // ampliable a otros: "openai" | "hf"
  options?: ChatOptions;
}

export interface ChatResponse {
  message: Message;
  usage?: Record<string, unknown>;
}
