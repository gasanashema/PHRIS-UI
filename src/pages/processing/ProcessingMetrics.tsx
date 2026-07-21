import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
export function ProcessingMetrics() {
  return (
    <ProcessingLayout
      title="Health Metrics Calculator"
      subtitle="Automatically calculated from clean AI Vital data — updated every 2 hours"
      breadcrumb="Metrics Calculator">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Disease: Cholera ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>District: Rusizi ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Time period: This Week ▼</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
          Recalculate Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="text-[18px] font-bold text-epi-text">
            Cholera — Rusizi District — Week 23, 2026
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                Incidence Rate
              </h3>
              <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-1">
                New cases ÷ Population × 1,000
              </div>
              <div className="text-[11px] text-epi-muted font-mono mb-3">
                87 ÷ 50,000 × 1,000
              </div>
              <div className="text-3xl font-bold text-epi-text mb-1">
                1.74{' '}
                <span className="text-[14px] font-normal text-epi-muted">
                  / 1,000
                </span>
              </div>
              <p className="text-[12px] text-epi-muted mb-3">
                People infected per 1,000 residents
              </p>
              <div className="mt-auto text-[12px] font-bold text-epi-red">
                🔴 Above threshold (0.5)
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                Case Fatality Rate
              </h3>
              <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-1">
                Deaths ÷ Cases × 100
              </div>
              <div className="text-[11px] text-epi-muted font-mono mb-3">
                3 ÷ 87 × 100
              </div>
              <div className="text-3xl font-bold text-epi-text mb-1">3.4%</div>
              <p className="text-[12px] text-epi-muted mb-3">
                Of confirmed cases die
              </p>
              <div className="mt-auto text-[12px] font-bold text-[#F97316]">
                🟠 Above target (&lt;1%)
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                Attack Rate
              </h3>
              <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-1">
                Cases ÷ Exposed × 100
              </div>
              <div className="text-[11px] text-epi-muted font-mono mb-3">
                87 ÷ 340 × 100
              </div>
              <div className="text-3xl font-bold text-epi-text mb-1">25.6%</div>
              <p className="text-[12px] text-epi-muted mb-3">
                Of exposed people infected
              </p>
              <div className="mt-auto text-[12px] font-bold text-epi-red">
                🔴 Very high
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                R0 (Reproduction Number)
              </h3>
              <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-3">
                Avg contacts infected per case
              </div>
              <div className="text-3xl font-bold text-epi-text mb-2">2.3</div>
              <div className="w-full bg-epi-bg rounded-full h-2 mb-1 relative">
                <div className="absolute left-0 top-0 bottom-0 w-[33%] bg-[#00A550] rounded-l-full"></div>
                <div className="absolute left-[33%] top-0 bottom-0 w-[33%] bg-epi-amber"></div>
                <div className="absolute left-[66%] top-0 bottom-0 w-[34%] bg-epi-red rounded-r-full"></div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-epi-text rounded-full"
                  style={{
                    left: '76%'
                  }}>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-epi-muted mb-2">
                <span>0</span>
                <span>1.0</span>
                <span>3.0</span>
              </div>
              <p className="text-[12px] text-epi-muted mb-3">
                Each case infects 2.3 others — outbreak spreading
              </p>
              <div className="mt-auto text-[12px] font-bold text-epi-red">
                🔴 Above 2.0
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                Doubling Time
              </h3>
              <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-3">
                Days for cases to double
              </div>
              <div className="text-3xl font-bold text-epi-text mb-1">
                4.2{' '}
                <span className="text-[14px] font-normal text-epi-muted">
                  days
                </span>
              </div>
              <p className="text-[12px] text-epi-muted mb-3">
                Cases doubling every 4.2 days at current rate
              </p>
              <div className="mt-auto text-[12px] font-bold text-epi-red">
                🔴 Rapid spread
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                Prevalence Rate
              </h3>
              <div className="text-[11px] text-epi-muted font-mono bg-epi-bg px-2 py-1 rounded mb-1">
                Total cases ÷ Population × 100
              </div>
              <div className="text-[11px] text-epi-muted font-mono mb-3">
                87 ÷ 50,000 × 100
              </div>
              <div className="text-3xl font-bold text-epi-text mb-1">
                0.174%
              </div>
              <p className="text-[12px] text-epi-muted mb-3">
                Of population currently affected
              </p>
              <div className="mt-auto text-[12px] font-bold text-[#F97316]">
                🟠 Elevated
              </div>
            </div>
          </div>

          {/* Projection Table */}
          <div className="bg-white rounded-lg p-5 shadow-card border border-border">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">
              At current R0 of 2.3, projected cases:
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="bg-epi-bg p-3 rounded text-center">
                <div className="text-[12px] text-epi-muted mb-1">Week +1</div>
                <div className="text-[16px] font-bold text-epi-text">
                  200 cases
                </div>
              </div>
              <div className="bg-epi-amber/10 p-3 rounded text-center">
                <div className="text-[12px] text-epi-amber mb-1">Week +2</div>
                <div className="text-[16px] font-bold text-epi-amber">
                  460 cases
                </div>
              </div>
              <div className="bg-epi-red/10 p-3 rounded text-center">
                <div className="text-[12px] text-epi-red mb-1">Week +3</div>
                <div className="text-[16px] font-bold text-epi-red">
                  1,058 cases
                </div>
              </div>
            </div>
            <div className="text-[13px] font-bold text-epi-red">
              If no intervention: epidemic level by Week 3
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="text-[18px] font-bold text-epi-text">
            How These Were Calculated
          </h2>

          <div className="bg-epi-bg/50 rounded-lg p-6 border border-border">
            <h3 className="text-[14px] font-bold text-epi-text mb-4">
              INCIDENCE RATE — Step by Step:
            </h3>
            <div className="space-y-4 font-mono text-[13px] text-epi-text">
              <div className="flex gap-3">
                <span className="text-epi-muted">Step 1:</span>
                <span>New cases this week = 87</span>
              </div>
              <div className="flex gap-3">
                <span className="text-epi-muted">Step 2:</span>
                <div>
                  <div>
                    Rusizi District population (NISR 2022 census) = 336,288
                  </div>
                  <div className="text-epi-muted mt-1">
                    Adjustment for sector = 50,000
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-epi-muted">Step 3:</span>
                <span className="font-bold">87 ÷ 50,000 × 1,000 = 1.74</span>
              </div>
              <div className="flex gap-3">
                <span className="text-epi-muted">Step 4:</span>
                <span>National threshold = 0.5</span>
              </div>
              <div className="flex gap-3">
                <span className="text-epi-muted">Step 5:</span>
                <span className="text-epi-red font-bold">
                  1.74 &gt; 0.5 → 🔴 Alert
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-[12px] text-epi-muted italic">
              Population denominators sourced from NISR Rwanda Census 2022. Last
              updated: January 2026.
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col gap-3">
            <button className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
              Export Metrics Report
            </button>
            <button className="w-full py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
              Add to Dashboard
            </button>
            <button className="text-[13px] font-medium text-epi hover:underline text-center mt-2">
              View All Districts
            </button>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}