import React from 'react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
export function PredictionProbability() {
  return (
    <PredictionLayout
      title="Outbreak Probability Calculator"
      subtitle="Probability of outbreak occurring if conditions remain unchanged"
      breadcrumb="Outbreak Probability">
      
      {/* Explainer Banner */}
      <div className="bg-epi/10 border border-epi/20 p-4 rounded-lg mb-6 flex items-start gap-3">
        <span className="text-[20px]">💡</span>
        <div className="text-[13px] text-epi-text leading-relaxed">
          <span className="font-bold">How to read this:</span> A 91% probability
          means — if conditions stay the same and nothing is done, there is a
          91% chance a full outbreak will occur within the stated timeframe.
          This is a forecast, not a certainty.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Disease: All Diseases ▼</option>
        </select>
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Province: All ▼</option>
        </select>
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Min probability: &gt;30% ▼</option>
        </select>
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Timeframe: Next 2–4 weeks ▼</option>
        </select>
      </div>

      {/* Main Probability Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  District
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Disease
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Probability
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Timeframe
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Confidence
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  R0
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* HIGH PROBABILITY */}
              <tr className="bg-epi-red/5">
                <td
                  colSpan={8}
                  className="p-2 text-[11px] font-bold text-epi-red uppercase tracking-wider pl-4">
                  
                  HIGH PROBABILITY
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Rusizi
                </td>
                <td className="p-4 text-[13px] text-epi-text">Cholera</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-epi-red w-8">
                      91%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-epi-red"
                        style={{
                          width: '91%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 2 weeks</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 High (89%)
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-red">2.3</td>
                <td className="p-4 text-[13px] font-bold text-epi-red">
                  🔴 Act immediately
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                  Respond
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Kayonza
                </td>
                <td className="p-4 text-[13px] text-epi-text">Malaria</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-epi-red w-8">
                      74%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-epi-red"
                        style={{
                          width: '74%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 3 weeks</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 High (82%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  1.8
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  🟠 Urgent
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                  Monitor
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Bugesera
                </td>
                <td className="p-4 text-[13px] text-epi-text">Malaria</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-epi-red w-8">
                      67%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-epi-red"
                        style={{
                          width: '67%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 3 weeks</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 High (79%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  1.6
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  🟠 Urgent
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                  Monitor
                </td>
              </tr>

              {/* MODERATE PROBABILITY */}
              <tr className="bg-epi-amber/10">
                <td
                  colSpan={8}
                  className="p-2 text-[11px] font-bold text-[#F97316] uppercase tracking-wider pl-4">
                  
                  MODERATE PROBABILITY
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Gicumbi
                </td>
                <td className="p-4 text-[13px] text-epi-text">Measles</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#F97316] w-8">
                      58%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F97316]"
                        style={{
                          width: '58%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 4 weeks</td>
                <td className="p-4 text-[13px] font-bold text-epi-amber">
                  🟡 Medium (71%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  1.4
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-amber">
                  🟡 Watch
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                  Monitor
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Rubavu
                </td>
                <td className="p-4 text-[13px] text-epi-text">Mpox</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-epi-amber w-8">
                      44%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-epi-amber"
                        style={{
                          width: '44%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 4 weeks</td>
                <td className="p-4 text-[13px] font-bold text-epi-amber">
                  🟡 Medium (65%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  1.2
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-amber">
                  🟡 DRC border watch
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                  Monitor
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Huye
                </td>
                <td className="p-4 text-[13px] text-epi-text">Typhoid</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-epi-amber w-8">
                      34%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-epi-amber"
                        style={{
                          width: '34%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 4 weeks</td>
                <td className="p-4 text-[13px] font-bold text-epi-amber">
                  🟡 Medium (68%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#F97316]">
                  1.1
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-amber">
                  🟡 Watch
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                  Monitor
                </td>
              </tr>

              {/* LOW PROBABILITY */}
              <tr className="bg-[#00A550]/5">
                <td
                  colSpan={8}
                  className="p-2 text-[11px] font-bold text-[#00A550] uppercase tracking-wider pl-4">
                  
                  LOW PROBABILITY
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Musanze
                </td>
                <td className="p-4 text-[13px] text-epi-text">Any disease</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#00A550] w-8">
                      12%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00A550]"
                        style={{
                          width: '12%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 4 weeks</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 High (91%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  0.7
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Low risk
                </td>
                <td className="p-4 text-[13px] text-epi-muted text-right">
                  Routine
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Gasabo
                </td>
                <td className="p-4 text-[13px] text-epi-text">Any disease</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#00A550] w-8">
                      8%
                    </span>
                    <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00A550]"
                        style={{
                          width: '8%'
                        }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next 4 weeks</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 High (94%)
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  0.5
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Very low
                </td>
                <td className="p-4 text-[13px] text-epi-muted text-right">
                  Routine
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* R0 Explanation Card */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 w-full max-w-2xl">
        <h2 className="text-[14px] font-bold text-epi-text mb-4">
          R0 Reference Guide:
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">&lt; 1.0</div>
            <div className="text-epi-muted">Disease dying out</div>
            <div className="text-[#00A550] font-bold">🟢</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">= 1.0</div>
            <div className="text-epi-muted">Stable, not growing</div>
            <div className="text-epi-amber font-bold">🟡</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">1.1–2.0</div>
            <div className="text-epi-muted">Growing → alert</div>
            <div className="text-[#F97316] font-bold">🟠</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">&gt; 2.0</div>
            <div className="text-epi-muted">Rapidly spreading</div>
            <div className="text-epi-red font-bold">🔴</div>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}