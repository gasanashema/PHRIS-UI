import React, { useState } from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
export function WarningConfig() {
  const [editingCholera, setEditingCholera] = useState(true);
  return (
    <WarningLayout
      title="Alert Configuration"
      subtitle="Set rules for when AI Vital generates warnings — Administrator only"
      breadcrumb="Alert Configuration">
      
      {/* Access Notice */}
      <div className="bg-epi-amber/10 border border-epi-amber/30 p-4 rounded-lg mb-6 flex items-start gap-3">
        <span className="text-[20px]">⚙️</span>
        <div className="text-[13px] text-epi-text leading-relaxed">
          Changes to alert thresholds affect all 30 districts and all 5 user
          roles. Save with care. All changes are logged in the audit trail.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-[16px] font-bold text-epi-text">
                Alert Thresholds by Disease
              </h2>
              <p className="text-[13px] text-epi-muted mt-1">
                Cases per week to trigger each level
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-epi-bg border-b border-border">
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      Disease
                    </th>
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                      🟡 Yellow
                    </th>
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                      🟠 Orange
                    </th>
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                      🔴 Red
                    </th>
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Cholera - Edit Mode */}
                  {editingCholera ?
                  <tr className="bg-epi/5">
                      <td colSpan={7} className="p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-bold text-epi-text">
                              Cholera
                            </span>
                            <span className="text-[12px] text-epi-muted">
                              Cases/week
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[12px] font-bold text-epi-amber mb-1">
                                🟡 Yellow
                              </label>
                              <input
                              type="number"
                              defaultValue="5"
                              className="w-full p-2 border border-border rounded text-[13px] focus:outline-none focus:border-epi" />
                            
                            </div>
                            <div>
                              <label className="block text-[12px] font-bold text-[#F97316] mb-1">
                                🟠 Orange
                              </label>
                              <input
                              type="number"
                              defaultValue="20"
                              className="w-full p-2 border border-border rounded text-[13px] focus:outline-none focus:border-epi" />
                            
                            </div>
                            <div>
                              <label className="block text-[12px] font-bold text-epi-red mb-1">
                                🔴 Red
                              </label>
                              <input
                              type="number"
                              defaultValue="50"
                              className="w-full p-2 border border-border rounded text-[13px] focus:outline-none focus:border-epi" />
                            
                            </div>
                          </div>
                          <div className="text-[12px] text-epi-muted italic">
                            Preview: At current Rusizi level (87), this rule
                            would trigger:{' '}
                            <span className="font-bold text-epi-red">
                              🔴 RED
                            </span>
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                            onClick={() => setEditingCholera(false)}
                            className="px-4 py-1.5 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
                            
                              Cancel
                            </button>
                            <button
                            onClick={() => setEditingCholera(false)}
                            className="px-4 py-1.5 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">
                            
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr> :

                  <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[13px] font-bold text-epi-text">
                        Cholera
                      </td>
                      <td className="p-3 text-[13px] text-epi-text text-center">
                        5
                      </td>
                      <td className="p-3 text-[13px] text-epi-text text-center">
                        20
                      </td>
                      <td className="p-3 text-[13px] text-epi-text text-center">
                        50
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        Cases/week
                      </td>
                      <td className="p-3 text-[13px] text-epi-muted">
                        March 2026
                      </td>
                      <td className="p-3 text-right">
                        <button
                        onClick={() => setEditingCholera(true)}
                        className="text-[13px] text-epi hover:underline">
                        
                          Edit ✏️
                        </button>
                      </td>
                    </tr>
                  }
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      Malaria
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      100
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      300
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      600
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      Cases/week
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      March 2026
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      Measles
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      3
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      10
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      25
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      Cases/week
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      March 2026
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      Typhoid
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      10
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      30
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      70
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      Cases/week
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      March 2026
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      Malnutrition
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      15%
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      25%
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      35%
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      % of children
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      March 2026
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      Mpox
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      1
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      3
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      8
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      Cases/week
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">May 2026</td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      VHF
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      0
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      1
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      3
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      Cases/week
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      March 2026
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      COVID-19
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      20
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      80
                    </td>
                    <td className="p-3 text-[13px] text-epi-text text-center">
                      200
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      Cases/week
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      March 2026
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-[13px] text-epi hover:underline">
                        Edit ✏️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text">
              Advanced Alert Rules
            </h2>
            <p className="text-[13px] text-epi-muted mb-6">
              Rules beyond simple case count thresholds
            </p>

            <div className="space-y-4">
              {/* Rule 1 */}
              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[14px] font-bold text-epi-text">
                    Rule 1: Growth Rate Rule
                  </h3>
                  <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[13px] text-epi-muted mb-3">
                  Trigger 🟠 Orange if cases grow more than 30% in one week,
                  regardless of count
                </p>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-epi-text font-medium">
                    Currently: Active for all diseases
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-epi-muted">Threshold:</span>
                    <input
                      type="text"
                      defaultValue="30%"
                      className="w-16 p-1 border border-border rounded text-center focus:outline-none focus:border-epi" />
                    
                  </div>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[14px] font-bold text-epi-text">
                    Rule 2: AI Probability Rule
                  </h3>
                  <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[13px] text-epi-muted mb-3">
                  Trigger 🟠 Orange if AI predicts &gt;60% outbreak probability
                </p>
                <div className="flex items-center justify-end text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="text-epi-muted">Threshold:</span>
                    <input
                      type="text"
                      defaultValue="60%"
                      className="w-16 p-1 border border-border rounded text-center focus:outline-none focus:border-epi" />
                    
                  </div>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[14px] font-bold text-epi-text">
                    Rule 3: Doubling Time Rule
                  </h3>
                  <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[13px] text-epi-muted mb-3">
                  Trigger 🔴 Red if cases double faster than 5 days
                </p>
                <div className="flex items-center justify-end text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="text-epi-muted">Threshold (days):</span>
                    <input
                      type="text"
                      defaultValue="5"
                      className="w-16 p-1 border border-border rounded text-center focus:outline-none focus:border-epi" />
                    
                  </div>
                </div>
              </div>

              {/* Rule 4 */}
              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[14px] font-bold text-epi-text">
                    Rule 4: Cross-Border Rule
                  </h3>
                  <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[13px] text-epi-muted mb-3">
                  Trigger 🟡 Yellow automatically in border districts when
                  neighboring country reports outbreak
                </p>
                <div className="text-[11px] text-epi-muted italic">
                  Border districts: Rusizi, Rubavu, Nyamasheke, Burera, Musanze,
                  Kirehe, Ngoma
                </div>
              </div>

              {/* Rule 5 */}
              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[14px] font-bold text-epi-text">
                    Rule 5: Rainy Season Multiplier
                  </h3>
                  <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[13px] text-epi-muted mb-3">
                  Automatically lower malaria and waterborne thresholds by 30%
                  during rainy seasons (March–May, October–December)
                </p>
                <div className="text-[12px] font-bold text-epi flex items-center gap-1">
                  🌧️ Rainy season multiplier currently ACTIVE (June — ending
                  soon)
                </div>
              </div>

              {/* Rule 6 */}
              <div className="p-4 border border-border rounded-lg bg-epi-bg/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[14px] font-bold text-epi-text">
                    Rule 6: Compound Disease Rule
                  </h3>
                  <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-[13px] text-epi-muted">
                  Trigger 🔴 Red if TWO diseases rise simultaneously in same
                  district
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full py-3 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
                Save All Rules
              </button>
              <button className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Reset to RBC Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </WarningLayout>);

}