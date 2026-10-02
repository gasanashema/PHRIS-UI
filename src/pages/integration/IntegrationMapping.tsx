import { useState } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { useApp } from '../../store/AppStore';
const diseaseMapping = [
{
  source: 'DHIS2',
  term: 'P. Falciparum',
  system: 'Malaria (Confirmed)',
  category: 'Infectious Disease',
  status: '✅ Mapped'
},
{
  source: 'RBC Lab',
  term: 'V. Cholerae positive',
  system: 'Cholera (Confirmed)',
  category: 'Infectious Disease',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Impiswi',
  system: 'Diarrheal Disease',
  category: 'Gastrointestinal',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Malariya',
  system: 'Malaria (Suspected)',
  category: 'Infectious Disease',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Inkorora',
  system: 'Respiratory Infection',
  category: 'Respiratory',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Agahagarika',
  system: '[Not mapped — select ▼]',
  category: 'Unknown',
  status: '🟡 Pending',
  isPending: true
},
{
  source: 'EMR',
  term: 'Acute febrile illness NEC',
  system: '[Not mapped — select ▼]',
  category: 'Unknown',
  status: '🟡 Pending',
  isPending: true
},
{
  source: 'CHW App',
  term: "Uburwayi bw'ubutwari",
  system: '[Not mapped — select ▼]',
  category: 'Unknown',
  status: '🟡 Pending',
  isPending: true
}];

const facilityMapping = [
{
  source: 'DHIS2',
  code: 'RW-HY-001',
  system: 'Huye District Hospital',
  district: 'Huye',
  status: '✅ Mapped'
},
{
  source: 'DHIS2',
  code: 'RW-MS-003',
  system: 'Musanze Health Centre',
  district: 'Musanze',
  status: '✅ Mapped'
},
{
  source: 'EMR',
  code: 'RW-HY-099',
  system: '[Unknown — not in registry]',
  district: 'Huye',
  status: '🔴 Error — resolve',
  isError: true
},
{
  source: 'EMR',
  code: 'FAC_KIG_0047',
  system: 'Kacyiru Health Centre',
  district: 'Gasabo',
  status: '✅ Mapped'
}];

const STANDARD_TERMS = [
'Malaria (Confirmed)',
'Malaria (Suspected)',
'Cholera (Confirmed)',
'Cholera (Suspected)',
'Diarrheal Disease',
'Respiratory Infection',
'Acute Febrile Illness',
'Measles',
'Typhoid',
'Malnutrition',
'Abdominal Pain (Non-specific)',
'Severe Cough'];

const CATEGORY: Record<string, string> = {
  'Malaria (Confirmed)': 'Infectious Disease',
  'Malaria (Suspected)': 'Infectious Disease',
  'Cholera (Confirmed)': 'Infectious Disease',
  'Cholera (Suspected)': 'Infectious Disease',
  'Diarrheal Disease': 'Gastrointestinal',
  'Respiratory Infection': 'Respiratory',
  'Acute Febrile Illness': 'Syndromic',
  Measles: 'Vaccine-preventable',
  Typhoid: 'Infectious Disease',
  Malnutrition: 'Nutrition',
  'Abdominal Pain (Non-specific)': 'Syndromic',
  'Severe Cough': 'Respiratory'
};

// Unknown Kinyarwanda terms from the failed Nyamagabe CHW batch (see Processing)
const NYAMAGABE_TERMS = ["Indwara y'umubabaro", "Agahinda k'inda", 'Inkorora mbi'];
const TABS = ['All Sources', 'DHIS2', 'RBC Lab', 'CHW App', 'EMR', 'Pending only'];

interface Mapping {
  source: string;
  term: string;
  system: string;
  category: string;
  pending: boolean;
  batch?: string;
}

