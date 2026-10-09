import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell } from
'recharts';
import { BarChart3 } from 'lucide-react';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import { useApp, useCurrentUser } from '../../store/AppStore';
import { downloadFile, toCSV } from '../../lib/format';
type VarKey = 'cholera' | 'malaria' | 'diarrheal' | 'measles' | 'wash' | 'rainfall' | 'poverty' | 'distance' | 'vaccination';
const VARS: Record<VarKey, {label: string;unit: string;}> = {
  cholera: { label: 'Cholera Cases', unit: 'cases/wk' },
  malaria: { label: 'Malaria Cases', unit: 'cases/wk' },
  diarrheal: { label: 'Diarrheal Cases', unit: 'cases/wk' },
  measles: { label: 'Measles Cases', unit: 'cases' },
  wash: { label: 'WASH Coverage (%)', unit: '%' },
  rainfall: { label: 'Rainfall (mm/month)', unit: 'mm' },
  poverty: { label: 'Poverty Rate (Ubudehe 1–2, %)', unit: '%' },
  distance: { label: 'Distance to Facility (km)', unit: 'km' },
  vaccination: { label: 'Vaccination Coverage (%)', unit: '%' }
};
const OUTCOMES: VarKey[] = ['cholera', 'malaria', 'diarrheal', 'measles'];
const FACTORS: VarKey[] = ['wash', 'rainfall', 'poverty', 'distance', 'vaccination'];

// Demonstration dataset — one row per district (2026 weekly averages)
const ROWS: ({name: string;prov: string;} & Record<VarKey, number>)[] = [
{ name: 'Rusizi', prov: 'Western', wash: 41, rainfall: 168, poverty: 39, distance: 7.8, vaccination: 86, cholera: 87, malaria: 412, diarrheal: 96, measles: 3 },
{ name: 'Nyamasheke', prov: 'Western', wash: 48, rainfall: 172, poverty: 41, distance: 8.4, vaccination: 84, cholera: 34, malaria: 388, diarrheal: 74, measles: 4 },
{ name: 'Rutsiro', prov: 'Western', wash: 52, rainfall: 160, poverty: 43, distance: 8.9, vaccination: 82, cholera: 28, malaria: 205, diarrheal: 68, measles: 6 },
{ name: 'Karongi', prov: 'Western', wash: 55, rainfall: 150, poverty: 36, distance: 7.1, vaccination: 88, cholera: 15, malaria: 241, diarrheal: 55, measles: 2 },
{ name: 'Ngororero', prov: 'Western', wash: 58, rainfall: 142, poverty: 38, distance: 7.6, vaccination: 87, cholera: 12, malaria: 160, diarrheal: 61, measles: 3 },
{ name: 'Rubavu', prov: 'Western', wash: 62, rainfall: 138, poverty: 28, distance: 4.2, vaccination: 91, cholera: 8, malaria: 98, diarrheal: 47, measles: 1 },
{ name: 'Kayonza', prov: 'Eastern', wash: 64, rainfall: 118, poverty: 31, distance: 6.3, vaccination: 89, cholera: 4, malaria: 521, diarrheal: 39, measles: 5 },
{ name: 'Kirehe', prov: 'Eastern', wash: 60, rainfall: 112, poverty: 34, distance: 6.9, vaccination: 85, cholera: 5, malaria: 486, diarrheal: 44, measles: 7 },
{ name: 'Bugesera', prov: 'Eastern', wash: 66, rainfall: 104, poverty: 30, distance: 5.8, vaccination: 90, cholera: 3, malaria: 455, diarrheal: 36, measles: 2 },
{ name: 'Nyagatare', prov: 'Eastern', wash: 63, rainfall: 98, poverty: 29, distance: 7.2, vaccination: 79, cholera: 2, malaria: 398, diarrheal: 41, measles: 11 },
{ name: 'Huye', prov: 'Southern', wash: 75, rainfall: 128, poverty: 27, distance: 3.9, vaccination: 94, cholera: 2, malaria: 214, diarrheal: 33, measles: 1 },
{ name: 'Nyamagabe', prov: 'Southern', wash: 61, rainfall: 155, poverty: 40, distance: 7.9, vaccination: 88, cholera: 6, malaria: 156, diarrheal: 58, measles: 2 },
{ name: 'Gisagara', prov: 'Southern', wash: 67, rainfall: 121, poverty: 37, distance: 6.1, vaccination: 90, cholera: 3, malaria: 287, diarrheal: 42, measles: 1 },
{ name: 'Musanze', prov: 'Northern', wash: 88, rainfall: 146, poverty: 22, distance: 3.1, vaccination: 96, cholera: 0, malaria: 42, diarrheal: 21, measles: 0 },
{ name: 'Gicumbi', prov: 'Northern', wash: 70, rainfall: 133, poverty: 33, distance: 5.4, vaccination: 92, cholera: 1, malaria: 88, diarrheal: 37, measles: 2 },
{ name: 'Nyarugenge', prov: 'Kigali', wash: 87, rainfall: 110, poverty: 14, distance: 1.6, vaccination: 95, cholera: 1, malaria: 61, diarrheal: 19, measles: 0 },
{ name: 'Gasabo', prov: 'Kigali', wash: 91, rainfall: 108, poverty: 12, distance: 1.9, vaccination: 96, cholera: 0, malaria: 74, diarrheal: 17, measles: 0 },
{ name: 'Kicukiro', prov: 'Kigali', wash: 89, rainfall: 106, poverty: 11, distance: 1.7, vaccination: 97, cholera: 0, malaria: 58, diarrheal: 15, measles: 0 }];


