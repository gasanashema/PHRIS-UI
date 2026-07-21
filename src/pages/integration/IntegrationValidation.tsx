import React, { Fragment } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
const rules = [
{
  rule: 'Missing required values',
  type: 'Completeness',
  desc: 'Empty fields that must have data (e.g. district, disease, date)',
  severity: '🟠 Error',
  failures: 23,
  status: '🟢 Active'
},
{
  rule: 'Impossible values',
  type: 'Range check',
  desc: 'Values outside biological limits (e.g. Age = 200, cases = -5)',
  severity: '🔴 Critical',
  failures: 4,
  status: '🟢 Active'
},
{
  rule: 'Duplicate records',
  type: 'Deduplication',
  desc: 'Same patient ID + same date reported twice',
  severity: '🟠 Error',
  failures: 11,
  status: '🟢 Active'
},
{
  rule: 'Wrong data format',
  type: 'Format check',
  desc: 'Dates written as text, numbers stored as strings',
  severity: '🟡 Warning',
  failures: 67,
  status: '🟢 Active'
},
{
  rule: 'Out-of-range outbreak values',
  type: 'Statistical outlier',
  desc: 'Cases far above district historical average (e.g. 500 malaria cases from one small health post)',
  severity: '🟡 Warning',
  failures: 8,
  status: '🟢 Active'
},
{
  rule: 'Facility code mismatch',
  type: 'Reference check',
  desc: "Data tagged to a facility code that doesn't exist in the system (e.g. Musanze data labeled Huye)",
  severity: '🟠 Error',
  failures: 9,
  status: '🟢 Active'
},
{
  rule: 'Kinyarwanda field mapping',
  type: 'Language normalization',
  desc: 'Kinyarwanda disease or symptom terms not yet mapped to system codes',
  severity: '🟡 Warning',
  failures: 82,
  status: '🟢 Active'
},
{
  rule: 'CHW district mismatch',
  type: 'Geographic validation',
  desc: 'CHW reports a district outside their registered zone',
  severity: '🟠 Error',
  failures: 4,
  status: '🟢 Active'
}];

const flagged = [
{
  id: 'RW-CHW-20260605-0441',
  source: 'CHW App',
  district: 'Bugesera',
  issue: 'Age field empty for malaria case report',
  severity: '🟠 Error',
  time: 'June 5, 07:12',
  actions: 'Review · Correct · Reject'
},
{
  id: 'RW-DHIS2-20260605-1102',
  source: 'DHIS2',
  district: 'Musanze',
  issue:
  '500 malaria cases from Ruhengeri Health Post — exceeds monthly average by 840%',
  severity: '🟡 Warning (possible outbreak?)',
  time: 'June 5, 11:00',
  actions: 'Investigate · Accept · Reject'
},
{
  id: 'RW-EMR-20260605-0873',
  source: 'EMR Systems',
  district: 'Huye',
  issue: 'Facility code RW-HY-099 not found in facility registry',
  severity: '🟠 Error',
  time: 'June 5, 09:30',
  actions: 'Review · Map Facility · Reject'
},
{
  id: 'RW-CHW-20260605-0219',
  source: 'CHW App',
  district: 'Ngoma',
  issue: 'Disease field contains "Impiswi" — not yet mapped to system code',
  severity: '🟡 Warning',
  time: 'June 5, 07:12',
  actions: 'Map Term · Accept · Reject'
},
{
  id: 'RW-LAB-20260605-0034',
  source: 'RBC Lab',
  district: 'Kicukiro',
  issue: 'Duplicate record — same patient ID + date as RW-LAB-20260604-0891',
  severity: '🔴 Critical',
  time: 'June 5, 12:45',
  actions: 'Compare · Merge · Reject'
}];

export function IntegrationValidation() {
  return (
    <IntegrationLayout
      title="Data Validation Center"
      subtitle="Quality checks applied to all incoming data before system entry"
      breadcrumb="Data Validation">
      
      {/* Top Summary */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit">
        <span className="text-[#00A550]">🟢 8,795 Records Passed</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 189 Records Flagged (Warning)</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">🟠 47 Records Held (Error)</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 9 Records Rejected (Critical)</span>
      </div>

      {/* Source Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-epi text-white whitespace-nowrap">
          All Sources
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          DHIS2
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          RBC Lab
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          CHW App
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          EMR
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          Pharmacy
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          WASAC
        </button>
      </div>

      {/* Validation Rules Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Active Validation Rules
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Rule
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  What It Detects
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Severity
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Failures Today
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.map((r, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    {r.rule}
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted">{r.type}</td>
                  <td className="p-4 text-[13px] text-epi-text max-w-md">
                    {r.desc}
                  </td>
                  <td className="p-4 text-[13px] font-bold">{r.severity}</td>
                  <td className="p-4 text-[13px] text-epi-text">
                    {r.failures} failures today
                  </td>
                  <td className="p-4 text-[13px] font-bold">{r.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flagged Records Panel */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-bold text-epi-text">
              Records Requiring Review
            </h2>
            <p className="text-[13px] text-epi-muted">
              Errors and warnings from today's imports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white">
              <option>All Severity ▼</option>
            </select>
            <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white">
              <option>All Sources ▼</option>
            </select>
            <input
              type="text"
              placeholder="Search records..."
              className="border border-border rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-epi" />
            
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
                  Severity
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {flagged.map((f, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[13px] font-mono text-epi-text">
                    {f.id}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{f.source}</td>
                  <td className="p-4 text-[13px] text-epi-text">
                    {f.district}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text max-w-xs">
                    {f.issue}
                  </td>
                  <td className="p-4 text-[13px] font-bold">{f.severity}</td>
                  <td className="p-4 text-[13px] text-epi-muted">{f.time}</td>
                  <td className="p-4 text-[13px] text-epi font-medium">
                    {f.actions.split(' · ').map((action, i, arr) =>
                  <Fragment key={i}>
                        <button className="hover:underline">{action}</button>
                        {i < arr.length - 1 &&
                    <span className="text-epi-muted mx-1">·</span>
                    }
                      </Fragment>
                  )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border bg-epi-bg/50">
          <div className="flex items-center gap-4 text-[12px]">
            <span className="font-bold text-epi-muted uppercase tracking-wider">
              Severity Legend:
            </span>
            <span className="flex items-center gap-1">
              <span className="text-epi-amber">🟡</span> Warning: accepted but
              flagged
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#F97316]">🟠</span> Error: held pending
              correction
            </span>
            <span className="flex items-center gap-1">
              <span className="text-epi-red">🔴</span> Critical: rejected,
              source notified
            </span>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}