import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { downloadFile, toCSV } from '../../lib/format';
export function WarningEffectiveness() {
  const { state, actions } = useApp();
  const [howOpen, setHowOpen] = useState(false);
  const report = () => {
    const byDistrict = new Map<string, {alerts: number;acked: number;hours: number;}>();
    state.alerts.forEach((a) => {
      const d = byDistrict.get(a.district) ?? { alerts: 0, acked: 0, hours: 0 };
      d.alerts += 1;
      if (a.acknowledgedAt) {
        d.acked += 1;
        d.hours += (new Date(a.acknowledgedAt).getTime() - new Date(a.triggeredAt).getTime()) / 3600000;
      }
      byDistrict.set(a.district, d);
    });
    downloadFile(
      'district-alert-performance.csv',
      toCSV(Array.from(byDistrict.entries()).map(([district, d]) => ({ district, alerts: d.alerts, acknowledged: d.acked, avg_hours_to_ack: d.acked ? (d.hours / d.acked).toFixed(1) : '' }))),
      'text/csv'
    );
    actions.toast('District performance report exported (CSV).', 'info');
  };
  return (
    <WarningLayout
      title="Alert Effectiveness Metrics"
      subtitle="Is Rwanda's early warning system actually saving lives? 2026 Year-to-Date"
      breadcrumb="Alert Effectiveness">
      
      {/* Top Row - KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Early Detection Rate
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-2">73%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div
              className="bg-epi-amber h-1.5 rounded-full"
              style={{
                width: '73%'
              }}>
            </div>
          </div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            Outbreaks detected before they peaked
          </p>
          <div className="mt-auto flex justify-between items-end">
            <span className="text-[10px] text-epi-muted">Target: &gt;80%</span>
            <span className="text-[11px] font-bold text-epi-amber">
              🟡 Below target
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Average Warning Lead Time
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">
            8.4{' '}
            <span className="text-[14px] font-normal text-epi-muted">days</span>
          </div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            Days of warning before outbreak peak
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#00A550] flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Improving
            </span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-epi-muted">
                Target: &gt;7 days
              </span>
              <span className="text-[11px] font-bold text-[#00A550]">
                🟢 Above target
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            False Alarm Rate
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">18%</div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            Alerts that did not become outbreaks
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <span className="text-[11px] font-bold text-epi-red flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> Need to reduce
            </span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-epi-muted">
                Target: &lt;15%
              </span>
              <span className="text-[11px] font-bold text-[#F97316]">
                🟠 Above target
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Estimated Lives Saved
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">340</div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            Estimated this year through early intervention
          </p>
          {howOpen &&
          <p className="text-[11px] text-epi-text bg-epi-bg rounded p-2 mb-2 leading-snug">
              Cases averted (forecast without action − observed) × disease-specific case fatality rate, summed across alerts acknowledged within 4 hours. Illustrative estimate.
            </p>
          }
          <div className="mt-auto flex justify-between items-end">
            <button onClick={() => setHowOpen(!howOpen)} className="text-[10px] font-bold text-epi hover:underline text-left">
              {howOpen ? 'Hide ↑' : 'How calculated →'}
            </button>
            <span className="text-[11px] font-bold text-[#00A550]">🟢</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Response Speed Improvement
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">
            34%{' '}
            <span className="text-[14px] font-normal text-epi-muted">
              faster
            </span>
          </div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            vs same period 2025
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#00A550] flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Strong improvement
            </span>
            <div className="flex justify-end items-end">
              <span className="text-[11px] font-bold text-[#00A550]">🟢</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Districts Meeting Target
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">22 / 30</div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            Districts responding within 4-hour window
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <Link to="/warning/history" className="text-[10px] font-bold text-epi hover:underline text-left">
              View underperforming districts →
            </Link>
            <div className="flex justify-end items-end">
              <span className="text-[11px] font-bold text-epi-amber">
                🟡 Below 100% target
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Scatter Plot */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            Alert Lead Time — Actual Outcomes (2026)
          </h2>

          <div className="relative flex-1 min-h-[300px] w-full mb-6">
            {/* Y Axis */}
            <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right pr-2">
              <span>High</span>
              <span>Med</span>
              <span>Low</span>
              <span>0</span>
            </div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-bold text-epi-muted tracking-wider">
              Final Case Count at Peak
            </div>

            {/* X Axis */}
            <div className="absolute left-12 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] text-epi-muted font-medium">
              <span>0 days</span>
              <span>5 days</span>
              <span>10 days</span>
              <span>15 days</span>
              <span>20 days</span>
            </div>
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[11px] font-bold text-epi-muted tracking-wider">
              Warning Lead Time
            </div>

            {/* Chart Area */}
            <div className="absolute left-12 right-0 top-0 bottom-6 border-l border-b border-border">
              {/* Grid */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-3">
                {[...Array(12)].map((_, i) =>
                <div
                  key={i}
                  className="border-t border-r border-dashed border-border/50">
                </div>
                )}
              </div>

              {/* Scatter Points (Simulated) */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 100">
                
                {/* Top Left Cluster (Short warning, high cases) */}
                <circle cx="5" cy="10" r="3" fill="#D32F2F" opacity="0.8" />
                <circle cx="8" cy="15" r="3" fill="#D32F2F" opacity="0.8" />
                <circle cx="12" cy="25" r="3" fill="#D32F2F" opacity="0.8" />
                <circle cx="15" cy="20" r="3" fill="#D32F2F" opacity="0.8" />
                <circle cx="10" cy="30" r="3" fill="#F59E0B" opacity="0.8" />

                {/* Middle Cluster */}
                <circle cx="30" cy="40" r="3" fill="#F59E0B" opacity="0.8" />
                <circle cx="35" cy="50" r="3" fill="#F59E0B" opacity="0.8" />
                <circle cx="40" cy="45" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="45" cy="60" r="3" fill="#F59E0B" opacity="0.8" />

                {/* Bottom Right Cluster (Long warning, low cases) */}
                <circle cx="60" cy="80" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="65" cy="85" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="70" cy="75" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="75" cy="90" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="80" cy="85" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="85" cy="95" r="3" fill="#00A550" opacity="0.8" />
                <circle cx="90" cy="80" r="3" fill="#00A550" opacity="0.8" />
              </svg>
            </div>
          </div>

          <div className="mt-auto bg-epi/5 border border-epi/20 p-4 rounded text-[13px] font-bold text-epi text-center">
            💡 Alerts with &gt;7 days lead time had 68% fewer peak cases
          </div>
        </div>

        {/* Right Panel - League Table */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              District Response Performance
            </h2>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    District
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Avg Response
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Alerts Ack'd
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-muted font-bold">
                    1
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Musanze
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    0.8h
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    100%
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550] text-center">
                    A+
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-muted font-bold">
                    2
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Gasabo
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    1.1h
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    100%
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550] text-center">
                    A+
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-muted font-bold">
                    3
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Huye
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    1.4h
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    97%
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550] text-center">
                    A
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={5}
                    className="p-2 text-center text-[12px] text-epi-muted">
                    
                    ...
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-muted font-bold">
                    28
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Ngororero
                  </td>
                  <td className="p-3 text-[13px] text-[#F97316] font-bold text-right">
                    5.4h
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    82%
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#F97316] text-center">
                    C
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-muted font-bold">
                    29
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Nyaruguru
                  </td>
                  <td className="p-3 text-[13px] text-[#F97316] font-bold text-right">
                    4.9h
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    85%
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#F97316] text-center">
                    C
                  </td>
                </tr>
                <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                  <td className="p-3 text-[13px] text-epi-muted font-bold">
                    30
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Gicumbi
                  </td>
                  <td className="p-3 text-[13px] text-epi-red font-bold text-right">
                    6.8h
                  </td>
                  <td className="p-3 text-[13px] text-epi-text text-right">
                    71%
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-red text-center">
                    D ⚠️
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-border mt-auto">
            <button onClick={report} className="w-full py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
              Generate District Performance Report
            </button>
          </div>
        </div>
      </div>
    </WarningLayout>);

}