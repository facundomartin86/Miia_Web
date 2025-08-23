export type Role = "user" | "assistant" | "system";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  conversationId?: string;
  messages: Message[];
  provider?: "mock"; // ampliable a "ollama" | "openai" | "hf"
}

export interface ChatResponse {
  message: Message;
  usage?: Record<string, unknown>;
}
