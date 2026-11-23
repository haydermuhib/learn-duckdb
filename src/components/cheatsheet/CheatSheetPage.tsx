import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  DUCKDB_CHEAT_SHEET_CATEGORIES,
  DUCKDB_CHEAT_SHEET_ITEMS,
  STRFTIME_SPECIFIERS,
  PRINTF_SPECIFIERS,
  REGEX_SPECIFIERS,
  DUCKDB_DATA_TYPES,
  DUCKDB_CLI_COMMANDS,
  DUCKDB_EXTENSIONS,
  searchCheatSheet,
} from '../../data/duckdbCheatSheetData';
import { CheatSheetCategory, CheatSheetItem } from '../../types/cheatsheet';
import { executeQuery, QueryResult } from '../../engine/duckdb';
import {
  SnowflakeIcon,
  PythonIcon,
  DuckDBIcon,
  PostgresIcon,
  BigQueryIcon,
  renderParityBadge,
} from '../common/BrandIcons';
import { ModeSwitcher } from '../common/ModeSwitcher';
import { SqlCodeBlock } from '../common/SqlCodeBlock';
import {
  Search,
  X,
  Copy,
  Check,
  Zap,
  ArrowLeft,
  Calendar,
  Type,
  Layers,
  Database,
  BarChart2,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Play,
  ArrowUp,
  SlidersHorizontal,
  Code2,
  Tag,
  Terminal,
  Boxes,
} from 'lucide-react';

interface CheatSheetPageProps {
  onBackToHome: () => void;
  onOpenPlayground?: (initialQuery?: string) => void;
  onStartLearning?: () => void;
}

type ReferenceTab = 'strftime' | 'printf' | 'regex' | 'types' | 'cli' | 'extensions' | null;
type WorkflowPreset = 'all' | 'duckdb' | 'snowflake' | 'postgres' | 'bigquery' | 'python' | 'exclusive' | 'cli' | 'ingestion' | 'dates' | 'strings' | 'window' | 'nested';

