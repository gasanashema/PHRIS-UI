import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  ScatterChart as ReScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import {
  LineChart as LineIcon,
  BarChart2,
  PieChart,
  ScatterChart } from
'lucide-react';
import { useApp } from '../../store/AppStore';
import { downloadFile, fmtDateTime, nowISO, toCSV } from '../../lib/format';
type What = 'Disease / Condition' | 'Health Indicator' | 'Program Coverage' | 'Environmental Factor';
const SUBJECTS: Record<What, {name: string;unit: string;base: number;threshold?: number;rate?: boolean;}[]> = {
  'Disease / Condition': [
  { name: 'Malaria', unit: 'cases', base: 300, threshold: 300 },
  { name: 'Cholera', unit: 'cases', base: 18, threshold: 30 },
  { name: 'Diarrheal disease', unit: 'cases', base: 120 },
  { name: 'Measles', unit: 'cases', base: 6, threshold: 10 }],
  'Health Indicator': [
  { name: 'Stunting prevalence', unit: '%', base: 33, rate: true },
  { name: 'Under-5 mortality', unit: 'per 1,000', base: 45, rate: true }],
  'Program Coverage': [
  { name: 'Measles vaccination (MR1)', unit: '%', base: 92, rate: true },
  { name: 'Bednet coverage', unit: '%', base: 71, rate: true }],
  'Environmental Factor': [
  { name: 'Rainfall', unit: 'mm', base: 120 },
  { name: 'Temperature', unit: '°C', base: 21, rate: true }]
};
const SEASON = [0.45, 0.55, 0.8, 1.35, 1.25, 0.95, 0.7, 0.6, 0.65, 0.9, 1.05, 0.75];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const RANGES = ['Last Week', 'Last Month', 'Last 3 Months', 'Last Year', 'Last 2 Years', 'Custom'];
const PROVINCES: Record<string, number> = { 'Eastern Province': 1.4, 'Western Province': 1.2, 'Southern Province': 1.0, 'Northern Province': 0.6, 'Kigali City': 0.5 };
const DISTRICT_FACTORS: Record<string, number> = { Kayonza: 1.6, Kirehe: 1.5, Bugesera: 1.4, Rusizi: 1.3, Huye: 1.0, Nyamagabe: 0.9, Musanze: 0.5, Gasabo: 0.4 };
const AGE: Record<string, number> = { 'All ages': 1, 'Under 5': 0.38, '5–14': 0.22, '15–49': 0.33, '50+': 0.07 };
const GENDER: Record<string, number> = { All: 1, Female: 0.52, Male: 0.48 };
const PIE_COLORS = ['#104E49', '#F59E0B', '#D32F2F', '#1D72B8', '#00A550', '#9CA3AF', '#7C3AED', '#0EA5E9'];

interface Params {what: What;subject: string;range: string;geoLevel: string;area: string;age: string;gender: string;}

function labelsFor(range: string): {labels: string[];season: number[];} {
  if (range === 'Last Week') return { labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], season: Array(7).fill(0.95 / 4.3 / 7 * 30) };
  if (range === 'Last Month') return { labels: ['W19', 'W20', 'W21', 'W22'], season: [1.2, 1.1, 1.0, 0.95].map((v) => v / 4.3 * 4.3) };
  if (range === 'Last 3 Months') return { labels: ['Mar', 'Apr', 'May'], season: SEASON.slice(2, 5) };
  if (range === 'Last Year') return { labels: [...MONTHS.slice(6), ...MONTHS.slice(0, 6)], season: [...SEASON.slice(6), ...SEASON.slice(0, 6)] };
  return { labels: MONTHS.slice(0, 6), season: SEASON.slice(0, 6) };
}

