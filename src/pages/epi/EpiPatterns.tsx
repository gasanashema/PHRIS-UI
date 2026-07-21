import React, { Children } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import { EpiLayout } from '../../components/epi/EpiLayout';
const ageData = [
{
  age: 'Under 5',
  pct: 38,
  color: '#D32F2F'
},
{
  age: '5–14',
  pct: 22,
  color: '#F59E0B'
},
{
  age: '15–24',
  pct: 15,
  color: '#1D72B8'
},
{
  age: '25–49',
  pct: 18,
  color: '#1D72B8'
},
{
  age: '50+',
  pct: 7,
  color: '#1D72B8'
}];

const yoyData = [
{
  month: 'Jan',
  '2024': 120,
  '2025': 110,
  '2026': 115
},
{
  month: 'Feb',
  '2024': 130,
  '2025': 125,
  '2026': 135
},
{
  month: 'Mar',
  '2024': 180,
  '2025': 160,
  '2026': 175
},
{
  month: 'Apr',
  '2024': 250,
  '2025': 210,
  '2026': 235
},
{
  month: 'May',
  '2024': 310,
  '2025': 260,
  '2026': 285
},
{
  month: 'Jun',
  '2024': 280,
  '2025': 230,
  '2026': 250
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

const seasonal = [
{
  prov: 'Eastern',
  levels: [1, 1, 2, 3, 2, 1, 1, 1, 1, 2, 2, 1]
},
{
  prov: 'Southern',
  levels: [1, 1, 1, 2, 3, 2, 1, 1, 1, 1, 2, 1]
},
{
  prov: 'Western',
  levels: [1, 1, 2, 3, 3, 2, 1, 1, 1, 2, 2, 1]
},
{
  prov: 'Northern',
  levels: [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1]
}];

const levelColor = (l: number) =>
l === 3 ? 'bg-epi-red' : l === 2 ? 'bg-epi-amber' : 'bg-epi-accent/30';
export function EpiPatterns() {
  return (
    <EpiLayout
      title="Disease Pattern Analysis"
      subtitle="Seasonal, geographic, and demographic disease patterns across Rwanda — 2024–2026"
      breadcrumb="Pattern Analysis">
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">
            Disease:
          </span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Malaria</option>
            <option>Cholera</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">
            Time range:
          </span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>2024–2026</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">
            Geography:
          </span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>All Provinces</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">
            Age group:
          </span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>All Ages</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Panel 1 */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">
            Seasonal Disease Calendar — Malaria
          </h3>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-[80px_repeat(12,1fr)] gap-0.5 items-center mb-1">
              <span />
              {months.map((m, i) =>
              <span
                key={i}
                className={`text-[9px] text-center font-medium ${i === 5 ? 'text-epi font-bold' : 'text-epi-muted'}`}>
                
                  {m[0]}
                </span>
              )}
            </div>
            {seasonal.map((row, i) =>
            <div
              key={i}
              className="grid grid-cols-[80px_repeat(12,1fr)] gap-0.5 items-center">
              
                <span className="text-[11px] font-medium text-epi-text">
                  {row.prov}
                </span>
                {row.levels.map((l, j) =>
              <div
                key={j}
                className={`h-6 rounded-sm ${levelColor(l)} ${j === 5 ? 'ring-2 ring-epi ring-offset-1' : ''}`} />

              )}
              </div>
            )}
            <div className="text-[11px] font-bold text-epi mt-2">
              📍 June — End of peak season. Cases declining but remain elevated.
            </div>
          </div>
          <div className="mt-auto bg-epi/10 border border-epi/20 p-3 rounded-md text-[12px] text-epi-text font-medium">
            Pre-emptive spray campaigns should begin in Eastern Province in
            March, Southern Province in April, based on 3-year pattern data.
          </div>
        </div>

        {/* Panel 2 */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">
            High-Risk Districts — Consistent 3-Year Pattern
          </h3>
          <div className="flex-1 bg-epi-bg rounded-lg border border-border flex items-center justify-center mb-4 relative overflow-hidden min-h-[200px]">
            <div className="text-[13px] text-epi-muted">
              [Rwanda Map Visualization]
            </div>
            <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] font-medium bg-white/90 p-2 rounded shadow-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-epi-red rounded-sm" /> Consistently
                high risk
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-epi-amber rounded-sm" /> Seasonal
                high
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-epi-bg border border-border rounded-sm" />{' '}
                Normal
              </span>
            </div>
          </div>
          <div className="mt-auto bg-epi-bg border border-border p-3 rounded-md text-[12px] text-epi-text font-medium">
            5 districts show persistent malaria burden above national average
            regardless of season: Kayonza, Bugesera, Kirehe, Huye, Rusizi.
          </div>
        </div>

        {/* Panel 3 */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">
            Age Groups Most Affected — Malaria (National)
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-4 mb-4">
            {ageData.map((d) =>
            <div key={d.age} className="flex items-center gap-3">
                <div className="w-16 text-[12px] font-bold text-epi-text text-right">
                  {d.age}
                </div>
                <div className="flex-1 h-6 bg-epi-bg rounded-r-md overflow-hidden flex items-center">
                  <div
                  className="h-full flex items-center px-2 text-[11px] font-bold text-white"
                  style={{
                    width: `${d.pct}%`,
                    backgroundColor: d.color
                  }}>
                  
                    {d.pct}%
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto bg-epi-amber/10 border border-epi-amber/30 p-3 rounded-md text-[12px] text-epi-text font-medium">
            Children under 5 account for 38% of all malaria cases. Targeted
            bednet distribution to households with under-5 children would have
            highest impact.
          </div>
        </div>

        {/* Panel 4 */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">
            Rwanda Malaria Cases — 3-Year Comparison
          </h3>
          <div className="h-[200px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yoyData}
                margin={{
                  top: 10,
                  right: 0,
                  left: -20,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB" />
                
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: '#6B7280'
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: '#6B7280'
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <Tooltip
                  cursor={{
                    fill: '#F4F6F9'
                  }}
                  contentStyle={{
                    borderRadius: 8,
                    fontSize: 12
                  }} />
                
                <Legend
                  wrapperStyle={{
                    fontSize: 11
                  }} />
                
                <Bar dataKey="2024" fill="#9CA3AF" radius={[2, 2, 0, 0]} />
                <Bar dataKey="2025" fill="#104E49" radius={[2, 2, 0, 0]} />
                <Bar dataKey="2026" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto bg-epi-bg border border-border p-3 rounded-md text-[12px] text-epi-text font-medium">
            2026 malaria season tracking 7% above 2025 baseline. If trend
            continues, June 2026 may exceed 2024 peak.
          </div>
        </div>
      </div>
    </EpiLayout>);

}