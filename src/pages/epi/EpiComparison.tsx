import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine } from
'recharts';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { useApp } from '../../store/AppStore';
import { isOpenStatus } from '../../lib/format';
const DISTRICTS = [
{
  rank: 1,
  dist: 'Kayonza',
  prov: 'Eastern',
  mal: 67,
  chol: 3,
  risk: '🔴 Red',
  rep: '92%',
  score: '84/100',
  alert: '🔴 Active',
  action: 'Investigate'
},
{
  rank: 2,
  dist: 'Rusizi',
  prov: 'Western',
  mal: 23,
  chol: 87,
  risk: '🔴 Red',
  rep: '88%',
  score: '91/100',
  alert: '🔴 Active',
  action: 'Investigate'
},
{
  rank: 3,
  dist: 'Bugesera',
  prov: 'Eastern',
  mal: 58,
  chol: 0,
  risk: '🟠 Orange',
  rep: '95%',
  score: '72/100',
  alert: '🟠 Alert',
  action: 'Monitor'
},
{
  rank: 4,
  dist: 'Huye',
  prov: 'Southern',
  mal: 45,
  chol: 0,
  risk: '🟠 Orange',
  rep: '95%',
  score: '68/100',
  alert: '🟠 Alert',
  action: 'Monitor'
},
{
  rank: 5,
  dist: 'Nyamagabe',
  prov: 'Southern',
  mal: 34,
  chol: 0,
  risk: '🟠 Orange',
  rep: '90%',
  score: '61/100',
  alert: '🟠 Alert',
  action: 'Monitor'
},
{
  rank: 28,
  dist: 'Musanze',
  prov: 'Northern',
  mal: 12,
  chol: 0,
  risk: '🟢 Green',
  rep: '100%',
  score: '18/100',
  alert: '—',
  action: 'Routine'
},
{
  rank: 29,
  dist: 'Rubavu',
  prov: 'Western',
  mal: 15,
  chol: 0,
  risk: '🟡 Yellow',
  rep: '97%',
  score: '35/100',
  alert: '—',
  action: '⚠️ Mpox border watch'
},
{
  rank: 30,
  dist: 'Nyarugenge',
  prov: 'Kigali',
  mal: 8,
  chol: 0,
  risk: '🟢 Green',
  rep: '98%',
  score: '12/100',
  alert: '—',
  action: 'Routine'
}];

const chartData = [
{
  name: 'Kayonza',
  cases: 67
},
{
  name: 'Bugesera',
  cases: 58
},
{
  name: 'Huye',
  cases: 45
},
{
  name: 'Nyamagabe',
  cases: 34
},
{
  name: 'Gatsibo',
  cases: 29
},
{
  name: 'Nyagatare',
  cases: 26
},
{
  name: 'Rusizi',
  cases: 23
},
{
  name: 'Kirehe',
  cases: 21
},
{
  name: 'Gisagara',
  cases: 19
},
{
  name: 'Rubavu',
  cases: 15
}];

type Metric = 'mal' | 'chol' | 'score' | 'rep';
const METRIC_LABEL: Record<Metric, string> = { mal: 'Malaria Cases', chol: 'Cholera Cases', score: 'AI Risk Score', rep: 'Reporting Rate' };
const num = (v: string | number) => typeof v === 'number' ? v : Number(v.replace(/[^0-9.]/g, '').split('/')[0]);