function build(p: Params) {
  const subj = SUBJECTS[p.what].find((s) => s.name === p.subject) ?? SUBJECTS[p.what][0];
  const geo = p.geoLevel === 'National' ? 5 : p.geoLevel === 'Province' ? PROVINCES[p.area] ?? 1 : DISTRICT_FACTORS[p.area] ?? 1;
  const demo = subj.rate ? 1 : AGE[p.age] * GENDER[p.gender];
  const { labels, season } = labelsFor(p.range);
  const perPoint = p.range === 'Last Week' ? 1 / 30 : p.range === 'Last Month' ? 1 / 4.3 : 1;
  const value = (s: number, k: number) => subj.rate ?
  Math.round((subj.base + (s - 0.9) * subj.base * 0.08 * k) * 10) / 10 :
  Math.round(subj.base * s * geo * demo * perPoint * k);
  const rows = labels.map((l, i) => ({ label: l, current: value(season[i], 1), previous: value(season[i], 0.76) }));
  const breakdown = p.geoLevel === 'National' ?
  Object.entries(PROVINCES).map(([n, f]) => ({ name: n.replace(' Province', ''), value: Math.round(subj.base * f * demo * 6) })) :
  Object.entries(DISTRICT_FACTORS).slice(0, 6).map(([n, f]) => ({ name: n, value: Math.round(subj.base * f * demo * 6) }));
  const total = rows.reduce((s, r) => s + r.current, 0);
  const prevTotal = rows.reduce((s, r) => s + r.previous, 0);
  const peak = rows.reduce((m, r) => r.current > m.current ? r : m, rows[0]);
  const trend = prevTotal ? Math.round((total - prevTotal) / prevTotal * 100) : 0;
  const threshold = subj.threshold ? Math.round(subj.threshold * geo * demo * perPoint) : undefined;
  return { subj, rows, breakdown, total, peak, trend, threshold, avg: Math.round(total / rows.length * 10) / 10 };
}

