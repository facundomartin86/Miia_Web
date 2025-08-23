import React, { useState, useRef, useEffect } from "react";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simular respuesta de IA (aquí se conectaría con el backend)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Entiendo tu mensaje: "${inputText}". Esta es una respuesta de ejemplo. En la implementación completa, aquí procesaría tu solicitud usando modelos de IA y mi memoria local.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
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
