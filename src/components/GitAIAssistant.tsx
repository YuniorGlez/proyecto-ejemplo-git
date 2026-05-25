import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Cpu, HelpCircle, Loader } from "lucide-react";

interface GitAIAssistantProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

export default function GitAIAssistant({
  chatHistory,
  onSendMessage,
  isLoading,
}: GitAIAssistantProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleQuickQuestion = (qText: string) => {
    if (isLoading) return;
    onSendMessage(qText);
  };

  const quickQuestions = [
    "¿Qué es .gitignore?",
    "¿Cómo deshago un commit?",
    "¿Diferencia entre git pull y git fetch?",
    "¿Qué es un Conflicto y cómo lo soluciono?"
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden" id="git-ai-assistant">
      {/* Title Header */}
      <div className="p-5 border-b border-gray-100 bg-linear-to-r from-indigo-50/50 to-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl relative">
            <Cpu className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </span>
          <div>
            <h3 className="font-sans font-semibold text-slate-900 text-sm">
              Tutor de Git Inteligente (IA)
            </h3>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              Powered by Gemini • Mentor de control de versiones
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Quick questions header list */}
      <div className="p-3 bg-slate-50 border-b border-slate-100">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> ¿No sabes qué preguntar? Prueba estas:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleQuickQuestion(q)}
              disabled={isLoading}
              className="text-[10px] sm:text-xs font-sans px-2.5 py-1 text-slate-600 hover:text-indigo-700 hover:bg-white bg-slate-100 rounded-lg border border-slate-200 transition-colors disabled:opacity-50 text-left shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat conversation container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[440px]">
        {chatHistory.length === 0 ? (
          <div className="text-center py-10 max-w-xs mx-auto space-y-3">
            <span className="p-3 bg-indigo-50/50 rounded-full text-indigo-600 inline-block">
              <MessageSquare className="w-6 h-6" />
            </span>
            <h4 className="font-sans font-semibold text-slate-800 text-sm">Pregúntame lo que quieras de Git</h4>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Hola, soy **Giti**. Estoy aquí para explicarte todos los secretos de Git con ejemplos visuales y analogías sencillas. ¡Hazme cualquier consulta!
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 font-mono font-black text-indigo-700 flex items-center justify-center shrink-0 text-xs">
                    G
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                  isUser 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200"
                }`}>
                  <div className="whitespace-pre-line prose-sm select-text">
                    {msg.content}
                  </div>
                  
                  {msg.isMock && (
                    <div className="mt-2 text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                      Modo local offline (sin API key en el servidor)
                    </div>
                  )}

                  <span className={`block text-[9px] text-right mt-1 font-mono ${
                    isUser ? "text-indigo-200" : "text-slate-400"
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-2.5 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 font-mono font-black text-indigo-700 flex items-center justify-center shrink-0 text-xs animate-spin">
              <Loader className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-50 text-slate-500 text-xs font-sans rounded-2xl px-3 py-2 italic flex items-center gap-1.5">
              <span>Pensando la mejor respuesta...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing box input */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-50 border-t border-gray-150 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta de Git... (ej. ¿Qué es HEAD?)"
          className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-slate-800 font-sans text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
