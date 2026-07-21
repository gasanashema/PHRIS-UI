import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
export function ProcessingGeographic() {
  return (
    <ProcessingLayout
      title="Geographic Aggregation"
      subtitle="Rwanda administrative hierarchy data rollup — Village → Sector → District → Province → National"
      breadcrumb="Geographic Aggregation">
      
      {/* Top Hierarchy Selector */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button className="px-5 py-2.5 rounded-full text-[14px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors flex items-center gap-2 shadow-sm">
          <span>🏘️</span> Village/Cell
        </button>
        <button className="px-5 py-2.5 rounded-full text-[14px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors flex items-center gap-2 shadow-sm">
          <span>📍</span> Sector
        </button>
        <button className="px-5 py-2.5 rounded-full text-[14px] font-bold bg-epi text-white flex items-center gap-2 shadow-sm">
          <span>🏛️</span> District
        </button>
        <button className="px-5 py-2.5 rounded-full text-[14px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors flex items-center gap-2 shadow-sm">
          <span>🗺️</span> Province
        </button>
        <button className="px-5 py-2.5 rounded-full text-[14px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors flex items-center gap-2 shadow-sm">
          <span>🌍</span> National
        </button>
      </div>
      <div className="text-[13px] text-epi-muted mb-8 font-medium">
        Viewing: <span className="text-epi-text font-bold">District Level</span>{' '}
        | Source data: Sector level | Aggregation method: Sum
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Tree */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-card border border-border p-6">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            Administrative Hierarchy
          </h2>

          <div className="font-mono text-[13px] leading-7 text-epi-text">
            <div>🌍 Rwanda (National)</div>
            <div className="pl-6 border-l border-border ml-2">
              <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                🗺️ Kigali City
              </div>
              <div className="pl-6 border-l border-border ml-2">
                <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                  🏛️ Gasabo
                </div>
                <div className="pl-6 border-l border-border ml-2">
                  <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                    📍 Kimironko Sector
                  </div>
                  <div className="pl-6 ml-2">
                    <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px">
                      <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                      🏘️ Bibare Cell
                    </div>
                  </div>
                  <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                    📍 Remera Sector
                  </div>
                  <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px">
                    <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                    📍 Kacyiru Sector
                  </div>
                </div>
                <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                  🏛️ Nyarugenge
                </div>
                <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px">
                  <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                  🏛️ Kicukiro
                </div>
              </div>

              <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                🗺️ Southern Province
              </div>
              <div className="pl-6 border-l border-border ml-2">
                <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 bg-epi/10 -mx-2 px-2 py-0.5 rounded font-bold text-epi">
                  🏛️ Huye ← (expanded)
                </div>
                <div className="pl-6 border-l border-border ml-2">
                  <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                    📍 Tumba Sector
                  </div>
                  <div className="pl-6 ml-2">
                    <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px">
                      <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                      🏘️ Cyarwa Cell
                    </div>
                  </div>
                  <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                    📍 Ngoma Sector
                  </div>
                  <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px">
                    <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                    📍 Mbazi Sector
                  </div>
                </div>
                <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2">
                  🏛️ Nyamagabe
                </div>
                <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px">
                  <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                  🏛️ Muhanga
                </div>
              </div>

              <div className="relative before:absolute before:content-[''] before:w-4 before:h-px before:bg-border before:-left-6 before:top-1/2 before:-mt-px text-epi-muted">
                <div className="absolute -left-[25px] top-0 bottom-1/2 border-l border-border"></div>
                🗺️ (other provinces collapsed)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-[18px] font-bold text-epi-text mb-1">
              Huye District — Aggregated Data
            </h2>
            <p className="text-[13px] text-epi-muted">
              Source: 10 sectors · 47 cells · 234 villages
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Cases
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Population
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Incidence Rate
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Contribution to District Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Tumba
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    38
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    28,450
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    1.34/1,000
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-8">
                        26%
                      </span>
                      <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-red"
                          style={{
                            width: '26%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Ngoma
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    27
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    31,200
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    0.87/1,000
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-8">
                        19%
                      </span>
                      <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F97316]"
                          style={{
                            width: '19%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Maraba
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    21
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    24,800
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    0.85/1,000
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-8">
                        14%
                      </span>
                      <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F97316]"
                          style={{
                            width: '14%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Huye
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    18
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    41,200
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    0.44/1,000
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-8">
                        12%
                      </span>
                      <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '12%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Mukura
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    16
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    22,100
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    0.72/1,000
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-8">
                        11%
                      </span>
                      <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '11%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Other 5 sectors
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    25
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    173,597
                  </td>
                  <td className="p-4 text-[14px] text-epi-muted text-right italic">
                    0.14/1,000 avg
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-8">
                        18%
                      </span>
                      <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '18%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="bg-epi/5 border-t-2 border-epi">
                  <td className="p-4 text-[14px] font-bold text-epi">
                    HUYE TOTAL
                  </td>
                  <td className="p-4 text-[14px] font-bold text-epi text-right">
                    145
                  </td>
                  <td className="p-4 text-[14px] font-bold text-epi text-right">
                    321,347
                  </td>
                  <td className="p-4 text-[14px] font-bold text-epi text-right">
                    0.45/1,000
                  </td>
                  <td className="p-4 text-[14px] font-bold text-epi">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border mt-auto flex justify-between">
            <button className="text-[13px] font-bold text-epi hover:underline">
              Drill-up to Province →
            </button>
            <button className="text-[13px] font-bold text-epi hover:underline">
              Drill-down to Sector →
            </button>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}