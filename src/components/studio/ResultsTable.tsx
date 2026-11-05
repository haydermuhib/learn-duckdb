import React from 'react';
import { QueryResult } from '../../engine/duckdb';
import { ValidationFeedback } from '../../engine/validator';
import { CheckCircle2, AlertTriangle, Clock, Database, ArrowRight } from 'lucide-react';

interface ResultsTableProps {
  result: QueryResult | null;
  feedback: ValidationFeedback | null;
  onNextExercise?: () => void;
  hasNextExercise?: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  result,
  feedback,
  onNextExercise,
  hasNextExercise,
}) => {
  return (
    <div className="flex flex-col border-3 border-ink bg-surface-card shadow-brutal flex-1 overflow-hidden min-h-[220px]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-ink bg-surface-muted text-xs font-bold">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-ink-muted" />
          <span>Results & Output</span>
        </div>
        {result && (
          <div className="flex items-center gap-3 text-ink-muted font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {result.executionTimeMs} ms
            </span>
            <span>•</span>
            <span>{result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'}</span>
          </div>
        )}
      </div>

      {/* Validation Banner if available */}
      {feedback && (
        <div
          className={`px-4 py-3 border-b-2 border-ink flex items-center justify-between transition-all ${
            feedback.pass
              ? 'bg-success-bg text-success-text'
              : 'bg-failure-bg text-failure-text'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.pass ? (
              <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm leading-tight">
                {feedback.pass ? 'Success!' : 'Not Quite Right'}
              </p>
              <p className="text-xs mt-0.5 opacity-90">{feedback.message}</p>
            </div>
          </div>

          {feedback.pass && hasNextExercise && onNextExercise && (
            <button
              onClick={onNextExercise}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-white font-bold border-2 border-ink shadow-brutal-sm hover:bg-slate-800 text-xs shrink-0"
            >
              <span>Next Exercise</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {!result && !feedback && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-ink-muted">
            <span className="text-3xl mb-2">⚡</span>
            <p className="font-bold text-sm text-ink">Ready to execute</p>
            <p className="text-xs max-w-xs mt-1">
              Write your query above and press "Check Answer" or "Run Query" to see instant live DuckDB results.
            </p>
          </div>
        )}

        {result && result.columns.length === 0 && (
          <div className="p-6 text-center text-ink-muted text-xs font-mono">
            Statement executed successfully. (0 columns returned)
          </div>
        )}

        {result && result.columns.length > 0 && (
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-ink sticky top-0">
                <th className="py-2 px-3 text-[10px] uppercase text-ink-muted font-bold border-r border-slate-200 w-10 text-center">
                  #
                </th>
                {result.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="py-2 px-3 uppercase tracking-wider text-ink font-bold border-r border-slate-200 last:border-r-0 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={result.columns.length + 1}
                    className="py-8 text-center text-ink-muted italic font-sans text-xs"
                  >
                    Query returned 0 rows.
                  </td>
                </tr>
              ) : (
                result.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-slate-200 hover:bg-duck-light/60 transition-colors"
                  >
                    <td className="py-1.5 px-3 text-[10px] text-ink-subtle border-r border-slate-200 text-center select-none bg-slate-50">
                      {rIdx + 1}
                    </td>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-1.5 px-3 border-r border-slate-200 last:border-r-0 whitespace-nowrap ${
                          cell === null
                            ? 'text-slate-400 italic'
                            : typeof cell === 'number'
                            ? 'text-right'
                            : ''
                        }`}
                      >
                        {cell === null ? 'NULL' : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

