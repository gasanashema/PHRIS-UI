import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { SeverityBadge, StatusBadge, EmptyState } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import {
  SEVERITY_META,
  addHours,
  demoNow,
  downloadFile,
  fmtDateTime,
  isOpenStatus,
  timeAgo,
  toCSV } from
'../../lib/format';
import type { Alert } from '../../types';

function Countdown({ alert, hours }: {alert: Alert;hours: number;}) {
  const due = new Date(addHours(alert.triggeredAt, hours)).getTime();
  const diff = due - demoNow().getTime();
  if (diff <= 0)
  return <span className="text-epi-red">Overdue by {Math.round(-diff / 3600000)}h</span>;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  return <span>{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')} remaining</span>;
}

export function WarningAlerts() {
  const { state, actions } = useApp();
  const dialogs = useAlertDialogs();
  const [severity, setSeverity] = useState('all');
  const [disease, setDisease] = useState('all');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('open');
  const [sort, setSort] = useState<'severity' | 'recent' | 'disease'>('severity');
  const [expanded, setExpanded] = useState<string[] | null>(null);

  const open = state.alerts.filter((a) => isOpenStatus(a.status));
  const diseases = Array.from(new Set(state.alerts.map((a) => a.disease))).sort();
  const districts = Array.from(new Set(state.alerts.map((a) => a.district))).sort();

  const list = useMemo(() => {
    let l = state.alerts;
    if (status === 'open') l = l.filter((a) => isOpenStatus(a.status));else
    if (status !== 'all') l = l.filter((a) => a.status === status);
    if (severity !== 'all') l = l.filter((a) => a.severity === severity);
    if (disease !== 'all') l = l.filter((a) => a.disease === disease);
    if (district !== 'all') l = l.filter((a) => a.district === district);
    return sortAlerts(l, sort);
  }, [state.alerts, status, severity, disease, district, sort]);

  // Red + orange alerts are expanded by default
  const isExpanded = (a: Alert) =>
  expanded ? expanded.includes(a.id) : a.severity === 'red' || a.severity === 'orange' && a.status === 'active';
  const toggle = (a: Alert) => {
    const cur = expanded ?? list.filter(isExpanded).map((x) => x.id);
    setExpanded(cur.includes(a.id) ? cur.filter((x) => x !== a.id) : [...cur, a.id]);
  };

  const count = (s: string) => open.filter((a) => a.severity === s).length;

  const exportCsv = () => {
    downloadFile(
      'aivital-active-alerts.csv',
      toCSV(
        list.map((a) => ({
          alert_id: a.id,
          severity: a.severity,
          status: a.status,
          disease: a.disease,
          district: a.district,
          sector: a.sector ?? '',
          triggered: a.triggeredAt,
          probability_pct: a.probability,
          cases: a.cases,
          acknowledged_by: a.acknowledgedBy ?? '',
          escalated_to: a.escalatedTo ?? ''
        }))
      ),
      'text/csv'
    );
    actions.toast(`Exported ${list.length} alerts to CSV.`, 'info');
  };

  const selectCls =
  'text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm';

  return (
    <WarningLayout
      title="Active Alerts"
      subtitle={`${open.length} open alerts (${count('red')} red · ${count('orange')} orange · ${count('yellow')} yellow) — Rwanda national view`}
      breadcrumb="Active Alerts">

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectCls} aria-label="Severity">
            <option value="all">Severity: All</option>
            <option value="red">● Red ({count('red')})</option>
            <option value="orange">● Orange ({count('orange')})</option>
            <option value="yellow">● Yellow ({count('yellow')})</option>
          </select>
          <select value={disease} onChange={(e) => setDisease(e.target.value)} className={selectCls} aria-label="Disease">
            <option value="all">Disease: All</option>
            {diseases.map((d) =>
            <option key={d} value={d}>{d}</option>
            )}
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectCls} aria-label="District">
            <option value="all">District: All</option>
            {districts.map((d) =>
            <option key={d} value={d}>{d}</option>
            )}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Status">
            <option value="open">Status: All open</option>
            <option value="active">Pending (unacknowledged)</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="all">Everything</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selectCls} aria-label="Sort">
            <option value="severity">Sort: Severity</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="disease">Sort: Disease</option>
          </select>
        </div>
        <button
          onClick={exportCsv}
          className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm whitespace-nowrap">

          Export Alert Report
        </button>
      </div>

      {list.length === 0 &&
      <div className="bg-white rounded-lg border border-border shadow-sm">
          <EmptyState title="No alerts match these filters" />
        </div>
      }

      <div className="space-y-4">
        {list.map((a) => {
          const m = SEVERITY_META[a.severity];
          const openAlert = isOpenStatus(a.status);
          const pending = a.status === 'active';
          if (!isExpanded(a))
          return (
            <div
              key={a.id}
              onClick={() => toggle(a)}
              className={`bg-white rounded-lg shadow-sm border-l-4 ${m.borderL} border-y border-r border-border p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-epi-bg/50 transition-colors`}>

                <div className="flex flex-wrap items-center gap-3 min-w-0">
                  <SeverityBadge severity={a.severity} />
                  <span className="text-[13px] font-mono text-epi-muted">{a.id}</span>
                  <span className="text-[13px] font-bold text-epi-text">
                    {a.disease} | {a.district}
                  </span>
                  <span className="text-[12px] text-epi-muted">{timeAgo(a.triggeredAt)}</span>
                  <StatusBadge status={a.status} />
                </div>
                <ChevronDown className="w-5 h-5 text-epi-muted shrink-0" />
              </div>);


          return (
            <div
              key={a.id}
              className={`bg-white rounded-lg shadow-card border-t-4 ${m.border} border-x border-b border-border overflow-hidden relative`}>

              <div className={`p-5 border-b border-border ${m.soft.split(' ')[0]} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[13px] font-bold ${m.text}`}>
                    {m.emoji} {m.label} ALERT
                  </span>
                  <span className="text-border">|</span>
                  <span className="text-[13px] font-mono font-bold text-epi-text">{a.id}</span>
                  <span className="text-border">|</span>
                  <span className="text-[13px] text-epi-muted">
                    Triggered {timeAgo(a.triggeredAt)} — {fmtDateTime(a.triggeredAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  <button onClick={() => toggle(a)} aria-label="Collapse" className="text-epi-muted hover:text-epi-text">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Alert Info</h3>
                  <div className="space-y-2 text-[13px]">
                    {[
                    ['Disease', a.disease],
                    ['District', `${a.district} District`],
                    ['Sector', a.sector ? `${a.sector} Sector` : '—'],
                    ['Province', `${a.province} Province`]].
                    map(([k, v]) =>
                    <div key={k} className="flex justify-between gap-3">
                        <span className="text-epi-muted">{k}:</span>
                        <span className="font-bold text-epi-text text-right">{v}</span>
                      </div>
                    )}
                    <div className="flex justify-between mt-2 pt-2 border-t border-border">
                      <span className="text-epi-muted">Outbreak probability:</span>
                      <span className={`font-bold ${m.text}`}>{a.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-epi-muted">Cases this week:</span>
                      <span className={`font-bold ${m.text}`}>
                        {a.cases} ({a.change} WoW)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Why Triggered</h3>
                  <ul className="space-y-1.5 text-[12px] text-epi-muted mb-3">
                    {a.reasons.map((r) =>
                    <li key={r} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#00A550] shrink-0 mt-0.5" /> <span>{r}</span>
                      </li>
                    )}
                  </ul>
                  <div className="text-[12px] text-epi-muted">Source: {a.source}</div>
                </div>

                <div>
                  <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Response Status</h3>
                  <div className="space-y-4 text-[13px]">
                    {pending ?
                    <div className="bg-epi-amber/10 border border-epi-amber/30 rounded p-3">
                        <div className="font-bold text-epi-text mb-1">
                          {a.district} DHO has not responded
                        </div>
                        <div className="text-[12px] text-epi-muted">
                          Auto-escalation: <strong className="font-mono"><Countdown alert={a} hours={state.rules.autoEscalateHours} /></strong>
                        </div>
                      </div> :

                    <div>
                        <div className="text-epi-muted mb-1">Acknowledged by:</div>
                        <div className="font-bold text-epi-text">{a.acknowledgedBy ?? '—'}</div>
                        {a.acknowledgedAt &&
                      <div className="text-[11px] text-epi-muted">{fmtDateTime(a.acknowledgedAt)}</div>
                      }
                      </div>
                    }
                    {a.timeline.filter((t) => t.kind === 'note').slice(-1).map((t) =>
                    <div key={t.at}>
                        <div className="text-epi-muted mb-1">Latest response note:</div>
                        <div className="bg-epi-bg p-2 rounded border border-border italic text-epi-text">“{t.text}”</div>
                      </div>
                    )}
                    {a.escalatedTo &&
                    <div>
                        <div className="text-epi-muted mb-1">Current escalation level:</div>
                        <div className="font-bold text-[#F97316]">
                          {a.escalatedTo} — {fmtDateTime(a.escalatedAt!)}
                        </div>
                      </div>
                    }
                    {a.closeReason &&
                    <div>
                        <div className="text-epi-muted mb-1">Outcome:</div>
                        <div className="font-bold text-epi-text">{a.closeReason}</div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-epi-bg/30 flex flex-wrap gap-3">
                <Link
                  to={`/warning/detail?id=${a.id}`}
                  className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">

                  View Full Details
                </Link>
                {openAlert &&
                <>
                    <button
                    onClick={() => dialogs.open('note', a)}
                    className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg transition-colors">

                      Add Response Note
                    </button>
                    {pending ?
                  <>
                        <button
                      onClick={() => {
                        actions.addAlertNote(a.id, `SMS reminder sent to ${a.district} DHO (simulated).`);
                      }}
                      className="px-4 py-2 bg-epi-amber text-epi-text text-[13px] font-bold rounded hover:bg-epi-amber/90 transition-colors">

                          Send SMS Reminder
                        </button>
                        <button
                      onClick={() => dialogs.open('ack', a)}
                      className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded hover:bg-epi/5 transition-colors">

                          Acknowledge on behalf
                        </button>
                      </> :

                  <button
                    onClick={() => dialogs.open('resolve', a)}
                    className="px-4 py-2 bg-white border border-[#00A550] text-[#00A550] text-[13px] font-bold rounded hover:bg-[#00A550]/10 transition-colors">

                        Mark Resolved
                      </button>
                  }
                    <button
                    onClick={() => dialogs.open('escalate', a)}
                    className={`px-4 py-2 text-[13px] font-bold rounded transition-colors ml-auto ${pending ? 'bg-epi-red text-white hover:bg-epi-red/90' : 'bg-white border border-epi-red text-epi-red hover:bg-epi-red/10'}`}>

                      {pending ? "Escalate Now — Don't Wait" : 'Escalate Further'}
                    </button>
                  </>
                }
              </div>
            </div>);

        })}
      </div>
      {dialogs.element}
    </WarningLayout>);

}
