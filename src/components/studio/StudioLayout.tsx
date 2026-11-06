import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { EXERCISES, MODULES, DATABASES } from '../../data/curriculum';
import { ExerciseDef } from '../../types/curriculum';
import { executeQuery, QueryResult, resetDatabase, switchDatabase } from '../../engine/duckdb';
import { validateUserQuery, ValidationFeedback } from '../../engine/validator';
import { SqlEditor } from './SqlEditor';
import { ResultsTable } from './ResultsTable';
import { SchemaExplorer } from './SchemaExplorer';
import { CurriculumSidebar } from './CurriculumSidebar';
import { BookOpen, Sparkles, ArrowLeft, RefreshCw, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface StudioLayoutProps {
  onBackToLanding: () => void;
  initialExerciseId?: string;
}

const STORAGE_KEY_COMPLETED = 'learn_duckdb_completed_exercises';
const STORAGE_KEY_CURRENT = 'learn_duckdb_current_id';
const STORAGE_KEY_DRAFTS = 'learn_duckdb_drafts';

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  onBackToLanding,
  initialExerciseId,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync editor SQL when switching exercises
  useEffect(() => {
    setEditorSql(drafts[currentExercise.id] || '');
    setQueryResult(null);
    setFeedback(null);
    setRevealedHints(0);
    switchDatabase(currentExercise.db).catch(console.error);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, currentExercise.id);
    } catch {}
  }, [currentExercise.id]);

  // Persist draft on change
  const handleEditorChange = (newVal: string) => {
    setEditorSql(newVal);
    setDrafts(prev => {
      const next = { ...prev, [currentExercise.id]: newVal };
      try {
        localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(next));
      } catch {}
      return next;
    });
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

  // Preview table helper
  const handlePreviewTable = async (tableName: string) => {
    const previewSql = `SELECT * FROM ${tableName} LIMIT 5;`;
    setEditorSql(previewSql);
    setIsRunning(true);
    try {
      await switchDatabase(currentExercise.db);
      const res = await executeQuery(previewSql);
      setQueryResult(res);
      setFeedback(null);
    } catch (err: any) {
      console.error(err);
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

  // Navigation: Next / Prev exercise
  const currentIndex = EXERCISES.findIndex(e => e.id === currentExercise.id);
  const hasNext = currentIndex < EXERCISES.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = useCallback(() => {
    if (hasNext) {
      setCurrentId(EXERCISES[currentIndex + 1].id);
    }
  }, [hasNext, currentIndex]);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentId(EXERCISES[currentIndex - 1].id);
    }
  }, [hasPrev, currentIndex]);

  // Global window keyboard listener for Alt+N (Next) and Alt+P (Prev)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.altKey && (e.key === 'n' || e.key === 'N' || e.key === 'ArrowRight')) {
        e.preventDefault();
        handleNext();
      } else if (e.altKey && (e.key === 'p' || e.key === 'P' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleNext, handlePrev]);

  // Hints
  const currentStep = currentExercise.steps[0];
  const maxHints = currentStep?.hints?.length || 0;

  const handleHint = () => {
    setRevealedHints(prev => Math.min(prev + 1, maxHints));
  };

  const handleShowSolution = () => {
    if (currentStep?.solution) {
      setEditorSql(currentStep.solution);
      handleEditorChange(currentStep.solution);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Studio Top Navigation Bar */}
      <header className="border-b-3 border-ink bg-surface-card px-4 py-2.5 flex items-center justify-between shadow-brutal-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold border-2 border-ink hover:bg-duck transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-duck text-ink text-xs font-bold border-2 border-ink shadow-brutal-sm hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <BookOpen size={14} />
            <span>Syllabus</span>
            <span className="font-mono text-[11px] ml-1 bg-ink text-white px-1.5 py-0.2">
              {completedIds.size}/{EXERCISES.length}
            </span>
          </button>
        </div>

        {/* Center: Module title & Progress */}
        <div className="flex items-center gap-2 text-center max-w-md truncate">
          <span className="hidden md:inline font-mono text-[11px] font-bold text-ink-muted uppercase">
            {currentModule.title}
          </span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="font-extrabold text-sm truncate">{currentExercise.title}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDb}
            title="Reset database to seed rows"
            className="p-1.5 border-2 border-ink hover:bg-slate-100 text-xs font-mono flex items-center gap-1"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline text-[11px]">Reset DB</span>
          </button>

          <div className="flex items-center border-2 border-ink">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="p-1.5 hover:bg-duck disabled:opacity-30 disabled:hover:bg-transparent border-r border-ink"
              title="Previous Exercise"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="p-1.5 hover:bg-duck disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Exercise"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Curriculum Drawer */}
        <CurriculumSidebar
          currentExerciseId={currentExercise.id}
          onSelectExercise={id => setCurrentId(id)}
          completedIds={completedIds}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Studio Workspace Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-3 lg:p-4 gap-4">
          {/* Left Column: Task Description & Schema Explorer */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 shrink-0 lg:overflow-y-auto lg:max-h-full pr-1.5 custom-scrollbar">
            {/* Task Card */}
            <div className="border-3 border-ink bg-surface-card p-4 shadow-brutal flex flex-col gap-3">
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
                <h2 className="text-xl font-extrabold tracking-tight text-ink">
                  {currentExercise.title}
                </h2>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed font-sans">
                  {currentExercise.concept}
                </p>
              </div>

              {currentExercise.example && (
                <div className="bg-slate-100 border border-slate-300 p-2 text-xs font-mono text-slate-800">
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
            </div>

            {/* Schema Explorer */}
            <SchemaExplorer
              database={currentDb}
              onPreviewTable={handlePreviewTable}
            />
          </div>

          {/* Right Column: Code Editor & Results Grid */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* SQL Editor */}
            <SqlEditor
              value={editorSql}
              onChange={handleEditorChange}
              onRun={handleRunQuery}
              onCheck={handleCheckAnswer}
              onNext={handleNext}
              hasNext={hasNext}
              onReset={() => handleEditorChange('')}
              onHint={handleHint}
              onShowSolution={handleShowSolution}
              hintCount={revealedHints}
              maxHints={maxHints}
              isChecking={isChecking}
              isRunning={isRunning}
            />

            {/* Live Results Table & Validation feedback */}
            <ResultsTable
              result={queryResult}
              feedback={feedback}
              onNextExercise={handleNext}
              hasNextExercise={hasNext}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

