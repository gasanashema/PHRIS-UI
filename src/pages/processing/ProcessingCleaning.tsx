import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import { useApp } from '../../store/AppStore';
import { downloadFile, toCSV } from '../../lib/format';
import { Check, X } from 'lucide-react';
const cleaningSummary = [
{
  type: 'Missing age/gender',
  detected: 234,
  autoFixed: 198,
  flagged: 36,
  excluded: 0,
  rule: '"Estimated from household data"',
  status: '● Rule active'
},
{
  type: 'Duplicate patient records',
  detected: 156,
  autoFixed: 156,
  flagged: 0,
  excluded: 0,
  rule: '"Keep latest, merge history"',
  status: '● Rule active'
},
{
  type: 'Wrong district codes',
  detected: 89,
  autoFixed: 89,
  flagged: 0,
  excluded: 0,
  rule: '"Corrected using facility GPS"',
  status: '● Rule active'
},
{
  type: 'Impossible values (age >120, negative counts)',
  detected: 67,
  autoFixed: 0,
  flagged: 34,
  excluded: 33,
  rule: '"Flag if ambiguous, exclude if impossible"',
  status: '● Review needed'
},
{
  type: 'Inconsistent disease names (Kinyarwanda mapping)',
  detected: 1247,
  autoFixed: 1200,
  flagged: 47,
  excluded: 0,
  rule: '"Kinyarwanda → English standard mapping"',
  status: '● 3 unmapped terms'
},
{
  type: 'Wrong date formats',
  detected: 312,
  autoFixed: 312,
  flagged: 0,
  excluded: 0,
  rule: '"Auto-converted to ISO 8601 (YYYY-MM-DD)"',
  status: '● Rule active'
},
{
  type: 'Records with 5+ missing fields',
  detected: 103,
  autoFixed: 0,
  flagged: 0,
  excluded: 103,
  rule: '"Excluded — too incomplete"',
  status: '● Excluded'
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
  const { actions } = useApp();
  const [source, setSource] = useState('all');
  const [errType, setErrType] = useState('all');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('all');
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [reviewIdx, setReviewIdx] = useState<number | null>(null);

  const summary = cleaningSummary.filter((r) => errType === 'all' || r.type === errType);
  const records = flaggedRecords.filter(
    (r) =>
    (source === 'all' || r.source === source) && (
    district === 'all' || r.district === district) && (
    status === 'all' || (status === 'pending' ? !decisions[r.id] : !!decisions[r.id]))
  );
  const pending = flaggedRecords.filter((r) => !decisions[r.id]);
  const approved = Object.values(decisions).filter((d) => d === 'approved').length;
  const rejected = Object.values(decisions).filter((d) => d === 'rejected').length;

  const decide = (id: string, d: 'approved' | 'rejected') => {
    setDecisions((x) => ({ ...x, [id]: d }));
    actions.logAdminEvent('Processing', `Cleaning review: ${d} suggested fix — ${id}`);
  };

  const exportReport = () => {
    downloadFile(
      'aivital-cleaning-report.csv',
      toCSV(summary.map((r) => ({ error_type: r.type, detected: r.detected, auto_fixed: r.autoFixed, flagged: r.flagged, excluded: r.excluded, rule: r.rule.replace(/"/g, ''), status: r.status }))),
      'text/csv'
    );
    actions.toast('Cleaning report exported as CSV.', 'info');
  };

  const current = reviewIdx !== null ? pending[reviewIdx] : undefined;
  const selectCls = 'text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm';

  return (
    <ProcessingLayout
      title="Data Cleaning"
      subtitle="Automated error detection and correction for all incoming Rwanda health data"
      breadcrumb="Data Cleaning">

      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit max-w-full">
        <span className="text-epi-text">Total records today: 47,230</span>
        <span className="text-border">|</span>
        <span className="text-[#00A550]">● {(44891 + approved).toLocaleString('en-US')} Clean</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">● 1,847 Auto-corrected</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">● {389 - approved - rejected} Flagged for review</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">● {103 + rejected} Excluded</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Data source" className={selectCls}>
            <option value="all">Data source: All</option>
            {Array.from(new Set(flaggedRecords.map((r) => r.source))).map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={errType} onChange={(e) => setErrType(e.target.value)} aria-label="Error type" className={selectCls}>
            <option value="all">Error type: All Types</option>
            {cleaningSummary.map((r) => <option key={r.type}>{r.type}</option>)}
          </select>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="District" className={selectCls}>
            <option value="all">District: All</option>
            {Array.from(new Set(flaggedRecords.map((r) => r.district))).map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className={selectCls}>
            <option value="all">Status: All</option>
            <option value="pending">Pending Review</option>
            <option value="decided">Decided</option>
          </select>
        </div>
        <button onClick={exportReport} className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm">
          Export Cleaning Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Error Type', 'Detected', 'Auto-Fixed', 'Flagged', 'Excluded', 'Fix Rule', 'Status'].map((h, i) =>
                <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${i >= 1 && i <= 4 ? 'text-right' : ''}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summary.map((row) =>
              <tr key={row.type} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-bold text-epi-text">{row.type}</td>
                  <td className="p-4 text-[14px] text-epi-text text-right">{row.detected.toLocaleString()}</td>
                  <td className="p-4 text-[14px] text-epi-text text-right">{row.autoFixed.toLocaleString()}</td>
                  <td className="p-4 text-[14px] text-epi-text text-right">{row.flagged.toLocaleString()}</td>
                  <td className="p-4 text-[14px] text-epi-text text-right">{row.excluded.toLocaleString()}</td>
                  <td className="p-4 text-[13px] text-epi-muted italic">{row.rule}</td>
                  <td className="p-4 text-[13px] font-bold whitespace-nowrap">
                    {row.type.startsWith('Inconsistent disease') ?
                  <Link to="/integration/mapping" className="hover:underline">{row.status} →</Link> :
                  row.status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold text-epi-text">
            {389 - approved - rejected} Records Need Human Review
            <span className="block text-[12px] font-normal text-epi-muted">Showing the {flaggedRecords.length} highest-priority records</span>
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setReviewIdx(pending.length ? 0 : null)}
              disabled={pending.length === 0}
              className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg disabled:opacity-50 transition-colors">

              Review One by One
            </button>
            <button
              onClick={() => {
                pending.forEach((r) => decide(r.id, 'approved'));
                actions.toast(`Approved ${pending.length} suggested fixes.`);
              }}
              disabled={pending.length === 0}
              className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-50 transition-colors">

              Approve All Suggested
            </button>
          </div>
        </div>

        {current &&
        <div className="p-5 border-b border-border bg-epi/5">
            <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-2">
              Reviewing {reviewIdx! + 1} of {pending.length}
            </div>
            <div className="text-[14px] font-bold text-epi-text">{current.id} · {current.source} · {current.district}</div>
            <div className="text-[13px] text-epi-red mt-1">Issue: {current.issue}</div>
            <div className="text-[13px] text-[#00A550] mt-1">Suggested fix: {current.fix}</div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => {decide(current.id, 'approved');setReviewIdx(pending.length > 1 ? 0 : null);}} className="px-3 py-1.5 bg-[#00A550] text-white text-[12px] font-bold rounded flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={() => {decide(current.id, 'rejected');setReviewIdx(pending.length > 1 ? 0 : null);}} className="px-3 py-1.5 bg-epi-red text-white text-[12px] font-bold rounded flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Reject
              </button>
              <button onClick={() => setReviewIdx(null)} className="px-3 py-1.5 text-epi-muted text-[12px] font-bold">Stop review</button>
            </div>
          </div>
        }

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Record ID', 'Source', 'District', 'Issue', 'Suggested Fix', 'Decision'].map((h) =>
                <th key={h} className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.length === 0 &&
              <tr>
                  <td colSpan={6} className="p-6 text-center text-[13px] text-epi-muted">No records match these filters.</td>
                </tr>
              }
              {records.map((r) =>
              <tr key={r.id} className={`transition-colors ${current?.id === r.id ? 'bg-epi/10' : 'hover:bg-epi-bg/50'}`}>
                  <td className="p-4 text-[13px] font-mono text-epi-text">{r.id}</td>
                  <td className="p-4 text-[13px] text-epi-text">{r.source}</td>
                  <td className="p-4 text-[13px] text-epi-text">{r.district}</td>
                  <td className="p-4 text-[13px] text-epi-red font-medium">{r.issue}</td>
                  <td className="p-4 text-[13px] text-[#00A550] font-medium">{r.fix}</td>
                  <td className="p-4 whitespace-nowrap">
                    {decisions[r.id] ? (
                      <span className={`text-[12px] font-bold flex items-center gap-1 ${decisions[r.id] === 'approved' ? 'text-[#00A550]' : 'text-epi-red'}`}>
                        {decisions[r.id] === 'approved' ? (
                          <><Check className="w-3.5 h-3.5" /> Fix applied</>
                        ) : (
                          <><X className="w-3.5 h-3.5" /> Excluded</>
                        )}
                        <button onClick={() => setDecisions(({ [r.id]: _, ...rest }) => rest)} className="ml-2 text-epi-muted font-normal hover:underline">undo</button>
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => decide(r.id, 'approved')} className="px-3 py-1 bg-[#00A550]/10 text-[#00A550] text-[12px] font-bold rounded hover:bg-[#00A550]/20 transition-colors flex items-center gap-1">
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => decide(r.id, 'rejected')} className="px-3 py-1 bg-epi-red/10 text-epi-red text-[12px] font-bold rounded hover:bg-epi-red/20 transition-colors flex items-center gap-1">
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProcessingLayout>);

}
