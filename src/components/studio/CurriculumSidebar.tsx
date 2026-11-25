import React, { useState, useRef, useEffect } from 'react';
import { motion, animate, useReducedMotion, type AnimationPlaybackControls } from 'framer-motion';
import { MODULES, EXERCISES } from '../../data/curriculum';
import {
  BookOpen,
  Check,
  ChevronRight,
  Search,
  Sparkles,
  X,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';

function isString(val: unknown): val is string {
  return Object.prototype.toString.call(val) === '[object String]';
}

function isNumber(val: unknown): val is number {
  return Object.prototype.toString.call(val) === '[object Number]' && !Number.isNaN(val);
}

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every(isString);
}

function isStringRecord(val: unknown): val is Record<string, string> {
  if (Object.prototype.toString.call(val) !== '[object Object]' || val === null) {
    return false;
  }

  return Object.values(Object(val)).every(isString);
}

function isNumberRecord(val: unknown): val is Record<string, number> {
  if (Object.prototype.toString.call(val) !== '[object Object]' || val === null) {
    return false;
  }

  return Object.values(Object(val)).every(isNumber);
}

const EFFECTS_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEEDBACK_TRANSITION = { duration: 0.25, delay: 0, ease: EFFECTS_EASE };

function animateContainerScroll(
  container: HTMLElement,
  rawTargetTop: number,
  reduceMotion: boolean,
  activeAnimRef: React.MutableRefObject<AnimationPlaybackControls | null>
): void {
  if (activeAnimRef.current) {
    activeAnimRef.current.stop();
    activeAnimRef.current = null;
  }

  const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
  const clampedTarget = Math.max(0, Math.min(rawTargetTop, maxScrollTop));
  const startTop = container.scrollTop;

  if (Math.abs(clampedTarget - startTop) < 2) return;

  if (reduceMotion) {
    container.scrollTop = clampedTarget;

    return;
  }

  activeAnimRef.current = animate(startTop, clampedTarget, {
    duration: 0.45,
    ease: EFFECTS_EASE,
    onUpdate: latest => {
      container.scrollTop = latest;
    },
    onComplete: () => {
      activeAnimRef.current = null;
    },
  });
}

function scrollChildToTop(
  container: HTMLElement,
  target: HTMLElement,
  collapseShiftAbove: number,
  reduceMotion: boolean,
  activeAnimRef: React.MutableRefObject<AnimationPlaybackControls | null>,
  padding = 8
): void {
  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const projectedOffset = targetRect.top - containerRect.top - padding - collapseShiftAbove;

  animateContainerScroll(container, container.scrollTop + projectedOffset, reduceMotion, activeAnimRef);
}

function scrollChildToCenter(
  container: HTMLElement,
  target: HTMLElement,
  reduceMotion: boolean,
  activeAnimRef: React.MutableRefObject<AnimationPlaybackControls | null>
): void {
  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const targetCenter = targetRect.top + targetRect.height / 2;
  const containerCenter = containerRect.top + containerRect.height / 2;
  const offset = targetCenter - containerCenter;

  animateContainerScroll(container, container.scrollTop + offset, reduceMotion, activeAnimRef);
}

