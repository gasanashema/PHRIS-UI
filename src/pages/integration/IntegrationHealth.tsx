import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowDown } from
'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend } from
'recharts';
const healthData = [
{
  source: 'DHIS2 / HMIS',
  uptime: 98,
  failures: 3,
  delay: '12 min',
  score: '● Excellent',
  trend: '↑'
},
{
  source: 'RBC Laboratory',
  uptime: 95,
  failures: 8,
  delay: '25 min',
  score: '● Good',
  trend: '→'
},
{
  source: 'NISR Census',
  uptime: 100,
  failures: 0,
  delay: 'Manual',
  score: '● Excellent',
  trend: '→'
},
{
  source: 'Pharmacy / FDA',
  uptime: 95,
  failures: 7,
  delay: '38 min',
  score: '● Good',
  trend: '↑'
},
{
  source: 'WASAC',
  uptime: 93,
  failures: 10,
  delay: '45 min',
  score: '● Good',
  trend: '→'
},
{
  source: 'MINAGRI',
  uptime: 91,
  failures: 13,
  delay: '52 min',
  score: '● Good',
  trend: '→'
},
{
  source: 'EMR Systems',
  uptime: 84,
  failures: 22,
  delay: '1.8 hrs',
  score: '● Fair',
  trend: '↓'
},
{
  source: 'CHW Mobile App',
  uptime: 78,
  failures: 34,
  delay: '3.2 hrs',
  score: '● Poor (below threshold )',
  trend: '↓',
  isWarning: true
},
{
  source: 'Rwanda Met Agency',
  uptime: 45,
  failures: 67,
  delay: 'N/A',
  score: '● Critical (offline)',
  trend: '↓ ↓',
  isError: true
}];

const trendData = [
{
  date: 'May 7',
  dhis2: 98,
  met: 95,
  chw: 88
},
{
  date: 'May 14',
  dhis2: 98,
  met: 94,
  chw: 85
},
{
  date: 'May 21',
  dhis2: 97,
  met: 92,
  chw: 82
},
{
  date: 'May 28',
  dhis2: 98,
  met: 90,
  chw: 80
},
{
  date: 'Jun 2',
  dhis2: 98,
  met: 45,
  chw: 79
},
{
  date: 'Jun 5',
  dhis2: 98,
  met: 45,
  chw: 78
}];

