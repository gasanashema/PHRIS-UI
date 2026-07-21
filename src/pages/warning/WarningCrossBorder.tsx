import React from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
export function WarningCrossBorder() {
  return (
    <WarningLayout
      title="Cross-Border Disease Surveillance"
      subtitle="Disease situations in DRC, Uganda, Burundi, and Tanzania — automatic Rwanda border risk assessment"
      breadcrumb="Cross-Border Alerts">
      
      {/* Top Banner */}
      <div className="bg-epi-red text-white p-4 rounded-lg shadow-sm mb-6">
        <div className="font-bold text-[14px] mb-2">
          🌍 ACTIVE CROSS-BORDER THREATS:
        </div>
        <div className="flex flex-col md:flex-row gap-4 text-[13px]">
          <div className="flex-1 bg-black/20 p-3 rounded">
            <div className="font-bold mb-1">
              DRC South Kivu — Cholera ACTIVE
            </div>
            <div>
              Risk to Rusizi District:{' '}
              <span className="font-bold">🔴 VERY HIGH</span>
            </div>
          </div>
          <div className="flex-1 bg-black/20 p-3 rounded">
            <div className="font-bold mb-1">DRC North Kivu — Mpox ACTIVE</div>
            <div>
              Risk to Rubavu District:{' '}
              <span className="font-bold text-[#F97316]">🟠 HIGH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="relative w-full h-[400px] bg-[#E5E7EB] rounded-lg border border-border overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#104E49 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
          </div>

          {/* Simulated Map */}
          <div className="relative w-full max-w-3xl h-full">
            {/* Neighbor Labels */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 text-[16px] font-bold text-epi-muted/50 -rotate-90 tracking-widest">
              D R C
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[16px] font-bold text-epi-muted/50 tracking-widest">
              U G A N D A
            </div>
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-[16px] font-bold text-epi-muted/50 rotate-90 tracking-widest">
              T A N Z A N I A
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[16px] font-bold text-epi-muted/50 tracking-widest">
              B U R U N D I
            </div>

            {/* Border Districts */}
            {/* Rusizi */}
            <div className="absolute bottom-16 left-16 w-24 h-24 bg-epi-red/20 border-2 border-dashed border-epi-red rounded-lg flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-epi-text bg-white/80 px-1 rounded mb-1">
                Rusizi
              </span>
              <div className="w-4 h-4 bg-epi-red rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="absolute bottom-20 left-4 text-[10px] font-bold text-epi-red bg-white px-1 rounded shadow-sm">
              Cholera + Mpox
            </div>

            {/* Nyamasheke */}
            <div className="absolute bottom-40 left-16 w-20 h-20 bg-epi-amber/20 border-2 border-dashed border-epi-amber rounded-lg flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-epi-text bg-white/80 px-1 rounded">
                Nyamasheke
              </span>
            </div>

            {/* Rubavu */}
            <div className="absolute top-32 left-24 w-20 h-20 bg-[#F97316]/20 border-2 border-dashed border-[#F97316] rounded-lg flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-epi-text bg-white/80 px-1 rounded mb-1">
                Rubavu
              </span>
              <div className="w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="absolute top-36 left-10 text-[10px] font-bold text-[#F97316] bg-white px-1 rounded shadow-sm">
              Mpox
            </div>

            {/* Musanze */}
            <div className="absolute top-16 left-1/3 w-24 h-16 bg-epi-amber/20 border-2 border-dashed border-epi-amber rounded-lg flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-epi-text bg-white/80 px-1 rounded mb-1">
                Musanze
              </span>
              <div className="w-3 h-3 bg-epi-amber rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="absolute top-10 left-1/3 text-[10px] font-bold text-epi-amber bg-white px-1 rounded shadow-sm">
              Ebola watch
            </div>

            {/* Burera */}
            <div className="absolute top-16 left-1/2 w-20 h-16 bg-epi-amber/20 border-2 border-dashed border-epi-amber rounded-lg flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-epi-text bg-white/80 px-1 rounded">
                Burera
              </span>
            </div>

            {/* Kirehe */}
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-[#00A550]/10 border-2 border-dashed border-[#00A550] rounded-lg flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-epi-text bg-white/80 px-1 rounded mb-1">
                Kirehe
              </span>
              <div className="w-3 h-3 bg-[#00A550] rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table */}
        <div className="lg:col-span-8 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Country/Region
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Disease
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Risk to Rwanda
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Affected Districts
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Threshold Adj.
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    DRC — South Kivu
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">Cholera</td>
                  <td className="p-4 text-[13px] font-bold text-epi-red">
                    🔴 Active outbreak
                  </td>
                  <td className="p-4 text-[13px] font-bold text-epi-red">
                    🔴 Very High
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Rusizi, Nyamasheke
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted italic">
                    Thresholds lowered 40%
                  </td>
                  <td className="p-4 text-[12px] text-epi-muted">
                    June 4, 2026
                    <br />
                    (WHO AFRO)
                  </td>
                </tr>
                <tr className="bg-[#F97316]/5 hover:bg-[#F97316]/10">
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    DRC — North Kivu
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">Mpox</td>
                  <td className="p-4 text-[13px] font-bold text-epi-red">
                    🔴 Active outbreak
                  </td>
                  <td className="p-4 text-[13px] font-bold text-[#F97316]">
                    🟠 High
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Rubavu, Nyabihu
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted italic">
                    Thresholds lowered 30%
                  </td>
                  <td className="p-4 text-[12px] text-epi-muted">
                    June 4, 2026
                    <br />
                    (WHO AFRO)
                  </td>
                </tr>
                <tr className="bg-epi-amber/5 hover:bg-epi-amber/10">
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    Uganda — Southwestern
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">Ebola</td>
                  <td className="p-4 text-[13px] font-bold text-epi-amber">
                    🟡 Watch — 2 suspected
                  </td>
                  <td className="p-4 text-[13px] font-bold text-epi-amber">
                    🟡 Moderate
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Musanze, Burera, Gakenke
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted italic">
                    Thresholds lowered 20%
                  </td>
                  <td className="p-4 text-[12px] text-epi-muted">
                    June 3, 2026
                    <br />
                    (WHO Uganda)
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    Burundi — Northern
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">Malaria</td>
                  <td className="p-4 text-[13px] font-bold text-[#F97316]">
                    🟠 Elevated
                  </td>
                  <td className="p-4 text-[13px] font-bold text-epi-amber">
                    🟡 Moderate
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Kirehe, Ngoma
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted italic">
                    No change — within normal
                  </td>
                  <td className="p-4 text-[12px] text-epi-muted">
                    June 2, 2026
                    <br />
                    (Burundi MOH)
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    Tanzania
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    No active threats
                  </td>
                  <td className="p-4 text-[13px] font-bold text-[#00A550]">
                    🟢 Normal
                  </td>
                  <td className="p-4 text-[13px] font-bold text-[#00A550]">
                    🟢 Low
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    Ngara border
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted italic">
                    None
                  </td>
                  <td className="p-4 text-[12px] text-epi-muted">
                    June 1, 2026
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Note Card */}
        <div className="lg:col-span-4">
          <div className="bg-epi/10 border border-epi/20 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[20px]">💡</span>
              <h3 className="text-[14px] font-bold text-epi-text">
                Cross-Border Threshold Logic
              </h3>
            </div>
            <p className="text-[13px] text-epi-text leading-relaxed mb-4">
              When DRC, Uganda, or Burundi reports an active outbreak, AI Vital
              automatically lowers alert thresholds in Rwanda's border districts
              for that disease — without waiting for Rwanda cases to appear.
            </p>
            <p className="text-[13px] text-epi-text leading-relaxed">
              This gives Rwanda's DHOs advance warning to prepare.
            </p>
          </div>
        </div>
      </div>
    </WarningLayout>);

}