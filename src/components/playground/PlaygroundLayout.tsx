import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  initPlayground,
  getPlaygroundTables,
  registerPlaygroundFile,
  executePlaygroundQuery,
  removePlaygroundTable,
  resetPlayground,
  PlaygroundTableSchema,
} from '../../engine/playgroundDuckdb';
import { QueryResult } from '../../engine/duckdb';
import { SqlEditor } from '../studio/SqlEditor';
import { ResultsTable } from '../studio/ResultsTable';
import { PlaygroundFileUploader } from './PlaygroundFileUploader';
import { PlaygroundSchemaExplorer } from './PlaygroundSchemaExplorer';
import { KeyboardShortcutsModal } from '../studio/KeyboardShortcutsModal';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  ArrowLeft,
  RefreshCw,
  Keyboard,
  Coffee,
  Sparkles,
  BookOpen,
  Zap,
} from 'lucide-react';

interface PlaygroundLayoutProps {
  onBackToLanding: () => void;
  onSwitchToExercises: () => void;
}

const DEFAULT_PLAYGROUND_SQL = `-- 🦆 DuckDB Analytical Playground
-- Query pre-loaded or uploaded CSV, Parquet, and JSON files with full SQL power.
SELECT * FROM ecommerce_sales LIMIT 10;`;