export function IntegrationHealth() {
  return (
    <IntegrationLayout
      title="Data Source Health Monitor"
      subtitle="Uptime, reliability, and performance of all data connections — June 2026"
      breadcrumb="Source Health">
      
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center">
              <Activity className="w-5 h-5 text-epi-muted" />
            </div>
            <h3 className="text-[14px] font-bold text-epi-muted">
              Overall System Health
            </h3>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-3xl font-bold text-epi-text">87%</span>
            <span className="text-[13px] font-medium text-epi-red flex items-center mb-1">
              <ArrowDown className="w-4 h-4 mr-0.5" /> -3% vs last month
            </span>
          </div>
          <p className="text-[12px] text-epi-muted">
            Weighted average across all sources
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#00A550]" />
            </div>
            <h3 className="text-[14px] font-bold text-epi-muted">
              Sources Above 80% Uptime
            </h3>
          </div>
          <div className="text-3xl font-bold text-epi-text mb-2">7 of 9</div>
          <div className="w-full bg-epi-bg rounded-full h-2 mb-2">
            <div
              className="bg-[#00A550] h-2 rounded-full"
              style={{
                width: '77%'
              }}>
            </div>
          </div>
          <p className="text-[12px] text-epi-muted">
            Meeting minimum threshold
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-epi-amber/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-epi-amber" />
            </div>
            <h3 className="text-[14px] font-bold text-epi-muted">
              Total Failed Runs (Month)
            </h3>
          </div>
          <div className="text-3xl font-bold text-epi-text mb-1">112</div>
          <p className="text-[12px] text-epi-muted mb-1">
            Across all sources, June
          </p>
          <p className="text-[11px] font-medium text-epi-text">
            67 = Met Agency, 34 = CHW App, 11 = others
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center">
              <Clock className="w-5 h-5 text-epi-muted" />
            </div>
            <h3 className="text-[14px] font-bold text-epi-muted">
              Average Data Latency
            </h3>
          </div>
          <div className="text-3xl font-bold text-epi-text mb-1">98 min</div>
          <p className="text-[12px] text-epi-muted mb-2">
            Time from source event to AI Vital availability
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#00A550]">
              ● Within target
            </span>
            <span className="text-[11px] text-epi-muted">
              Target: &lt; 3 hours
            </span>
          </div>
        </div>
      </div>

      {/* Red Alert Banner */}
      <div className="bg-epi-red border border-epi-red rounded-lg p-4 flex items-start gap-4 mb-6 shadow-sm text-white">
        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-[14px] font-bold mb-1">
            ● ALERT: CHW Mobile App has dropped below the 80% uptime threshold
            this month (78%).
          </h3>
          <p className="text-[13px] opacity-90">
            Automatic alert sent to Emmanuel Nkurunziza, CHW coordinator,
            RBC. Root cause: poor mobile connectivity in remote sectors.
          </p>
        </div>
      </div>

      {/* Health Score Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Monthly Health Report — June 2026
          </h2>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Uptime %
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider w-48"></th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Failed Runs
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Avg Delay
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Health Score
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {healthData.map((h, idx) =>
              <tr
                key={idx}
                className={`hover:bg-epi-bg/50 transition-colors ${h.isError ? 'bg-epi-red/5' : h.isWarning ? 'bg-epi-amber/5' : ''}`}>
                
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    {h.source}
                  </td>
                  <td className="p-4 text-[14px] font-bold text-epi-text text-right">
                    {h.uptime}%
                  </td>
                  <td className="p-4 relative">
                    <div className="w-full h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                      className={`h-full ${h.uptime >= 90 ? 'bg-[#00A550]' : h.uptime >= 80 ? 'bg-[#F97316]' : 'bg-epi-red'}`}
                      style={{
                        width: `${h.uptime}%`
                      }}>
                    </div>
                    </div>
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    {h.failures} failures
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    {h.delay}
                  </td>
                  <td className="p-4 text-[13px] font-bold">{h.score}</td>
                  <td className="p-4 text-[14px] font-bold text-epi-muted text-center">
                    {h.trend}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Threshold line annotation */}
          <div className="absolute top-0 bottom-0 left-[350px] w-px border-l-2 border-dashed border-epi-muted/50 pointer-events-none"></div>
        </div>
        <div className="p-2 border-t border-border text-center text-[11px] text-epi-muted">
          80% minimum threshold
        </div>
      </div>

      {/* Uptime History Chart */}
      <div className="bg-white rounded-lg p-6 shadow-card border border-border">
        <h2 className="text-[16px] font-bold text-epi-text mb-6">
          30-Day Uptime Trend — All Sources
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
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
                domain={[0, 100]} />
              
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} />
              
              <ReferenceLine
                y={80}
                stroke="#6B7280"
                strokeDasharray="3 3"
                label={{
                  position: 'insideBottomLeft',
                  value: 'Minimum acceptable threshold',
                  fill: '#6B7280',
                  fontSize: 11
                }} />
              
              <Legend
                wrapperStyle={{
                  fontSize: '12px',
                  paddingTop: '10px'
                }} />
              
              <Line
                type="monotone"
                dataKey="dhis2"
                name="DHIS2"
                stroke="#104E49"
                strokeWidth={2}
                dot={false} />
              
              <Line
                type="monotone"
                dataKey="chw"
                name="CHW App"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false} />
              
              <Line
                type="monotone"
                dataKey="met"
                name="Met Agency"
                stroke="#D32F2F"
                strokeWidth={2}
                dot={false} />
              
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </IntegrationLayout>);

}