import { CheckCircle2, X } from 'lucide-react';
interface SuccessModalProps {
  open: boolean;
  title: string;
  message: string;
  actionLabel?: string;
  onClose: () => void;
}
export function SuccessModal({
  open,
  title,
  message,
  actionLabel = 'Done',
  onClose
}: SuccessModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[440px] p-6 animate-in zoom-in-95">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-admin-accent/10 text-admin-accent">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
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
            onClick={onClose}
            className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
            
            {actionLabel}
          </button>
        </div>
      </div>
    </div>);

}