function pearson(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n < 3) return { r: 0, slope: 0, intercept: 0 };
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0,sxx = 0,syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  const slope = sxx ? sxy / sxx : 0;
  return { r, slope, intercept: my - slope * mx };
}
const strengthOf = (r: number) => {
  const a = Math.abs(r);
  const s = a >= 0.9 ? 'Very Strong' : a >= 0.7 ? 'Strong' : a >= 0.4 ? 'Moderate' : a >= 0.2 ? 'Weak' : 'No meaningful';
  return `${s} ${r < 0 ? 'Negative' : 'Positive'}`;
};

interface Saved {name: string;r: string;strength: string;by: string;date: string;a?: VarKey;b?: VarKey;}
const SAVED: Saved[] = [
{ name: 'Rainfall vs Malaria (National)', r: '+0.79', strength: 'Strong Positive', by: 'Aline Uwimana', date: 'June 3', a: 'malaria', b: 'rainfall' },
{ name: 'Poverty (Ubudehe) vs Stunting', r: '+0.82', strength: 'Strong Positive', by: 'Jean Paul Habimana', date: 'June 1' },
{ name: 'Vaccination vs Measles Cases', r: '-0.91', strength: 'Very Strong Negative', by: 'Aline Uwimana', date: 'May 28', a: 'measles', b: 'vaccination' },
{ name: 'Distance to Facility vs U5 Mortality', r: '+0.68', strength: 'Moderate Positive', by: 'Celestin Nzeyimana', date: 'May 25' }];


