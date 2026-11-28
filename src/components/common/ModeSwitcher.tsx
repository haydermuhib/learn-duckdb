import React, { useId } from 'react';
import { motion, type Transition } from 'framer-motion';
import { BookOpen, Zap, FileText } from 'lucide-react';

export type AppMode = 'exercises' | 'playground' | 'cheatsheet';

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

// /effects Rule 3: tween cubic-bezier(0.22, 1, 0.36, 1)
const EFFECTS_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// /effects Rule 6: 0.25-second tween with no delay
const FEEDBACK_TRANSITION: Transition = { duration: 0.25, delay: 0, ease: EFFECTS_EASE };

const MODE_TABS = [
  {
    id: 'exercises' as const,
    label: 'Exercises',
    title: 'Interactive SQL Exercises',
    icon: BookOpen,
    labelClass: 'hidden sm:inline',
  },
  {
    id: 'cheatsheet' as const,
    label: 'Cheat Sheet',
    title: 'DuckDB SQL Cheat Sheet & Reference',
    icon: FileText,
    labelClass: 'hidden sm:inline',
  },
  {
    id: 'playground' as const,
    label: 'Playground',
    title: 'Analytical DuckDB SQL Playground',
    icon: Zap,
    labelClass: 'hidden xs:inline',
  },
];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const instanceId = useId();

  return (
    <div
      className="h-8 inline-flex items-center border-2 border-ink bg-white p-0.5 text-xs font-bold shrink-0 shadow-brutal-xs"
      role="tablist"
      aria-label="Application View Mode"
    >
      {MODE_TABS.map(tab => {
        const isActive = currentMode === tab.id;
        const Icon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            whileHover={isActive ? undefined : { scale: 1.01 }}
            whileTap={isActive ? undefined : { scale: 0.99 }}
            transition={FEEDBACK_TRANSITION}
            onClick={() => !isActive && onSelectMode(tab.id)}
            className={`relative h-full inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 text-xs leading-none transition-colors ${
              isActive
                ? 'text-ink font-black cursor-default bg-duck border border-ink shadow-brutal-xs'
                : 'text-ink-muted hover:text-ink hover:bg-slate-100 cursor-pointer font-bold'
            }`}
            title={tab.title}
          >
            {isActive && (
              <motion.span
                layoutId={`activeModePill-${instanceId}`}
                transition={FEEDBACK_TRANSITION}
                className="absolute inset-0 bg-duck border border-ink shadow-brutal-xs pointer-events-none"
                aria-hidden="true"
              />
            )}
            <Icon size={13} className="shrink-0 relative z-10" />
            <span className={`${tab.labelClass} relative z-10`}>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
