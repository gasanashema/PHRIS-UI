import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import { sortAlerts, useApp } from '../../store/AppStore';
import { HUYE_SECTORS } from '../../data/seed';
import { downloadFile, fmtNumber, fmtTime, isOpenStatus, nowISO, toCSV } from '../../lib/format';

// Illustrative case-fatality ratios and exposure multipliers per disease
const CFR: Record<string, number> = { Cholera: 0.034, Malaria: 0.004, Measles: 0.01, Typhoid: 0.01, 'Diarrheal Disease': 0.006, Mpox: 0.02, Respiratory: 0.005 };
const EXPOSED: Record<string, number> = { Cholera: 3.9, Malaria: 6, Measles: 8, Typhoid: 4, 'Diarrheal Disease': 3, Mpox: 10, Respiratory: 5 };
const PERIOD_FACTOR: Record<string, number> = { 'This Week': 1, 'Last 2 Weeks': 1.8, 'Last 4 Weeks': 3.1 };

function growthOf(change: string) {
  const n = Number(change.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n / 100 : 0.1;
}

export function ProcessingMetrics() {
  const { state, actions } = useApp();
  const combos = sortAlerts(state.alerts.filter((a) => isOpenStatus(a.status)), 'severity');
  const diseases = Array.from(new Set(combos.map((a) => a.disease)));
  const [disease, setDisease] = useState(diseases.includes('Cholera') ? 'Cholera' : diseases[0]);
  const districtsFor = combos.filter((a) => a.disease === disease).map((a) => a.district);
  const [district, setDistrict] = useState(districtsFor.includes('Rusizi') ? 'Rusizi' : districtsFor[0]);
  const [period, setPeriod] = useState('This Week');
  const [calcAt, setCalcAt] = useState(nowISO());
  const [busy, setBusy] = useState(false);

  const alert = combos.find((a) => a.disease === disease && a.district === district) ?? combos.find((a) => a.disease === disease);
  const m = useMemo(() => {
    if (!alert) return null;
    const cases = Math.round(alert.cases * PERIOD_FACTOR[period]);
    const sector = HUYE_SECTORS.find((s) => s.name === alert.sector);
    const population = sector?.population ?? 50000;
    const deaths = Math.round(cases * (CFR[alert.disease] ?? 0.01));
    const exposed = Math.round(cases * (EXPOSED[alert.disease] ?? 4));
    const g = Math.max(0.02, growthOf(alert.change));
    const r0 = Math.min(4, 1 + g * 0.9);
    const doubling = Math.log(2) / Math.log(1 + g) * 7;
    const incidence = cases / population * 1000;
    return {
      cases,
      population,
      deaths,
      exposed,
      r0,
      doubling,
      incidence,
      cfr: cases ? deaths / cases * 100 : 0,
      attack: exposed ? cases / exposed * 100 : 0,
      prevalence: cases / population * 100,
      proj: [1, 2, 3].map((w) => Math.round(cases * Math.pow(r0, w)))
    };
  }, [alert, period, calcAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const recalc = () => {
    setBusy(true);
    window.setTimeout(() => {
      setCalcAt(nowISO());
      setBusy(false);
      actions.toast(`Metrics recalculated from batch ${state.pipeline.lastBatchId}.`);
    }, 700);
  };

  const exportCsv = () => {
    if (!m || !alert) return;
    downloadFile(
      `metrics-${alert.disease}-${alert.district}.csv`.replace(/\s+/g, '-').toLowerCase(),
      toCSV([
      { metric: 'Incidence rate (per 1,000)', value: m.incidence.toFixed(2) },
      { metric: 'Case fatality rate (%)', value: m.cfr.toFixed(1) },
      { metric: 'Attack rate (%)', value: m.attack.toFixed(1) },
      { metric: 'R0', value: m.r0.toFixed(1) },
      { metric: 'Doubling time (days)', value: m.doubling.toFixed(1) },
      { metric: 'Prevalence (%)', value: m.prevalence.toFixed(3) },
      { metric: 'Projected cases week +3', value: m.proj[2] }]
      ),
      'text/csv'
    );
    actions.toast('Metrics report exported.', 'info');
  };

  const card = (title: string, formula: string, worked: string, value: string, unit: string, note: string, status: string, statusCls: string) =>
  <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
      <h3 className="text-[14px] font-bold text-epi-text mb-1">{title}</h3>
      <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-1">{formula}</div>
      <div className="text-[11px] text-epi-muted font-mono mb-3">{worked}</div>
      <div className="text-3xl font-bold text-epi-text mb-1">
        {value} <span className="text-[14px] font-normal text-epi-muted">{unit}</span>
      </div>
      <p className="text-[12px] text-epi-muted mb-3">{note}</p>
      <div className={`mt-auto text-[12px] font-bold ${statusCls}`}>{status}</div>
    </div>;


  const selectCls = 'text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm';

  return (
    <ProcessingLayout
      title="Health Metrics Calculator"
      subtitle={`Calculated from clean AI Vital data (${state.pipeline.lastBatchId}) — last calculated ${fmtTime(calcAt)}`}
      breadcrumb="Metrics Calculator">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={disease}
            onChange={(e) => {
              setDisease(e.target.value);
              setDistrict(combos.find((a) => a.disease === e.target.value)?.district ?? '');
            }}
            aria-label="Disease"
            className={selectCls}>

            {diseases.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="District" className={selectCls}>
            {Array.from(new Set(districtsFor)).map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Time period" className={selectCls}>
            {Object.keys(PERIOD_FACTOR).map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <button onClick={recalc} disabled={busy} className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-60 transition-colors shadow-sm flex items-center gap-2">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Recalculate Now
        </button>
      </div>

      {!m || !alert ?
      <div className="bg-white rounded-lg border border-border p-10 text-center text-[14px] text-epi-muted">No active outbreak data to calculate.</div> :

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-epi-text">
              {alert.disease} — {alert.sector ? `${alert.sector}, ` : ''}{alert.district} District — {period}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {card('Incidence Rate', 'New cases ÷ Population × 1,000', `${m.cases} ÷ ${fmtNumber(m.population)} × 1,000`, m.incidence.toFixed(2), '/ 1,000', 'People infected per 1,000 residents', m.incidence > 0.5 ? '🔴 Above threshold (0.5)' : '🟢 Below threshold (0.5)', m.incidence > 0.5 ? 'text-epi-red' : 'text-[#00A550]')}
              {card('Case Fatality Rate', 'Deaths ÷ Cases × 100', `${m.deaths} ÷ ${m.cases} × 100`, `${m.cfr.toFixed(1)}%`, '', 'Of confirmed cases die', m.cfr >= 1 ? '🟠 Above target (<1%)' : '🟢 Within target (<1%)', m.cfr >= 1 ? 'text-[#F97316]' : 'text-[#00A550]')}
              {card('Attack Rate', 'Cases ÷ Exposed × 100', `${m.cases} ÷ ${fmtNumber(m.exposed)} × 100`, `${m.attack.toFixed(1)}%`, '', 'Of exposed people infected', m.attack >= 20 ? '🔴 Very high' : '🟡 Elevated', m.attack >= 20 ? 'text-epi-red' : 'text-epi-amber')}
              {card('R0 (Reproduction Number)', 'Avg contacts infected per case', `from ${alert.change} week-on-week growth`, m.r0.toFixed(1), '', `Each case infects ${m.r0.toFixed(1)} others`, m.r0 > 2 ? '🔴 Above 2.0' : m.r0 > 1 ? '🟠 Spreading (above 1.0)' : '🟢 Declining', m.r0 > 2 ? 'text-epi-red' : m.r0 > 1 ? 'text-[#F97316]' : 'text-[#00A550]')}
              {card('Doubling Time', 'ln 2 ÷ ln(1 + weekly growth) × 7', `growth ${alert.change}/week`, m.doubling.toFixed(1), 'days', `Cases doubling every ${m.doubling.toFixed(1)} days at current rate`, m.doubling < state.rules.doublingDays ? '🔴 Rapid spread' : '🟡 Moderate spread', m.doubling < state.rules.doublingDays ? 'text-epi-red' : 'text-epi-amber')}
              {card('Prevalence Rate', 'Total cases ÷ Population × 100', `${m.cases} ÷ ${fmtNumber(m.population)} × 100`, `${m.prevalence.toFixed(3)}%`, '', 'Of population currently affected', m.prevalence > 0.1 ? '🟠 Elevated' : '🟢 Low', m.prevalence > 0.1 ? 'text-[#F97316]' : 'text-[#00A550]')}
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-[14px] font-bold text-epi-text mb-3">At current R0 of {m.r0.toFixed(1)}, projected cases:</h3>
              <div className="grid grid-cols-3 gap-4 mb-3">
                {m.proj.map((p, i) =>
              <div key={i} className={`p-3 rounded text-center ${i === 0 ? 'bg-epi-bg' : i === 1 ? 'bg-epi-amber/10' : 'bg-epi-red/10'}`}>
                    <div className={`text-[12px] mb-1 ${i === 0 ? 'text-epi-muted' : i === 1 ? 'text-epi-amber' : 'text-epi-red'}`}>Week +{i + 1}</div>
                    <div className={`text-[16px] font-bold ${i === 0 ? 'text-epi-text' : i === 1 ? 'text-epi-amber' : 'text-epi-red'}`}>{fmtNumber(p)} cases</div>
                  </div>
              )}
              </div>
              <div className={`text-[13px] font-bold ${m.r0 > 1 ? 'text-epi-red' : 'text-[#00A550]'}`}>
                {m.r0 > 1 ? 'If no intervention: cases keep rising for the next 3 weeks' : 'Outbreak expected to decline'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-epi-text">How These Were Calculated</h2>
            <div className="bg-epi-bg/50 rounded-lg p-6 border border-border">
              <h3 className="text-[14px] font-bold text-epi-text mb-4">INCIDENCE RATE — Step by Step:</h3>
              <div className="space-y-4 font-mono text-[13px] text-epi-text">
                <div className="flex gap-3"><span className="text-epi-muted shrink-0">Step 1:</span><span>New cases ({period.toLowerCase()}) = {m.cases}</span></div>
                <div className="flex gap-3"><span className="text-epi-muted shrink-0">Step 2:</span><span>Population at risk ({alert.sector ?? alert.district}) = {fmtNumber(m.population)}</span></div>
                <div className="flex gap-3"><span className="text-epi-muted shrink-0">Step 3:</span><span className="font-bold">{m.cases} ÷ {fmtNumber(m.population)} × 1,000 = {m.incidence.toFixed(2)}</span></div>
                <div className="flex gap-3"><span className="text-epi-muted shrink-0">Step 4:</span><span>National threshold = 0.5</span></div>
                <div className="flex gap-3"><span className="text-epi-muted shrink-0">Step 5:</span><span className={m.incidence > 0.5 ? 'text-epi-red font-bold' : 'text-[#00A550] font-bold'}>{m.incidence.toFixed(2)} {m.incidence > 0.5 ? '> 0.5 → 🔴 Alert' : '≤ 0.5 → 🟢 Normal'}</span></div>
              </div>
              <div className="mt-8 pt-4 border-t border-border text-[12px] text-epi-muted italic">
                Population denominators sourced from NISR Rwanda Census 2022. Deaths and exposure are modelled estimates in this prototype.
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col gap-3">
              <button onClick={exportCsv} className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Export Metrics Report
              </button>
              <button
              onClick={() => {
                actions.sendNotification(
                  {
                    title: `Outbreak metrics — ${alert.disease}, ${alert.district}`,
                    body: `Incidence ${m.incidence.toFixed(2)}/1,000 · CFR ${m.cfr.toFixed(1)}% · R0 ${m.r0.toFixed(1)} · doubling ${m.doubling.toFixed(1)} days.`,
                    severity: alert.severity,
                    alertId: alert.id,
                    link: alert.district === 'Huye' ? `/dho/alerts/${alert.id}` : undefined,
                    roles: ['dho'],
                    district: alert.district
                  },
                  { module: 'Processing', action: `Shared outbreak metrics with ${alert.district} DHO` }
                );
                actions.toast(`Metrics shared with the ${alert.district} District Health Officer.`);
              }}
              className="w-full py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">

                Share with District Officer
              </button>
              <Link to="/processing/geographic" className="text-[13px] font-medium text-epi hover:underline text-center mt-2">
                View All Districts
              </Link>
            </div>
          </div>
        </div>
      }
    </ProcessingLayout>);

}