export function EpiComparison() {
  const { state } = useApp();
  const [disease, setDisease] = useState<'Malaria' | 'Cholera'>('Malaria');
  const [metric, setMetric] = useState<Metric>('mal');
  const [time, setTime] = useState('This Week');
  const [sort, setSort] = useState('desc');
  const scale = time === 'This Week' ? 1 : 0.85;

  const rows = [...DISTRICTS].
  map((r) => ({ ...r, mal: Math.round(r.mal * scale), chol: Math.round(r.chol * scale) })).
  sort((a, b) => sort === 'alpha' ? a.dist.localeCompare(b.dist) : (sort === 'desc' ? -1 : 1) * (num(a[metric]) - num(b[metric])));

  const chart = (disease === 'Malaria' ?
  chartData.map((c) => ({ name: c.name, cases: Math.round(c.cases * scale) })) :
  [...DISTRICTS].sort((a, b) => b.chol - a.chol).map((d) => ({ name: d.dist, cases: Math.round(d.chol * scale) }))).
  slice(0, 10);
  const avg = Math.round(chart.reduce((a, c) => a + c.cases, 0) / Math.max(1, chart.length));
  const mapRows = state.districtRisk.filter((r) => disease === 'Malaria' ? r.disease === 'Malaria' : r.disease === 'Cholera');
  const selectCls = 'h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi';

  return (
    <EpiLayout
      title="Cross-District Comparison"
      subtitle="All 30 Rwanda districts — side by side health intelligence"
      breadcrumb="District Comparison">

      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
          Compare by:
          <select value={disease} onChange={(e) => setDisease(e.target.value as 'Malaria' | 'Cholera')} className={selectCls}>
            <option value="Malaria">Disease: Malaria</option>
            <option value="Cholera">Disease: Cholera</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
          Metric:
          <select value={metric} onChange={(e) => setMetric(e.target.value as Metric)} className={selectCls}>
            {(Object.keys(METRIC_LABEL) as Metric[]).map((m) => <option key={m} value={m}>{METRIC_LABEL[m]}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
          Time:
          <select value={time} onChange={(e) => setTime(e.target.value)} className={selectCls}>
            <option>This Week</option>
            <option>Last Week</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
          Sort:
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls}>
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
              <tr>
                {['Rank', 'District', 'Province', 'Malaria Cases', 'Cholera Cases', 'Overall Risk', 'Reporting Rate', 'AI Risk Score', 'Alert', 'Actions'].map((h) =>
                <th key={h} className="px-4 py-3">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, i) => {
                const isRed = row.risk.includes('Red');
                const isOrange = row.risk.includes('Orange');
                const open = state.alerts.find((a) => a.district === row.dist && isOpenStatus(a.status));
                return (
                  <tr key={row.dist} className={`hover:bg-epi-bg/30 ${isRed ? 'bg-epi-red/5' : isOrange ? 'bg-epi-amber/5' : ''}`}>
                    <td className="px-4 py-3 font-bold text-epi-muted">{i + 1}</td>
                    <td className="px-4 py-3 font-bold text-epi-text">{row.dist}</td>
                    <td className="px-4 py-3 text-epi-muted">{row.prov}</td>
                    <td className={`px-4 py-3 text-epi-text ${metric === 'mal' ? 'font-bold' : ''}`}>{row.mal}</td>
                    <td className={`px-4 py-3 text-epi-text ${metric === 'chol' ? 'font-bold' : ''}`}>{row.chol}</td>
                    <td className="px-4 py-3 font-bold whitespace-nowrap">{row.risk}</td>
                    <td className={`px-4 py-3 text-epi-muted ${metric === 'rep' ? 'font-bold text-epi-text' : ''}`}>{row.rep}</td>
                    <td className={`px-4 py-3 ${metric === 'score' ? 'font-bold' : 'font-medium'}`}>{row.score}</td>
                    <td className="px-4 py-3 font-bold whitespace-nowrap">{open ? open.severity === 'red' ? '🔴 Active' : open.severity === 'orange' ? '🟠 Active' : '🟡 Active' : '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {open ?
                      <Link to={`/warning/detail?id=${open.id}`} className={`font-bold text-[12px] hover:underline ${isRed ? 'text-epi-red' : isOrange ? 'text-epi-amber' : 'text-epi'}`}>
                          {row.action}
                        </Link> :

                      <span className="font-bold text-[12px] text-epi-muted">{row.action}</span>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col min-h-[300px]">
          <h3 className="text-[15px] font-bold text-epi-text mb-1">Rwanda Map — {disease} Risk</h3>
          <p className="text-[12px] text-epi-muted mb-4">Districts whose top AI risk is {disease.toLowerCase()} (schematic)</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {mapRows.map((r) =>
            <Link
              key={r.district}
              to={`/warning/history?q=${r.district}`}
              className={`rounded-md p-2 text-[12px] font-bold ${r.score >= 80 ? 'bg-epi-red text-white' : r.score >= 60 ? 'bg-[#F97316] text-white' : r.score >= 40 ? 'bg-epi-amber text-white' : 'bg-[#00A550]/40 text-epi-text'}`}>

                {r.district}
                <div className="text-[16px]">{r.score}</div>
              </Link>
            )}
            {mapRows.length === 0 && <div className="col-span-4 text-[13px] text-epi-muted">No districts list {disease.toLowerCase()} as their top risk.</div>}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">Top 10 Districts by {disease} Cases ({time})</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chart} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#1A1A2E', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <ReferenceLine x={avg} stroke="#104E49" strokeDasharray="4 4" label={{ value: 'Top-10 Avg', position: 'top', fill: '#104E49', fontSize: 10 }} />
                <Bar dataKey="cases" fill={disease === 'Malaria' ? '#F59E0B' : '#D32F2F'} radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </EpiLayout>);

}
