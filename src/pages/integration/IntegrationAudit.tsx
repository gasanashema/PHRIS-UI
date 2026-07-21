import React, { useState } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { X } from 'lucide-react';
const audits = [
{
  time: 'June 5, 13:00',
  source: 'DHIS2 / HMIS',
  received: '4,272',
  imported: '4,188',
  flagged: '42',
  rejected: '0',
  status: '✅ Success',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 5, 12:45',
  source: 'RBC Laboratory',
  received: '340',
  imported: '335',
  flagged: '5',
  rejected: '0',
  status: '✅ Success',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 5, 11:30',
  source: 'CHW App',
  received: '1,285',
  imported: '1,240',
  flagged: '45',
  rejected: '0',
  status: '⚠️ Imported with warnings',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 5, 11:00',
  source: 'Pharmacy / FDA',
  received: '904',
  imported: '890',
  flagged: '14',
  rejected: '0',
  status: '✅ Success',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 5, 09:30',
  source: 'EMR Systems',
  received: '2,234',
  imported: '2,100',
  flagged: '188',
  rejected: '0',
  status: '⚠️ Partial — 18 districts missing',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 5, 06:00',
  source: 'WASAC',
  received: '120',
  imported: '120',
  flagged: '0',
  rejected: '0',
  status: '✅ Success',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 5, 06:00',
  source: 'Rwanda Met Agency',
  received: '0',
  imported: '0',
  flagged: '—',
  rejected: '—',
  status: '🔴 FAILED — SSL error',
  by: 'Automatic',
  action: 'View Error Log'
},
{
  time: 'June 4, 14:00',
  source: 'DHIS2 / HMIS',
  received: '3,980',
  imported: '3,941',
  flagged: '39',
  rejected: '0',
  status: '✅ Success',
  by: 'Automatic',
  action: 'View Details'
},
{
  time: 'June 2, 11:45',
  source: 'NISR Census Data',
  received: '1 file uploaded',
  imported: '10,920 rows',
  flagged: '0',
  rejected: '0',
  status: '✅ Manual upload — success',
  by: 'Jean Paul Habimana',
  action: 'View Details'
}];

export function IntegrationAudit() {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <IntegrationLayout
      title="Data Audit Trail"
      subtitle="Complete record of every data import and transaction in AI Vital"
      breadcrumb="Audit Trail">
      
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden relative">
        {/* Top Filter Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-epi-bg/50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-medium text-epi-muted">
              Source:
            </span>
            <select className="text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option>All Sources ▼</option>
            </select>
            <span className="text-[13px] font-medium text-epi-muted ml-2">
              Status:
            </span>
            <select className="text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option>All</option>
              <option>Success</option>
              <option>Warning</option>
              <option>Failed</option>
            </select>
            <span className="text-[13px] font-medium text-epi-muted ml-2">
              Action by:
            </span>
            <select className="text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option>All</option>
              <option>Automatic</option>
              <option>Manual ▼</option>
            </select>
            <span className="text-[13px] font-medium text-epi-muted ml-2">
              Date range:
            </span>
            <select className="text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option>June 1–5, 2026 ▼</option>
            </select>
          </div>
          <button className="px-4 py-1.5 text-[13px] font-bold text-epi border border-epi rounded hover:bg-epi/5 transition-colors bg-white">
            Export Audit Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Records
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Imported
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Flagged
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Rejected
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Action By
                </th>
                <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {audits.map((a, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-3 text-[13px] text-epi-text whitespace-nowrap">
                    {a.time}
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    {a.source}
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">
                    {a.received}
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">
                    {a.imported}
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">{a.flagged}</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    {a.rejected}
                  </td>
                  <td className="p-3 text-[13px] font-bold">{a.status}</td>
                  <td className="p-3 text-[13px] text-epi-text">{a.by}</td>
                  <td className="p-3 text-right">
                    <button
                    onClick={() => setShowDetail(true)}
                    className="text-[13px] font-medium text-epi hover:underline whitespace-nowrap">
                    
                      {a.action}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between text-[13px] text-epi-muted">
          <span>Showing 1–9 of 847 transactions</span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-border rounded hover:bg-epi-bg disabled:opacity-50"
              disabled>
              
              Previous
            </button>
            <button className="px-3 py-1 border border-border rounded hover:bg-epi-bg">
              Next
            </button>
          </div>
        </div>

        {/* Audit Detail Panel */}
        {showDetail &&
        <div className="absolute top-0 right-0 bottom-0 w-[480px] bg-white border-l border-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-right">
            <div className="p-6 border-b border-border flex items-center justify-between bg-epi-bg/50">
              <h2 className="text-[18px] font-bold text-epi-text">
                Audit Record — DHIS2 / June 5, 13:00
              </h2>
              <button
              onClick={() => setShowDetail(false)}
              className="p-2 hover:bg-white rounded-full text-epi-muted">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-epi-bg p-3 rounded border border-border text-center">
                  <div className="text-[18px] font-bold text-epi-text">
                    4,272
                  </div>
                  <div className="text-[11px] text-epi-muted uppercase tracking-wider font-bold">
                    Received
                  </div>
                </div>
                <div className="bg-[#00A550]/10 p-3 rounded border border-[#00A550]/20 text-center">
                  <div className="text-[18px] font-bold text-[#00A550]">
                    4,188
                  </div>
                  <div className="text-[11px] text-[#00A550] uppercase tracking-wider font-bold">
                    Imported
                  </div>
                </div>
                <div className="bg-epi-amber/10 p-3 rounded border border-epi-amber/20 text-center">
                  <div className="text-[18px] font-bold text-epi-amber">42</div>
                  <div className="text-[11px] text-epi-amber uppercase tracking-wider font-bold">
                    Flagged
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-[13px] text-epi-muted">
                    Processing duration
                  </span>
                  <span className="text-[13px] font-bold text-epi-text">
                    4m 32s
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-[13px] text-epi-muted">
                    Destination tables updated
                  </span>
                  <span className="text-[13px] font-bold text-epi-text text-right">
                    Disease Cases, Facility Reports,
                    <br />
                    District Summary
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-[13px] text-epi-muted">
                    Data version tag
                  </span>
                  <span className="text-[13px] font-mono text-epi-text">
                    v2026.06.05.1300
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-[13px] text-epi-muted">
                    Triggered by
                  </span>
                  <span className="text-[13px] font-bold text-epi-text">
                    Automated schedule
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-[13px] text-epi-muted">
                    Next scheduled run
                  </span>
                  <span className="text-[13px] font-bold text-epi-text">
                    15:00 today
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-epi-text mb-3">
                  Flagged Records (42)
                </h3>
                <div className="bg-epi-bg rounded border border-border p-3 text-[13px] text-epi-muted text-center cursor-pointer hover:bg-border/50 transition-colors">
                  Click to expand list of flagged items
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-epi-bg/50">
              <button className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
                Download Full Log (CSV)
              </button>
            </div>
          </div>
        }
      </div>
    </IntegrationLayout>);

}