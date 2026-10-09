import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Download, Search } from 'lucide-react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { SeverityBadge, StatusBadge, EmptyState } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import { downloadFile, fmtDateTime, toCSV } from '../../lib/format';
import type { Alert, AlertStatus, Severity } from '../../types';

function hoursBetween(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

function fmtHours(h: number) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  return `${h.toFixed(1)} h`;
}

export function WarningHistory() {
  const { state, actions } = useApp();
  const [status, setStatus] = useState<'all' | AlertStatus>('all');
  const [severity, setSeverity] = useState<'all' | Severity>('all');
  const [district, setDistrict] = useState('All districts');
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  useEffect(() => {
    if (params.get('q') !== null) setQ(params.get('q') ?? '');
  }, [params]);

  const districts = ['All districts', ...Array.from(new Set(state.alerts.map((a) => a.district))).sort()];

  const list = useMemo(() => {
    let l: Alert[] = state.alerts;
    if (status !== 'all') l = l.filter((a) => a.status === status);
    if (severity !== 'all') l = l.filter((a) => a.severity === severity);
    if (district !== 'All districts') l = l.filter((a) => a.district === district);
    const t = q.trim().toLowerCase();
    if (t) l = l.filter((a) => [a.id, a.disease, a.district, a.sector ?? ''].some((f) => f.toLowerCase().includes(t)));
    return sortAlerts(l, 'recent');
  }, [state.alerts, status, severity, district, q]);

  const acked = state.alerts.filter((a) => a.acknowledgedAt);
  const ackTimes = acked.map((a) => hoursBetween(a.triggeredAt, a.acknowledgedAt!));
  const avgAck = ackTimes.length ? ackTimes.reduce((s, h) => s + h, 0) / ackTimes.length : 0;
  const within4 = ackTimes.filter((h) => h <= state.rules.autoEscalateHours).length;
  const closed = state.alerts.filter((a) => a.status === 'resolved' || a.status === 'dismissed').length;

  const exportCsv = () => {
    downloadFile(
      'aivital-alert-history.csv',
      toCSV(
        list.map((a) => ({
          alert_id: a.id,
          disease: a.disease,
          district: a.district,
          sector: a.sector ?? '',
          severity: a.severity,
          status: a.status,
          triggered: a.triggeredAt,
          acknowledged_at: a.acknowledgedAt ?? '',
          hours_to_ack: a.acknowledgedAt ? hoursBetween(a.triggeredAt, a.acknowledgedAt).toFixed(1) : '',
          escalated_to: a.escalatedTo ?? '',
          closed_at: a.closedAt ?? '',
          close_reason: a.closeReason ?? ''
        }))
      ),
      'text/csv'
    );
    actions.toast(`Exported ${list.length} alerts to CSV.`, 'info');
  };

  return (
    <WarningLayout
      title="Alert History & Response Tracking"
      subtitle="Every alert raised by AI Vital with its response timeline — national view"
      breadcrumb="Alert History">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
        ['Alerts on record', String(state.alerts.length)],
        ['Average time to acknowledge', fmtHours(avgAck)],
        [`Acknowledged within ${state.rules.autoEscalateHours}h`, `${ackTimes.length ? Math.round(within4 / ackTimes.length * 100) : 0}%`],
        ['Resolved / dismissed', String(closed)]].
        map(([k, v]) =>
        <div key={k} className="bg-white rounded-lg p-5 shadow-card border border-border">
            <div className="text-[12px] font-bold text-epi-muted">{k}</div>
            <div className="text-2xl font-bold text-epi-text mt-1">{v}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-epi-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ID, disease, district…"
              className="h-10 pl-9 pr-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi w-[220px]" />

          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-10 px-3 bg-white border border-border rounded-md text-[13px]">
            <option value="all">Status: All</option>
            <option value="active">Unacknowledged</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as typeof severity)} className="h-10 px-3 bg-white border border-border rounded-md text-[13px]">
            <option value="all">Severity: All</option>
            <option value="red">● Red</option>
            <option value="orange">● Orange</option>
            <option value="yellow">● Yellow</option>
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="h-10 px-3 bg-white border border-border rounded-md text-[13px]">
            {districts.map((d) =>
            <option key={d}>{d}</option>
            )}
          </select>
        </div>
        <button
          onClick={exportCsv}
          className="h-10 px-4 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg flex items-center gap-2">

          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        {list.length === 0 ?
        <EmptyState title="No alerts match these filters" /> :

        <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg border-b border-border text-epi-muted">
                <tr>
                  <th className="px-4 py-3">Alert</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Disease / Location</th>
                  <th className="px-4 py-3">Triggered</th>
                  <th className="px-4 py-3">Time to acknowledge</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((a) => {
                const h = a.acknowledgedAt ? hoursBetween(a.triggeredAt, a.acknowledgedAt) : null;
                return (
                  <tr key={a.id} className="hover:bg-epi-bg/50">
                      <td className="px-4 py-3">
                        <Link to={`/warning/detail?id=${a.id}`} className="font-mono font-bold text-epi hover:underline">
                          {a.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3"><SeverityBadge severity={a.severity} /></td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-epi-text">{a.disease}</div>
                        <div className="text-[12px] text-epi-muted">{a.sector ? `${a.sector}, ` : ''}{a.district}</div>
                      </td>
                      <td className="px-4 py-3 text-epi-muted whitespace-nowrap">{fmtDateTime(a.triggeredAt)}</td>
                      <td className={`px-4 py-3 font-semibold whitespace-nowrap ${h === null ? 'text-epi-red' : h > state.rules.autoEscalateHours ? 'text-[#F97316]' : 'text-[#00A550]'}`}>
                        {h === null ? a.status === 'dismissed' ? '—' : 'Not yet' : fmtHours(h)}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-epi-muted">
                        {a.closeReason ?? (a.escalatedTo ? `Escalated to ${a.escalatedTo}` : a.timeline.filter((t) => t.kind === 'note').slice(-1)[0]?.text ?? '—')}
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </div>
    </WarningLayout>);

}
