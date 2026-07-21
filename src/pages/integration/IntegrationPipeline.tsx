import React from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  RefreshCw,
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  AlertTriangle } from
'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
'recharts';
const throughputData = [
{
  time: '00:00',
  actual: 200,
  expected: 200
},
{
  time: '02:00',
  actual: 250,
  expected: 250
},
{
  time: '04:00',
  actual: 220,
  expected: 220
},
{
  time: '06:00',
  actual: 300,
  expected: 300
},
{
  time: '07:00',
  actual: 150,
  expected: 400
},
{
  time: '08:00',
  actual: 1200,
  expected: 500
},
{
  time: '10:00',
  actual: 400,
  expected: 400
},
{
  time: '12:00',
  actual: 450,
  expected: 450
},
{
  time: '13:00',
  actual: 500,
  expected: 500
}];

const errorData = [
{
  name: 'Connection failures',
  value: 8,
  color: '#D32F2F'
},
{
  name: 'Validation rejections',
  value: 12,
  color: '#F59E0B'
},
{
  name: 'Format errors',
  value: 5,
  color: '#F97316'
},
{
  name: 'Timeout errors',
  value: 6,
  color: '#EAB308'
}];

export function IntegrationPipeline() {
  return (
    <IntegrationLayout
      title="Data Pipeline Dashboard"
      subtitle="Real-time view of data flow through all processing stages"
      breadcrumb="Pipeline Dashboard">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>All Sources ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Last 24 Hours ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Status: All</option>
            <option>Running</option>
            <option>Failed</option>
            <option>Complete</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-epi border border-epi rounded-md hover:bg-epi/5 transition-colors bg-white">
          <RefreshCw className="w-4 h-4" />
          Refresh <span className="text-epi-muted font-normal ml-1">(59s)</span>
        </button>
      </div>

      {/* Main Pipeline Visualization */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Live Pipeline Status — All Sources
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider w-48">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Collection
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Validation
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Processing
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Storage
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Available
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* DHIS2 */}
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  DHIS2 / HMIS
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      4,230 records
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      4,188 passed, 42 flagged
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      standardized
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      committed
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      ready for use
                    </span>
                  </div>
                </td>
              </tr>

              {/* RBC Lab */}
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  RBC Laboratory
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      340 records
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      340 passed
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <Loader2 className="w-5 h-5 text-epi animate-spin" />
                    <div className="w-16 h-1.5 bg-epi-bg rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-epi w-[67%]"></div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">waiting</span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">pending</span>
                  </div>
                </td>
              </tr>

              {/* CHW App */}
              <tr className="bg-epi-amber/10 hover:bg-epi-amber/20 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  CHW Mobile Reports
                </td>
                <td className="p-4 text-center group relative">
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="w-5 h-5 text-epi-red" />
                    <span className="text-[11px] text-epi-red font-medium">
                      delayed — last attempt 06:12
                    </span>
                  </div>
                  <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white p-2 rounded shadow-floating border border-border text-[11px] text-epi-text z-20">
                    API timeout after 30 seconds. Poor connectivity in field
                    zones. Auto-retry scheduled 14:00.
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">waiting</span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">waiting</span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">waiting</span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">waiting</span>
                  </div>
                </td>
              </tr>

              {/* Met Agency */}
              <tr className="bg-epi-red/10 hover:bg-epi-red/20 transition-colors">
                <td className="p-4">
                  <div className="text-[14px] font-bold text-epi-text">
                    Rwanda Met Agency
                  </div>
                  <div className="text-[11px] font-bold text-epi-red mt-1">
                    🔴 Source offline 3 days — admin action required
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="w-5 h-5 text-epi-red" />
                    <span className="text-[11px] text-epi-red font-medium">
                      FAILED — SSL error
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-epi-red/20 -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <AlertCircle className="w-5 h-5 text-epi-red" />
                    <span className="text-[11px] text-epi-red font-medium">
                      skipped
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-epi-red/20 -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <AlertCircle className="w-5 h-5 text-epi-red" />
                    <span className="text-[11px] text-epi-red font-medium">
                      skipped
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-epi-red/20 -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <AlertCircle className="w-5 h-5 text-epi-red" />
                    <span className="text-[11px] text-epi-red font-medium">
                      skipped
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-epi-red/20 -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <AlertCircle className="w-5 h-5 text-epi-red" />
                    <span className="text-[11px] text-epi-red font-medium">
                      NO DATA
                    </span>
                  </div>
                </td>
              </tr>

              {/* EMR */}
              <tr className="bg-epi-amber/10 hover:bg-epi-amber/20 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  EMR Systems
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      2,100 records, 12 districts
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <AlertTriangle className="w-5 h-5 text-epi-amber" />
                    <span className="text-[11px] text-epi-amber font-medium">
                      188 warnings
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Loader2 className="w-5 h-5 text-epi animate-spin" />
                    <div className="w-16 h-1.5 bg-epi-bg rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-epi w-[34%]"></div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">waiting</span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 px-2">
                    <Clock className="w-5 h-5 text-epi-muted" />
                    <span className="text-[11px] text-epi-muted">partial</span>
                  </div>
                </td>
              </tr>

              {/* NISR */}
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  NISR Census Data
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      static file, uploaded June 2
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      100% passed
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">complete</span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">
                      committed
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-px bg-border -z-10"></div>
                  <div className="flex flex-col items-center gap-1 bg-white px-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
                    <span className="text-[11px] text-epi-muted">ready</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            Records Processed Per Hour
          </h2>
          <div className="h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={throughputData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB" />
                
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }}
                  domain={[0, 1500]} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Throughput"
                  stroke="#104E49"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#104E49',
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                  activeDot={{
                    r: 6
                  }} />
                
                <Line
                  type="monotone"
                  dataKey="expected"
                  name="Expected Baseline"
                  stroke="#F97316"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false} />
                
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-1/4 left-1/3 bg-white/90 border border-border p-2 rounded shadow-sm text-[11px] font-medium text-epi-text max-w-[150px]">
              📉 CHW delay caused throughput drop
            </div>
            <div className="absolute top-4 right-1/3 bg-white/90 border border-border p-2 rounded shadow-sm text-[11px] font-medium text-epi-text">
              DHIS2 + EMR batch sync
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-2">
            Pipeline Errors — Last 24 Hours
          </h2>
          <div className="flex-1 flex items-center justify-center relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none">
                  
                  {errorData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[16px] font-bold text-epi-text">31</span>
              <span className="text-[11px] text-epi-muted">total errors</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 px-4">
            {errorData.map((err, idx) =>
            <div key={idx} className="flex items-center gap-2">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: err.color
                }}>
              </div>
                <span className="text-[12px] text-epi-text">
                  {err.name} ({err.value})
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="text-[12px] font-medium text-epi-text">
              <div className="mb-1">22 of 31 auto-resolved ✅</div>
              <div className="text-epi-red font-bold">
                9 require admin action 🔴
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
              View All Errors
            </button>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}