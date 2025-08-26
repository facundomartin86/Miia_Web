import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { API_BASE, api } from "../../services/api";

// Tipos para APIs de voz del navegador
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

/**
 * Procesador de markdown básico para respuestas de IA
 * Convierte formato markdown simple a JSX con estilos
 *
 * Funcionalidades soportadas:
 * - **negrita** → <strong>negrita</strong>
 * - *cursiva* → <em>cursiva</em>
 * - Listas numeradas con números resaltados en cyan
 * - Preservación de saltos de línea
 *
 * @param text - Texto con formato markdown a procesar
 * @returns JSX.Element con el contenido formateado
 */
const processMarkdown = (text: string): JSX.Element => {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];

  lines.forEach((line, index) => {
    // Líneas vacías se convierten en saltos de línea
    if (line.trim() === "") {
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Aplicar formato básico de markdown
    let processedLine = line;

    // Convertir **texto** a <strong>texto</strong>
    processedLine = processedLine.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>",
    );

    // Convertir *texto* a <em>texto</em>
    processedLine = processedLine.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Detectar y procesar listas numeradas (formato: "1. texto")
    const numberedListMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedListMatch) {
      elements.push(
        <div key={`line-${index}`} className="mb-1">
          {/* Número de lista resaltado en cyan */}
          <span className="font-semibold text-cyan-300">
            {numberedListMatch[1]}.
          </span>{" "}
          {/* Contenido de la lista con formato aplicado */}
          <span
            dangerouslySetInnerHTML={{
              __html: numberedListMatch[2].replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>",
              ),
            }}
          />
        </div>,
      );
      return;
    }

    // Línea normal con formato aplicado
    elements.push(
      <div key={`line-${index}`} className="mb-1">
        <span dangerouslySetInnerHTML={{ __html: processedLine }} />
      </div>,
    );
  });

  return <div>{elements}</div>;
};

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
  const [autoTTS, setAutoTTS] = useState(false); // Nueva configuración para TTS automático
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Controles de simulación/streaming
  const [useStream, setUseStream] = useState(true);
  const [simulateLatencyMs, setSimulateLatencyMs] = useState<number>(400);
  const [simulateError, setSimulateError] = useState(false);
  const [provider, setProvider] = useState<"auto" | "ollama" | "mock">("auto");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const backendAvailable = Boolean(API_BASE);
  // Mostrar/ocultar configuración avanzada
  const [showSettings, setShowSettings] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
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
            role: "user",
            content: textToSend,
          },
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
        const input = textToSend.trim();
        const transformed = input
          ? `Te escucho. Dijiste: "${input}". Aquí va una reflexión rápida: ${input
              .split("")
              .reverse()
              .join("")}`
          : "Hmm... no recibí contenido para procesar.";
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: transformed,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // TTS automático si está habilitado
        if (autoTTS && transformed.trim()) {
          setTimeout(() => {
            handleTextToSpeech(transformed);
          }, 300); // Pequeño delay para mejor UX
        }
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
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.",
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const { results } = event;
      const { transcript } = results[0][0];
      setInputText(transcript);
      setIsListening(false);

      // Enviar automáticamente el mensaje cuando se deja de hablar
      if (transcript.trim()) {
        setTimeout(() => {
          handleSendMessage(transcript.trim());
        }, 500); // Pequeño delay para mejor UX
      }
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        alert(
          "Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.",
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleTextToSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no soporta síntesis de voz.");
      return;
    }

    // Si ya está hablando, detener
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Buscar una voz en español
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(
      (voice) =>
        voice.lang.startsWith("es") ||
        voice.name.toLowerCase().includes("spanish"),
    );
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Error en síntesis de voz:", event.error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="glass-morphism rounded-t-xl p-1 border-b border-blue-500/20 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base md:text-lg font-bold text-white">
              Chat con MiiA
            </h1>
            <p className="text-blue-200 text-[11px] md:text-xs">
              Conversación inteligente • Texto y Voz
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-0.5 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">En línea</span>
            </div>
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-200 hover:bg-blue-500/10 transition-colors text-xs"
              title={
                showSettings ? "Ocultar configuración" : "Mostrar configuración"
              }
            >
              {showSettings ? "Ocultar config" : "Config"}
            </button>
          </div>
        </div>
        {/* Controles de simulación (colapsables) */}
        {showSettings && (
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

            {/* Toggle para TTS automático */}
            <label className="flex items-center space-x-2 text-blue-200">
              <input
                type="checkbox"
                checked={autoTTS}
                onChange={(e) => setAutoTTS(e.target.checked)}
              />
              <span>Respuesta por voz automática</span>
            </label>

            {/* Selector de tamaño de fuente */}
            <div className="space-y-1">
              <label className="flex items-center justify-between text-blue-200 text-sm">
                Tamaño de fuente
                <select
                  value={fontSize}
                  onChange={(e) =>
                    setFontSize(e.target.value as "sm" | "base" | "lg")
                  }
                  className="ml-2 bg-slate-800/50 border border-blue-500/30 text-blue-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sm">Pequeño</option>
                  <option value="base">Mediano</option>
                  <option value="lg">Grande</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 glass-morphism p-3 overflow-y-auto overscroll-contain custom-scroll">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "chat-bubble-user text-white"
                    : "chat-bubble-ai text-white"
                }`}
              >
                <div
                  className={`leading-relaxed whitespace-pre-wrap ${
                    message.sender === "user"
                      ? fontSize === "sm"
                        ? "text-[13px] md:text-sm"
                        : fontSize === "base"
                          ? "text-[15px] md:text-base"
                          : "text-[17px] md:text-lg"
                      : fontSize === "sm"
                        ? "text-xs md:text-sm"
                        : fontSize === "base"
                          ? "text-sm md:text-[15px]"
                          : "text-base md:text-lg"
                  }`}
                >
                  {message.sender === "ai"
                    ? processMarkdown(message.text)
                    : message.text}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] md:text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.sender === "ai" && (
                    <button
                      onClick={() => handleTextToSpeech(message.text)}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors text-xs md:text-sm"
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
      <div className="glass-morphism rounded-b-xl p-2">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje aquí... (Enter para enviar)"
              className="w-full p-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base md:text-lg"
              rows={1}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-lg transition-all text-xs md:text-sm ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-blue-300"
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              disabled={!inputText.trim()}
              className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;
