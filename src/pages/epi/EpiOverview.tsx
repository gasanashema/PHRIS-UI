import React from 'react';
import { Link } from 'react-router-dom';
import {
  Biohazard,
  MapPin,
  Plus,
  Activity,
  Microscope,
  ClipboardList } from
'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
const SURVEILLANCE = [
{
  disease: 'Malaria',
  cases: 450,
  vs: '+12%',
  trend: '↑ Rising',
  districts: '18 districts',
  risk: '🟠 Orange',
  action: 'Investigate'
},
{
  disease: 'Cholera',
  cases: 87,
  vs: '+45%',
  trend: '↑ Sharp Rise',
  districts: '3 districts',
  risk: '🔴 Red',
  action: 'Active Investigation →'
},
{
  disease: 'Measles',
  cases: 23,
  vs: '-5%',
  trend: '↓ Falling',
  districts: '4 districts',
  risk: '🟡 Yellow',
  action: 'Monitor'
},
{
  disease: 'Typhoid',
  cases: 34,
  vs: '+8%',
  trend: '↑ Rising',
  districts: '6 districts',
  risk: '🟡 Yellow',
  action: 'Monitor'
},
{
  disease: 'COVID-19',
  cases: 12,
  vs: '0%',
  trend: '→ Stable',
  districts: '2 districts',
  risk: '🟢 Green',
  action: 'Routine'
},
{
  disease: 'Diarrheal Disease',
  cases: 178,
  vs: '+3%',
  trend: '→ Stable',
  districts: '22 districts',
  risk: '🟢 Green',
  action: 'Routine'
},
{
  disease: 'Mpox',
  cases: 3,
  vs: '+200%',
  trend: '↑ Alert',
  districts: '1 district (Rubavu — DRC border)',
  risk: '🟠 Orange',
  action: 'Investigate'
},
{
  disease: 'Meningitis',
  cases: 5,
  vs: '-20%',
  trend: '↓ Falling',
  districts: '2 districts',
  risk: '🟢 Green',
  action: 'Routine'
},
{
  disease: 'Rift Valley Fever',
  cases: 0,
  vs: '0%',
  trend: '→ None',
  districts: '0 districts',
  risk: '🟢 Green',
  action: 'Cross-border watch'
},
{
  disease: 'Viral Hemorrhagic Fever',
  cases: 0,
  vs: '0%',
  trend: '→ None',
  districts: '0 districts',
  risk: '🟢 Green',
  action: 'DRC border watch'
},
{
  disease: 'Malnutrition',
  cases: 234,
  vs: '+1%',
  trend: '→ Stable',
  districts: '12 districts',
  risk: '🟡 Yellow',
  action: 'Monitor'
},
{
  disease: 'Respiratory',
  cases: 89,
  vs: '-8%',
  trend: '↓ Falling',
  districts: '15 districts',
  risk: '🟢 Green',
  action: 'Routine'
}];