export const PlaygroundLayout: React.FC<PlaygroundLayoutProps> = ({
  onBackToLanding,
  onSwitchToExercises,
}) => {
  const [editorSql, setEditorSql] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('learn_duckdb_playground_sql');
      return saved || DEFAULT_PLAYGROUND_SQL;
    } catch {
      return DEFAULT_PLAYGROUND_SQL;
    }
  });

  const [tables, setTables] = useState<PlaygroundTableSchema[]>([]);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'tables' | 'tips'>('editor');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Initialize playground and load initial tables
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initPlayground();
        const loadedTables = await getPlaygroundTables();
        if (mounted) {
          setTables(loadedTables);
        }
      } catch (err: any) {
        if (mounted) {
          setErrorMessage(`Initialization error: ${err.message}`);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEditorChange = (sql: string) => {
    setEditorSql(sql);
    try {
      localStorage.setItem('learn_duckdb_playground_sql', sql);
    } catch {}
  };

  const handleRunQuery = async () => {
    const trimmed = editorSql.trim();
    if (!trimmed) return;

    setIsRunning(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await executePlaygroundQuery(trimmed);
      setQueryResult(res);

      // If user executed DDL (CREATE, DROP, ALTER), refresh tables schema
      if (/^(CREATE|DROP|ALTER)\b/i.test(trimmed)) {
        const updatedTables = await getPlaygroundTables();
        setTables(updatedTables);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Execution error');
      setQueryResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handlePreviewTable = async (tableName: string) => {
    const previewSql = `SELECT * FROM ${tableName};`;
    setIsRunning(true);
    setErrorMessage(null);
    try {
      const res = await executePlaygroundQuery(previewSql);
      setQueryResult(res);
      setStatusMessage(`Previewing "${tableName}" (${res.rowCount} rows). (Your editor query is preserved)`);
      setMobileTab('editor');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to preview table ${tableName}`);
      setMobileTab('editor');
    } finally {
      setIsRunning(false);
    }
  };

  const handleFilesUploaded = async (files: File[]) => {
    setIsUploading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      for (const file of files) {
        await registerPlaygroundFile(file);
      }
      const updated = await getPlaygroundTables();
      setTables(updated);
      setStatusMessage(
        `Successfully imported ${files.length} ${files.length === 1 ? 'file' : 'files'} into DuckDB!`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to import files.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTable = async (tableName: string, fileName?: string) => {
    try {
      await removePlaygroundTable(tableName, fileName);
      const updated = await getPlaygroundTables();
      setTables(updated);
      setStatusMessage(`Table "${tableName}" deleted.`);
    } catch (err: any) {
      setErrorMessage(`Failed to delete table: ${err.message}`);
    }
  };

  const handleResetPlayground = async () => {
    setIsRunning(true);
    try {
      await resetPlayground();
      const updated = await getPlaygroundTables();
      setTables(updated);
      setEditorSql(DEFAULT_PLAYGROUND_SQL);
      setQueryResult(null);
      setErrorMessage(null);
      setStatusMessage('Playground reset to default dataset (ecommerce_sales).');
    } catch (err: any) {
      setErrorMessage(`Failed to reset playground: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut listener (? opens shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
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
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Top Header */}
      <header className="h-14 border-b-3 border-ink bg-surface-card px-2 sm:px-4 flex items-center justify-between shadow-brutal-sm sticky top-0 z-30">
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold border-2 border-ink hover:bg-duck transition-colors cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center border-2 border-ink bg-white p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={onSwitchToExercises}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
              title="Interactive Exercises"
            >
              <BookOpen size={13} />
              <span className="hidden sm:inline">Exercises</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-duck text-ink border border-ink shadow-brutal-xs font-extrabold cursor-default"
            >
              <Zap size={13} />
              <span className="hidden xs:inline">Playground</span>
            </button>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-center max-w-[120px] xs:max-w-[160px] sm:max-w-none truncate px-1">
          <span className="text-base sm:text-lg">🦆</span>
          <span className="font-extrabold text-xs sm:text-sm tracking-tight uppercase truncate">
            DuckDB Playground
          </span>
          <span className="hidden sm:inline-block text-[10px] bg-duck px-1.5 py-0.2 font-mono font-bold border border-ink">
            WASM VFS
          </span>
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
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            title="Reset playground to seed dataset"
            className="p-1.5 border-2 border-ink hover:bg-slate-100 text-xs font-mono flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/haydermuhib/learn-duckdb"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="p-1.5 border-2 border-ink hover:bg-duck transition-colors text-ink"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Buy Me a Coffee */}
          <a
            href="https://buymeacoffee.com/haydermuhib"
            target="_blank"
            rel="noopener noreferrer"
            title="Support this project"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-[#FFDD00] text-ink font-bold text-xs border-2 border-ink shadow-brutal-xs hover:bg-[#FFE333] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <Coffee size={13} />
            <span>Coffee</span>
          </a>
        </div>
      </header>

      {/* Mobile View Switcher Tabs (Only on < lg screens) */}
      <div className="lg:hidden flex items-center border-b-2 border-ink bg-surface-muted sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-20">
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
          <span>Editor & Results</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('tables')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-r border-ink transition-colors cursor-pointer ${
            mobileTab === 'tables'
              ? 'bg-duck text-ink font-black shadow-inner'
              : 'text-ink-muted hover:bg-slate-100'
          }`}
        >
          <span>🗄️ Tables ({tables.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('tips')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'tips'
              ? 'bg-duck text-ink font-black shadow-inner'
              : 'text-ink-muted hover:bg-slate-100'
          }`}
        >
          <span>💡 Tips</span>
        </button>
      </div>

      {/* Main Playground Workspace */}
      <main className="flex-1 p-2.5 sm:p-3 lg:p-4 min-w-0">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left Column: File Uploader & Schema Explorer */}
          <div
            className={`w-full lg:w-[360px] xl:w-[400px] flex-col gap-3 shrink-0 ${
              mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* File Uploader and Schema Explorer shown if mobileTab === 'tables' or on desktop */}
            <div
              className={`flex-col gap-3 ${
                mobileTab === 'tips' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <PlaygroundFileUploader
                onFilesUploaded={handleFilesUploaded}
                isUploading={isUploading}
              />

              <PlaygroundSchemaExplorer
                tables={tables}
                onPreviewTable={handlePreviewTable}
                onDeleteTable={handleDeleteTable}
              />
            </div>

            {/* Quick Tips: shown if mobileTab === 'tips' or on desktop */}
            <div
              className={`p-3 bg-surface-card border-2 border-ink text-xs space-y-1.5 text-ink-muted ${
                mobileTab === 'tables' ? 'hidden lg:block' : 'block'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-ink block">
                💡 DuckDB Quick Syntax
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>
                  Query table directly: <code className="bg-slate-100 px-1 font-mono text-ink">SELECT * FROM ecommerce_sales;</code>
                </li>
                <li>
                  Query raw file: <code className="bg-slate-100 px-1 font-mono text-ink">SELECT * FROM 'ecommerce_sales.csv';</code>
                </li>
                <li>
                  DuckDB column projection: <code className="bg-slate-100 px-1 font-mono text-ink">SELECT * EXCLUDE (customer_email) FROM ecommerce_sales;</code>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: SQL Editor & Query Results */}
          <div
            className={`flex-1 flex-col gap-3 sm:gap-4 min-w-0 w-full ${
              mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Status / Preview banner */}
            {statusMessage && (
              <div className="px-3 py-2 bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                <span>{statusMessage}</span>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="px-3 py-2 bg-rose-50 border-2 border-rose-500 text-rose-900 text-xs font-mono font-medium flex items-center justify-between animate-in fade-in">
                <span>Error: {errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-700 hover:text-rose-900 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* SQL Editor */}
            <SqlEditor
              value={editorSql}
              onChange={handleEditorChange}
              onRun={handleRunQuery}
              onReset={() => handleEditorChange('')}
              isRunning={isRunning}
              isPlayground={true}
            />

            {/* Live Results Table */}
            <div ref={resultsRef} className="w-full">
              <ResultsTable
                result={queryResult}
                feedback={null}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Reset Playground Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Playground Dataset?"
        message="Are you sure you want to reset the playground to the default dataset?"
        detail="All custom uploaded tables and in-memory files will be dropped. The default ecommerce_sales dataset and query will be restored."
        confirmLabel="Reset Playground"
        cancelLabel="Keep Current Tables"
        variant="warning"
        onConfirm={async () => {
          setIsResetConfirmOpen(false);
          await handleResetPlayground();
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
