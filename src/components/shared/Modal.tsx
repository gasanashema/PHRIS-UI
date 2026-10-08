import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

/** Generic centered dialog used for forms (escalate, resolve, assign, …). */
export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 'max-w-[520px]'
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>

      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded-lg shadow-xl w-full ${width} max-h-[90vh] flex flex-col`}>

        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-admin-text">{title}</h2>
            {subtitle &&
            <p className="text-[13px] text-admin-muted mt-0.5">{subtitle}</p>
            }
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-admin-muted hover:text-admin-text mt-1">

            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer &&
        <div className="px-6 py-4 border-t border-border bg-admin-bg flex flex-wrap gap-3 justify-end shrink-0">
            {footer}
          </div>
        }
      </div>
    </div>);

}

export function FieldLabel({ children }: {children: React.ReactNode;}) {
  return (
    <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
      {children}
    </label>);

}

export const inputCls =
'w-full h-10 px-3 border border-border rounded-md text-[13px] bg-white focus:outline-none focus:border-admin focus:ring-1 focus:ring-admin';
export const textareaCls =
'w-full px-3 py-2 border border-border rounded-md text-[13px] bg-white focus:outline-none focus:border-admin focus:ring-1 focus:ring-admin resize-none';
export const btnPrimary =
'h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
export const btnSecondary =
'h-10 px-4 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
export const btnDanger =
'h-10 px-4 bg-admin-red hover:bg-red-700 text-white text-[13px] font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
