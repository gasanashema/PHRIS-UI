import { useState } from 'react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Check } from 'lucide-react';
import { sortAlerts, useApp } from '../../store/AppStore';
import { downloadFile, isOpenStatus, nowISO } from '../../lib/format';
import type { Alert } from '../../types';

const DETAILED = 'ALT-2026-001';

function forecast(a: Alert) {
  const g = Math.max(0.05, Number(a.change.replace(/[^0-9.-]/g, '')) / 100 || 0.15);
  return [1, 2, 3, 4].map((w) => ({
    week: `Week +${w}`,
    none: Math.round(a.cases * Math.pow(1 + g, w)),
    act: Math.round(a.cases * Math.pow(1 + g, 1) * Math.pow(0.7, w - 1))
  }));
}

function TimelineActions({ alert }: {alert?: Alert;}) {
  const { actions } = useApp();
  const [done, setDone] = useState<string[]>([]);
  if (!alert) return null;
  const mark = (k: string) => setDone((d) => [...d, k]);
  return (
    <div className="flex flex-wrap gap-3">
      <button
        disabled={done.includes('deploy')}
        onClick={() => {
          actions.addIntervention({
            date: nowISO(),
            action: `Deploy scenario-2 response for ${alert.disease} (water treatment, ORS, CHW visits)`,
            disease: alert.disease,
            sector: alert.sector ?? 'All sectors',
            district: alert.district,
            who: `${alert.district} DHO + RBC`,
            status: 'Planned',
            outcome: 'Deployment requested from prediction timeline',
            alertId: alert.id
          });
          mark('deploy');
        }}
        className="px-6 py-3 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-60 transition-colors shadow-sm">

        {done.includes('deploy') ? (
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Intervention planned</span>
        ) : (
          'Deploy Intervention Now'
        )}
      </button>
      <button
        disabled={done.includes('share')}
        onClick={() => {
          actions.sendNotification(
            {
              title: `4-week forecast — ${alert.disease}, ${alert.district}`,
              body: `Without intervention cases are forecast to reach ${forecast(alert)[3].none}; with the recommended response about ${forecast(alert)[3].act}.`,
              severity: alert.severity,
              alertId: alert.id,
              link: `/dho/alerts/${alert.id}`,
              roles: ['dho'],
              district: alert.district
            },
            { module: 'Prediction', action: `Shared forecast timeline with ${alert.district} DHO` }
          );
          actions.toast(`Timeline shared with the ${alert.district} DHO.`);
          mark('share');
        }}
        className="px-6 py-3 bg-white border border-border text-epi-text text-[14px] font-bold rounded-md hover:bg-epi-bg disabled:opacity-60 transition-colors shadow-sm">

        {done.includes('share') ? (
          <span className="flex items-center gap-1.5 text-[#00A550]"><Check className="w-4 h-4" /> Shared with DHO</span>
        ) : (
          'Share Timeline with DHO'
        )}
      </button>
      <button
        onClick={() => {
          const rows = forecast(alert).map((r) => `<tr><td>${r.week}</td><td>${r.none}</td><td>${r.act}</td></tr>`).join('');
          downloadFile(`forecast-${alert.id}.html`, `<!doctype html><html><head><meta charset="utf-8"><title>Forecast</title><style>body{font-family:Arial;max-width:700px;margin:40px auto}td,th{border:1px solid #ddd;padding:6px}table{border-collapse:collapse}</style></head><body><h1>${alert.disease} — ${alert.district}: 4-week forecast</h1><table><tr><th>Week</th><th>No action</th><th>With intervention</th></tr>${rows}</table><p>Printable export — use your browser's Save as PDF. Simulated forecast.</p></body></html>`, 'text/html');
          actions.toast('Forecast exported as a printable document (save as PDF from your browser).', 'info');
        }}
        className="px-6 py-3 bg-white border border-border text-epi-text text-[14px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm">

        Export as PDF
      </button>
    </div>);

}