export function EpiOverview() {
  return (
    <EpiLayout
      title="National Disease Overview"
      subtitle="Thursday, June 5, 2026 | Rwanda — All Districts | Last updated: 08:34 AM"
      breadcrumb="National Overview">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-epi-amber/10 border border-epi-amber/30 rounded-lg p-4 flex flex-col justify-between">
          <div className="text-[13px] font-bold text-epi-amber mb-2">
            National Risk Level
          </div>
          <div className="text-[20px] font-bold text-epi-amber mb-1">
            🟠 MODERATE RISK
          </div>
          <div className="text-[11px] text-epi-text font-medium">
            2 active outbreaks — immediate attention required
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Biohazard className="w-4 h-4 text-epi-red" /> Active Outbreaks
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">2</div>
          <div className="text-[11px] text-epi-muted space-y-0.5 mb-2">
            <div className="font-medium text-epi-red">
              Cholera — Rusizi District 🔴
            </div>
            <div className="font-medium text-epi-amber">
              Malaria — Kayonza District 🟠
            </div>
          </div>
          <Link
            to="/epi/investigations"
            className="text-[11px] font-bold text-epi hover:underline mt-auto">
            
            Open investigations →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <MapPin className="w-4 h-4 text-epi-amber" /> Districts Under Watch
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">5</div>
          <div className="text-[11px] text-epi-muted mb-2">
            Rusizi, Kayonza, Huye, Nyamagabe, Rubavu
          </div>
          <Link
            to="/epi/comparison"
            className="text-[11px] font-bold text-epi hover:underline mt-auto">
            
            View district map →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Activity className="w-4 h-4 text-epi-amber" /> New Cases This Week
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[24px] font-bold text-epi-text">1,240</span>
            <span className="text-[12px] font-bold text-epi-amber">
              ↑ +8% vs last week
            </span>
          </div>
          <div className="text-[11px] text-epi-muted mt-auto">
            Across all 12 tracked diseases
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Microscope className="w-4 h-4 text-epi" /> Diseases Tracked
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">12</div>
          <div className="text-[11px] text-epi-muted mt-auto">
            3 rising, 1 at outbreak level, 8 stable
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
          <div className="absolute top-4 right-4 bg-epi-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
            Urgent
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <ClipboardList className="w-4 h-4 text-epi" /> Pending
            Investigations
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">3</div>
          <div className="text-[11px] text-epi-muted mt-auto">
            2 require field deployment
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[65%_35%] gap-6">
        {/* Left Panel */}
        <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              Active Disease Monitoring — This Week
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Disease</th>
                  <th className="px-4 py-3">Cases This Week</th>
                  <th className="px-4 py-3">vs Last Week</th>
                  <th className="px-4 py-3">Trend</th>
                  <th className="px-4 py-3">Districts Affected</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SURVEILLANCE.map((row, i) => {
                  const isRed = row.risk.includes('Red');
                  const isOrange = row.risk.includes('Orange');
                  return (
                    <tr
                      key={i}
                      className={`hover:bg-epi-bg/30 ${isRed ? 'bg-epi-red/5' : isOrange ? 'bg-epi-amber/5' : ''}`}>
                      
                      <td className="px-4 py-3 font-bold text-epi-text">
                        {row.disease}
                      </td>
                      <td className="px-4 py-3 font-medium text-epi-text">
                        {row.cases}
                      </td>
                      <td className="px-4 py-3 text-epi-muted">{row.vs}</td>
                      <td
                        className={`px-4 py-3 font-medium ${row.trend.includes('↑') ? 'text-epi-amber' : row.trend.includes('↓') ? 'text-epi-accent' : 'text-epi-muted'}`}>
                        
                        {row.trend}
                      </td>
                      <td className="px-4 py-3 text-epi-muted">
                        {row.districts}
                      </td>
                      <td className="px-4 py-3 font-medium">{row.risk}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-bold text-[12px] ${isRed ? 'text-epi-red' : isOrange ? 'text-epi-amber' : 'text-epi'}`}>
                          
                          {row.action}
                        </span>
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-lg shadow-card border border-border p-5 flex flex-col h-fit">
          <div className="mb-4">
            <h2 className="text-[16px] font-bold text-epi-text">
              Outbreak Investigations
            </h2>
            <p className="text-[13px] text-epi-muted">3 open investigations</p>
          </div>

          <div className="space-y-3 mb-4">
            {/* Card 1 */}
            <div className="border-l-4 border-l-epi-red border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi-red mb-1">
                🔴 ACTIVE OUTBREAK
              </div>
              <div className="text-[14px] font-bold text-epi-text mb-2">
                Cholera — Rusizi District
              </div>
              <div className="text-[12px] text-epi-muted space-y-1 mb-3">
                <div>Started: June 1, 2026 | Cases: 87</div>
                <div>Investigator: Dr. Jean Paul Habimana</div>
                <div className="font-medium text-epi-text">
                  Status: Field team deployed — Day 4 of investigation
                </div>
              </div>
              <Link
                to="/epi/investigations"
                className="inline-flex h-8 px-4 bg-epi hover:bg-epi-hover text-white text-[12px] font-semibold rounded-md items-center justify-center">
                
                Open Investigation
              </Link>
            </div>

            {/* Card 2 */}
            <div className="border-l-4 border-l-epi-amber border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi-amber mb-1">
                🟠 UNDER INVESTIGATION
              </div>
              <div className="text-[14px] font-bold text-epi-text mb-2">
                Malaria — Kayonza District
              </div>
              <div className="text-[12px] text-epi-muted space-y-1 mb-3">
                <div>Started: June 3, 2026 | Cases: 67</div>
                <div>Investigator: Dr. Aline Uwimana</div>
                <div className="font-medium text-epi-text">
                  Status: Lab results pending — expected June 7
                </div>
              </div>
              <button className="h-8 px-4 bg-epi hover:bg-epi-hover text-white text-[12px] font-semibold rounded-md">
                Open Investigation
              </button>
            </div>

            {/* Card 3 */}
            <div className="border-l-4 border-l-[#EAB308] border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-[#EAB308] mb-1">
                🟡 SIGNAL DETECTED
              </div>
              <div className="text-[14px] font-bold text-epi-text mb-2">
                Mpox — Rubavu District
              </div>
              <div className="text-[12px] text-epi-muted space-y-1 mb-3">
                <div>Signal: June 5, 2026 | Cases: 3</div>
                <div className="font-medium text-epi-text">
                  Status: Near DRC border — awaiting case confirmation
                </div>
              </div>
              <button className="h-8 px-4 bg-epi hover:bg-epi-hover text-white text-[12px] font-semibold rounded-md">
                Open Investigation
              </button>
            </div>
          </div>

          <button className="w-full h-10 border-2 border-epi text-epi hover:bg-epi/5 text-[13px] font-bold rounded-md flex items-center justify-center gap-2 mt-auto">
            <Plus className="w-4 h-4" /> New Investigation
          </button>
        </div>
      </div>
    </EpiLayout>);

}