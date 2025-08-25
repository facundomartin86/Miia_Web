import type { ChatRequest, ChatResponse, Message } from "../types/chat";
import { getConfig } from "../utils/config";

// Formato esperado por la API de Ollama
interface OllamaChatRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
  // Opciones de sampling
  options?: {
    num_predict?: number;
    temperature?: number;
    top_p?: number;
  };
  // Mantener modelo caliente
  keep_alive?: string;
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

    // Verificar que el host de Ollama esté accesible
    try {
      const healthCheck = await fetch(`${cfg.ollamaHost}/api/tags`);
      if (!healthCheck.ok) {
        throw new Error(`No se pudo conectar con Ollama en ${cfg.ollamaHost}`);
      }
    } catch (error) {
      console.error("Error de conexión con Ollama:", error);
      throw new Error(
        `Servicio de Ollama no disponible en ${cfg.ollamaHost}. Asegúrate de que Ollama esté en ejecución.`,
      );
    }

    const baseMessages = mapMessages(req.messages);

    async function attempt(withModel: string): Promise<ChatResponse> {
      try {
        const body: OllamaChatRequest = {
          model: withModel,
          messages: baseMessages,
          stream: false,
          options: {
            num_predict: cfg.ollamaOptions.numPredict,
            temperature: cfg.ollamaOptions.temperature,
            top_p: cfg.ollamaOptions.topP,
          },
          keep_alive: cfg.ollamaOptions.keepAlive,
        };

        console.log(`Enviando solicitud a Ollama con modelo: ${withModel}`);
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error de Ollama (${response.status}):`, errorText);
          throw new Error(
            `Error del servidor Ollama: ${response.status} - ${errorText}`,
          );
        }

        const data = await response.json();

        // Asegurarse de que la respuesta tenga el formato correcto
        if (!data.message || !data.message.content) {
          throw new Error("Respuesta de Ollama en formato inesperado");
        }

        return {
          message: {
            role: "assistant",
            content: data.message.content,
          },
          usage: {
            ...(data.usage || {}),
            provider: "ollama",
            model: withModel,
          },
        };
      } catch (error: unknown) {
        console.error("Error en la solicitud a Ollama:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        throw new Error(
          `No se pudo completar la solicitud a Ollama: ${errorMessage}`,
        );
      }
    }

    try {
      return await attempt(model);
    } catch (error) {
      // Si hay error y hay un modelo de respaldo diferente, intentar con él
      if (cfg.ollamaFallbackModel && cfg.ollamaFallbackModel !== model) {
        console.log(
          `Intentando con modelo de respaldo: ${cfg.ollamaFallbackModel}`,
        );
        return await attempt(cfg.ollamaFallbackModel);
      }
      throw error; // Relanzar el error si no hay respaldo o si ya lo intentamos
    }
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
        options: {
          num_predict: cfg.ollamaOptions.numPredict,
          temperature: cfg.ollamaOptions.temperature,
          top_p: cfg.ollamaOptions.topP,
        },
        keep_alive: cfg.ollamaOptions.keepAlive,
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
