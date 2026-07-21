import React from 'react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import {
  MapPin,
  BrainCircuit,
  Target,
  Sparkles,
  Microscope,
  RefreshCw,
  ArrowUpRight,
  ArrowRight } from
'lucide-react';
export function PredictionOverview() {
  return (
    <PredictionLayout
      title="AI Risk Prediction Overview"
      subtitle="Thursday, June 5, 2026 | Rwanda — All 30 Districts | Last prediction run: 13:00 PM (2h ago)"
      breadcrumb="Prediction Overview">
      
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-red flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-red/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-epi-red" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              High Risk Districts
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">4</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Rusizi 🔴 · Kayonza 🔴 · Bugesera 🟠 · Huye 🟠
          </p>
          <div className="mt-auto">
            <span className="text-[11px] font-bold text-epi-red">
              🔴 Urgent attention needed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#00A550]" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Active Predictions
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">240</div>
          <p className="text-[11px] text-epi-muted mb-2">
            8 diseases × 30 districts
          </p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#00A550]/10 text-[#00A550]">
              🟢 All running
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Model Accuracy
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-2">84.7%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div
              className="bg-epi h-1.5 rounded-full"
              style={{
                width: '84.7%'
              }}>
            </div>
          </div>
          <p className="text-[11px] text-epi-muted mb-1">
            Last 90 days · 1,051 correct of 1,240
          </p>
          <div className="mt-auto">
            <span className="text-[11px] font-bold text-[#00A550] flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +1.2% vs last quarter
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              New Predictions Today
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">23</div>
          <p className="text-[11px] text-epi-muted mb-2">
            8 upgraded severity · 4 downgraded · 11 unchanged
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Microscope className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Diseases Being Predicted
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">8</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Malaria · Cholera · Measles · COVID-19 · Typhoid · VHF · Mpox ·
            Malnutrition
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Last Model Retrain
            </h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">3 days ago</div>
          <p className="text-[11px] text-epi-muted mb-2">
            June 2, 2026 — trained on 4-year Rwanda data
          </p>
          <div className="mt-auto">
            <span className="text-[11px] font-medium text-epi-muted">
              Next retrain: June 16, 2026
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-8 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              District Risk Scores — AI Vital Predictions (June 5, 2026)
            </h2>
            <p className="text-[13px] text-epi-muted">
              Top 10 highest risk and 5 lowest risk districts
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    District
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Province
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Top Disease Risk
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Score
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Score Bar
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                    Trend
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* HIGH RISK */}
                <tr className="bg-epi-red/5">
                  <td
                    colSpan={7}
                    className="p-2 text-[11px] font-bold text-epi-red uppercase tracking-wider pl-4">
                    
                    HIGH RISK
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Rusizi
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Western</td>
                  <td className="p-3 text-[13px] text-epi-text">Cholera</td>
                  <td className="p-3 text-[13px] font-bold text-epi-red">
                    91/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-red"
                          style={{
                            width: '91%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🔴</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-red text-center">
                    ↑
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    Investigate
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Kayonza
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Eastern</td>
                  <td className="p-3 text-[13px] text-epi-text">Malaria</td>
                  <td className="p-3 text-[13px] font-bold text-epi-red">
                    84/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-red"
                          style={{
                            width: '84%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🔴</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-red text-center">
                    ↑
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    Monitor
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Bugesera
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Eastern</td>
                  <td className="p-3 text-[13px] text-epi-text">Malaria</td>
                  <td className="p-3 text-[13px] font-bold text-[#F97316]">
                    72/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F97316]"
                          style={{
                            width: '72%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟠</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-muted text-center">
                    →
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    Monitor
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Huye
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Southern</td>
                  <td className="p-3 text-[13px] text-epi-text">Cholera</td>
                  <td className="p-3 text-[13px] font-bold text-[#F97316]">
                    68/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F97316]"
                          style={{
                            width: '68%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟠</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#F97316] text-center">
                    ↑
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    Watch
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Nyamagabe
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Southern</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    Malnutrition
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#F97316]">
                    61/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F97316]"
                          style={{
                            width: '61%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟠</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-muted text-center">
                    →
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    Watch
                  </td>
                </tr>

                {/* MODERATE RISK */}
                <tr className="bg-epi-amber/10">
                  <td
                    colSpan={7}
                    className="p-2 text-[11px] font-bold text-[#F97316] uppercase tracking-wider pl-4">
                    
                    MODERATE RISK
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Gicumbi
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Northern</td>
                  <td className="p-3 text-[13px] text-epi-text">Measles</td>
                  <td className="p-3 text-[13px] font-bold text-epi-amber">
                    54/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '54%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-muted text-center">
                    →
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    Monitor
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Rubavu
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Western</td>
                  <td className="p-3 text-[13px] text-epi-text">Mpox</td>
                  <td className="p-3 text-[13px] font-bold text-epi-amber">
                    48/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '48%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-amber text-center">
                    ↑
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right flex items-center justify-end gap-1">
                    <span>⚠️ DRC border watch</span>
                  </td>
                </tr>

                {/* LOW RISK */}
                <tr className="bg-[#00A550]/5">
                  <td
                    colSpan={7}
                    className="p-2 text-[11px] font-bold text-[#00A550] uppercase tracking-wider pl-4">
                    
                    LOW RISK
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Musanze
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Northern</td>
                  <td className="p-3 text-[13px] text-epi-muted italic">
                    None
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    18/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '18%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟢</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550] text-center">
                    ↓
                  </td>
                  <td className="p-3 text-[13px] text-epi-muted text-right">
                    Routine
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Gasabo
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Kigali</td>
                  <td className="p-3 text-[13px] text-epi-muted italic">
                    None
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    14/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '14%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟢</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550] text-center">
                    ↓
                  </td>
                  <td className="p-3 text-[13px] text-epi-muted text-right">
                    Routine
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Nyarugenge
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">Kigali</td>
                  <td className="p-3 text-[13px] text-epi-muted italic">
                    None
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    11/100
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '11%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟢</span>
                    </div>
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550] text-center">
                    ↓
                  </td>
                  <td className="p-3 text-[13px] text-epi-muted text-right">
                    Routine
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-[16px] font-bold text-epi-text">
            Prediction Engine Status
          </h2>

          <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text flex items-center gap-2 mb-3">
              🧠 AI Vital Prediction Model v3.2
            </h3>
            <div className="text-[12px] font-bold text-[#00A550] mb-4">
              🟢 Active and running
            </div>

            <div className="space-y-3 text-[13px] mb-6">
              <div className="flex justify-between">
                <span className="text-epi-muted">Training data:</span>
                <span className="font-medium text-right">
                  Rwanda health data 2022–2026
                  <br />
                  <span className="text-[11px] text-epi-muted">
                    (47,230 records used)
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Diseases covered:</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Districts covered:</span>
                <span className="font-bold">30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Last accuracy check:</span>
                <span className="font-bold text-epi">84.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Features used:</span>
                <span className="font-bold">23 input variables</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-[12px] font-bold text-epi-muted mb-2">
                Accuracy over time (last 6 months)
              </div>
              <div className="h-16 flex items-end gap-1">
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-epi/40 rounded-t"
                    style={{
                      height: '81%'
                    }}>
                  </div>
                  <span className="text-[9px] text-epi-muted">Jan</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-epi/50 rounded-t"
                    style={{
                      height: '82%'
                    }}>
                  </div>
                  <span className="text-[9px] text-epi-muted">Feb</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-epi/60 rounded-t"
                    style={{
                      height: '83%'
                    }}>
                  </div>
                  <span className="text-[9px] text-epi-muted">Mar</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-epi/70 rounded-t"
                    style={{
                      height: '84%'
                    }}>
                  </div>
                  <span className="text-[9px] text-epi-muted">Apr</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-epi/80 rounded-t"
                    style={{
                      height: '84%'
                    }}>
                  </div>
                  <span className="text-[9px] text-epi-muted">May</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-epi rounded-t"
                    style={{
                      height: '85%'
                    }}>
                  </div>
                  <span className="text-[9px] font-bold text-epi">Jun</span>
                </div>
              </div>
              <div className="text-[11px] text-epi-muted text-center mt-2">
                Steady upward trend (good)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-card border border-border">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">
              Special Rwanda Model Settings:
            </h3>
            <ul className="space-y-2 text-[13px] text-epi-text mb-4">
              <li className="flex items-start gap-2">
                <span className="text-[#00A550]">✅</span>
                <span>Rainy season multipliers (Mar–May, Oct–Dec)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A550]">✅</span>
                <span>
                  DRC border risk signals active (Rusizi, Rubavu, Nyamasheke)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A550]">✅</span>
                <span>NISR census denominators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A550]">✅</span>
                <span>Rwanda 3-year baseline patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A550]">✅</span>
                <span>CHW coverage gaps weighted</span>
              </li>
            </ul>
            <button className="text-[13px] font-bold text-epi hover:underline flex items-center">
              Configure <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}