import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  BarChart,
  Bar } from
'recharts';
import { DhoLayout } from '../../components/dho/DhoLayout';
const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
const trendData = weeks.map((w, i) => ({
  week: w,
  Malaria: [42, 48, 51, 55, 60, 66, 71, 78, 87, 82][i],
  Diarrhea: [28, 31, 26, 33, 29, 35, 30, 32, 28, 31][i],
  Cholera: [2, 3, 1, 2, 4, 3, 2, 9, 21, 38][i],
  Measles: [12, 10, 13, 11, 14, 12, 13, 15, 13, 14][i],
  Respiratory: [9, 11, 10, 12, 9, 10, 11, 9, 10, 10][i]
}));
const lineColors = {
  Malaria: '#F59E0B',
  Diarrhea: '#1D72B8',
  Cholera: '#D32F2F',
  Measles: '#7C3AED',
  Respiratory: '#9CA3AF'
};
const ranking = [
{
  name: 'Malaria',
  cases: 87,
  trend: '↑ +18%',
  color: '#F59E0B',
  tColor: 'text-admin-amber'
},
{
  name: 'Cholera',
  cases: 38,
  trend: '↑ +340% 🔴',
  color: '#D32F2F',
  tColor: 'text-admin-red'
},
{
  name: 'Diarrheal Disease',
  cases: 31,
  trend: '→ stable',
  color: '#1D72B8',
  tColor: 'text-admin-muted'
},
{
  name: 'Measles',
  cases: 14,
  trend: '↓ -5%',
  color: '#7C3AED',
  tColor: 'text-admin-accent'
},
{
  name: 'Respiratory',
  cases: 10,
  trend: '→ stable',
  color: '#9CA3AF',
  tColor: 'text-admin-muted'
}];

const wow = [
{
  name: 'Malaria',
  thisWeek: 87,
  lastWeek: 74
},
{
  name: 'Cholera',
  thisWeek: 38,
  lastWeek: 9
},
{
  name: 'Diarrhea',
  thisWeek: 31,
  lastWeek: 30
},
{
  name: 'Measles',
  thisWeek: 14,
  lastWeek: 15
},
{
  name: 'Respiratory',
  thisWeek: 10,
  lastWeek: 11
}];

const months = [
'Jan',
'Feb',
'Mar',
'Apr',
'May',
'Jun',
'Jul',
'Aug',
'Sep',
'Oct',
'Nov',
'Dec'];

// risk: 3 high, 2 medium, 1 low
const seasonal = [
{
  disease: 'Malaria',
  levels: [1, 1, 3, 3, 3, 2, 1, 1, 1, 2, 2, 1]
},
{
  disease: 'Cholera',
  levels: [1, 1, 3, 3, 3, 2, 1, 1, 1, 2, 2, 1]
},
{
  disease: 'Diarrhea',
  levels: [1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1]
},
{
  disease: 'Measles',
  levels: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1]
}];

// Monthly totals (Jul 2025 – Jun 2026) for the 12-month view
const monthlyData = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({
  week: m,
  Malaria: [150, 132, 140, 190, 240, 210, 168, 150, 230, 262, 290, 250][i],
  Diarrheal: [118, 110, 112, 126, 134, 128, 116, 108, 124, 128, 132, 121][i],
  Diarrhea: [118, 110, 112, 126, 134, 128, 116, 108, 124, 128, 132, 121][i],
  Cholera: [4, 3, 2, 6, 9, 5, 3, 2, 8, 9, 12, 70][i],
  Measles: [40, 44, 38, 42, 46, 50, 48, 44, 46, 50, 52, 55][i],
  Respiratory: [44, 48, 52, 46, 40, 38, 42, 46, 40, 38, 40, 40][i]
}));

const DISEASE_KEY: Record<string, string | null> = {
  'All Diseases': null,
  Cholera: 'Cholera',
  Malaria: 'Malaria',
  Measles: 'Measles',
  Diarrhea: 'Diarrhea',
  Respiratory: 'Respiratory',
  Typhoid: 'Typhoid'
};

