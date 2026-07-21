import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
const cleaningSummary = [
{
  type: 'Missing age/gender',
  detected: 234,
  autoFixed: 198,
  flagged: 36,
  excluded: 0,
  rule: '"Estimated from household data"',
  status: '🟢 Rule active'
},
{
  type: 'Duplicate patient records',
  detected: 156,
  autoFixed: 156,
  flagged: 0,
  excluded: 0,
  rule: '"Keep latest, merge history"',
  status: '🟢 Rule active'
},
{
  type: 'Wrong district codes',
  detected: 89,
  autoFixed: 89,
  flagged: 0,
  excluded: 0,
  rule: '"Corrected using facility GPS"',
  status: '🟢 Rule active'
},
{
  type: 'Impossible values (age >120, negative counts)',
  detected: 67,
  autoFixed: 0,
  flagged: 34,
  excluded: 33,
  rule: '"Flag if ambiguous, exclude if impossible"',
  status: '🟡 Review needed'
},
{
  type: 'Inconsistent disease names (Kinyarwanda mapping)',
  detected: 1247,
  autoFixed: 1200,
  flagged: 47,
  excluded: 0,
  rule: '"Kinyarwanda → English standard mapping"',
  status: '🟡 3 unmapped terms'
},
{
  type: 'Wrong date formats',
  detected: 312,
  autoFixed: 312,
  flagged: 0,
  excluded: 0,
  rule: '"Auto-converted to ISO 8601 (YYYY-MM-DD)"',
  status: '🟢 Rule active'
},
{
  type: 'Records with 5+ missing fields',
  detected: 103,
  autoFixed: 0,
  flagged: 0,
  excluded: 103,
  rule: '"Excluded — too incomplete"',
  status: '🔴 Excluded'
}];

const flaggedRecords = [
{
  id: 'REC-2026-04471',
  source: 'CHW App',
  district: 'Nyamagabe',
  issue: '"Age = 0 — possible data entry error (infant?)"',
  fix: '"Set age = under 1 year"'
},
{
  id: 'REC-2026-04389',
  source: 'DHIS2',
  district: 'Rusizi',
  issue: "\"Disease: 'Indwara y'amazi' — not in mapping table\"",
  fix: '"Map to: Waterborne Disease"'
},
{
  id: 'REC-2026-04201',
  source: 'EMR',
  district: 'Huye',
  issue: '"Cholera case with negative lab result"',
  fix: '"Reclassify as Suspected (unconfirmed)"'
}];

export function ProcessingCleaning() {
  return (
    <ProcessingLayout
      title="Data Cleaning"
      subtitle="Automated error detection and correction for all incoming Rwanda health data"
      breadcrumb="Data Cleaning">
      
      {/* Top Summary Strip */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit">
        <span className="text-epi-text">Total records today: 47,230</span>
        <span className="text-border">|</span>
        <span className="text-[#00A550]">🟢 44,891 Clean (95.0%)</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 1,847 Auto-corrected</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">🟠 389 Flagged for review</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 103 Excluded</span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Data source: All Sources ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Error type: All Types ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>District: All Districts ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option>Status: All</option>
            <option>Pending Review</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm">
          Export Cleaning Report
        </button>
      </div>

      {/* Cleaning Summary Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Error Type
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Detected
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Auto-Fixed
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Flagged
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Excluded
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Fix Rule
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cleaningSummary.map((row, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    {row.type}
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    {row.detected.toLocaleString()}
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    {row.autoFixed.toLocaleString()}
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    {row.flagged.toLocaleString()}
                  </td>
                  <td className="p-4 text-[14px] text-epi-text text-right">
                    {row.excluded.toLocaleString()}
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted italic">
                    {row.rule}
                  </td>
                  <td className="p-4 text-[13px] font-bold">{row.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flagged for Review Section */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-epi-text">
            389 Records Need Human Review
          </h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
              Review One by One
            </button>
            <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
              Approve All Suggested
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Record ID
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  District
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Issue
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Suggested Fix
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Approve
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Reject
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {flaggedRecords.map((r, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[13px] font-mono text-epi-text">
                    {r.id}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{r.source}</td>
                  <td className="p-4 text-[13px] text-epi-text">
                    {r.district}
                  </td>
                  <td className="p-4 text-[13px] text-epi-red font-medium">
                    {r.issue}
                  </td>
                  <td className="p-4 text-[13px] text-[#00A550] font-medium">
                    {r.fix}
                  </td>
                  <td className="p-4 text-center">
                    <button className="px-3 py-1 bg-[#00A550]/10 text-[#00A550] text-[12px] font-bold rounded hover:bg-[#00A550]/20 transition-colors">
                      ✅ Approve
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button className="px-3 py-1 bg-epi-red/10 text-epi-red text-[12px] font-bold rounded hover:bg-epi-red/20 transition-colors">
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProcessingLayout>);

}