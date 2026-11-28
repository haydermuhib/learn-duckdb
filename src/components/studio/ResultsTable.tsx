import React, { useState, useEffect } from 'react';
import { motion, type Transition } from 'framer-motion';
import { QueryResult } from '../../engine/duckdb';
import { ValidationFeedback } from '../../engine/validator';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  ArrowRight,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
} from 'lucide-react';

interface ResultsTableProps {
  result: QueryResult | null;
  feedback: ValidationFeedback | null;
  onNextExercise?: () => void;
  hasNextExercise?: boolean;
}

// /effects Rule 3 & 6
const EFFECTS_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FEEDBACK_TRANSITION: Transition = { duration: 0.25, delay: 0, ease: EFFECTS_EASE };

const parseJsonPreview = (val: any): { isJson: boolean; preview?: string; summary?: string } => {
  if (typeof val !== 'string' || (!val.startsWith('{') && !val.startsWith('['))) {
    return { isJson: false };
  }
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) {
      return {
        isJson: true,
        summary: `[${parsed.length} items]`,
        preview: val.length > 50 ? val.substring(0, 47) + '...' : val,
      };
    }
    if (typeof parsed === 'object' && parsed !== null) {
      const keys = Object.keys(parsed);
      return {
        isJson: true,
        summary: `{${keys.length} fields}`,
        preview: val.length > 50 ? val.substring(0, 47) + '...' : val,
      };
    }
  } catch {
    // not valid JSON
  }
  return { isJson: false };
};

