import React, { useState, Children } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Area } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import {
  LineChart as LineIcon,
  BarChart2,
  PieChart,
  ScatterChart } from
'lucide-react';
const chartData = [
{
  month: 'Jan',
  '2024': 120,
  '2025-2026': 140
},
{
  month: 'Feb',
  '2024': 150,
  '2025-2026': 180
},
{
  month: 'Mar',
  '2024': 220,
  '2025-2026': 290
},
{
  month: 'Apr',
  '2024': 340,
  '2025-2026': 480
},
{
  month: 'May',
  '2024': 280,
  '2025-2026': 410
},
{
  month: 'Jun',
  '2024': 210,
  '2025-2026': 320
}];

export function AnalystExplore() {
  const [chartType, setChartType] = useState('line');
  return (
    <AnalystLayout
      title="Data Exploration"
      subtitle="Build any analysis from any combination of Rwanda health data"
      breadcrumb="Data Exploration">
      
      <div className="grid grid-cols-[30%_70%] gap-6">
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
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input
                    type="radio"
                    name="what"
                    defaultChecked
                    className="accent-epi" />
                  {' '}
                  Disease / Condition
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="what" className="accent-epi" />{' '}
                  Health Indicator
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="what" className="accent-epi" />{' '}
                  Program Coverage
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="what" className="accent-epi" />{' '}
                  Environmental Factor
                </label>
              </div>
              <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                <option>Malaria</option>
                <option>Cholera</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 2 — Time Range:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                'Last Week',
                'Last Month',
                'Last 3 Months',
                'Last Year',
                'Last 2 Years',
                'Custom'].
                map((t) =>
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${t === 'Last 2 Years' ? 'bg-epi text-white border-epi' : 'bg-epi-bg text-epi-muted border-border hover:border-epi'}`}>
                  
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
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="geo" className="accent-epi" />{' '}
                  National
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input
                    type="radio"
                    name="geo"
                    defaultChecked
                    className="accent-epi" />
                  {' '}
                  Province
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="geo" className="accent-epi" />{' '}
                  District
                </label>
              </div>
              <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                <option>Eastern Province</option>
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
                  <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                    <option>Under 5</option>
                  </select>
                </div>
                <div>
                  <div className="text-[11px] text-epi-muted mb-1">Gender:</div>
                  <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                    <option>All</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 5 — Chart Type:
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setChartType('line')}
                  className={`w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors ${chartType === 'line' ? 'border-epi text-epi bg-epi/5' : 'border-border text-epi-muted hover:border-epi/50'}`}>
                  
                  <LineIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors ${chartType === 'bar' ? 'border-epi text-epi bg-epi/5' : 'border-border text-epi-muted hover:border-epi/50'}`}>
                  
                  <BarChart2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors ${chartType === 'pie' ? 'border-epi text-epi bg-epi/5' : 'border-border text-epi-muted hover:border-epi/50'}`}>
                  
                  <PieChart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setChartType('scatter')}
                  className={`w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors ${chartType === 'scatter' ? 'border-epi text-epi bg-epi/5' : 'border-border text-epi-muted hover:border-epi/50'}`}>
                  
                  <ScatterChart className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <button className="w-full h-10 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md">
                Generate Analysis
              </button>
              <button className="w-full h-10 bg-white border border-border hover:bg-epi-bg text-epi-text text-[14px] font-bold rounded-md">
                Export Data (Excel / CSV)
              </button>
            </div>
          </div>
        </div>

        {/* Right Col - Results */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[18px] font-bold text-epi-text mb-1">
            Malaria Cases — Children Under 5 — Eastern Province — 2024–2026
          </h2>
          <p className="text-[13px] text-epi-muted mb-6">
            AI Vital Data Explorer | Generated June 5, 2026
          </p>

          <div className="h-[360px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB" />
                
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <YAxis
                  domain={[0, 500]}
                  tick={{
                    fontSize: 12,
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
                    fontSize: 13,
                    paddingTop: 20
                  }} />
                
                <ReferenceLine
                  y={300}
                  stroke="#D32F2F"
                  strokeDasharray="6 4"
                  label={{
                    value: 'Threshold (300)',
                    position: 'insideTopLeft',
                    fill: '#D32F2F',
                    fontSize: 11
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="2024"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  dot={{
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="2025-2026"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-epi/10 border border-epi/20 rounded-lg p-5 mb-6">
            <div className="text-[14px] text-epi-text leading-relaxed">
              <span className="font-bold text-epi">💡 AI Analysis:</span>{' '}
              Malaria cases in children under 5 in Eastern Province doubled
              between April 2024 and April 2026. Primary contributing factors:
              above-average rainfall (+18% vs baseline), bednet distribution gap
              in Kayonza and Kirehe Districts. Recommend: targeted bednet
              distribution before March 2027.
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            <div>
              <span className="text-epi-muted">Total cases (period):</span>{' '}
              <span className="font-bold text-epi-text">8,420</span>
            </div>
            <div>
              <span className="text-epi-muted">Peak month:</span>{' '}
              <span className="font-bold text-epi-text">April 2026</span>
            </div>
            <div>
              <span className="text-epi-muted">Highest district:</span>{' '}
              <span className="font-bold text-epi-text">Kayonza</span>
            </div>
            <div>
              <span className="text-epi-muted">Trend:</span>{' '}
              <span className="font-bold text-epi-amber">↑ +41% vs 2024</span>
            </div>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}