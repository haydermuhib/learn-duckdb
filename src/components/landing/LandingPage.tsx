import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { MODULES, EXERCISES } from '../../data/curriculum';
import { executeQuery, QueryResult } from '../../engine/duckdb';
import { SnowflakeIcon, PythonIcon, BuyMeACoffeeIcon, renderParityBadge } from '../common/BrandIcons';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Terminal,
  Play,
  ChevronDown,
  FileText,
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: (moduleId?: string) => void;
  onOpenPlayground?: () => void;
  onOpenCheatSheet?: () => void;
}

const SIMPLE_HERO_QUERY = `SELECT 
  category, 
  COUNT(*) AS total_items, 
  ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY ALL
ORDER BY total_items DESC;`;

const INITIAL_DEMO_RESULT: QueryResult = {
  columns: ['category', 'total_items', 'avg_price'],
  rows: [
    ['Electronics', 4, 404.99],
    ['Home', 3, 264.66],
    ['Sports', 3, 50.17],
    ['Stationery', 2, 23.50],
  ],
  rowCount: 4,
  executionTimeMs: 4.8,
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onOpenPlayground,
  onOpenCheatSheet,
}) => {
  // Interactive Sandbox Teaser on Hero with Single Formatted Query & Syntax Highlighting
  const [demoQuery, setDemoQuery] = useState(SIMPLE_HERO_QUERY);
  const [demoResult, setDemoResult] = useState<QueryResult | null>(INITIAL_DEMO_RESULT);
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const runDemo = async (queryToRun?: string) => {
    setIsRunningDemo(true);

    try {
      const res = await executeQuery(queryToRun || demoQuery);
      setDemoResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRunningDemo(false);
    }
  };

  const faqs = [
    {
      q: 'Why DuckDB instead of SQLite or PostgreSQL for learning SQL?',
      a: 'DuckDB is the modern standard for fast analytical queries (OLAP) and enterprise data stack parity. It supports analytical features like `QUALIFY`, `GROUP BY ALL`, `SELECT * EXCLUDE / REPLACE`, and complex window frames that are identical to Snowflake and BigQuery, while traditional databases lack them or require cumbersome workarounds.',
    },
    {
      q: 'How does DuckDB help Data Analysts and Python practitioners?',
      a: 'DuckDB directly queries Pandas DataFrames, Polars, and local/remote Parquet files with zero memory duplication via Apache Arrow. It replaces multi-step 20-line Pandas wrangling scripts with clean, declarative, millisecond SQL.',
    },
    {
      q: 'Do I need to install anything or sign up?',
      a: 'Zero installation and zero sign-up required. The entire DuckDB engine compiles to WebAssembly and runs straight in your browser tab. Your progress is saved automatically to your browser.',
    },
    {
      q: 'Is my data or SQL query sent to any remote server?',
      a: 'No. Everything runs 100% locally on your machine via WebAssembly and Web Workers. Your data, code, and queries never leave your device.',
    },
    {
      q: 'How many exercises are included?',
      a: `${EXERCISES.length} exercises divided into 18 structured modules—spanning foundational SELECT and JOINs, subqueries, CTEs, window functions, and real-world data engineering interview challenges.`,
    },
    {
      q: 'What if I am already comfortable with basic SQL?',
      a: 'You can jump directly into any advanced module from the syllabus—including Window Functions, CTE hierarchies, Advanced Aggregations, or DuckDB-specific superpowers like `QUALIFY` and `PIVOT`.',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      {/* Top Banner & Header */}
      <header className="border-b-3 border-ink bg-surface-card sticky top-0 z-30 shadow-brutal-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <img src="/logo.svg" alt="Learn DuckDB" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0" />
            <span className="font-extrabold text-base sm:text-xl tracking-tight">Learn Duckdb</span>
            <span className="hidden xs:inline-block text-[10px] sm:text-[11px] font-mono font-bold bg-duck px-1.5 sm:px-2 py-0.5 border border-ink ml-0.5">
              v2.0 WASM
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {onOpenCheatSheet && (
              <button
                type="button"
                onClick={onOpenCheatSheet}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-duck text-ink font-extrabold text-xs sm:text-sm border-2 border-ink shadow-brutal hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title="DuckDB Cheat Sheet & Reference"
              >
                <FileText size={14} className="text-ink" />
                <span className="hidden xs:inline">Cheat Sheet</span>
              </button>
            )}

            <a
              href="https://github.com/learnnishkaam/learn-duckdb"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-surface-card font-extrabold text-xs sm:text-sm border-2 border-ink shadow-brutal hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="GitHub repository"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="hidden xs:inline">GitHub</span>
            </a>

            <a
              href="https://buymeacoffee.com/haydermuhib"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-[#FFDD00] text-ink font-extrabold text-xs sm:text-sm border-2 border-ink shadow-brutal hover:bg-[#FFEA4D] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
              </svg>
              <span className="hidden sm:inline">Buy Me a Coffee</span>
              <span className="sm:hidden text-xs">Coffee</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 border-b-3 border-ink relative overflow-hidden bg-gradient-to-b from-canvas via-[#FAF6E9] to-[#F5EEDD]">
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] text-ink uppercase font-sans break-words max-w-4xl mx-auto">
            Enterprise SQL for Modern Data Analysts.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-ink-muted max-w-3xl mx-auto leading-relaxed px-1">
            Master the advanced analytical SQL used in <strong className="text-ink font-bold">Snowflake, BigQuery, and Databricks</strong>. 
            {' '}{EXERCISES.length} interactive exercises powered by real <span className="font-bold text-ink underline decoration-duck decoration-4">DuckDB-Wasm</span>—zero cloud bills, zero setup, and native Python data stack portability.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onStartLearning()}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-duck text-ink font-extrabold text-sm sm:text-base border-3 border-ink shadow-brutal hover:bg-duck-hover hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Learning Free</span>
              <ArrowRight size={18} />
            </button>
            {onOpenPlayground && (
              <button
                onClick={() => onOpenPlayground?.()}
                className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white text-ink font-extrabold text-sm sm:text-base border-3 border-ink shadow-brutal hover:bg-duck-light active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={18} className="fill-duck" />
                <span>Open SQL Playground</span>
              </button>
            )}
            <a
              href="#syllabus"
              className="px-5 sm:px-6 py-3.5 sm:py-4 bg-surface-card text-ink font-bold text-sm sm:text-base border-3 border-ink shadow-brutal hover:bg-surface-muted active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center"
            >
              Browse 18 Modules
            </a>
          </div>

          {/* Dual Pillar Value Grid (Enterprise Cloud + Python Analyst) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mt-6 text-left">
            {/* Pillar 1: Enterprise Cloud Warehouse */}
            <div className="p-4 sm:p-5 border-3 border-ink bg-surface-card shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2.5">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-8 h-8 bg-blue-50/80 border-2 border-ink flex items-center justify-center p-1.5 shrink-0">
                      <SnowflakeIcon className="w-full h-full" />
                    </span>
                    <span className="font-extrabold text-xs sm:text-sm uppercase tracking-tight">Enterprise Warehouse Parity</span>
                  </div>
                  <div className="pl-10.5 sm:pl-0">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-400 px-2 py-0.5 whitespace-nowrap inline-block">
                      Snowflake • BigQuery
                    </span>
                  </div>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Learn the exact modern analytical SQL that cloud warehouses rely on—without paying for cloud compute or waiting for cluster cold starts:
                </p>
                <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                  <div className="p-1.5 bg-slate-50 border border-ink flex items-center justify-between">
                    <span><code className="font-bold text-ink">QUALIFY</code> window filtering</span>
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1">{renderParityBadge('Snowflake 1:1')}</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 border border-ink flex items-center justify-between">
                    <span><code className="font-bold text-ink">GROUP BY ALL</code></span>
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1">{renderParityBadge('Snowflake & DuckDB')}</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 border border-ink flex items-center justify-between">
                    <span><code className="font-bold text-ink">SELECT * EXCLUDE / REPLACE</code></span>
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1">{renderParityBadge('BigQuery & Snowflake')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] font-bold text-blue-800 flex items-center gap-1">
                <span>Build muscle memory that transfers directly to enterprise jobs</span>
              </div>
            </div>

            {/* Pillar 2: Python & Data Analyst Superpower */}
            <div className="p-4 sm:p-5 border-3 border-ink bg-surface-card shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2.5">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-8 h-8 bg-emerald-50/80 border-2 border-ink flex items-center justify-center p-1.5 shrink-0">
                      <PythonIcon className="w-full h-full" />
                    </span>
                    <span className="font-extrabold text-xs sm:text-sm uppercase tracking-tight">Data Analyst & Python Native</span>
                  </div>
                  <div className="pl-10.5 sm:pl-0">
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-400 px-2 py-0.5 whitespace-nowrap inline-block">
                      Pandas • Arrow • Polars
                    </span>
                  </div>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  DuckDB is the analyst's secret weapon for Python. Query DataFrames and local Parquet files directly with blazing speed and zero memory bloat:
                </p>
                <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                  <div className="p-1.5 bg-slate-50 border border-ink flex items-center justify-between">
                    <span>Query Pandas & Polars DataFrames</span>
                    <span className="text-emerald-700 font-bold">Zero-Copy Arrow</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 border border-ink flex items-center justify-between">
                    <span>Query 10M+ Parquet / CSV rows</span>
                    <span className="text-emerald-700 font-bold">No DB Import Needed</span>
                  </div>
                  <div className="p-1.5 bg-slate-50 border border-ink flex items-center justify-between">
                    <span>Speed vs Pandas aggregations</span>
                    <span className="text-emerald-700 font-bold">10x - 75x Faster</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <span>Replace 20 lines of pandas wrangling with declarative SQL</span>
              </div>
            </div>
          </div>

          {/* Proof Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500 fill-amber-400" /> Multi-threaded WASM
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> 100% Private (No Telemetry)
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-600" /> Vectorized Columnar Engine
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-ink" /> {EXERCISES.length} Interactive Challenges
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Sandbox with Single Formatted Query & Syntax Colors */}
        <div className="max-w-3xl mx-auto mt-8 sm:mt-12 border-3 border-ink bg-code-bg shadow-brutal text-left overflow-hidden">
          
          {/* Top Bar with window controls */}
          <div className="px-3 sm:px-4 py-2.5 bg-[#1E293B] border-b-2 border-code-border flex items-center justify-between text-white text-xs select-none gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-black/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black/20" />
              </div>
              <span className="font-mono text-[11px] text-slate-300 ml-1.5 flex items-center gap-1.5 font-bold">
                <Terminal size={13} className="text-duck" />
                <span>duckdb-interactive.sql</span>
              </span>
            </div>

            <button
              onClick={() => runDemo()}
              disabled={isRunningDemo}
              className="flex items-center gap-1.5 px-3 py-1 bg-duck text-ink font-extrabold text-xs border border-ink shadow-brutal-xs hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
            >
              <Play size={12} className="fill-ink" />
              <span>{isRunningDemo ? 'Running...' : 'Execute Query'}</span>
            </button>
          </div>

          {/* Formatted CodeMirror SQL Editor with syntax colors */}
          <div className="bg-[#0F172A] border-b-2 border-code-border text-xs">
            <CodeMirror
              value={demoQuery}
              onChange={val => setDemoQuery(val)}
              theme={oneDark}
              extensions={[sql()]}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: false,
                highlightActiveLine: false,
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: false,
              }}
              className="font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Live Execution Output */}
          {demoResult && (
            <div className="bg-[#0B1120] p-3 sm:p-4 text-xs font-mono text-slate-200 overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-auto">
              <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Executed in DuckDB-Wasm ({demoResult.rowCount} rows)
                </span>
                <span className="bg-slate-800 text-duck px-2 py-0.5 border border-slate-700 font-bold">
                  ⚡ {demoResult.executionTimeMs} ms
                </span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase">
                    {demoResult.columns.map((c, i) => (
                      <th key={i} className="py-1 px-2.5 whitespace-nowrap">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {demoResult.rows.map((r, ri) => (
                    <tr key={ri} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                      {r.map((val, ci) => (
                        <td key={ci} className="py-1.5 px-2.5 text-slate-300 whitespace-nowrap">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 border-b-3 border-ink bg-surface-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-duck-dark bg-duck/20 px-2.5 py-1 border border-duck-dark">
              Why learn with DuckDB?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
              The Analytical SQL Stack of the Future
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 border-3 border-ink bg-canvas shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-duck border-2 border-ink flex items-center justify-center font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  01
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Modern SQL Dialect</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Learn modern dialect syntax like <code className="bg-white px-1 py-0.5 border border-ink text-ink font-mono font-bold">GROUP BY ALL</code>,{' '}
                  <code className="bg-white px-1 py-0.5 border border-ink text-ink font-mono font-bold">SELECT * EXCLUDE</code>, and{' '}
                  <code className="bg-white px-1 py-0.5 border border-ink text-ink font-mono font-bold">QUALIFY</code> that modern data teams use daily.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-3 border-ink bg-canvas shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-duck border-2 border-ink flex items-center justify-center font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  02
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Instant Wasm Sandbox</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  No remote servers or spin-up delays. DuckDB executes in a background Web Worker right inside your browser, completing queries in milliseconds.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-3 border-ink bg-canvas shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-duck border-2 border-ink flex items-center justify-center font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  03
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Interview-Grade Challenges</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Progress through {EXERCISES.length} exercises across realistic store, corporate, and academic schemas, culminating in retention cohorts and ranking challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Syllabus Section */}
      <section id="syllabus" className="py-10 sm:py-16 px-4 sm:px-6 border-b-3 border-ink bg-canvas">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-duck-dark bg-duck/20 px-2.5 py-1 border border-duck-dark">
                Curriculum Map
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
                18 Structured Modules • {EXERCISES.length} Exercises
              </h2>
            </div>
            <button
              onClick={() => onStartLearning()}
              className="w-full sm:w-auto px-4 py-2.5 bg-duck font-bold text-xs sm:text-sm border-2 border-ink shadow-brutal hover:bg-duck-hover transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start from Module 1</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {MODULES.map((mod, index) => {
              const modExercises = EXERCISES.filter(e => e.module === mod.id);
              const hasDuckDb = modExercises.some(e => e.isDuckDbFeature);

              return (
                <div
                  key={mod.id}
                  onClick={() => onStartLearning(modExercises[0]?.id)}
                  className="p-4 sm:p-5 border-3 border-ink bg-surface-card shadow-brutal hover:shadow-brutal-lg hover:border-black cursor-pointer group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 border border-ink">
                        Module {index + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-ink-muted">
                        {modExercises.length} tasks
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-ink group-hover:text-amber-600 transition-colors">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-ink group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Start Module <ArrowRight size={13} />
                    </span>
                    {hasDuckDb && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 border border-amber-300">
                        <Sparkles size={10} /> DuckDB
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 border-b-3 border-ink bg-surface-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Everything you need to know about the platform.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-ink bg-canvas">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-3.5 sm:p-4 font-bold text-xs sm:text-sm flex items-center justify-between hover:bg-duck-light/60 transition-colors select-none"
                >
                  <span className="pr-2 leading-snug">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 ml-1 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-xs text-ink-muted leading-relaxed border-t border-ink/10 pt-2 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-duck text-center border-b-3 border-ink">
        <div className="max-w-xl mx-auto space-y-4 flex flex-col items-center">
          <img src="/logo.svg" alt="Learn DuckDB" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink uppercase">
            Start Writing DuckDB SQL Today
          </h2>
          <p className="text-xs sm:text-sm font-bold text-ink/80">
            No signup. No configuration. Runs completely in your browser.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onStartLearning()}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-ink text-white font-extrabold text-sm sm:text-base border-3 border-ink shadow-brutal hover:bg-slate-800 active:translate-x-1 active:translate-y-1 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Learning Free</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 bg-surface-card text-center text-[11px] sm:text-xs text-ink-muted font-mono">
        <p className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 leading-relaxed">
          <span>Learn Duckdb • GPLv3 License</span>
          <span>•</span>
          <a
            href="https://github.com/learnnishkaam/learn-duckdb"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold text-ink hover:text-amber-600"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href="https://buymeacoffee.com/haydermuhib"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold text-ink hover:text-amber-600 inline-flex items-center gap-1"
          >
            <BuyMeACoffeeIcon className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Coffee</span>
          </a>
          <span>•</span>
          <span>
            Powered by{' '}
            <a
              href="https://duckdb.org"
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-ink hover:text-amber-600"
            >
              DuckDB-Wasm
            </a>
          </span>
        </p>
      </footer>
    </div>
  );
};

