import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  FileSearch,
  Map as MapIcon,
  Plus,
  Target,
  FileText,
  ArrowUpRight,
  CheckCircle2 } from
'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { InterventionDrawer } from '../../components/dho/InterventionDrawer';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { SeverityBadge, StatusBadge, EmptyState } from '../../components/shared/Badges';
import { useApp, sectorRisk } from '../../store/AppStore';
import { HUYE_SECTORS } from '../../data/seed';
import {
  SEVERITY_META,
  addHours,
  demoNow,
  fmtDate,
  fmtDateTime,
  fmtNumber,
  isOpenStatus } from
'../../lib/format';
import type { Intervention } from '../../types';

export function DhoAlertDetail() {
  const { id = '' } = useParams();
  const { state, actions } = useApp();
  const dialogs = useAlertDialogs();
  const [drawer, setDrawer] = useState<{open: boolean;editing: Intervention | null;}>({ open: false, editing: null });

  const alert = state.alerts.find((a) => a.id === id);
  if (!alert) {
    return (
      <DhoLayout title="Alert not found" breadcrumb="Active Alerts">
        <div className="bg-white rounded-lg border border-border shadow-sm">
          <EmptyState title={`No alert with ID ${id}`} body="It may have been removed or the link is incorrect." />
          <div className="pb-8 text-center">
            <Link to="/dho/alerts" className="text-[13px] font-bold text-admin hover:underline">
              ← Back to alerts
            </Link>
          </div>
        </div>
      </DhoLayout>);

  }

  const m = SEVERITY_META[alert.severity];
  const open = isOpenStatus(alert.status);
  const investigation = alert.investigationId ?
  state.investigations.find((i) => i.id === alert.investigationId) :
  undefined;
  const interventions = state.interventions.filter((i) => i.alertId === alert.id);
  const sector = HUYE_SECTORS.find((s) => s.name === alert.sector);
  const escalationDue = addHours(alert.triggeredAt, state.rules.autoEscalateHours);
  const overdue = alert.status === 'active' && new Date(escalationDue) < demoNow();
  const doneCount = alert.actions.filter((x) => x.done).length;

  return (
    <DhoLayout
      title={`${alert.disease} — ${alert.sector ?? alert.district} Sector`}
      subtitle={`${alert.id} · Triggered ${fmtDateTime(alert.triggeredAt)} · ${alert.source}`}
      breadcrumb={`Active Alerts > ${alert.id}`}>

      <Link
        to="/dho/alerts"
        className="inline-flex items-center gap-1 text-[13px] font-bold text-admin hover:underline mb-4">

        <ArrowLeft className="w-4 h-4" /> All alerts
      </Link>

      {/* Status band */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden mb-6">
        <div className={`${m.bg} px-4 sm:px-6 py-3 font-bold text-[15px] flex flex-wrap items-center justify-between gap-2`}>
          <span>
            {m.emoji} {m.label} ALERT — {alert.id}
          </span>
          <StatusBadge status={alert.status} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px bg-border">
          {[
          ['Outbreak probability', `${alert.probability}%`],
          ['Cases this week', `${alert.cases}`],
          ['Threshold', `${alert.threshold} / week`],
          ['Week-over-week', alert.change],
          ['District', alert.district],
          ['Province', alert.province]].
          map(([k, v]) =>
          <div key={k} className="bg-white p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">{k}</div>
              <div className="text-[18px] font-bold text-admin-text mt-1">{v}</div>
            </div>
          )}
        </div>
        {overdue &&
        <div className="px-4 sm:px-6 py-2 bg-admin-red/10 text-admin-red text-[13px] font-semibold border-t border-admin-red/20">
            ⏰ Not acknowledged within {state.rules.autoEscalateHours} hours — auto-escalation was due {fmtDateTime(escalationDue)}.
          </div>
        }
        <div className="px-4 sm:px-6 py-4 border-t border-border bg-admin-bg/50 flex flex-wrap gap-3">
          {alert.status === 'active' &&
          <button
            onClick={() => dialogs.open('ack', alert)}
            className="h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md flex items-center gap-2">

              <Check className="w-4 h-4" /> Acknowledge Alert
            </button>
          }
          {open &&
          <>
              <button
                onClick={() => dialogs.open('note', alert)}
                className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg flex items-center gap-2">
                <FileText className="w-4 h-4 text-admin-muted" /> Add Response Note
              </button>
              {alert.status !== 'escalated' &&
                <button
                  onClick={() => dialogs.open('escalate', alert)}
                  className="h-10 px-4 bg-white border border-admin-red text-admin-red text-[13px] font-semibold rounded-md hover:bg-admin-red/10 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Escalate
                </button>
              }
              <button
                onClick={() => setDrawer({ open: true, editing: null })}
                className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg flex items-center gap-2">
                <Target className="w-4 h-4" /> Log Intervention
              </button>
              {alert.status !== 'active' &&
                <button
                  onClick={() => dialogs.open('resolve', alert)}
                  className="h-10 px-4 bg-white border border-admin-accent text-admin-accent text-[13px] font-semibold rounded-md hover:bg-admin-accent/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                </button>
              }
              <button
              onClick={() => dialogs.open('dismiss', alert)}
              className="h-10 px-4 text-admin-muted text-[13px] font-semibold rounded-md hover:text-admin-red">

                Dismiss
              </button>
            </>
          }
          {alert.sector &&
          <Link
            to={`/dho/risk-map?sector=${alert.sector}`}
            className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg flex items-center gap-2 sm:ml-auto">

              <MapIcon className="w-4 h-4" /> View on Risk Map
            </Link>
          }
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: reasons + actions + interventions */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-border p-5">
              <h2 className="text-[15px] font-bold text-admin-text mb-3">Why this alert was triggered</h2>
              <ul className="space-y-2 text-[13px] text-admin-text list-disc pl-4">
                {alert.reasons.map((r) =>
                <li key={r}>{r}</li>
                )}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-border p-5">
              <h2 className="text-[15px] font-bold text-admin-text mb-1">Recommended actions</h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 bg-admin-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-admin-accent rounded-full transition-all"
                    style={{ width: `${alert.actions.length ? doneCount / alert.actions.length * 100 : 0}%` }} />

                </div>
                <span className="text-[12px] font-bold text-admin-muted">
                  {doneCount}/{alert.actions.length}
                </span>
              </div>
              <div className="space-y-2">
                {alert.actions.map((x) =>
                <label key={x.id} className="flex items-start gap-2 text-[13px] text-admin-text cursor-pointer">
                    <input
                    type="checkbox"
                    checked={x.done}
                    disabled={!open}
                    onChange={() => actions.toggleAlertAction(alert.id, x.id)}
                    className="mt-0.5 rounded border-border text-admin focus:ring-admin" />

                    <span className={x.done ? 'line-through text-admin-muted' : ''}>
                      {x.label}
                      <span className="ml-1 text-[11px] text-admin-muted">
                        ({x.phase === 'immediate' ? '0–24h' : '1–7 days'})
                      </span>
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Interventions */}
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold text-admin-text">Linked interventions</h2>
                <p className="text-[12px] text-admin-muted">Response actions recorded against this alert</p>
              </div>
              {open &&
              <button
                onClick={() => setDrawer({ open: true, editing: null })}
                className="h-9 px-3 bg-admin hover:bg-admin-hover text-white text-[12px] font-semibold rounded-md flex items-center gap-1.5">

                  <Plus className="w-4 h-4" /> Log Intervention
                </button>
              }
            </div>
            {interventions.length === 0 ?
            <EmptyState title="No interventions logged yet" body="Log the first response action for this alert." /> :

            <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-admin-bg/50 text-admin-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Responsible</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Outcome</th>
                      <th className="px-4 py-3 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {interventions.map((it) =>
                  <tr key={it.id}>
                        <td className="px-4 py-3 font-mono text-[12px] text-admin-muted">{it.id}</td>
                        <td className="px-4 py-3 font-bold text-admin-text">{it.action}</td>
                        <td className="px-4 py-3 text-admin-muted">{it.who}</td>
                        <td className="px-4 py-3 font-semibold">{it.status}</td>
                        <td className="px-4 py-3 text-admin-muted">{it.outcome}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                        onClick={() => setDrawer({ open: true, editing: it })}
                        className="text-[12px] font-bold text-admin hover:underline">

                            Update
                          </button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            }
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-5">
            <h2 className="text-[15px] font-bold text-admin-text mb-4">Response timeline</h2>
            <ol className="relative border-l-2 border-border ml-2 space-y-4">
              {[...alert.timeline].reverse().map((t, i) =>
              <li key={i} className="ml-4">
                  <span
                  className={`absolute -left-[7px] w-3 h-3 rounded-full border-2 border-white ${t.kind === 'system' ? 'bg-admin-info' : t.kind === 'status' ? 'bg-admin-accent' : 'bg-admin-amber'}`} />

                  <div className="text-[12px] text-admin-muted">
                    {fmtDateTime(t.at)} · <span className="font-semibold text-admin-text">{t.author}</span>
                  </div>
                  <div className={`text-[13px] text-admin-text ${t.kind === 'note' ? 'italic' : ''}`}>
                    {t.kind === 'note' ? `“${t.text}”` : t.text}
                  </div>
                </li>
              )}
            </ol>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-border p-5">
            <h2 className="text-[15px] font-bold text-admin-text mb-3">Investigation</h2>
            {investigation ?
            <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-admin-muted">ID</span>
                  <span className="font-bold">{investigation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-muted">Status</span>
                  <span className="font-bold capitalize">{investigation.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-muted">Lead</span>
                  <span className="font-bold">{investigation.lead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-muted">Opened</span>
                  <span className="font-bold">{fmtDate(investigation.openedAt)}</span>
                </div>
                <Link
                to={`/dho/investigations/${investigation.id}`}
                className="mt-3 h-10 w-full bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md flex items-center justify-center gap-2">

                  <FileSearch className="w-4 h-4" /> Open Investigation
                </Link>
              </div> :

            <>
                <p className="text-[13px] text-admin-muted mb-4">
                  No investigation is linked to this alert. Request one from the
                  RBC epidemiology team if the cause is unclear or cases keep rising.
                </p>
                {open &&
              <button
                onClick={() => dialogs.open('investigate', alert)}
                className="h-10 w-full bg-white border border-admin text-admin text-[13px] font-semibold rounded-md hover:bg-admin/5 flex items-center justify-center gap-2">

                    <FileSearch className="w-4 h-4" /> Request Investigation
                  </button>
              }
              </>
            }
          </div>

          {sector &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-admin-text">{sector.name} Sector</h2>
                <SeverityBadge severity={sectorRisk(state, sector.name)} />
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-admin-muted">Population</span>
                  <span className="font-bold">{fmtNumber(sector.population)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-muted">Health facilities</span>
                  <span className="font-bold text-right">{sector.facilities.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-muted">CHWs</span>
                  <span className="font-bold">
                    {sector.chwActive} active, {sector.chwInactive} inactive
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-admin-muted">CHW coverage</span>
                  <span className="font-bold">{sector.chwCoverage}%</span>
                </div>
              </div>
              <Link
              to={`/dho/risk-map?sector=${sector.name}`}
              className="mt-4 text-[13px] font-bold text-admin hover:underline inline-block">

                View sector on risk map →
              </Link>
            </div>
          }

          <div className="bg-white rounded-lg shadow-sm border border-border p-5 text-[13px] space-y-2">
            <h2 className="text-[15px] font-bold text-admin-text mb-1">Response status</h2>
            <div className="flex justify-between gap-3">
              <span className="text-admin-muted">Acknowledged</span>
              <span className="font-bold text-right">
                {alert.acknowledgedAt ? `${alert.acknowledgedBy}, ${fmtDateTime(alert.acknowledgedAt)}` : '—'}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-admin-muted">Escalated</span>
              <span className="font-bold text-right">
                {alert.escalatedTo ? `${alert.escalatedTo}, ${fmtDateTime(alert.escalatedAt!)}` : '—'}
              </span>
            </div>
            {alert.closedAt &&
            <div className="flex justify-between gap-3">
                <span className="text-admin-muted">Closed</span>
                <span className="font-bold text-right">
                  {fmtDateTime(alert.closedAt)} — {alert.closeReason}
                </span>
              </div>
            }
          </div>
        </div>
      </div>

      <InterventionDrawer
        open={drawer.open}
        editing={drawer.editing}
        prefill={{ alertId: alert.id, sector: alert.sector, disease: alert.disease }}
        district={alert.district}
        onClose={() => setDrawer({ open: false, editing: null })} />

      {dialogs.element}
    </DhoLayout>);

}