export function PredictionTimeline() {
  const { state } = useApp();
  const options = sortAlerts(state.alerts.filter((a) => isOpenStatus(a.status)), 'severity');
  const [choice, setChoice] = useState(DETAILED);
  const [shown, setShown] = useState(DETAILED);
  const alert = state.alerts.find((a) => a.id === shown) ?? options[0];
  return (
    <PredictionLayout
      title="Prediction Timeline"
      subtitle="Week-by-week disease forecast — act now vs wait"
      breadcrumb="Prediction Timeline">

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select value={choice} onChange={(e) => setChoice(e.target.value)} aria-label="Outbreak" className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          {options.map((a) => <option key={a.id} value={a.id}>{a.district} — {a.disease}</option>)}
        </select>
        <button onClick={() => setShown(choice)} className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
          Generate Timeline
        </button>
      </div>

      {alert && alert.id !== DETAILED ?
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-8">
          <h2 className="text-[18px] font-bold text-epi-text mb-1">{alert.disease} — {alert.district} District 4-Week Forecast — Two Scenarios</h2>
          <p className="text-[13px] text-epi-muted mb-6">Starting from {alert.cases} cases this week, growth {alert.change} week-on-week (simulated model)</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg"><tr><th className="p-3">Week</th><th className="p-3">● No action</th><th className="p-3">● With intervention</th><th className="p-3">Cases averted</th></tr></thead>
              <tbody className="divide-y divide-border">
                {forecast(alert).map((r) =>
              <tr key={r.week}>
                    <td className="p-3 font-bold">{r.week}</td>
                    <td className="p-3 text-epi-red font-bold">{r.none}</td>
                    <td className="p-3 text-[#00A550] font-bold">{r.act}</td>
                    <td className="p-3">{Math.max(0, r.none - r.act)}</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          <TimelineActions alert={alert} />
        </div> :
      <>
      {/* Hero Visual */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-6 border-b border-border">
          <h2 className="text-[18px] font-bold text-epi-text">
            Cholera — Rusizi District 4-Week Forecast — Two Scenarios
          </h2>
        </div>

        <div className="p-6">
          {/* Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse border border-border">
              <thead>
                <tr>
                  <th className="p-4 text-[13px] font-bold text-epi-muted uppercase tracking-wider bg-epi-bg border-b border-r border-border w-1/5">
                    Week
                  </th>
                  <th className="p-4 text-[13px] font-bold text-epi-red uppercase tracking-wider bg-epi-red/5 border-b border-r border-border w-2/5">
                    ● NO INTERVENTION
                  </th>
                  <th className="p-4 text-[13px] font-bold text-[#00A550] uppercase tracking-wider bg-[#00A550]/5 border-b border-border w-2/5">
                    ● IMMEDIATE RESPONSE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 text-[14px] font-bold text-epi-text border-b border-r border-border bg-epi-bg/30">
                    Now (June 5)
                  </td>
                  <td className="p-4 border-b border-r border-border bg-[#F97316]/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        87 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded">
                          Orange
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#F97316]" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border bg-[#F97316]/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        87 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded">
                          Orange
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#F97316]" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[14px] font-bold text-epi-text border-b border-r border-border bg-epi-bg/30">
                    Week +1 (June 12)
                  </td>
                  <td className="p-4 border-b border-r border-border bg-epi-red/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        180–220 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                          Red
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-epi-red" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border bg-[#F97316]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        95–110 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded">
                          Orange
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#F97316]" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[14px] font-bold text-epi-text border-b border-r border-border bg-epi-bg/30">
                    Week +2 (June 19)
                  </td>
                  <td className="p-4 border-b border-r border-border bg-epi-red/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        380–460 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                          Critical
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-epi-red" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border bg-epi-amber/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        80–95 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-epi-amber text-white px-2 py-0.5 rounded">
                          Declining
                        </span>
                        <ArrowDownRight className="w-4 h-4 text-epi-amber" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[14px] font-bold text-epi-text border-b border-r border-border bg-epi-bg/30">
                    Week +3 (June 26)
                  </td>
                  <td className="p-4 border-b border-r border-border bg-epi-red/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        700–900 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                          Epidemic
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-epi-red" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border bg-epi-amber/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        55–70 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-epi-amber text-white px-2 py-0.5 rounded">
                          Yellow
                        </span>
                        <ArrowDownRight className="w-4 h-4 text-epi-amber" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[14px] font-bold text-epi-text border-r border-border bg-epi-bg/30">
                    Week +4 (July 3)
                  </td>
                  <td className="p-4 border-r border-border bg-epi-red/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        1,100–1,400 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                          MAJOR EPIDEMIC
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-epi-red" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 bg-[#00A550]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-epi-text">
                        30–45 cases
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-[#00A550] text-white px-2 py-0.5 rounded">
                          Controlled
                        </span>
                        <ArrowDownRight className="w-4 h-4 text-[#00A550]" />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Diverging Chart */}
          <div className="relative h-80 w-full mb-8">
            {/* Epidemic Zone */}
            <div className="absolute left-10 right-0 top-0 bottom-[33%] bg-epi-red/5 border-b border-dashed border-epi-red z-0">
              <span className="absolute bottom-2 right-4 text-[11px] font-bold text-epi-red">
                Epidemic zone (&gt;500 cases)
              </span>
            </div>

            {/* Y Axis */}
            <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right pr-2">
              <span>1500</span>
              <span>1000</span>
              <span>500</span>
              <span>0</span>
            </div>

            {/* X Axis */}
            <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] text-epi-muted font-medium">
              <span>Week 0</span>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>

            {/* Chart Area */}
            <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-b border-border">
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 100">
                
                {/* Confidence Bands */}
                <polygon
                  points="0,94 25,86 50,72 75,46 100,16 100,0 75,34 50,66 25,88 0,94"
                  fill="#D32F2F"
                  opacity="0.1" />
                
                <polygon
                  points="0,94 25,92 50,94 75,96 100,98 100,97 75,95 50,93 25,91 0,94"
                  fill="#00A550"
                  opacity="0.1" />
                

                {/* Red Line (No intervention) */}
                <polyline
                  points="0,94 25,87 50,69 75,40 100,8"
                  fill="none"
                  stroke="#D32F2F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round" />
                

                {/* Green Line (With intervention) */}
                <polyline
                  points="0,94 25,91.5 50,93.5 75,95.5 100,97.5"
                  fill="none"
                  stroke="#00A550"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round" />
                

                <circle cx="0" cy="94" r="4" fill="#1A1A2E" />

                {/* Annotations */}
                <circle cx="50" cy="69" r="4" fill="#D32F2F" />
                <circle cx="100" cy="97.5" r="4" fill="#00A550" />
              </svg>

              {/* Annotation Labels */}
              <div className="absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-full bg-white border border-epi-red p-2 rounded shadow-sm text-[11px] font-bold text-epi-red whitespace-nowrap z-20">
                Epidemic threshold crossed without action
              </div>
              <div className="absolute bottom-[5%] right-0 -translate-y-full bg-white border border-[#00A550] p-2 rounded shadow-sm text-[11px] font-bold text-[#00A550] whitespace-nowrap z-20 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Controlled — intervention worked
              </div>
            </div>
          </div>

          {/* Note & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="bg-epi-bg p-4 rounded-lg border border-border text-[13px] text-epi-text max-w-xl">
              <span className="font-bold">Scenario 2 assumes:</span>
              <br />
              Water treatment at Ruzizi water point by June 7 + ORS deployed by
              June 8 + CHW household visits in Bugarama sector by June 10
            </div>
            <TimelineActions alert={alert} />
          </div>
        </div>
      </div>
      </>
      }
    </PredictionLayout>);

}