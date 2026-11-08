import React, { useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { Play, CheckCircle2, RotateCcw, Lightbulb, Eye, ArrowRight, Wand2 } from 'lucide-react';
import { formatSql } from '../../utils/sqlFormatter';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onCheck?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  onPrev?: () => void;
  hasPrev?: boolean;
  onToggleSidebar?: () => void;
  onReset: () => void;
  onHint?: () => void;
  onShowSolution?: () => void;
  hintCount?: number;
  maxHints?: number;
  isChecking?: boolean;
  isRunning: boolean;
  isPlayground?: boolean;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onRun,
  onCheck,
  onNext,
  hasNext,
  onPrev,
  hasPrev,
  onToggleSidebar,
  onReset,
  onHint,
  onShowSolution,
  hintCount = 0,
  maxHints = 0,
  isChecking = false,
  isRunning,
  isPlayground = false,
}) => {
  const handleFormat = useCallback(() => {
    if (!value.trim()) return;
    const formatted = formatSql(value);
    onChange(formatted);
  }, [value, onChange]);

  const handleExecute = onCheck || onRun;

  // Intercept shortcuts inside CodeMirror with highest precedence so they never get swallowed by editor defaults
  const keymapExtension = useMemo(() => {
    return Prec.highest(
      keymap.of([
        {
          key: 'Ctrl-Enter',
          run: () => {
            handleExecute();
            return true;
          },
        },
        {
          key: 'Mod-Enter',
          run: () => {
            handleExecute();
            return true;
          },
        },
        {
          key: 'Alt-Shift-f',
          run: () => {
            handleFormat();
            return true;
          },
        },
        {
          key: 'Alt-Shift-F',
          run: () => {
            handleFormat();
            return true;
          },
        },
        {
          key: 'Alt-f',
          run: () => {
            handleFormat();
            return true;
          },
        },
        {
          key: 'Mod-b',
          run: () => {
            if (onToggleSidebar) onToggleSidebar();
            return true;
          },
        },
        {
          key: 'Ctrl-b',
          run: () => {
            if (onToggleSidebar) onToggleSidebar();
            return true;
          },
        },
        {
          key: 'Alt-ArrowRight',
          run: () => {
            if (onNext) onNext();
            return true;
          },
        },
        {
          key: 'Alt-ArrowLeft',
          run: () => {
            if (onPrev) onPrev();
            return true;
          },
        },
        {
          key: 'Alt-h',
          run: () => {
            if (onHint) onHint();
            return true;
          },
        },
        {
          key: 'Alt-H',
          run: () => {
            if (onHint) onHint();
            return true;
          },
        },
      ])
    );
  }, [handleExecute, onNext, onPrev, onToggleSidebar, onHint, handleFormat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Fallback for container-level key events
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B' || e.code === 'KeyB')) {
        e.preventDefault();
        if (onToggleSidebar) onToggleSidebar();
      } else if (
        e.altKey &&
        (e.key === 'f' || e.key === 'F' || e.code === 'KeyF')
      ) {
        e.preventDefault();
        handleFormat();
      } else if (
        e.altKey &&
        (e.key === 'ArrowLeft' || e.code === 'ArrowLeft')
      ) {
        e.preventDefault();
        if (onPrev) onPrev();
      } else if (
        e.altKey &&
        (e.key === 'ArrowRight' || e.code === 'ArrowRight')
      ) {
        e.preventDefault();
        if (onNext) onNext();
      } else if (
        e.altKey &&
        (e.key === 'h' || e.key === 'H' || e.code === 'KeyH')
      ) {
        e.preventDefault();
        if (onHint) onHint();
      }
    },
    [handleExecute, onPrev, onNext, onToggleSidebar, onHint, handleFormat]
  );

  return (
    <div
      className="flex flex-col border-3 border-ink bg-code-bg rounded-none shadow-brutal overflow-hidden h-[340px] sm:h-[420px] lg:h-[480px] shrink-0"
      onKeyDown={handleKeyDown}
    >
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1E293B] border-b-2 border-code-border text-white text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 border border-black/20" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 border border-black/20" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 border border-black/20" />
          <span className="font-mono text-[11px] sm:text-xs text-slate-400 ml-1 sm:ml-2 truncate">
            {isPlayground ? 'playground.sql (DuckDB)' : 'editor.sql (DuckDB)'}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>
            Run:{' '}
            <kbd className="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
              Ctrl+Enter
            </kbd>
          </span>
          <span>
            Format:{' '}
            <kbd className="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
              Alt+F
            </kbd>
          </span>
          {!isPlayground && (
            <>
              <span>
                Prev:{' '}
                <kbd className="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
                  Alt+←
                </kbd>
              </span>
              <span>
                Next:{' '}
                <kbd className="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
                  Alt+→
                </kbd>
              </span>
            </>
          )}
        </div>
      </div>

      {/* CodeMirror Surface */}
      <div className="flex-1 overflow-auto text-xs sm:text-sm font-mono min-h-[160px]">
        <CodeMirror
          value={value}
          height="100%"
          theme={oneDark}
          extensions={[sql(), keymapExtension]}
          onChange={onChange}
          className="h-full"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
          }}
        />
      </div>

      {/* Action Footer Buttons */}
      <div className="p-2.5 sm:p-3 bg-[#131C2E] border-t-2 border-code-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Check Answer - only in exercise studio when onCheck is passed */}
          {!isPlayground && onCheck && (
            <button
              onClick={onCheck}
              disabled={isChecking || isRunning || !value.trim()}
              title="Check answer against exercise solution (Ctrl+Enter)"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-duck text-ink font-bold border-2 border-ink shadow-brutal-sm hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{isChecking ? 'Checking...' : 'Check Answer'}</span>
            </button>
          )}

          {/* Run Query */}
          <button
            onClick={onRun}
            disabled={isRunning || isChecking || !value.trim()}
            title={isPlayground ? 'Execute SQL query (Ctrl+Enter)' : 'Run query without validating'}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 font-bold border-2 border-ink shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs disabled:opacity-50 cursor-pointer ${
              isPlayground
                ? 'bg-duck text-ink hover:bg-duck-hover'
                : 'bg-surface-card text-ink hover:bg-surface-muted'
            }`}
          >
            <Play size={13} className="fill-ink shrink-0" />
            <span>{isRunning ? 'Running...' : 'Run Query'}</span>
          </button>

          {/* Next Exercise Button */}
          {hasNext && onNext && (
            <button
              onClick={onNext}
              title="Next Exercise (Shortcut: Alt+→)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-400 text-ink font-bold border-2 border-ink shadow-brutal-sm hover:bg-emerald-300 active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs cursor-pointer"
            >
              <span>Next</span>
              <kbd className="hidden sm:inline-block bg-emerald-600/30 text-emerald-950 px-1 py-0.2 rounded text-[10px] font-mono border border-emerald-600/40">
                Alt+→
              </kbd>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {maxHints > 0 && hintCount < maxHints && (
            <button
              onClick={onHint}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700 text-xs font-mono rounded-none cursor-pointer"
            >
              <Lightbulb size={13} className="text-yellow-400 shrink-0" />
              <span>Hint ({hintCount}/{maxHints})</span>
            </button>
          )}

          {maxHints > 0 && hintCount >= maxHints && (
            <button
              onClick={onShowSolution}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-slate-800 text-yellow-300 border border-yellow-600 hover:bg-slate-700 text-xs font-mono rounded-none cursor-pointer"
            >
              <Eye size={13} className="shrink-0" />
              <span>Solution</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleFormat}
            disabled={!value.trim()}
            title="Prettify SQL (Alt+Shift+F or Alt+F)"
            className="p-1.5 text-slate-400 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Wand2 size={15} />
          </button>

          <button
            onClick={onReset}
            title="Reset code"
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
