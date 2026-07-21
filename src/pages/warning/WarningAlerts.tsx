import React from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { ChevronDown } from 'lucide-react';
export function WarningAlerts() {
  return (
    <WarningLayout
      title="Active Alerts"
      subtitle="15 active alerts requiring attention — Rwanda national view"
      breadcrumb="Active Alerts">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Severity: All ▼</option>
            <option>🔴 Red (2)</option>
            <option>🟠 Orange (5)</option>
            <option>🟡 Yellow (8)</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Disease: All Diseases ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>District: All Districts ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Status: All</option>
            <option>Pending</option>
            <option>Acknowledged</option>
            <option>Escalated</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Sort: Most Recent ▼</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm whitespace-nowrap">
          Export Alert Report
        </button>
      </div>

      <div className="space-y-4">
        {/* ALERT CARD 1 — Red, expanded */}
        <div className="bg-white rounded-lg shadow-card border-t-4 border-t-epi-red border-x border-b border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-epi-red/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-epi-red">
                🔴 RED ALERT
              </span>
              <span className="text-border">|</span>
              <span className="text-[13px] font-mono font-bold text-epi-text">
                ALT-2026-001
              </span>
              <span className="text-border">|</span>
              <span className="text-[13px] text-epi-muted">
                Triggered 2 days ago — June 3, 09:15 AM
              </span>
            </div>
            <div className="text-[12px] font-bold text-[#00A550] bg-[#00A550]/10 px-3 py-1 rounded-full">
              ✅ Acknowledged
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1 */}
            <div>
              <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Alert Info
              </h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-epi-muted">Disease:</span>{' '}
                  <span className="font-bold text-epi-text">Cholera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">District:</span>{' '}
                  <span className="font-bold text-epi-text">
                    Rusizi District
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Sector:</span>{' '}
                  <span className="text-epi-text">Bugarama Sector</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Province:</span>{' '}
                  <span className="text-epi-text">Western Province</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-epi-muted">Outbreak probability:</span>{' '}
                  <span className="font-bold text-epi-red">91% 🔴</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">AI Risk Score:</span>{' '}
                  <span className="font-bold text-epi-text">91/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Cases this week:</span>{' '}
                  <span className="font-bold text-epi-red">
                    87 cases (+45% WoW)
                  </span>
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Why Triggered
              </h3>
              <div className="text-[13px] font-bold text-epi-text mb-2">
                Trigger conditions met:
              </div>
              <ul className="space-y-1.5 text-[12px] text-epi-muted mb-3">
                <li className="flex items-start gap-2">
                  <span>✅</span>{' '}
                  <span>Cases (87) &gt; Red threshold (50)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span> <span>Growth rate (+45%) &gt; 30% rule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>{' '}
                  <span>AI probability (91%) &gt; 60% rule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span> <span>Water quality (2/10) &lt; 5/10</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>{' '}
                  <span>Doubling time (4.2 days) &lt; 5 days</span>
                </li>
              </ul>
              <div className="text-[12px] font-bold text-epi-red bg-epi-red/10 p-2 rounded">
                5 of 5 trigger rules met — maximum severity
              </div>
            </div>

            {/* Col 3 */}
            <div>
              <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Response Status
              </h3>
              <div className="space-y-4 text-[13px]">
                <div>
                  <div className="text-epi-muted mb-1">Acknowledged by:</div>
                  <div className="font-bold text-epi-text">
                    Dr. Aline Uwimana (Rusizi DHO)
                  </div>
                  <div className="text-[11px] text-epi-muted">
                    June 3, 10:30 AM (1h 15min later)
                  </div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">Response note:</div>
                  <div className="bg-epi-bg p-2 rounded border border-border italic text-epi-text">
                    "ORS deployed to Bugarama HC. Water inspection team
                    dispatched."
                  </div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">
                    Current escalation level:
                  </div>
                  <div className="font-bold text-[#F97316]">
                    Level 3 — RBC Epidemiology notified June 3, 2PM
                  </div>
                  <div className="text-[11px] text-epi-muted mt-1">
                    Next escalation: None (all levels responding)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-epi-bg/30 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
              View Full Details
            </button>
            <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg transition-colors">
              Add Response Note
            </button>
            <button className="px-4 py-2 bg-white border border-[#00A550] text-[#00A550] text-[13px] font-bold rounded hover:bg-[#00A550]/10 transition-colors">
              Mark Resolved
            </button>
            <button className="px-4 py-2 bg-white border border-epi-red text-epi-red text-[13px] font-bold rounded hover:bg-epi-red/10 transition-colors ml-auto">
              Escalate to WHO
            </button>
          </div>
        </div>

        {/* ALERT CARD 2 — Orange, expanded */}
        <div className="bg-white rounded-lg shadow-card border-t-4 border-t-[#F97316] border-x border-b border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-[#F97316]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[#F97316]">
                🟠 ORANGE ALERT
              </span>
              <span className="text-border">|</span>
              <span className="text-[13px] font-mono font-bold text-epi-text">
                ALT-2026-002
              </span>
              <span className="text-border">|</span>
              <span className="text-[13px] text-epi-muted">June 4, 14:22</span>
            </div>
            <div className="text-[12px] font-bold text-[#00A550] bg-[#00A550]/10 px-3 py-1 rounded-full">
              ✅ Acknowledged
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1 */}
            <div>
              <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Alert Info
              </h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-epi-muted">Disease:</span>{' '}
                  <span className="font-bold text-epi-text">Malaria</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">District:</span>{' '}
                  <span className="font-bold text-epi-text">Kayonza</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Sector:</span>{' '}
                  <span className="text-epi-text">Rwinkwavu Sector</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-epi-muted">Probability:</span>{' '}
                  <span className="font-bold text-[#F97316]">74%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Cases:</span>{' '}
                  <span className="font-bold text-[#F97316]">
                    67 (+18% WoW)
                  </span>
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Why Triggered
              </h3>
              <ul className="space-y-1.5 text-[12px] text-epi-muted">
                <li className="flex items-start gap-2">
                  <span>✅</span>{' '}
                  <span>Cases (67) &gt; Orange threshold (50)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>{' '}
                  <span>AI probability (74%) &gt; 60% rule</span>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Response Status
              </h3>
              <div className="space-y-4 text-[13px]">
                <div>
                  <div className="text-epi-muted mb-1">Acknowledged by:</div>
                  <div className="font-bold text-epi-text">Kayonza DHO</div>
                  <div className="text-[11px] text-epi-muted">
                    June 4, 15:47 (1h 25min later)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-epi-bg/30 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
              View Details
            </button>
            <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg transition-colors">
              Add Response Note
            </button>
            <button className="px-4 py-2 bg-white border border-[#00A550] text-[#00A550] text-[13px] font-bold rounded hover:bg-[#00A550]/10 transition-colors">
              Mark Resolved
            </button>
          </div>
        </div>

        {/* ALERT CARD 3 — Orange, PENDING */}
        <div className="bg-white rounded-lg shadow-card border-t-4 border-t-[#F97316] border-x border-b border-border overflow-hidden relative">
          <div className="absolute inset-0 bg-epi-amber/5 animate-pulse pointer-events-none"></div>
          <div className="p-5 border-b border-border bg-[#F97316]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[#F97316]">
                🟠 ORANGE ALERT
              </span>
              <span className="text-border">|</span>
              <span className="text-[13px] font-mono font-bold text-epi-text">
                ALT-2026-003
              </span>
              <span className="text-border">|</span>
              <span className="text-[13px] text-epi-muted">June 4, 16:00</span>
            </div>
            <div className="text-[12px] font-bold text-epi-amber bg-epi-amber/20 px-3 py-1 rounded-full border border-epi-amber/30">
              ⚠️ PENDING — NOT ACKNOWLEDGED
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <div className="text-[16px] font-bold text-epi-text mb-2">
                Gicumbi District | Measles | Mukarange Sector
              </div>
              <div className="text-[13px] text-epi-text bg-epi-bg p-3 rounded border border-border">
                Gicumbi DHO has not responded. Auto-escalation to Provincial
                Director in: 47 minutes
              </div>
            </div>
            <div className="flex flex-col justify-center items-end">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                Countdown timer:
              </div>
              <div className="text-[32px] font-mono font-bold text-epi-amber">
                00:47:12
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-epi-bg/30 flex flex-wrap gap-3 relative z-10">
            <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
              View Details
            </button>
            <button className="px-4 py-2 bg-epi-red text-white text-[13px] font-bold rounded hover:bg-epi-red/90 transition-colors">
              Escalate Now — Don't Wait
            </button>
            <button className="px-4 py-2 bg-epi-amber text-epi-text text-[13px] font-bold rounded hover:bg-epi-amber/90 transition-colors">
              Send SMS Reminder
            </button>
          </div>
        </div>

        {/* ALERT CARDS 4-8: Yellow collapsed */}
        {[4, 5, 6, 7, 8].map((num) =>
        <div
          key={num}
          className="bg-white rounded-lg shadow-sm border-l-4 border-l-epi-amber border-y border-r border-border p-4 flex items-center justify-between cursor-pointer hover:bg-epi-bg/50 transition-colors">
          
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-bold text-epi-amber">
                🟡 YELLOW
              </span>
              <span className="text-[13px] font-mono text-epi-muted">
                ALT-2026-00{num + 3}
              </span>
              <span className="text-[13px] font-bold text-epi-text">
                Typhoid | Nyamagabe
              </span>
              <span className="text-[12px] text-epi-muted">4h ago</span>
            </div>
            <ChevronDown className="w-5 h-5 text-epi-muted" />
          </div>
        )}
      </div>
    </WarningLayout>);

}