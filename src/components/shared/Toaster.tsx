import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useApp } from '../../store/AppStore';

const TONE = {
  success: { icon: CheckCircle2, cls: 'border-admin-accent/40', ic: 'text-admin-accent' },
  info: { icon: Info, cls: 'border-admin-info/40', ic: 'text-admin-info' },
  warning: { icon: AlertTriangle, cls: 'border-[#F97316]/40', ic: 'text-[#F97316]' },
  error: { icon: XCircle, cls: 'border-admin-red/40', ic: 'text-admin-red' }
} as const;

/** Global toast stack for action feedback. */
export function Toaster() {
  const { toasts, actions } = useApp();
  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-[70] flex flex-col gap-2 sm:w-[380px] pointer-events-none">

      {toasts.map((t) => {
        const tone = TONE[t.tone];
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-white border-l-4 ${tone.cls} border border-border rounded-md shadow-floating px-4 py-3 flex items-start gap-3`}>

            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${tone.ic}`} />
            <p className="text-[13px] text-admin-text flex-1 leading-snug">
              {t.message}
            </p>
            <button
              onClick={() => actions.dismissToast(t.id)}
              aria-label="Dismiss"
              className="text-admin-muted hover:text-admin-text">

              <X className="w-4 h-4" />
            </button>
          </div>);

      })}
    </div>);

}
