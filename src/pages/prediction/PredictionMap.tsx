import React from 'react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight } from
'lucide-react';
export function PredictionMap() {
  return (
    <PredictionLayout
      title="National Risk Score Map"
      subtitle="AI-predicted risk levels — All 30 Rwanda districts | Updated: June 5, 2026 13:00 PM"
      breadcrumb="National Risk Map">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-epi text-white shadow-sm">
            Risk Scores
          </button>
          <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors shadow-sm">
            Dominant Disease
          </button>
          <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors shadow-sm">
            Trend Arrows
          </button>
          <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors shadow-sm">
            Population at Risk
          </button>
          <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg transition-colors shadow-sm">
            Cross-Border Signals
          </button>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Showing: All Diseases ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Current prediction ▼</option>
          </select>
          <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm">
            Export Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Map Area */}
        <div className="lg:col-span-8 bg-white rounded-lg shadow-card border border-border flex flex-col relative overflow-hidden min-h-[600px]">
          {/* Map Placeholder / Grid */}
          <div className="flex-1 bg-[#E5E7EB] relative p-8">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                'radial-gradient(#104E49 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}>
            </div>

            {/* Districts representation */}
            <div className="relative w-full h-full">
              {/* Rusizi */}
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-epi-red rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform z-10">
                <div className="absolute -left-2 -top-2 w-full h-full border-2 border-dashed border-[#F97316] rounded-lg pointer-events-none"></div>
                <div className="absolute -left-2 -top-6 text-[10px] font-bold text-[#F97316] bg-white px-1 rounded shadow-sm whitespace-nowrap">
                  🌍 Cross-Border Watch
                </div>
                <span className="text-[14px] font-bold">Rusizi</span>
                <span className="text-2xl font-bold">91</span>
                <ArrowUpRight className="w-4 h-4 mt-1" />
              </div>

              {/* Rubavu */}
              <div className="absolute top-20 left-16 w-28 h-28 bg-epi-amber rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute -left-2 -top-2 w-full h-full border-2 border-dashed border-[#F97316] rounded-lg pointer-events-none"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F97316]" />
                </div>
                <span className="text-[14px] font-bold">Rubavu</span>
                <span className="text-xl font-bold">48</span>
                <ArrowUpRight className="w-4 h-4 mt-1" />
              </div>

              {/* Kayonza */}
              <div className="absolute top-32 right-10 w-36 h-32 bg-epi-red/90 rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[14px] font-bold">Kayonza</span>
                <span className="text-2xl font-bold">84</span>
                <ArrowUpRight className="w-4 h-4 mt-1" />
              </div>

              {/* Bugesera */}
              <div className="absolute bottom-32 right-32 w-28 h-24 bg-[#F97316] rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[14px] font-bold">Bugesera</span>
                <span className="text-xl font-bold">72</span>
                <ArrowRight className="w-4 h-4 mt-1" />
              </div>

              {/* Huye */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#F97316]/90 rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[14px] font-bold">Huye</span>
                <span className="text-xl font-bold">68</span>
                <ArrowUpRight className="w-4 h-4 mt-1" />
              </div>

              {/* Nyamagabe */}
              <div className="absolute bottom-24 left-1/3 w-24 h-24 bg-[#F97316]/70 rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[14px] font-bold">Nyamagabe</span>
                <span className="text-xl font-bold">61</span>
                <ArrowRight className="w-4 h-4 mt-1" />
              </div>

              {/* Gicumbi */}
              <div className="absolute top-10 left-1/2 w-28 h-20 bg-epi-amber rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[14px] font-bold">Gicumbi</span>
                <span className="text-xl font-bold">54</span>
                <ArrowRight className="w-4 h-4 mt-1" />
              </div>

              {/* Musanze */}
              <div className="absolute top-12 left-1/3 w-24 h-20 bg-[#00A550]/60 rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[14px] font-bold">Musanze</span>
                <span className="text-lg font-bold">18</span>
                <ArrowDownRight className="w-4 h-4 mt-1" />
              </div>

              {/* Gasabo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#00A550]/40 rounded-lg border-2 border-white shadow-lg flex flex-col items-center justify-center text-epi-text cursor-pointer hover:scale-105 transition-transform">
                <span className="text-[12px] font-bold">Gasabo</span>
                <span className="text-lg font-bold">14</span>
                <ArrowDownRight className="w-3 h-3 mt-1" />
              </div>

              {/* Hover Popup (Simulated active on Rusizi) */}
              <div className="absolute bottom-48 left-10 w-72 bg-white rounded-lg shadow-xl border border-border p-4 z-20">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[16px] font-bold text-epi-text">
                    Rusizi District
                  </h3>
                  <span className="text-[12px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                    91/100 🔴
                  </span>
                </div>
                <div className="text-[13px] text-epi-text mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-epi-muted">Primary Disease:</span>
                    <span className="font-bold">Cholera</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-epi-muted">
                      Outbreak Probability:
                    </span>
                    <span className="font-bold text-epi-red">91%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-epi-muted">Population at Risk:</span>
                    <span className="font-bold">~28,000</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-epi-muted">Trend:</span>
                    <span className="font-bold text-epi-red flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" /> Rising fast
                    </span>
                  </div>
                </div>
                <div className="text-[12px] text-epi-text mb-3">
                  <div className="font-bold mb-1">Key Drivers:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-epi-muted">
                    <li>Water quality: 2/10</li>
                    <li>Weekly growth: +45%</li>
                    <li>Heavy rainfall: 145mm</li>
                    <li>Active cases: 87</li>
                  </ul>
                </div>
                <div className="text-[12px] font-bold text-epi-red mb-3">
                  Time to potential epidemic: 2–3 weeks
                  <br />
                  Action: Immediate response required
                </div>
                <button className="w-full py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">
                  View Full Prediction →
                </button>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-sm border border-border">
            <div className="text-[11px] font-bold text-epi-muted mb-2 uppercase tracking-wider">
              Score Scale
            </div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-8 h-3 bg-[#00A550]/40 rounded-l"></div>
              <div className="w-8 h-3 bg-epi-amber"></div>
              <div className="w-8 h-3 bg-[#F97316]"></div>
              <div className="w-8 h-3 bg-epi-red rounded-r"></div>
            </div>
            <div className="flex justify-between text-[10px] text-epi-muted font-bold mb-3">
              <span>0</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold mb-4">
              <span className="text-[#00A550]">🟢 Low</span>
              <span className="text-epi-amber">🟡 Mod</span>
              <span className="text-[#F97316]">🟠 High</span>
              <span className="text-epi-red">🔴 Critical</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-epi-text font-medium">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-[#F97316]" />{' '}
                Cross-border watch
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-3 h-3" /> Rising
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-3 h-3" /> Falling
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" /> Stable
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6 flex-1">
            <h2 className="text-[16px] font-bold text-epi-text mb-6">
              Rwanda Risk Summary
            </h2>

            {/* Gauge */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-48 h-24 overflow-hidden mb-2">
                <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-[#00A550] border-l-epi-amber border-b-[#F97316] border-r-epi-red rotate-45"></div>
                {/* Needle pointing to amber/orange (52/100) */}
                <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-epi-text origin-bottom -translate-x-1/2 rotate-[12deg] rounded-t-full"></div>
                <div className="absolute bottom-[-4px] left-1/2 w-3 h-3 bg-epi-text rounded-full -translate-x-1/2"></div>
              </div>
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                Overall National Risk
              </div>
              <div className="text-2xl font-bold text-epi-amber">MODERATE</div>
              <div className="text-[14px] text-epi-muted">Score: 52/100</div>
            </div>

            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-epi-text mb-3 uppercase tracking-wider">
                Breakdown by Province
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-epi-text">Western</span>
                  <span className="font-bold text-[#F97316]">71/100 🟠</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-epi-text">Eastern</span>
                  <span className="font-bold text-[#F97316]">68/100 🟠</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-epi-text">Southern</span>
                  <span className="font-bold text-epi-amber">54/100 🟡</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-epi-text">Northern</span>
                  <span className="font-bold text-[#00A550]">31/100 🟢</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-epi-text">Kigali</span>
                  <span className="font-bold text-[#00A550]">22/100 🟢</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[13px] font-bold text-epi-text mb-3 uppercase tracking-wider">
                Top Disease Risks Nationally
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-epi-text">1. Cholera</span>
                  <span className="text-epi-red font-medium">
                    4 districts at risk
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-epi-text">2. Malaria</span>
                  <span className="text-[#F97316] font-medium">
                    12 districts at risk
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-epi-text">3. Measles</span>
                  <span className="text-epi-amber font-medium">
                    2 districts at risk
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-epi-text">4. Mpox</span>
                  <span className="text-epi-muted font-medium">
                    1 district (border)
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors mt-auto">
              View All Predictions →
            </button>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}