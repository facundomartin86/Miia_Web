import { Router } from "express";
import { z } from "zod";
import type { ChatRequest, ChatResponse } from "../types/chat";
import { mockProvider } from "../providers/mock";

export const router = Router();

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]).default("user"),
  content: z.string().min(1),
});

const optionsSchema = z
  .object({
    simulateLatencyMs: z.number().int().nonnegative().max(30000).optional(),
    simulateError: z.boolean().optional(),
    stream: z.boolean().optional(),
  })
  .optional();

const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(messageSchema).min(1),
  provider: z.enum(["mock"]).default("mock"),
  options: optionsSchema,
});

router.post<unknown, ChatResponse, ChatRequest>("/", async (req, res, next) => {
  try {
    const parsed = chatRequestSchema.parse(req.body);

    // Por ahora solo provider mock, luego inyectaremos fábrica
    const response = await mockProvider.generate(parsed);

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// Streaming SSE simulado
router.post<unknown, never, ChatRequest>("/stream", async (req, res, next) => {
  try {
    const parsed = chatRequestSchema.parse(req.body);

    // Si se solicita error, lo lanzamos antes de abrir el stream
    if (parsed.options?.simulateError) {
      throw new Error("Mock provider: error simulado (stream)");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Respetar latencia inicial simulada si se solicita
    const initialDelay = parsed.options?.simulateLatencyMs ?? 0;

    // Usamos el proveedor mock para generar la respuesta completa y luego la troceamos
    const full = await mockProvider.generate(parsed);
    const text = full.message.content;
    const words = text.split(/(\s+)/); // mantener espacios como tokens

    let idx = 0;
    let interval: NodeJS.Timeout | null = null;
    const send = (data: unknown) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const startStreaming = () => {
      interval = setInterval(() => {
        if (idx >= words.length) {
          if (interval) {
            clearInterval(interval);
          }
          // Enviar métrica de uso y cierre
          res.write(`event: usage\n`);
          send(full.usage ?? { provider: "mock" });
          send("[DONE]");
          res.end();
          return;
        }
        const delta = words[idx++];
        send({ delta });
      }, 40);
    };

    if (initialDelay > 0) {
      setTimeout(startStreaming, initialDelay);
    } else {
      startStreaming();
    }

    req.on("close", () => {
      if (interval) {
        clearInterval(interval);
      }
    });
  } catch (err) {
    next(err);
  }
});
