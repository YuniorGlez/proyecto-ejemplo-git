import React, { useState } from "react";
import { GitFile, CommitNode } from "../types";
import { 
  Folder, 
  Database, 
  GitBranch, 
  Plus, 
  Edit2, 
  Trash, 
  ChevronRight, 
  Play, 
  CloudRain, 
  FolderCheck,
  Zap,
  RotateCcw,
  Globe
} from "lucide-react";

interface VisualSimulatorProps {
  files: GitFile[];
  commits: CommitNode[];
  currentBranch: string;
  branches: string[];
  isInitialized: boolean;
  onInitialize: () => void;
  onAddFile: (name: string) => void;
  onEditFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
  onStageFile: (name: string) => void;
  onUnstageFile: (name: string) => void;
  onStageAll: () => void;
  onCommit: (message: string) => void;
  onPush: () => void;
  remoteCommits: CommitNode[];
  onSelectBranch: (branch: string) => void;
  onCreateBranch: (branch: string) => void;
}

export default function VisualSimulator({
  files,
  commits,
  currentBranch,
  branches,
  isInitialized,
  onInitialize,
  onAddFile,
  onEditFile,
  onDeleteFile,
  onStageFile,
  onUnstageFile,
  onStageAll,
  onCommit,
  onPush,
  remoteCommits,
  onSelectBranch,
  onCreateBranch,
}: VisualSimulatorProps) {
  const [newFileName, setNewFileName] = useState("");
  const [commitMsg, setCommitMsg] = useState("");
  const [showNewFileForm, setShowNewFileForm] = useState(false);
  const [showNewBranchForm, setShowNewBranchForm] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [selectedCommit, setSelectedCommit] = useState<CommitNode | null>(null);

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    let name = newFileName.trim();
    if (!name.includes(".")) name += ".js"; // default extension
    onAddFile(name);
    setNewFileName("");
    setShowNewFileForm(false);
  };

  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    onCreateBranch(newBranchName.trim());
    setNewBranchName("");
    setShowNewBranchForm(false);
  };

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMsg.trim()) return;
    onCommit(commitMsg.trim());
    setCommitMsg("");
  };

  // Filter files by their respective zones
  // Working Directory: all files that are untracked, modified, or staged (since we can edit staged files, but for simplicity let's map:
  // - untracked & modified: visible in Working Directory
  // - staged: visible in Staging Area
  const workingFiles = files.filter(f => f.status === "untracked" || f.status === "modified");
  const stagedFiles = files.filter(f => f.status === "staged");

  return (
    <div className="flex flex-col gap-6 w-full" id="visual-simulator">
      
      {/* Header Controls */}
      <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <GitBranch className="w-5 h-5 text-emerald-600" />
          </span>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">Rama Activa</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-800 font-mono font-bold text-sm bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                {currentBranch}
              </span>
              <select 
                value={currentBranch} 
                onChange={(e) => onSelectBranch(e.target.value)}
                disabled={!isInitialized}
                className="text-xs font-sans text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isInitialized ? (
            <button
              onClick={onInitialize}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-sm font-semibold rounded-xl flex items-center gap-2 transition-smooth shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              Inicializar Repo (git init)
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowNewFileForm(!showNewFileForm)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-sans text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                Crear Archivo
              </button>

              <button
                onClick={() => setShowNewBranchForm(!showNewBranchForm)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-sans text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                Crear Rama (-b)
              </button>
            </>
          )}
        </div>
      </div>

      {/* New File Trigger Form Pop-up / Overlay in-situ */}
      {showNewFileForm && (
        <form onSubmit={handleCreateFileSubmit} className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl flex items-center gap-3 transition-all">
          <div className="flex-1">
            <label className="block text-xs font-sans text-amber-900 font-semibold mb-1">Nombre del archivo nuevo (ej. index.html, script.js):</label>
            <input
              type="text"
              required
              placeholder="ejemplo.html"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full text-sm font-mono bg-white border border-amber-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => { setShowNewFileForm(false); setNewFileName(""); }}
              className="px-3 py-1.5 text-xs font-sans hover:bg-amber-100 rounded-lg text-amber-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold rounded-lg shadow-sm"
            >
              Crear
            </button>
          </div>
        </form>
      )}

      {/* New Branch Trigger Form Pop-up / Overlay in-situ */}
      {showNewBranchForm && (
        <form onSubmit={handleCreateBranchSubmit} className="bg-green-50/70 border border-green-200 p-4 rounded-xl flex items-center gap-3 transition-all">
          <div className="flex-1">
            <label className="block text-xs font-sans text-green-900 font-semibold mb-1">Nombre de la nueva rama (rama paralela):</label>
            <input
              type="text"
              required
              placeholder="feature-diseño"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="w-full text-sm font-mono bg-white border border-green-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => { setShowNewBranchForm(false); setNewBranchName(""); }}
              className="px-3 py-1.5 text-xs font-sans hover:bg-green-100 rounded-lg text-green-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-semibold rounded-lg shadow-sm"
            >
              Crear Rama
            </button>
          </div>
        </form>
      )}

      {!isInitialized ? (
        <div className="p-10 border border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-100 text-slate-400 rounded-full animate-bounce">
            <Database className="w-10 h-10" />
          </div>
          <div className="max-w-md">
            <h4 className="font-sans font-semibold text-slate-800 text-lg">Tu Repositorio está apagado</h4>
            <p className="font-sans text-sm text-slate-500 mt-1">
              Para empezar, activa el sistema de control de versiones. Esto habilitará las tres zonas mágicas de Git (Working, Staging y Local Repository).
            </p>
          </div>
          <button
            onClick={onInitialize}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            Inicializar Git Ahora
          </button>
        </div>
      ) : (
        /* The Three Main Columns of Git Stage Visuals */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Working Directory */}
          <div className="flex flex-col bg-white border border-amber-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-600" />
                <span className="font-sans font-semibold text-sm text-amber-900">1. Directorio de Trabajo</span>
              </div>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                {workingFiles.length} cambios
              </span>
            </div>

            <div className="p-4 flex-1 min-h-[300px] flex flex-col justify-between space-y-4 bg-amber-50/10">
              <div className="space-y-3">
                {workingFiles.length === 0 ? (
                  <div className="text-center py-10">
                    <FolderCheck className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 font-sans mt-2">No hay cambios pendientes.</p>
                    <button
                      onClick={() => onAddFile(`archivo-${files.length + 1}.js`)}
                      className="mt-3 text-xs text-emerald-600 font-semibold font-sans hover:underline flex items-center gap-1 mx-auto"
                    >
                      <Plus className="w-3 h-3" /> Crear archivo rápido
                    </button>
                  </div>
                ) : (
                  workingFiles.map((file) => (
                    <div 
                      key={file.name} 
                      className={`p-3 border rounded-xl flex items-center justify-between gap-3 transition-all ${
                        file.status === "untracked" 
                          ? "border-slate-200 bg-white" 
                          : "border-amber-200 bg-amber-50/30"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-800 font-medium truncate block">
                            {file.name}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                            file.status === "untracked" 
                              ? "bg-slate-100 text-slate-600" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {file.status === "untracked" ? "untracked" : "modified"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                          {file.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditFile(file.name)}
                          title="Modificar contenido"
                          className="p-1 text-slate-400 hover:text-amber-800 hover:bg-amber-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.name)}
                          title="Eliminar archivo"
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onStageFile(file.name)}
                          title="Preparar cambio (git add)"
                          className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded ml-1"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {workingFiles.length > 0 && (
                <button
                  onClick={onStageAll}
                  className="w-full py-1.5 border border-dashed border-emerald-200 hover:border-emerald-400 text-emerald-700 hover:bg-emerald-50 font-sans text-xs font-semibold rounded-lg text-center transition-colors cursor-pointer"
                >
                  Preparar Todos (git add .)
                </button>
              )}
            </div>
          </div>

          {/* Column 2: Staging Area */}
          <div className="flex flex-col bg-white border border-green-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-green-50/50 border-b border-green-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-600" />
                <span className="font-sans font-semibold text-sm text-green-900">2. Área de Preparación</span>
              </div>
              <span className="text-[10px] font-mono bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded-full">
                {stagedFiles.length} listos
              </span>
            </div>

            <div className="p-4 flex-1 min-h-[300px] flex flex-col justify-between space-y-4 bg-green-50/10">
              <div className="space-y-3">
                {stagedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      =
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-2">
                      Mesa vacía. Utiliza <code className="bg-slate-100 p-0.5 rounded">add</code> a la izquierda para preparar archivos.
                    </p>
                  </div>
                ) : (
                  stagedFiles.map((file) => (
                    <div 
                      key={file.name} 
                      className="p-3 border border-green-200 bg-white shadow-xs rounded-xl flex items-center justify-between gap-3 decoration-clone"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-green-900 font-bold truncate block">
                            {file.name}
                          </span>
                          <span className="text-[8px] font-mono bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded-full">
                            staged
                          </span>
                        </div>
                        <p className="text-[10px] text-green-800/80 font-mono truncate mt-0.5">
                          {file.content}
                        </p>
                      </div>

                      <button
                        onClick={() => onUnstageFile(file.name)}
                        title="Sacar de Staging"
                        className="p-1 text-slate-400 hover:text-amber-700 hover:bg-slate-100 rounded shrink-0 text-xs font-sans border border-slate-200"
                      >
                        sacar
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Commit Creation Form */}
              {stagedFiles.length > 0 && (
                <form onSubmit={handleCommitSubmit} className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-sans font-semibold text-slate-500">
                    Sellar cambios con un Commit:
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Mensaje de confirmación..."
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                    className="w-full text-xs font-sans border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white font-sans text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    Confirmar Guardado (git commit)
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 3: Local Repository */}
          <div className="flex flex-col bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-sans font-semibold text-sm text-slate-800">3. Repositorio Local</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-full">
                {commits.length} commits
              </span>
            </div>

            <div className="p-4 flex-1 min-h-[300px] flex flex-col justify-between space-y-4">
              <div className="space-y-3 overflow-y-auto max-h-[320px] scrollbar-none pr-1">
                {commits.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300 font-bold">
                      0
                    </div>
                    <p className="text-xs font-sans mt-2">
                      Aún sin registros. Realiza tu primer commit arriba para ver la historia del proyecto.
                    </p>
                  </div>
                ) : (
                  [...commits].reverse().map((node, idx) => {
                    const isHead = idx === 0;
                    const isSelected = selectedCommit?.sha === node.sha;
                    return (
                      <div 
                        key={node.sha} 
                        onClick={() => setSelectedCommit(isSelected ? null : node)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? "border-emerald-600 bg-emerald-50/40 shadow-xs" 
                            : isHead 
                              ? "border-slate-300 bg-slate-50 hover:bg-slate-100" 
                              : "border-slate-1 w-full hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 pulse-glow flex shrink-0" />
                            <span className="font-mono text-xs font-bold text-slate-800 line-clamp-1">
                              {node.message}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded self-baseline shrink-0">
                            {node.sha}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>{node.branch}</span>
                          <span>•</span>
                          <span>{node.author}</span>
                        </div>

                        {/* HEAD tag indicator */}
                        {isHead && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-[8px] font-mono px-1 bg-amber-100 text-amber-800 rounded font-bold uppercase tracking-wider">
                              HEAD
                            </span>
                            <span className="text-[8px] font-mono px-1 bg-emerald-100 text-emerald-800 rounded font-bold uppercase tracking-wider">
                              {node.branch}
                            </span>
                          </div>
                        )}

                        {/* Files committed inspector */}
                        {isSelected && (
                          <div className="mt-3 p-2 bg-white rounded-lg border border-slate-100 space-y-1 text-[10px]">
                            <span className="font-sans font-semibold text-slate-600 block mb-1">Archivos guardados:</span>
                            {node.files.map((f, i) => (
                              <div key={i} className="flex justify-between font-mono text-slate-500">
                                <span>📄 {f.name}</span>
                                <span className="text-[8px] uppercase">{f.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {commits.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={onPush}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-200" />
                    Subir cambios a GitHub (git push)
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* GitHub cloud remote box simulation */}
      {isInitialized && commits.length > 0 && (
        <div className="bg-slate-50/70 p-4 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Globe className="w-6 h-6 text-emerald-600" />
            </span>
            <div>
              <h4 className="font-sans font-semibold text-slate-800 text-sm flex items-center gap-2">
                Simulador de GitHub (Repositorio Remoto)
              </h4>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Representa el respaldo remoto interactivo alojado en los servidores de la nube.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Sincronización</span>
              <span className={`text-xs font-sans font-semibold ${
                remoteCommits.length === commits.length 
                  ? "text-green-600" 
                  : "text-amber-600 font-bold"
              }`}>
                {remoteCommits.length === commits.length 
                  ? "✓ Sincronizado al 100%" 
                  : `⚠️ ${commits.length - remoteCommits.length} commits pendientes por push`
                }
              </span>
            </div>

            <div className="flex -space-x-1.5 overflow-hidden">
              {remoteCommits.slice(-3).map((rc, i) => (
                <div 
                  key={rc.sha} 
                  title={`Commit en GitHub: ${rc.message}`}
                  className="w-6 h-6 rounded-full bg-emerald-600 text-[10px] text-white font-mono font-bold flex items-center justify-center border-2 border-white uppercase"
                >
                  {rc.sha.slice(0, 2)}
                </div>
              ))}
              {remoteCommits.length === 0 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-[11px] text-slate-400 flex items-center justify-center border-2 border-white font-mono">
                  -
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
