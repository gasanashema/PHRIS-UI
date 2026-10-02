import { Link } from 'react-router-dom';
import {
  Plug,
  Brain,
  ClipboardCheck,
  Gauge,
  Lightbulb,
  FileClock } from
'lucide-react';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
const INDICATORS = [
{
  name: 'Under-5 Mortality Rate',
  current: '35/1,000',
  target: '25/1,000',
  gap: '-10',
  status: '🟠 Below Target',
  trend: '↓ Improving',
  pct: 67
},
{
  name: 'Maternal Mortality Rate',
  current: '203/100,000',
  target: '140/100,000',
  gap: '-63',
  status: '🟠 Below Target',
  trend: '↓ Improving',
  pct: 59
},
{
  name: 'Malaria Incidence',
  current: '45/1,000',
  target: '30/1,000',
  gap: '-15',
  status: '🟠 Below Target',
  trend: '↑ Worsening',
  pct: 50
},
{
  name: 'Vaccination Coverage',
  current: '92%',
  target: '95%',
  gap: '-3%',
  status: '🟡 Close',
  trend: '↑ Improving',
  pct: 92
},
{
  name: 'HIV Treatment Coverage',
  current: '87%',
  target: '95%',
  gap: '-8%',
  status: '🟡 Close',
  trend: '→ Stable',
  pct: 87
},
{
  name: 'Stunting Rate (children)',
  current: '33%',
  target: '19%',
  gap: '-14%',
  status: '🔴 Far from target',
  trend: '→ Stable',
  pct: 42
}];

