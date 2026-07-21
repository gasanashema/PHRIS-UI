import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine } from
'recharts';
import { EpiLayout } from '../../components/epi/EpiLayout';
const TABS = [
'Summary',
'Epidemic Curve',
'Case Map',
'Demographics',
'Lab Results',
'Field Updates',
'Response Actions',
'Recommendations'];

const curveData = [
{
  date: 'May 29',
  cases: 3
},
{
  date: 'May 30',
  cases: 5
},
{
  date: 'May 31',
  cases: 8
},
{
  date: 'Jun 1',
  cases: 12
},
{
  date: 'Jun 2',
  cases: 18
},
{
  date: 'Jun 3',
  cases: 19
},
{
  date: 'Jun 4',
  cases: 14
},
{
  date: 'Jun 5',
  cases: 8
}];

export function EpiInvestigation() {
  const [activeTab, setActiveTab] = useState('Summary');
  return (
    <EpiLayout
      title="Outbreak Investigation — INV-2026-003"
      subtitle="Cholera | Rusizi District | Opened June 1, 2026"
      breadcrumb="Outbreak Investigations > INV-2026-003">
      
      {/* Status Bar */}
      <div className="bg-epi-red text-white px-6 py-3 rounded-t-lg font-medium text-[14px] flex flex-wrap items-center gap-2">
        <span className="font-bold">🔴 ACTIVE OUTBREAK</span>
        <span className="text-white/50">|</span>
        <span>87 confirmed cases</span>
        <span className="text-white/50">|</span>
        <span>3 deaths (CFR: 3.4%)</span>
        <span className="text-white/50">|</span>
        <span>Field team deployed</span>
        <span className="text-white/50">|</span>
        <span>Day 4 of investigation</span>
      </div>

      {/* Tabs */}
      <div className="bg-white border-x border-b border-border rounded-b-lg mb-6 shadow-sm">
        <div className="flex overflow-x-auto">
          {TABS.map((t) =>
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t ? 'border-epi text-epi' : 'border-transparent text-epi-muted hover:text-epi-text'}`}>
            
              {t}
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'Summary' &&
      <div className="grid grid-cols-[60%_40%] gap-6">
          {/* Left Col */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-4">
                Outbreak Profile
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[13px]">
                <div>
                  <div className="text-epi-muted mb-1">Disease</div>
                  <div className="font-bold text-epi-text">
                    Cholera (Vibrio cholerae)
                  </div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">Location</div>
                  <div className="font-bold text-epi-text">
                    Rusizi District, Western Province
                    <br />
                    <span className="font-normal text-epi-muted">
                      (sectors: Bugarama, Nzahaha, Kamembe)
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">First Case</div>
                  <div className="font-bold text-epi-text">May 29, 2026</div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">Report Date</div>
                  <div className="font-bold text-epi-text">June 1, 2026</div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">Total Cases</div>
                  <div className="font-bold text-epi-text">87</div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">Deaths | CFR</div>
                  <div className="font-bold text-epi-text">3 | 3.4%</div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">Hospitalizations</div>
                  <div className="font-bold text-epi-text">23</div>
                </div>
                <div>
                  <div className="text-epi-muted mb-1">
                    Investigation Status
                  </div>
                  <div className="font-bold text-epi-red">
                    🔴 Active Outbreak
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-epi-muted mb-1">Case Definition</div>
                  <div className="font-medium text-epi-text bg-epi-bg p-3 rounded border border-border">
                    "Acute watery diarrhea in a person aged ≥2 years, or any
                    diarrhea in a person of any age with dehydration, in Rusizi
                    District from May 29 onward"
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-epi-muted mb-1">Suspected Source</div>
                  <div className="font-bold text-epi-text">
                    Contaminated water — Ruzizi River water point, Bugarama
                    Sector
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-epi-muted mb-1">Lead Investigator</div>
                  <div className="font-bold text-epi-text">
                    Dr. Jean Paul Habimana, RBC
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-3">
                Epidemic Summary
              </h3>
              <p className="text-[14px] text-epi-text leading-relaxed">
                Cholera cases began appearing in Bugarama Sector of Rusizi
                District on May 29, 2026. Initial cases were clustered around a
                single water collection point near the Ruzizi River. Case count
                has grown rapidly, with 87 confirmed cases across 3 sectors as
                of June 5. Water treatment intervention is in progress...
              </p>
            </div>
          </div>

          {/* Right Col */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-4">
                Investigation Checklist
              </h3>
              <div className="flex items-center justify-between text-[12px] font-bold text-epi-text mb-2">
                <span>Progress</span>
                <span>6 of 10 steps complete (60%)</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden mb-5">
                <div
                className="h-full bg-epi-accent rounded-full"
                style={{
                  width: '60%'
                }} />
              
              </div>
              <div className="space-y-3 text-[13px] text-epi-text">
                <div className="flex items-start gap-2">
                  <span className="text-epi-accent">✅</span> Alert received and
                  triaged
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-epi-accent">✅</span> Investigation
                  opened
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-epi-accent">✅</span> Case definition
                  established
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-epi-accent">✅</span> Field team
                  deployed
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-epi-accent">✅</span> Initial case
                  mapping completed
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-epi-accent">✅</span> Suspected source
                  identified
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-border text-[16px] leading-none">
                    ⬜
                  </span>{' '}
                  Water source testing results (pending)
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-border text-[16px] leading-none">
                    ⬜
                  </span>{' '}
                  Lab confirmation for all cases
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-border text-[16px] leading-none">
                    ⬜
                  </span>{' '}
                  Intervention effectiveness assessed
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-border text-[16px] leading-none">
                    ⬜
                  </span>{' '}
                  Investigation report finalized
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-4">
                Field Team
              </h3>
              <div className="space-y-3 text-[13px] mb-4">
                <div className="flex items-center gap-2">
                  👤{' '}
                  <span className="font-bold">
                    Dr. Jean Paul Habimana (Lead)
                  </span>{' '}
                  — RBC
                </div>
                <div className="flex items-center gap-2">
                  👤 <span className="font-bold">Dr. Aline Uwimana</span> — MOH
                </div>
                <div className="flex items-center gap-2">
                  👤{' '}
                  <span className="font-bold">
                    Lab Tech — Celestin Nzeyimana
                  </span>{' '}
                  — RBC Laboratory
                </div>
                <div className="flex items-center gap-2">
                  👤{' '}
                  <span className="font-bold">
                    District Coordinator — Marie Mukamana
                  </span>{' '}
                  — Rusizi DHO
                </div>
              </div>
              <button className="text-[12px] font-bold text-epi hover:underline">
                Add Team Member
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-card border border-border p-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-3">
                Key Contacts
              </h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-epi-muted">Rusizi DHO:</span>{' '}
                  <span className="font-bold">+250 788 123 456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">RBC Director:</span>{' '}
                  <span className="font-bold">+250 788 000 001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">WHO Rwanda:</span>{' '}
                  <span className="font-bold">+250 788 000 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {activeTab === 'Epidemic Curve' &&
      <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h2 className="text-[16px] font-bold text-epi-text mb-1">
            Cholera Epidemic Curve — Rusizi District
          </h2>
          <p className="text-[13px] text-epi-muted mb-6">
            (May 29 — June 5, 2026)
          </p>

          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
              data={curveData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              
                <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB" />
              
                <XAxis
                dataKey="date"
                tick={{
                  fontSize: 12,
                  fill: '#6B7280'
                }}
                axisLine={false}
                tickLine={false} />
              
                <YAxis
                tick={{
                  fontSize: 12,
                  fill: '#6B7280'
                }}
                axisLine={false}
                tickLine={false} />
              
                <Tooltip
                cursor={{
                  fill: '#F4F6F9'
                }}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 12
                }} />
              
                <ReferenceLine
                x="Jun 1"
                stroke="#6B7280"
                strokeDasharray="4 4"
                label={{
                  value: 'Investigation opened',
                  position: 'top',
                  fill: '#6B7280',
                  fontSize: 11
                }} />
              
                <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                  {curveData.map((entry, index) =>
                <cell
                  key={`cell-${index}`}
                  fill={index >= 6 ? '#FCA5A5' : '#D32F2F'} />

                )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start justify-between bg-epi-bg p-4 rounded-lg border border-border">
            <div>
              <div className="text-[13px] font-bold text-epi-text mb-1">
                Epidemic curve shape:
              </div>
              <div className="text-[13px] text-epi-muted">
                Point source → Common source (consistent with contaminated water
                supply)
              </div>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-epi-accent bg-epi-accent/10 px-3 py-1.5 rounded-full">
              ↓ Intervention started June 4 — cases declining
            </div>
          </div>
        </div>
      }
    </EpiLayout>);

}