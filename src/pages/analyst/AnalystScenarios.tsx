import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import { ShieldCheck, Heart, TrendingUp } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { downloadFile, fmtDate, fmtDateTime, nowISO } from '../../lib/format';

interface InterventionType {
  diseases: string[];
  lever: string; // what the slider controls
  unit: '%' | 'CHWs' | 'RWF M';
  min: number;
  max: number;
  baseline: Record<string, number>; // current level by geography
  efficacy: number; // fraction of cases averted at full scale-up
  costPerUnit: number; // RWF per unit of scale-up per month
}
const TYPES: Record<string, InterventionType> = {
  'Vaccination Coverage Increase': { diseases: ['Measles', 'Rubella'], lever: 'coverage', unit: '%', min: 50, max: 100, baseline: { 'Kayonza District': 71, 'Nyagatare District': 74, 'Huye District': 89, 'Rusizi District': 82, 'Western Province': 83, 'Southern Province': 88 }, efficacy: 0.97, costPerUnit: 2_800_000 },
  'Sanitation Improvement': { diseases: ['Cholera', 'Diarrheal Disease', 'Typhoid'], lever: 'WASH coverage', unit: '%', min: 30, max: 100, baseline: { 'Kayonza District': 64, 'Nyagatare District': 63, 'Huye District': 75, 'Rusizi District': 41, 'Western Province': 55, 'Southern Province': 68 }, efficacy: 0.8, costPerUnit: 9_500_000 },
  'CHW Deployment': { diseases: ['Malaria', 'Diarrheal Disease', 'Pneumonia'], lever: 'active CHWs', unit: 'CHWs', min: 0, max: 1000, baseline: { 'Kayonza District': 220, 'Nyagatare District': 240, 'Huye District': 300, 'Rusizi District': 260, 'Western Province': 1100, 'Southern Province': 1300 }, efficacy: 0.45, costPerUnit: 85_000 },
  'Budget Change': { diseases: ['Malaria', 'HIV/AIDS', 'Tuberculosis'], lever: 'programme budget', unit: 'RWF M', min: 0, max: 2000, baseline: { 'Kayonza District': 900, 'Nyagatare District': 850, 'Huye District': 700, 'Rusizi District': 780, 'Western Province': 3400, 'Southern Province': 3100 }, efficacy: 0.5, costPerUnit: 1_000_000 },
  'Bednet Distribution': { diseases: ['Malaria'], lever: 'household bednet coverage', unit: '%', min: 40, max: 100, baseline: { 'Kayonza District': 63, 'Nyagatare District': 66, 'Huye District': 78, 'Rusizi District': 70, 'Western Province': 72, 'Southern Province': 76 }, efficacy: 0.6, costPerUnit: 4_200_000 },
  'Water Treatment': { diseases: ['Cholera', 'Typhoid'], lever: 'treated water access', unit: '%', min: 30, max: 100, baseline: { 'Kayonza District': 58, 'Nyagatare District': 60, 'Huye District': 72, 'Rusizi District': 44, 'Western Province': 52, 'Southern Province': 66 }, efficacy: 0.75, costPerUnit: 6_100_000 }
};
const GEOS = Object.keys(TYPES['Vaccination Coverage Increase'].baseline);
const BASE_CASES: Record<string, number> = { Measles: 22, Rubella: 9, Cholera: 30, 'Diarrheal Disease': 140, Typhoid: 25, Malaria: 420, Pneumonia: 90, 'HIV/AIDS': 18, Tuberculosis: 14 };
const CFR: Record<string, number> = { Measles: 0.014, Rubella: 0.002, Cholera: 0.018, 'Diarrheal Disease': 0.004, Typhoid: 0.01, Malaria: 0.003, Pneumonia: 0.02, 'HIV/AIDS': 0.03, Tuberculosis: 0.05 };
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

interface Params {type: string;disease: string;geo: string;target: number;months: number;baseline: 'trajectory' | 'none';}
interface Saved {name: string;date: string;params: Params;}

