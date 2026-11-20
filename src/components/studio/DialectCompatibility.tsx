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

  const renderBadge = (status: 'native' | 'supported' | 'unsupported' | string | undefined) => {
    if (!status || status === 'unsupported') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-300 rounded-sm">
          <X size={10} /> Unsupported
        </span>
      );
    }
    if (status === 'native' || status === 'supported') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-sm">
          <Check size={10} /> Native
        </span>
      );
    }
    // Custom note / alternative
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-sm w-fit">
          <AlertCircle size={10} /> Alternative
        </span>
        <span className="text-[10px] text-stone-600 font-mono mt-0.5">{status}</span>
      </div>
    );
  };

  return (
    <div className="border border-stone-300 bg-stone-50 rounded-none overflow-hidden my-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-stone-100 hover:bg-stone-200/70 transition-colors"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] font-bold text-ink">
          <Database size={13} className="text-stone-700" />
          <span>Engine Portability</span>
          {isDuckDbFeature ? (
            <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 font-extrabold border border-amber-400 inline-flex items-center gap-0.5">
              <Sparkles size={9} /> DuckDB exclusive
            </span>
          ) : (
            <span className="text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.2 font-bold border border-sky-300">
              Postgres & DuckDB
            </span>
          )}
        </span>
        <span className="text-[10px] text-stone-600 flex items-center gap-1 font-sans font-semibold">
          {isOpen ? 'Hide details' : 'Compare dialects'}
          <ChevronDown size={13} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-stone-300 space-y-2.5 bg-white text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* DuckDB */}
            <div className="p-2 border border-stone-200 bg-amber-50/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                DuckDB
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-400 rounded-sm">
                <Check size={10} /> Native analytical engine
              </span>
            </div>

            {/* PostgreSQL */}
            <div className="p-2 border border-stone-200 bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                PostgreSQL
              </span>
              {renderBadge(compatibility?.postgres ?? (isDuckDbFeature ? 'unsupported' : 'native'))}
            </div>

            {/* MySQL */}
            <div className="p-2 border border-stone-200 bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                MySQL
              </span>
              {renderBadge(compatibility?.mysql ?? (isDuckDbFeature ? 'unsupported' : 'unsupported'))}
            </div>

            {/* SQLite */}
            <div className="p-2 border border-stone-200 bg-stone-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                SQLite
              </span>
              {renderBadge(compatibility?.sqlite ?? (isDuckDbFeature ? 'unsupported' : 'unsupported'))}
            </div>
          </div>

          {compatibility?.notes && (
            <div className="flex items-start gap-1.5 text-[11px] text-stone-600 bg-stone-50 border border-stone-200 p-2 leading-relaxed">
              <Info size={13} className="text-sky-600 shrink-0 mt-0.5" />
              <span>{compatibility.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
