import { Router } from "express";
import { z } from "zod";
import type { ChatRequest, ChatResponse } from "../types/chat";
import { mockProvider } from "../providers/mock";

export const router = Router();

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]).default("user"),
  content: z.string().min(1),
});

const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(messageSchema).min(1),
  provider: z.enum(["mock"]).default("mock"),
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
