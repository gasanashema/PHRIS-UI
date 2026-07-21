import React from 'react';
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
  Line } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
const INDICATORS = [
{
  name: 'Under-5 Mortality Rate',
  current: '35/1,000',
  target: '25/1,000',
  pct: 67,
  trend: '↓ Improving',
  status: '🟠 Off Track',
  spark: [45, 42, 40, 38, 35],
  goodTrend: true
},
{
  name: 'Maternal Mortality Rate',
  current: '203/100,000',
  target: '140/100,000',
  pct: 59,
  trend: '↓ Improving',
  status: '🟠 Off Track',
  spark: [240, 230, 220, 210, 203],
  goodTrend: true
},
{
  name: 'Malaria Incidence',
  current: '45/1,000',
  target: '30/1,000',
  pct: 50,
  trend: '↑ Worsening',
  status: '🟠 Off Track ↑',
  spark: [35, 32, 38, 42, 45],
  goodTrend: false
},
{
  name: 'Vaccination Coverage',
  current: '92%',
  target: '95%',
  pct: 92,
  trend: '↑ Improving',
  status: '🟡 Close to Target',
  spark: [85, 88, 89, 90, 92],
  goodTrend: true
},
{
  name: 'HIV Treatment Coverage',
  current: '87%',
  target: '95%',
  pct: 87,
  trend: '→ Stable',
  status: '🟡 Close to Target',
  spark: [86, 87, 86, 87, 87],
  goodTrend: true
},
{
  name: 'Child Stunting Rate',
  current: '33%',
  target: '19%',
  pct: 42,
  trend: '→ Stable',
  status: '🔴 Critical — Far from Target',
  spark: [34, 34, 33, 33, 33],
  goodTrend: false,
  critical: true
}];

const districtData = [
{
  name: 'Nyaruguru',
  val: 48
},
{
  name: 'Gisagara',
  val: 44
},
{
  name: 'Nyamagabe',
  val: 41
},
{
  name: 'Kirehe',
  val: 39
},
{
  name: 'Ngoma',
  val: 37
},
{
  name: '...',
  val: 0
},
{
  name: 'Gasabo',
  val: 22
},
{
  name: 'Nyarugenge',
  val: 24
}].
sort((a, b) => b.val - a.val);
export function AnalystIndicators() {
  return (
    <AnalystLayout
      title="Health Indicators Analysis"
      subtitle="Rwanda HSSP + Vision 2050 national health target tracking"
      breadcrumb="Health Indicators">
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Indicator group: All</option>
          </select>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Program: All Programs</option>
          </select>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Geography: National</option>
          </select>
          <select className="h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
            <option>Year: 2026</option>
          </select>
        </div>
        <div className="flex gap-2 text-[12px] font-bold">
          <span className="bg-epi-accent/10 text-epi-accent px-3 py-1.5 rounded-full border border-epi-accent/20">
            On Track: 2
          </span>
          <span className="bg-[#FEF08A]/40 text-[#A16207] px-3 py-1.5 rounded-full border border-[#FDE047]">
            Close: 2
          </span>
          <span className="bg-epi-amber/10 text-epi-amber px-3 py-1.5 rounded-full border border-epi-amber/20">
            Off Track: 1
          </span>
          <span className="bg-epi-red/10 text-epi-red px-3 py-1.5 rounded-full border border-epi-red/20">
            Critical: 1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {INDICATORS.map((ind, i) =>
        <div
          key={i}
          className={`bg-white rounded-lg shadow-card border p-5 flex flex-col ${ind.critical ? 'border-epi-red/40 bg-epi-red/5' : 'border-border'}`}>
          
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[15px] font-bold text-epi-text">
                {ind.name}
              </h3>
              <span
              className={`text-[11px] font-bold px-2 py-1 rounded-full ${ind.status.includes('Critical') ? 'bg-epi-red text-white' : ind.status.includes('Off Track') ? 'bg-epi-amber text-white' : 'bg-[#FEF08A] text-[#A16207]'}`}>
              
                {ind.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[32px] font-bold text-epi-text leading-none">
                {ind.current}
              </span>
              <span className="text-[14px] font-medium text-epi-muted">
                vs target {ind.target}
              </span>
            </div>

            <div className="h-2 bg-epi-red/20 rounded-full overflow-hidden mb-4 flex">
              <div
              className="h-full bg-epi rounded-l-full"
              style={{
                width: `${ind.pct}%`
              }} />
            
              <div
              className="h-full bg-epi-red/40"
              style={{
                width: `${100 - ind.pct}%`
              }} />
            
            </div>

            <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    data={ind.spark.map((v, i) => ({
                      val: v,
                      i
                    }))}>
                    
                      <Line
                      type="monotone"
                      dataKey="val"
                      stroke={ind.goodTrend ? '#00A550' : '#D32F2F'}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false} />
                    
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <span
                className={`text-[13px] font-bold ${ind.goodTrend ? 'text-epi-accent' : ind.trend.includes('Stable') ? 'text-epi-muted' : 'text-epi-red'}`}>
                
                  {ind.trend}
                </span>
              </div>
              <button className="text-[13px] font-bold text-epi hover:underline">
                View Detail →
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border p-6">
        <h2 className="text-[16px] font-bold text-epi-text mb-4">
          Under-5 Mortality — By District (selected indicator)
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={districtData}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 0
              }}>
              
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#E5E7EB" />
              
              <XAxis
                type="number"
                domain={[0, 60]}
                tick={{
                  fontSize: 12,
                  fill: '#6B7280'
                }}
                axisLine={false}
                tickLine={false} />
              
              <YAxis
                dataKey="name"
                type="category"
                tick={{
                  fontSize: 12,
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
                x={35}
                stroke="#104E49"
                strokeDasharray="4 4"
                label={{
                  value: 'National Avg (35)',
                  position: 'top',
                  fill: '#104E49',
                  fontSize: 11
                }} />
              
              <ReferenceLine
                x={25}
                stroke="#00A550"
                strokeDasharray="4 4"
                label={{
                  value: 'Target (25)',
                  position: 'top',
                  fill: '#00A550',
                  fontSize: 11
                }} />
              
              <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={16}>
                {districtData.map((entry, index) =>
                <cell
                  key={`cell-${index}`}
                  fill={
                  entry.val > 35 ?
                  '#D32F2F' :
                  entry.val === 0 ?
                  'transparent' :
                  '#00A550'
                  } />

                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnalystLayout>);

}