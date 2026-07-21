import React from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
const CHW = [
{
  sector: 'Tumba',
  cell: 'Cyarwa Cell',
  name: 'Marie Uwimana',
  cases: 12,
  last: 'Today 07:30',
  days: 0,
  active: true
},
{
  sector: 'Ngoma',
  cell: 'Butare Cell',
  name: 'Jean Nshuti',
  cases: 5,
  last: 'Yesterday 16:45',
  days: 1,
  active: true
},
{
  sector: 'Mbazi',
  cell: 'Rango Cell',
  name: 'Claudine Mukiza',
  cases: 3,
  last: 'Today 08:10',
  days: 0,
  active: true
},
{
  sector: 'Mukura',
  cell: 'Gisanze Cell',
  name: 'Paul Gasana',
  cases: 0,
  last: '4 days ago',
  days: 4,
  active: false
},
{
  sector: 'Kinazi',
  cell: 'Rwaniro Cell',
  name: 'Alice Niyonzima',
  cases: 0,
  last: '5 days ago',
  days: 5,
  active: false
},
{
  sector: 'Ruhashya',
  cell: 'Mutunda Cell',
  name: 'David Habimana',
  cases: 0,
  last: '4 days ago',
  days: 4,
  active: false
}];

// 14-day compliance heatmap. 0=reported,1=late,2=missing,3=nodata
const heatRows = [
{
  sector: 'Tumba',
  days: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
},
{
  sector: 'Ngoma',
  days: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0]
},
{
  sector: 'Mbazi',
  days: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
},
{
  sector: 'Maraba',
  days: [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0]
},
{
  sector: 'Mukura',
  days: [0, 0, 1, 2, 2, 2, 2, 0, 0, 1, 2, 2, 2, 2]
},
{
  sector: 'Kinazi',
  days: [0, 1, 2, 2, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2]
},
{
  sector: 'Sovu',
  days: [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0]
},
{
  sector: 'Ruhashya',
  days: [1, 2, 2, 0, 0, 1, 2, 2, 2, 0, 0, 2, 2, 2]
}];

const heatColor = (v: number) =>
v === 0 ?
'bg-admin-accent' :
v === 1 ?
'bg-admin-amber' :
v === 2 ?
'bg-admin-red' :
'bg-gray-200';
export function DhoCHWReports() {
  return (
    <DhoLayout
      title="Community Health Worker Reports — Huye District"
      subtitle="24 CHW sectors | 21 active | 3 flagged inactive"
      breadcrumb="CHW Reports">
      
      {/* Top strip */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm text-admin-accent">
          ✅ 21 Active CHW sectors
        </div>
        <div className="bg-admin-amber/10 px-4 py-2 rounded-full border border-admin-amber/20 text-[13px] font-bold text-admin-amber shadow-sm">
          ⚠️ 3 Inactive (no report &gt;3 days)
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          📋 Total cases reported today: 67
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-admin-amber/10 border border-admin-amber/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-admin-amber shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-[13px] text-admin-text font-medium leading-relaxed">
            <span className="font-bold">
              3 CHW sectors have not reported in more than 3 days:
            </span>{' '}
            Mukura, Kinazi, Ruhashya. These areas may have unreported cases.
            Please follow up immediately.
          </p>
        </div>
        <button className="h-9 px-4 bg-admin-amber hover:bg-admin-amber/90 text-white text-[13px] font-semibold rounded-md flex items-center gap-2 shrink-0">
          <Send className="w-4 h-4" /> Send Follow-Up SMS to All 3
        </button>
      </div>

      {/* CHW table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Village / Cell</th>
                <th className="px-4 py-3">CHW Name</th>
                <th className="px-4 py-3">Cases Reported</th>
                <th className="px-4 py-3">Last Report</th>
                <th className="px-4 py-3">Days Since</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CHW.map((c, i) =>
              <tr
                key={i}
                className={`hover:bg-admin-bg/30 ${c.active ? '' : 'bg-admin-amber/5'}`}>
                
                  <td className="px-4 py-3 font-bold text-admin-text">
                    {c.sector}
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{c.cell}</td>
                  <td className="px-4 py-3 text-admin-text">{c.name}</td>
                  <td className="px-4 py-3 text-admin-text">{c.cases} cases</td>
                  <td className="px-4 py-3 text-admin-muted">{c.last}</td>
                  <td
                  className={`px-4 py-3 font-medium ${c.days > 3 ? 'text-admin-amber' : 'text-admin-muted'}`}>
                  
                    {c.days} {c.days === 1 ? 'day' : 'days'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {c.active ?
                  <span className="text-admin-accent">✅ Active</span> :

                  <span className="text-admin-amber">⚠️ Inactive</span>
                  }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                      {c.active ?
                    <button className="text-admin hover:underline">
                          View
                        </button> :

                    <>
                          <button className="text-admin hover:underline">
                            Contact
                          </button>
                          <span className="text-border">·</span>
                          <button className="text-admin-red hover:underline">
                            Flag
                          </button>
                        </>
                    }
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance heatmap */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6">
        <h3 className="text-[15px] font-bold text-admin-text mb-1">
          CHW Reporting Compliance — Last 14 Days
        </h3>
        <p className="text-[13px] text-admin-muted mb-4">
          Visual gaps highlight sectors with missed reports
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[90px_repeat(14,1fr)] gap-1 mb-1 items-center">
              <span />
              {Array.from({
                length: 14
              }).map((_, i) =>
              <span
                key={i}
                className="text-[9px] text-center text-admin-muted">
                
                  {i + 1}
                </span>
              )}
            </div>
            {heatRows.map((row, i) =>
            <div
              key={i}
              className="grid grid-cols-[90px_repeat(14,1fr)] gap-1 mb-1 items-center">
              
                <span className="text-[11px] font-medium text-admin-text">
                  {row.sector}
                </span>
                {row.days.map((v, j) =>
              <div
                key={j}
                className={`h-5 rounded-sm ${heatColor(v)}`}
                title={`Day ${j + 1}: ${['Reported', 'Late', 'Missing', 'No data'][v]}`} />

              )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5 mt-4 text-[11px] text-admin-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-admin-accent" /> Reported
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-admin-amber" /> Late
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-admin-red" /> Missing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-200" /> No data expected
          </span>
        </div>
      </div>
    </DhoLayout>);

}