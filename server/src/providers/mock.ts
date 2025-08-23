import type { ChatRequest, ChatResponse, Message } from "../types/chat";

function simpleTransform(text: string): string {
  // Respuesta juguetona: reformula y agrega sugerencia
  const trimmed = text.trim();
  if (!trimmed) return "Necesito más contexto para ayudarte.";
  const suggestion =
    trimmed.length > 120
      ? "Puedo dividir la tarea en pasos si quieres."
      : "¿Quieres que lo resuma o genere código de ejemplo?";
  return `Entendido: "${trimmed}". ${suggestion}`;
}

function lastUserMessage(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return null;
}

export const mockProvider = {
  async generate(req: ChatRequest): Promise<ChatResponse> {
    const last =
      req.messages.length > 0
        ? req.messages[req.messages.length - 1]
        : undefined;
    const userText = lastUserMessage(req.messages) || last?.content || "";
    const content = simpleTransform(userText);
    return {
      message: { role: "assistant", content },
      usage: { provider: "mock" },
    };
  },
};
