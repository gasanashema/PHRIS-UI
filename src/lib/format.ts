import type { AlertStatus, Severity } from '../types';

// ---------------------------------------------------------------------------
// Demo clock
// The prototype's narrative is set on Thursday June 5, 2026. New events created
// during a demo are stamped relative to that date so they read consistently
// with the seeded data. The clock advances in real time from session start.
// ---------------------------------------------------------------------------
const DEMO_START = new Date('2026-06-05T14:30:00').getTime();
const CLOCK_KEY = 'aivital-clock-offset';

function readOffset(): number {
  try {
    const raw = sessionStorage.getItem(CLOCK_KEY);
    if (raw) return Number(raw);
  } catch {
    /* storage unavailable */
  }
  const offset = DEMO_START - Date.now();
  try {
    sessionStorage.setItem(CLOCK_KEY, String(offset));
  } catch {
    /* storage unavailable */
  }
  return offset;
}

let clockOffset = readOffset();

export function resetDemoClock() {
  clockOffset = DEMO_START - Date.now();
  try {
    sessionStorage.setItem(CLOCK_KEY, String(clockOffset));
  } catch {
    /* storage unavailable */
  }
}

export function demoNow(): Date {
  return new Date(Date.now() + clockOffset);
}

const pad = (n: number) => String(n).padStart(2, '0');

export function toLocalISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function nowISO(): string {
  return toLocalISO(demoNow());
}

export function addHours(iso: string, hours: number): string {
  return toLocalISO(new Date(new Date(iso).getTime() + hours * 3600000));
}

export function addDays(iso: string, days: number): string {
  return addHours(iso, days * 24);
}

const MONTHS = [
'January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];


export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function fmtShortDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function timeAgo(iso: string): string {
  const diff = demoNow().getTime() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? '1 day ago' : `${d} days ago`;
}

export function fmtNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Severity + status presentation
// ---------------------------------------------------------------------------
export const SEVERITY_ORDER: Severity[] = ['red', 'orange', 'yellow', 'green'];

export const SEVERITY_RANK: Record<Severity, number> = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3
};

export const SEVERITY_META: Record<
  Severity,
  {
    label: string;
    emoji: string;
    word: string;
    hex: string;
    text: string;
    bg: string;
    soft: string;
    border: string;
    borderL: string;
  }> =
{
  red: {
    label: 'RED',
    emoji: '🔴',
    word: 'Critical',
    hex: '#D32F2F',
    text: 'text-admin-red',
    bg: 'bg-admin-red text-white',
    soft: 'bg-admin-red/10 text-admin-red',
    border: 'border-admin-red',
    borderL: 'border-l-admin-red'
  },
  orange: {
    label: 'ORANGE',
    emoji: '🟠',
    word: 'Alert',
    hex: '#F97316',
    text: 'text-[#F97316]',
    bg: 'bg-[#F97316] text-white',
    soft: 'bg-[#F97316]/10 text-[#F97316]',
    border: 'border-[#F97316]',
    borderL: 'border-l-[#F97316]'
  },
  yellow: {
    label: 'YELLOW',
    emoji: '🟡',
    word: 'Watch',
    hex: '#EAB308',
    text: 'text-yellow-600',
    bg: 'bg-yellow-400 text-admin-text',
    soft: 'bg-yellow-400/15 text-yellow-700',
    border: 'border-yellow-400',
    borderL: 'border-l-yellow-400'
  },
  green: {
    label: 'GREEN',
    emoji: '🟢',
    word: 'Normal',
    hex: '#00A550',
    text: 'text-admin-accent',
    bg: 'bg-admin-accent text-white',
    soft: 'bg-admin-accent/10 text-admin-accent',
    border: 'border-admin-accent',
    borderL: 'border-l-admin-accent'
  }
};

export const STATUS_META: Record<
  AlertStatus,
  {label: string;emoji: string;cls: string;}> =
{
  active: {
    label: 'Unacknowledged',
    emoji: '⚠️',
    cls: 'bg-admin-red/10 text-admin-red border border-admin-red/20'
  },
  acknowledged: {
    label: 'Acknowledged',
    emoji: '✅',
    cls: 'bg-admin-accent/10 text-admin-accent border border-admin-accent/20'
  },
  escalated: {
    label: 'Escalated',
    emoji: '⬆️',
    cls: 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20'
  },
  resolved: {
    label: 'Resolved',
    emoji: '✔️',
    cls: 'bg-admin-info/10 text-admin-info border border-admin-info/20'
  },
  dismissed: {
    label: 'Dismissed',
    emoji: '✖️',
    cls: 'bg-admin-bg text-admin-muted border border-border'
  }
};

export const isOpenStatus = (s: AlertStatus) =>
s === 'active' || s === 'acknowledged' || s === 'escalated';

export function maxSeverity(list: Severity[]): Severity {
  return list.reduce<Severity>(
    (acc, s) => SEVERITY_RANK[s] > SEVERITY_RANK[acc] ? s : acc,
    'green'
  );
}

// Trigger a client-side file download (used for simulated exports).
export function downloadFile(filename: string, content: string | Blob, mime = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toCSV(rows: Record<string, string | number | undefined>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number | undefined) => {
    const s = v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))].join('\n');
}

/** Escapes text for interpolation into generated HTML documents. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}
