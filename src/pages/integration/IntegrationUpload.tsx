import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp, useCurrentUser } from '../../store/AppStore';
import { fmtDate, fmtNumber } from '../../lib/format';

const SEED_HISTORY = [
{ date: 'June 2, 2026', by: 'Jean Paul Habimana', source: 'NISR Census', file: 'census_2022_final.xlsx', records: '10,920 rows', status: '✅ Imported successfully' },
{ date: 'May 15, 2026', by: 'Aline Uwimana', source: 'MINAGRI', file: 'food_security_Q1.csv', records: '847 rows', status: '✅ Imported successfully' },
{ date: 'April 30, 2026', by: 'Jean Paul Habimana', source: 'WASAC', file: 'wash_coverage_apr.xlsx', records: '1,204 rows', status: '⚠️ Imported with 34 warnings' }];


const TARGET_FIELDS = ['District', 'Sector', 'Date', 'Disease', 'Cases', 'Population', 'Indicator', 'Value', '— Ignore —'];
const STEPS = ['Select File', 'Map Columns', 'Validate', 'Preview', 'Import'];

interface Parsed {
  name: string;
  size: number;
  headers: string[];
  rows: string[][];
  total: number;
  sample: boolean; // true when contents could not be read (Excel) and sample data is shown
}

function guess(header: string) {
  const h = header.toLowerCase();
  return TARGET_FIELDS.find((f) => h.includes(f.toLowerCase())) ?? (h.includes('pop') ? 'Population' : h.includes('count') ? 'Cases' : 'Value');
}

