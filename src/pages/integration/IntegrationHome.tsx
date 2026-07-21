import React from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  Plug,
  Database,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowUpRight } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceLine,
  Cell } from
'recharts';
const dailyData = [
{
  date: 'May 30',
  dhis2: 4100,
  emr: 2000,
  chw: 1200,
  pharmacy: 800,
  other: 500,
  avg: 8600
},
{
  date: 'May 31',
  dhis2: 4200,
  emr: 2100,
  chw: 1250,
  pharmacy: 850,
  other: 520,
  avg: 8700
},
{
  date: 'Jun 1',
  dhis2: 4150,
  emr: 2050,
  chw: 1220,
  pharmacy: 820,
  other: 510,
  avg: 8750
},
{
  date: 'Jun 2',
  dhis2: 4300,
  emr: 2150,
  chw: 1300,
  pharmacy: 880,
  other: 540,
  avg: 8800
},
{
  date: 'Jun 3',
  dhis2: 4250,
  emr: 2100,
  chw: 1280,
  pharmacy: 860,
  other: 530,
  avg: 8850
},
{
  date: 'Jun 4',
  dhis2: 4200,
  emr: 2080,
  chw: 0,
  pharmacy: 870,
  other: 520,
  avg: 8900
},
{
  date: 'Jun 5',
  dhis2: 4230,
  emr: 2100,
  chw: 1240,
  pharmacy: 890,
  other: 580,
  avg: 8950
}];

const healthData = [
{
  name: 'DHIS2',
  score: 98,
  fill: '#00A550'
},
{
  name: 'NISR',
  score: 98,
  fill: '#00A550'
},
{
  name: 'RBC Lab',
  score: 95,
  fill: '#00A550'
},
{
  name: 'Pharmacy',
  score: 95,
  fill: '#00A550'
},
{
  name: 'WASAC',
  score: 92,
  fill: '#00A550'
},
{
  name: 'EMR',
  score: 84,
  fill: '#F97316'
},
{
  name: 'CHW App',
  score: 78,
  fill: '#F97316'
},
{
  name: 'Met Agency',
  score: 45,
  fill: '#D32F2F'
}];

