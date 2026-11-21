import React, { useState, useMemo } from 'react';
import {
  DUCKDB_CHEAT_SHEET_CATEGORIES,
  DUCKDB_CHEAT_SHEET_ITEMS,
  STRFTIME_SPECIFIERS,
  PRINTF_SPECIFIERS,
  searchCheatSheet,
} from '../../data/duckdbCheatSheetData';
import { CheatSheetCategory, CheatSheetItem, FormatSpecifier } from '../../types/cheatsheet';
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
} from 'lucide-react';

interface CheatSheetPageProps {
  onBackToHome: () => void;
  onOpenPlayground?: (initialQuery?: string) => void;
  onStartLearning?: () => void;
}

export const CheatSheetPage: React.FC<CheatSheetPageProps> = ({
  onBackToHome,
  onOpenPlayground,
  onStartLearning,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CheatSheetCategory | 'all'>('all');
  const [expandedSpecifiers, setExpandedSpecifiers] = useState<'strftime' | 'printf' | null>('strftime');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return searchCheatSheet(
      searchQuery,
      activeCategory === 'all' ? undefined : activeCategory
    );
  }, [searchQuery, activeCategory]);

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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
      <header className="border-b-3 border-ink bg-surface-card sticky top-0 z-30 shadow-brutal-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-card hover:bg-slate-100 border-2 border-ink shadow-brutal-xs font-bold text-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Return to Homepage"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-2 border-l-2 border-ink/20 pl-2 sm:pl-3">
              <img src="/logo.svg" alt="DuckDB" className="w-6 h-6 object-contain shrink-0" />
              <span className="font-extrabold text-sm sm:text-lg tracking-tight">
                DuckDB Cheat Sheet
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono font-bold bg-duck px-2 py-0.5 border border-ink shadow-brutal-xs">
                v1.5 Enterprise Reference
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPlayground && (
              <button
                type="button"
                onClick={() => onOpenPlayground()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-duck text-ink font-extrabold text-xs sm:text-sm border-2 border-ink shadow-brutal hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Zap size={14} className="fill-ink" />
                <span className="hidden xs:inline">SQL Playground</span>
              </button>
            )}

            {onStartLearning && (
              <button
                type="button"
                onClick={onStartLearning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-card text-ink font-extrabold text-xs sm:text-sm border-2 border-ink shadow-brutal hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <BookOpen size={14} />
                <span className="hidden sm:inline">151 Exercises</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#FFFDF5] to-[#F5EEDD] border-b-3 border-ink py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-duck text-ink border-2 border-ink shadow-brutal-sm text-xs font-mono font-bold">
            <Sparkles size={13} className="fill-ink" />
            <span>Analytical SQL & Python Superpowers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink uppercase">
            The Complete DuckDB Cheat Sheet
          </h1>

          <p className="text-xs sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Essential reference for DuckDB syntax, clauses, functions, complex data types, and format specifiers
            (like <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%m</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%Y</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">printf</code> <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%s</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%d</code>, <code className="bg-duck/40 px-1 py-0.5 font-mono text-ink font-bold">%.2f</code>).
          </p>

          {/* Omnibar Search */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search functions, clauses, or format codes (%m, %d, printf, qualify, lambda, parquet)..."
                className="w-full pl-10 pr-10 py-3 bg-surface-card border-3 border-ink shadow-brutal text-xs sm:text-sm font-sans focus:outline-none focus:bg-duck-light/40 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 text-ink-muted cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-ink-muted mt-2 px-1">
              <span>Found {filteredItems.length} matching items</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-duck-dark hover:underline font-bold cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8 flex-1 space-y-8">
        
        {/* Format Specifiers Drawer (strftime % codes and printf % codes) */}
        <div className="border-3 border-ink bg-surface-card shadow-brutal overflow-hidden">
          <div className="p-3 sm:p-4 bg-amber-50/70 border-b-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-duck border-2 border-ink flex items-center justify-center font-mono font-black text-xs shadow-brutal-xs">
                %
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-ink">
                  Format Specifiers Reference Table
                </h3>
                <p className="text-[11px] text-ink-muted">
                  Parameters used in <code className="font-mono font-bold bg-white px-1 border border-ink/20">strftime()</code>, <code className="font-mono font-bold bg-white px-1 border border-ink/20">strptime()</code>, and <code className="font-mono font-bold bg-white px-1 border border-ink/20">printf()</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setExpandedSpecifiers(prev => prev === 'strftime' ? null : 'strftime')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  expandedSpecifiers === 'strftime' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light'
                }`}
              >
                <Calendar size={13} />
                <span>Date strftime ({STRFTIME_SPECIFIERS.length})</span>
                {expandedSpecifiers === 'strftime' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <button
                type="button"
                onClick={() => setExpandedSpecifiers(prev => prev === 'printf' ? null : 'printf')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  expandedSpecifiers === 'printf' ? 'bg-duck text-ink font-black' : 'bg-white hover:bg-duck-light'
                }`}
              >
                <Type size={13} />
                <span>Text printf ({PRINTF_SPECIFIERS.length})</span>
                {expandedSpecifiers === 'printf' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>

          {/* Expanded strftime Table */}
          {expandedSpecifiers === 'strftime' && (
            <div className="p-3 sm:p-5 overflow-x-auto">
              <div className="mb-3 text-xs text-ink-muted font-sans flex items-center justify-between">
                <span>Pass these format specifiers to <code className="font-mono font-bold text-ink">strftime(date, '%format')</code> or <code className="font-mono font-bold text-ink">strptime(str, '%format')</code>:</span>
                <span className="text-[10px] font-mono font-bold text-duck-dark">Click code to copy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {STRFTIME_SPECIFIERS.map(spec => (
                  <div
                    key={spec.code}
                    onClick={() => handleCopy(spec.code, `spec-${spec.code}`)}
                    className="p-2.5 border-2 border-ink bg-[#FFFDF8] hover:bg-duck-light hover:shadow-brutal-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink">
                          {spec.code}
                        </span>
                        <span className="text-xs font-bold text-ink truncate">
                          {spec.meaning}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-ink-muted mt-1 truncate">
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
          {expandedSpecifiers === 'printf' && (
            <div className="p-3 sm:p-5 overflow-x-auto">
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
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-duck text-ink font-mono font-black text-xs border border-ink">
                          {spec.code}
                        </span>
                        <span className="text-xs font-bold text-ink truncate">
                          {spec.meaning}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-ink-muted mt-1 truncate">
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
        </div>

        {/* Category Pills Navigation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted font-mono">
              Filter by Category
            </span>
            <span className="text-xs font-mono font-bold text-ink-muted">
              {filteredItems.length} of {DUCKDB_CHEAT_SHEET_ITEMS.length} items
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-duck text-ink shadow-brutal-xs font-black'
                  : 'bg-surface-card hover:bg-slate-100'
              }`}
            >
              All Categories ({DUCKDB_CHEAT_SHEET_ITEMS.length})
            </button>

            {DUCKDB_CHEAT_SHEET_CATEGORIES.map(cat => {
              const count = DUCKDB_CHEAT_SHEET_ITEMS.filter(i => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono border-2 border-ink whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-duck text-ink shadow-brutal-xs font-black'
                      : 'bg-surface-card hover:bg-slate-100'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.shortTitle} ({count})</span>
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
              <p className="text-xs text-ink-muted">Try searching for keywords like <code className="bg-slate-100 px-1 font-mono">printf</code>, <code className="bg-slate-100 px-1 font-mono">%m</code>, <code className="bg-slate-100 px-1 font-mono">lambda</code>, <code className="bg-slate-100 px-1 font-mono">qualify</code>, or <code className="bg-slate-100 px-1 font-mono">parquet</code>.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
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
                      <span className="px-2 py-0.5 bg-blue-50 border border-blue-400 text-blue-900 font-mono text-[10px] font-bold">
                        {item.parityBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopy(item.exampleSql, `sql-${item.id}`)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-surface-card hover:bg-slate-100 border border-ink text-xs font-bold shadow-brutal-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title="Copy SQL snippet"
                    >
                      {copiedId === `sql-${item.id}` ? (
                        <>
                          <Check size={12} className="text-emerald-600 stroke-[3]" />
                          <span className="text-emerald-700 font-extrabold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy SQL</span>
                        </>
                      )}
                    </button>

                    {onOpenPlayground && (
                      <button
                        onClick={() => onOpenPlayground(item.exampleSql)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-duck hover:bg-duck-hover border border-ink text-xs font-extrabold shadow-brutal-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        title="Run in live DuckDB-Wasm playground"
                      >
                        <Zap size={12} className="fill-ink" />
                        <span>Run</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Item Body */}
                <div className="p-3 sm:p-5 space-y-4">
                  {/* Signature */}
                  <div className="p-2 sm:p-3 bg-[#0F172A] border-2 border-ink text-emerald-400 font-mono text-xs overflow-x-auto">
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
                          title={`Click to view specifier ${code}`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Runnable SQL Snippet */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                      Executable DuckDB SQL Example:
                    </span>
                    <div className="p-3 bg-[#0B1120] border-2 border-ink text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
                      {item.exampleSql}
                    </div>
                  </div>

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