export const CheatSheetPage: React.FC<CheatSheetPageProps> = ({
  onBackToHome,
  onOpenPlayground,
  onStartLearning,
}) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  });
  const [activeCategory, setActiveCategory] = useState<CheatSheetCategory | 'all'>('all');
  const [activePreset, setActivePreset] = useState<WorkflowPreset>('all');
  const [expandedReference, setExpandedReference] = useState<ReferenceTab>('strftime');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // In-line Query Execution State
  const [inlineResults, setInlineResults] = useState<Record<string, QueryResult>>({});
  const [runningItems, setRunningItems] = useState<Record<string, boolean>>({});
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' to focus search, 'Escape' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered Items based on search, category, and workflow presets
  const filteredItems = useMemo(() => {
    let items = searchCheatSheet(
      searchQuery,
      activeCategory === 'all' ? undefined : activeCategory
    );

    if (activePreset === 'duckdb' || activePreset === 'exclusive') {
      items = items.filter(i => i.parityBadge?.toLowerCase().includes('exclusive') || i.parityBadge?.toLowerCase().includes('superpower') || i.tags.includes('duckdb superpower'));
    } else if (activePreset === 'snowflake') {
      items = items.filter(i => i.parityBadge?.toLowerCase().includes('snowflake') || i.tags.includes('snowflake'));
    } else if (activePreset === 'postgres') {
      items = items.filter(i => i.parityBadge?.toLowerCase().includes('postgres') || i.tags.includes('postgres'));
    } else if (activePreset === 'bigquery') {
      items = items.filter(i => i.parityBadge?.toLowerCase().includes('bigquery') || i.tags.includes('bigquery'));
    } else if (activePreset === 'python') {
      items = items.filter(i => i.parityBadge?.toLowerCase().includes('python') || i.parityBadge?.toLowerCase().includes('arrow') || i.tags.includes('arrow') || i.tags.includes('parquet'));
    } else if (activePreset === 'cli') {
      items = items.filter(i => i.tags.includes('cli') || i.tags.includes('terminal') || i.tags.includes('pragma'));
    } else if (activePreset === 'ingestion') {
      items = items.filter(i => i.category === 'ingestion' || i.tags.includes('parquet') || i.tags.includes('csv') || i.tags.includes('json'));
    } else if (activePreset === 'dates') {
      items = items.filter(i => i.category === 'dates');
    } else if (activePreset === 'strings') {
      items = items.filter(i => i.category === 'strings');
    } else if (activePreset === 'window') {
      items = items.filter(i => i.category === 'window');
    } else if (activePreset === 'nested') {
      items = items.filter(i => i.category === 'nested');
    }

    return items;
  }, [searchQuery, activeCategory, activePreset]);

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Run snippet in-place on the cheat sheet card
  const handleRunInline = async (item: CheatSheetItem) => {
    if (inlineResults[item.id]) {
      // Toggle off if already showing
      setInlineResults(prev => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      return;
    }

    setRunningItems(prev => ({ ...prev, [item.id]: true }));
    setInlineErrors(prev => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });

    try {
      const res = await executeQuery(item.exampleSql);
      setInlineResults(prev => ({ ...prev, [item.id]: res }));
    } catch (err: any) {
      console.error(err);
      setInlineErrors(prev => ({
        ...prev,
        [item.id]: err.message || 'Error executing query in DuckDB-Wasm',
      }));
    } finally {
      setRunningItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const getCategoryIcon = (category: CheatSheetCategory) => {
    switch (category) {
      case 'superpowers':
        return <Zap size={14} className="text-amber-500 fill-amber-400" />;
      case 'strings':
        return <Type size={14} className="text-blue-600" />;
      case 'dates':
        return <Calendar size={14} className="text-rose-600" />;
      case 'window':
        return <LayoutGrid size={14} className="text-purple-600" />;
      case 'nested':
        return <Layers size={14} className="text-emerald-600" />;
      case 'aggregates':
        return <BarChart2 size={14} className="text-cyan-600" />;
      case 'ingestion':
        return <Database size={14} className="text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-duck selection:text-ink">
      {/* Top Navigation Bar */}
      <header className="relative h-14 border-b-3 border-ink bg-surface-card px-2 sm:px-4 flex items-center justify-between shadow-brutal-sm sticky top-0 z-40">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-10">
          <button
            type="button"
            onClick={onBackToHome}
            className="h-8 px-2.5 inline-flex items-center justify-center gap-1 text-xs font-bold border-2 border-ink bg-white hover:bg-duck shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0 leading-none"
            title="Back to Home"
          >
            <ArrowLeft size={14} className="shrink-0" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <ModeSwitcher
            currentMode="cheatsheet"
            onSelectMode={(mode) => {
              if (mode === 'exercises') onStartLearning?.();
              if (mode === 'playground') onOpenPlayground?.();
            }}
          />
        </div>

        {/* Center Title (Hidden on mobile & tablet where space is limited, absolutely centered on desktop) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 sm:gap-2 text-center pointer-events-none z-0">
          <img src="/logo.svg" alt="Learn DuckDB" className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
          <span className="font-extrabold text-xs sm:text-sm tracking-tight uppercase truncate">
            DuckDB Cheat Sheet
          </span>
          <span className="hidden sm:inline-block text-[10px] bg-duck px-1.5 py-0.2 font-mono font-bold border border-ink">
            v1.6 Reference
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 z-10" />
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#FFFDF5] to-[#F5EEDD] border-b-3 border-ink py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink uppercase">
            The Complete DuckDB Cheat{' '}
            <span className="relative inline-block whitespace-nowrap">
              Sheet
              <Sparkles
                aria-hidden="true"
                className="absolute -top-2.5 -right-6 sm:-top-3.5 sm:-right-8 w-6 h-6 sm:w-8 sm:h-8 text-duck fill-duck stroke-ink stroke-2 drop-shadow-[2px_2px_0px_#1E293B] pointer-events-none"
              />
            </span>
          </h1>

          <p className="text-xs sm:text-base text-ink-muted max-w-3xl mx-auto leading-relaxed">
            Instant reference for all DuckDB clauses (<code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">QUALIFY</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">GROUP BY ALL</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">UNION BY NAME</code>), analytical functions, complete format parameters (<code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%m</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%Y</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%s</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%.2f</code>, regex <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">\d+</code>), and native data types (<code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">HUGEINT</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">TRY_CAST</code>).
          </p>

          {/* Omnibar Search */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 60+ functions, clauses, types, or format codes (%m, %d, \\d, qualify, summarize)..."
                className="w-full pl-10 pr-20 py-3 bg-surface-card border-3 border-ink shadow-brutal text-xs sm:text-sm font-sans focus:outline-none focus:bg-duck-light/40 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:bg-slate-200 text-ink-muted cursor-pointer"
                    title="Clear search (Esc)"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-ink-muted bg-slate-100 border border-slate-300 shadow-xs">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Quick Ecosystem & Parity Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <span className="text-[11px] font-mono font-bold text-ink-muted">Quick filters:</span>
              <button
                type="button"
                onClick={() => {
                  setActivePreset(prev => prev === 'duckdb' ? 'all' : 'duckdb');
                  setActiveCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border border-ink cursor-pointer transition-all ${
                  activePreset === 'duckdb' ? 'bg-duck text-ink font-black shadow-brutal-xs' : 'bg-white hover:bg-duck-light'
                }`}
                title="Filter by DuckDB exclusive superpowers"
              >
                <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center">
                  <DuckDBIcon className="w-full h-full" />
                </span>
                <span>DuckDB Superpowers</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePreset(prev => prev === 'snowflake' ? 'all' : 'snowflake');
                  setActiveCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border border-ink cursor-pointer transition-all ${
                  activePreset === 'snowflake' ? 'bg-blue-100 text-blue-950 font-black shadow-brutal-xs' : 'bg-white hover:bg-blue-50'
                }`}
                title="Filter by Snowflake 1:1 parity syntax"
              >
                <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center">
                  <SnowflakeIcon className="w-full h-full" />
                </span>
                <span>Snowflake 1:1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePreset(prev => prev === 'postgres' ? 'all' : 'postgres');
                  setActiveCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border border-ink cursor-pointer transition-all ${
                  activePreset === 'postgres' ? 'bg-indigo-100 text-indigo-950 font-black shadow-brutal-xs' : 'bg-white hover:bg-indigo-50'
                }`}
                title="Filter by PostgreSQL 1:1 parity syntax"
              >
                <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center">
                  <PostgresIcon className="w-full h-full" />
                </span>
                <span>Postgres 1:1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePreset(prev => prev === 'bigquery' ? 'all' : 'bigquery');
                  setActiveCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border border-ink cursor-pointer transition-all ${
                  activePreset === 'bigquery' ? 'bg-sky-100 text-sky-950 font-black shadow-brutal-xs' : 'bg-white hover:bg-sky-50'
                }`}
                title="Filter by BigQuery 1:1 parity syntax"
              >
                <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center">
                  <BigQueryIcon className="w-full h-full" />
                </span>
                <span>BigQuery 1:1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePreset(prev => prev === 'python' ? 'all' : 'python');
                  setActiveCategory('all');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold border border-ink cursor-pointer transition-all ${
                  activePreset === 'python' ? 'bg-emerald-100 text-emerald-950 font-black shadow-brutal-xs' : 'bg-white hover:bg-emerald-50'
                }`}
                title="Filter by Python & Arrow ecosystem features"
              >
                <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center">
                  <PythonIcon className="w-full h-full" />
                </span>
                <span>Python / Arrow</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-ink-muted mt-2 px-1">
              <span>Showing {filteredItems.length} matching items</span>
              {(searchQuery || activePreset !== 'all' || activeCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActivePreset('all');
                    setActiveCategory('all');
                  }}
                  className="text-duck-dark hover:underline font-bold cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        
        {/* Format Specifiers & Data Types Drawer (4 Dedicated Tables) */}
        <div className="border-3 border-ink bg-surface-card shadow-brutal overflow-hidden">
          <div className="p-3 sm:p-4 bg-amber-50/70 border-b-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-duck border-2 border-ink flex items-center justify-center font-mono font-black text-xs shadow-brutal-xs">
                %
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-ink">
                  Format Specifiers & Data Types Catalog
                </h3>
                <p className="text-[11px] text-ink-muted">
                  Parameters used in <code className="font-mono font-bold bg-white px-1 border border-ink/20">strftime</code>, <code className="font-mono font-bold bg-white px-1 border border-ink/20">printf</code>, <code className="font-mono font-bold bg-white px-1 border border-ink/20">regex</code>, and <code className="font-mono font-bold bg-white px-1 border border-ink/20">CAST</code>
                </p>
              </div>
            </div>

            {/* 6 Interactive Reference Tab Selectors */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setExpandedReference(prev => prev === 'strftime' ? null : 'strftime')}
                className={`h-9 sm:h-auto sm:py-1.5 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-between sm:justify-center gap-1 ${
                  expandedReference === 'strftime' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light text-ink'
                }`}
                title="Date formatting strftime parameters"
              >
                <span className="flex items-center gap-1 min-w-0">
                  <Calendar size={12} className="shrink-0 text-ink" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Date </span>strftime
                  </span>
                </span>
                <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                  <span className="text-[10px] font-mono">({STRFTIME_SPECIFIERS.length})</span>
                  {expandedReference === 'strftime' ? <ChevronUp size={11} className="shrink-0" /> : <ChevronDown size={11} className="shrink-0" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedReference(prev => prev === 'printf' ? null : 'printf')}
                className={`h-9 sm:h-auto sm:py-1.5 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-between sm:justify-center gap-1 ${
                  expandedReference === 'printf' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light text-ink'
                }`}
                title="Text formatting printf parameters"
              >
                <span className="flex items-center gap-1 min-w-0">
                  <Type size={12} className="shrink-0 text-ink" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Text </span>printf
                  </span>
                </span>
                <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                  <span className="text-[10px] font-mono">({PRINTF_SPECIFIERS.length})</span>
                  {expandedReference === 'printf' ? <ChevronUp size={11} className="shrink-0" /> : <ChevronDown size={11} className="shrink-0" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedReference(prev => prev === 'regex' ? null : 'regex')}
                className={`h-9 sm:h-auto sm:py-1.5 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-between sm:justify-center gap-1 ${
                  expandedReference === 'regex' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light text-ink'
                }`}
                title="Regular expression syntax and character classes"
              >
                <span className="flex items-center gap-1 min-w-0">
                  <Code2 size={12} className="shrink-0 text-ink" />
                  <span className="truncate">Regex</span>
                </span>
                <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                  <span className="text-[10px] font-mono">({REGEX_SPECIFIERS.length})</span>
                  {expandedReference === 'regex' ? <ChevronUp size={11} className="shrink-0" /> : <ChevronDown size={11} className="shrink-0" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedReference(prev => prev === 'types' ? null : 'types')}
                className={`h-9 sm:h-auto sm:py-1.5 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-between sm:justify-center gap-1 ${
                  expandedReference === 'types' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light text-ink'
                }`}
                title="DuckDB native data types"
              >
                <span className="flex items-center gap-1 min-w-0">
                  <Tag size={12} className="shrink-0 text-ink" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Data </span>Types
                  </span>
                </span>
                <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                  <span className="text-[10px] font-mono">({DUCKDB_DATA_TYPES.length})</span>
                  {expandedReference === 'types' ? <ChevronUp size={11} className="shrink-0" /> : <ChevronDown size={11} className="shrink-0" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedReference(prev => prev === 'cli' ? null : 'cli')}
                className={`h-9 sm:h-auto sm:py-1.5 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-between sm:justify-center gap-1 ${
                  expandedReference === 'cli' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light text-ink'
                }`}
                title="DuckDB CLI dot-commands and PRAGMA statements"
              >
                <span className="flex items-center gap-1 min-w-0">
                  <Terminal size={12} className="shrink-0 text-ink" />
                  <span className="truncate">
                    CLI <span className="hidden sm:inline">& PRAGMA</span>
                  </span>
                </span>
                <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                  <span className="text-[10px] font-mono">({DUCKDB_CLI_COMMANDS.length})</span>
                  {expandedReference === 'cli' ? <ChevronUp size={11} className="shrink-0" /> : <ChevronDown size={11} className="shrink-0" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedReference(prev => prev === 'extensions' ? null : 'extensions')}
                className={`h-9 sm:h-auto sm:py-1.5 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-between sm:justify-center gap-1 ${
                  expandedReference === 'extensions' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light text-ink'
                }`}
                title="DuckDB core and official extensions"
              >
                <span className="flex items-center gap-1 min-w-0">
                  <Boxes size={12} className="shrink-0 text-ink" />
                  <span className="truncate">Extensions</span>
                </span>
                <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                  <span className="text-[10px] font-mono">({DUCKDB_EXTENSIONS.length})</span>
                  {expandedReference === 'extensions' ? <ChevronUp size={11} className="shrink-0" /> : <ChevronDown size={11} className="shrink-0" />}
                </span>
              </button>
            </div>
          </div>

          {/* Expanded strftime Table */}
          {expandedReference === 'strftime' && (
            <div className="p-3 sm:p-5">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Pass these format codes to <code className="font-mono font-bold text-ink">strftime(date, '%format')</code> or <code className="font-mono font-bold text-ink">strptime(str, '%format')</code>:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click code to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {STRFTIME_SPECIFIERS.map(spec => (
                  <div
                    key={spec.code}
                    onClick={() => handleCopy(spec.code, `spec-${spec.code}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink shrink-0">
                          {spec.code}
                        </span>
                        <div
                          className="text-xs font-bold text-ink overflow-x-auto whitespace-nowrap scrollbar-none flex-1"
                          title={spec.meaning}
                        >
                          {spec.meaning}
                        </div>
                      </div>
                      <div
                        className="text-[10px] font-mono text-ink-muted mt-1 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={spec.example}
                      >
                        Example: <span className="text-ink font-semibold">{spec.example}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-ink-muted group-hover:text-ink">
                      {copiedId === `spec-${spec.code}` ? (
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded printf Table */}
          {expandedReference === 'printf' && (
            <div className="p-3 sm:p-5">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Pass these format specifiers to <code className="font-mono font-bold text-ink">printf(format, args...)</code> or <code className="font-mono font-bold text-ink">format()</code>:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click code to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {PRINTF_SPECIFIERS.map(spec => (
                  <div
                    key={spec.code}
                    onClick={() => handleCopy(spec.code, `spec-${spec.code}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink shrink-0">
                          {spec.code}
                        </span>
                        <div
                          className="text-xs font-bold text-ink overflow-x-auto whitespace-nowrap scrollbar-none flex-1"
                          title={spec.meaning}
                        >
                          {spec.meaning}
                        </div>
                      </div>
                      <div
                        className="text-[10px] font-mono text-ink-muted mt-1 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={spec.example}
                      >
                        {spec.example}
                      </div>
                    </div>
                    <div className="shrink-0 text-ink-muted group-hover:text-ink">
                      {copiedId === `spec-${spec.code}` ? (
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Regex Table */}
          {expandedReference === 'regex' && (
            <div className="p-3 sm:p-5">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Patterns and flags used in <code className="font-mono font-bold text-ink">regexp_extract()</code>, <code className="font-mono font-bold text-ink">regexp_replace()</code>, and <code className="font-mono font-bold text-ink">regexp_matches()</code>:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click code to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {REGEX_SPECIFIERS.map(spec => (
                  <div
                    key={spec.code}
                    onClick={() => handleCopy(spec.code, `spec-${spec.code}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink shrink-0">
                          {spec.code}
                        </span>
                        <div
                          className="text-xs font-bold text-ink overflow-x-auto whitespace-nowrap scrollbar-none flex-1"
                          title={spec.meaning}
                        >
                          {spec.meaning}
                        </div>
                      </div>
                      <div
                        className="text-[10px] font-mono text-ink-muted mt-1 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={spec.example}
                      >
                        {spec.example}
                      </div>
                    </div>
                    <div className="shrink-0 text-ink-muted group-hover:text-ink">
                      {copiedId === `spec-${spec.code}` ? (
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Data Types Table */}
          {expandedReference === 'types' && (
            <div className="p-3 sm:p-5">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Native DuckDB data types for table schemas, <code className="font-mono font-bold text-ink">::TYPE</code> casts, and <code className="font-mono font-bold text-ink">TRY_CAST()</code>:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click type to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {DUCKDB_DATA_TYPES.map(dt => (
                  <div
                    key={dt.name}
                    onClick={() => handleCopy(dt.name, `type-${dt.name}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink shrink-0">
                          {dt.name}
                        </span>
                        {dt.storageSize && (
                          <span className="text-[10px] font-mono text-ink-muted shrink-0">
                            ({dt.storageSize})
                          </span>
                        )}
                      </div>
                      <div
                        className="text-xs text-ink font-medium mt-1 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={dt.description}
                      >
                        {dt.description}
                      </div>
                      <div
                        className="text-[10px] font-mono text-ink-muted mt-0.5 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={dt.exampleValue}
                      >
                        Ex: <span className="text-ink font-semibold">{dt.exampleValue}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-ink-muted group-hover:text-ink">
                      {copiedId === `type-${dt.name}` ? (
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded CLI & PRAGMA Table */}
          {expandedReference === 'cli' && (
            <div className="p-3 sm:p-5">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Terminal dot-commands, engine pragmas, and execution settings:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click command to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {DUCKDB_CLI_COMMANDS.map(cmd => (
                  <div
                    key={cmd.command}
                    onClick={() => handleCopy(cmd.command, `cli-${cmd.command}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 bg-slate-900 text-duck font-mono font-black text-xs border border-ink shrink-0">
                          {cmd.command}
                        </span>
                        <span className="text-[10px] font-mono px-1 border border-ink/20 bg-white text-ink-muted uppercase shrink-0">
                          {cmd.category}
                        </span>
                      </div>
                      <div
                        className="text-xs text-ink font-medium mt-1 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={cmd.description}
                      >
                        {cmd.description}
                      </div>
                      <div
                        className="text-[10px] font-mono text-ink-muted mt-0.5 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={cmd.example}
                      >
                        Usage: <span className="text-ink font-semibold">{cmd.example}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-ink-muted group-hover:text-ink">
                      {copiedId === `cli-${cmd.command}` ? (
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Extensions Table */}
          {expandedReference === 'extensions' && (
            <div className="p-3 sm:p-5">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Official and community extensions for cloud lakes, GIS, vector search, and databases:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click install command to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {DUCKDB_EXTENSIONS.map(ext => (
                  <div
                    key={ext.name}
                    onClick={() => handleCopy(ext.installCommand, `ext-${ext.name}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink shrink-0">
                          {ext.name}
                        </span>
                        <span className="text-[10px] font-mono px-1 border border-ink/20 bg-white text-ink-muted uppercase shrink-0">
                          {ext.category}
                        </span>
                      </div>
                      <div
                        className="text-xs text-ink font-medium mt-1 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={ext.description}
                      >
                        {ext.description}
                      </div>
                      <div
                        className="text-[10px] font-mono text-ink-muted mt-0.5 overflow-x-auto whitespace-nowrap scrollbar-none"
                        title={ext.installCommand}
                      >
                        Install: <span className="text-ink font-semibold font-mono">{ext.installCommand}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-ink-muted group-hover:text-ink">
                      {copiedId === `ext-${ext.name}` ? (
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Pills Navigation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted font-mono flex items-center gap-1.5">
              <SlidersHorizontal size={13} />
              <span>Browse by Category</span>
            </span>
            <span className="text-xs font-mono font-bold text-ink-muted">
              {filteredItems.length} of {DUCKDB_CHEAT_SHEET_ITEMS.length} items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`h-8 sm:h-9 px-3 inline-flex items-center gap-1.5 text-xs font-bold font-mono border-2 border-ink transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-duck text-ink shadow-brutal-xs font-black active:translate-x-0.5 active:translate-y-0.5'
                  : 'bg-white hover:bg-duck-light text-ink shadow-brutal-xs/50 hover:shadow-brutal-xs'
              }`}
            >
              <LayoutGrid size={13} className="shrink-0" />
              <span>All Categories</span>
              <span className="font-mono text-[10px] ml-0.5 px-1.5 py-0.2 bg-black/10 border border-ink/30 font-bold">
                {DUCKDB_CHEAT_SHEET_ITEMS.length}
              </span>
            </button>

            {DUCKDB_CHEAT_SHEET_CATEGORIES.map(cat => {
              const count = DUCKDB_CHEAT_SHEET_ITEMS.filter(i => i.category === cat.id).length;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setActiveCategory(cat.id); setActivePreset('all'); }}
                  className={`h-8 sm:h-9 px-3 inline-flex items-center gap-1.5 text-xs font-bold font-mono border-2 border-ink transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-duck text-ink shadow-brutal-xs font-black active:translate-x-0.5 active:translate-y-0.5'
                      : 'bg-white hover:bg-duck-light text-ink shadow-brutal-xs/50 hover:shadow-brutal-xs'
                  }`}
                >
                  <span className="shrink-0">{getCategoryIcon(cat.id)}</span>
                  <span>{cat.shortTitle}</span>
                  <span className="font-mono text-[10px] ml-0.5 px-1.5 py-0.2 bg-black/10 border border-ink/30 font-bold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cheat Sheet Item Cards Grid */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="border-3 border-ink bg-surface-card p-12 text-center shadow-brutal space-y-3">
              <p className="text-base font-bold text-ink">No functions or clauses found matching "{searchQuery}"</p>
              <p className="text-xs text-ink-muted">Try searching for keywords like <code className="bg-slate-100 px-1 font-mono">printf</code>, <code className="bg-slate-100 px-1 font-mono">%m</code>, <code className="bg-slate-100 px-1 font-mono">lambda</code>, <code className="bg-slate-100 px-1 font-mono">qualify</code>, or <code className="bg-slate-100 px-1 font-mono">summarize</code>.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActivePreset('all');
                }}
                className="px-4 py-2 bg-duck text-ink font-bold text-xs border-2 border-ink shadow-brutal-xs hover:bg-duck-hover cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                id={item.id}
                className="border-3 border-ink bg-surface-card shadow-brutal hover:shadow-brutal-lg transition-all"
              >
                {/* Item Header */}
                <div className="p-3 sm:p-4 bg-surface-muted/60 border-b-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <h2 className="font-extrabold text-sm sm:text-base text-ink font-mono tracking-tight">
                      {item.name}
                    </h2>
                    {item.parityBadge && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-400 text-blue-900 font-mono text-[10px] font-bold">
                        {renderParityBadge(item.parityBadge)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Inline Live Test Button */}
                    <button
                      type="button"
                      onClick={() => handleRunInline(item)}
                      disabled={runningItems[item.id]}
                      className="h-7 px-2.5 inline-flex items-center gap-1.5 bg-duck hover:bg-duck-hover border-2 border-ink text-xs font-black shadow-brutal-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 leading-none"
                      title="Execute directly in live DuckDB-Wasm"
                    >
                      <Play size={11} className="fill-ink shrink-0" />
                      <span>{runningItems[item.id] ? 'Running...' : inlineResults[item.id] ? 'Hide Output' : 'Test Live'}</span>
                    </button>

                    {/* Open in Full Playground */}
                    {onOpenPlayground && (
                      <button
                        type="button"
                        onClick={() => onOpenPlayground(item.exampleSql)}
                        className="h-7 px-2.5 inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 border-2 border-ink text-xs font-extrabold shadow-brutal-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 leading-none"
                        title="Open in dedicated SQL Playground"
                      >
                        <Zap size={11} className="fill-duck shrink-0" />
                        <span>Playground</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Item Body */}
                <div className="p-3 sm:p-5 space-y-4">
                  {/* Signature */}
                  <div className="p-2 sm:p-3 bg-[#0F172A] border-2 border-ink text-emerald-400 font-mono text-xs overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-auto whitespace-pre-wrap break-words">
                    <code>{item.signature}</code>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-ink leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Parameter Breakdown */}
                  {item.parameters && item.parameters.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                        Parameters & Arguments:
                      </span>
                      <div className="border-2 border-ink divide-y divide-ink/10 text-xs font-sans bg-slate-50/60">
                        {item.parameters.map((param, pIdx) => (
                          <div key={pIdx} className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-ink bg-white px-1.5 py-0.5 border border-ink/30">
                                {param.name}
                              </span>
                              <span className="font-mono text-ink-muted text-[10px]">
                                {param.type}
                              </span>
                              {param.optional && (
                                <span className="text-[9px] bg-slate-200 px-1 text-slate-600 font-bold">
                                  optional
                                </span>
                              )}
                            </div>
                            <span className="text-ink-muted sm:text-right">
                              {param.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Format Specifiers Pills */}
                  {item.formatSpecifiers && item.formatSpecifiers.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-ink-muted mr-1">
                        Supported Specifiers:
                      </span>
                      {item.formatSpecifiers.map((code, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => {
                            setSearchQuery(code);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="px-1.5 py-0.5 bg-amber-100 hover:bg-duck border border-amber-400 text-ink font-mono text-[10px] font-bold cursor-pointer transition-colors"
                          title={`Click to search specifier ${code}`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Runnable SQL Snippet Header */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-duck/30 border-2 border-ink text-ink font-mono text-[11px] font-black shadow-brutal-xs select-none">
                      <span className="w-2 h-2 rounded-full bg-duck-dark animate-pulse shrink-0"></span>
                      <span>Executable DuckDB SQL Example:</span>
                    </div>

                    {/* Copy SQL Button placed right on the example block */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.exampleSql, `sql-${item.id}`)}
                      className="h-7 px-2.5 inline-flex items-center gap-1.5 bg-surface-card hover:bg-slate-100 border-2 border-ink text-xs font-bold shadow-brutal-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 leading-none"
                      title="Copy SQL example"
                    >
                      {copiedId === `sql-${item.id}` ? (
                        <>
                          <Check size={13} className="text-emerald-600 stroke-[3]" />
                          <span className="text-emerald-700 font-extrabold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <SqlCodeBlock code={item.exampleSql} />

                  {/* Live Inline Execution Output */}
                  {inlineResults[item.id] && (
                    <div className="border-2 border-emerald-500 bg-[#0B1120] p-3 text-xs font-mono text-slate-200 overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-auto animate-fadeIn">
                      <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400 border-b border-slate-700 pb-1.5">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                          Executed in DuckDB-Wasm ({inlineResults[item.id].rowCount} rows)
                        </span>
                        <span className="bg-slate-800 text-duck px-2 py-0.5 border border-slate-700 font-bold">
                          ⚡ {inlineResults[item.id].executionTimeMs} ms
                        </span>
                      </div>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase">
                            {inlineResults[item.id].columns.map((c, i) => (
                              <th key={i} className="py-1 px-2.5 whitespace-nowrap">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {inlineResults[item.id].rows.map((r, ri) => (
                            <tr key={ri} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                              {r.map((val, ci) => (
                                <td key={ci} className="py-1.5 px-2.5 text-slate-300 whitespace-nowrap">
                                  {val === null ? <span className="text-slate-500 italic">NULL</span> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Inline Error Message */}
                  {inlineErrors[item.id] && (
                    <div className="p-2.5 bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs font-mono">
                      Execution Error: {inlineErrors[item.id]}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="p-2 bg-amber-50 border-l-4 border-l-duck text-[11px] text-amber-950 font-sans">
                      <span className="font-bold">Pro Tip: </span>
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-2.5 bg-duck text-ink font-bold border-2 border-ink shadow-brutal hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer z-40"
          title="Back to Top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Footer */}
      <footer className="border-t-3 border-ink bg-surface-muted py-8 px-4 text-center mt-12 space-y-3 font-mono text-xs text-ink-muted">
        <p className="font-bold text-ink">
          DuckDB Cheat Sheet • Offline Analytical SQL Reference
        </p>
        <p className="text-[11px]">
          All examples run 100% in-browser on DuckDB-Wasm without external servers.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2 font-bold">
          <button onClick={onBackToHome} className="hover:underline cursor-pointer">Home</button>
          <span>•</span>
          {onOpenPlayground && <button onClick={() => onOpenPlayground()} className="hover:underline cursor-pointer">Playground</button>}
          <span>•</span>
          {onStartLearning && <button onClick={onStartLearning} className="hover:underline cursor-pointer">151 Exercises</button>}
        </div>
      </footer>
    </div>
  );
};
