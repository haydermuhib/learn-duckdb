import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], desc: 'Run SQL & Check Answer (Mac: ⌘ + Enter)' },
  { keys: ['Alt', 'Shift', 'F'], desc: 'Prettify & Format SQL Query (or Alt + F)' },
  { keys: ['Alt', 'N'], desc: 'Go to Next Exercise (or Alt + →)' },
  { keys: ['Alt', 'P'], desc: 'Go to Previous Exercise (or Alt + ←)' },
  { keys: ['Alt', 'H'], desc: 'Reveal Next Hint' },
  { keys: ['Alt', 'S'], desc: 'Toggle Curriculum Sidebar' },
  { keys: ['?'], desc: 'Toggle this Shortcuts Guide' },
  { keys: ['Esc'], desc: 'Close dialogs or drawers' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white border-3 border-ink shadow-brutal-lg flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-duck border-b-2 border-ink">
          <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-ink" id="shortcuts-dialog-title">
            <Keyboard size={18} />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-ink hover:text-white border border-ink transition-colors cursor-pointer"
            aria-label="Close keyboard shortcuts dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-4 space-y-2.5 divide-y divide-slate-100 text-xs">
          {SHORTCUTS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
              <span className="text-slate-700 font-medium">{item.desc}</span>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                {item.keys.map(k => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 bg-slate-100 border-2 border-ink font-mono text-[11px] font-bold shadow-brutal-xs text-ink"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t-2 border-ink flex items-center justify-between">
          <span className="text-[11px] text-ink-muted">Press <kbd className="font-mono font-bold bg-white px-1 border border-ink/40">?</kbd> anytime to open</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-ink text-white font-bold text-xs border border-ink shadow-brutal-sm hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