export function IntegrationHome() {
  return (
    <IntegrationLayout
      title="Health Data Integration — Overview"
      subtitle="Thursday, June 5, 2026 | All Rwanda health data sources | Last full system sync: 13:00 today"
      breadcrumb="Integration Home">
      
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-bg flex items-center justify-center">
              <Plug className="w-4 h-4 text-epi-muted" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Total Sources
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">9</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Connected data sources
          </p>
          <div className="space-y-1 text-[11px] font-medium mt-auto">
            <div className="text-epi-text">7 🟢 Active</div>
            <div className="text-epi-text">1 🟡 Delayed</div>
            <div className="text-epi-text">1 🔴 Disconnected</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Records Today
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">9,040</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Records imported today
          </p>
          <div className="mt-auto">
            <span className="text-[12px] font-bold text-epi flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12% vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-epi-accent" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Validation Pass Rate
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-2">97.3%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div
              className="bg-epi-accent h-1.5 rounded-full"
              style={{
                width: '97.3%'
              }}>
            </div>
          </div>
          <p className="text-[11px] text-epi-muted mb-1">
            245 records flagged today
          </p>
          <div className="mt-auto">
            <span className="text-[12px] font-bold text-epi-accent flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +0.4% vs last week
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-red/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-epi-red" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Pipeline Failures
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">3</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Failed runs in last 24 hours
          </p>
          <div className="space-y-1 text-[11px] font-medium mt-auto mb-2">
            <div className="text-epi-text">1 🟡 CHW App (delay)</div>
            <div className="text-epi-text">1 🔴 Weather API (down)</div>
            <div className="text-epi-text">1 🟠 EMR partial sync</div>
          </div>
          <button className="text-[12px] font-bold text-epi-red hover:underline text-left">
            View failures →
          </button>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-bg flex items-center justify-center">
              <Clock className="w-4 h-4 text-epi-muted" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Data Freshness
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">98 min</div>
          <p className="text-[11px] text-epi-muted mb-3">
            Average data age across sources
          </p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-epi-accent/10 text-epi-accent mb-1">
              🟢 Acceptable
            </span>
            <p className="text-[11px] text-epi-muted">Target: under 3 hours</p>
          </div>
        </div>
      </div>

      {/* Red Alert Banner */}
      <div className="bg-epi-red border border-epi-red rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-sm text-white">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[14px] font-bold mb-1">
              🔴 WARNING: Rwanda Meteorological Agency API has been disconnected
              for 3 days.
            </h3>
            <p className="text-[13px] opacity-90">
              Weather and environmental data is missing from all dashboards and
              AI prediction models. Immediate reconnection required.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white text-epi-red text-[13px] font-bold rounded-md hover:bg-white/90 transition-colors shrink-0 shadow-sm">
          Reconnect Weather API
        </button>
      </div>

      {/* Row 2: Data Sources Status Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            All Data Sources — Live Status
          </h2>
          <p className="text-[13px] text-epi-muted">
            Real-time connection status and ingestion summary
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Connection
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Records Today
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Data Quality
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  DHIS2 / HMIS
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Hospital & health center reports
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 Active
                </td>
                <td className="p-4 text-[13px] text-epi-text">1 hour ago</td>
                <td className="p-4 text-[13px] text-epi-text">4,230 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 99.1%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Configure
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  RBC Laboratory System
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Lab test results & confirmations
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 Active
                </td>
                <td className="p-4 text-[13px] text-epi-text">2 hours ago</td>
                <td className="p-4 text-[13px] text-epi-text">340 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 98.4%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Configure
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="bg-epi-amber/10 hover:bg-epi-amber/20 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  CHW Mobile Reports
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Village-level health reports
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟡 Delayed
                </td>
                <td className="p-4 text-[13px] text-epi-text">6 hours ago</td>
                <td className="p-4 text-[13px] text-epi-text">1,240 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟡 91.2%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Investigate
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  NISR Census Data
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Demographics & population figures
                </td>
                <td className="p-4 text-[13px] text-epi-text">Manual Upload</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 Active
                </td>
                <td className="p-4 text-[13px] text-epi-text">3 days ago</td>
                <td className="p-4 text-[13px] text-epi-text">Static data</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 100%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Upload New
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="bg-epi-red/10 hover:bg-epi-red/20 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-epi-red" /> Rwanda Met
                  Agency
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Rainfall & climate data
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-red">
                  🔴 Disconnected
                </td>
                <td className="p-4 text-[13px] text-epi-text">3 days ago</td>
                <td className="p-4 text-[13px] text-epi-text">0 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-red">
                  🔴 N/A
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Reconnect
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Pharmacy / Stock Data (Rwanda FDA)
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Medicine availability & stock
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 Active
                </td>
                <td className="p-4 text-[13px] text-epi-text">4 hours ago</td>
                <td className="p-4 text-[13px] text-epi-text">890 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 97.8%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Configure
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  EMR Systems
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Electronic medical records
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟡 Partial
                </td>
                <td className="p-4 text-[13px] text-epi-text">5 hours ago</td>
                <td className="p-4 text-[13px] text-epi-text">2,100 records</td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  🟠 84.3%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Investigate
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  WASAC
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Water & sanitation coverage
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 Active
                </td>
                <td className="p-4 text-[13px] text-epi-text">8 hours ago</td>
                <td className="p-4 text-[13px] text-epi-text">120 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 98.0%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Configure
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50 transition-colors">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  MINAGRI
                </td>
                <td className="p-4 text-[13px] text-epi-muted">
                  Food security & nutrition data
                </td>
                <td className="p-4 text-[13px] text-epi-text">Automatic API</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 Active
                </td>
                <td className="p-4 text-[13px] text-epi-text">12 hours ago</td>
                <td className="p-4 text-[13px] text-epi-text">860 records</td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  🟢 96.5%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  <button className="text-epi hover:underline font-medium">
                    Configure
                  </button>{' '}
                  ·{' '}
                  <button className="text-epi hover:underline font-medium">
                    View Log
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-[13px] text-epi-muted">
            Showing 9 of 9 sources
          </span>
          <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
            + Add New Source
          </button>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            Daily Record Ingestion — All Sources (Last 7 Days)
          </h2>
          <div className="h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dailyData}
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
                  dataKey="date"
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
                  domain={[0, 12000]} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Bar dataKey="dhis2" stackId="a" fill="#104E49" name="DHIS2" />
                <Bar dataKey="emr" stackId="a" fill="#1D72B8" name="EMR" />
                <Bar dataKey="chw" stackId="a" fill="#00A550" name="CHW App" />
                <Bar
                  dataKey="pharmacy"
                  stackId="a"
                  fill="#F59E0B"
                  name="Pharmacy" />
                
                <Bar
                  dataKey="other"
                  stackId="a"
                  fill="#6B7280"
                  name="Others"
                  radius={[4, 4, 0, 0]} />
                
                <Line
                  type="monotone"
                  dataKey="avg"
                  name="7-day moving avg"
                  stroke="#F97316"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false} />
                
              </ComposedChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 right-1/4 bg-white/90 border border-border p-2 rounded shadow-sm text-[11px] font-medium text-epi-text max-w-[150px]">
              📉 CHW App delay caused 1,800 fewer records
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            Source Health Scores
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={healthData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#E5E7EB" />
                
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }} />
                
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#111827',
                    fontWeight: 500
                  }}
                  width={80} />
                
                <Tooltip
                  cursor={{
                    fill: '#F4F6F9'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <ReferenceLine
                  x={80}
                  stroke="#6B7280"
                  strokeDasharray="3 3"
                  label={{
                    position: 'top',
                    value: 'Min 80%',
                    fill: '#6B7280',
                    fontSize: 11
                  }} />
                
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                  {healthData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}