import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
export function ProcessingQuality() {
  return (
    <ProcessingLayout
      title="Data Quality Scores"
      subtitle="District-level data reliability scoring — updated after each processing run"
      breadcrumb="Data Quality Scores">
      
      {/* Top Summary */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit">
        <span className="text-[#00A550]">🟢 19 Districts: Good (≥80%)</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 7 Districts: Fair (60–79%)</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">🟠 3 Districts: Poor (40–59%)</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 1 District: Critical (&lt;40%)</span>
      </div>

      {/* Main Quality Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  District
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Province
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Completeness
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Accuracy
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Consistency
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Overall Score
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                  Trend
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  DHO Notified
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-epi-bg/50">
                <td
                  colSpan={9}
                  className="p-2 text-[11px] font-bold text-epi-muted uppercase tracking-wider pl-4">
                  
                  Top Performers
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Gasabo
                </td>
                <td className="p-4 text-[13px] text-epi-text">Kigali</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  97%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  95%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  98%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#00A550] text-right">
                  🟢 97%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-muted text-center">
                  → Stable
                </td>
                <td className="p-4 text-[13px] text-epi-muted">—</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Musanze
                </td>
                <td className="p-4 text-[13px] text-epi-text">Northern</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  95%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  94%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  96%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#00A550] text-right">
                  🟢 95%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#00A550] text-center">
                  ↑
                </td>
                <td className="p-4 text-[13px] text-epi-muted">—</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Kicukiro
                </td>
                <td className="p-4 text-[13px] text-epi-text">Kigali</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  94%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  93%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  95%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#00A550] text-right">
                  🟢 94%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-muted text-center">
                  → Stable
                </td>
                <td className="p-4 text-[13px] text-epi-muted">—</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button>
                </td>
              </tr>

              <tr className="bg-epi-bg/50">
                <td
                  colSpan={9}
                  className="p-2 text-[11px] font-bold text-epi-muted uppercase tracking-wider pl-4">
                  
                  Mid Performers
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Huye
                </td>
                <td className="p-4 text-[13px] text-epi-text">Southern</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  89%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  91%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  87%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#00A550] text-right">
                  🟢 89%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#00A550] text-center">
                  ↑
                </td>
                <td className="p-4 text-[13px] text-epi-muted">—</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Rusizi
                </td>
                <td className="p-4 text-[13px] text-epi-text">Western</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  72%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  78%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  70%
                </td>
                <td className="p-4 text-[14px] font-bold text-[#F97316] text-right">
                  🟠 73%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-red text-center">
                  ↓
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  ✅ Sent
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button> ·{' '}
                  <button className="hover:underline">Flag</button>
                </td>
              </tr>

              <tr className="bg-epi-bg/50">
                <td
                  colSpan={9}
                  className="p-2 text-[11px] font-bold text-epi-muted uppercase tracking-wider pl-4">
                  
                  Poor Performers
                </td>
              </tr>
              <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Nyamagabe
                </td>
                <td className="p-4 text-[13px] text-epi-text">Southern</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  61%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  65%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  58%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-red text-right">
                  🔴 61%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-red text-center">
                  ↓
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  ✅ Sent June 3
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button> ·{' '}
                  <button className="hover:underline">Escalate</button>
                </td>
              </tr>
              <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Ngororero
                </td>
                <td className="p-4 text-[13px] text-epi-text">Western</td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  58%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  62%
                </td>
                <td className="p-4 text-[13px] text-epi-text text-right">
                  54%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-red text-right">
                  🔴 58%
                </td>
                <td className="p-4 text-[14px] font-bold text-epi-red text-center">
                  ↓
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  ✅ Sent June 4
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View</button> ·{' '}
                  <button className="hover:underline">Escalate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Explanation Card */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6">
        <h2 className="text-[16px] font-bold text-epi-text mb-6">
          How Quality Scores Are Calculated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-[14px] font-bold text-epi-text mb-2">
              Completeness (33%)
            </h3>
            <p className="text-[13px] text-epi-muted leading-relaxed">
              % of expected fields that have values. Missing age, date, or
              disease name all reduce this score.
            </p>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-epi-text mb-2">
              Accuracy (33%)
            </h3>
            <p className="text-[13px] text-epi-muted leading-relaxed">
              % of values that pass validation rules. Impossible values, wrong
              formats, failed cross-checks reduce score.
            </p>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-epi-text mb-2">
              Consistency (33%)
            </h3>
            <p className="text-[13px] text-epi-muted leading-relaxed">
              % of records that are consistent across sources. A case reported
              in DHIS2 but not in EMR reduces score.
            </p>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}