import React from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
export function WarningDetail() {
  return (
    <WarningLayout
      title="Alert Detail — ALT-2026-001"
      subtitle="Full investigation record and response timeline"
      breadcrumb="Alert Detail">
      
      {/* Status Banner */}
      <div className="bg-epi-red text-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-bold text-[14px] leading-relaxed">
          🔴 RED ALERT — ALT-2026-001 | Cholera | Rusizi District, Bugarama
          Sector
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium opacity-90">
          <span>Triggered: June 3, 2026 09:15 AM</span>
          <span className="hidden md:inline">|</span>
          <span>Status: Active — Day 2</span>
          <span className="hidden md:inline">|</span>
          <span>Acknowledged: ✅ Dr. Aline Uwimana</span>
          <span className="hidden md:inline">|</span>
          <span>Current Level: Level 3 — RBC</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-border mb-6 no-scrollbar">
        <button className="px-6 py-3 text-[13px] font-bold text-epi border-b-2 border-epi whitespace-nowrap">
          Overview
        </button>
        <button className="px-6 py-3 text-[13px] font-bold text-epi-muted hover:text-epi-text whitespace-nowrap">
          Why Triggered
        </button>
        <button className="px-6 py-3 text-[13px] font-bold text-epi-muted hover:text-epi-text whitespace-nowrap">
          Recommended Actions
        </button>
        <button className="px-6 py-3 text-[13px] font-bold text-epi-muted hover:text-epi-text whitespace-nowrap">
          Response Timeline
        </button>
        <button className="px-6 py-3 text-[13px] font-bold text-epi-muted hover:text-epi-text whitespace-nowrap">
          Notifications Sent
        </button>
        <button className="px-6 py-3 text-[13px] font-bold text-epi-muted hover:text-epi-text whitespace-nowrap">
          Related Predictions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-epi-text">
                Alert Profile
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Alert ID:</span>
                <span className="font-mono font-bold text-epi-text">
                  ALT-2026-001
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Disease:</span>
                <span className="font-bold text-epi-text text-right">
                  Cholera
                  <br />
                  <span className="text-[11px] font-normal text-epi-muted">
                    (Vibrio cholerae — Lab confirmed)
                  </span>
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">District:</span>
                <span className="font-bold text-epi-text">Rusizi District</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Sector:</span>
                <span className="text-epi-text">Bugarama Sector</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Province:</span>
                <span className="text-epi-text">Western Province</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Population in sector:</span>
                <span className="text-epi-text">~28,000</span>
              </div>

              <div className="col-span-1 md:col-span-2 mt-4 mb-2">
                <div className="text-epi-muted mb-1">Triggered by:</div>
                <div className="font-bold text-epi-text">
                  AI Risk Score crossing Red threshold
                </div>
              </div>

              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Risk Score at trigger:</span>
                <span className="font-bold text-epi-text">89/100</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Current risk score:</span>
                <span className="font-bold text-epi-red">91/100 (rising)</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Outbreak probability:</span>
                <span className="font-bold text-epi-red">91%</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Cases at trigger:</span>
                <span className="text-epi-text">67 cases</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Current cases:</span>
                <span className="font-bold text-epi-red">87 cases</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Deaths:</span>
                <span className="font-bold text-epi-red">3 (CFR: 3.4%)</span>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-between border-b border-border pb-2">
                <span className="text-epi-muted">Lab status:</span>
                <span className="font-bold text-[#00A550] text-right">
                  ✅ Confirmed — RBC Lab, June 3, 3PM
                </span>
              </div>
            </div>

            <div className="border-t border-border">
              <div className="p-5 border-b border-border bg-epi-bg/30">
                <h3 className="text-[14px] font-bold text-epi-text">
                  Trigger conditions met
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-epi-bg border-b border-border">
                      <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                        Value
                      </th>
                      <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                        Threshold
                      </th>
                      <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                        Met?
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] text-epi-text">
                        Case count
                      </td>
                      <td className="p-3 text-[13px] font-bold text-epi-red">
                        87/week
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        50 = red
                      </td>
                      <td className="p-3 text-center">✅ Yes</td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] text-epi-text">
                        Growth rate
                      </td>
                      <td className="p-3 text-[13px] font-bold text-epi-red">
                        +45%/week
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        +30% = orange
                      </td>
                      <td className="p-3 text-center">✅ Yes</td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] text-epi-text">
                        AI probability
                      </td>
                      <td className="p-3 text-[13px] font-bold text-epi-red">
                        91%
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        &gt;75% = red
                      </td>
                      <td className="p-3 text-center">✅ Yes</td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] text-epi-text">
                        Water quality
                      </td>
                      <td className="p-3 text-[13px] font-bold text-epi-red">
                        2/10
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        &lt;5/10
                      </td>
                      <td className="p-3 text-center">✅ Yes</td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] text-epi-text">
                        Doubling time
                      </td>
                      <td className="p-3 text-[13px] font-bold text-epi-red">
                        4.2 days
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        &lt;5 days = red
                      </td>
                      <td className="p-3 text-center">✅ Yes</td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] text-epi-text">
                        DRC border signal
                      </td>
                      <td className="p-3 text-[13px] font-bold text-epi-amber">
                        Active
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        DRC cholera active
                      </td>
                      <td className="p-3 text-center">✅ Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-4 flex items-center gap-2">
              🚁 Nearest Rapid Response Team
            </h2>
            <div className="bg-epi-bg/50 p-4 rounded border border-border mb-4">
              <div className="text-[14px] font-bold text-epi-text mb-3">
                RRT Western Province:
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-epi-muted">Team Leader:</span>{' '}
                  <span className="font-bold">Dr. Patrick Bizimana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Phone:</span>{' '}
                  <span>+250 788 100 200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">SMS:</span>{' '}
                  <span>+250 788 100 200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Location:</span>{' '}
                  <span className="text-right">
                    Karongi District
                    <br />
                    <span className="text-[11px]">(2.5h from Rusizi)</span>
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-epi-muted">Status:</span>{' '}
                  <span className="font-bold text-[#F97316]">
                    🟠 On alert — not yet deployed
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full py-3 bg-epi-red text-white text-[14px] font-bold rounded-md hover:bg-epi-red/90 transition-colors shadow-sm">
                Activate RRT
              </button>
              <button className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
                Call Team Leader
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">
              Who Was Notified
            </h2>
            <div className="space-y-4">
              <div className="pb-3 border-b border-border">
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  Dr. Aline Uwimana (Rusizi DHO)
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-epi-muted">
                  <span>📱 SMS ✅</span>
                  <span>📧 Email ✅</span>
                  <span>👁️ Read ✅</span>
                  <span className="text-[#00A550] font-bold">
                    ✅ Acknowledged
                  </span>
                </div>
              </div>
              <div className="pb-3 border-b border-border">
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  RBC Epidemiology Division
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-epi-muted">
                  <span>📧 Email ✅</span>
                  <span>👁️ Read ✅</span>
                </div>
              </div>
              <div className="pb-3 border-b border-border">
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  Dr. Jean Paul Habimana (Epi, RBC)
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-epi-muted">
                  <span>📧 Email ✅</span>
                  <span>📱 SMS ✅</span>
                  <span>👁️ Read ✅</span>
                </div>
              </div>
              <div className="pb-3 border-b border-border">
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  Southern Province Director
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-epi-muted">
                  <span>📧 Email ✅</span>
                  <span>👁️ Read ✅</span>
                </div>
              </div>
              <div>
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  WHO Rwanda Country Office
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium text-epi-muted">
                  <span>📧 Email ✅</span>
                  <span>👁️ Read ✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WarningLayout>);

}