export function AnalystCorrelation() {
  const { state, actions } = useApp();
  const user = useCurrentUser('analyst');
  const [a, setA] = useState<VarKey>('cholera');
  const [b, setB] = useState<VarKey>('wash');
  const [geo, setGeo] = useState('District Level');
  const [time, setTime] = useState('2025–2026');
  const [run, setRun] = useState({ a: 'cholera' as VarKey, b: 'wash' as VarKey, geo: 'District Level', time: '2025–2026' });
  const [saved, setSaved] = useState<Saved[]>(SAVED);
  const dirty = run.a !== a || run.b !== b || run.geo !== geo || run.time !== time;

  const points = useMemo(() => {
    const scale = run.time === '2026 only' ? 1.08 : 1;
    const base = ROWS.map((r) => ({ name: r.name, x: r[run.b], y: Math.round(r[run.a] * scale) }));
    if (run.geo === 'District Level') return base;
    const provs = Array.from(new Set(ROWS.map((r) => r.prov)));
    return provs.map((p) => {
      const rs = ROWS.filter((r) => r.prov === p);
      const avg = (k: VarKey) => rs.reduce((s, r) => s + r[k], 0) / rs.length;
      return { name: p, x: Math.round(avg(run.b) * 10) / 10, y: Math.round(avg(run.a) * scale) };
    });
  }, [run]);
  const { r, slope, intercept } = pearson(points.map((p) => p.x), points.map((p) => p.y));
  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs),maxX = Math.max(...xs);
  const ys = points.map((p) => p.y);
  const maxY = Math.max(...ys);
  const strength = strengthOf(r);
  const negative = r < 0;
  const la = VARS[run.a].label,lb = VARS[run.b].label;
  const rText = `r = ${r >= 0 ? '+' : ''}${r.toFixed(2)}`;
  const colorFor = (y: number) => y >= maxY * 0.5 ? '#D32F2F' : y >= maxY * 0.15 ? '#F59E0B' : '#00A550';
  const median = [...xs].sort((p, q) => p - q)[Math.floor(xs.length / 2)];
  const below = points.filter((p) => p.x < median);
  const above = points.filter((p) => p.x >= median);
  const meanY = (ps: typeof points) => ps.reduce((s, p) => s + p.y, 0) / Math.max(1, ps.length);
  const ratio = meanY(above) && meanY(below) ? Math.max(meanY(below), meanY(above)) / Math.min(meanY(below), meanY(above)) : 0;
  const insights = [
  `As ${lb.replace(/ \(.*\)/, '')} increases by 1 ${VARS[run.b].unit}, ${la.toLowerCase()} ${slope < 0 ? 'decrease' : 'increase'} by about ${Math.abs(slope).toFixed(2)} ${VARS[run.a].unit} per ${run.geo === 'District Level' ? 'district' : 'province'}.`,
  ratio ? `${run.geo === 'District Level' ? 'Districts' : 'Provinces'} ${negative ? 'below' : 'above'} the median ${lb.replace(/ \(.*\)/, '').toLowerCase()} (${median}) have on average ${ratio.toFixed(1)}× ${la.toLowerCase()}.` : 'Too little variation to compare groups.',
  `Based on ${points.length} ${run.geo === 'District Level' ? 'districts' : 'provinces'} with complete data (${run.time}). Correlation does not imply causation.`];


  const runAnalysis = () => {
    setRun({ a, b, geo, time });
    actions.logAdminEvent('Analytics', 'Ran correlation analysis', `${VARS[a].label} vs ${VARS[b].label}`);
  };
  const saveRun = () => {
    const name = `${lb.replace(/ \(.*\)/, '')} vs ${la}`;
    setSaved((p) => [{ name, r: `${r >= 0 ? '+' : ''}${r.toFixed(2)}`, strength, by: user.name, date: 'Today', a: run.a, b: run.b }, ...p.filter((s) => s.name !== name)]);
  };

  return (
    <AnalystLayout
      title="Correlation Analysis"
      subtitle="Discover relationships between health and environmental factors across Rwanda"
      breadcrumb="Correlation Analysis">

      <div className="bg-white rounded-lg shadow-card border border-border p-5 mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Variable A
          </label>
          <select value={a} onChange={(e) => setA(e.target.value as VarKey)} className="w-full h-10 px-3 bg-white border border-border rounded-md text-[14px] font-medium focus:outline-none focus:border-epi">
            {OUTCOMES.map((k) => <option key={k} value={k}>{VARS[k].label}</option>)}
          </select>
        </div>
        <div className="text-[14px] font-bold text-epi-muted pb-2">vs</div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Variable B
          </label>
          <select value={b} onChange={(e) => setB(e.target.value as VarKey)} className="w-full h-10 px-3 bg-white border border-border rounded-md text-[14px] font-medium focus:outline-none focus:border-epi">
            {FACTORS.map((k) => <option key={k} value={k}>{VARS[k].label}</option>)}
          </select>
        </div>
        <div className="hidden sm:block w-[1px] h-10 bg-border mx-2" />
        <div>
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Geography
          </label>
          <select value={geo} onChange={(e) => setGeo(e.target.value)} className="w-40 h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>District Level</option>
            <option>Province Level</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Time
          </label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-32 h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>2025–2026</option>
            <option>2026 only</option>
          </select>
        </div>
        <button onClick={runAnalysis} className={`h-10 px-6 text-white text-[14px] font-bold rounded-md ml-auto ${dirty ? 'bg-epi-accent hover:bg-epi-accent/90' : 'bg-epi hover:bg-epi-hover'}`}>
          {dirty ? 'Run Correlation Analysis •' : 'Run Correlation Analysis'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[55%_45%] gap-6 mb-6">
        {/* Left - Scatter Plot */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 relative min-w-0">
          <h2 className="text-[16px] font-bold text-epi-text mb-6 pr-40">
            {la} vs {lb} — {points.length} {run.geo === 'District Level' ? 'Districts' : 'Provinces'} ({run.time})
          </h2>

          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur border border-border shadow-sm rounded-lg p-3 z-10 text-center">
            <div className="text-[18px] font-bold text-epi-text">{rText}</div>
            <div className={`text-[11px] font-bold ${negative ? 'text-epi-red' : 'text-epi-accent'}`}>
              {strength} Correlation
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={lb}
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  label={{ value: lb, position: 'bottom', fill: '#6B7280', fontSize: 12 }} />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={la}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  label={{ value: la, angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  content={({ payload }) => {
                    const p = payload?.[0]?.payload as {name: string;x: number;y: number;} | undefined;
                    return p ?
                    <div className="bg-white border border-border rounded-md p-2 text-[12px] shadow-sm">
                        <div className="font-bold">{p.name}</div>
                        <div>{lb}: {p.x}</div>
                        <div>{la}: {p.y}</div>
                      </div> :
                    null;
                  }} />
                <Scatter name={run.geo === 'District Level' ? 'Districts' : 'Provinces'} data={points}>
                  {points.map((entry) =>
                  <Cell key={entry.name} fill={colorFor(entry.y)} />
                  )}
                </Scatter>
                <ReferenceLine
                  segment={[
                  { x: minX, y: Math.max(0, intercept + slope * minX) },
                  { x: maxX, y: Math.max(0, intercept + slope * maxX) }]
                  }
                  stroke={negative ? '#D32F2F' : '#00A550'}
                  strokeWidth={2}
                  ifOverflow="extendDomain" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right - Results */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <div className="text-[36px] font-bold text-epi-text leading-none mb-1">
              {rText}
            </div>
            <div className={`text-[14px] font-bold mb-4 ${negative ? 'text-epi-red' : 'text-epi-accent'}`}>
              {strength} Correlation
            </div>
            <p className="text-[13px] text-epi-text leading-relaxed mb-6">{insights[0]} R² = {(r * r).toFixed(2)}.</p>

            <div className="mb-2">
              <div className="h-2 bg-gradient-to-r from-epi-red via-epi-bg to-epi-accent rounded-full relative">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 rounded-full shadow-sm ${negative ? 'border-epi-red' : 'border-epi-accent'}`}
                  style={{ left: `${(r + 1) / 2 * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-epi-muted mt-2">
                <span>-1.0 (Strong Negative)</span>
                <span>0 (None)</span>
                <span>+1.0 (Strong Positive)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h3 className="text-[15px] font-bold text-epi-text mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              What This Means for Rwanda:
            </h3>
            <ul className="space-y-3 text-[13px] text-epi-text mb-6">
              {insights.slice(1).map((t) =>
              <li key={t} className="flex items-start gap-2">
                  <span className="text-epi mt-0.5">•</span> {t}
                </li>
              )}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  saveRun();
                  actions.addFinding({ source: 'Correlation Analysis', title: `${la} vs ${lb}: ${rText} (${strength})`, detail: insights.join(' ') });
                }}
                className="flex-1 h-10 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
                Add to Report{state.analystFindings.length ? ` (${state.analystFindings.length})` : ''}
              </button>
              <button
                onClick={() => {
                  downloadFile(`correlation-${run.a}-vs-${run.b}.csv`, toCSV(points.map((p) => ({ area: p.name, [run.b]: p.x, [run.a]: p.y }))), 'text/csv');
                  saveRun();
                }}
                className="flex-1 h-10 bg-white border border-border hover:bg-epi-bg text-epi-text text-[13px] font-bold rounded-md">
                Export Data (CSV)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Recent Correlation Analyses
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Analysis Name</th>
                <th className="px-4 py-3">r Score</th>
                <th className="px-4 py-3">Strength</th>
                <th className="px-4 py-3">Run By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {saved.map((row) =>
              <tr key={row.name} className="hover:bg-epi-bg/30">
                  <td className="px-4 py-3 font-bold text-epi-text">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 font-bold text-epi-text">{row.r}</td>
                  <td
                  className={`px-4 py-3 font-medium ${row.strength.includes('Negative') ? 'text-epi-red' : 'text-epi-accent'}`}>

                    {row.strength}
                  </td>
                  <td className="px-4 py-3 text-epi-muted">{row.by}</td>
                  <td className="px-4 py-3 text-epi-muted">{row.date}</td>
                  <td className="px-4 py-3 text-right">
                    {row.a && row.b ?
                  <button
                    onClick={() => {
                      setA(row.a!);
                      setB(row.b!);
                      setRun({ a: row.a!, b: row.b!, geo, time });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[12px] font-bold text-epi hover:underline">
                      View
                    </button> :

                  <span className="text-[12px] text-epi-muted" title="Variables not available in the demo dataset">Archived</span>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnalystLayout>);

}