const levelColor = (l: number) =>
l === 3 ? 'bg-admin-red' : l === 2 ? 'bg-admin-amber' : 'bg-admin-accent/40';
export function DhoTrends() {
  const [range, setRange] = useState('4w');
  const [disease, setDisease] = useState('All Diseases');
  const key = DISEASE_KEY[disease];
  const visibleData = range === '4w' ? trendData.slice(-4) : range === '3m' ? trendData : monthlyData;
  const lines = Object.entries(lineColors).filter(([k]) => !key || k === key);
  const matches = (name: string) => !key || name.startsWith(key === 'Diarrhea' ? 'Diarrh' : key);
  const rankingRows = ranking.filter((d) => matches(d.name));
  const wowRows = wow.filter((d) => matches(d.name));
  const rangeLabel = range === '4w' ? 'last 4 weeks (May–June 2026)' : range === '3m' ? 'last 10 weeks (April–June 2026)' : 'last 12 months (monthly totals)';
  return (
    <DhoLayout
      title="Disease Trends — Huye District"
      subtitle="Weekly disease progression and seasonal analysis"
      breadcrumb="Disease Trends">
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-admin-muted">
            Time range:
          </span>
          {[
          {
            id: '4w',
            label: 'Last 4 weeks'
          },
          {
            id: '3m',
            label: 'Last 3 months'
          },
          {
            id: '12m',
            label: 'Last 12 months'
          }].
          map((r) =>
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`h-9 px-4 rounded-full text-[13px] font-semibold transition-colors ${range === r.id ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:border-admin'}`}>
            
              {r.label}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-admin-muted">
            Disease:
          </span>
          <select
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            
            <option>All Diseases</option>
            <option>Cholera</option>
            <option>Malaria</option>
            <option>Measles</option>
            <option>Diarrhea</option>
            <option>Respiratory</option>
            <option>Typhoid</option>
          </select>
        </div>
      </div>

      {/* Main trend chart */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-6">
        <h2 className="text-[16px] font-bold text-admin-text mb-1">
          {range === '12m' ? 'Monthly' : 'Weekly'} Case Count — {disease}
        </h2>
        <p className="text-[13px] text-admin-muted mb-4">
          Huye District, {rangeLabel}
        </p>
        {lines.length === 0 &&
        <div className="mb-4 text-[13px] font-medium text-admin-amber bg-admin-amber/10 rounded px-3 py-2">
            No {disease.toLowerCase()} cases recorded in Huye for this period.
          </div>
        }
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visibleData}
              margin={{
                top: 10,
                right: 20,
                left: -10,
                bottom: 0
              }}>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false} />
              
              <ReferenceArea y1={0} y2={45} fill="#9CA3AF" fillOpacity={0.06} />
              <XAxis
                dataKey="week"
                tick={{
                  fontSize: 12,
                  fill: '#6B7280'
                }}
                axisLine={false}
                tickLine={false} />
              
              <YAxis
                domain={[0, 'auto']}
                tick={{
                  fontSize: 12,
                  fill: '#6B7280'
                }}
                axisLine={false}
                tickLine={false} />
              
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8
                }} />
              
              <Legend
                wrapperStyle={{
                  fontSize: 12
                }} />
              
              <ReferenceLine
                y={30}
                stroke="#D32F2F"
                strokeDasharray="6 4"
                label={{
                  value: 'Cholera threshold',
                  fontSize: 10,
                  fill: '#D32F2F',
                  position: 'insideTopRight'
                }} />
              
              <ReferenceLine
                y={50}
                stroke="#F59E0B"
                strokeDasharray="6 4"
                label={{
                  value: 'Malaria threshold',
                  fontSize: 10,
                  fill: '#F59E0B',
                  position: 'insideBottomRight'
                }} />
              
              {lines.map(([lineKey, color]) =>
              <Line
                key={lineKey}
                type="monotone"
                dataKey={lineKey}
                stroke={color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5
                }} />

              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 — three panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h3 className="text-[15px] font-bold text-admin-text mb-4">
            This Week's Case Ranking
          </h3>
          <div className="space-y-4">
            {rankingRows.length === 0 && <div className="text-[13px] text-admin-muted">No cases this week.</div>}
            {rankingRows.map((d, i) =>
            <div key={i}>
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <span className="font-bold text-admin-text">
                    {i + 1}. {d.name}
                  </span>
                  <span className={`font-semibold ${d.tColor}`}>{d.trend}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-admin-bg rounded-full overflow-hidden">
                    <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.cases / 87 * 100}%`,
                      backgroundColor: d.color
                    }} />
                  
                  </div>
                  <span className="text-[13px] font-bold text-admin-text w-10 text-right">
                    {d.cases}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Week-over-week */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h3 className="text-[15px] font-bold text-admin-text mb-4">
            This Week vs Last Week
          </h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wowRows}
                margin={{
                  top: 0,
                  right: 0,
                  left: -20,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false} />
                
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fill: '#6B7280'
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50} />
                
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: '#6B7280'
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8
                  }} />
                
                <Bar
                  dataKey="lastWeek"
                  name="Last Week"
                  fill="#D1D5DB"
                  radius={[3, 3, 0, 0]} />
                
                <Bar
                  dataKey="thisWeek"
                  name="This Week"
                  fill="#D32F2F"
                  radius={[3, 3, 0, 0]} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonal calendar */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h3 className="text-[15px] font-bold text-admin-text mb-4">
            Seasonal Risk Calendar
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-[70px_repeat(12,1fr)] gap-0.5 items-center mb-1">
              <span />
              {months.map((m, i) =>
              <span
                key={i}
                className={`text-[8px] text-center font-medium ${i === 5 ? 'text-admin font-bold' : 'text-admin-muted'}`}>
                
                  {m[0]}
                </span>
              )}
            </div>
            {seasonal.map((row, i) =>
            <div
              key={i}
              className="grid grid-cols-[70px_repeat(12,1fr)] gap-0.5 items-center">
              
                <span className="text-[11px] font-medium text-admin-text">
                  {row.disease}
                </span>
                {row.levels.map((l, j) =>
              <div
                key={j}
                className={`h-4 rounded-sm ${levelColor(l)} ${j === 5 ? 'ring-2 ring-admin ring-offset-1' : ''}`}
                title={`${months[j]}: ${l === 3 ? 'High' : l === 2 ? 'Medium' : 'Low'}`} />

              )}
              </div>
            )}
            <div className="flex items-center gap-1 pt-2">
              <span className="text-[10px] text-admin font-bold">
                📍 Now (June)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-admin-muted mt-4 leading-relaxed bg-admin-amber/10 p-2 rounded-md border border-admin-amber/20">
            June is end of rainy season — cholera and malaria risk remains
            elevated through mid-June.
          </p>
        </div>
      </div>
    </DhoLayout>);

}