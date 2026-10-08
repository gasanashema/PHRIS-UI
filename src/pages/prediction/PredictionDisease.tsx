import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { SeverityBadge } from '../../components/shared/Badges';
import { severityForSignal, sortAlerts, useApp } from '../../store/AppStore';
import { downloadFile, fmtDate, isOpenStatus, nowISO } from '../../lib/format';

const DISEASE_TABS = [
['Malaria', '🦟 Malaria'],
['Cholera', '💧 Cholera'],
['Measles', '💉 Measles'],
['COVID-19', '🦠 COVID-19'],
['Typhoid', '🌡️ Typhoid'],
['VHF', '🩸 VHF'],
['Mpox', '🐒 Mpox'],
['Malnutrition', '🍽️ Malnutrition']] as
const;

/** Store-driven prediction summary for diseases without a detailed briefing. */
function DiseaseSummary({ disease }: {disease: string;}) {
  const { state } = useApp();
  const risk = state.districtRisk.filter((r) => r.disease === disease).sort((a, b) => b.score - a.score);
  const alerts = sortAlerts(state.alerts.filter((a) => a.disease === disease && isOpenStatus(a.status)), 'severity');
  const signals = state.predictionRuns.flatMap((r) => r.signals.map((sg) => ({ ...sg, run: r.id }))).filter((sg) => sg.disease === disease);
  const peak = risk[0];
  const tone = peak && peak.score >= 80 ? 'bg-epi-red' : peak && peak.score >= 60 ? 'bg-[#F97316]' : peak && peak.score >= 40 ? 'bg-epi-amber' : 'bg-[#00A550]';
  return (
    <>
      <div className={`${tone} text-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="font-bold text-[15px]">{disease.toUpperCase()} — {peak ? `highest district risk ${peak.score}/100 (${peak.district})` : 'no district currently lists this as its top risk'}</div>
        <div className="text-[13px] font-medium opacity-90">{alerts.length} open alert{alerts.length === 1 ? '' : 's'} · {risk.length} district{risk.length === 1 ? '' : 's'} with {disease} as top risk</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h2 className="text-[16px] font-bold text-epi-text mb-4">District risk scores — {disease}</h2>
          {risk.length === 0 && <p className="text-[13px] text-epi-muted">No district currently has {disease} as its highest-risk disease.</p>}
          <div className="space-y-3">
            {risk.map((r) =>
            <div key={r.district} className="flex items-center gap-3 text-[13px]">
                <span className="w-28 font-bold text-epi-text">{r.district}</span>
                <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.score >= 80 ? '#D32F2F' : r.score >= 60 ? '#F97316' : r.score >= 40 ? '#EAB308' : '#00A550' }} />
                </div>
                <span className="w-16 text-right font-bold">{r.score}/100</span>
                <span className="w-6 text-center">{r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">Open alerts</h2>
            {alerts.length === 0 && <p className="text-[13px] text-epi-muted">No open {disease} alerts.</p>}
            <ul className="divide-y divide-border">
              {alerts.map((a) =>
              <li key={a.id} className="py-2 flex items-center justify-between gap-3 text-[13px]">
                  <Link to={`/warning/detail?id=${a.id}`} className="font-bold text-epi hover:underline">{a.id} — {a.district}</Link>
                  <SeverityBadge severity={a.severity} />
                </li>
              )}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">Signals from prediction runs</h2>
            {signals.length === 0 ?
            <p className="text-[13px] text-epi-muted">No {disease} signals in recent runs. <Link to="/prediction" className="text-epi font-bold hover:underline">Run a prediction →</Link></p> :
            <ul className="space-y-2 text-[13px]">
                {signals.map((sg) =>
              <li key={`${sg.run}-${sg.district}`} className="flex items-center justify-between gap-3">
                    <span>{sg.sector ? `${sg.sector}, ` : ''}{sg.district} · {sg.probability}% <span className="text-epi-muted">({sg.run})</span></span>
                    <SeverityBadge severity={severityForSignal(sg, state.thresholds, state.rules)} />
                  </li>
              )}
              </ul>
            }
          </div>
        </div>
      </div>
    </>);

}

export function PredictionDisease() {
  const { state, actions } = useApp();
  const [disease, setDisease] = useState('Cholera');
  const [sent, setSent] = useState(false);
  const choleraAlerts = state.alerts.filter((a) => a.disease === 'Cholera' && isOpenStatus(a.status));

  const generateBrief = () => {
    const rows = choleraAlerts.map((a) => `<li>${a.id} — ${a.sector ? a.sector + ', ' : ''}${a.district}: ${a.cases} cases, ${a.probability}% probability (${a.status})</li>`).join('');
    downloadFile(
      'cholera-brief.html',
      `<!doctype html><html><head><meta charset="utf-8"><title>Cholera Brief</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;color:#1A1A2E}h1{color:#104E49}</style></head><body><h1>National Cholera Brief</h1><p>${fmtDate(nowISO())} · AI Vital prediction engine (simulated model)</p><h2>Open cholera alerts</h2><ul>${rows}</ul><h2>Recommended actions</h2><ul><li>Set up oral rehydration points at Bugarama and Kamembe markets</li><li>Brief all CHWs in affected sectors</li><li>Request WHO rapid response team if cases exceed 150</li></ul></body></html>`,
      'text/html'
    );
    actions.logAdminEvent('Prediction', 'Generated national cholera brief');
  };

  const sendToDhos = () => {
    const districts = Array.from(new Set(choleraAlerts.map((a) => a.district)));
    districts.forEach((d) => {
      const a = choleraAlerts.find((x) => x.district === d)!;
      actions.sendNotification(
        {
          title: `Cholera prediction brief — ${d}`,
          body: `AI Vital forecasts continued cholera risk in ${d} (${a.probability}% probability). Review recommended actions.`,
          severity: a.severity,
          alertId: a.id,
          link: `/dho/alerts/${a.id}`,
          roles: ['dho'],
          district: d
        },
        { module: 'Prediction', action: `Sent cholera brief to ${d} DHO` }
      );
    });
    setSent(true);
    actions.toast(`Cholera brief sent to ${districts.length} District Health Officer${districts.length === 1 ? '' : 's'}: ${districts.join(', ')}.`);
  };

  return (
    <PredictionLayout
      title={`Disease Predictions — ${disease}`}
      subtitle={`AI-generated national ${disease.toLowerCase()} risk assessment | ${fmtDate(nowISO())}`}
      breadcrumb="Disease Predictions">
      
      {/* Disease Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
        {DISEASE_TABS.map(([d, label]) =>
        <button
          key={d}
          onClick={() => setDisease(d)}
          className={`px-4 py-2 rounded-full text-[14px] font-bold whitespace-nowrap shadow-sm transition-colors ${disease === d ? 'bg-epi text-white' : 'bg-white border border-border text-epi-muted hover:bg-epi-bg'}`}>

            {label}{disease === d ? ' ✓' : ''}
          </button>
        )}
      </div>

      {disease !== 'Cholera' ?
      <DiseaseSummary disease={disease} /> :
      <>
      {/* Top Status Banner */}
      <div className="bg-epi-red text-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-bold text-[15px]">
          🔴 CHOLERA — ACTIVE OUTBREAK RISK
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium opacity-90">
          <span>87 confirmed cases this week</span>
          <span className="hidden md:inline">|</span>
          <span>3 districts at alert level</span>
          <span className="hidden md:inline">|</span>
          <span>Outbreak probability national peak: 91% (Rusizi)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Section 1: National Overview Chart */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-6">
              Cholera Cases — Rwanda National (Jan–Jun 2026)
            </h2>
            <div className="relative h-64 w-full mb-4">
              {/* Shaded rainy season */}
              <div className="absolute left-[33%] right-[33%] top-0 bottom-6 bg-epi-bg/80 border-x border-border z-0">
                <div className="absolute top-2 left-2 text-[10px] font-bold text-epi-muted max-w-[80px]">
                  Rainy season (March–May) risk period shaded
                </div>
              </div>

              {/* Threshold lines */}
              <div className="absolute left-8 right-0 top-[20%] border-t-2 border-dashed border-epi-red z-0">
                <span className="absolute -top-5 right-0 text-[10px] font-bold text-epi-red">
                  50/wk
                </span>
              </div>
              <div className="absolute left-8 right-0 top-[50%] border-t-2 border-dashed border-[#F97316] z-0">
                <span className="absolute -top-5 right-0 text-[10px] font-bold text-[#F97316]">
                  30/wk
                </span>
              </div>
              <div className="absolute left-8 right-0 top-[80%] border-t-2 border-dashed border-epi-amber z-0">
                <span className="absolute -top-5 right-0 text-[10px] font-bold text-epi-amber">
                  10/wk
                </span>
              </div>

              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right pr-2">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              {/* X Axis */}
              <div className="absolute left-8 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] text-epi-muted font-medium">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>

              {/* Line */}
              <svg
                className="absolute left-8 right-0 top-0 bottom-6 w-[calc(100%-32px)] h-full overflow-visible z-10"
                preserveAspectRatio="none"
                viewBox="0 0 100 100">
                
                <polyline
                  points="0,95 20,98 40,90 60,95 80,40 100,13"
                  fill="none"
                  stroke="#104E49"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round" />
                
                <circle cx="100" cy="13" r="4" fill="#D32F2F" />
              </svg>
            </div>
          </div>

          {/* Section 2: Forecast Chart */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-6">
              4-Week Cholera Forecast — Rwanda (Jun 5 – Jul 3, 2026)
            </h2>
            <div className="relative h-64 w-full mb-8">
              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right pr-2">
                <span>2000</span>
                <span>1500</span>
                <span>1000</span>
                <span>500</span>
                <span>0</span>
              </div>

              {/* X Axis */}
              <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] text-epi-muted font-medium">
                <span>Now</span>
                <span>+1w</span>
                <span>+2w</span>
                <span>+3w</span>
                <span>+4w</span>
              </div>

              {/* Chart Area */}
              <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-b border-border">
                {/* Confidence Bands */}
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100">
                  
                  {/* Red band */}
                  <polygon
                    points="0,95 25,85 50,70 75,45 100,0 100,15 75,60 50,80 25,92 0,95"
                    fill="#D32F2F"
                    opacity="0.1" />
                  
                  {/* Green band */}
                  <polygon
                    points="0,95 25,92 50,94 75,96 100,98 100,99 75,98 50,96 25,96 0,95"
                    fill="#00A550"
                    opacity="0.1" />
                  

                  {/* Red Line */}
                  <polyline
                    points="0,95 25,88 50,75 75,52 100,8"
                    fill="none"
                    stroke="#D32F2F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round" />
                  
                  {/* Green Line */}
                  <polyline
                    points="0,95 25,94 50,95 75,97 100,98.5"
                    fill="none"
                    stroke="#00A550"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round" />
                  

                  <circle cx="0" cy="95" r="4" fill="#1A1A2E" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 text-[12px]">
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-epi-red mb-2">
                  <div className="w-3 h-3 rounded-full bg-epi-red"></div>
                  No intervention — epidemic trajectory
                </div>
                <div className="text-epi-muted space-y-1 pl-5">
                  <div>Now: 87 cases</div>
                  <div>+1w: 190–220</div>
                  <div>+2w: 400–460</div>
                  <div>+3w: 800–960</div>
                  <div className="font-bold text-epi-red">+4w: 1,600–1,900</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-[#00A550] mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#00A550]"></div>
                  With water treatment + ORS deployment
                </div>
                <div className="text-epi-muted space-y-1 pl-5">
                  <div>Now: 87 cases</div>
                  <div>+1w: 95–110</div>
                  <div>+2w: 80–95</div>
                  <div>+3w: 55–70</div>
                  <div className="font-bold text-[#00A550]">+4w: 30–45</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-3 bg-epi-red/10 border border-epi-red/20 rounded text-[13px] font-bold text-epi-red text-center">
              🚨 If no action taken, national epidemic threshold crossed by Week
              2
            </div>
          </div>

          {/* Section 3: High Risk Districts */}
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-epi-text">
                Districts at Cholera Risk — June 2026
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-epi-bg border-b border-border">
                    <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      District
                    </th>
                    <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      Score
                    </th>
                    <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      Probability
                    </th>
                    <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      Cases Now
                    </th>
                    <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      2-Week Forecast
                    </th>
                    <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-4 text-[14px] font-bold text-epi-text">
                      Rusizi
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-red">
                      91/100
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-red">
                      91%
                    </td>
                    <td className="p-4 text-[13px] text-epi-text">87 cases</td>
                    <td className="p-4 text-[13px] font-bold text-epi-red">
                      400–460 cases
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-red text-right">
                      🔴 Act Now
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-4 text-[14px] font-bold text-epi-text">
                      Karongi
                    </td>
                    <td className="p-4 text-[13px] font-bold text-[#F97316]">
                      48/100
                    </td>
                    <td className="p-4 text-[13px] font-bold text-[#F97316]">
                      43%
                    </td>
                    <td className="p-4 text-[13px] text-epi-text">12 cases</td>
                    <td className="p-4 text-[13px] font-bold text-[#F97316]">
                      28–35 cases
                    </td>
                    <td className="p-4 text-[13px] font-bold text-[#F97316] text-right">
                      🟠 Watch
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-4 text-[14px] font-bold text-epi-text">
                      Huye
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-amber">
                      38/100
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-amber">
                      31%
                    </td>
                    <td className="p-4 text-[13px] text-epi-text">8 cases</td>
                    <td className="p-4 text-[13px] font-bold text-epi-amber">
                      15–22 cases
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-amber text-right">
                      🟡 Monitor
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Risk Factors */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-6">
              What Is Driving Cholera Risk
            </h2>

            <div className="space-y-5 mb-6">
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    Water quality (WASAC data):
                  </span>
                  <span className="font-bold text-epi-red">+22 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  2/10 — Very Poor
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-epi-red h-2 rounded-full"
                    style={{
                      width: '100%'
                    }}>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    Weekly case growth (+45%):
                  </span>
                  <span className="font-bold text-epi-red">+20 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  Rapid acceleration
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-epi-red h-2 rounded-full"
                    style={{
                      width: '90%'
                    }}>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    Current case count (87):
                  </span>
                  <span className="font-bold text-epi-red">+18 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  Above outbreak threshold
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-epi-red h-2 rounded-full"
                    style={{
                      width: '80%'
                    }}>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    Heavy rainfall (145mm):
                  </span>
                  <span className="font-bold text-[#F97316]">+15 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  Ruzizi River flooding risk
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-[#F97316] h-2 rounded-full"
                    style={{
                      width: '65%'
                    }}>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    Sanitation coverage (34%):
                  </span>
                  <span className="font-bold text-[#F97316]">+9 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  Well below national avg
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-[#F97316] h-2 rounded-full"
                    style={{
                      width: '40%'
                    }}>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    Population density:
                  </span>
                  <span className="font-bold text-epi-amber">+5 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  Bugarama sector crowding
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-epi-amber h-2 rounded-full"
                    style={{
                      width: '20%'
                    }}>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-bold text-epi-text">
                    DRC border proximity:
                  </span>
                  <span className="font-bold text-epi-amber">+2 pts</span>
                </div>
                <div className="text-[12px] text-epi-muted mb-1">
                  Cross-border cholera in DRC
                </div>
                <div className="w-full bg-epi-bg rounded-full h-2">
                  <div
                    className="bg-epi-amber h-2 rounded-full"
                    style={{
                      width: '10%'
                    }}>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-[16px] font-bold text-epi-text">
                TOTAL:
              </span>
              <span className="text-[24px] font-bold text-epi-red">91/100</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6 flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  className="text-epi-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4" />
                
                <path
                  className="text-[#00A550]"
                  strokeDasharray="89, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4" />
                
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[18px] font-bold text-epi-text">89%</span>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                AI Confidence: HIGH
              </h3>
              <p className="text-[12px] text-epi-muted leading-relaxed">
                Based on: 4-year Rwanda cholera data, 67 past predictions,
                current lab-confirmed cases, real-time WASAC water data
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">
              Recommended Actions
            </h2>

            <div className="mb-4">
              <h3 className="text-[13px] font-bold text-epi-red mb-2 uppercase tracking-wider">
                Immediate (Today)
              </h3>
              <ul className="space-y-2 text-[13px] text-epi-text">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Deploy ORS + chlorine to Rusizi</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Issue cholera alert to all Western Province DHOs</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Inspect Ruzizi River water points</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-[#F97316] mb-2 uppercase tracking-wider">
                Short-term (Week 1–2)
              </h3>
              <ul className="space-y-2 text-[13px] text-epi-text">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>
                    Set up oral rehydration points at Bugarama and Kamembe
                    markets
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Brief all 45 Rusizi CHWs</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>
                    Request WHO rapid response team if cases exceed 150
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={generateBrief} className="flex-1 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
                Generate Cholera Brief
              </button>
              <button onClick={sendToDhos} disabled={sent} className="flex-1 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg disabled:opacity-60 transition-colors">
                {sent ? '✓ Sent to DHOs' : 'Send to DHOs'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
      }
    </PredictionLayout>);

}