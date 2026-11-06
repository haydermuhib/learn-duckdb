import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white border-3 border-ink shadow-brutal-lg flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-reset-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-rose-100 border-b-2 border-ink">
          <div
            className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-rose-950"
            id="confirm-reset-title"
          >
            <AlertTriangle size={18} className="text-rose-700 shrink-0" />
            <span>Reset All Progress?</span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-ink hover:text-white border border-ink transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs text-ink leading-relaxed">
          <p className="font-bold text-sm">
            Are you sure you want to reset all your learning progress?
          </p>
          <div className="p-3 bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-1">
            <p className="font-semibold">This will permanently clear:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
              <li>All completed and mastered exercises across all 18 modules</li>
              <li>Hint-assisted completion history</li>
              <li>All saved SQL drafts in your browser</li>
            </ul>
          </div>
          <p className="text-ink-muted text-[11px]">
            This action cannot be undone. You can click <strong>Backup</strong> in the syllabus drawer first if you wish to save a copy.
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t-2 border-ink flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-ink font-bold text-xs border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs border-2 border-ink shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Yes, Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};