export const ResultsTable: React.FC<ResultsTableProps> = ({
  result,
  feedback,
  onNextExercise,
  hasNextExercise,
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'expected'>('user');
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inspectCell, setInspectCell] = useState<{ colName: string; rowIdx: number; rawValue: string } | null>(null);
  const [copiedInspect, setCopiedInspect] = useState(false);

  // Reset tab to user and ensure results are visible whenever feedback or result arrives
  useEffect(() => {
    setActiveTab('user');

    if (result || feedback) {
      setIsCollapsed(false);
    }
  }, [feedback, result]);

  const hasExpected = Boolean(feedback?.expectedResult && feedback.expectedResult.columns.length > 0);
  const displayResult = activeTab === 'expected' && feedback?.expectedResult ? feedback.expectedResult : result;

  const handleExportCsv = () => {
    if (!displayResult || displayResult.columns.length === 0) return;

    const header = displayResult.columns.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',');

    const rows = displayResult.rows.map(row =>
      row
        .map(cell => (cell === null || cell === undefined ? '' : `"${String(cell).replace(/"/g, '""')}"`))
        .join(',')
    );

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTab === 'expected' ? 'expected' : 'duckdb'}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div
      className={`flex flex-col border-3 border-ink bg-surface-card shadow-brutal overflow-hidden transition-all ${
        isCollapsed ? 'shrink-0' : 'min-h-[140px]'
      }`}
    >
      {/* Header bar */}
      <div
        className={`flex flex-wrap items-center justify-between px-3 py-2 bg-surface-muted text-xs font-bold gap-2 ${
          isCollapsed ? '' : 'border-b-2 border-ink'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5">
            <Database size={14} className="text-ink-muted shrink-0" />
            <span className="hidden xs:inline">Results & Output</span>
            <span className="xs:hidden">Results</span>
          </div>

          {/* Compact badge when collapsed */}
          {isCollapsed && feedback && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 border ml-1 ${
                feedback.pass
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                  : 'bg-rose-100 border-rose-500 text-rose-800'
              }`}
            >
              {feedback.pass ? '✓ Pass' : '✕ Try Again'}
            </span>
          )}

          {/* Tabs: Your Output vs Expected Output */}
          {!isCollapsed && hasExpected && (
            <div className="flex items-center ml-0 sm:ml-2 border border-ink bg-white p-0.5 text-[10px] sm:text-[11px]">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={FEEDBACK_TRANSITION}
                onClick={() => setActiveTab('user')}
                className={`px-1.5 sm:px-2 py-0.5 font-bold transition-colors cursor-pointer ${
                  activeTab === 'user'
                    ? 'bg-ink text-white'
                    : 'text-ink-muted hover:text-ink hover:bg-slate-100'
                }`}
              >
                <span>Mine {result ? `(${result.rowCount})` : ''}</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={FEEDBACK_TRANSITION}
                onClick={() => setActiveTab('expected')}
                className={`px-1.5 sm:px-2 py-0.5 font-bold transition-colors cursor-pointer ${
                  activeTab === 'expected'
                    ? 'bg-duck text-ink border border-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-slate-100'
                }`}
              >
                <span>Expected ({feedback?.expectedResult?.rowCount})</span>
              </motion.button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {!isCollapsed && displayResult && (
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-ink-muted font-mono text-[11px]">
              {activeTab === 'user' && typeof displayResult.executionTimeMs === 'number' && (
                <span className="hidden sm:flex items-center gap-1">
                  <Clock size={12} /> {displayResult.executionTimeMs} ms
                </span>
              )}
              <span className="hidden sm:inline">•</span>
              <span>
                {displayResult.rowCount} {displayResult.rowCount === 1 ? 'row' : 'rows'}
              </span>

              {/* Export CSV button */}
              {displayResult.columns.length > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={FEEDBACK_TRANSITION}
                  onClick={handleExportCsv}
                  className="flex items-center gap-1 text-[11px] font-sans font-bold px-1.5 sm:px-2 py-0.5 bg-white hover:bg-duck border border-ink shadow-brutal-xs transition-colors text-ink cursor-pointer ml-1"
                  title="Download this table as a CSV file"
                >
                  {copiedCsv ? (
                    <>
                      <Check size={11} className="text-emerald-700" />
                      <span className="hidden xs:inline">Exported</span>
                    </>
                  ) : (
                    <>
                      <Download size={11} />
                      <span className="hidden xs:inline">CSV</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}

          {/* Hide / Show Toggle button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={FEEDBACK_TRANSITION}
            onClick={() => setIsCollapsed(prev => !prev)}
            className="flex items-center gap-1 text-[11px] font-sans font-bold px-2 py-0.5 bg-white hover:bg-duck border border-ink shadow-brutal-xs transition-colors text-ink cursor-pointer ml-1"
            title={isCollapsed ? 'Expand and show query results' : 'Collapse and hide query results'}
          >
            {isCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            <span className="hidden xs:inline">{isCollapsed ? 'Show Results' : 'Hide'}</span>
          </motion.button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Validation Banner if available */}
          {feedback && (
            <div
              className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-ink flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-all ${
                feedback.pass
                  ? 'bg-success-bg text-success-text'
                  : 'bg-failure-bg text-failure-text'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                {feedback.pass ? (
                  <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm leading-tight">
                    {feedback.pass ? 'Success!' : 'Not Quite Right'}
                  </p>
                  <p className="text-xs mt-0.5 opacity-90 break-words">{feedback.message}</p>
                </div>
              </div>

              {feedback.pass && hasNextExercise && onNextExercise && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={FEEDBACK_TRANSITION}
                  onClick={onNextExercise}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-ink text-white font-bold border-2 border-ink shadow-brutal-sm hover:bg-slate-800 text-xs shrink-0 cursor-pointer"
                >
                  <span>Next Exercise</span>
                  <ArrowRight size={14} />
                </motion.button>
              )}
            </div>
          )}

          {/* Table Content */}
          <div className="overflow-x-auto overflow-y-auto max-h-[400px] sm:max-h-[600px] min-h-[140px] custom-scrollbar w-full">
            {!displayResult && !feedback && (
              <div className="py-10 px-4 flex flex-col items-center justify-center text-center text-ink-muted">
                <span className="text-3xl mb-2">⚡</span>
                <p className="font-bold text-sm text-ink">Ready to execute</p>
                <p className="text-xs max-w-xs mt-1">
                  Write your query above and press "Check Answer" or "Run Query" to see instant live DuckDB results.
                </p>
              </div>
            )}

            {displayResult && displayResult.columns.length === 0 && (
              <div className="p-6 text-center text-ink-muted text-xs font-mono">
                Statement executed successfully. (0 columns returned)
              </div>
            )}

            {displayResult && displayResult.columns.length > 0 && (
              <table className="w-full min-w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-ink sticky top-0 z-10">
                    <th className="py-2 px-3 text-[10px] uppercase text-ink-muted font-bold border-r border-slate-200 w-10 text-center">
                      #
                    </th>
                    {displayResult.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="py-2 px-3 tracking-wider text-ink font-bold border-r border-slate-200 last:border-r-0 whitespace-nowrap"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span>{col}</span>
                          {displayResult.columnTypes && displayResult.columnTypes[idx] && (
                            <span className="inline-block text-[9px] font-mono font-medium text-ink-muted uppercase tracking-wider">
                              {displayResult.columnTypes[idx]}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayResult.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={displayResult.columns.length + 1}
                        className="py-8 text-center text-ink-muted italic font-sans text-xs"
                      >
                        Query returned 0 rows.
                      </td>
                    </tr>
                  ) : (
                    displayResult.rows.map((row, rIdx) => (
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
                            {(() => {
                              if (cell === null || cell === undefined) {
                                return <span className="text-slate-400 italic">NULL</span>;
                              }
                              if (typeof cell === 'boolean') {
                                return (
                                  <span
                                    className={`font-bold px-1 py-0.5 text-[10px] border ${
                                      cell
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-rose-50 text-rose-800 border-rose-300'
                                    }`}
                                  >
                                    {cell ? 'TRUE' : 'FALSE'}
                                  </span>
                                );
                              }
                              const jsonInfo = parseJsonPreview(cell);
                              if (jsonInfo.isJson) {
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-duck/80 border border-ink text-ink font-mono shrink-0">
                                      {jsonInfo.summary}
                                    </span>
                                    <span className="text-ink-muted truncate max-w-[220px] text-[11px] font-mono">
                                      {jsonInfo.preview}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setInspectCell({
                                          colName: displayResult.columns[cIdx],
                                          rowIdx: rIdx + 1,
                                          rawValue: String(cell),
                                        })
                                      }
                                      className="ml-auto text-[10px] font-bold px-1.5 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 hover:border-ink transition-colors cursor-pointer shrink-0"
                                      title="Inspect full JSON structure"
                                    >
                                      View
                                    </button>
                                  </div>
                                );
                              }
                              return String(cell);
                            })()}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Complex Struct / List Value Inspector Modal */}
      {inspectCell && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60"
          onClick={() => setInspectCell(null)}
        >
          <div
            className="w-full max-w-2xl bg-white border-3 border-ink shadow-brutal flex flex-col max-h-[85vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b-2 border-ink bg-surface-muted flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Database size={15} className="text-ink shrink-0" />
                <span className="font-extrabold text-xs sm:text-sm uppercase truncate">
                  {inspectCell.colName}{' '}
                  <span className="font-mono text-ink-muted text-xs font-normal">
                    (Row #{inspectCell.rowIdx})
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={FEEDBACK_TRANSITION}
                  onClick={() => {
                    navigator.clipboard.writeText(inspectCell.rawValue);
                    setCopiedInspect(true);
                    setTimeout(() => setCopiedInspect(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-white hover:bg-duck border border-ink shadow-brutal-xs cursor-pointer"
                >
                  {copiedInspect ? (
                    <>
                      <Check size={12} className="text-emerald-700" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy JSON</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={FEEDBACK_TRANSITION}
                  onClick={() => setInspectCell(null)}
                  className="p-1 hover:bg-slate-200 border border-ink cursor-pointer"
                  title="Close Inspector"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>
            <div className="p-3 sm:p-4 overflow-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs custom-scrollbar">
              <pre className="whitespace-pre-wrap break-words">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(inspectCell.rawValue), null, 2);
                  } catch {
                    return inspectCell.rawValue;
                  }
                })()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};