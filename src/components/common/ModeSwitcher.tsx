import React from 'react';
import { BookOpen, Zap, FileText } from 'lucide-react';

export type AppMode = 'exercises' | 'playground' | 'cheatsheet';

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onSelectMode,
}) => {
  return (
    <div
      className="h-8 inline-flex items-center border-2 border-ink bg-white p-0.5 text-xs font-bold shrink-0 shadow-brutal-xs"
      role="tablist"
      aria-label="Application View Mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={currentMode === 'exercises'}
        onClick={() => currentMode !== 'exercises' && onSelectMode('exercises')}
        className={`h-full inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 text-xs leading-none transition-colors ${
          currentMode === 'exercises'
            ? 'bg-duck text-ink border border-ink shadow-brutal-xs font-black cursor-default'
            : 'text-ink-muted hover:text-ink hover:bg-slate-100 cursor-pointer font-bold'
        }`}
        title="Interactive SQL Exercises"
      >
        <BookOpen size={13} className="shrink-0" />
        <span className="hidden sm:inline">Exercises</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentMode === 'cheatsheet'}
        onClick={() => currentMode !== 'cheatsheet' && onSelectMode('cheatsheet')}
        className={`h-full inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 text-xs leading-none transition-colors ${
          currentMode === 'cheatsheet'
            ? 'bg-duck text-ink border border-ink shadow-brutal-xs font-black cursor-default'
            : 'text-ink-muted hover:text-ink hover:bg-slate-100 cursor-pointer font-bold'
        }`}
        title="DuckDB SQL Cheat Sheet & Reference"
      >
        <FileText size={13} className="shrink-0" />
        <span className="hidden sm:inline">Cheat Sheet</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentMode === 'playground'}
        onClick={() => currentMode !== 'playground' && onSelectMode('playground')}
        className={`h-full inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 text-xs leading-none transition-colors ${
          currentMode === 'playground'
            ? 'bg-duck text-ink border border-ink shadow-brutal-xs font-black cursor-default'
            : 'text-ink-muted hover:text-ink hover:bg-slate-100 cursor-pointer font-bold'
        }`}
        title="Analytical DuckDB SQL Playground"
      >
        <Zap size={13} className="shrink-0" />
        <span className="hidden xs:inline">Playground</span>
      </button>
    </div>
  );
};
