/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { GitFile, CommitNode, TerminalLine, Lesson, ChatMessage } from "./types";
import { initialLessons } from "./lessonsData";
import LessonsPanel from "./components/LessonsPanel";
import VisualSimulator from "./components/VisualSimulator";
import TerminalSim from "./components/TerminalSim";
import GitAIAssistant from "./components/GitAIAssistant";
import { 
  GitPullRequest, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Terminal as TermIcon, 
  Github, 
  AlertCircle,
  Clock,
  Code
} from "lucide-react";

export default function App() {
  // 1. Git Repository State
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentBranch, setCurrentBranch] = useState("main");
  const [branches, setBranches] = useState(["main"]);
  const [files, setFiles] = useState<GitFile[]>([]);
  const [commits, setCommits] = useState<CommitNode[]>([]);
  const [remoteCommits, setRemoteCommits] = useState<CommitNode[]>([]);

  // 2. Interactive Lessons Progress
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // 3. Simulated Output Terminal history
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: "¡Bienvenido a la consola interactiva de Git!", type: "info" },
    { text: "Escribe 'git init' para comenzar la lección 1 o haz clic en los botones rápidos.", type: "info" },
  ]);

  // 4. AISmart Tutor chat logs
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Helper: Trigger terminal system log
  const writeLog = (text: string, type: "command" | "output" | "error" | "success" | "info" = "output") => {
    setTerminalHistory(prev => [...prev, { text, type }]);
  };

  // Check lesson objective completion
  const checkLessonComplete = (lessonId: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === lessonId && !l.completed) {
        writeLog(`🎯 ¡Objetivo de la Lección Completo: ${l.shortTitle}! Siguiente lección habilitada.`, "success");
        return { ...l, completed: true };
      }
      return l;
    }));
  };

  // ACTION: git init
  const handleGitInit = () => {
    if (isInitialized) {
      writeLog("git init", "command");
      writeLog("Espacio de nombres existente: Re-inicializado el repositorio Git en /home/invitado/repo/.git/", "info");
      return;
    }

    writeLog("git init", "command");
    setIsInitialized(true);
    setFiles([
      { name: "index.html", content: "<h1>Hola Mundo</h1>", status: "untracked" },
      { name: "estilos.css", content: "body { background: #f0f2f5; }", status: "untracked" }
    ]);
    writeLog("Repositorio de Git vacío inicializado con éxito en /home/invitado/repo/.git/", "success");
    writeLog("Se han detectado archivos sin seguimiento (untracked). Intenta 'git status'.", "output");

    // Complete lesson 1
    checkLessonComplete("init");
  };

  // ACTION: Add File
  const handleAddFile = (name: string) => {
    if (!isInitialized) {
      writeLog("Error: Debes inicializar el repositorio primero (git init).", "error");
      return;
    }
    if (files.some(f => f.name === name)) {
      writeLog(`El archivo '${name}' ya existe en el directorio de trabajo.`, "error");
      return;
    }
    const newFile: GitFile = {
      name,
      content: `// Código inicial para ${name}`,
      status: "untracked"
    };
    setFiles(prev => [...prev, newFile]);
    writeLog(`Creado archivo: ${name} (untracked)`, "output");
  };

  // ACTION: Edit File
  const handleEditFile = (name: string) => {
    setFiles(prev => prev.map(f => {
      if (f.name === name) {
        // transition committed or staged to modified
        const newStatus = f.status === "committed" || f.status === "staged" ? "modified" : f.status;
        writeLog(`Modificado contenido de: ${name}`, "info");
        return { 
          ...f, 
          content: `${f.content}\n// Modificación agregada en un guardado interactivo`, 
          status: newStatus as any 
        };
      }
      return f;
    }));
    
    // Trigger Staging lesson tracking if active
    if (lessons[activeLessonIndex].id === "add") {
      writeLog("Archivo modificado. Ahora puedes usar 'git add' para prepararlo.", "output");
    }
  };

  // ACTION: Delete File
  const handleDeleteFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
    writeLog(`Eliminado archivo: ${name}`, "error");
  };

  // ACTION: Stage File (individual git add)
  const handleStageFile = (name: string) => {
    if (!isInitialized) {
      writeLog("Error: Debes inicializar el repositorio de Git.", "error");
      return;
    }
    setFiles(prev => prev.map(f => {
      if (f.name === name) {
        return { ...f, status: "staged" };
      }
      return f;
    }));
    writeLog(`git add ${name}`, "command");
    writeLog(`Preparado para commit: ${name}`, "success");

    checkLessonComplete("add");
  };

  // ACTION: Stage All (git add .)
  const handleStageAll = () => {
    if (!isInitialized) {
      writeLog("Error: Debes inicializar el repositorio primero.", "error");
      return;
    }
    setFiles(prev => prev.map(f => {
      if (f.status === "untracked" || f.status === "modified") {
        return { ...f, status: "staged" };
      }
      return f;
    }));
    writeLog("git add .", "command");
    writeLog("Preparados todos los cambios del directorio de trabajo en la mesa de Staging.", "success");

    checkLessonComplete("add");
  };

  // ACTION: Unstage (git reset)
  const handleUnstageFile = (name: string) => {
    setFiles(prev => prev.map(f => {
      if (f.name === name && f.status === "staged") {
        return { ...f, status: "modified" };
      }
      return f;
    }));
    writeLog(`git restore --staged ${name}`, "command");
    writeLog(`Retirado de Staging: ${name} (ahora modificado localmente)`, "info");
  };

  // ACTION: Commit staged files
  const handleCommit = (message: string) => {
    if (!isInitialized) {
      writeLog("Error: Repositorio no inicializado.", "error");
      return;
    }
    
    const staged = files.filter(f => f.status === "staged");
    if (staged.length === 0) {
      writeLog("git commit -m \"" + message + "\"", "command");
      writeLog("Error: No hay ningún cambio preparado en Staging para confirmar. Ejecuta 'git add' primero.", "error");
      return;
    }

    const sha = Math.random().toString(16).substring(2, 9);
    const newCommit: CommitNode = {
      sha,
      message,
      author: "Novato <novato@git.com>",
      timestamp: new Date().toLocaleTimeString(),
      branch: currentBranch,
      files: staged.map(f => ({ name: f.name, status: "staged" }))
    };

    setCommits(prev => [...prev, newCommit]);
    
    // Transition files to committed status
    setFiles(prev => prev.map(f => {
      if (f.status === "staged") {
        return { ...f, status: "committed" };
      }
      return f;
    }));

    writeLog(`git commit -m "${message}"`, "command");
    writeLog(`[${currentBranch} ${sha}] ${message}`, "success");
    writeLog(` ${staged.length} archivos cambiados, confirmados con éxito.`, "output");

    checkLessonComplete("commit");
  };

  // ACTION: git push
  const handlePush = () => {
    if (!isInitialized) {
      writeLog("Error: No inicializado.", "error");
      return;
    }
    if (commits.length === 0) {
      writeLog("git push", "command");
      writeLog("Todo sincronizado. No hay commits locales para subir.", "output");
      return;
    }

    writeLog("git push origin " + currentBranch, "command");
    writeLog("Enumerando objetos: " + commits.length * 3 + ", listo.", "output");
    writeLog("Escribiendo objetos: 100% (" + commits.length + " commits)...", "output");
    writeLog("Sincronizando con github.com:novato/mi-repositorio.git", "info");
    writeLog(`Rama '${currentBranch}' configurada para emular '${currentBranch}' en origin.`, "success");

    setRemoteCommits([...commits]);

    checkLessonComplete("push");
  };

  // ACTION: Change active branch
  const handleSelectBranch = (bName: string) => {
    setCurrentBranch(bName);
    writeLog(`git checkout ${bName}`, "command");
    writeLog(`Cambiado a la rama '${bName}'`, "success");
    
    if (lessons[activeLessonIndex].id === "branch" && bName !== "main") {
      checkLessonComplete("branch");
    }
  };

  // ACTION: Create experimental branch
  const handleCreateBranch = (bName: string) => {
    if (branches.includes(bName)) {
      writeLog(`Ya existe la rama '${bName}'`, "error");
      return;
    }
    setBranches(prev => [...prev, bName]);
    setCurrentBranch(bName);
    writeLog(`git checkout -b ${bName}`, "command");
    writeLog(`Creada y activada nueva rama: '${bName}'`, "success");

    checkLessonComplete("branch");
  };

  // COMMAND LINE INTERPRETER (CLI engine)
  const handleTerminalCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    writeLog(cmd, "command");

    // Help menu interpreter
    if (cmd === "help") {
      writeLog("Comandos interactivos de entrenamiento disponibles:", "info");
      writeLog("  git init             - Inicializa el repositorio local", "output");
      writeLog("  git status           - Muestra el estado actual del proyecto", "output");
      writeLog("  git add <archivo>    - Prepara archivos (puedes usar 'git add .')", "output");
      writeLog("  git commit -m 'msj'  - Crea un checkpoint permanente de Staging", "output");
      writeLog("  git push             - Sube tus commits locales a GitHub", "output");
      writeLog("  git branch           - Lista las ramas", "output");
      writeLog("  git checkout -b <n>  - Crea y salta a otra rama", "output");
      writeLog("  git checkout <n>     - Salta a una rama existente", "output");
      writeLog("  clear                - Limpia la pantalla de la consola", "output");
      return;
    }

    if (cmd === "clear") {
      setTerminalHistory([]);
      return;
    }

    // Command verification check
    if (!cmd.startsWith("git")) {
      writeLog(`bash: comando no reconocido: '${cmd}'. ¿Buscabas un comando de git? Prueba con 'git status' o pide ayuda con 'help'.`, "error");
      return;
    }

    const parts = cmd.split(/\s+/);
    const sub = parts[1];

    if (!isInitialized && sub !== "init") {
      writeLog("fatal: no es un repositorio de Git (ni ninguno de los directorios superiores): .git. Ejecuta 'git init' primero.", "error");
      return;
    }

    switch (sub) {
      case "init":
        handleGitInit();
        break;

      case "status":
        writeLog("En la rama " + currentBranch, "output");
        
        const untracked = files.filter(f => f.status === "untracked");
        const modified = files.filter(f => f.status === "modified");
        const staged = files.filter(f => f.status === "staged");

        if (staged.length > 0) {
          writeLog("Cambios listos para ser confirmados (staged):", "success");
          writeLog("  (usa 'git restore --staged <archivo>...' para sacar de staging)", "output");
          staged.forEach(f => writeLog(`\tnuevo archivo:   ${f.name}`, "success"));
        }

        if (modified.length > 0) {
          writeLog("Cambios no preparados para el commit:", "error");
          writeLog("  (usa 'git add <archivo>...' para actualizar lo que se confirmará)", "output");
          modified.forEach(f => writeLog(`\tmodificado:      ${f.name}`, "error"));
        }

        if (untracked.length > 0) {
          writeLog("Archivos sin seguimiento (untracked):", "error");
          writeLog("  (usa 'git add <archivo>...' para incluirlo en lo que se confirmará)", "output");
          untracked.forEach(f => writeLog(`\t${f.name}`, "error"));
        }

        if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
          writeLog("nada para confirmar, el árbol de trabajo está limpio.", "success");
        }
        break;

      case "add":
        const fileTarget = parts[2];
        if (!fileTarget) {
          writeLog("fatal: nada especificado, nada añadido.", "error");
        } else if (fileTarget === "." || fileTarget === "*") {
          handleStageAll();
        } else {
          const found = files.find(f => f.name === fileTarget);
          if (found) {
            handleStageFile(fileTarget);
          } else {
            writeLog(`fatal: ruta de archivo '${fileTarget}' no coincide con ningún archivo.`, "error");
          }
        }
        break;

      case "commit":
        // match commit -m "something" using regex
        const mIndex = cmd.indexOf("-m");
        if (mIndex === -1) {
          writeLog("Error: Debes proporcionar un mensaje legible utilizando el flag de mensaje -m. ejemplo: git commit -m \"Hola Git\"", "error");
          return;
        }
        // Extract what is inside quotation marks
        const messageMatch = cmd.slice(mIndex + 2).match(/"([^"]+)"|'([^']+)'/);
        const msgVal = messageMatch ? (messageMatch[1] || messageMatch[2]) : "Mi primer commit";
        handleCommit(msgVal);
        break;

      case "push":
        handlePush();
        break;

      case "branch":
        const branchArg = parts[2];
        if (!branchArg) {
          writeLog(`Ramas locales en tu máquina:`, "info");
          branches.forEach(b => {
            const prefix = b === currentBranch ? "* \u001b[32m" : "  ";
            writeLog(`${prefix}${b}`, b === currentBranch ? "success" : "output");
          });
        } else {
          // Creating branch without switching
          if (branches.includes(branchArg)) {
            writeLog(`fatal: ya existe la rama '${branchArg}'`, "error");
          } else {
            setBranches(prev => [...prev, branchArg]);
            writeLog(`Creada rama local: '${branchArg}' (usa git checkout ${branchArg} para cambiar)`, "success");
          }
        }
        break;

      case "checkout":
        const checkoutArg = parts[2];
        if (!checkoutArg) {
          writeLog("error: se requiere especificar una rama para cambiar.", "error");
          return;
        }
        if (checkoutArg === "-b") {
          const newB = parts[3];
          if (!newB) {
            writeLog("error: proporciona el nombre de la rama. git checkout -b <nueva-rama>", "error");
          } else {
            handleCreateBranch(newB);
          }
        } else {
          if (branches.includes(checkoutArg)) {
            handleSelectBranch(checkoutArg);
          } else {
            writeLog(`error: rama '${checkoutArg}' no encontrada en el repositorio.`, "error");
          }
        }
        break;

      default:
        writeLog(`Comando de Git no emulado: 'git ${sub}'. Prueba con 'git status', 'git add .' o 'git commit'.`, "error");
        break;
    }
  };

  // SEND CHAT TO SERVER-SIDE GEMINI MENTOR
  const handleSendAiMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setAiLoading(true);

    try {
      // Map existing messages to simpler context schema for the AI tutor endpoint
      const historyContext = chatHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: text,
          history: historyContext
        })
      });

      if (!res.ok) {
        throw new Error("La respuesta del Tutor falló.");
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMock: data.isMock
      };

      setChatHistory(prev => [...prev, aiMsg]);

    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: "Vaya, parece que mi conexión se ha congelado temporalmente. ¿Podrías volver a intentarlo? ¡Sigo aquí para guiarte en tu viaje por Git!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  const resetAllProgress = () => {
    setIsInitialized(false);
    setFiles([]);
    setCommits([]);
    setRemoteCommits([]);
    setCurrentBranch("main");
    setBranches(["main"]);
    setLessons(initialLessons.map(l => ({ ...l, completed: false })));
    setActiveLessonIndex(0);
    setTerminalHistory([
      { text: "Reprogreso reiniciado. Repositorio local borrado con éxito.", type: "info" },
      { text: "Escribe 'git init' para comenzar la lección 1.", type: "info" }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md transform hover:rotate-6 transition-transform">
              <GitPullRequest className="w-5 h-5 text-indigo-50" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-white bg-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider scale-95 select-none">
                  BETA
                </span>
                <h1 className="font-sans font-bold text-lg text-slate-950 tracking-tight leading-none">
                  Aprende git como un Yunior
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Aprende el control de versiones más popular de forma visual e intuitiva
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-150 px-2 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 block animate-ping" />
              Entorno Interactivo Activo
            </span>
          </div>

        </div>
      </header>

      {/* Hero section */}
      <div className="bg-indigo-900 text-indigo-100 p-6 sm:p-8 text-center relative overflow-hidden shrink-0 select-none">
        <div className="absolute inset-0 bg-radial from-transparent to-indigo-950/70 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-3">
          <span className="px-2.5 py-1 bg-indigo-500/30 text-indigo-200 text-xs font-semibold rounded-full uppercase tracking-wider">
            ¡De cero a héroe de Git!
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white leading-tight">
            ¿Confundido con la terminal? Visualiza lo que sucede detrás.
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/95 max-w-xl mx-auto leading-relaxed">
            Realiza cambios, agrégalos a tu mesa de preparación (Staging) y tómales fotos (Commits). ¡Cualquier paso interactivo actualizará la consola y viceversa!
          </p>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Split layouts: Left Lesson Panel vs Right Simulator Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Side Lesson Panel (takes 4 columns) */}
          <div className="lg:col-span-4 h-full">
            <LessonsPanel 
              lessons={lessons}
              activeLessonIndex={activeLessonIndex}
              setActiveLessonIndex={setActiveLessonIndex}
              onResetLessons={resetAllProgress}
            />
          </div>

          {/* Graphical Stage Simulator area (takes 8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <VisualSimulator 
              files={files}
              commits={commits}
              currentBranch={currentBranch}
              branches={branches}
              isInitialized={isInitialized}
              onInitialize={handleGitInit}
              onAddFile={handleAddFile}
              onEditFile={handleEditFile}
              onDeleteFile={handleDeleteFile}
              onStageFile={handleStageFile}
              onUnstageFile={handleUnstageFile}
              onStageAll={handleStageAll}
              onCommit={handleCommit}
              onPush={handlePush}
              remoteCommits={remoteCommits}
              onSelectBranch={handleSelectBranch}
              onCreateBranch={handleCreateBranch}
            />
          </div>

        </div>

        {/* Lower splits: Terminal Console Sim on left, Smart AI Mentor on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Simulated Terminal Console */}
          <TerminalSim 
            history={terminalHistory}
            onCommand={handleTerminalCommand}
          />

          {/* AI Tutor Chat module */}
          <GitAIAssistant 
            chatHistory={chatHistory}
            onSendMessage={handleSendAiMessage}
            isLoading={aiLoading}
          />

        </div>

      </main>

      {/* Humble educational footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-6 mt-12 px-4 shrink-0 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-1.5 justify-center">
            <Code className="w-4 h-4 text-indigo-600" />
            <span>Creado para empoderar a nuevos desarrolladores de software.</span>
          </div>
          <div>
            <span>Aprende git como un Yunior • 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
