import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
  Cell } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';

interface Indicator {
  name: string;
  group: 'Mortality' | 'Disease Burden' | 'Coverage' | 'Nutrition';
  program: string;
  unit: string; // e.g. '/1,000' or '%'
  spark: number[]; // 2022–2026
  target: number;
  lowerIsBetter: boolean;
}

const INDICATORS: Indicator[] = [
{ name: 'Under-5 Mortality Rate', group: 'Mortality', program: 'Maternal & Child Health', unit: '/1,000', spark: [45, 42, 40, 38, 35], target: 25, lowerIsBetter: true },
{ name: 'Maternal Mortality Rate', group: 'Mortality', program: 'Maternal & Child Health', unit: '/100,000', spark: [240, 230, 220, 210, 203], target: 140, lowerIsBetter: true },
{ name: 'Malaria Incidence', group: 'Disease Burden', program: 'Malaria Control', unit: '/1,000', spark: [35, 32, 38, 42, 45], target: 30, lowerIsBetter: true },
{ name: 'Vaccination Coverage', group: 'Coverage', program: 'Immunization (EPI)', unit: '%', spark: [85, 88, 89, 90, 92], target: 95, lowerIsBetter: false },
{ name: 'HIV Treatment Coverage', group: 'Coverage', program: 'HIV/AIDS', unit: '%', spark: [86, 87, 86, 87, 87], target: 95, lowerIsBetter: false },
{ name: 'Child Stunting Rate', group: 'Nutrition', program: 'Nutrition', unit: '%', spark: [34, 34, 33, 33, 33], target: 19, lowerIsBetter: true }];

const YEARS = ['2022', '2023', '2024', '2025', '2026'];
const GEO: Record<string, number> = { National: 1, 'Eastern Province': 1.12, 'Western Province': 1.08, 'Southern Province': 1.1, 'Northern Province': 0.93, 'Kigali City': 0.78 };
const DISTRICTS: [string, number][] = [
['Nyaruguru', 1.37], ['Gisagara', 1.26], ['Nyamagabe', 1.17], ['Kirehe', 1.11], ['Ngoma', 1.06], ['Rusizi', 1.02], ['Huye', 0.95], ['Musanze', 0.82], ['Nyarugenge', 0.69], ['Gasabo', 0.63]];

type Status = 'On Track' | 'Close to Target' | 'Off Track' | 'Critical';
function statusOf(ind: Indicator, value: number): {status: Status;pct: number;} {
  const pct = Math.max(0, Math.min(100, Math.round(ind.lowerIsBetter ? ind.target / value * 100 : value / ind.target * 100)));
  const status: Status = pct >= 100 ? 'On Track' : pct >= 85 ? 'Close to Target' : pct >= 50 ? 'Off Track' : 'Critical';
  return { status, pct };
}
const STATUS_STYLE: Record<Status, {label: string;pill: string;chip: string;}> = {
  'On Track': { label: '🟢 On Track', pill: 'bg-epi-accent text-white', chip: 'bg-epi-accent/10 text-epi-accent border-epi-accent/20' },
  'Close to Target': { label: '🟡 Close to Target', pill: 'bg-[#FEF08A] text-[#A16207]', chip: 'bg-[#FEF08A]/40 text-[#A16207] border-[#FDE047]' },
  'Off Track': { label: '🟠 Off Track', pill: 'bg-epi-amber text-white', chip: 'bg-epi-amber/10 text-epi-amber border-epi-amber/20' },
  Critical: { label: '🔴 Critical — Far from Target', pill: 'bg-epi-red text-white', chip: 'bg-epi-red/10 text-epi-red border-epi-red/20' }
};
const fmtVal = (v: number, unit: string) => unit === '%' ? `${Math.round(v)}%` : `${Math.round(v)}${unit}`;

