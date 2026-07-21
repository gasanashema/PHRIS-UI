import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
export function ProcessingTrends() {
  return (
    <ProcessingLayout
      title="Automated Trend Analysis"
      subtitle="Pattern detection across all diseases and districts — updated daily"
      breadcrumb="Trend Analysis">
      
      {/* Top Strip */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit">
        <span className="text-epi-red">🔴 2 Sudden spikes detected</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">🟠 5 Consistently rising trends</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 3 Seasonal patterns active</span>
        <span className="text-border">|</span>
        <span className="text-[#00A550]">🟢 14 Diseases stable</span>
        <span className="text-border">|</span>
        <span className="text-epi-muted">⚠️ 1 Suspicious drop flagged</span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Disease: All ▼</option>
        </select>
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>District: All ▼</option>
        </select>
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Trend type: All Types ▼</option>
        </select>
        <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
          <option>Alert level: All ▼</option>
        </select>
      </div>

      <div className="space-y-4">
        {/* TREND 1 */}
        <div className="bg-white rounded-lg p-6 shadow-card border-2 border-epi-red flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                🔴 SUDDEN SPIKE DETECTED
              </span>
              <h3 className="text-[16px] font-bold text-epi-text">
                Cholera — Rusizi District
              </h3>
            </div>
            <p className="text-[14px] text-epi-text font-medium mb-3">
              Cases doubled in 4 days: 38 cases (Jun 1) → 87 cases (Jun 5)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
              <div>
                <div className="text-epi-muted mb-1">Alert triggered:</div>
                <div className="font-bold text-epi-text">
                  ✅ Yes — ALT-2026-051 sent June 1
                </div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Week-over-week:</div>
                <div className="font-bold text-epi-red">+129%</div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">
                  Deviation from seasonal baseline:
                </div>
                <div className="font-bold text-epi-red">+340%</div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Trigger:</div>
                <div className="font-bold text-epi-text">
                  Cases exceeded 2× week-over-week threshold
                </div>
              </div>
            </div>
          </div>
          <div className="w-32 h-16 shrink-0 flex items-end">
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full overflow-visible">
              
              <polyline
                points="0,35 20,35 40,35 60,35 80,30 100,0"
                fill="none"
                stroke="#D32F2F"
                strokeWidth="3" />
              
              <circle cx="100" cy="0" r="4" fill="#D32F2F" />
            </svg>
          </div>
        </div>

        {/* TREND 2 */}
        <div className="bg-white rounded-lg p-6 shadow-card border border-[#F97316] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-bold bg-[#F97316] text-white px-2 py-0.5 rounded">
                🟠 CONSISTENTLY RISING — 3 WEEKS
              </span>
              <h3 className="text-[16px] font-bold text-epi-text">
                Malaria — Kayonza District
              </h3>
            </div>
            <p className="text-[14px] text-epi-text font-medium mb-3">
              Cases rising for 4 consecutive weeks: 34 → 45 → 58 → 67
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[13px]">
              <div>
                <div className="text-epi-muted mb-1">Alert triggered:</div>
                <div className="font-bold text-epi-text">✅ Yes</div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Week-over-week:</div>
                <div className="font-bold text-[#F97316]">+15.5% avg</div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Seasonal context:</div>
                <div className="font-bold text-epi-text">
                  Expected rise (rainy season) but above normal baseline by 23%
                </div>
              </div>
            </div>
          </div>
          <div className="w-32 h-16 shrink-0 flex items-end">
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full overflow-visible">
              
              <polyline
                points="0,35 25,30 50,20 75,10 100,0"
                fill="none"
                stroke="#F97316"
                strokeWidth="3" />
              
              <circle cx="100" cy="0" r="4" fill="#F97316" />
            </svg>
          </div>
        </div>

        {/* TREND 3 */}
        <div className="bg-white rounded-lg p-6 shadow-card border border-epi-amber flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-bold bg-epi-amber text-white px-2 py-0.5 rounded">
                🟡 SEASONAL PATTERN — EXPECTED
              </span>
              <h3 className="text-[16px] font-bold text-epi-text">
                Malaria — Eastern Province
              </h3>
            </div>
            <p className="text-[14px] text-epi-text font-medium mb-3">
              Annual April-May malaria peak in progress — within expected range
            </p>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-epi-muted mb-1">Alert:</div>
                <div className="font-bold text-epi-text">
                  No — within seasonal bounds
                </div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Note:</div>
                <div className="font-bold text-epi-text">
                  System will auto-alert if cases exceed seasonal baseline by
                  more than 25%
                </div>
              </div>
            </div>
          </div>
          <div className="w-32 h-16 shrink-0 flex items-end">
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full overflow-visible">
              
              <path
                d="M0,40 Q25,40 50,10 T100,40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3" />
              
            </svg>
          </div>
        </div>

        {/* TREND 4 */}
        <div className="bg-white rounded-lg p-6 shadow-card border border-epi-info flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-bold bg-epi-bg border border-border text-epi-text px-2 py-0.5 rounded">
                ⚠️ SUSPICIOUS DROP — POSSIBLE UNDERREPORTING
              </span>
              <h3 className="text-[16px] font-bold text-epi-text">
                CHW Reports — Mukura Sector
              </h3>
            </div>
            <p className="text-[14px] text-epi-text font-medium mb-3">
              Cases suddenly dropped from 12/week to 0 in 2 weeks — not
              consistent with district trends
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[13px]">
              <div>
                <div className="text-epi-muted mb-1">Possible cause:</div>
                <div className="font-bold text-epi-text">
                  CHW inactive — not reporting, not zero cases
                </div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Alert:</div>
                <div className="font-bold text-epi-amber">
                  🟡 Flagged for DHO review
                </div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Recommendation:</div>
                <div className="font-bold text-epi-text">
                  Contact Mukura sector CHW to verify
                </div>
              </div>
            </div>
          </div>
          <div className="w-32 h-16 shrink-0 flex items-end">
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full overflow-visible">
              
              <polyline
                points="0,10 20,10 40,10 60,40 80,40 100,40"
                fill="none"
                stroke="#6B7280"
                strokeWidth="3"
                strokeDasharray="4 4" />
              
            </svg>
          </div>
        </div>

        {/* TREND 5 */}
        <div className="bg-white rounded-lg p-6 shadow-card border border-[#00A550] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[12px] font-bold bg-[#00A550] text-white px-2 py-0.5 rounded">
                🟢 CONSISTENTLY FALLING
              </span>
              <h3 className="text-[16px] font-bold text-epi-text">
                Measles — Kigali City
              </h3>
            </div>
            <p className="text-[14px] text-epi-text font-medium mb-3">
              Cases declining for 6 consecutive weeks following vaccination
              campaign
            </p>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <div className="text-epi-muted mb-1">Week-over-week:</div>
                <div className="font-bold text-[#00A550]">-12% avg</div>
              </div>
              <div>
                <div className="text-epi-muted mb-1">Note:</div>
                <div className="font-bold text-epi-text">
                  Vaccination campaign June 1 appears effective
                </div>
              </div>
            </div>
          </div>
          <div className="w-32 h-16 shrink-0 flex items-end">
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full overflow-visible">
              
              <polyline
                points="0,0 25,10 50,20 75,30 100,35"
                fill="none"
                stroke="#00A550"
                strokeWidth="3" />
              
              <circle cx="100" cy="35" r="4" fill="#00A550" />
            </svg>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}