export function IntegrationUpload() {
  const { state, actions } = useApp();
  const user = useCurrentUser('integration');
  const [params] = useSearchParams();
  const manual = state.sources.filter((s) => s.enabled);
  const [sourceId, setSourceId] = useState(params.get('source') ?? 'nisr');
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<Parsed | null>(null);
  const [mapping, setMapping] = useState<string[]>([]);
  const [from, setFrom] = useState('2026-05-01');
  const [to, setTo] = useState('2026-05-31');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{records: number;rejected: number;} | null>(null);

  // ~2% of rows fail validation; many more if no column is mapped to District
  const rejected = file ?
  Math.min(file.total, Math.round(file.total * 0.02) + (mapping.includes('District') ? 0 : Math.ceil(file.total * 0.1))) :
  0;
  const accepted = file ? file.total - rejected : 0;
  const source = state.sources.find((s) => s.id === sourceId);
  const uploads = state.syncLog.filter((l) => l.message.startsWith('Manual upload'));

  const onFile = (f: File | undefined) => {
    setError('');
    setDone(null);
    if (!f) return;
    if (!/\.(csv|xlsx|xls)$/i.test(f.name)) {
      setError('Unsupported file type. Please choose a .csv, .xlsx or .xls file.');
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError('File is larger than 50MB.');
      return;
    }
    if (/\.csv$/i.test(f.name)) {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = String(reader.result).split(/\r?\n/).filter((l) => l.trim());
        const headers = (lines[0] ?? '').split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const rows = lines.slice(1, 6).map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')));
        const parsed = { name: f.name, size: f.size, headers, rows, total: Math.max(0, lines.length - 1), sample: false };
        setFile(parsed);
        setMapping(headers.map(guess));
        setStep(1);
      };
      reader.onerror = () => setError('The file could not be read.');
      reader.readAsText(f);
    } else {
      // Excel parsing is not available without a library — show a representative sample
      const headers = ['district', 'sector', 'reporting_date', 'indicator', 'value'];
      const parsed: Parsed = {
        name: f.name,
        size: f.size,
        headers,
        rows: [
        ['Huye', 'Tumba', '2026-05-31', 'households_with_safe_water', '812'],
        ['Huye', 'Maraba', '2026-05-31', 'households_with_safe_water', '640'],
        ['Rusizi', 'Bugarama', '2026-05-31', 'households_with_safe_water', '377'],
        ['Nyamagabe', 'Gasaka', '2026-05-31', 'households_with_safe_water', '905'],
        ['Kayonza', 'Rwinkwavu', '2026-05-31', 'households_with_safe_water', '598']],

        total: Math.max(120, Math.round(f.size / 60)),
        sample: true
      };
      setFile(parsed);
      setMapping(headers.map(guess));
      setStep(1);
    }
  };

  const runValidation = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStep(3);
    }, 900);
  };

  const doImport = () => {
    if (!file) return;
    setBusy(true);
    window.setTimeout(() => {
      actions.recordUpload(sourceId, file.name, accepted, rejected);
      setDone({ records: accepted, rejected });
      setBusy(false);
      setStep(4);
    }, 1100);
  };

  const reset = () => {
    setFile(null);
    setMapping([]);
    setStep(0);
    setDone(null);
    setError('');
  };

  const inputCls = 'w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi';

  return (
    <IntegrationLayout
      title="Manual Data Upload"
      subtitle="Upload Excel or CSV files from sources that cannot connect automatically"
      breadcrumb="Manual Upload">

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8 max-w-4xl mx-auto">
        <div className="p-6 border-b border-border text-center">
          <h2 className="text-[20px] font-bold text-epi-text mb-6">Upload New Dataset</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] font-bold">
            {STEPS.map((s, i) =>
            <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-epi' : 'text-epi-muted'}`}>
                  <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${i < step || done && i === 4 ? 'bg-[#00A550] text-white' : i === step ? 'bg-epi text-white' : 'border-2 border-border'}`}>

                    {i < step || done && i === 4 ? '✓' : i + 1}
                  </span>
                  {s}
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-border hidden sm:block"></div>}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Step 1 */}
          {step === 0 &&
          <>
              <label
              htmlFor="upload-file"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files?.[0]);
              }}
              className="border-2 border-dashed border-epi/30 bg-epi/5 rounded-lg p-12 flex flex-col items-center justify-center text-center mb-6 hover:bg-epi/10 transition-colors cursor-pointer">

                <input id="upload-file" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                <UploadCloud className="w-16 h-16 text-epi mb-4" />
                <h3 className="text-[18px] font-bold text-epi-text mb-2">Drag and drop your file here</h3>
                <p className="text-[13px] text-epi-muted mb-1">Supported formats: .xlsx, .csv, .xls</p>
                <p className="text-[13px] text-epi-muted mb-6">Maximum file size: 50MB</p>
                <span className="px-6 py-2 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark transition-colors">
                  Browse Files
                </span>
              </label>
              {error && <div className="mb-6 text-[13px] font-medium text-epi-red bg-epi-red/10 rounded p-3">{error}</div>}
            </>
          }

          {step > 0 && file &&
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-epi-bg rounded-md border border-border">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-6 h-6 text-epi" />
                <div>
                  <div className="text-[14px] font-bold text-epi-text">{file.name}</div>
                  <div className="text-[12px] text-epi-muted">
                    {(file.size / 1024).toFixed(1)} KB · {fmtNumber(file.total)} data rows · {file.headers.length} columns
                    {file.sample && ' · Excel contents shown as a representative sample'}
                  </div>
                </div>
              </div>
              {step < 4 &&
            <button onClick={reset} className="text-[12px] font-bold text-epi hover:underline">
                  Choose another file
                </button>
            }
            </div>
          }

          {/* Step 2: map columns */}
          {step === 1 && file &&
          <div className="mb-6">
              <h3 className="text-[15px] font-bold text-epi-text mb-3">Map file columns to AI Vital fields</h3>
              <div className="space-y-2">
                {file.headers.map((h, i) =>
              <div key={h + i} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-[13px] font-mono bg-epi-bg border border-border rounded px-3 py-2 truncate">{h || `(column ${i + 1})`}</div>
                    <select
                  value={mapping[i]}
                  onChange={(e) => setMapping((m) => m.map((x, j) => j === i ? e.target.value : x))}
                  className="border border-border rounded-md px-3 py-2 text-[13px]">

                      {TARGET_FIELDS.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
              )}
              </div>
              {!mapping.includes('District') &&
            <div className="mt-3 text-[12px] text-epi-amber font-medium">
                  ⚠️ No column is mapped to District — rows cannot be placed on the map and more will be rejected.
                </div>
            }
            </div>
          }

          {/* Step 3: validate */}
          {step === 2 && file &&
          <div className="mb-6 text-[14px] text-epi-text">
              Ready to validate <strong>{fmtNumber(file.total)}</strong> rows against AI Vital rules: required fields,
              valid district names, dates inside the reporting period and numeric values.
            </div>
          }

          {step === 3 && file &&
          <div className="mb-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#00A550]/10 rounded-md p-4">
                  <div className="text-[12px] font-bold text-[#00A550]">Valid rows</div>
                  <div className="text-[22px] font-bold text-epi-text">{fmtNumber(accepted)}</div>
                </div>
                <div className="bg-epi-amber/10 rounded-md p-4">
                  <div className="text-[12px] font-bold text-epi-amber">Rejected rows</div>
                  <div className="text-[22px] font-bold text-epi-text">{fmtNumber(rejected)}</div>
                </div>
                <div className="bg-epi-bg rounded-md p-4">
                  <div className="text-[12px] font-bold text-epi-muted">Columns mapped</div>
                  <div className="text-[22px] font-bold text-epi-text">{mapping.filter((m) => m !== '— Ignore —').length}</div>
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-epi-text mb-2">Preview (first rows)</h3>
              <div className="overflow-x-auto border border-border rounded-md">
                <table className="w-full text-[12px]">
                  <thead className="bg-epi-bg">
                    <tr>
                      {file.headers.map((h, i) =>
                    <th key={h + i} className="p-2 text-left">
                          {h}
                          <div className="font-normal text-epi-muted">→ {mapping[i]}</div>
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {file.rows.map((r, i) =>
                  <tr key={i}>
                        {file.headers.map((_, j) => <td key={j} className="p-2">{r[j] ?? ''}</td>)}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-epi-muted mt-2">Validation results are simulated in this prototype.</p>
            </div>
          }

          {step === 4 && done &&
          <div className="mb-6 bg-[#00A550]/10 border border-[#00A550]/30 rounded-md p-5 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#00A550] shrink-0" />
              <div className="text-[14px] text-epi-text">
                <div className="font-bold mb-1">Import complete</div>
                {fmtNumber(done.records)} records were added to <strong>{source?.name}</strong>
                {done.rejected > 0 && `, ${fmtNumber(done.rejected)} rejected rows were skipped`}. The data is now waiting
                for the processing pipeline.
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link to="/processing" className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark">
                    Go to Processing →
                  </Link>
                  <button onClick={reset} className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md">
                    Upload another file
                  </button>
                </div>
              </div>
            </div>
          }

          {/* Metadata */}
          {step < 4 &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-epi-text mb-1">Data source this file belongs to</label>
                <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className={inputCls}>
                  {manual.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">Reporting period (From)</label>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">Reporting period (To)</label>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
                {from > to && <p className="text-[12px] text-epi-red mt-1">End date must be after start date.</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-epi-text mb-1">Uploaded by</label>
                <input type="text" value={user.name} disabled className="w-full border border-border rounded-md px-3 py-2 text-[14px] bg-epi-bg text-epi-muted" />
              </div>
            </div>
          }

          {/* Navigation */}
          {step > 0 && step < 4 &&
          <div className="mt-8 flex justify-between gap-3">
              <button
              onClick={() => setStep(step - 1)}
              disabled={busy}
              className="px-5 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg">

                Back
              </button>
              {step === 1 &&
            <button onClick={() => setStep(2)} className="px-5 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark">
                  Next: Validate
                </button>
            }
              {step === 2 &&
            <button onClick={runValidation} disabled={busy || from > to} className="px-5 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-60 flex items-center gap-2">
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />} Run Validation
                </button>
            }
              {step === 3 &&
            <button onClick={doImport} disabled={busy || accepted === 0} className="px-5 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-60 flex items-center gap-2">
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />} Import {fmtNumber(accepted)} Records
                </button>
            }
            </div>
          }
        </div>
      </div>

      {/* Import History */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden max-w-4xl mx-auto">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">Recent Manual Uploads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Date', 'Uploaded By', 'Source', 'File', 'Records', 'Status'].map((h) =>
                <th key={h} className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {uploads.map((u) =>
              <tr key={u.id} className="hover:bg-epi-bg/50 transition-colors bg-epi/5">
                  <td className="p-4 text-[13px] text-epi-text">{fmtDate(u.at)}</td>
                  <td className="p-4 text-[13px] text-epi-text">{user.name}</td>
                  <td className="p-4 text-[13px] font-bold text-epi-text">{u.sourceName}</td>
                  <td className="p-4 text-[13px] text-epi-text">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-epi-muted" />
                      {u.message.split(':')[0].replace('Manual upload ', '')}
                    </span>
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{fmtNumber(u.records)} rows</td>
                  <td className="p-4 text-[13px] font-bold">
                    {u.status === 'partial' ?
                  <span className="text-epi-amber flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> With rejected rows</span> :
                  '✅ Imported successfully'}
                  </td>
                </tr>
              )}
              {SEED_HISTORY.map((h, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[13px] text-epi-text">{h.date}</td>
                  <td className="p-4 text-[13px] text-epi-text">{h.by}</td>
                  <td className="p-4 text-[13px] font-bold text-epi-text">{h.source}</td>
                  <td className="p-4 text-[13px] text-epi-text">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-epi-muted" />
                      {h.file}
                    </span>
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{h.records}</td>
                  <td className="p-4 text-[13px] font-bold">{h.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </IntegrationLayout>);

}
