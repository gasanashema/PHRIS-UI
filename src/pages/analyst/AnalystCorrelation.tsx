import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
const scatterData = [
{
  name: 'Rusizi',
  wash: 41,
  cases: 87,
  fill: '#D32F2F'
},
{
  name: 'Nyamasheke',
  wash: 48,
  cases: 34,
  fill: '#F59E0B'
},
{
  name: 'Rutsiro',
  wash: 52,
  cases: 28,
  fill: '#F59E0B'
},
{
  name: 'Karongi',
  wash: 55,
  cases: 15,
  fill: '#F59E0B'
},
{
  name: 'Ngororero',
  wash: 58,
  cases: 12,
  fill: '#F59E0B'
},
{
  name: 'Rubavu',
  wash: 62,
  cases: 8,
  fill: '#00A550'
},
{
  name: 'Huye',
  wash: 75,
  cases: 2,
  fill: '#00A550'
},
{
  name: 'Kigali',
  wash: 85,
  cases: 1,
  fill: '#00A550'
},
{
  name: 'Nyarugenge',
  wash: 87,
  cases: 1,
  fill: '#00A550'
},
{
  name: 'Musanze',
  wash: 88,
  cases: 0,
  fill: '#00A550'
},
{
  name: 'Gasabo',
  wash: 91,
  cases: 0,
  fill: '#00A550'
}];

const SAVED = [
{
  name: 'Rainfall vs Malaria (National)',
  r: '+0.79',
  strength: 'Strong Positive',
  by: 'Aline Uwimana',
  date: 'June 3'
},
{
  name: 'Poverty (Ubudehe) vs Stunting',
  r: '+0.82',
  strength: 'Strong Positive',
  by: 'Jean Paul Habimana',
  date: 'June 1'
},
{
  name: 'Vaccination vs Measles Cases',
  r: '-0.91',
  strength: 'Very Strong Negative',
  by: 'Aline Uwimana',
  date: 'May 28'
},
{
  name: 'Distance to Facility vs U5 Mortality',
  r: '+0.68',
  strength: 'Moderate Positive',
  by: 'Celestin Nzeyimana',
  date: 'May 25'
}];

export function AnalystCorrelation() {
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
          <select className="w-full h-10 px-3 bg-white border border-border rounded-md text-[14px] font-medium focus:outline-none focus:border-epi">
            <option>Cholera Cases</option>
          </select>
        </div>
        <div className="text-[14px] font-bold text-epi-muted pb-2">vs</div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Variable B
          </label>
          <select className="w-full h-10 px-3 bg-white border border-border rounded-md text-[14px] font-medium focus:outline-none focus:border-epi">
            <option>WASH Coverage (%)</option>
          </select>
        </div>
        <div className="w-[1px] h-10 bg-border mx-2" />
        <div>
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Geography
          </label>
          <select className="w-40 h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>District Level</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-bold text-epi-muted mb-1.5">
            Time
          </label>
          <select className="w-32 h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>2025–2026</option>
          </select>
        </div>
        <button className="h-10 px-6 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md ml-auto">
          Run Correlation Analysis
        </button>
      </div>

      <div className="grid grid-cols-[55%_45%] gap-6 mb-6">
        {/* Left - Scatter Plot */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 relative">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            Cholera Cases vs WASH Coverage — All 30 Districts (2026)
          </h2>

          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur border border-border shadow-sm rounded-lg p-3 z-10 text-center">
            <div className="text-[18px] font-bold text-epi-text">r = -0.87</div>
            <div className="text-[11px] font-bold text-epi-red">
              Strong Negative Correlation
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 0
                }}>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  dataKey="wash"
                  name="WASH Coverage"
                  unit="%"
                  domain={[0, 100]}
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }}
                  label={{
                    value: 'WASH Coverage (%)',
                    position: 'bottom',
                    fill: '#6B7280',
                    fontSize: 12
                  }} />
                
                <YAxis
                  type="number"
                  dataKey="cases"
                  name="Cholera Cases"
                  domain={[0, 100]}
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }}
                  label={{
                    value: 'Cholera Cases',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#6B7280',
                    fontSize: 12
                  }} />
                
                <Tooltip
                  cursor={{
                    strokeDasharray: '3 3'
                  }}
                  contentStyle={{
                    borderRadius: 8,
                    fontSize: 12
                  }}
                  formatter={(value, name, props) => [value, name]}
                  labelFormatter={() => ''} />
                
                <Scatter name="Districts" data={scatterData}>
                  {scatterData.map((entry, index) =>
                  <cell key={`cell-${index}`} fill={entry.fill} />
                  )}
                </Scatter>
                <ReferenceLine
                  segment={[
                  {
                    x: 30,
                    y: 90
                  },
                  {
                    x: 95,
                    y: -5
                  }]
                  }
                  stroke="#D32F2F"
                  strokeWidth={2} />
                
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right - Results */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <div className="text-[36px] font-bold text-epi-text leading-none mb-1">
              r = -0.87
            </div>
            <div className="text-[14px] font-bold text-epi-red mb-4">
              Strong Negative Correlation
            </div>
            <p className="text-[13px] text-epi-text leading-relaxed mb-6">
              As WASH coverage increases by 1%, cholera cases decrease by an
              estimated 2.3 cases per district per week. This relationship is
              statistically significant (p &lt; 0.001).
            </p>

            <div className="mb-2">
              <div className="h-2 bg-gradient-to-r from-epi-red via-epi-bg to-epi-accent rounded-full relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-epi-red rounded-full shadow-sm"
                  style={{
                    left: '6.5%'
                  }} />
                
              </div>
              <div className="flex justify-between text-[10px] font-bold text-epi-muted mt-2">
                <span>-1.0 (Strong Negative)</span>
                <span>0 (None)</span>
                <span>+1.0 (Strong Positive)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h3 className="text-[15px] font-bold text-epi-text mb-4">
              📊 What This Means for Rwanda:
            </h3>
            <ul className="space-y-3 text-[13px] text-epi-text mb-6">
              <li className="flex items-start gap-2">
                <span className="text-epi mt-0.5">•</span> Districts below 60%
                WASH coverage have on average 4× more cholera cases
              </li>
              <li className="flex items-start gap-2">
                <span className="text-epi mt-0.5">•</span> Improving WASH to 80%
                nationally could prevent an estimated 340 cholera cases per year
              </li>
              <li className="flex items-start gap-2">
                <span className="text-epi mt-0.5">•</span> 8 districts below 60%
                WASH are at sustained high risk
              </li>
            </ul>
            <div className="flex gap-3">
              <button className="flex-1 h-10 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
                Add to Report
              </button>
              <button className="flex-1 h-10 bg-white border border-border hover:bg-epi-bg text-epi-text text-[13px] font-bold rounded-md">
                Export Chart
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
              {SAVED.map((row, i) =>
              <tr key={i} className="hover:bg-epi-bg/30">
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
                    <button className="text-[12px] font-bold text-epi hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnalystLayout>);

}