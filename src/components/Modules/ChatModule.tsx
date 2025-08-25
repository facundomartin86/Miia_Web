import React, { useState, useRef, useEffect } from "react";
import { api, API_BASE } from "../../services/api";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatModule: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy MiiA, tu inteligencia artificial personal. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Controles de simulación/streaming
  const [useStream, setUseStream] = useState(false);
  const [simulateLatencyMs, setSimulateLatencyMs] = useState<number>(400);
  const [simulateError, setSimulateError] = useState(false);
  const [provider, setProvider] = useState<"auto" | "ollama" | "mock">("auto");
  const backendAvailable = Boolean(API_BASE);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Construir payload para backend /chat
      const payload = {
        messages: [
          {
            role: "system",
            content: "Eres MiiA, una IA personal de asistencia.",
          },
          // mapear historial relevante (opcional: enviar solo últimos N)
          ...messages.slice(-5).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: userMessage.text },
        ],
        provider,
        options: {
          simulateLatencyMs,
          simulateError,
          stream: useStream,
        },
      };

      // Función local de simulación cuando no hay backend disponible
      const simulateLocal = async () => {
        // Simular latencia
        await new Promise((res) =>
          setTimeout(res, Math.max(0, simulateLatencyMs)),
        );
        if (simulateError) {
          throw new Error("Simulación de error local activada");
        }
        // Respuesta juguetona similar a provider mock: invertir/suavizar texto
        const input = userMessage.text.trim();
        const transformed = input
          ? `Te escucho. Dijiste: "${input}". Aquí va una reflexión rápida: ${input
              .split("")
              .reverse()
              .join("")}`
          : "Hmm... no recibí contenido para procesar.";
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: transformed,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      };

      if (useStream && backendAvailable) {
        // Streaming mediante fetch + lectura de SSE (POST /chat/stream)
        const resp = await fetch(`${API_BASE}/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!resp.ok || !resp.body) {
          throw new Error("No se pudo iniciar el streaming");
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        const aiId = (Date.now() + 1).toString();
        // Crear mensaje AI vacío que iremos completando
        setMessages((prev) => [
          ...prev,
          { id: aiId, text: "", sender: "ai", timestamp: new Date() },
        ]);

        const appendDelta = (delta: string) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiId ? { ...m, text: (m.text || "") + delta } : m,
            ),
          );
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          // Analizar eventos SSE: líneas separadas por doble salto
          const events = accumulated.split("\n\n");
          // Mantener el último parcial en buffer
          accumulated = events.pop() || "";
          for (const evt of events) {
            const line = evt.split("\n").find((l) => l.startsWith("data: "));
            if (!line) {
              continue;
            }
            const dataStr = line.slice("data: ".length);
            if (dataStr === "[DONE]") {
              // final
              await reader.cancel();
              break;
            }
            try {
              const data = JSON.parse(dataStr) as { delta?: string } | string;
              if (typeof data === "string") {
                // mensajes tipo usage o control los ignoramos aquí
                continue;
              }
              if (data.delta) {
                appendDelta(data.delta);
              }
            } catch {
              // ignorar líneas que no sean JSON válidos
            }
          }
        }
      } else if (backendAvailable) {
        const res = await api.post<{
          message: { role: string; content: string };
        }>("/chat", payload, { auth: false });

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: res.message?.content || "(Sin respuesta)",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        await simulateLocal();
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Error al conectar con el backend";
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Ocurrió un error: ${msg}`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Aquí se implementaría el reconocimiento de voz
  };

  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(true);
    // Aquí se implementaría la síntesis de voz
    // Usar la longitud del texto para simular la duración del habla (50ms por carácter, máx 5s)
    const duration = Math.min(5000, Math.max(1000, text.length * 50));
    setTimeout(() => setIsSpeaking(false), duration);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="glass-morphism rounded-t-xl p-4 border-b border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Chat con MiiA</h1>
            <p className="text-blue-200">
              Conversación inteligente • Texto y Voz
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm">En línea</span>
            </div>
          </div>
        </div>
        {/* Controles de simulación */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <label className="flex items-center space-x-2 text-blue-200">
            <input
              type="checkbox"
              checked={useStream}
              onChange={(e) => setUseStream(e.target.checked)}
              disabled={!backendAvailable || provider === "mock"}
            />
            <span>
              Usar streaming (SSE)
              {!backendAvailable && " (requiere backend)"}
            </span>
          </label>
          {/* Selector de proveedor */}
          <label className="flex items-center space-x-2 text-blue-200">
            <span>Proveedor:</span>
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as "auto" | "ollama" | "mock")
              }
              className="px-2 py-1 rounded bg-slate-800/50 border border-blue-500/30 text-blue-100"
              disabled={!backendAvailable}
            >
              <option value="auto">Auto (router)</option>
              <option value="ollama">Ollama</option>
              <option value="mock">Mock (local)</option>
            </select>
          </label>
          <label className="flex items-center space-x-2 text-blue-200">
            <span>Latencia (ms):</span>
            <input
              type="number"
              min={0}
              max={30000}
              value={simulateLatencyMs}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) {
                  setSimulateLatencyMs(Math.min(30000, Math.max(0, v)));
                }
              }}
              className="w-24 px-2 py-1 rounded bg-slate-800/50 border border-blue-500/30 text-blue-100"
            />
          </label>
          <label className="flex items-center space-x-2 text-blue-200">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
            />
            <span>Simular error</span>
          </label>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 glass-morphism p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === "user"
                    ? "chat-bubble-user text-white"
                    : "chat-bubble-ai text-white"
                }`}
              >
                <p className="leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.sender === "ai" && (
                    <button
                      onClick={() => handleTextToSpeech(message.text)}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai p-4 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-morphism rounded-b-xl p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje aquí... (Enter para enviar)"
              className="w-full p-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={2}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-lg transition-all ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-blue-300"
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;