interface CurriculumSidebarProps {
  currentExerciseId: string;
  onSelectExercise: (id: string) => void;
  completedIds: Set<string>;
  completedVersions?: Record<string, number>;
  assistedIds?: Set<string>;
  isOpen: boolean;
  onClose: () => void;
  onResetProgress?: () => void;
  onExportProgress?: () => void;
  onImportProgress?: (
    completed: string[],
    assisted: string[],
    drafts?: Record<string, string>,
    versions?: Record<string, number>
  ) => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  currentExerciseId,
  onSelectExercise,
  completedIds,
  completedVersions = {},
  assistedIds = new Set(),
  isOpen,
  onClose,
  onResetProgress,
  onExportProgress,
  onImportProgress,
}) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeExerciseRef = useRef<HTMLElement | null>(null);
  const moduleCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollAnimRef = useRef<AnimationPlaybackControls | null>(null);
  const activeExerciseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moduleAccordionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand module containing current exercise
    const currentEx = EXERCISES.find(e => e.id === currentExerciseId);

    return currentEx ? { [currentEx.module]: true } : { select: true };
  });

  useEffect(() => {
    const currentEx = EXERCISES.find(e => e.id === currentExerciseId);

    if (currentEx) {
      setExpandedModules({
        [currentEx.module]: true,
      });
    }
  }, [currentExerciseId]);

  // Keep active exercise centered in view whenever sidebar opens or active exercise changes
  useEffect(() => {
    if (!isOpen) return;

    if (activeExerciseTimerRef.current) clearTimeout(activeExerciseTimerRef.current);

    activeExerciseTimerRef.current = setTimeout(() => {
      const activeEl = activeExerciseRef.current;
      const container = scrollContainerRef.current;

      if (!activeEl || !container) return;

      scrollChildToCenter(container, activeEl, shouldReduceMotion, scrollAnimRef);
    }, 320);

    return () => {
      if (activeExerciseTimerRef.current) clearTimeout(activeExerciseTimerRef.current);
    };
  }, [isOpen, currentExerciseId, shouldReduceMotion]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleUserInterrupt = () => {
      if (scrollAnimRef.current) {
        scrollAnimRef.current.stop();
        scrollAnimRef.current = null;
      }
    };

    if (container) {
      container.addEventListener('wheel', handleUserInterrupt, { passive: true });
      container.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleUserInterrupt);
        container.removeEventListener('touchmove', handleUserInterrupt);
      }

      handleUserInterrupt();

      if (activeExerciseTimerRef.current) clearTimeout(activeExerciseTimerRef.current);

      if (moduleAccordionTimerRef.current) clearTimeout(moduleAccordionTimerRef.current);
    };
  }, []);

  const toggleModule = (modId: string, modEl?: HTMLElement | null) => {
    const isOpening = !expandedModules[modId];

    let collapseShiftAbove = 0;

    if (isOpening && modEl) {
      for (const [otherId, wasExpanded] of Object.entries(expandedModules)) {
        if (!wasExpanded || otherId === modId) continue;

        const otherCard = moduleCardRefs.current[otherId];

        if (otherCard && (otherCard.compareDocumentPosition(modEl) & Node.DOCUMENT_POSITION_FOLLOWING)) {
          const otherBody = otherCard.querySelector<HTMLElement>('[data-module-body]');

          if (otherBody) {
            collapseShiftAbove += otherBody.getBoundingClientRect().height;
          }
        }
      }
    }

    // Single accordion: opening one module collapses all others
    setExpandedModules(isOpening ? { [modId]: true } : {});

    if (isOpening && modEl) {
      if (moduleAccordionTimerRef.current) clearTimeout(moduleAccordionTimerRef.current);

      moduleAccordionTimerRef.current = setTimeout(() => {
        const container = scrollContainerRef.current;

        if (!container) return;

        scrollChildToTop(container, modEl, collapseShiftAbove, shouldReduceMotion, scrollAnimRef, 8);
      }, 32);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      try {
        const raw = event.target?.result;

        if (!isString(raw)) return;

        const data = JSON.parse(raw);

        if (isStringArray(data.completedIds) && onImportProgress) {
          onImportProgress(
            data.completedIds,
            isStringArray(data.assistedIds) ? data.assistedIds : [],
            isStringRecord(data.drafts) ? data.drafts : undefined,
            isNumberRecord(data.completedVersions) ? data.completedVersions : undefined
          );
        }
      } catch (err) {
        console.error('Invalid progress backup file:', err);
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredExercises = search.trim()
    ? EXERCISES.filter(
        e =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.concept.toLowerCase().includes(search.toLowerCase()) ||
          e.id.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  // Breakdown calculations
  let assistedCount = 0;
  completedIds.forEach(id => {
    if (assistedIds.has(id)) assistedCount++;
  });
  const masteredCount = completedIds.size - assistedCount;
  const remainingCount = Math.max(0, EXERCISES.length - completedIds.size);

  const handleExerciseClick = (id: string) => {
    onSelectExercise(id);

    // Only auto-close on mobile screens where the drawer is a blocking overlay modal
    const win = globalThis.window;

    if (win && win.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={FEEDBACK_TRANSITION}
          onClick={onClose}
          className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] bg-ink/50 z-30 lg:hidden"
        />
      )}

      {/* Drawer Container */}
      <aside
        className={`fixed lg:sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] bottom-0 h-[calc(100vh-3.5rem-env(safe-area-inset-top,0px))] left-0 z-35 bg-surface-card border-r-3 border-ink flex flex-col transition-all duration-200 ease-in-out shrink-0 ${
          isOpen
            ? 'w-[88vw] max-w-[340px] sm:w-80 translate-x-0 opacity-100'
            : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 border-r-0 overflow-hidden opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full sm:w-80 flex-1 flex flex-col h-full overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
          {/* Top Header */}
        <div className="p-3 sm:p-4 border-b-2 border-ink bg-surface-muted flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={18} className="text-ink shrink-0" />
            <span className="font-extrabold text-xs sm:text-sm tracking-tight uppercase truncate">
              Curriculum Syllabus
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 bg-duck border border-ink">
              {completedIds.size}/{EXERCISES.length}
            </span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={FEEDBACK_TRANSITION}
              onClick={onClose}
              title="Close Syllabus (Ctrl+B)"
              className="p-1 hover:bg-slate-200 border border-ink cursor-pointer"
            >
              <X size={16} />
            </motion.button>
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
              placeholder="Search 151 exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-sans border-2 border-ink focus:outline-none focus:bg-duck-light/40"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="px-3 py-1.5 bg-slate-50 border-b border-ink/20 flex items-center justify-between text-[10px] text-ink-muted">
          <span
            className="flex items-center gap-1.5"
            title="Solved independently without hints or solution"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check size={9} strokeWidth={3} />
            </span>
            <span className="font-semibold text-slate-700">Mastered</span>
          </span>
          <span
            className="flex items-center gap-1.5"
            title="Solved with revealed hints or solution"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center shrink-0">
              <Check size={9} strokeWidth={2.5} />
            </span>
            <span className="font-semibold text-slate-700">With hints</span>
          </span>
        </div>

        {/* Exercises list */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-2">
          {filteredExercises ? (
            // Search results view
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-ink-muted px-2 py-1">
                Found {filteredExercises.length} results:
              </p>
              {filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  ref={ex.id === currentExerciseId ? (el => { activeExerciseRef.current = el; }) : undefined}
                  onClick={() => handleExerciseClick(ex.id)}
                  className={`w-full text-left p-2 border-2 border-ink text-xs flex items-center justify-between transition-colors cursor-pointer ${
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
                  {completedIds.has(ex.id) &&
                    ((completedVersions[ex.id] || 1) < (ex.version || 1) ? (
                      <div
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-400 text-amber-900 text-[9px] font-bold shrink-0 shadow-xs"
                        title="Updated with new requirements since you completed it (Solve again to re-verify)"
                      >
                        <RotateCcw size={9} className="text-amber-800 shrink-0" />
                        <span>Updated</span>
                      </div>
                    ) : assistedIds.has(ex.id) ? (
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
                    ))}
                </button>
              ))}
            </div>
          ) : (
            // Module accordion view
            (() => {
              const currentEx = EXERCISES.find(e => e.id === currentExerciseId);
              const currentModuleId = currentEx?.module;

              return MODULES.map((mod, index) => {
                const modExercises = EXERCISES.filter(e => e.module === mod.id);
                const isExpanded = !!expandedModules[mod.id];
                const isCurrentModule = mod.id === currentModuleId;

                const completedCount = modExercises.filter(e =>
                  completedIds.has(e.id)
                ).length;

                const allDone =
                  completedCount === modExercises.length &&
                  modExercises.length > 0;

                return (
                  <div
                    key={mod.id}
                    ref={el => {
                      moduleCardRefs.current[mod.id] = el;
                    }}
                    className={`border-2 border-ink transition-colors ${
                      isCurrentModule
                        ? 'bg-[#FFFDF5] border-ink ring-2 ring-duck ring-offset-1 shadow-brutal-sm'
                        : 'bg-white'
                    }`}
                  >
                    {/* Module header */}
                    <motion.div
                      whileHover={{ opacity: 0.92 }}
                      whileTap={{ opacity: 0.82 }}
                      transition={FEEDBACK_TRANSITION}
                      onClick={e => toggleModule(mod.id, e.currentTarget.parentElement)}
                      className={`relative overflow-hidden flex items-center justify-between p-2.5 cursor-pointer select-none transition-colors ${
                        isCurrentModule
                          ? 'bg-amber-50/80 hover:bg-duck-light border-l-4 border-l-duck'
                          : 'hover:bg-duck-light/50'
                      }`}
                    >
                      {/* Tilted Yellow Pixelated Bar Animation (slides across active module header) */}
                      {isCurrentModule && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                          <div className="absolute top-0 bottom-0 left-0 w-[68px] h-full animate-pixel-sheen">
                            <svg
                              viewBox="0 0 70 42"
                              width="70"
                              height="42"
                              preserveAspectRatio="none"
                              className="w-full h-full block"
                              aria-hidden="true"
                            >
                              <g transform="skewX(-24)">
                                {/* Trail pixel column */}
                                <rect x="4" y="2" width="4" height="4" fill="#FEC62E" opacity="0.45" />
                                <rect x="4" y="10" width="4" height="4" fill="#D97706" opacity="0.55" />
                                <rect x="4" y="18" width="4" height="4" fill="#FEC62E" opacity="0.5" />
                                <rect x="4" y="26" width="4" height="4" fill="#D97706" opacity="0.45" />
                                <rect x="4" y="34" width="4" height="4" fill="#FEC62E" opacity="0.5" />

                                {/* Secondary pixel column */}
                                <rect x="11" y="0" width="5" height="5" fill="#FEC62E" opacity="0.85" />
                                <rect x="11" y="8" width="5" height="5" fill="#FFE066" opacity="0.95" />
                                <rect x="11" y="16" width="5" height="5" fill="#FEC62E" opacity="0.85" />
                                <rect x="11" y="24" width="5" height="5" fill="#FFE066" opacity="0.95" />
                                <rect x="11" y="32" width="5" height="5" fill="#D97706" opacity="0.8" />

                                {/* Core pixel column with crisp ink outlines */}
                                <rect x="18" y="0" width="6" height="6" fill="#FEC62E" stroke="#111827" strokeWidth="0.75" />
                                <rect x="18" y="8" width="6" height="6" fill="#FFF9C4" stroke="#111827" strokeWidth="0.75" />
                                <rect x="18" y="16" width="6" height="6" fill="#FFE600" stroke="#111827" strokeWidth="0.75" />
                                <rect x="18" y="24" width="6" height="6" fill="#FFF9C4" stroke="#111827" strokeWidth="0.75" />
                                <rect x="18" y="32" width="6" height="6" fill="#FEC62E" stroke="#111827" strokeWidth="0.75" />

                                {/* Bright center highlight column */}
                                <rect x="26" y="2" width="6" height="6" fill="#FFE600" stroke="#111827" strokeWidth="0.75" />
                                <rect x="26" y="10" width="6" height="6" fill="#FFFFFF" stroke="#111827" strokeWidth="0.75" />
                                <rect x="26" y="18" width="6" height="6" fill="#FFE600" stroke="#111827" strokeWidth="0.75" />
                                <rect x="26" y="26" width="6" height="6" fill="#FFFFFF" stroke="#111827" strokeWidth="0.75" />
                                <rect x="26" y="34" width="6" height="6" fill="#FFE600" stroke="#111827" strokeWidth="0.75" />

                                {/* Trailing secondary column */}
                                <rect x="34" y="0" width="5" height="5" fill="#FEC62E" opacity="0.85" />
                                <rect x="34" y="8" width="5" height="5" fill="#FFE066" opacity="0.95" />
                                <rect x="34" y="16" width="5" height="5" fill="#FEC62E" opacity="0.85" />
                                <rect x="34" y="24" width="5" height="5" fill="#FFE066" opacity="0.9" />
                                <rect x="34" y="32" width="5" height="5" fill="#D97706" opacity="0.75" />

                                {/* Leading pixel specks */}
                                <rect x="41" y="4" width="4" height="4" fill="#FEC62E" opacity="0.55" />
                                <rect x="41" y="12" width="4" height="4" fill="#D97706" opacity="0.65" />
                                <rect x="41" y="20" width="4" height="4" fill="#FEC62E" opacity="0.55" />
                                <rect x="41" y="28" width="4" height="4" fill="#FEC62E" opacity="0.45" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 relative z-10 min-w-0 pr-1">
                        <span
                          className={`w-5 h-5 flex items-center justify-center font-mono text-[10px] shrink-0 transition-colors ${
                            isCurrentModule
                              ? 'bg-duck text-ink font-black border border-ink shadow-brutal-xs'
                              : 'font-bold bg-ink text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-extrabold text-xs text-ink truncate">
                          {mod.title}
                        </span>
                        {isCurrentModule && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-duck text-ink font-mono text-[9px] font-black uppercase border border-ink shadow-brutal-xs shrink-0 tracking-wider">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 relative z-10">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 border ${
                            allDone
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                              : 'bg-slate-100 border-slate-300 text-slate-600'
                          }`}
                        >
                          {completedCount}/{modExercises.length}
                        </span>
                        <motion.span
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.25, ease: EFFECTS_EASE }}
                          className="inline-flex items-center justify-center shrink-0"
                        >
                          <ChevronRight size={14} />
                        </motion.span>
                      </div>
                    </motion.div>

                  {/* Exercises in module */}
                  <motion.div
                    data-module-body
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: EFFECTS_EASE }}
                    className="overflow-hidden"
                    aria-hidden={!isExpanded}
                  >
                    <div className="border-t border-ink/20 divide-y divide-slate-100">
                      {modExercises.map((ex, exIdx) => {
                        const isActive = ex.id === currentExerciseId;
                        const isDone = completedIds.has(ex.id);
                        const isAssisted = assistedIds.has(ex.id);

                        return (
                          <motion.div
                            key={ex.id}
                            ref={isActive ? (el => { activeExerciseRef.current = el; }) : undefined}
                            whileHover={{ opacity: 0.92 }}
                            whileTap={{ opacity: 0.82 }}
                            transition={FEEDBACK_TRANSITION}
                            onClick={() => handleExerciseClick(ex.id)}
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

                            {isDone &&
                              ((completedVersions[ex.id] || 1) < (ex.version || 1) ? (
                                <div
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-400 text-amber-900 text-[9px] font-bold shrink-0 shadow-xs"
                                  title="Updated with new requirements since you completed it (Solve again to re-verify)"
                                >
                                  <RotateCcw size={9} className="text-amber-800 shrink-0" />
                                  <span>Updated</span>
                                </div>
                              ) : isAssisted ? (
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
                              ))}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              );
            });
          })()
        )}

          {/* Progress Summary & Reset - naturally placed at the end of the scrollable syllabus */}
          <div className="border-2 border-ink bg-slate-50 p-3 space-y-2.5 text-xs mt-4">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-700 font-bold" title="Mastered with 0 hints">
                {masteredCount} Mastered
              </span>
              <span className="text-amber-700 font-bold" title="Solved with hints or solution">
                {assistedCount} With Hints
              </span>
              <span className="text-slate-500 font-bold" title="Exercises to complete">
                {remainingCount} Left
              </span>
            </div>

            {/* Backup & Import Tools */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              {onExportProgress && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={FEEDBACK_TRANSITION}
                  onClick={onExportProgress}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-duck border border-ink text-[11px] font-bold shadow-brutal-xs transition-colors cursor-pointer"
                  title="Backup learning progress as a JSON file"
                >
                  <Download size={12} />
                  <span>Backup</span>
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={FEEDBACK_TRANSITION}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-duck border border-ink text-[11px] font-bold shadow-brutal-xs transition-colors cursor-pointer"
                title="Restore learning progress from a backup JSON file"
              >
                <Upload size={12} />
                <span>Import</span>
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>

            {onResetProgress && (
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onResetProgress}
                  className="w-full text-center text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline py-0.5 cursor-pointer"
                >
                  Reset all progress
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