export function AnalystIndicators() {
  const [group, setGroup] = useState('All');
  const [program, setProgram] = useState('All Programs');
  const [geo, setGeo] = useState('National');
  const [year, setYear] = useState('2026');
  const [selected, setSelected] = useState('Under-5 Mortality Rate');
  const yi = YEARS.indexOf(year);

  const rows = INDICATORS.filter((i) => (group === 'All' || i.group === group) && (program === 'All Programs' || i.program === program)).
  map((ind) => {
    const factor = ind.unit === '%' ? 1 / GEO[geo] ** 0.3 : GEO[geo];
    const series = ind.spark.slice(0, yi + 1).map((v) => Math.round(v * factor * 10) / 10);
    const value = series[series.length - 1];
    const prev = series.length > 1 ? series[series.length - 2] : value;
    const better = ind.lowerIsBetter ? value < prev : value > prev;
    const trend = Math.abs(value - prev) < 0.5 ? '→ Stable' : `${value > prev ? '↑' : '↓'} ${better ? 'Improving' : 'Worsening'}`;
    return { ind, series, value, trend, goodTrend: trend === '→ Stable' ? !statusOf(ind, value).status.includes('Critical') : better, ...statusOf(ind, value) };
  });
  const counts = (s: Status) => rows.filter((r) => r.status === s).length;
  const sel = INDICATORS.find((i) => i.name === selected) ?? INDICATORS[0];
  const national = sel.spark[yi];
  const districtData = DISTRICTS.map(([name, f]) => ({ name, val: Math.round((sel.unit === '%' ? national / f ** 0.3 : national * f) * 10) / 10 })).
  sort((a, b) => b.val - a.val);
  const max = Math.max(...districtData.map((d) => d.val), sel.target) * 1.1;
  const worse = (v: number) => sel.lowerIsBetter ? v > national : v < national;
  const selectCls = 'h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi';

  return (
    <AnalystLayout
      title="Health Indicators Analysis"
      subtitle="Rwanda HSSP + Vision 2050 national health target tracking"
      breadcrumb="Health Indicators">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={selectCls}>
            {['All', 'Mortality', 'Disease Burden', 'Coverage', 'Nutrition'].map((g) => <option key={g} value={g}>Indicator group: {g}</option>)}
          </select>
          <select value={program} onChange={(e) => setProgram(e.target.value)} className={selectCls}>
            {['All Programs', ...Array.from(new Set(INDICATORS.map((i) => i.program)))].map((p) => <option key={p} value={p}>Program: {p}</option>)}
          </select>
          <select value={geo} onChange={(e) => setGeo(e.target.value)} className={selectCls}>
            {Object.keys(GEO).map((g) => <option key={g} value={g}>Geography: {g}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
            {[...YEARS].reverse().map((y) => <option key={y} value={y}>Year: {y}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 text-[12px] font-bold">
          {(['On Track', 'Close to Target', 'Off Track', 'Critical'] as Status[]).map((s) =>
          <span key={s} className={`px-3 py-1.5 rounded-full border ${STATUS_STYLE[s].chip}`}>
              {s === 'Close to Target' ? 'Close' : s}: {counts(s)}
            </span>
          )}
        </div>
      </div>

      {rows.length === 0 &&
      <div className="bg-white rounded-lg shadow-card border border-border p-8 text-center text-[13px] text-epi-muted mb-6">
          No indicators match the selected group and program.
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {rows.map(({ ind, series, value, trend, goodTrend, status, pct }) =>
        <div
          key={ind.name}
          className={`bg-white rounded-lg shadow-card border p-5 flex flex-col ${status === 'Critical' ? 'border-epi-red/40 bg-epi-red/5' : selected === ind.name ? 'border-epi' : 'border-border'}`}>

            <div className="flex items-start justify-between gap-2 mb-4">
              <h3 className="text-[15px] font-bold text-epi-text">
                {ind.name}
              </h3>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[status].pill}`}>
                {STATUS_STYLE[status].label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[32px] font-bold text-epi-text leading-none">
                {fmtVal(value, ind.unit)}
              </span>
              <span className="text-[14px] font-medium text-epi-muted">
                vs target {fmtVal(ind.target, ind.unit)}
              </span>
            </div>

            <div className="h-2 bg-epi-red/20 rounded-full overflow-hidden mb-4 flex">
              <div className="h-full bg-epi rounded-l-full" style={{ width: `${pct}%` }} />
              <div className="h-full bg-epi-red/40" style={{ width: `${100 - pct}%` }} />
            </div>

            <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series.map((v, i) => ({ val: v, i }))}>
                      <Line
                      type="monotone"
                      dataKey="val"
                      stroke={goodTrend ? '#00A550' : '#D32F2F'}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <span className={`text-[13px] font-bold ${trend.includes('Stable') ? 'text-epi-muted' : goodTrend ? 'text-epi-accent' : 'text-epi-red'}`}>
                  {trend}
                </span>
              </div>
              <button
              onClick={() => {
                setSelected(ind.name);
                document.getElementById('indicator-detail')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[13px] font-bold text-epi hover:underline">
                {selected === ind.name ? 'Showing below ↓' : 'View Detail →'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div id="indicator-detail" className="bg-white rounded-lg shadow-card border border-border p-6 scroll-mt-4">
        <h2 className="text-[16px] font-bold text-epi-text mb-4">
          {sel.name} — By District ({year})
        </h2>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={districtData} margin={{ top: 20, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, Math.ceil(max)]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#1A1A2E', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine
                x={national}
                stroke="#104E49"
                strokeDasharray="4 4"
                label={{ value: `National (${national})`, position: 'top', fill: '#104E49', fontSize: 11 }} />
              <ReferenceLine
                x={sel.target}
                stroke="#00A550"
                strokeDasharray="4 4"
                label={{ value: `Target (${sel.target})`, position: 'top', fill: '#00A550', fontSize: 11 }} />
              <Bar dataKey="val" name={sel.name} radius={[0, 4, 4, 0]} barSize={16}>
                {districtData.map((entry) =>
                <Cell key={entry.name} fill={worse(entry.val) ? '#D32F2F' : '#00A550'} />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[12px] text-epi-muted mt-2">District values are demonstration estimates derived from the national figure.</p>
      </div>
    </AnalystLayout>);

}
