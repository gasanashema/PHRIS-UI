import { Link } from 'react-router-dom';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { ArrowDown } from 'lucide-react';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { sortAlerts, useApp } from '../../store/AppStore';
import { SEVERITY_META, demoNow, isOpenStatus } from '../../lib/format';

function hoursSince(iso: string) {
  return (demoNow().getTime() - new Date(iso).getTime()) / 3600000;
}
function fmtDuration(h: number) {
  const hh = Math.floor(Math.abs(h));
  const mm = Math.round((Math.abs(h) - hh) * 60);
  return hh > 0 ? `${hh}h ${mm}m` : `${mm} min`;
}

export function WarningEscalation() {
  const { state, actions } = useApp();
  const dialogs = useAlertDialogs();
  const open = state.alerts.filter((a) => isOpenStatus(a.status));
  const unack = sortAlerts(open.filter((a) => a.status === 'active'), 'severity');
  const pending = unack[0];
  const others = Math.max(0, unack.length - 1);
  const waitedH = pending ? hoursSince(pending.triggeredAt) : 0;
  const overdueH = waitedH - state.rules.autoEscalateHours;
  const rows = [...unack, ...sortAlerts(open.filter((a) => a.status === 'escalated'), 'severity')];
  return (
    <WarningLayout
      title="Alert Escalation Manager"
      subtitle="Automatic escalation when districts do not respond in time"
      breadcrumb="Escalation Manager">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flowchart */}
        <div className="lg:col-span-12 bg-white rounded-lg shadow-card border border-border p-8 mb-2">
          <h2 className="text-[18px] font-bold text-epi-text mb-8 text-center">
            Rwanda 5-Level Escalation Pathway
          </h2>

          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Level 1 */}
            <div className="w-full bg-epi/10 border-2 border-epi rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-epi mb-2">
                👤 Level 1: District Health Officer
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                Notified immediately on alert
              </div>
              <div className="text-[13px] font-bold text-epi-text">
                4-hour response window
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                No response in 4 hours? Automated → Level 2
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 2 */}
            <div className="w-full bg-epi-amber/10 border-2 border-epi-amber rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-epi-amber mb-2">
                🏛️ Level 2: Provincial Health Director
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                Notified automatically
              </div>
              <div className="text-[13px] font-bold text-epi-text">
                4-hour response window
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                No response or situation worsens? Automated → Level 3
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 3 */}
            <div className="w-full bg-[#F97316]/10 border-2 border-[#F97316] rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-[#F97316] mb-2">
                🔬 Level 3: RBC Epidemiology Division
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                Notified — outbreak investigation
              </div>
              <div className="text-[13px] font-bold text-epi-text">
                4-hour response window
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                Outbreak confirmed? Automated → Level 4
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 4 */}
            <div className="w-full bg-epi-red/10 border-2 border-epi-red rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-epi-red mb-2">
                🏥 Level 4: Ministry of Health
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                National emergency protocols triggered
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                National emergency declared? Automated → Level 5
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 5 */}
            <div className="w-full bg-[#7B0000]/10 border-2 border-[#7B0000] rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-[#7B0000] mb-2">
                🌍 Level 5: WHO Rwanda Country Office
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                International health regulations activated
              </div>
            </div>
          </div>
        </div>

        {/* Pending Auto-Escalation Card */}
        {pending ?
        <div className="lg:col-span-12 bg-[#F97316]/10 border-2 border-[#F97316] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-[12px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded animate-pulse">
                  ⚠️ AUTO-ESCALATION {overdueH > 0 ? 'OVERDUE' : 'PENDING'}
                </span>
                <Link to={`/warning/detail?id=${pending.id}`} className="text-[16px] font-bold text-epi-text hover:underline">
                  {pending.id} ({pending.disease} — {pending.district})
                </Link>
              </div>
              <p className="text-[14px] text-epi-text mb-2">
                {pending.district} District Health Officer has not responded in{' '}
                <span className="font-bold text-epi-red">{fmtDuration(waitedH)}</span>.
              </p>
              <p className="text-[14px] text-epi-text font-medium mb-3">
                {overdueH > 0 ?
                <>Response window ({state.rules.autoEscalateHours}h) exceeded by <span className="font-bold text-[#F97316]">{fmtDuration(overdueH)}</span> — escalate to the Provincial Director.</> :
                <>Automatic escalation to Provincial Director in <span className="font-bold text-[#F97316]">{fmtDuration(-overdueH)}</span>.</>
                }
              </p>
              {others > 0 &&
              <div className="text-[13px] text-epi-muted">
                  +{others} more unacknowledged alert{others > 1 ? 's' : ''} — see table below.
                </div>
              }
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-64">
              <button
              onClick={() => dialogs.open('escalate', pending)}
              className="w-full py-3 bg-epi-red text-white text-[14px] font-bold rounded-md hover:bg-epi-red/90 transition-colors shadow-sm">
              
                Escalate Now — Don't Wait
              </button>
              <button
              onClick={() => actions.addAlertNote(pending.id, `SMS reminder sent to ${pending.district} DHO (simulated).`)}
              className="w-full py-2 bg-white border border-[#F97316] text-[#F97316] text-[13px] font-bold rounded-md hover:bg-[#F97316]/10 transition-colors">
              
                Send SMS Reminder to DHO
              </button>
              <button
              onClick={() => actions.acknowledgeAlert(pending.id, 'Override: marked as in progress by national team.')}
              className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
              
                Override — Mark as In Progress
              </button>
            </div>
          </div> :

        <div className="lg:col-span-12 bg-[#00A550]/10 border-2 border-[#00A550] rounded-lg p-6 text-[14px] font-bold text-epi-text">
            ✅ No pending auto-escalations — every open alert has been acknowledged.
          </div>
        }

        {/* Active Escalation Status Table */}
        <div className="lg:col-span-12 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">Active Escalation Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  {['Alert', 'Current Level', 'Time at Level', 'Responsible', 'Next Step', 'Actions'].map((h) =>
                  <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 &&
                <tr>
                    <td colSpan={6} className="p-6 text-center text-[13px] text-epi-muted">No escalated or pending alerts.</td>
                  </tr>
                }
                {rows.map((a) => {
                  const levelStart = a.escalatedAt ?? a.triggeredAt;
                  const atLevel = hoursSince(levelStart);
                  const isPending = a.status === 'active';
                  return (
                    <tr key={a.id} className={isPending ? 'bg-[#F97316]/5 hover:bg-[#F97316]/10' : 'hover:bg-epi-bg/50'}>
                      <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                        {SEVERITY_META[a.severity].emoji} {a.id}
                        <div className="font-sans font-normal text-[12px] text-epi-muted">{a.disease}, {a.district}</div>
                      </td>
                      <td className={`p-4 text-[13px] font-bold ${isPending ? 'text-epi' : 'text-[#F97316]'}`}>
                        {a.escalatedTo ?? 'Level 1 — District'}
                      </td>
                      <td className={`p-4 text-[13px] ${isPending && atLevel > state.rules.autoEscalateHours ? 'font-bold text-epi-red' : 'text-epi-text'}`}>
                        {fmtDuration(atLevel)}{isPending && atLevel > state.rules.autoEscalateHours ? ' ⚠️' : ''}
                      </td>
                      <td className="p-4 text-[13px] text-epi-text">
                        {isPending ? `${a.district} DHO — no response` : a.acknowledgedBy}
                      </td>
                      <td className="p-4 text-[13px] text-epi-muted">
                        {isPending ? 'Escalate to Provincial Director' : 'Next level if not resolved in 6h'}
                      </td>
                      <td className="p-4 text-[13px] text-epi font-medium text-right whitespace-nowrap">
                        {isPending &&
                        <button onClick={() => dialogs.open('escalate', a)} className="text-epi-red hover:underline mr-2">
                            Escalate Now
                          </button>
                        }
                        {!isPending &&
                        <button onClick={() => dialogs.open('escalate', a)} className="hover:underline mr-2">
                            Escalate further
                          </button>
                        }
                        · <Link to={`/warning/detail?id=${a.id}`} className="hover:underline ml-1">View</Link>
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {dialogs.element}
    </WarningLayout>);

}
