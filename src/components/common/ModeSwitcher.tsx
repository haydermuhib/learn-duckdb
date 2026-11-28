import React from 'react';
import { BookOpen, Zap, FileText } from 'lucide-react';

export type AppMode = 'exercises' | 'playground' | 'cheatsheet';

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

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
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => !isActive && onSelectMode(tab.id)}
            className={`h-full inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 text-xs leading-none transition-colors ${
              isActive
                ? 'bg-duck text-ink border border-ink shadow-brutal-xs font-black cursor-default'
                : 'text-ink-muted hover:text-ink hover:bg-slate-100 cursor-pointer font-bold'
            }`}
            title={tab.title}
          >
            <Icon size={13} className="shrink-0" />
            <span className={tab.labelClass}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
