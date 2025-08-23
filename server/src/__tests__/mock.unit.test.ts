import { describe, it, expect } from "vitest";
import { simpleTransform, lastUserMessage } from "../providers/mock";
import type { Message } from "../types/chat";

describe("simpleTransform", () => {
  it("devuelve mensaje de contexto insuficiente cuando el texto está vacío", () => {
    expect(simpleTransform("   ")).toContain("Necesito más contexto");
  });

  it("devuelve sugerencia corta cuando el texto es breve", () => {
    const res = simpleTransform("Hola");
    expect(res).toContain('Entendido: "Hola"');
    expect(res).toContain("¿Quieres que lo resuma o genere código de ejemplo?");
  });

  it("devuelve sugerencia de dividir en pasos cuando el texto es largo", () => {
    const longText = "x".repeat(121);
    const res = simpleTransform(longText);
    expect(res).toContain("Puedo dividir la tarea en pasos si quieres.");
  });
});

describe("lastUserMessage", () => {
  it("retorna el último mensaje de usuario si existe", () => {
    const messages: Message[] = [
      { role: "system", content: "s" },
      { role: "assistant", content: "a" },
      { role: "user", content: "primero" },
      { role: "assistant", content: "a2" },
      { role: "user", content: "último" },
    ];
    expect(lastUserMessage(messages)).toBe("último");
  });

  it("retorna null si no hay mensajes de usuario", () => {
    const messages: Message[] = [
      { role: "system", content: "s" },
      { role: "assistant", content: "a" },
    ];
    expect(lastUserMessage(messages)).toBeNull();
  });
});
