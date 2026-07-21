import React, { Children } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
const radarData = [
{
  subject: 'Age risk factor',
  A: 9,
  fullMark: 10
},
{
  subject: 'Nutritional status',
  A: 8,
  fullMark: 10
},
{
  subject: 'Sanitation access',
  A: 8,
  fullMark: 10
},
{
  subject: 'Distance to facility',
  A: 6,
  fullMark: 10
},
{
  subject: 'Vaccination coverage',
  A: 5,
  fullMark: 10
},
{
  subject: 'Poverty (Ubudehe)',
  A: 8,
  fullMark: 10
},
{
  subject: 'Disease exposure',
  A: 9,
  fullMark: 10
}];

export function AnalystVulnerable() {
  return (
    <AnalystLayout
      title="Vulnerable Population Analysis"
      subtitle="High-risk groups identified across Rwanda — June 2026"
      breadcrumb="Vulnerable Populations">
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          Total at-risk people identified:{' '}
          <span className="text-epi">284,300</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          Groups profiled: <span className="text-epi">18</span>
        </div>
        <div className="bg-epi-amber/10 px-4 py-2 rounded-full border border-epi-amber/20 text-[13px] font-bold text-epi-amber shadow-sm">
          Districts with coverage gaps: 7
        </div>
        <div className="bg-epi-red/10 px-4 py-2 rounded-full border border-epi-red/20 text-[13px] font-bold text-epi-red shadow-sm">
          Groups with no program coverage: 3
        </div>
      </div>

      <div className="grid grid-cols-[40%_60%] gap-6">
        {/* Left - List */}
        <div className="bg-white rounded-lg shadow-card border border-border flex flex-col h-[800px]">
          <div className="p-4 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text mb-3">
              Identified High-Risk Groups
            </h2>
            <div className="flex gap-2 text-[11px] font-bold">
              <span className="bg-epi-bg px-2.5 py-1 rounded-full border border-border cursor-pointer">
                All
              </span>
              <span className="bg-epi-red/10 text-epi-red px-2.5 py-1 rounded-full border border-epi-red/20 cursor-pointer">
                🔴 Very High
              </span>
              <span className="bg-epi-amber/10 text-epi-amber px-2.5 py-1 rounded-full border border-epi-amber/20 cursor-pointer">
                🟠 High
              </span>
              <span className="bg-[#FEF08A]/40 text-[#A16207] px-2.5 py-1 rounded-full border border-[#FDE047] cursor-pointer">
                🟡 Moderate
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Card 1 */}
            <div className="border-2 border-epi-red rounded-lg p-4 bg-epi-red/5 relative">
              <div className="text-[11px] font-bold text-epi-red mb-1">
                🔴 VERY HIGH RISK
              </div>
              <h3 className="text-[15px] font-bold text-epi-text mb-2">
                Children Under 5 — Rusizi District
              </h3>
              <div className="text-[12px] text-epi-muted space-y-1 mb-4">
                <div>
                  Main risks:{' '}
                  <span className="font-medium text-epi-text">
                    Cholera + Malnutrition
                  </span>
                </div>
                <div>
                  Population:{' '}
                  <span className="font-medium text-epi-text">12,400</span>
                </div>
                <div>
                  Program coverage:{' '}
                  <span className="font-medium text-epi-text">
                    ORS ✅ | Nutrition ❌ (gap)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-bold text-epi-red">
                  Score: 91/100
                </div>
                <button className="h-8 px-4 bg-epi text-white text-[12px] font-bold rounded-md">
                  View Profile
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-epi-amber rounded-lg p-4 bg-white hover:border-epi-amber/50 transition-colors">
              <div className="text-[11px] font-bold text-epi-amber mb-1">
                🟠 HIGH RISK
              </div>
              <h3 className="text-[15px] font-bold text-epi-text mb-2">
                Refugees — Gicumbi Camp (Nyabiheke)
              </h3>
              <div className="text-[12px] text-epi-muted space-y-1 mb-4">
                <div>
                  Main risks:{' '}
                  <span className="font-medium text-epi-text">
                    Multiple diseases + limited healthcare access
                  </span>
                </div>
                <div>
                  Population:{' '}
                  <span className="font-medium text-epi-text">15,600</span>
                </div>
                <div>
                  Program coverage:{' '}
                  <span className="font-medium text-epi-text">
                    UNHCR ✅ | WASH ⚠️ partial
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-bold text-epi-amber">
                  Score: 78/100
                </div>
                <button className="h-8 px-4 bg-epi-bg border border-border text-epi-text text-[12px] font-bold rounded-md">
                  View Profile
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-epi-amber rounded-lg p-4 bg-white hover:border-epi-amber/50 transition-colors">
              <div className="text-[11px] font-bold text-epi-amber mb-1">
                🟠 HIGH RISK
              </div>
              <h3 className="text-[15px] font-bold text-epi-text mb-2">
                Elderly (65+) — Kayonza District
              </h3>
              <div className="text-[12px] text-epi-muted space-y-1 mb-4">
                <div>
                  Main risks:{' '}
                  <span className="font-medium text-epi-text">
                    Malaria complications
                  </span>
                </div>
                <div>
                  Population:{' '}
                  <span className="font-medium text-epi-text">8,200</span>
                </div>
                <div>
                  Program coverage:{' '}
                  <span className="font-medium text-epi-text">
                    Malaria treatment ✅ | Bednet distribution ❌ (gap)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-bold text-epi-amber">
                  Score: 72/100
                </div>
                <button className="h-8 px-4 bg-epi-bg border border-border text-epi-text text-[12px] font-bold rounded-md">
                  View Profile
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="border border-epi-amber rounded-lg p-4 bg-white hover:border-epi-amber/50 transition-colors">
              <div className="text-[11px] font-bold text-epi-amber mb-1">
                🟠 HIGH RISK
              </div>
              <h3 className="text-[15px] font-bold text-epi-text mb-2">
                Pregnant Women — Nyaruguru District
              </h3>
              <div className="text-[12px] text-epi-muted space-y-1 mb-4">
                <div>
                  Main risks:{' '}
                  <span className="font-medium text-epi-text">
                    Maternal mortality + distance to facility
                  </span>
                </div>
                <div>
                  Population:{' '}
                  <span className="font-medium text-epi-text">3,100</span>
                </div>
                <div>
                  Program coverage:{' '}
                  <span className="font-medium text-epi-text">
                    ANC ✅ | Skilled birth ⚠️ 61%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-bold text-epi-amber">
                  Score: 69/100
                </div>
                <button className="h-8 px-4 bg-epi-bg border border-border text-epi-text text-[12px] font-bold rounded-md">
                  View Profile
                </button>
              </div>
            </div>

            {/* Card 5 */}
            <div className="border border-[#FDE047] rounded-lg p-4 bg-white hover:border-[#FDE047]/50 transition-colors">
              <div className="text-[11px] font-bold text-[#A16207] mb-1">
                🟡 MODERATE
              </div>
              <h3 className="text-[15px] font-bold text-epi-text mb-2">
                Children Under 5 — Nyamagabe District
              </h3>
              <div className="text-[12px] text-epi-muted space-y-1 mb-4">
                <div>
                  Main risks:{' '}
                  <span className="font-medium text-epi-text">
                    Stunting + malnutrition
                  </span>
                </div>
                <div>
                  Population:{' '}
                  <span className="font-medium text-epi-text">9,800</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-bold text-[#A16207]">
                  Score: 54/100
                </div>
                <button className="h-8 px-4 bg-epi-bg border border-border text-epi-text text-[12px] font-bold rounded-md">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Detail */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col h-[800px]">
          <div className="mb-6">
            <h2 className="text-[20px] font-bold text-epi-text">
              Vulnerability Profile — Children Under 5, Rusizi District
            </h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
            <div className="absolute top-0 right-0 text-[24px] font-bold text-epi-red">
              91/100
            </div>
            <div className="w-full max-w-[400px] h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}>
                  
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: '#1A1A2E',
                      fontSize: 11,
                      fontWeight: 600
                    }} />
                  
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 10]}
                    tick={false}
                    axisLine={false} />
                  
                  <Radar
                    name="Vulnerability"
                    dataKey="A"
                    stroke="#D32F2F"
                    fill="#D32F2F"
                    fillOpacity={0.3} />
                  
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[12px] text-epi-muted text-center mt-4">
              7-factor vulnerability radar chart (0-10 scale, higher = more
              vulnerable)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-epi-bg border border-border rounded-lg p-4">
              <h3 className="text-[14px] font-bold text-epi-text mb-3">
                Coverage Gaps for This Group:
              </h3>
              <ul className="space-y-2 text-[13px] text-epi-text">
                <li className="flex items-start gap-2">
                  <span className="text-epi-red">❌</span> Therapeutic feeding
                  program — not covering Bugarama sector
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-epi-red">❌</span> WASH hygiene kits —
                  out of stock at Rusizi HC since May
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-epi-amber">⚠️</span> Vitamin A
                  supplementation — only 61% coverage in this group
                </li>
              </ul>
            </div>
            <div className="bg-epi-bg border border-border rounded-lg p-4">
              <h3 className="text-[14px] font-bold text-epi-text mb-3">
                Recommended interventions:
              </h3>
              <ol className="space-y-2 text-[13px] text-epi-text list-decimal list-inside">
                <li>Deploy therapeutic feeding to Bugarama immediately</li>
                <li>Restock hygiene kits at Rusizi HC</li>
                <li>Schedule Vitamin A campaign before August</li>
              </ol>
            </div>
          </div>

          <div className="bg-epi/10 border border-epi/20 rounded-lg p-5 flex items-center justify-between mt-auto">
            <div>
              <div className="text-[14px] font-bold text-epi-text mb-1">
                Estimated cost of full intervention:{' '}
                <span className="text-epi">RWF 4,200,000 (~$3,800 USD)</span>
              </div>
              <div className="text-[13px] text-epi-muted">
                Expected impact: Prevent ~340 cholera cases + reduce acute
                malnutrition by est. 18% in this group
              </div>
            </div>
            <button className="h-10 px-6 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md shrink-0">
              Generate Vulnerability Report
            </button>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}