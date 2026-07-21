import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  destructive
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[440px] p-6 animate-in zoom-in-95">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${destructive ? 'bg-admin-red/10 text-admin-red' : 'bg-admin/10 text-admin'}`}>
            
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="text-admin-muted hover:text-admin-text">
            
            <X className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-[20px] font-bold text-admin-text mb-2">{title}</h3>
        <p className="text-[14px] text-admin-muted mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
            
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-10 text-white text-[14px] font-semibold rounded-md transition-colors ${destructive ? 'bg-admin-red hover:bg-red-700' : 'bg-admin hover:bg-admin-hover'}`}>
            
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>);

}