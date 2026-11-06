import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  detail?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  detail,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon,
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

  const isDanger = variant === 'danger';

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white border-3 border-ink shadow-brutal-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b-2 border-ink ${
            isDanger ? 'bg-rose-100 text-rose-950' : 'bg-duck text-ink'
          }`}
        >
          <div
            className="flex items-center gap-2 font-black text-sm uppercase tracking-wider"
            id="confirm-modal-title"
          >
            {icon ||
              (isDanger ? (
                <Trash2 size={18} className="text-rose-700 shrink-0" />
              ) : (
                <AlertTriangle size={18} className="text-ink shrink-0" />
              ))}
            <span>{title}</span>
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
          <div className="font-bold text-sm text-ink">{message}</div>
          {detail && (
            <div
              className={`p-3 border-2 text-[11px] leading-normal ${
                isDanger
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {detail}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t-2 border-ink flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-ink font-bold text-xs border-2 border-ink shadow-brutal-xs transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3.5 py-1.5 font-bold text-xs border-2 border-ink shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-duck hover:bg-duck-hover text-ink'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