function simulate(p: Params) {
  const t = TYPES[p.type];
  const current = t.baseline[p.geo];
  const geoScale = p.geo.includes('Province') ? 3.5 : 1;
  const base = BASE_CASES[p.disease] * geoScale;
  // Scale-up achieved relative to the room left for improvement
  const room = t.unit === '%' ? 100 - current : t.max;
  const gain = Math.max(0, p.target - (t.unit === '%' ? current : 0));
  const scaleUp = room > 0 ? Math.min(1, gain / room) : 0;
  const growth = p.baseline === 'none' ? 0.18 : 0.07;
  const data = MONTHS.slice(0, p.months + 1).map((month, i) => {
    const noInt = Math.round(base * (1 + growth) ** i);
    const ramp = Math.min(1, i / Math.max(1, p.months * 0.4)); // effect builds up over first 40% of period
    const withInt = Math.round(noInt * (1 - t.efficacy * scaleUp * ramp));
    return { month, noInt, withInt };
  });
  const prevented = data.reduce((s, d) => s + (d.noInt - d.withInt), 0);
  const deaths = Math.round(prevented * CFR[p.disease] * 10) / 10;
  const cost = gain * t.costPerUnit * (t.unit === 'RWF M' ? 1 : 1) * (p.months / 6);
  const costPerCase = prevented ? Math.round(cost / prevented) : 0;
  const confidence = Math.round(84 - p.months * 0.6 - (p.geo.includes('Province') ? 4 : 0));
  return { data, prevented, deaths, cost, costPerCase, current, confidence };
}
const fmtTarget = (v: number, unit: string) => unit === '%' ? `${v}%` : unit === 'CHWs' ? `+${v} CHWs` : `+RWF ${v}M`;

const SEED_SAVED: Saved[] = [
{ name: 'Sanitation +20% — Western Province', date: 'May 30', params: { type: 'Sanitation Improvement', disease: 'Cholera', geo: 'Western Province', target: 75, months: 6, baseline: 'none' } },
{ name: '500 CHWs — Southern Province', date: 'May 25', params: { type: 'CHW Deployment', disease: 'Malaria', geo: 'Southern Province', target: 500, months: 12, baseline: 'trajectory' } },
{ name: 'Bednets to 90% — Kayonza', date: 'May 20', params: { type: 'Bednet Distribution', disease: 'Malaria', geo: 'Kayonza District', target: 90, months: 6, baseline: 'none' } },
{ name: 'Water treatment — Rusizi', date: 'May 14', params: { type: 'Water Treatment', disease: 'Cholera', geo: 'Rusizi District', target: 80, months: 3, baseline: 'none' } }];


