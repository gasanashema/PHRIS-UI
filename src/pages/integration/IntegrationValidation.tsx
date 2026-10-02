import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { useApp } from '../../store/AppStore';
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

const TABS = ['All Sources', 'DHIS2', 'RBC Lab', 'CHW App', 'EMR Systems', 'Pharmacy', 'WASAC'];
const OUTCOME: Record<string, {label: string;cls: string;}> = {
  Accept: { label: '✅ Accepted', cls: 'text-[#00A550]' },
  Correct: { label: '✏️ Corrected & accepted', cls: 'text-[#00A550]' },
  Merge: { label: '🔗 Merged with original', cls: 'text-[#00A550]' },
  'Map Facility': { label: '📍 Facility mapped & accepted', cls: 'text-[#00A550]' },
  Reject: { label: '❌ Rejected — source notified', cls: 'text-epi-red' }
};

export function IntegrationValidation() {
  const { actions } = useApp();
  const [tab, setTab] = useState('All Sources');
  const [severity, setSeverity] = useState('all');
  const [q, setQ] = useState('');
  const [resolved, setResolved] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);

  const list = flagged.filter(
    (f) =>
    (tab === 'All Sources' || f.source === tab) && (
    severity === 'all' || f.severity.toLowerCase().includes(severity)) && (
    !q || `${f.id} ${f.district} ${f.issue}`.toLowerCase().includes(q.toLowerCase()))
  );
  const done = Object.values(resolved);
  const accepted = done.filter((o) => o !== 'Reject').length;
  const rejected = done.filter((o) => o === 'Reject').length;
  const pendingWarn = flagged.filter((f) => !resolved[f.id] && f.severity.includes('Warning')).length;
  const pendingErr = flagged.filter((f) => !resolved[f.id] && f.severity.includes('Error')).length;

  const act = (f: (typeof flagged)[number], action: string) => {
    if (action === 'Map Term') return;
    if (['Review', 'Investigate', 'Compare'].includes(action)) {
      setOpen(open === f.id ? null : f.id);
      return;
    }
    setResolved({ ...resolved, [f.id]: action });
    setOpen(null);
    actions.logAdminEvent('Integration', `Validation: ${action} — ${f.id}`, f.issue);
    actions.toast(`${f.id}: ${OUTCOME[action]?.label ?? action}.`, action === 'Reject' ? 'info' : 'success');
  };

  return (
    <IntegrationLayout
      title="Data Validation Center"
      subtitle="Quality checks applied to all incoming data before system entry"
      breadcrumb="Data Validation">

      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit max-w-full">
        <span className="text-[#00A550]">🟢 {(8795 + accepted).toLocaleString('en-US')} Records Passed</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 {184 + pendingWarn} Records Flagged (Warning)</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">🟠 {45 + pendingErr} Records Held (Error)</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 {9 + rejected} Records Rejected</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((t) =>
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap ${tab === t ? 'bg-epi text-white' : 'bg-white border border-border text-epi-muted hover:bg-epi-bg'}`}>

            {t} {t !== 'All Sources' && `(${flagged.filter((f) => f.source === t && !resolved[f.id]).length})`}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">Active Validation Rules</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Rule', 'Type', 'What It Detects', 'Severity', 'Failures Today', 'Status'].map((h) =>
                <th key={h} className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.map((r) =>
              <tr key={r.rule} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-bold text-epi-text">{r.rule}</td>
                  <td className="p-4 text-[13px] text-epi-muted">{r.type}</td>
                  <td className="p-4 text-[13px] text-epi-text max-w-md">{r.desc}</td>
                  <td className="p-4 text-[13px] font-bold whitespace-nowrap">{r.severity}</td>
                  <td className="p-4 text-[13px] text-epi-text">{r.failures} failures today</td>
                  <td className="p-4 text-[13px] font-bold">{r.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-bold text-epi-text">Records Requiring Review</h2>
            <p className="text-[13px] text-epi-muted">
              {flagged.length - done.length} of {flagged.length} still need a decision
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} aria-label="Severity" className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white">
              <option value="all">All Severity</option>
              <option value="critical">🔴 Critical</option>
              <option value="error">🟠 Error</option>
              <option value="warning">🟡 Warning</option>
            </select>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search records..."
              className="border border-border rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-epi" />

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Record ID', 'Source', 'District', 'Issue', 'Severity', 'Timestamp', 'Action'].map((h) =>
                <th key={h} className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.length === 0 &&
              <tr>
                  <td colSpan={7} className="p-6 text-center text-[13px] text-epi-muted">No records match these filters.</td>
                </tr>
              }
              {list.map((f) =>
              <Fragment key={f.id}>
                  <tr className={`transition-colors ${resolved[f.id] ? 'bg-epi-bg/40' : 'hover:bg-epi-bg/50'}`}>
                    <td className="p-4 text-[13px] font-mono text-epi-text">{f.id}</td>
                    <td className="p-4 text-[13px] text-epi-text">{f.source}</td>
                    <td className="p-4 text-[13px] text-epi-text">{f.district}</td>
                    <td className="p-4 text-[13px] text-epi-text max-w-xs">{f.issue}</td>
                    <td className="p-4 text-[13px] font-bold">{f.severity}</td>
                    <td className="p-4 text-[13px] text-epi-muted whitespace-nowrap">{f.time}</td>
                    <td className="p-4 text-[13px] text-epi font-medium whitespace-nowrap">
                      {resolved[f.id] ?
                    <span className={`font-bold ${OUTCOME[resolved[f.id]]?.cls}`}>{OUTCOME[resolved[f.id]]?.label}</span> :
                    f.actions.split(' · ').map((action, i, arr) =>
                    <Fragment key={action}>
                            {action === 'Map Term' ?
                      <Link to="/integration/mapping" className="hover:underline">{action}</Link> :

                      <button onClick={() => act(f, action)} className={`hover:underline ${action === 'Reject' ? 'text-epi-red' : ''}`}>
                                {action}
                              </button>
                      }
                            {i < arr.length - 1 && <span className="text-epi-muted mx-1">·</span>}
                          </Fragment>
                    )}
                    </td>
                  </tr>
                  {open === f.id &&
                <tr className="bg-epi-bg/60">
                      <td colSpan={7} className="px-6 py-4 text-[13px] text-epi-text">
                        <div className="font-bold mb-1">Record detail</div>
                        <div className="text-epi-muted mb-3">
                          Raw payload from {f.source} for {f.district} received {f.time}. Rule triggered: {f.severity.replace(/[^A-Za-z ()?]/g, '').trim()}.
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => act(f, f.actions.includes('Merge') ? 'Merge' : f.actions.includes('Map Facility') ? 'Map Facility' : f.actions.includes('Correct') ? 'Correct' : 'Accept')} className="px-3 py-1.5 bg-epi text-white text-[12px] font-bold rounded">
                            {f.actions.includes('Merge') ? 'Merge records' : f.actions.includes('Map Facility') ? 'Map to RW-HY-009 (Huye DH)' : f.actions.includes('Correct') ? 'Correct & accept' : 'Accept as genuine signal'}
                          </button>
                          <button onClick={() => act(f, 'Reject')} className="px-3 py-1.5 bg-white border border-border text-epi-red text-[12px] font-bold rounded">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border bg-epi-bg/50">
          <div className="flex flex-wrap items-center gap-4 text-[12px]">
            <span className="font-bold text-epi-muted uppercase tracking-wider">Severity Legend:</span>
            <span>🟡 Warning: accepted but flagged</span>
            <span>🟠 Error: held pending correction</span>
            <span>🔴 Critical: rejected, source notified</span>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}
