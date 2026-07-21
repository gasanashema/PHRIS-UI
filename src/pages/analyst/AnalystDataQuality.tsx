import React from 'react';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
const SOURCES = [
{
  name: 'DHIS2 / HMIS',
  comp: '94%',
  acc: '91%',
  time: '88%',
  score: '91%',
  status: '🟢 Good',
  action: 'View Details'
},
{
  name: 'RBC Laboratory',
  comp: '89%',
  acc: '96%',
  time: '65%',
  score: '83%',
  status: '🟡 Fair',
  action: 'View · Flag'
},
{
  name: 'CHW Reports',
  comp: '78%',
  acc: '85%',
  time: '72%',
  score: '78%',
  status: '🟡 Fair',
  action: 'View · Flag'
},
{
  name: 'NISR Census',
  comp: '99%',
  acc: '98%',
  time: 'N/A',
  score: '99%',
  status: '🟢 Good',
  action: 'View'
},
{
  name: 'Rwanda Met Agency',
  comp: '45%',
  acc: '88%',
  time: '30%',
  score: '54%',
  status: '🔴 Critical',
  action: 'View · Escalate',
  critical: true
},
{
  name: 'WASAC',
  comp: '82%',
  acc: '90%',
  time: '78%',
  score: '83%',
  status: '🟡 Fair',
  action: 'View · Flag'
},
{
  name: 'MINAGRI',
  comp: '71%',
  acc: '83%',
  time: '55%',
  score: '70%',
  status: '🟠 Poor',
  action: 'View · Flag'
},
{
  name: 'EMR (hospitals)',
  comp: '91%',
  acc: '94%',
  time: '85%',
  score: '90%',
  status: '🟢 Good',
  action: 'View'
},
{
  name: 'Pharmacy data',
  comp: '87%',
  acc: '89%',
  time: '80%',
  score: '85%',
  status: '🟡 Fair',
  action: 'View'
}];

const getPillColor = (val: string) => {
  if (val === 'N/A') return 'bg-epi-bg text-epi-muted';
  const num = parseInt(val);
  if (num >= 90)
  return 'bg-epi-accent/10 text-epi-accent border border-epi-accent/20';
  if (num >= 75) return 'bg-[#FEF08A]/40 text-[#A16207] border border-[#FDE047]';
  if (num >= 60)
  return 'bg-epi-amber/10 text-epi-amber border border-epi-amber/20';
  return 'bg-epi-red/10 text-epi-red border border-epi-red/20';
};
export function AnalystDataQuality() {
  return (
    <AnalystLayout
      title="Data Quality Management"
      subtitle="Monitor completeness, accuracy, and timeliness of all AI Vital data sources"
      breadcrumb="Data Quality">
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-epi-accent shadow-sm">
          🟢 3 Sources: Good Quality
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-[#A16207] shadow-sm">
          🟡 4 Sources: Fair
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-epi-amber shadow-sm">
          🟠 2 Sources: Poor
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-epi-red shadow-sm">
          🔴 1 Source: Critical
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Data Source</th>
                <th className="px-4 py-3">Completeness</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Timeliness</th>
                <th className="px-4 py-3">Overall Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SOURCES.map((row, i) =>
              <tr
                key={i}
                className={`hover:bg-epi-bg/30 ${row.critical ? 'bg-epi-red/5' : ''}`}>
                
                  <td className="px-4 py-3 font-bold text-epi-text">
                    {row.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${getPillColor(row.comp)}`}>
                    
                      {row.comp}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${getPillColor(row.acc)}`}>
                    
                      {row.acc}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${getPillColor(row.time)}`}>
                    
                      {row.time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                    className={`px-2 py-0.5 rounded text-[12px] font-bold ${getPillColor(row.score)}`}>
                    
                      {row.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold">{row.status}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                    className={`text-[12px] font-bold hover:underline ${row.critical ? 'text-epi-red' : 'text-epi'}`}>
                    
                      {row.action}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-[60%_40%] gap-6">
        {/* Left - Heatmap */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-4">
            DHIS2 Facility Reporting — Last 7 Days
          </h2>
          <div className="flex-1 bg-epi-bg border border-border rounded-lg flex items-center justify-center min-h-[300px] relative">
            <div className="text-[13px] text-epi-muted">
              [Heatmap Grid Visualization: 30 districts x 7 days]
            </div>
            <div className="absolute bottom-4 left-4 flex gap-3 text-[11px] font-medium bg-white/90 p-2 rounded shadow-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-epi rounded-sm" /> 100% reported
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-epi/40 rounded-sm" /> Partial
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-epi-red rounded-sm" /> Missing
              </span>
            </div>
          </div>
        </div>

        {/* Right - Queue */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6">
          <h2 className="text-[16px] font-bold text-epi-text mb-4">
            Flagged Data Issues (4)
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-l-epi-red border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi-red mb-1">
                🔴 CRITICAL
              </div>
              <div className="text-[13px] text-epi-text font-medium mb-3">
                Rwanda Met Agency disconnected 3 days — environmental risk model
                affected
              </div>
              <button className="h-8 px-4 bg-epi-red hover:bg-epi-red/90 text-white text-[12px] font-bold rounded-md">
                Escalate to IT Admin
              </button>
            </div>
            <div className="border-l-4 border-l-epi-amber border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-epi-amber mb-1">
                🟠 HIGH
              </div>
              <div className="text-[13px] text-epi-text font-medium mb-3">
                CHW reports from Mukura sector not received 5 days
              </div>
              <button className="h-8 px-4 bg-epi-bg border border-border hover:border-epi text-epi-text text-[12px] font-bold rounded-md">
                Send reminder
              </button>
            </div>
            <div className="border-l-4 border-l-[#EAB308] border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-[#A16207] mb-1">
                🟡 MEDIUM
              </div>
              <div className="text-[13px] text-epi-text font-medium mb-3">
                3 facilities in Kirehe submitted impossible values (negative
                case counts)
              </div>
              <button className="h-8 px-4 bg-epi-bg border border-border hover:border-epi text-epi-text text-[12px] font-bold rounded-md">
                Request resubmission
              </button>
            </div>
            <div className="border-l-4 border-l-[#EAB308] border border-border rounded-r-lg p-4 bg-white">
              <div className="text-[11px] font-bold text-[#A16207] mb-1">
                🟡 MEDIUM
              </div>
              <div className="text-[13px] text-epi-text font-medium mb-3">
                Lab turnaround time above 2-day target for Ruhengeri Hospital
                (4.1 days avg)
              </div>
              <button className="h-8 px-4 bg-epi-bg border border-border hover:border-epi text-epi-text text-[12px] font-bold rounded-md">
                Flag to lab manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}