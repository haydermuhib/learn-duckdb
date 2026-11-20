import React, { useState } from 'react';
import { EngineCompatibility } from '../../types/curriculum';
import { Database, ChevronDown, Check, X, AlertCircle, Info, Sparkles } from 'lucide-react';

interface DialectCompatibilityProps {
  compatibility?: EngineCompatibility;
  isDuckDbFeature?: boolean;
}

export const DialectCompatibility: React.FC<DialectCompatibilityProps> = ({
  compatibility,
  isDuckDbFeature,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!compatibility && !isDuckDbFeature) {
    return null;
  }

  // Derive engine status
  const duckStatus = 'native';
  const pgStatus = compatibility?.postgres ?? (isDuckDbFeature ? 'unsupported' : 'native');
  const myStatus = compatibility?.mysql ?? (isDuckDbFeature ? 'unsupported' : 'unsupported');
  const sqStatus = compatibility?.sqlite ?? (isDuckDbFeature ? 'unsupported' : 'unsupported');

  const getStatusType = (status: string | undefined): 'native' | 'unsupported' | 'alt' => {
    if (!status) return 'unsupported';
    const lower = status.toLowerCase();
    if (lower.startsWith('native')) return 'native';
    if (lower.startsWith('unsupported')) return 'unsupported';
    return 'alt';
  };

  const renderMicroChip = (status: string | undefined) => {
    const type = getStatusType(status);
    if (type === 'native') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-1 py-0.2">
          <Check size={8} strokeWidth={3} /> Native
        </span>
      );
    }
    if (type === 'unsupported') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-rose-800 bg-rose-100/90 border border-rose-300 px-1 py-0.2">
          <X size={8} strokeWidth={3} /> No
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-1 py-0.2">
        <AlertCircle size={8} strokeWidth={2.5} /> Alt
      </span>
    );
  };

  const renderDetailBadge = (status: string | undefined) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-300 w-fit">
          <X size={10} className="shrink-0" /> Unsupported
        </span>
      );
    }

    const type = getStatusType(status);

    if (type === 'native') {
      const detail = status.replace(/^native\s*(\((.*)\))?$/i, '$2').trim();
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 w-fit">
            <Check size={10} className="shrink-0" /> Native
          </span>
          {detail && (
            <span className="text-[10px] text-stone-600 font-mono mt-0.5 leading-snug break-words">
              {detail}
            </span>
          )}
        </div>
      );
    }

    if (type === 'unsupported') {
      const detail = status.replace(/^unsupported\s*(\((.*)\))?$/i, '$2').trim();
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-300 w-fit">
            <X size={10} className="shrink-0" /> Unsupported
          </span>
          {detail && (
            <span className="text-[10px] text-stone-600 font-mono mt-0.5 leading-snug break-words">
              {detail}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 w-fit">
          <AlertCircle size={10} className="shrink-0" /> Alternative
        </span>
        <span className="text-[10px] text-stone-600 font-mono mt-0.5 leading-snug break-words">
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="border-2 border-ink bg-white my-2.5 shadow-brutal-xs overflow-hidden">
      {/* Clickable Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-left bg-surface-muted hover:bg-stone-200/70 border-b border-ink/20 transition-colors select-none cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Database size={13} className="text-ink shrink-0" />
          <span className="font-mono text-[11px] font-extrabold text-ink uppercase tracking-wide whitespace-nowrap">
            Engine Portability
          </span>
          {isDuckDbFeature ? (
            <span className="text-[9px] font-mono font-extrabold bg-amber-200 text-amber-950 px-1.5 py-0.2 border border-amber-400 inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
              <Sparkles size={8} className="text-amber-800 shrink-0" /> DuckDB Only
            </span>
          ) : (
            <span className="text-[9px] font-mono font-extrabold bg-sky-100 text-sky-950 px-1.5 py-0.2 border border-sky-300 inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
              Postgres & DuckDB
            </span>
          )}
        </div>

        <div className="flex items-center shrink-0">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white border border-ink shadow-brutal-xs hover:bg-duck transition-all">
            <span>{isOpen ? 'Hide' : 'Compare'}</span>
            <ChevronDown
              size={11}
              className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </div>
      </button>

      {/* At-a-Glance 4-Engine Matrix Strip (Always visible) */}
      <div className="grid grid-cols-4 divide-x divide-ink/15 bg-stone-50/70 py-1 px-0.5 text-center items-center">
        <div className="flex flex-col items-center justify-center px-1 py-0.5">
          <span className="text-[9px] font-mono font-bold text-stone-600 uppercase mb-0.5">DuckDB</span>
          {renderMicroChip(duckStatus)}
        </div>
        <div className="flex flex-col items-center justify-center px-1 py-0.5">
          <span className="text-[9px] font-mono font-bold text-stone-600 uppercase mb-0.5">Postgres</span>
          {renderMicroChip(pgStatus)}
        </div>
        <div className="flex flex-col items-center justify-center px-1 py-0.5">
          <span className="text-[9px] font-mono font-bold text-stone-600 uppercase mb-0.5">MySQL</span>
          {renderMicroChip(myStatus)}
        </div>
        <div className="flex flex-col items-center justify-center px-1 py-0.5">
          <span className="text-[9px] font-mono font-bold text-stone-600 uppercase mb-0.5">SQLite</span>
          {renderMicroChip(sqStatus)}
        </div>
      </div>

      {/* Expanded Details Breakdown */}
      {isOpen && (
        <div className="p-2.5 border-t border-ink/20 space-y-2 bg-white text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* DuckDB */}
            <div className="p-2 border border-amber-300 bg-amber-50/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 block font-mono">
                DuckDB
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-950 border border-amber-400">
                <Check size={10} className="shrink-0" /> Native analytical engine
              </span>
            </div>

            {/* PostgreSQL */}
            <div className="p-2 border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block font-mono">
                PostgreSQL
              </span>
              {renderDetailBadge(pgStatus)}
            </div>

            {/* MySQL */}
            <div className="p-2 border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block font-mono">
                MySQL
              </span>
              {renderDetailBadge(myStatus)}
            </div>

            {/* SQLite */}
            <div className="p-2 border border-stone-200 bg-stone-50/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 block font-mono">
                SQLite
              </span>
              {renderDetailBadge(sqStatus)}
            </div>
          </div>

          {compatibility?.notes && (
            <div className="flex items-start gap-1.5 text-[11px] text-sky-950 bg-sky-50 border border-sky-300 p-2 leading-relaxed">
              <Info size={13} className="text-sky-700 shrink-0 mt-0.5" />
              <span>{compatibility.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
