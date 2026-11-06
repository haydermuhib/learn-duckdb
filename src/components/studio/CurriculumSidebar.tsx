import React, { useState } from 'react';
import { ModuleDef, ExerciseDef } from '../../types/curriculum';
import { MODULES, EXERCISES } from '../../data/curriculum';
import { BookOpen, Check, ChevronDown, ChevronRight, Search, Sparkles, X } from 'lucide-react';

interface CurriculumSidebarProps {
  currentExerciseId: string;
  onSelectExercise: (id: string) => void;
  completedIds: Set<string>;
  assistedIds?: Set<string>;
  isOpen: boolean;
  onClose: () => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  currentExerciseId,
  onSelectExercise,
  completedIds,
  assistedIds = new Set(),
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand module containing current exercise
    const currentEx = EXERCISES.find(e => e.id === currentExerciseId);
    return currentEx ? { [currentEx.module]: true } : { select: true };
  });

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const filteredExercises = search.trim()
    ? EXERCISES.filter(
        e =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.concept.toLowerCase().includes(search.toLowerCase()) ||
          e.id.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink/40 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Drawer Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-80 bg-surface-card border-r-3 border-ink flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b-2 border-ink bg-surface-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-ink" />
            <span className="font-extrabold text-sm tracking-tight uppercase">
              Curriculum Syllabus
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-duck border border-ink">
              {completedIds.size}/{EXERCISES.length}
            </span>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-slate-200 border border-ink"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b-2 border-ink">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Search 148+ exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-sans border-2 border-ink focus:outline-none focus:bg-duck-light/40"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="px-3 py-1.5 bg-slate-50 border-b border-ink/20 flex items-center justify-between text-[10px] text-ink-muted">
          <span className="flex items-center gap-1.5" title="Solved independently without hints or solution">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check size={9} strokeWidth={3} />
            </span>
            <span className="font-semibold text-slate-700">Mastered</span>
          </span>
          <span className="flex items-center gap-1.5" title="Solved with revealed hints or solution">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center shrink-0">
              <Check size={9} strokeWidth={2.5} />
            </span>
            <span className="font-semibold text-slate-700">With hints</span>
          </span>
        </div>

        {/* Exercises list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredExercises ? (
            // Search results view
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-ink-muted px-2 py-1">
                Found {filteredExercises.length} results:
              </p>
              {filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => {
                    onSelectExercise(ex.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2 border-2 border-ink text-xs flex items-center justify-between transition-colors ${
                    ex.id === currentExerciseId
                      ? 'bg-duck font-bold shadow-brutal-sm'
                      : 'bg-white hover:bg-duck-light'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[10px] text-ink-muted block uppercase">
                      {ex.module}
                    </span>
                    <span className="truncate">{ex.title}</span>
                  </div>
                  {completedIds.has(ex.id) && (
                    assistedIds.has(ex.id) ? (
                      <div
                        className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center shrink-0"
                        title="Completed with hints (Solve independently to earn mastery)"
                      >
                        <Check size={10} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div
                        className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"
                        title="Mastered (Solved independently)"
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )
                  )}
                </button>
              ))}
            </div>
          ) : (
            // Module accordion view
            MODULES.map((mod, index) => {
              const modExercises = EXERCISES.filter(e => e.module === mod.id);
              const isExpanded = !!expandedModules[mod.id];
              const completedCount = modExercises.filter(e => completedIds.has(e.id)).length;
              const allDone = completedCount === modExercises.length && modExercises.length > 0;

              return (
                <div key={mod.id} className="border-2 border-ink bg-white">
                  {/* Module header */}
                  <div
                    onClick={() => toggleModule(mod.id)}
                    className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-duck-light/50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold bg-ink text-white">
                        {index + 1}
                      </span>
                      <span className="font-extrabold text-xs text-ink">{mod.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 border ${
                          allDone
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                            : 'bg-slate-100 border-slate-300 text-slate-600'
                        }`}
                      >
                        {completedCount}/{modExercises.length}
                      </span>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </div>

                  {/* Exercises in module */}
                  {isExpanded && (
                    <div className="border-t border-ink/20 divide-y divide-slate-100">
                      {modExercises.map((ex, exIdx) => {
                        const isActive = ex.id === currentExerciseId;
                        const isDone = completedIds.has(ex.id);
                        const isAssisted = assistedIds.has(ex.id);

                        return (
                          <div
                            key={ex.id}
                            onClick={() => {
                              onSelectExercise(ex.id);
                              onClose();
                            }}
                            className={`flex items-center justify-between px-3 py-2 cursor-pointer text-xs transition-colors ${
                              isActive
                                ? 'bg-duck text-ink font-bold border-l-4 border-l-ink'
                                : 'hover:bg-duck-light/60 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="font-mono text-[10px] text-ink-subtle w-4">
                                {exIdx + 1}.
                              </span>
                              <span className="truncate">{ex.title}</span>
                              {ex.isDuckDbFeature && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-200 text-amber-900 px-1 font-bold border border-amber-400">
                                  <Sparkles size={9} />
                                  DuckDB
                                </span>
                              )}
                            </div>

                            {isDone && (
                              isAssisted ? (
                                <div
                                  className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center shrink-0"
                                  title="Completed with hints (Solve independently to earn mastery)"
                                >
                                  <Check size={10} strokeWidth={2.5} />
                                </div>
                              ) : (
                                <div
                                  className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"
                                  title="Mastered (Solved independently)"
                                >
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              )
                            )}
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
      </aside>
    </>
  );
};