export function AnalystOverview() {
  return (
    <AnalystLayout
      title="Analyst Overview"
      subtitle="Thursday, June 5, 2026 | National Health Intelligence Center | Last AI analysis run: 3 hours ago"
      breadcrumb="Analyst Overview">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-border rounded-lg p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Plug className="w-4 h-4 text-epi" /> Data Sources Active
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">8 / 10</div>
          <div className="h-1.5 bg-epi-bg rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-epi rounded-full"
              style={{
                width: '80%'
              }} />
            
          </div>
          <div className="text-[11px] text-epi-muted mb-1">
            2 sources delayed — Met Agency, MINAGRI
          </div>
          <div className="text-[11px] font-bold text-epi-amber mt-auto">
            🟡 Partial
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Brain className="w-4 h-4 text-epi" /> Last Analysis Run
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">3h ago</div>
          <div className="text-[11px] text-epi-muted mb-1">
            Next scheduled: 12:00 PM today
          </div>
          <div className="text-[11px] font-bold text-epi-accent mt-auto">
            🟢 Up to date
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-card flex flex-col justify-between relative">
          <div className="absolute top-4 right-4 bg-[#FEF08A] text-[#A16207] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-[#FDE047]">
            Needs attention
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <ClipboardCheck className="w-4 h-4 text-epi" /> Pending Data Reviews
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">4</div>
          <div className="text-[11px] text-epi-muted mb-2">
            2 flagged for quality issues
          </div>
          <Link
            to="/analyst/data-quality"
            className="text-[11px] font-bold text-epi hover:underline mt-auto">
            
            Review now →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Gauge className="w-4 h-4 text-epi-amber" /> National Risk Score
          </div>
          <div className="text-[24px] font-bold text-epi-amber mb-1">
            61 / 100
          </div>
          <div className="text-[11px] text-epi-muted mb-1">
            2 districts at critical level
          </div>
          <div className="text-[11px] font-bold text-epi-amber mt-auto">
            ↑ +4 pts this week
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Lightbulb className="w-4 h-4 text-epi" /> New Insights Flagged
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">3</div>
          <div className="text-[11px] text-epi-muted mb-2">
            AI flagged 3 new patterns since yesterday
          </div>
          <Link
            to="/analyst/explore"
            className="text-[11px] font-bold text-epi hover:underline mt-auto">
            
            View insights →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <FileClock className="w-4 h-4 text-epi" /> Reports Due This Week
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">2</div>
          <div className="text-[11px] text-epi-muted space-y-1 mt-auto">
            <div className="truncate">• Weekly Health Brief — due Monday</div>
            <div className="truncate">
              • UNICEF Vulnerability Profile — due Friday
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[60%_40%] gap-6">
        {/* Left Panel */}
        <div className="bg-white rounded-lg shadow-card border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              Rwanda Vision 2050 — Health Targets Progress
            </h2>
            <p className="text-[13px] text-epi-muted">June 2026 status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Indicator</th>
                  <th className="px-4 py-3">Current</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Gap</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INDICATORS.map((row, i) =>
                <tr key={i} className="hover:bg-epi-bg/30">
                    <td className="px-4 py-3">
                      <div className="font-bold text-epi-text mb-1">
                        {row.name}
                      </div>
                      <div className="h-1.5 bg-epi-bg rounded-full overflow-hidden w-32">
                        <div
                        className={`h-full rounded-full ${row.status.includes('Far') ? 'bg-epi-red' : row.status.includes('Below') ? 'bg-epi-amber' : 'bg-[#EAB308]'}`}
                        style={{
                          width: `${row.pct}%`
                        }} />
                      
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.current}
                    </td>
                    <td className="px-4 py-3 text-epi-muted">{row.target}</td>
                    <td className="px-4 py-3 font-medium text-epi-red">
                      {row.gap}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.status}</td>
                    <td
                    className={`px-4 py-3 font-medium ${row.trend.includes('Improving') ? 'text-epi-accent' : row.trend.includes('Worsening') ? 'text-epi-red' : 'text-epi-muted'}`}>
                    
                      {row.trend}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border mt-auto">
            <Link
              to="/analyst/indicators"
              className="text-[13px] font-bold text-epi hover:underline">
              
              View Full Indicators →
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-lg shadow-card border border-border p-5 flex flex-col h-fit">
          <div className="mb-4">
            <h2 className="text-[16px] font-bold text-epi-text">
              AI-Flagged Insights
            </h2>
            <p className="text-[13px] text-epi-muted">
              New patterns detected in the last 24 hours
            </p>
          </div>

          <div className="space-y-3">
            {/* Insight 1 */}
            <div className="border-l-4 border-l-epi border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi mb-1">
                💡 CORRELATION DETECTED
              </div>
              <div className="text-[13px] text-epi-text leading-relaxed mb-3">
                Strong link found between low sanitation coverage and rising
                cholera cases in Western Province (r = 0.87). Districts with
                WASH coverage below 60% have 4× more cholera cases.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-epi-muted">
                  Detected 2h ago
                </span>
                <Link
                  to="/analyst/correlation"
                  className="text-[12px] font-bold text-epi hover:underline">
                  
                  Explore →
                </Link>
              </div>
            </div>

            {/* Insight 2 */}
            <div className="border-l-4 border-l-epi-amber border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi-amber mb-1">
                ⚠️ TARGET AT RISK
              </div>
              <div className="text-[13px] text-epi-text leading-relaxed mb-3">
                At current malaria trajectory, Rwanda will miss the 2026 malaria
                incidence target by an estimated 34%. Kayonza and Bugesera are
                primary drivers.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-epi-muted">
                  Detected 5h ago
                </span>
                <Link
                  to="/analyst/explore"
                  className="text-[12px] font-bold text-epi hover:underline">
                  
                  Explore →
                </Link>
              </div>
            </div>

            {/* Insight 3 */}
            <div className="border-l-4 border-l-epi-info border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi-info mb-1">
                📈 POSITIVE TREND
              </div>
              <div className="text-[13px] text-epi-text leading-relaxed mb-3">
                HIV treatment coverage in Northern Province improved from 81% to
                89% over 6 months, linked to increased CHW community tracing
                activity.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-epi-muted">
                  Detected Yesterday
                </span>
                <Link
                  to="/analyst/explore"
                  className="text-[12px] font-bold text-epi hover:underline">
                  
                  Explore →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}