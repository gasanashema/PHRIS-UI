import React from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { ArrowDown } from 'lucide-react';
export function WarningEscalation() {
  return (
    <WarningLayout
      title="Alert Escalation Manager"
      subtitle="Automatic escalation when districts do not respond in time"
      breadcrumb="Escalation Manager">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flowchart */}
        <div className="lg:col-span-12 bg-white rounded-lg shadow-card border border-border p-8 mb-2">
          <h2 className="text-[18px] font-bold text-epi-text mb-8 text-center">
            Rwanda 5-Level Escalation Pathway
          </h2>

          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Level 1 */}
            <div className="w-full bg-epi/10 border-2 border-epi rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-epi mb-2">
                👤 Level 1: District Health Officer
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                Notified immediately on alert
              </div>
              <div className="text-[13px] font-bold text-epi-text">
                4-hour response window
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                No response in 4 hours? Automated → Level 2
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 2 */}
            <div className="w-full bg-epi-amber/10 border-2 border-epi-amber rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-epi-amber mb-2">
                🏛️ Level 2: Provincial Health Director
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                Notified automatically
              </div>
              <div className="text-[13px] font-bold text-epi-text">
                4-hour response window
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                No response or situation worsens? Automated → Level 3
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 3 */}
            <div className="w-full bg-[#F97316]/10 border-2 border-[#F97316] rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-[#F97316] mb-2">
                🔬 Level 3: RBC Epidemiology Division
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                Notified — outbreak investigation
              </div>
              <div className="text-[13px] font-bold text-epi-text">
                4-hour response window
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                Outbreak confirmed? Automated → Level 4
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 4 */}
            <div className="w-full bg-epi-red/10 border-2 border-epi-red rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-epi-red mb-2">
                🏥 Level 4: Ministry of Health
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                National emergency protocols triggered
              </div>
            </div>

            <div className="h-12 flex flex-col items-center justify-center relative w-full">
              <div className="w-0.5 h-full bg-border"></div>
              <div className="absolute bg-white px-2 text-[11px] font-bold text-epi-muted">
                National emergency declared? Automated → Level 5
              </div>
              <ArrowDown className="absolute bottom-0 w-4 h-4 text-border translate-y-1/2" />
            </div>

            {/* Level 5 */}
            <div className="w-full bg-[#7B0000]/10 border-2 border-[#7B0000] rounded-lg p-4 text-center relative">
              <div className="text-[16px] font-bold text-[#7B0000] mb-2">
                🌍 Level 5: WHO Rwanda Country Office
              </div>
              <div className="text-[13px] text-epi-text mb-1">
                International health regulations activated
              </div>
            </div>
          </div>
        </div>

        {/* Pending Auto-Escalation Card */}
        <div className="lg:col-span-12 bg-[#F97316]/10 border-2 border-[#F97316] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded animate-pulse">
                ⚠️ AUTO-ESCALATION PENDING
              </span>
              <span className="text-[16px] font-bold text-epi-text">
                ALT-2026-003 (Measles — Gicumbi)
              </span>
            </div>
            <p className="text-[14px] text-epi-text mb-2">
              Gicumbi District Health Officer has not responded in{' '}
              <span className="font-bold text-epi-red">
                22 hours 13 minutes
              </span>
              .
            </p>
            <p className="text-[14px] text-epi-text font-medium mb-3">
              Automatic escalation to Northern Province Director in{' '}
              <span className="font-bold text-[#F97316]">47 minutes</span>.
            </p>
            <div className="text-[13px] text-epi-muted">
              Contact: Dr. Marie Mukamana —{' '}
              <span className="font-bold text-epi-text">+250 788 200 300</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-64">
            <button className="w-full py-3 bg-epi-red text-white text-[14px] font-bold rounded-md hover:bg-epi-red/90 transition-colors shadow-sm">
              Escalate Now — Don't Wait
            </button>
            <button className="w-full py-2 bg-white border border-[#F97316] text-[#F97316] text-[13px] font-bold rounded-md hover:bg-[#F97316]/10 transition-colors">
              Send SMS Reminder to DHO
            </button>
            <button className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
              Override — Mark as In Progress
            </button>
          </div>
        </div>

        {/* Active Escalation Status Table */}
        <div className="lg:col-span-12 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              Active Escalation Status
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Alert
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Current Level
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Time at Level
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Escalated To
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Next Escalation
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                    ALT-2026-001
                  </td>
                  <td className="p-4 text-[13px] font-bold text-[#F97316]">
                    Level 3 — RBC
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">18 hours</td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Dr. Jean Paul Habimana
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted">
                    Level 4 if not resolved in 6h
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    +250 788 000 001
                  </td>
                  <td className="p-4 text-[13px] text-epi font-medium text-right">
                    <button className="hover:underline">View</button> ·{' '}
                    <button className="hover:underline">Override</button>
                  </td>
                </tr>
                <tr className="bg-[#F97316]/5 hover:bg-[#F97316]/10">
                  <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                    ALT-2026-003
                  </td>
                  <td className="p-4 text-[13px] font-bold text-epi">
                    Level 1 — District
                  </td>
                  <td className="p-4 text-[13px] font-bold text-epi-red">
                    22h 13m ⚠️
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Gicumbi DHO — no response
                  </td>
                  <td className="p-4 text-[13px] font-bold text-[#F97316]">
                    AUTO-ESCALATE in 47 min
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    +250 788 200 300
                  </td>
                  <td className="p-4 text-[13px] text-epi font-medium text-right">
                    <button className="text-epi-red hover:underline">
                      Escalate Now
                    </button>{' '}
                    · <button className="hover:underline">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WarningLayout>);

}