import React from 'react';
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

export function EpiComparison() {
  return (
    <EpiLayout
      title="Cross-District Comparison"
      subtitle="All 30 Rwanda districts — side by side health intelligence"
      breadcrumb="District Comparison">
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">
            Compare by:
          </span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Disease: Malaria</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">
            Metric:
          </span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Cases This Week</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">Time:</span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>This Week</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-epi-muted">Sort:</span>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Highest First</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Province</th>
                <th className="px-4 py-3">Malaria Cases</th>
                <th className="px-4 py-3">Cholera Cases</th>
                <th className="px-4 py-3">Overall Risk</th>
                <th className="px-4 py-3">Reporting Rate</th>
                <th className="px-4 py-3">AI Risk Score</th>
                <th className="px-4 py-3">Alert</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DISTRICTS.map((row, i) => {
                const isRed = row.risk.includes('Red');
                const isOrange = row.risk.includes('Orange');
                return (
                  <tr
                    key={i}
                    className={`hover:bg-epi-bg/30 ${isRed ? 'bg-epi-red/5' : isOrange ? 'bg-epi-amber/5' : ''}`}>
                    
                    <td className="px-4 py-3 font-bold text-epi-muted">
                      {row.rank}
                    </td>
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.dist}
                    </td>
                    <td className="px-4 py-3 text-epi-muted">{row.prov}</td>
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.mal}
                    </td>
                    <td className="px-4 py-3 font-medium text-epi-text">
                      {row.chol}
                    </td>
                    <td className="px-4 py-3 font-bold">{row.risk}</td>
                    <td className="px-4 py-3 text-epi-muted">{row.rep}</td>
                    <td className="px-4 py-3 font-medium">{row.score}</td>
                    <td className="px-4 py-3 font-bold">{row.alert}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold text-[12px] ${isRed ? 'text-epi-red' : isOrange ? 'text-epi-amber' : row.action.includes('Mpox') ? 'text-epi-amber' : 'text-epi'}`}>
                        
                        {row.action}
                      </span>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col min-h-[300px]">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">
            Rwanda Map — Malaria Risk
          </h3>
          <div className="flex-1 bg-epi-bg rounded-lg border border-border flex items-center justify-center relative">
            <div className="text-[13px] text-epi-muted">
              [Interactive Map Visualization]
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h3 className="text-[15px] font-bold text-epi-text mb-4">
            Top 10 Districts by Malaria Cases
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{
                  top: 0,
                  right: 20,
                  left: 20,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E5E7EB" />
                
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 11,
                    fill: '#6B7280'
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{
                    fontSize: 11,
                    fill: '#1A1A2E',
                    fontWeight: 600
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
                
                <ReferenceLine
                  x={15}
                  stroke="#104E49"
                  strokeDasharray="4 4"
                  label={{
                    value: 'National Avg',
                    position: 'top',
                    fill: '#104E49',
                    fontSize: 10
                  }} />
                
                <Bar
                  dataKey="cases"
                  fill="#F59E0B"
                  radius={[0, 4, 4, 0]}
                  barSize={16} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </EpiLayout>);

}