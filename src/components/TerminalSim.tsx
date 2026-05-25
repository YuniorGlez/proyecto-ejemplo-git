import React, { useState, useRef, useEffect } from "react";
import { TerminalLine } from "../types";
import { Terminal, Send, HelpCircle } from "lucide-react";

interface TerminalSimProps {
  history: TerminalLine[];
  onCommand: (command: string) => void;
}

export default function TerminalSim({ history, onCommand }: TerminalSimProps) {
  const [input, setInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input.trim());
    setInput("");
  };

  const handleQuickCommand = (cmd: string) => {
    onCommand(cmd);
  };

  const suggestions = [
    "git init",
    "git status",
    "git add .",
    "git commit -m \"Hola Git\"",
    "git push",
    "git branch",
    "git checkout -b desarrollo"
  ];

  return (
    <div className="flex flex-col h-[320px] bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden" id="terminal-sim">
      {/* Top Bar resembles MacOS style window */}
      <div className="px-4 py-2.5 bg-slate-800 flex justify-between items-center sm:px-5">
        <div className="flex items-center gap-2">
          {/* Mock Window Dots */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 block shrink-0" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 block shrink-0" />
            <span className="w-3 h-3 rounded-full bg-green-500 block shrink-0" />
          </div>
          <span className="font-mono text-xs text-slate-400 ml-2 select-none flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            Consola interactiva: terminal-git
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 select-none hidden sm:block">
          bash • project-git
        </div>
      </div>

      {/* Suggested Quick commands pills */}
      <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 shrink-0">
          <HelpCircle className="w-3 h-3" /> Comandos Rápidos:
        </span>
        <div className="flex gap-1.5">
          {suggestions.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleQuickCommand(cmd)}
              className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-700 text-slate-200 hover:bg-indigo-600 hover:text-white rounded border border-slate-600 transition-colors select-none shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal logs content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2.5">
        <div className="text-slate-500 text-[10px] select-none italic pb-1">
          ### ¡Prueba comandos reales! Escríbelos abajo o usa los botones rápidos.
        </div>
        
        {history.map((line, idx) => {
          let color = "text-slate-300";
          if (line.type === "command") color = "text-indigo-400 font-bold";
          else if (line.type === "error") color = "text-red-400";
          else if (line.type === "success") color = "text-green-400 font-semibold";
          else if (line.type === "info") color = "text-cyan-400";

          return (
            <div key={idx} className="leading-relaxed whitespace-pre-wrap select-text">
              {line.type === "command" ? (
                <span>
                  <span className="text-green-500">invitado@pc:~/repo$</span>{" "}
                  <span className={color}>{line.text}</span>
                </span>
              ) : (
                <span className={color}>{line.text}</span>
              )}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Live typing command input form */}
      <form onSubmit={handleSubmit} className="p-2.5 bg-slate-800/60 border-t border-slate-850 flex items-center gap-2">
        <span className="font-mono text-xs text-green-500 font-semibold pl-2 select-none shrink-0">
          invitado@pc:~/repo$
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un comando... (ej. git status)"
          className="flex-1 p-1 bg-transparent border-none text-slate-100 font-mono text-xs focus:outline-hidden focus:ring-0 placeholder:text-slate-600 outline-hidden"
        />
        <button
          type="submit"
          className="p-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
        >
          Enviar
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
