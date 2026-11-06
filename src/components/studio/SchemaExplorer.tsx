import React, { useState, useEffect } from 'react';
import { DatabaseDef } from '../../types/curriculum';
import { Database, Table, ChevronRight, ChevronDown, Eye, Key, ChevronsUpDown, Copy, Check } from 'lucide-react';

interface SchemaExplorerProps {
  database: DatabaseDef;
  onPreviewTable: (tableName: string) => void;
  onInsertText?: (text: string) => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({
  database,
  onPreviewTable,
  onInsertText,
}) => {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [database.tables[0]?.name || '']: true,
  });
  const [copiedIdentifier, setCopiedIdentifier] = useState<string | null>(null);

  // Reset or initialize when database changes
  useEffect(() => {
    setExpandedTables({
      [database.tables[0]?.name || '']: true,
    });
  }, [database.id]);

  const allExpanded = database.tables.length > 0 && database.tables.every(t => expandedTables[t.name]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedTables({});
    } else {
      const next: Record<string, boolean> = {};
      database.tables.forEach(t => {
        next[t.name] = true;
      });
      setExpandedTables(next);
    }
  };

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const handleCopyIdentifier = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdentifier(text);
    setTimeout(() => {
      setCopiedIdentifier(prev => (prev === text ? null : prev));
    }, 1500);

    if (onInsertText) {
      onInsertText(text);
    }
  };

  return (
    <div className="flex flex-col border-3 border-ink bg-surface-card shadow-brutal overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-muted border-b-2 border-ink">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-ink" />
          <span className="font-extrabold text-xs tracking-wide uppercase">
            DB: {database.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1 text-[11px] font-bold text-ink hover:text-amber-700 bg-white hover:bg-slate-100 border border-ink/40 px-2 py-0.5 transition-colors cursor-pointer"
            title={allExpanded ? 'Collapse all tables' : 'Expand all tables'}
          >
            <ChevronsUpDown size={11} />
            <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
          </button>
          <span className="text-[10px] bg-duck px-2 py-0.5 font-bold border border-ink">
            {database.tables.length} tables
          </span>
        </div>
      </div>

      {/* Table list - naturally expands as deep as needed */}
      <div className="p-2 space-y-1.5">
        {database.tables.map(table => {
          const isExpanded = !!expandedTables[table.name];
          const isTableCopied = copiedIdentifier === table.name;

          return (
            <div key={table.name} className="border-2 border-ink bg-white">
              {/* Table header row */}
              <div
                onClick={() => toggleTable(table.name)}
                className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-duck-light/60 transition-colors select-none group"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Table size={13} className="text-ink-muted" />
                  <span>{table.name}</span>

                  <button
                    type="button"
                    onClick={(e) => handleCopyIdentifier(e, table.name)}
                    title={`Copy "${table.name}" to clipboard`}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-ink-muted hover:text-ink hover:bg-slate-200 transition-opacity ml-1 rounded"
                  >
                    {isTableCopied ? (
                      <Check size={11} className="text-emerald-700" />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ink-subtle font-mono">
                    {table.rows.length} rows
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewTable(table.name);
                    }}
                    title={`Preview rows from ${table.name} without changing your editor query`}
                    className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 hover:bg-duck hover:text-ink border border-slate-300 hover:border-ink transition-colors cursor-pointer bg-slate-50"
                  >
                    <Eye size={11} />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                </div>
              </div>

              {/* Columns dropdown */}
              {isExpanded && (
                <div className="px-2.5 py-1.5 border-t border-slate-200 bg-slate-50 font-mono text-[11px] space-y-1">
                  {table.columns.map(([colName, colType]) => {
                    const isPk = colType.toUpperCase().includes('PRIMARY KEY');
                    const cleanType = colType.replace(/PRIMARY KEY/i, '').trim();
                    const isColCopied = copiedIdentifier === colName;

                    return (
                      <div
                        key={colName}
                        onClick={(e) => handleCopyIdentifier(e, colName)}
                        title={`Click to copy "${colName}"`}
                        className="flex items-center justify-between py-0.5 px-1 hover:bg-duck-light/60 cursor-pointer rounded text-slate-700 group transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          {isPk ? (
                            <Key size={11} className="text-amber-600 font-bold shrink-0" />
                          ) : (
                            <span className="w-2.5 text-center text-slate-300 shrink-0">•</span>
                          )}
                          <span className={isPk ? 'font-bold text-ink' : ''}>{colName}</span>
                          {isPk && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 border border-amber-300 font-sans font-bold">
                              PK
                            </span>
                          )}
                          <span className="opacity-0 group-hover:opacity-100 text-[9px] text-ink-muted flex items-center gap-0.5 ml-1">
                            {isColCopied ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                <Check size={10} /> Copied
                              </span>
                            ) : (
                              <Copy size={10} />
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{cleanType || colType}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
