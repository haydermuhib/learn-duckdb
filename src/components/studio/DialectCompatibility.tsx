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

  const renderBadge = (status: string | undefined) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-300">
          <X size={10} className="shrink-0" /> Unsupported
        </span>
      );
    }

    const lower = status.toLowerCase();

    if (lower.startsWith('native')) {
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

    if (lower.startsWith('unsupported')) {
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

    // Custom alternative / syntax
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
    <div className="border border-stone-300 bg-stone-50 rounded-none overflow-hidden my-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left bg-stone-100 hover:bg-stone-200/80 transition-colors select-none focus:outline-none"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-ink whitespace-nowrap shrink-0">
            <Database size={13} className="text-stone-700 shrink-0" />
            <span>Engine Portability</span>
          </div>
          {isDuckDbFeature ? (
            <span className="text-[9px] font-mono font-bold bg-amber-200 text-amber-950 px-1.5 py-0.5 border border-amber-400 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
              <Sparkles size={9} className="text-amber-800 shrink-0" /> DuckDB exclusive
            </span>
          ) : (
            <span className="text-[9px] font-mono font-bold bg-sky-100 text-sky-900 px-1.5 py-0.5 border border-sky-300 whitespace-nowrap shrink-0">
              Postgres & DuckDB
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[10px] text-stone-600 font-sans font-semibold shrink-0 whitespace-nowrap ml-auto">
          <span className="hidden sm:inline">{isOpen ? 'Hide details' : 'Compare dialects'}</span>
          <span className="hidden xs:inline sm:hidden">{isOpen ? 'Hide' : 'Compare'}</span>
          <ChevronDown
            size={13}
            className={`text-stone-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-stone-300 space-y-2.5 bg-white text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* DuckDB */}
            <div className="p-2 border border-amber-300 bg-amber-50/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-mono">
                DuckDB
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-400">
                <Check size={10} className="shrink-0" /> Native analytical engine
              </span>
            </div>

            {/* PostgreSQL */}
            <div className="p-2 border border-stone-200 bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block font-mono">
                PostgreSQL
              </span>
              {renderBadge(compatibility?.postgres ?? (isDuckDbFeature ? 'unsupported' : 'native'))}
            </div>

            {/* MySQL */}
            <div className="p-2 border border-stone-200 bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block font-mono">
                MySQL
              </span>
              {renderBadge(compatibility?.mysql ?? (isDuckDbFeature ? 'unsupported' : 'unsupported'))}
            </div>

            {/* SQLite */}
            <div className="p-2 border border-stone-200 bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block font-mono">
                SQLite
              </span>
              {renderBadge(compatibility?.sqlite ?? (isDuckDbFeature ? 'unsupported' : 'unsupported'))}
            </div>
          </div>

          {compatibility?.notes && (
            <div className="flex items-start gap-2 text-[11px] text-stone-700 bg-stone-50 border border-stone-200 p-2.5 leading-relaxed">
              <Info size={14} className="text-sky-600 shrink-0 mt-0.5" />
              <span>{compatibility.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
