import React, { useState, useEffect } from 'react';
import { PlaygroundTableSchema } from '../../engine/playgroundDuckdb';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Database,
  Table,
  ChevronRight,
  ChevronDown,
  Eye,
  Key,
  ChevronsUpDown,
  Copy,
  Check,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';

interface PlaygroundSchemaExplorerProps {
  tables: PlaygroundTableSchema[];
  onPreviewTable: (tableName: string) => void;
  onDeleteTable?: (tableName: string, fileName?: string) => void;
}

export const PlaygroundSchemaExplorer: React.FC<PlaygroundSchemaExplorerProps> = ({
  tables,
  onPreviewTable,
  onDeleteTable,
}) => {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [copiedIdentifier, setCopiedIdentifier] = useState<string | null>(null);
  const [tableToDelete, setTableToDelete] = useState<{
    name: string;
    fileName?: string;
    isDefault?: boolean;
  } | null>(null);

  // Auto-expand first table when tables load
  useEffect(() => {
    if (tables.length > 0 && Object.keys(expandedTables).length === 0) {
      setExpandedTables({ [tables[0].name]: true });
    }
  }, [tables]);

  const allExpanded = tables.length > 0 && tables.every(t => expandedTables[t.name]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedTables({});
    } else {
      const next: Record<string, boolean> = {};
      tables.forEach(t => {
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
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col border-3 border-ink bg-surface-card shadow-brutal overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-muted border-b-2 border-ink min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Database size={15} className="text-ink shrink-0" />
          <span className="font-extrabold text-xs tracking-wide uppercase truncate">
            Active Tables ({tables.length})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1 text-[11px] font-bold text-ink hover:text-amber-700 bg-white hover:bg-slate-100 border border-ink/40 px-2 py-0.5 transition-colors cursor-pointer"
            title={allExpanded ? 'Collapse all tables' : 'Expand all tables'}
          >
            <ChevronsUpDown size={11} />
            <span className="hidden xs:inline">{allExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* Table list - naturally expands as deep as needed */}
      <div className="p-2 space-y-2">
        {tables.length === 0 ? (
          <div className="p-4 text-center text-xs text-ink-muted">
            <p>No tables loaded.</p>
            <p className="text-[11px] mt-1">Import a CSV, Parquet, or JSON file above.</p>
          </div>
        ) : (
          tables.map(table => {
            const isExpanded = !!expandedTables[table.name];
            const isTableCopied = copiedIdentifier === table.name;
            const fileSizeStr = formatFileSize(table.fileSize);

            return (
              <div key={table.name} className="border-2 border-ink bg-white">
                {/* Table Header Row */}
                <div
                  onClick={() => toggleTable(table.name)}
                  className="flex items-center justify-between px-2.5 py-2 cursor-pointer hover:bg-duck-light/60 transition-colors select-none group min-h-[38px]"
                >
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink truncate pr-1 min-w-0">
                    {isExpanded ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
                    <Table size={13} className="text-ink-muted shrink-0" />
                    <span className="truncate">{table.name}</span>

                    {table.isDefault && (
                      <span className="text-[9px] font-sans font-extrabold bg-duck border border-ink px-1 shrink-0">
                        DEFAULT
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={e => handleCopyIdentifier(e, table.name)}
                      title={`Copy table name "${table.name}"`}
                      className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-0.5 text-ink-muted hover:text-ink hover:bg-slate-200 transition-opacity ml-1 rounded shrink-0 cursor-pointer"
                    >
                      {isTableCopied ? (
                        <Check size={11} className="text-emerald-700" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-ink-subtle font-mono">
                      {table.rowCount} {table.rowCount === 1 ? 'row' : 'rows'}
                    </span>

                    {fileSizeStr && (
                      <span className="hidden sm:inline text-[9px] bg-slate-100 border border-slate-300 text-slate-600 px-1 font-mono">
                        {fileSizeStr}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onPreviewTable(table.name);
                      }}
                      title={`Preview first 10 rows of ${table.name}`}
                      className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 hover:bg-duck hover:text-ink border border-slate-300 hover:border-ink transition-colors cursor-pointer bg-slate-50"
                    >
                      <Eye size={11} />
                      <span className="hidden xs:inline">Preview</span>
                    </button>

                    {onDeleteTable && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setTableToDelete({
                            name: table.name,
                            fileName: table.fileName,
                            isDefault: table.isDefault,
                          });
                        }}
                        title={`Delete table "${table.name}"`}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Columns List */}
                {isExpanded && (
                  <div className="px-2.5 py-1.5 border-t border-slate-200 bg-slate-50 font-mono text-[11px] space-y-1">
                    {table.columns.map(col => {
                      const isColCopied = copiedIdentifier === col.name;

                      return (
                        <div
                          key={col.name}
                          onClick={e => handleCopyIdentifier(e, col.name)}
                          title={`Click to copy column "${col.name}"`}
                          className="flex items-center justify-between py-0.5 px-1 hover:bg-duck-light/60 cursor-pointer rounded text-slate-700 group transition-colors"
                        >
                          <div className="flex items-center gap-1.5 truncate pr-1">
                            {col.isPk ? (
                              <Key size={11} className="text-amber-600 font-bold shrink-0" />
                            ) : (
                              <span className="w-2.5 text-center text-slate-300 shrink-0">•</span>
                            )}
                            <span className={col.isPk ? 'font-bold text-ink' : ''}>{col.name}</span>
                            {col.isPk && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1 font-sans font-bold border border-amber-300">
                                PK
                              </span>
                            )}
                            <span className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-[9px] text-ink-muted flex items-center gap-0.5 ml-1">
                              {isColCopied ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                  <Check size={10} /> Copied
                                </span>
                              ) : (
                                <Copy size={10} />
                              )}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">
                            {col.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={!!tableToDelete}
        title={`Delete Table "${tableToDelete?.name}"?`}
        message={
          <span>
            Are you sure you want to delete table <strong className="font-mono bg-slate-100 px-1 py-0.5 border border-slate-300">{tableToDelete?.name}</strong>?
          </span>
        }
        detail={
          tableToDelete?.isDefault
            ? 'This is a default table. Deleting it will drop it from your current session. You can restore all default tables anytime by clicking Reset Playground or reloading the page.'
            : 'This table and its loaded data will be dropped from your current DuckDB session. You can re-upload your file at any time.'
        }
        confirmLabel="Delete Table"
        cancelLabel="Keep Table"
        variant="danger"
        onConfirm={() => {
          if (tableToDelete && onDeleteTable) {
            onDeleteTable(tableToDelete.name, tableToDelete.fileName);
          }
          setTableToDelete(null);
        }}
        onCancel={() => setTableToDelete(null)}
      />
    </div>
  );
};