export function AnalystExplore() {
  const { actions } = useApp();
  const [chartType, setChartType] = useState('line');
  const [what, setWhat] = useState<What>('Disease / Condition');
  const [subject, setSubject] = useState('Malaria');
  const [range, setRange] = useState('Last 2 Years');
  const [geoLevel, setGeoLevel] = useState('Province');
  const [area, setArea] = useState('Eastern Province');
  const [age, setAge] = useState('Under 5');
  const [gender, setGender] = useState('All');
  const current: Params = { what, subject, range, geoLevel, area, age, gender };
  const [applied, setApplied] = useState<Params>(current);
  const [generatedAt, setGeneratedAt] = useState(nowISO());
  const dirty = JSON.stringify(current) !== JSON.stringify(applied);
  const r = useMemo(() => build(applied), [applied]);
  const rate = !!r.subj.rate;
  const areaLabel = applied.geoLevel === 'National' ? 'Rwanda (National)' : applied.geoLevel === 'District' ? `${applied.area} District` : applied.area;
  const demoLabel = rate ? '' : ` — ${applied.age === 'All ages' ? 'All Ages' : applied.age === 'Under 5' ? 'Children Under 5' : `Age ${applied.age}`}${applied.gender !== 'All' ? ` (${applied.gender})` : ''}`;
  const title = `${r.subj.name}${demoLabel} — ${areaLabel} — ${applied.range}`;
  const curName = applied.range === 'Last 2 Years' ? '2025-2026' : 'Current period';
  const prevName = applied.range === 'Last 2 Years' ? '2024' : 'Previous period';
  const insight = rate ?
  `${r.subj.name} in ${areaLabel} averaged ${r.avg}${r.subj.unit === '%' ? '%' : ` ${r.subj.unit}`} over the selected period (${r.trend >= 0 ? '+' : ''}${r.trend}% vs previous period).` :
  `${r.subj.name}${demoLabel.toLowerCase()} in ${areaLabel} totalled ${r.total.toLocaleString()} ${r.subj.unit}, peaking in ${r.peak.label}. That is ${r.trend >= 0 ? 'up' : 'down'} ${Math.abs(r.trend)}% on the previous period${r.threshold && r.peak.current > r.threshold ? `, and the peak exceeded the alert threshold (${r.threshold})` : ''}.`;
  const highest = [...r.breakdown].sort((x, y) => y.value - x.value)[0];

  const changeWhat = (w: What) => {
    setWhat(w);
    setSubject(SUBJECTS[w][0].name);
  };
  const changeGeo = (g: string) => {
    setGeoLevel(g);
    setArea(g === 'Province' ? 'Eastern Province' : g === 'District' ? 'Kayonza' : 'Rwanda');
  };
  const generate = () => {
    setApplied(current);
    setGeneratedAt(nowISO());
  };
  const exportCsv = () => {
    downloadFile(
      `explore-${applied.subject.replace(/\W+/g, '-').toLowerCase()}.csv`,
      toCSV(r.rows.map((x) => ({ period: x.label, [curName]: x.current, [prevName]: x.previous }))),
      'text/csv'
    );
  };

  const axis = { tick: { fontSize: 12, fill: '#6B7280' }, axisLine: false, tickLine: false };
  const tooltip = <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />;
  const threshold = r.threshold ?
  <ReferenceLine
    y={r.threshold}
    stroke="#D32F2F"
    strokeDasharray="6 4"
    label={{ value: `Threshold (${r.threshold})`, position: 'insideTopLeft', fill: '#D32F2F', fontSize: 11 }} /> :
  null;

  const radio = (name: string, value: string, checked: boolean, onChange: () => void) =>
  <label key={value} className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-epi" /> {value}
    </label>;


  return (
    <AnalystLayout
      title="Data Exploration"
      subtitle="Build any analysis from any combination of Rwanda health data"
      breadcrumb="Data Exploration">

      <div className="grid grid-cols-1 lg:grid-cols-[30%_minmax(0,1fr)] gap-6">
        {/* Left Col - Builder */}
        <div className="bg-white rounded-lg shadow-card border border-border p-5 h-fit">
          <h2 className="text-[16px] font-bold text-epi-text mb-5">
            Build Your Analysis
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 1 — What to analyze:
              </label>
              <div className="space-y-2 mb-3">
                {(Object.keys(SUBJECTS) as What[]).map((w) => radio('what', w, what === w, () => changeWhat(w)))}
              </div>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                {SUBJECTS[what].map((s) => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 2 — Time Range:
              </label>
              <div className="flex flex-wrap gap-2">
                {RANGES.map((t) =>
                <button
                  key={t}
                  onClick={() => setRange(t)}
                  title={t === 'Custom' ? 'Custom range uses Jan–Jun 2026 in this prototype' : undefined}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${t === range ? 'bg-epi text-white border-epi' : 'bg-epi-bg text-epi-muted border-border hover:border-epi'}`}>

                    {t}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 3 — Geography:
              </label>
              <div className="flex gap-4 mb-3">
                {['National', 'Province', 'District'].map((g) => radio('geo', g, geoLevel === g, () => changeGeo(g)))}
              </div>
              <select
                value={area}
                disabled={geoLevel === 'National'}
                onChange={(e) => setArea(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi disabled:bg-epi-bg disabled:text-epi-muted">

                {geoLevel === 'National' && <option>Rwanda</option>}
                {geoLevel === 'Province' && Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
                {geoLevel === 'District' && Object.keys(DISTRICT_FACTORS).map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 4 — Demographic Filter:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-epi-muted mb-1">
                    Age group:
                  </div>
                  <select value={age} onChange={(e) => setAge(e.target.value)} disabled={!!SUBJECTS[what].find((s) => s.name === subject)?.rate} className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi disabled:bg-epi-bg">
                    {Object.keys(AGE).map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-[11px] text-epi-muted mb-1">Gender:</div>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={!!SUBJECTS[what].find((s) => s.name === subject)?.rate} className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi disabled:bg-epi-bg">
                    {Object.keys(GENDER).map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 5 — Chart Type:
              </label>
              <div className="flex gap-3">
                {([['line', LineIcon, 'Line'], ['bar', BarChart2, 'Bar'], ['pie', PieChart, 'Breakdown (pie)'], ['scatter', ScatterChart, 'Current vs previous (scatter)']] as const).map(([k, Icon, label]) =>
                <button
                  key={k}
                  aria-label={label}
                  title={label}
                  onClick={() => setChartType(k)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors ${chartType === k ? 'border-epi text-epi bg-epi/5' : 'border-border text-epi-muted hover:border-epi/50'}`}>

                    <Icon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <button onClick={generate} className={`w-full h-10 text-white text-[14px] font-bold rounded-md ${dirty ? 'bg-epi-accent hover:bg-epi-accent/90' : 'bg-epi hover:bg-epi-hover'}`}>
                {dirty ? 'Generate Analysis (filters changed)' : 'Generate Analysis'}
              </button>
              <button onClick={exportCsv} className="w-full h-10 bg-white border border-border hover:bg-epi-bg text-epi-text text-[14px] font-bold rounded-md">
                Export Data (CSV)
              </button>
            </div>
          </div>
        </div>

        {/* Right Col - Results */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[18px] font-bold text-epi-text mb-1">{title}</h2>
              <p className="text-[13px] text-epi-muted">
                AI Vital Data Explorer | Generated {fmtDateTime(generatedAt)} | Demonstration data
              </p>
            </div>
            <button
              onClick={() => actions.addFinding({ source: 'Data Exploration', title, detail: insight })}
              className="h-9 px-4 border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5">
              Add to Report
            </button>
          </div>

          <div className="h-[360px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ?
              <BarChart data={r.rows} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" {...axis} />
                  <YAxis {...axis} />
                  {tooltip}
                  <Legend wrapperStyle={{ fontSize: 13, paddingTop: 20 }} />
                  {threshold}
                  <Bar dataKey="previous" name={prevName} fill="#9CA3AF" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="current" name={curName} fill="#F59E0B" radius={[2, 2, 0, 0]} />
                </BarChart> :
              chartType === 'pie' ?
              <RePieChart>
                  {tooltip}
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Pie data={r.breakdown} dataKey="value" nameKey="name" outerRadius={130} label={(e) => e.name}>
                    {r.breakdown.map((b, i) => <Cell key={b.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </RePieChart> :
              chartType === 'scatter' ?
              <ReScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" dataKey="previous" name={prevName} {...axis} label={{ value: prevName, position: 'bottom', fontSize: 12, fill: '#6B7280' }} />
                  <YAxis type="number" dataKey="current" name={curName} {...axis} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Scatter data={r.rows} fill="#104E49" />
                </ReScatterChart> :

              <LineChart data={r.rows} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" {...axis} />
                  <YAxis {...axis} />
                  {tooltip}
                  <Legend wrapperStyle={{ fontSize: 13, paddingTop: 20 }} />
                  {threshold}
                  <Line type="monotone" dataKey="previous" name={prevName} stroke="#9CA3AF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="current" name={curName} stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              }
            </ResponsiveContainer>
          </div>

          <div className="bg-epi/10 border border-epi/20 rounded-lg p-5 mb-6">
            <div className="text-[14px] text-epi-text leading-relaxed">
              <span className="font-bold text-epi">💡 Analysis summary:</span> {insight}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            <div>
              <span className="text-epi-muted">{rate ? 'Average (period):' : 'Total (period):'}</span>{' '}
              <span className="font-bold text-epi-text">{rate ? r.avg : r.total.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-epi-muted">Peak:</span>{' '}
              <span className="font-bold text-epi-text">{r.peak.label}</span>
            </div>
            <div>
              <span className="text-epi-muted">Highest {applied.geoLevel === 'National' ? 'province' : 'district'}:</span>{' '}
              <span className="font-bold text-epi-text">{highest?.name}</span>
            </div>
            <div>
              <span className="text-epi-muted">Trend:</span>{' '}
              <span className={`font-bold ${r.trend >= 0 ? 'text-epi-amber' : 'text-epi-accent'}`}>{r.trend >= 0 ? '↑ +' : '↓ '}{r.trend}% vs previous</span>
            </div>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}
