import { useState } from "react";
import { Lesson } from "../types";
import { BookOpen, CheckCircle2, ArrowLeft, ArrowRight, RefreshCw, HelpCircle, Code } from "lucide-react";

interface LessonsPanelProps {
  lessons: Lesson[];
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  onResetLessons: () => void;
}

export default function LessonsPanel({
  lessons,
  activeLessonIndex,
  setActiveLessonIndex,
  onResetLessons,
}: LessonsPanelProps) {
  const [showExplanation, setShowExplanation] = useState(true);
  const currentLesson = lessons[activeLessonIndex];

  const handleNext = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  // Calculate overall percentage
  const completedLessons = lessons.filter(l => l.completed).length;
  const progressPercent = Math.round((completedLessons / lessons.length) * 100);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden" id="lessons-panel">
      {/* Head banner with progress */}
      <div className="p-5 border-b border-gray-100 bg-linear-to-r from-slate-50 to-white">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-sans font-medium text-lg leading-tight text-slate-900">
                Aprende Git Interactivamente
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Domina el control de versiones paso a paso
              </p>
            </div>
          </div>
          <button
            onClick={onResetLessons}
            title="Reiniciar progreso"
            className="p-1 px-2.5 text-xs font-sans text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        </div>

        {/* Progress tracker */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-sans font-medium text-indigo-600">
              Progreso General: {progressPercent}%
            </span>
            <span className="text-slate-500 font-mono">
              {completedLessons} / {lessons.length} completados
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Navigation Rail / Top-Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto p-2 bg-slate-50/70 gap-1 scrollbar-none">
        {lessons.map((lesson, idx) => {
          const isActive = idx === activeLessonIndex;
          const isCompleted = lesson.completed;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonIndex(idx)}
              className={`flex-none font-sans text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-transparent ${
                isActive
                  ? "bg-white text-indigo-700 font-semibold shadow-xs border-slate-200"
                  : "text-slate-600 hover:bg-white/80"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 fill-green-50/10" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-indigo-600" : "bg-slate-300"}`} />
              )}
              {lesson.shortTitle}
            </button>
          );
        })}
      </div>

      {/* Primary body scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Lección {activeLessonIndex + 1}
          </span>
          <h3 className="font-sans font-medium text-xl text-slate-900 mt-2">
            {currentLesson.title}
          </h3>
          <p className="font-sans text-sm text-slate-600 mt-2 italic leading-relaxed border-l-2 border-indigo-200 pl-3">
            "{currentLesson.intro}"
          </p>
        </div>

        {/* Visual Analogy Box */}
        <div className="p-4 bg-amber-50/40 border border-amber-100/70 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold font-sans">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>La Analogía Cotidiana:</span>
          </div>
          <p className="font-sans text-sm text-slate-700 leading-relaxed">
            {currentLesson.concept}
          </p>
        </div>

        {/* Goal Box */}
        <div className={`p-4 rounded-xl border transition-colors ${
          currentLesson.completed 
            ? "bg-green-50/60 border-green-200" 
            : "bg-indigo-50/60 border-indigo-100"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`p-1 rounded-md ${currentLesson.completed ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"}`}>
                <Code className="w-4 h-4" />
              </span>
              <span className="font-sans font-semibold text-sm text-slate-800">
                Objetivo Práctico:
              </span>
            </div>
            {currentLesson.completed && (
              <span className="font-mono text-xs font-semibold text-green-700 bg-green-100/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Cumplido!
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-slate-700 mt-2 leading-relaxed">
            {currentLesson.interactiveGoal}
          </p>
          {currentLesson.targetCommand && !currentLesson.completed && (
            <div className="mt-3 bg-white/80 p-2 rounded-lg border border-slate-200/60 font-mono text-[11px] text-slate-700 flex items-center justify-between">
              <span>Escribe en consola: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-black text-indigo-600">{currentLesson.targetCommand}</code></span>
            </div>
          )}
        </div>

        {/* Dynamic Details (Markdown Explanation Toggle) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-sans font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              {showExplanation ? "Ocultar detalles técnicos" : "Mostrar explicación técnica →"}
            </button>
          </div>

          {showExplanation && (
            <div className="text-sm font-sans text-slate-700 space-y-4 bg-slate-50 p-4 border border-slate-100 rounded-xl leading-relaxed whitespace-pre-line">
              {currentLesson.contentMarkdown}
            </div>
          )}
        </div>
      </div>

      {/* Bottom pagination */}
      <div className="p-4 border-t border-gray-100 bg-slate-50/40 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={activeLessonIndex === 0}
          className="p-1 px-3 border border-slate-200 text-xs font-sans rounded-lg flex items-center gap-1.5 disabled:opacity-40 hover:bg-white transition-colors text-slate-600 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        <span className="font-mono text-xs text-slate-500 select-none">
          {activeLessonIndex + 1} de {lessons.length}
        </span>

        <button
          onClick={handleNext}
          disabled={activeLessonIndex === lessons.length - 1}
          className="p-1 px-3 border border-slate-200 text-xs font-sans rounded-lg flex items-center gap-1.5 disabled:opacity-40 hover:bg-white transition-colors text-slate-600 disabled:pointer-events-none"
        >
          Siguiente
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
