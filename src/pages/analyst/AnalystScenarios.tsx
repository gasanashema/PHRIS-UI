import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import { ShieldCheck, Heart, TrendingUp } from 'lucide-react';
const scenarioData = [
{
  month: 'Jun',
  noInt: 20,
  withInt: 20
},
{
  month: 'Jul',
  noInt: 35,
  withInt: 25
},
{
  month: 'Aug',
  noInt: 55,
  withInt: 15
},
{
  month: 'Sep',
  noInt: 80,
  withInt: 5
},
{
  month: 'Oct',
  noInt: 100,
  withInt: 2
},
{
  month: 'Nov',
  noInt: 115,
  withInt: 1
},
{
  month: 'Dec',
  noInt: 120,
  withInt: 0
}];

export function AnalystScenarios() {
  return (
    <AnalystLayout
      title="What-If Scenario Analysis"
      subtitle="Simulate the impact of policy and health interventions before deploying resources"
      breadcrumb="What-If Scenarios">
      
      <div className="grid grid-cols-[35%_65%] gap-6">
        {/* Left - Builder */}
        <div className="bg-white rounded-lg shadow-card border border-border p-5 h-fit flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-5">
            Build a Scenario
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 1 — Select intervention type:
              </label>
              <select className="w-full h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                <option>Vaccination Coverage Increase</option>
                <option>Sanitation Improvement</option>
                <option>CHW Deployment</option>
                <option>Budget Change</option>
                <option>Bednet Distribution</option>
                <option>Water Treatment</option>
              </select>
            </div>

            <div className="bg-epi-bg border border-border rounded-lg p-4 space-y-4">
              <label className="block text-[13px] font-bold text-epi-text">
                Step 2 — Set parameters:
              </label>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">
                  Disease target:
                </div>
                <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                  <option>Measles</option>
                </select>
              </div>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">
                  Geography:
                </div>
                <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                  <option>Kayonza District</option>
                </select>
              </div>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">
                  Current coverage:
                </div>
                <input
                  type="text"
                  value="71%"
                  disabled
                  className="w-full h-9 px-3 bg-epi-bg border border-border rounded-md text-[13px] text-epi-muted cursor-not-allowed" />
                
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-epi-muted mb-1">
                  <span>Proposed coverage:</span>
                  <span className="font-bold text-epi-text">98%</span>
                </div>
                <input
                  type="range"
                  min="71"
                  max="100"
                  defaultValue="98"
                  className="w-full accent-epi" />
                
              </div>
              <div>
                <div className="text-[11px] text-epi-muted mb-1">Timeline:</div>
                <select className="w-full h-9 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi">
                  <option>6 months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-2">
                Step 3 — Comparison baseline:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="base" className="accent-epi" />{' '}
                  Compare to current trajectory
                </label>
                <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input
                    type="radio"
                    name="base"
                    defaultChecked
                    className="accent-epi" />
                  {' '}
                  Compare to no intervention
                </label>
              </div>
            </div>

            <button className="w-full h-11 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md">
              Run Simulation
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-[13px] font-bold text-epi-text mb-3">
              Saved scenarios
            </h3>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between items-center py-1.5 border-b border-border hover:bg-epi-bg cursor-pointer px-2 -mx-2 rounded">
                <span className="text-epi-text font-medium">
                  Sanitation +20% — Western Province
                </span>
                <span className="text-epi-muted">May 30</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border hover:bg-epi-bg cursor-pointer px-2 -mx-2 rounded">
                <span className="text-epi-text font-medium">
                  500 CHWs — Southern Province
                </span>
                <span className="text-epi-muted">May 25</span>
              </div>
              <div className="flex justify-between items-center py-1.5 hover:bg-epi-bg cursor-pointer px-2 -mx-2 rounded">
                <span className="text-epi-text font-medium">
                  Malaria budget -30% impact
                </span>
                <span className="text-epi-muted">May 20</span>
              </div>
            </div>
            <button className="text-[12px] font-bold text-epi hover:underline mt-3">
              View all scenarios →
            </button>
          </div>
        </div>

        {/* Right - Results */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-epi-text">
              Simulation Result: Measles Vaccination to 98% — Kayonza District —
              6 months
            </h2>
            <p className="text-[13px] text-epi-muted">
              Generated: June 5, 2026
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-epi-accent/10 border border-epi-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-epi-accent mb-2">
                <ShieldCheck className="w-4 h-4" /> Cases Prevented
              </div>
              <div className="text-[20px] font-bold text-epi-text mb-1">
                847 measles cases prevented
              </div>
              <div className="text-[11px] text-epi-muted">
                Over 6-month simulation period
              </div>
            </div>
            <div className="bg-epi-accent/10 border border-epi-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-epi-accent mb-2">
                <Heart className="w-4 h-4" /> Deaths Prevented
              </div>
              <div className="text-[20px] font-bold text-epi-text mb-1">
                Est. 12 deaths prevented
              </div>
              <div className="text-[11px] text-epi-muted">
                Based on CFR of 1.4%
              </div>
            </div>
            <div className="bg-epi/10 border border-epi/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-epi mb-2">
                <TrendingUp className="w-4 h-4" /> Cost-Effectiveness
              </div>
              <div className="text-[20px] font-bold text-epi-text mb-1">
                RWF 2,100 per case prevented
              </div>
              <div className="text-[11px] text-epi-muted">
                ~$1.90 USD | High value intervention
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[350px] mb-6">
            <h3 className="text-[15px] font-bold text-epi-text mb-4 text-center">
              Projected Measles Cases — Kayonza District — Jun 2026 to Dec 2026
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={scenarioData}
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
                
                <Line
                  type="monotone"
                  dataKey="noInt"
                  name="No intervention"
                  stroke="#D32F2F"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false} />
                
                <Line
                  type="monotone"
                  dataKey="withInt"
                  name="With 98% vaccination"
                  stroke="#00A550"
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

          <div className="bg-epi-bg border border-border rounded-lg p-4 mb-6 text-[12px] text-epi-muted leading-relaxed">
            <span className="font-bold text-epi-text">
              Simulation confidence: 78%
            </span>{' '}
            | Based on 4-year Rwanda measles vaccination response data |
            Assumptions: uniform distribution, no outbreak events, supply chain
            uninterrupted
          </div>

          <div className="flex gap-3 mt-auto">
            <button className="h-10 px-6 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
              Add to Report
            </button>
            <button className="h-10 px-6 bg-white border border-border hover:bg-epi-bg text-epi-text text-[13px] font-bold rounded-md">
              Export PDF
            </button>
            <button className="h-10 px-6 bg-white border border-border hover:bg-epi-bg text-epi-text text-[13px] font-bold rounded-md">
              Share with team
            </button>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}