export function AnalystScenarios() {
  const { actions } = useApp();
  const initial: Params = { type: 'Vaccination Coverage Increase', disease: 'Measles', geo: 'Kayonza District', target: 98, months: 6, baseline: 'none' };
  const [p, setP] = useState<Params>(initial);
  const [applied, setApplied] = useState<Params>(initial);
  const [generatedAt, setGeneratedAt] = useState(nowISO());
  const [saved, setSaved] = useState<Saved[]>(SEED_SAVED);
  const [showAll, setShowAll] = useState(false);
  const [shared, setShared] = useState(false);
  const r = useMemo(() => simulate(applied), [applied]);
  const t = TYPES[p.type];
  const at = TYPES[applied.type];
  const dirty = JSON.stringify(p) !== JSON.stringify(applied);
  const label = `${applied.type.replace(' Increase', '')} → ${fmtTarget(applied.target, at.unit)} (${applied.disease}) — ${applied.geo} — ${applied.months} months`;
  const withLabel = `With ${fmtTarget(applied.target, at.unit)} ${at.lever}`;

  const set = (patch: Partial<Params>) => setP((x) => ({ ...x, ...patch }));
  const changeType = (type: string) => {
    const nt = TYPES[type];
    const cur = nt.unit === '%' ? nt.baseline[p.geo] : 0;
    set({ type, disease: nt.diseases[0], target: nt.unit === '%' ? Math.min(100, cur + 15) : Math.round(nt.max / 2) });
  };
  const changeGeo = (geo: string) => {
    const cur = t.unit === '%' ? t.baseline[geo] : 0;
    set({ geo, target: Math.max(p.target, cur) });
  };
  const run = () => {
    setApplied(p);
    setGeneratedAt(nowISO());
    setShared(false);
    const name = `${p.type.split(' ')[0]} ${fmtTarget(p.target, t.unit)} — ${p.geo.replace(' District', '')}`;
    setSaved((s) => [{ name, date: 'Today', params: p }, ...s.filter((x) => x.name !== name)]);
    actions.logAdminEvent('Analytics', 'Ran what-if simulation', name);
  };
  const summary = `${label}: ${r.prevented.toLocaleString()} cases prevented, ~${r.deaths} deaths averted, RWF ${r.costPerCase.toLocaleString()} per case prevented (confidence ${r.confidence}%).`;
  const exportHtml = () => {
    const rows = r.data.map((d) => `<tr><td>${d.month}</td><td>${d.noInt}</td><td>${d.withInt}</td></tr>`).join('');
    downloadFile(
      'what-if-scenario.html',
      `<!doctype html><html><head><meta charset="utf-8"><title>What-if scenario</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;color:#1A1A2E}h1{color:#104E49}td,th{border:1px solid #E5E7EB;padding:6px 10px}table{border-collapse:collapse}</style></head><body><h1>Simulation Result</h1><p>${label}</p><p>${summary}</p><table><tr><th>Month</th><th>No intervention</th><th>${withLabel}</th></tr>${rows}</table><p style="color:#6B7280;font-size:12px">Generated ${fmtDate(generatedAt)} by the AI Vital prototype. Illustrative model — not a validated forecast.</p></body></html>`,
      'text/html'
    );
  };
  const selectCls = 'w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi';

  return (
    <AnalystLayout
      title="What-If Scenario Analysis"
      subtitle="Simulate the impact of policy and health interventions before deploying resources"
      breadcrumb="What-If Scenarios">

      <div className="grid grid-cols-1 lg:grid-cols-[35%_minmax(0,1fr)] gap-6">
        {/* Left - Builder */}
        <div className="bg-white rounded-lg shadow-card border border-border p-5 h-fit flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-5">
            Build a Scenario
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 1 — Select intervention type:
              </label>
              <select value={p.type} onChange={(e) => changeType(e.target.value)} className="w-full h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                {Object.keys(TYPES).map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>

            <div className="bg-epi-bg border border-border rounded-lg p-4 space-y-4">
              <label className="block text-[13px] font-bold text-epi-text">
                Step 2 — Set parameters:
              </label>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">Disease target:</div>
                <select value={p.disease} onChange={(e) => set({ disease: e.target.value })} className={selectCls}>
                  {t.diseases.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">Geography:</div>
                <select value={p.geo} onChange={(e) => changeGeo(e.target.value)} className={selectCls}>
                  {GEOS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">Current {t.lever}:</div>
                <input
                  type="text"
                  value={t.unit === '%' ? `${t.baseline[p.geo]}%` : t.unit === 'CHWs' ? `${t.baseline[p.geo]} CHWs` : `RWF ${t.baseline[p.geo]}M / year`}
                  disabled
                  className="w-full h-9 px-3 bg-epi-bg border border-border rounded-md text-[13px] text-epi-muted cursor-not-allowed" />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-epi-muted mb-1">
                  <span>Proposed {t.unit === '%' ? t.lever : t.unit === 'CHWs' ? 'additional CHWs' : 'additional budget'}:</span>
                  <span className="font-bold text-epi-text">{fmtTarget(p.target, t.unit)}</span>
                </div>
                <input
                  type="range"
                  min={t.unit === '%' ? t.baseline[p.geo] : 0}
                  max={t.max}
                  step={t.unit === '%' ? 1 : 10}
                  value={p.target}
                  onChange={(e) => set({ target: Number(e.target.value) })}
                  className="w-full accent-epi" />
              </div>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">Timeline:</div>
                <select value={p.months} onChange={(e) => set({ months: Number(e.target.value) })} className={selectCls}>
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 3 — Comparison baseline:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="base" checked={p.baseline === 'trajectory'} onChange={() => set({ baseline: 'trajectory' })} className="accent-epi" /> Compare to current trajectory
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="base" checked={p.baseline === 'none'} onChange={() => set({ baseline: 'none' })} className="accent-epi" /> Compare to no intervention
                </label>
              </div>
            </div>

            <button onClick={run} className={`w-full h-11 text-white text-[14px] font-bold rounded-md ${dirty ? 'bg-epi-accent hover:bg-epi-accent/90' : 'bg-epi hover:bg-epi-hover'}`}>
              {dirty ? 'Run Simulation (parameters changed)' : 'Run Simulation'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-[13px] font-bold text-epi-text mb-3">Saved scenarios</h3>
            <div className="space-y-2 text-[12px]">
              {(showAll ? saved : saved.slice(0, 3)).map((s) =>
              <button
                key={s.name}
                onClick={() => {
                  setP(s.params);
                  setApplied(s.params);
                  setGeneratedAt(nowISO());
                }}
                className={`w-full text-left flex justify-between items-center py-1.5 border-b border-border hover:bg-epi-bg px-2 -mx-2 rounded ${JSON.stringify(s.params) === JSON.stringify(applied) ? 'bg-epi/5' : ''}`}>

                  <span className="text-epi-text font-medium">{s.name}</span>
                  <span className="text-epi-muted shrink-0 ml-2">{s.date}</span>
                </button>
              )}
            </div>
            {saved.length > 3 &&
            <button onClick={() => setShowAll(!showAll)} className="text-[12px] font-bold text-epi hover:underline mt-3">
                {showAll ? 'Show fewer ↑' : `View all scenarios (${saved.length}) →`}
              </button>
            }
          </div>
        </div>

        {/* Right - Results */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col min-w-0">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-epi-text">Simulation Result: {label}</h2>
            <p className="text-[13px] text-epi-muted">Generated: {fmtDateTime(generatedAt)} · Illustrative model (simulated)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-epi-accent/10 border border-epi-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-epi-accent mb-2">
                <ShieldCheck className="w-4 h-4" /> Cases Prevented
              </div>
              <div className="text-[20px] font-bold text-epi-text mb-1">
                {r.prevented.toLocaleString()} {applied.disease.toLowerCase()} cases prevented
              </div>
              <div className="text-[11px] text-epi-muted">Over {applied.months}-month simulation period</div>
            </div>
            <div className="bg-epi-accent/10 border border-epi-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-epi-accent mb-2">
                <Heart className="w-4 h-4" /> Deaths Prevented
              </div>
              <div className="text-[20px] font-bold text-epi-text mb-1">Est. {r.deaths} deaths prevented</div>
              <div className="text-[11px] text-epi-muted">Based on CFR of {(CFR[applied.disease] * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-epi/10 border border-epi/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-epi mb-2">
                <TrendingUp className="w-4 h-4" /> Cost-Effectiveness
              </div>
              <div className="text-[20px] font-bold text-epi-text mb-1">
                {r.prevented ? `RWF ${r.costPerCase.toLocaleString()} per case prevented` : 'No change modelled'}
              </div>
              <div className="text-[11px] text-epi-muted">
                {r.prevented ? `~$${(r.costPerCase / 1100).toFixed(2)} USD | ${r.costPerCase < 20000 ? 'High' : r.costPerCase < 100000 ? 'Moderate' : 'Low'} value intervention` : 'Increase the proposed level to see impact'}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-epi-text mb-4 text-center">
              Projected {applied.disease} Cases — {applied.geo} — next {applied.months} months
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={r.data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 13, paddingTop: 20 }} />
                  <Line type="monotone" dataKey="noInt" name={applied.baseline === 'none' ? 'No intervention' : 'Current trajectory'} stroke="#D32F2F" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="withInt" name={withLabel} stroke="#00A550" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-epi-bg border border-border rounded-lg p-4 mb-6 text-[12px] text-epi-muted leading-relaxed">
            <span className="font-bold text-epi-text">Simulation confidence: {r.confidence}%</span>{' '}
            | Deterministic demonstration model: intervention efficacy {Math.round(at.efficacy * 100)}% at full scale-up, effect ramps up over the first 40% of the period |
            Assumptions: uniform distribution, no outbreak events, supply chain uninterrupted
          </div>

          <div className="flex flex-wrap gap-3 mt-auto">
            <button
              onClick={() => actions.addFinding({ source: 'What-If Scenarios', title: label, detail: summary })}
              className="h-10 px-6 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
              Add to Report
            </button>
            <button onClick={exportHtml} className="h-10 px-6 bg-white border border-border hover:bg-epi-bg text-epi-text text-[13px] font-bold rounded-md">
              Export (printable HTML)
            </button>
            <button
              disabled={shared}
              onClick={() => {
                actions.sendNotification(
                  { title: 'What-if scenario shared', body: summary, severity: 'info', roles: ['epi', 'analyst'], link: '/analyst/scenarios' },
                  { module: 'Analytics', action: 'Shared what-if scenario' }
                );
                setShared(true);
                actions.toast('Scenario shared with the Epidemiology and Analytics teams.');
              }}
              className="h-10 px-6 bg-white border border-border hover:bg-epi-bg text-epi-text text-[13px] font-bold rounded-md disabled:opacity-60">
              {shared ? '✓ Shared with team' : 'Share with team'}
            </button>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}
