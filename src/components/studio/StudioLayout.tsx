import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { EXERCISES, MODULES, DATABASES } from '../../data/curriculum';
import { ExerciseDef } from '../../types/curriculum';
import { executeQuery, QueryResult, resetDatabase, switchDatabase } from '../../engine/duckdb';
import { validateUserQuery, ValidationFeedback } from '../../engine/validator';
import { SqlEditor } from './SqlEditor';
import { ResultsTable } from './ResultsTable';
import { SchemaExplorer } from './SchemaExplorer';
import { CurriculumSidebar } from './CurriculumSidebar';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { ConfirmResetModal } from './ConfirmResetModal';
import { BookOpen, Sparkles, ArrowLeft, RefreshCw, ChevronRight, ChevronLeft, HelpCircle, Keyboard, Zap } from 'lucide-react';

interface StudioLayoutProps {
  onBackToLanding: () => void;
  initialExerciseId?: string;
  onSwitchToPlayground?: () => void;
}

const STORAGE_KEY_COMPLETED = 'learn_duckdb_completed_exercises';
const STORAGE_KEY_ASSISTED = 'learn_duckdb_assisted_exercises';
const STORAGE_KEY_CURRENT = 'learn_duckdb_current_id';
const STORAGE_KEY_DRAFTS = 'learn_duckdb_drafts';
const MAX_SAVED_DRAFTS = 50;

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  onBackToLanding,
  initialExerciseId,
  onSwitchToPlayground,
}) => {
  // 1. Progress State
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [assistedIds, setAssistedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSISTED);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // 2. Current Exercise
  const [currentId, setCurrentId] = useState<string>(() => {
    if (initialExerciseId) return initialExerciseId;
    try {
      return localStorage.getItem(STORAGE_KEY_CURRENT) || EXERCISES[0].id;
    } catch {
      return EXERCISES[0].id;
    }
  });

  const currentExercise = EXERCISES.find(e => e.id === currentId) || EXERCISES[0];
  const currentDb = DATABASES[currentExercise.db] || DATABASES.store;
  const currentModule = MODULES.find(m => m.id === currentExercise.module) || MODULES[0];

  // 3. Drafts State
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAFTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editorSql, setEditorSql] = useState<string>(() => {
    return drafts[currentExercise.id] || '';
  });

  // 4. Execution State
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [solutionViewed, setSolutionViewed] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'task' | 'schema'>('editor');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync editor SQL when switching exercises
  useEffect(() => {
    setEditorSql(drafts[currentExercise.id] || '');
    setQueryResult(null);
    setFeedback(null);
    setRevealedHints(0);
    setSolutionViewed(false);
    switchDatabase(currentExercise.db).catch(console.error);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, currentExercise.id);
    } catch {}
  }, [currentExercise.id]);

  // Debounce persisting drafts (300ms) with LRU eviction capped at MAX_SAVED_DRAFTS
  useEffect(() => {
    const timer = setTimeout(() => {
      setDrafts(prev => {
        if (prev[currentExercise.id] === editorSql) return prev;
        // Re-insert to refresh recency in insertion order
        const next = { ...prev };
        delete next[currentExercise.id];
        if (editorSql.trim()) {
          next[currentExercise.id] = editorSql;
        }

        // Evict oldest drafts if over cap
        const keys = Object.keys(next);
        if (keys.length > MAX_SAVED_DRAFTS) {
          const toEvict = keys.slice(0, keys.length - MAX_SAVED_DRAFTS);
          for (const k of toEvict) delete next[k];
        }

        try {
          localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(next));
        } catch {}
        return next;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [editorSql, currentExercise.id]);

  const handleEditorChange = (newVal: string) => {
    setEditorSql(newVal);
  };

  // Run Query Only
  const handleRunQuery = async () => {
    if (!editorSql.trim()) return;
    setIsRunning(true);
    setFeedback(null);
    try {
      await switchDatabase(currentExercise.db);
      const res = await executeQuery(editorSql.trim());
      setQueryResult(res);
    } catch (err: any) {
      setFeedback({
        pass: false,
        message: `Query Error: ${err.message || String(err)}`,
        error: err.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Check Answer against solution
  const handleCheckAnswer = async () => {
    if (!editorSql.trim()) return;
    setIsChecking(true);
    try {
      const validation = await validateUserQuery(currentExercise, 0, editorSql);
      setFeedback(validation);
      if (validation.userResult) {
        setQueryResult(validation.userResult);
      }

      if (validation.pass) {
        const usedAssistance = revealedHints > 0 || solutionViewed;

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });

        // Mark as completed
        setCompletedIds(prev => {
          const next = new Set(prev).add(currentExercise.id);
          try {
            localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify([...next]));
          } catch {}
          return next;
        });

        // Track assisted status
        setAssistedIds(prev => {
          const next = new Set(prev);
          if (usedAssistance) {
            next.add(currentExercise.id);
          } else {
            next.delete(currentExercise.id); // independent solve upgrades lesson to mastered!
          }
          try {
            localStorage.setItem(STORAGE_KEY_ASSISTED, JSON.stringify([...next]));
          } catch {}
          return next;
        });

        if (usedAssistance) {
          setFeedback({
            ...validation,
            message: 'Exercise completed with hints. Solve independently anytime to earn full mastery!',
          });
        }
      }
    } catch (err: any) {
      setFeedback({
        pass: false,
        message: err.message || 'Execution error during verification.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Preview table helper: non-destructively preview table without touching editor query or polluting exercise validation
  const handlePreviewTable = async (tableName: string) => {
    const previewSql = `SELECT * FROM ${tableName};`;
    setIsRunning(true);
    setFeedback(null);
    try {
      await switchDatabase(currentExercise.db);
      const res = await executeQuery(previewSql);
      setQueryResult(res);
      setMobileTab('editor');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    } catch (err: any) {
      setFeedback({
        pass: false,
        message: `Failed to preview table ${tableName}: ${err.message}`,
      });
      setMobileTab('editor');
    } finally {
      setIsRunning(false);
    }
  };

  // Reset database tables
  const handleResetDb = async () => {
    try {
      await resetDatabase(currentExercise.db);
      setFeedback({
        pass: true,
        message: `Database "${currentDb.title}" has been reset to its initial seed data.`,
      });
    } catch (err: any) {
      setFeedback({
        pass: false,
        message: `Failed to reset: ${err.message}`,
      });
    }
  };

  // Progress backup & restore handlers
  const handleExportProgress = () => {
    let assistedCount = 0;
    completedIds.forEach(id => {
      if (assistedIds.has(id)) assistedCount++;
    });
    const masteredCount = completedIds.size - assistedCount;

    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      completedIds: Array.from(completedIds),
      assistedIds: Array.from(assistedIds),
      drafts,
      stats: {
        total: EXERCISES.length,
        completed: completedIds.size,
        mastered: masteredCount,
        withHints: assistedCount,
        draftCount: Object.keys(drafts).length,
      },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `learn-duckdb-progress-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (
    completed: string[],
    assisted: string[],
    importedDrafts?: Record<string, string>
  ) => {
    const nextCompleted = new Set(completed);
    const nextAssisted = new Set(assisted);
    setCompletedIds(nextCompleted);
    setAssistedIds(nextAssisted);
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(Array.from(nextCompleted)));
      localStorage.setItem(STORAGE_KEY_ASSISTED, JSON.stringify(Array.from(nextAssisted)));
    } catch {}

    if (importedDrafts && typeof importedDrafts === 'object') {
      const mergedDrafts = { ...drafts, ...importedDrafts };
      setDrafts(mergedDrafts);
      if (mergedDrafts[currentExercise.id]) {
        setEditorSql(mergedDrafts[currentExercise.id]);
      }
      try {
        localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(mergedDrafts));
      } catch {}
    }

    setFeedback({
      pass: true,
      message: `Successfully restored progress (${nextCompleted.size} exercises, ${
        importedDrafts ? Object.keys(importedDrafts).length : 0
      } drafts)!`,
    });
  };

  const handleOpenResetConfirm = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setCompletedIds(new Set());
    setAssistedIds(new Set());
    setDrafts({});
    try {
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
      localStorage.removeItem(STORAGE_KEY_ASSISTED);
      localStorage.removeItem(STORAGE_KEY_DRAFTS);
    } catch {}
    setIsResetConfirmOpen(false);
    setFeedback({
      pass: true,
      message: 'All learning progress has been reset. You now have a clean slate!',
    });
  };

  // Navigation: Next / Prev exercise
  const currentIndex = EXERCISES.findIndex(e => e.id === currentExercise.id);
  const hasNext = currentIndex < EXERCISES.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = useCallback(() => {
    if (currentIndex < EXERCISES.length - 1) {
      setCurrentId(EXERCISES[currentIndex + 1].id);
    } else {
      setCurrentId(EXERCISES[0].id);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentId(EXERCISES[currentIndex - 1].id);
    } else {
      setCurrentId(EXERCISES[EXERCISES.length - 1].id);
    }
  }, [currentIndex]);

  // Hints
  const currentStep = currentExercise.steps[0];
  const maxHints = currentStep?.hints?.length || 0;

  const handleHint = useCallback(() => {
    setRevealedHints(prev => Math.min(prev + 1, maxHints));
  }, [maxHints]);

  // Global window keyboard listener (capture phase = true ensures it runs before any element swallows it)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const isNext = e.altKey && (e.key === 'ArrowRight' || e.code === 'ArrowRight');
      const isPrev = e.altKey && (e.key === 'ArrowLeft' || e.code === 'ArrowLeft');
      const isToggleSidebar = (e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B' || e.code === 'KeyB');
      const isHint = e.altKey && (e.key === 'h' || e.key === 'H' || e.code === 'KeyH');

      if (isNext) {
        e.preventDefault();
        e.stopPropagation();
        handleNext();
      } else if (isPrev) {
        e.preventDefault();
        e.stopPropagation();
        handlePrev();
      } else if (isToggleSidebar) {
        e.preventDefault();
        e.stopPropagation();
        setSidebarOpen(prev => !prev);
      } else if (isHint) {
        e.preventDefault();
        e.stopPropagation();
        handleHint();
      } else if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const active = document.activeElement;
        const isEditing =
          active?.tagName === 'INPUT' ||
          active?.tagName === 'TEXTAREA' ||
          active?.closest('.cm-editor');
        if (!isEditing) {
          e.preventDefault();
          setIsShortcutsOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [handleNext, handlePrev, handleHint]);

  const handleShowSolution = () => {
    if (currentStep?.solution) {
      setEditorSql(currentStep.solution);
      handleEditorChange(currentStep.solution);
      setSolutionViewed(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Studio Top Navigation Bar */}
      <header className="h-14 border-b-3 border-ink bg-surface-card px-2 sm:px-4 flex items-center justify-between shadow-brutal-sm sticky top-0 z-30">
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold border-2 border-ink hover:bg-duck transition-colors cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            title="Toggle Curriculum Syllabus (Ctrl+B)"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-duck text-ink text-xs font-bold border-2 border-ink shadow-brutal-xs hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <BookOpen size={14} className="shrink-0" />
            <span className="hidden xs:inline">Syllabus</span>
            <span className="font-mono text-[10px] sm:text-[11px] ml-0.5 sm:ml-1 bg-ink text-white px-1 sm:px-1.5 py-0.2">
              {completedIds.size}/{EXERCISES.length}
            </span>
          </button>

          {/* Mode Switcher */}
          {onSwitchToPlayground && (
            <div className="flex items-center border-2 border-ink bg-white p-0.5 text-xs font-bold">
              <button
                type="button"
                className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 bg-duck text-ink border border-ink shadow-brutal-xs font-extrabold cursor-default"
                title="Interactive Exercises"
              >
                <BookOpen size={13} />
                <span className="hidden sm:inline">Exercises</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToPlayground}
                className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
                title="Open DuckDB SQL Playground"
              >
                <Zap size={13} />
                <span className="hidden xs:inline">Playground</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Module title & Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-center max-w-[100px] xs:max-w-[150px] sm:max-w-[220px] md:max-w-md truncate px-1">
          <span className="hidden md:inline font-mono text-[11px] font-bold text-ink-muted uppercase">
            {currentModule.title}
          </span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="font-extrabold text-xs sm:text-sm truncate">{currentExercise.title}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            title="View keyboard shortcuts (?)"
            className="hidden md:flex p-1.5 border-2 border-ink hover:bg-duck text-xs font-mono items-center gap-1 cursor-pointer"
          >
            <Keyboard size={13} />
            <span className="hidden sm:inline text-[11px] font-bold">Shortcuts</span>
          </button>

          <button
            onClick={handleResetDb}
            title="Reset database to seed rows"
            className="p-1.5 border-2 border-ink hover:bg-slate-100 text-xs font-mono flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline text-[11px]">Reset DB</span>
          </button>

          <div className="flex items-center border-2 border-ink">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="p-1.5 hover:bg-duck disabled:opacity-30 disabled:hover:bg-transparent border-r border-ink cursor-pointer"
              title="Previous Exercise"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="p-1.5 hover:bg-duck disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Next Exercise"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Curriculum Drawer */}
        <CurriculumSidebar
          currentExerciseId={currentExercise.id}
          onSelectExercise={id => setCurrentId(id)}
          completedIds={completedIds}
          assistedIds={assistedIds}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onResetProgress={handleOpenResetConfirm}
          onExportProgress={handleExportProgress}
          onImportProgress={handleImportProgress}
        />

        {/* Mobile View Switcher Tabs (Only on < lg screens) */}
        <div className="lg:hidden flex items-center border-b-2 border-ink bg-surface-muted sticky top-14 z-20">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-r border-ink transition-colors cursor-pointer ${
              mobileTab === 'editor'
                ? 'bg-duck text-ink font-black shadow-inner'
                : 'text-ink-muted hover:bg-slate-100'
            }`}
          >
            <Zap size={13} className="shrink-0" />
            <span>Code & Results</span>
            {queryResult && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('task')}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-r border-ink transition-colors cursor-pointer ${
              mobileTab === 'task'
                ? 'bg-duck text-ink font-black shadow-inner'
                : 'text-ink-muted hover:bg-slate-100'
            }`}
          >
            <span>📝 Task</span>
            {revealedHints > 0 && (
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1 font-mono font-bold">
                {revealedHints}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('schema')}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mobileTab === 'schema'
                ? 'bg-duck text-ink font-black shadow-inner'
                : 'text-ink-muted hover:bg-slate-100'
            }`}
          >
            <span>🗄️ Schema</span>
            <span className="text-[10px] bg-ink text-white px-1 font-mono">
              {currentDb.tables.length}
            </span>
          </button>
        </div>

        {/* Studio Workspace Content */}
        <main className="flex-1 p-2.5 sm:p-3 lg:p-4 min-w-0">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* Left Column: Task Description & Schema Explorer */}
            <div
              className={`w-full lg:w-[380px] xl:w-[420px] flex-col gap-4 shrink-0 ${
                mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Task Card: on mobile only shown if mobileTab === 'task' (on desktop always shown) */}
              <div
                className={`border-3 border-ink bg-surface-card p-3.5 sm:p-4 shadow-brutal flex-col gap-3 ${
                  mobileTab === 'schema' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div className="flex items-center justify-between border-b border-ink/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🦆</span>
                    <span className="font-mono text-xs font-bold text-ink-muted uppercase">
                      Exercise {currentIndex + 1} of {EXERCISES.length}
                    </span>
                  </div>
                  {currentExercise.isDuckDbFeature && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 font-bold border border-amber-400">
                      <Sparkles size={11} /> DuckDB Feature
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-ink">
                    {currentExercise.title}
                  </h2>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed font-sans">
                    {currentExercise.concept}
                  </p>
                </div>

                {currentExercise.example && (
                  <div className="bg-slate-100 border border-slate-300 p-2 text-xs font-mono text-slate-800 overflow-x-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Example Syntax
                    </span>
                    <code>{currentExercise.example}</code>
                  </div>
                )}

                {/* Specific Task Objective */}
                <div className="p-3 bg-duck-light border-2 border-duck-dark">
                  <span className="text-[10px] uppercase font-extrabold text-amber-900 block tracking-wider mb-1">
                    Your Task:
                  </span>
                  <p className="text-xs font-bold text-ink leading-snug">
                    {currentStep?.task}
                  </p>
                </div>

                {/* Hints Box if revealed */}
                {revealedHints > 0 && currentStep?.hints && (
                  <div className="space-y-1.5 p-3 bg-amber-50 border border-amber-300 text-xs">
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-[11px]">
                      <HelpCircle size={13} />
                      <span>Hints:</span>
                    </div>
                    {currentStep.hints.slice(0, revealedHints).map((hint, idx) => (
                      <p key={idx} className="text-amber-900 font-mono text-[11px] pl-3 border-l-2 border-amber-400">
                        {hint}
                      </p>
                    ))}
                  </div>
                )}

                {/* Mobile action button on Task tab to switch back to Editor */}
                <div className="lg:hidden pt-1">
                  <button
                    type="button"
                    onClick={() => setMobileTab('editor')}
                    className="w-full py-2.5 px-4 bg-duck text-ink font-extrabold text-xs border-2 border-ink shadow-brutal-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <span>Open Code Editor</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Schema Explorer: on mobile only shown if mobileTab === 'schema' (on desktop always shown) */}
              <div className={mobileTab === 'task' ? 'hidden lg:block' : 'block'}>
                <SchemaExplorer
                  database={currentDb}
                  onPreviewTable={handlePreviewTable}
                />
              </div>
            </div>

            {/* Right Column: Code Editor & Results Grid */}
            <div
              className={`flex-1 flex-col gap-3 sm:gap-4 min-w-0 w-full ${
                mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Quick Task Header banner on mobile */}
              <div className="lg:hidden p-2.5 bg-duck-light border-2 border-duck-dark shadow-xs flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-extrabold text-amber-900 block tracking-wider mb-0.5">
                    Your Task:
                  </span>
                  <p className="text-xs font-bold text-ink leading-snug line-clamp-3">
                    {currentStep?.task}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('task')}
                  className="text-[11px] font-bold text-amber-900 underline shrink-0 hover:text-ink whitespace-nowrap self-center px-1 py-1"
                >
                  View Details & Hints
                </button>
              </div>

              {/* SQL Editor */}
              <SqlEditor
                value={editorSql}
                onChange={handleEditorChange}
                onRun={handleRunQuery}
                onCheck={handleCheckAnswer}
                onNext={handleNext}
                hasNext={hasNext}
                onPrev={handlePrev}
                hasPrev={hasPrev}
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                onReset={() => handleEditorChange('')}
                onHint={handleHint}
                onShowSolution={handleShowSolution}
                hintCount={revealedHints}
                maxHints={maxHints}
                isChecking={isChecking}
                isRunning={isRunning}
              />

              {/* Live Results Table & Validation feedback */}
              <div ref={resultsRef} className="w-full">
                <ResultsTable
                  result={queryResult}
                  feedback={feedback}
                  onNextExercise={handleNext}
                  hasNextExercise={hasNext}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Custom Retro-Brutalist Reset Progress Confirmation Modal */}
      <ConfirmResetModal
        isOpen={isResetConfirmOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};

