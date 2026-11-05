import React, { useState } from 'react';
import { DatabaseDef } from '../../types/curriculum';
import { Database, Table, ChevronRight, ChevronDown, Eye, Key } from 'lucide-react';

interface SchemaExplorerProps {
  database: DatabaseDef;
  onPreviewTable: (tableName: string) => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({
  database,
  onPreviewTable,
}) => {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [database.tables[0]?.name || '']: true,
  });

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
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
        <span className="text-[10px] bg-duck px-2 py-0.5 font-bold border border-ink">
          {database.tables.length} tables
        </span>
      </div>

      {/* Table list */}
      <div className="p-2 space-y-1.5 overflow-y-auto max-h-[280px]">
        {database.tables.map(table => {
          const isExpanded = !!expandedTables[table.name];
          return (
            <div key={table.name} className="border-2 border-ink bg-white">
              {/* Table header row */}
              <div
                onClick={() => toggleTable(table.name)}
                className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-duck-light/60 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Table size={13} className="text-ink-muted" />
                  <span>{table.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ink-subtle font-mono">
                    {table.rows.length} rows
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewTable(table.name);
                    }}
                    title="Preview table"
                    className="p-1 hover:bg-duck hover:text-ink border border-transparent hover:border-ink transition-colors"
                  >
                    <Eye size={12} />
                  </button>
                </div>
              </div>

              {/* Columns dropdown */}
              {isExpanded && (
                <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 font-mono text-[11px] space-y-1">
                  {table.columns.map(([colName, colType]) => {
                    const isPk = colType.toUpperCase().includes('PRIMARY KEY');
                    return (
                      <div
                        key={colName}
                        className="flex items-center justify-between py-0.5 text-slate-700"
                      >
                        <div className="flex items-center gap-1.5">
                          {isPk ? (
                            <Key size={11} className="text-amber-600 font-bold" />
                          ) : (
                            <span className="w-2.5 text-center text-slate-300">•</span>
                          )}
                          <span className={isPk ? 'font-bold text-ink' : ''}>{colName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{colType}</span>
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