export function IntegrationMapping() {
  const { state, actions } = useApp();
  const [rows, setRows] = useState<Mapping[]>(() => [
  ...NYAMAGABE_TERMS.map((term) => ({ source: 'CHW App', term, system: '', category: 'Unknown', pending: true, batch: 'Nyamagabe CHW batch' })),
  ...diseaseMapping.map((m) => ({
    source: m.source,
    term: m.term,
    system: m.isPending ? '' : m.system,
    category: m.category,
    pending: !!m.isPending
  }))]
  );
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [tab, setTab] = useState('All Sources');
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ source: 'CHW App', term: '', system: STANDARD_TERMS[0] });
  const [facilities, setFacilities] = useState(facilityMapping.map((f) => ({ ...f })));
  const [facilityChoice, setFacilityChoice] = useState('Huye District Hospital');

  const pending = rows.filter((r) => r.pending).length;
  const list = rows.filter((r) => tab === 'All Sources' || (tab === 'Pending only' ? r.pending : r.source === tab));
  const errors = facilities.filter((f) => f.isError).length;

  const map = (term: string, system: string) => {
    const next = rows.map((r) => r.term === term ? { ...r, system, category: CATEGORY[system] ?? 'Other', pending: false } : r);
    setRows(next);
    setEditing(null);
    actions.logAdminEvent('Integration', `Mapped term “${term}” → ${system}`);
    const remaining = next.filter((r) => r.batch && r.pending).length;
    const wasPending = rows.find((r) => r.term === term)?.batch;
    if (wasPending && remaining === 0) {
      const job = state.jobs.find((j) => j.status === 'failed' && j.detail?.includes('Kinyarwanda'));
      if (job) {
        actions.toast('All Nyamagabe terms mapped — re-running the failed CHW cleaning job.', 'info');
        actions.retryJob(job.id);
        return;
      }
    }
    actions.toast(`“${term}” now maps to ${system}.`);
  };

  return (
    <IntegrationLayout
      title="Data Mapping & Terminology Standardization"
      subtitle="Translate different source formats so all data speaks the same language in AI Vital"
      breadcrumb="Data Mapping">

      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit max-w-full">
        <span className="text-[#00A550]">✅ {(1240 + rows.filter((r) => !r.pending).length - 5).toLocaleString('en-US')} Terms Mapped</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 {pending + 74} Terms Pending Mapping</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 {rows.filter((r) => r.batch && r.pending).length + errors} Terms Causing Errors Today</span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((t) =>
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap ${tab === t ? 'bg-epi text-white' : t === 'Pending only' ? 'bg-epi-amber/20 border border-epi-amber/30 text-epi-text' : 'bg-white border border-border text-epi-muted hover:bg-epi-bg'}`}>

            {t}
            {t === 'Pending only' && ` (${pending})`}
          </button>
        )}
      </div>

      <div id="term-mapping" className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">Disease & Diagnosis Term Mapping</h2>
          <p className="text-[13px] text-epi-muted">Ensure all source disease names resolve to standard AI Vital disease codes</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Source', 'Source Term', '', 'System Standard Term', 'Category', 'Status', 'Action'].map((h, i) =>
                <th key={i} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.length === 0 &&
              <tr>
                  <td colSpan={7} className="p-6 text-center text-[13px] text-epi-muted">No terms in this view.</td>
                </tr>
              }
              {list.map((m) => {
                const isEditing = m.pending || editing === m.term;
                return (
                  <tr key={m.term} className={`hover:bg-epi-bg/50 transition-colors ${m.pending ? 'bg-epi-amber/5' : ''}`}>
                    <td className="p-4 text-[13px] text-epi-text">
                      {m.source}
                      {m.batch && m.pending && <div className="text-[11px] text-epi-red font-medium">{m.batch}</div>}
                    </td>
                    <td className="p-4 text-[13px] font-bold text-epi-text">“{m.term}”</td>
                    <td className="p-4 text-[13px] text-epi-muted text-center">→</td>
                    <td className="p-4">
                      {isEditing ?
                      <select
                        value={choice[m.term] ?? m.system}
                        onChange={(e) => setChoice({ ...choice, [m.term]: e.target.value })}
                        aria-label={`Standard term for ${m.term}`}
                        className="text-[13px] border border-epi-amber rounded px-2 py-1 focus:outline-none bg-white w-full">

                          <option value="">[Not mapped — select]</option>
                          {STANDARD_TERMS.map((t) => <option key={t}>{t}</option>)}
                        </select> :

                      <span className="text-[13px] font-bold text-epi-text">{m.system}</span>
                      }
                    </td>
                    <td className="p-4 text-[13px] text-epi-muted">{m.category}</td>
                    <td className={`p-4 text-[13px] font-bold whitespace-nowrap ${m.pending ? 'text-epi-amber' : ''}`}>
                      {m.pending ? '🟡 Pending' : '✅ Mapped'}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ?
                      <button
                        disabled={!(choice[m.term] ?? m.system)}
                        onClick={() => map(m.term, choice[m.term] ?? m.system)}
                        className="text-[13px] font-bold text-epi-amber hover:underline disabled:text-epi-muted disabled:no-underline">

                          {m.pending ? 'Map Now' : 'Save'}
                        </button> :

                      <button onClick={() => setEditing(m.term)} className="text-[13px] font-medium text-epi hover:underline">
                          Edit
                        </button>
                      }
                    </td>
                  </tr>);

              })}
              {adding &&
              <tr className="bg-epi/5">
                  <td className="p-4">
                    <select value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} className="text-[13px] border border-border rounded px-2 py-1">
                      {['DHIS2', 'RBC Lab', 'CHW App', 'EMR'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <input value={draft.term} onChange={(e) => setDraft({ ...draft, term: e.target.value })} placeholder="Source term" className="text-[13px] border border-border rounded px-2 py-1 w-full" />
                  </td>
                  <td className="p-4 text-center text-epi-muted">→</td>
                  <td className="p-4">
                    <select value={draft.system} onChange={(e) => setDraft({ ...draft, system: e.target.value })} className="text-[13px] border border-border rounded px-2 py-1 w-full">
                      {STANDARD_TERMS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted">{CATEGORY[draft.system]}</td>
                  <td className="p-4" />
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                    disabled={!draft.term.trim() || rows.some((r) => r.term.toLowerCase() === draft.term.trim().toLowerCase())}
                    onClick={() => {
                      setRows([{ source: draft.source, term: draft.term.trim(), system: draft.system, category: CATEGORY[draft.system], pending: false }, ...rows]);
                      actions.logAdminEvent('Integration', `Added manual mapping “${draft.term.trim()}” → ${draft.system}`);
                      actions.toast('Manual mapping added.');
                      setDraft({ ...draft, term: '' });
                      setAdding(false);
                    }}
                    className="text-[13px] font-bold text-epi hover:underline disabled:text-epi-muted disabled:no-underline mr-3">

                      Save
                    </button>
                    <button onClick={() => setAdding(false)} className="text-[13px] text-epi-muted hover:underline">Cancel</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setAdding(true)}
            disabled={adding}
            className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 disabled:opacity-50 transition-colors">

            + Add Manual Mapping
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">Facility Code Translation</h2>
          <p className="text-[13px] text-epi-muted">Match source facility codes to AI Vital facility registry</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Source', 'Source Code', '', 'AI Vital Facility Name', 'District', 'Status'].map((h, i) =>
                <th key={i} className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {facilities.map((m) =>
              <tr key={m.code} className={`hover:bg-epi-bg/50 transition-colors ${m.isError ? 'bg-epi-red/5' : ''}`}>
                  <td className="p-4 text-[13px] text-epi-text">{m.source}</td>
                  <td className="p-4 text-[13px] font-mono text-epi-text">“{m.code}”</td>
                  <td className="p-4 text-[13px] text-epi-muted text-center">→</td>
                  <td className={`p-4 text-[13px] font-bold ${m.isError ? 'text-epi-red' : 'text-epi-text'}`}>
                    {m.isError ?
                  <div className="flex flex-wrap items-center gap-2">
                        <select value={facilityChoice} onChange={(e) => setFacilityChoice(e.target.value)} className="text-[13px] font-normal border border-epi-red rounded px-2 py-1 bg-white text-epi-text">
                          {['Huye District Hospital', 'Tumba Health Center', 'Ngoma Health Center', 'Maraba Health Center', 'Mbazi Health Center'].map((f) => <option key={f}>{f}</option>)}
                        </select>
                        <button
                      onClick={() => {
                        setFacilities(facilities.map((f) => f.code === m.code ? { ...f, system: facilityChoice, status: '✅ Mapped', isError: false } : f));
                        actions.logAdminEvent('Integration', `Mapped facility code ${m.code} → ${facilityChoice}`);
                        actions.toast(`${m.code} mapped to ${facilityChoice}. Held EMR records will be released on the next pipeline run.`);
                      }}
                      className="text-[12px] font-bold text-epi hover:underline">

                          Resolve
                        </button>
                      </div> :

                  m.system
                  }
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{m.district}</td>
                  <td className={`p-4 text-[13px] font-bold ${m.isError ? 'text-epi-red' : ''}`}>{m.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-[16px] font-bold text-epi-text mb-1">Data Transformation Rules</h2>
        <p className="text-[13px] text-epi-muted mb-4">Standardize formats across all sources</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">Date Formats</h3>
            <div className="text-[13px] text-epi-muted space-y-2 mb-6 flex-1">
              <p>
                All dates normalized to: <span className="font-mono text-epi-text bg-epi-bg px-1 rounded">YYYY-MM-DD</span>
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>'05/06/2026' → '2026-06-05'</li>
                <li>'June 5, 2026' → '2026-06-05'</li>
              </ul>
            </div>
            <div className="text-[13px] font-bold mt-auto">Status: 🟢 Active</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">Phone Numbers</h3>
            <div className="text-[13px] text-epi-muted space-y-2 mb-6 flex-1">
              <p>
                All Rwanda phones normalized to: <span className="font-mono text-epi-text bg-epi-bg px-1 rounded">+250 7XX XXX XXX</span>
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>'0788123456' → '+250 788 123 456'</li>
                <li>'788 123 456' → '+250 788 123 456'</li>
              </ul>
            </div>
            <div className="text-[13px] font-bold mt-auto">Status: 🟢 Active</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">Kinyarwanda Normalization</h3>
            <div className="text-[13px] text-epi-muted space-y-2 mb-6 flex-1">
              <p>Kinyarwanda disease terms mapped via translation table.</p>
              <p>{pending + 74} terms currently pending review. CHW app is primary source.</p>
            </div>
            <div className="flex items-center justify-between gap-2 mt-auto">
              <div className="text-[13px] font-bold text-epi-amber">Status: 🟡 {pending + 74} pending</div>
              <button
                onClick={() => {
                  setTab('Pending only');
                  document.getElementById('term-mapping')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 bg-epi-amber text-white text-[12px] font-bold rounded hover:bg-epi-amber/90 transition-colors">

                Review Pending Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}
