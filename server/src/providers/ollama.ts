import type { ChatRequest, ChatResponse, Message, Role } from "../types/chat";
import { getConfig } from "../utils/config";

// Formato esperado por la API de Ollama
interface OllamaChatRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
}

interface OllamaChatResponseChunk {
  message?: { role: string; content: string };
  done?: boolean;
}

function mapMessages(messages: Message[]): { role: string; content: string }[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export const ollamaProvider = {
  async generate(req: ChatRequest, model: string): Promise<ChatResponse> {
    const cfg = getConfig();
    const url = `${cfg.ollamaHost}/api/chat`;
    const bodyBase = {
      messages: mapMessages(req.messages),
    } as const;

    async function attempt(withModel: string) {
      const body: OllamaChatRequest = {
        model: withModel,
        messages: bodyBase.messages,
        stream: false,
      };
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    let resp = await attempt(model);
    if (
      !resp.ok &&
      cfg.ollamaFallbackModel &&
      cfg.ollamaFallbackModel !== model
    ) {
      // Reintentar con fallback
      resp = await attempt(cfg.ollamaFallbackModel);
      model = cfg.ollamaFallbackModel;
    }
    if (!resp.ok) {
      let extra = "";
      try {
        extra = await resp.text();
      } catch {
        // ignore
      }
      throw new Error(
        `Ollama error: ${resp.status} ${resp.statusText}${extra ? ` - ${extra}` : ""}`,
      );
    }
    const data = (await resp.json()) as {
      message: { role: Role | string; content: string };
    };
    return {
      message: {
        role: (data.message.role as Role) || "assistant",
        content: data.message.content,
      },
      usage: { provider: "ollama", model },
    } satisfies ChatResponse;
  },

  async stream(
    req: ChatRequest,
    res: import("express").Response,
    model: string,
  ) {
    const cfg = getConfig();
    const url = `${cfg.ollamaHost}/api/chat`;
    const base = { messages: mapMessages(req.messages) } as const;

    async function start(withModel: string) {
      const body: OllamaChatRequest = {
        model: withModel,
        messages: base.messages,
        stream: true,
      };
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return { r, usedModel: withModel } as const;
    }

    let { r: resp, usedModel } = await start(model);
    if (
      (!resp.ok || !resp.body) &&
      cfg.ollamaFallbackModel &&
      cfg.ollamaFallbackModel !== model
    ) {
      const retry = await start(cfg.ollamaFallbackModel);
      resp = retry.r;
      usedModel = retry.usedModel;
    }
    if (!resp.ok || !resp.body) {
      let extra = "";
      try {
        extra = await resp.text();
      } catch {
        // ignore
      }
      throw new Error(
        `No se pudo iniciar stream con Ollama (${resp.status})${extra ? ` - ${extra}` : ""}`,
      );
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

    const send = (data: unknown) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split(/\n/).filter(Boolean);
      for (const line of lines) {
        try {
          const obj = JSON.parse(line) as OllamaChatResponseChunk;
          if (obj.message?.content) {
            send({ delta: obj.message.content });
          }
          if (obj.done) {
            send({
              done: true,
              usage: { provider: "ollama", model: usedModel },
            });
            res.end();
            return;
          }
        } catch {
          // líneas no JSON, ignorar
        }
      }
    }
  },
};
