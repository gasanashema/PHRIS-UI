import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { SeverityBadge, StatusBadge, EmptyState } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import { SEVERITY_META, fmtDateTime, isOpenStatus, timeAgo } from '../../lib/format';

const TABS = [
'Overview',
'Why Triggered',
'Recommended Actions',
'Response Timeline',
'Notifications Sent',
'Related Predictions'] as
const;

const RRT: Record<string, {lead: string;phone: string;base: string;travel: string;}> = {
  Western: { lead: 'Dr. Patrick Bizimana', phone: '+250 788 100 200', base: 'Karongi District', travel: '2.5h' },
  Southern: { lead: 'Dr. Samuel Habyarimana', phone: '+250 788 100 210', base: 'Huye District', travel: '1h' },
  Eastern: { lead: 'Dr. Grace Uwase', phone: '+250 788 100 220', base: 'Rwamagana District', travel: '1.5h' },
  Northern: { lead: 'Dr. Diane Mukeshimana', phone: '+250 788 100 230', base: 'Musanze District', travel: '1.5h' },
  Kigali: { lead: 'Dr. Jean Paul Habimana', phone: '+250 788 000 001', base: 'Kigali', travel: '30 min' }
};

export function WarningDetail() {
  const { state, actions } = useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dialogs = useAlertDialogs();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');

  const fallback = sortAlerts(state.alerts.filter((a) => isOpenStatus(a.status)), 'severity')[0];
  const id = params.get('id') ?? fallback?.id;
  const alert = state.alerts.find((a) => a.id === id);

  if (!alert) {
    return (
      <WarningLayout title="Alert Detail" breadcrumb="Alert Detail">
        <div className="bg-white rounded-lg border border-border shadow-sm">
          <EmptyState title={id ? `No alert with ID ${id}` : 'No alerts'} />
          <div className="pb-8 text-center">
            <Link to="/warning/alerts" className="text-[13px] font-bold text-epi hover:underline">← Back to active alerts</Link>
          </div>
        </div>
      </WarningLayout>);

  }

  const m = SEVERITY_META[alert.severity];
  const open = isOpenStatus(alert.status);
  const rrt = RRT[alert.province] ?? RRT.Kigali;
  const rrtActive = alert.timeline.some((t) => t.text.startsWith('Rapid Response Team activated'));
  const investigation = alert.investigationId ? state.investigations.find((i) => i.id === alert.investigationId) : undefined;
  const risk = state.districtRisk.find((r) => r.district === alert.district);
  const runs = state.predictionRuns.filter((r) =>
  r.alertsGenerated.includes(alert.id) || r.signals.some((s) => s.district === alert.district && s.disease === alert.disease)
  );
  const interventions = state.interventions.filter((i) => i.alertId === alert.id);

  const recipients = [
  {
    who: `${alert.district} District Health Officer`,
    channels: ['SMS', 'Email'],
    ack: !!alert.acknowledgedAt
  },
  { who: 'RBC Epidemiology Division', channels: ['Email', 'In-app'], ack: false },
  { who: 'Dr. Jean Paul Habimana (Epi, RBC)', channels: ['Email', 'SMS'], ack: false },
  ...(alert.escalatedTo ? [{ who: alert.escalatedTo, channels: ['Email', 'SMS'], ack: false }] : [])];


  return (
    <WarningLayout
      title={`Alert Detail — ${alert.id}`}
      subtitle="Full investigation record and response timeline"
      breadcrumb="Alert Detail">

      {/* Alert switcher */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-[13px] font-medium text-epi-muted">Viewing alert</label>
        <select
          value={alert.id}
          onChange={(e) => navigate(`/warning/detail?id=${e.target.value}`)}
          className="h-9 px-3 bg-white border border-border rounded-md text-[13px]">

          {sortAlerts(state.alerts, 'severity').map((a) =>
          <option key={a.id} value={a.id}>
              {a.id} — {a.disease}, {a.district} ({a.status})
            </option>
          )}
        </select>
        <Link to="/warning/alerts" className="text-[13px] font-bold text-epi hover:underline">
          All alerts →
        </Link>
      </div>

      {/* Status Banner */}
      <div className={`${m.bg} p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="font-bold text-[14px] leading-relaxed flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white inline-block" /> {m.label} ALERT — {alert.id} | {alert.disease} | {alert.district} District
          {alert.sector ? `, ${alert.sector} Sector` : ''}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium opacity-90">
          <span>Triggered: {fmtDateTime(alert.triggeredAt)}</span>
          <span className="hidden md:inline">|</span>
          <span>Status: {alert.status}</span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-1">
            Acknowledged: {alert.acknowledgedBy ? (
              <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {alert.acknowledgedBy}</span>
            ) : (
              <span className="inline-flex items-center gap-1"><X className="w-3.5 h-3.5" /> Not yet</span>
            )}
          </span>
          {alert.escalatedTo &&
          <>
              <span className="hidden md:inline">|</span>
              <span>Level: {alert.escalatedTo}</span>
            </>
          }
        </div>
      </div>

      {/* Actions */}
      {open &&
      <div className="flex flex-wrap gap-2 mb-6">
          {alert.status === 'active' &&
        <button onClick={() => dialogs.open('ack', alert)} className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark">
              Acknowledge
            </button>
        }
          <button onClick={() => dialogs.open('note', alert)} className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg">
            Add Note
          </button>
          <button onClick={() => dialogs.open('escalate', alert)} className="px-4 py-2 bg-white border border-epi-red text-epi-red text-[13px] font-bold rounded hover:bg-epi-red/10">
            Escalate
          </button>
          {!alert.investigationId &&
        <button onClick={() => dialogs.open('investigate', alert)} className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg">
              Open Investigation
            </button>
        }
          <button onClick={() => dialogs.open('resolve', alert)} className="px-4 py-2 bg-white border border-[#00A550] text-[#00A550] text-[13px] font-bold rounded hover:bg-[#00A550]/10">
            Mark Resolved
          </button>
          <button onClick={() => dialogs.open('dismiss', alert)} className="px-4 py-2 text-epi-muted text-[13px] font-bold rounded hover:text-epi-red">
            Dismiss
          </button>
        </div>
      }

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-border mb-6 hide-scrollbar">
        {TABS.map((t) =>
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-6 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'text-epi border-epi' : 'text-epi-muted border-transparent hover:text-epi-text'}`}>

            {t}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-6">
          {tab === 'Overview' &&
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-[16px] font-bold text-epi-text">Alert Profile</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
                {[
              ['Alert ID', alert.id],
              ['Disease', alert.disease],
              ['District', `${alert.district} District`],
              ['Sector', alert.sector ? `${alert.sector} Sector` : '—'],
              ['Province', `${alert.province} Province`],
              ['Source', alert.source],
              ['Outbreak probability', `${alert.probability}%`],
              ['AI district risk score', risk ? `${risk.score}/100 (${risk.trend})` : '—'],
              ['Cases this week', `${alert.cases} (${alert.change} WoW)`],
              ['Threshold', `${alert.threshold}/week`],
              ['Investigation', investigation ? `${investigation.id} (${investigation.status})` : 'None'],
              ['Interventions logged', String(interventions.length)]].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-3 border-b border-border pb-2">
                    <span className="text-epi-muted">{k}:</span>
                    <span className="font-bold text-epi-text text-right">{v}</span>
                  </div>
              )}
              </div>
              {investigation &&
            <div className="px-6 pb-6">
                  <Link to={`/epi/investigations?id=${investigation.id}`} className="text-[13px] font-bold text-epi hover:underline">
                    Open investigation {investigation.id} →
                  </Link>
                </div>
            }
            </div>
          }

          {tab === 'Why Triggered' &&
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
              <div className="p-5 border-b border-border bg-epi-bg/30">
                <h3 className="text-[14px] font-bold text-epi-text">Trigger conditions met</h3>
              </div>
              <ul className="p-6 space-y-3 text-[13px]">
                {alert.reasons.map((r) =>
              <li key={r} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" />
                    <span className="text-epi-text">{r}</span>
                  </li>
              )}
              </ul>
              <div className="px-6 pb-6 text-[12px] text-epi-muted">
                Current rules: AI probability ≥ {state.rules.aiPct}% → Orange, ≥ {state.rules.aiPct + 20}% → Red ·
                growth ≥ {state.rules.growthPct}%/week → Orange.{' '}
                <Link to="/warning/config" className="text-epi font-bold hover:underline">Configure →</Link>
              </div>
            </div>
          }

          {tab === 'Recommended Actions' &&
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-4">
                Recommended actions ({alert.actions.filter((x) => x.done).length}/{alert.actions.length} done)
              </h3>
              <div className="space-y-3">
                {alert.actions.map((x) =>
              <label key={x.id} className="flex items-start gap-2 text-[13px] text-epi-text cursor-pointer">
                    <input
                  type="checkbox"
                  checked={x.done}
                  disabled={!open}
                  onChange={() => actions.toggleAlertAction(alert.id, x.id)}
                  className="mt-0.5 rounded border-border" />

                    <span className={x.done ? 'line-through text-epi-muted' : ''}>{x.label}</span>
                  </label>
              )}
                {alert.actions.length === 0 && <div className="text-[13px] text-epi-muted">No recommended actions recorded.</div>}
              </div>
            </div>
          }

          {tab === 'Response Timeline' &&
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <ol className="relative border-l-2 border-border ml-2 space-y-4">
                {[...alert.timeline].reverse().map((t, i) =>
              <li key={i} className="ml-4">
                    <span className={`absolute -left-[7px] w-3 h-3 rounded-full border-2 border-white ${t.kind === 'system' ? 'bg-admin-info' : t.kind === 'status' ? 'bg-[#00A550]' : 'bg-epi-amber'}`} />
                    <div className="text-[12px] text-epi-muted">
                      {fmtDateTime(t.at)} · <span className="font-semibold text-epi-text">{t.author}</span>
                    </div>
                    <div className="text-[13px] text-epi-text">{t.text}</div>
                  </li>
              )}
              </ol>
            </div>
          }

          {tab === 'Notifications Sent' &&
          <div className="bg-white rounded-lg shadow-card border border-border p-6 space-y-4">
              {recipients.map((r) =>
            <div key={r.who} className="pb-3 border-b border-border last:border-0">
                  <div className="text-[13px] font-bold text-epi-text mb-1">{r.who}</div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium text-epi-muted">
                    {r.channels.map((c) => (
                      <span key={c} className="flex items-center gap-1 bg-epi-bg px-2 py-0.5 rounded text-epi-text">
                        <Check className="w-3 h-3 text-[#00A550]" /> {c}
                      </span>
                    ))}
                    {r.ack && (
                      <span className="text-[#00A550] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Acknowledged
                      </span>
                    )}
                  </div>
                </div>
            )}
              <p className="text-[11px] text-epi-muted">Delivery receipts are simulated in this prototype.</p>
            </div>
          }

          {tab === 'Related Predictions' &&
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
              {risk &&
            <div className="mb-4 text-[13px]">
                  Current AI district risk for <strong>{alert.district}</strong>:{' '}
                  <strong>{risk.score}/100</strong> ({risk.disease}, trend {risk.trend}, confidence {risk.confidence}%)
                </div>
            }
              {runs.length === 0 ?
            <div className="text-[13px] text-epi-muted">
                  No prediction runs have flagged this district and disease yet.{' '}
                  <Link to="/prediction" className="text-epi font-bold hover:underline">Run a prediction →</Link>
                </div> :

            <ul className="space-y-2 text-[13px]">
                  {runs.map((r) =>
              <li key={r.id} className="flex justify-between gap-3 border-b border-border pb-2">
                      <span className="font-mono font-bold">{r.id}</span>
                      <span className="text-epi-muted">{fmtDateTime(r.at)}</span>
                      <span>{r.alertsGenerated.includes(alert.id) ? 'Generated this alert' : 'Refreshed probability'}</span>
                    </li>
              )}
                </ul>
            }
            </div>
          }
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-4 flex items-center gap-2">
              Nearest Rapid Response Team
            </h2>
            <div className="bg-epi-bg/50 p-4 rounded border border-border mb-4">
              <div className="text-[14px] font-bold text-epi-text mb-3">RRT {alert.province} Province:</div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-epi-muted">Team Leader:</span> <span className="font-bold">{rrt.lead}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Phone:</span> <span>{rrt.phone}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Location:</span> <span className="text-right">{rrt.base} ({rrt.travel} away)</span></div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-epi-muted">Status:</span>
                  <span className={`font-bold ${rrtActive ? 'text-[#00A550]' : 'text-[#F97316]'}`}>
                    {rrtActive ? '● Deployed' : '● On alert — not yet deployed'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                disabled={rrtActive || !open}
                onClick={() => actions.addAlertNote(alert.id, `Rapid Response Team activated — ${rrt.lead} dispatched from ${rrt.base}.`)}
                className="w-full py-3 bg-epi-red text-white text-[14px] font-bold rounded-md hover:bg-epi-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">

                {rrtActive ? 'RRT Activated' : 'Activate RRT'}
              </button>
              <a
                href={`tel:${rrt.phone.replace(/\s/g, '')}`}
                className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors text-center">

                Call Team Leader
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-3">Summary</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <SeverityBadge severity={alert.severity} />
              <StatusBadge status={alert.status} />
            </div>
            <div className="text-[13px] text-epi-muted">
              Raised {timeAgo(alert.triggeredAt)} by {alert.source.toLowerCase()}. {alert.timeline.length} timeline entries.
            </div>
            {alert.district === 'Huye' &&
            <div className="text-[12px] text-epi-muted mt-3">
                This alert is also visible to the Huye District Health Officer.
              </div>
            }
          </div>
        </div>
      </div>
      {dialogs.element}
    </WarningLayout>);

}
