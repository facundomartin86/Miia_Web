import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index";

describe("POST /chat", () => {
  it("responde 200 con mensaje del asistente", async () => {
    const res = await request(app)
      .post("/chat")
      .send({
        messages: [
          { role: "system", content: "S" },
          { role: "user", content: "Hola" },
        ],
        provider: "mock",
        options: { simulateLatencyMs: 10 },
      })
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toHaveProperty("role", "assistant");
    expect(typeof res.body.message.content).toBe("string");
  });

  it("retorna 400 si el body es inválido", async () => {
    const res = await request(app).post("/chat").send({}).expect(400);
    expect(res.body).toHaveProperty("message");
  });

  it("propaga error del proveedor cuando simulateError=true", async () => {
    const res = await request(app)
      .post("/chat")
      .send({
        messages: [{ role: "user", content: "Forzar error" }],
        provider: "mock",
        options: { simulateError: true },
      })
      .expect(500);
    expect(res.body).toHaveProperty("message");
  });
});
