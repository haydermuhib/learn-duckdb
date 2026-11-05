import React, { useState } from 'react';
import { MODULES, EXERCISES } from '../../data/curriculum';
import { executeQuery, QueryResult } from '../../engine/duckdb';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  BookOpen,
  CheckCircle2,
  Terminal,
  Play,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: (moduleId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning }) => {
  // Interactive Sandbox Teaser on Hero
  const [demoQuery, setDemoQuery] = useState(
    "SELECT category, COUNT(*) AS items, ROUND(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY ALL\nORDER BY items DESC;"
  );
  const [demoResult, setDemoResult] = useState<QueryResult | null>(null);
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const runDemo = async () => {
    setIsRunningDemo(true);
    try {
      const res = await executeQuery(demoQuery);
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
      a: 'DuckDB is the modern standard for fast analytical queries (OLAP). It supports clean modern SQL features like `GROUP BY ALL`, `SELECT * EXCLUDE`, `QUALIFY`, and native window functions that traditional databases make painful or lack entirely.',
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
      a: '148+ exercises divided into 18 structured modules—spanning foundational SELECT and JOINs, subqueries, CTEs, window functions, and real-world data engineering interview challenges.',
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
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🦆</span>
            <span className="font-extrabold text-xl tracking-tight">learn-duckdb</span>
            <span className="hidden sm:inline-block text-[11px] font-mono font-bold bg-duck px-2 py-0.5 border border-ink ml-1">
              v1.0 WASM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onStartLearning()}
              className="flex items-center gap-1.5 px-4 py-2 bg-duck font-extrabold text-sm border-2 border-ink shadow-brutal hover:bg-duck-hover active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>Launch Studio</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 border-b-3 border-ink relative overflow-hidden bg-gradient-to-b from-canvas to-[#F5EEDD]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-card border-2 border-ink shadow-brutal-sm text-xs font-bold font-mono">
            <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            <span>100% In-Browser Analytical Database</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-ink uppercase font-sans">
            Master Modern SQL in Your Browser.
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            148+ interactive exercises powered by real <span className="font-bold text-ink underline decoration-duck decoration-4">DuckDB-Wasm</span>. 
            Zero installation, zero server lag, and zero sign-up required.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onStartLearning()}
              className="px-8 py-4 bg-duck text-ink font-extrabold text-base border-3 border-ink shadow-brutal hover:bg-duck-hover hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2"
            >
              <span>Start Learning Free</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#syllabus"
              className="px-6 py-4 bg-surface-card text-ink font-bold text-base border-3 border-ink shadow-brutal hover:bg-surface-muted active:translate-x-1 active:translate-y-1 transition-all"
            >
              Browse 18 Modules
            </a>
          </div>

          {/* Proof Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" /> Multi-threaded WASM
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> 100% Private (No Telemetry)
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-600" /> Vectorized Columnar Engine
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Sandbox */}
        <div className="max-w-3xl mx-auto mt-12 border-3 border-ink bg-code-bg shadow-brutal text-left overflow-hidden">
          <div className="px-4 py-2.5 bg-[#1E293B] border-b-2 border-code-border flex items-center justify-between text-white text-xs select-none">
            <div className="flex items-center gap-2 font-mono">
              <Terminal size={14} className="text-duck" />
              <span>Try a live DuckDB query right now:</span>
            </div>
            <button
              onClick={runDemo}
              disabled={isRunningDemo}
              className="flex items-center gap-1.5 px-3 py-1 bg-duck text-ink font-bold text-xs border border-ink hover:bg-duck-hover transition-colors"
            >
              <Play size={12} className="fill-ink" />
              {isRunningDemo ? 'Running...' : 'Execute Query'}
            </button>
          </div>

          <div className="p-4 bg-code-bg text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{demoQuery}</pre>
          </div>

          {demoResult && (
            <div className="border-t-2 border-code-border bg-[#0B1120] p-3 text-xs font-mono text-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400">
                <span>Output ({demoResult.rowCount} rows)</span>
                <span>⚡ {demoResult.executionTimeMs} ms</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase">
                    {demoResult.columns.map((c, i) => (
                      <th key={i} className="py-1 px-2">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {demoResult.rows.map((r, ri) => (
                    <tr key={ri} className="border-b border-slate-800/60">
                      {r.map((val, ci) => (
                        <td key={ci} className="py-1 px-2 text-slate-300">
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
      <section className="py-16 px-6 border-b-3 border-ink bg-surface-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-duck-dark bg-duck/20 px-2.5 py-1 border border-duck-dark">
              Why learn with DuckDB?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              The Analytical SQL Stack of the Future
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-3 border-ink bg-canvas shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-duck border-2 border-ink flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h3 className="text-xl font-bold mb-2">Modern SQL Dialect</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Learn game-changing syntax like <code className="bg-white px-1 py-0.5 border border-ink text-ink font-mono font-bold">GROUP BY ALL</code>,{' '}
                  <code className="bg-white px-1 py-0.5 border border-ink text-ink font-mono font-bold">SELECT * EXCLUDE</code>, and{' '}
                  <code className="bg-white px-1 py-0.5 border border-ink text-ink font-mono font-bold">QUALIFY</code> that modern data teams use daily.
                </p>
              </div>
            </div>

            <div className="p-6 border-3 border-ink bg-canvas shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-duck border-2 border-ink flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Wasm Sandbox</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  No remote servers or spin-up delays. DuckDB executes in a background Web Worker right inside your browser, completing queries in milliseconds.
                </p>
              </div>
            </div>

            <div className="p-6 border-3 border-ink bg-canvas shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-duck border-2 border-ink flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h3 className="text-xl font-bold mb-2">Interview-Grade Challenges</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Progress through 148+ exercises across realistic store, corporate, and academic schemas, culminating in retention cohorts and ranking challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Syllabus Section */}
      <section id="syllabus" className="py-16 px-6 border-b-3 border-ink bg-canvas">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-duck-dark bg-duck/20 px-2.5 py-1 border border-duck-dark">
                Curriculum Map
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
                18 Structured Modules • 148+ Exercises
              </h2>
            </div>
            <button
              onClick={() => onStartLearning()}
              className="self-start md:self-auto px-4 py-2 bg-duck font-bold text-xs border-2 border-ink shadow-brutal hover:bg-duck-hover transition-all flex items-center gap-1.5"
            >
              <span>Start from Module 1</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((mod, index) => {
              const modExercises = EXERCISES.filter(e => e.module === mod.id);
              const hasDuckDb = modExercises.some(e => e.isDuckDbFeature);

              return (
                <div
                  key={mod.id}
                  onClick={() => onStartLearning(modExercises[0]?.id)}
                  className="p-5 border-3 border-ink bg-surface-card shadow-brutal hover:shadow-brutal-lg hover:border-black cursor-pointer group transition-all flex flex-col justify-between"
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
      <section className="py-16 px-6 border-b-3 border-ink bg-surface-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight">
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
                  className="w-full text-left p-4 font-bold text-sm flex items-center justify-between hover:bg-duck-light/60 transition-colors select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-ink-muted leading-relaxed border-t border-ink/10 pt-2 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-6 bg-duck text-center border-b-3 border-ink">
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-3xl">🦆</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink uppercase">
            Start Writing DuckDB SQL Today
          </h2>
          <p className="text-sm font-bold text-ink/80">
            No signup. No configuration. Runs completely in your browser.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onStartLearning()}
              className="px-8 py-4 bg-ink text-white font-extrabold text-base border-3 border-ink shadow-brutal hover:bg-slate-800 active:translate-x-1 active:translate-y-1 transition-all inline-flex items-center gap-2"
            >
              <span>Start Learning Free</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 bg-surface-card text-center text-xs text-ink-muted font-mono">
        <p>
          learn-duckdb • Open Source MIT License • Powered by{' '}
          <a
            href="https://duckdb.org"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold text-ink hover:text-amber-600"
          >
            DuckDB-Wasm
          </a>
        </p>
      </footer>
    </div>
  );
};

