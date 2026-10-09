import React from 'react';
import type { AlertStatus, Severity } from '../../types';
import { SEVERITY_META, STATUS_META } from '../../lib/format';

export function SeverityBadge({
  severity,
  solid = false,
  className = ''
}: {severity: Severity;solid?: boolean;className?: string;}) {
  const m = SEVERITY_META[severity] || SEVERITY_META.green;
  const dotColor =
    severity === 'red'
      ? 'bg-admin-red'
      : severity === 'orange'
      ? 'bg-[#F97316]'
      : severity === 'yellow'
      ? 'bg-yellow-500'
      : 'bg-admin-accent';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${solid ? m.bg : m.soft} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${solid ? 'bg-white' : dotColor}`} />
      {m.label}
    </span>);

}

export function StatusBadge({ status }: {status: AlertStatus;}) {
  const m = STATUS_META[status];
  const dotColor =
    status === 'active'
      ? 'bg-admin-red'
      : status === 'acknowledged'
      ? 'bg-admin-accent'
      : status === 'escalated'
      ? 'bg-[#F97316]'
      : status === 'resolved'
      ? 'bg-admin-info'
      : 'bg-admin-muted';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${m.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {m.label}
    </span>);

}

export function SimulatedTag({ children = 'Simulated' }: {children?: React.ReactNode;}) {
  return (
    <span
      title="Frontend prototype — no real backend or external system is contacted"
      className="inline-flex items-center px-1.5 py-0.5 rounded bg-admin-bg border border-border text-[10px] font-bold uppercase tracking-wider text-admin-muted">

      {children}
    </span>);

}

export function EmptyState({ title, body }: {title: string;body?: string;}) {
  return (
    <div className="p-10 text-center">
      <div className="text-[14px] font-bold text-admin-text">{title}</div>
      {body && <div className="text-[13px] text-admin-muted mt-1">{body}</div>}
    </div>);

}
