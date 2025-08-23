import type { ChatRequest, ChatResponse, Message } from "../types/chat";

export function simpleTransform(text: string): string {
  // Respuesta juguetona: reformula y agrega sugerencia
  const trimmed = text.trim();
  if (!trimmed) {
    return "Necesito más contexto para ayudarte.";
  }
  const suggestion =
    trimmed.length > 120
      ? "Puedo dividir la tarea en pasos si quieres."
      : "¿Quieres que lo resuma o genere código de ejemplo?";
  return `Entendido: "${trimmed}". ${suggestion}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function lastUserMessage(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      return messages[i].content;
    }
  }
  return null;
}

export const mockProvider = {
  async generate(req: ChatRequest): Promise<ChatResponse> {
    const startedAt = Date.now();
    const last =
      req.messages.length > 0
        ? req.messages[req.messages.length - 1]
        : undefined;
    const userText = lastUserMessage(req.messages) || last?.content || "";

    // Simular latencia si se solicita
    const latency = req.options?.simulateLatencyMs ?? 0;
    if (latency > 0) {
      await delay(latency);
    }

    // Simular error si se solicita
    if (req.options?.simulateError) {
      throw new Error("Mock provider: error simulado");
    }

    const content = simpleTransform(userText);
    const latencyMs = Date.now() - startedAt;
    return {
      message: { role: "assistant", content },
      usage: {
        provider: "mock",
        latencyMs,
      },
    };
  },
};
