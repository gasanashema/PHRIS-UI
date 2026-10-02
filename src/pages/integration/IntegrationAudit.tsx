import { useMemo, useState } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { X } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { downloadFile, fmtDateTime, fmtNumber, nowISO, toCSV } from '../../lib/format';

interface AuditRow {
  id: string;
  at: string;
  source: string;
  received: number;
  imported: number;
  flagged: number;
  rejected: number;
  status: 'success' | 'partial' | 'failed';
  message: string;
  by: string;
}

// Older history that pre-dates the in-session sync log
const HISTORY: AuditRow[] = [
{ id: 'h-1', at: '2026-06-04T14:00:00', source: 'DHIS2 / HMIS', received: 3980, imported: 3941, flagged: 39, rejected: 0, status: 'success', message: 'Pulled 3,980 facility data values', by: 'Automatic' },
{ id: 'h-2', at: '2026-06-04T08:00:00', source: 'MINAGRI', received: 870, imported: 862, flagged: 8, rejected: 0, status: 'success', message: 'Daily food-security extract', by: 'Automatic' },
{ id: 'h-3', at: '2026-06-02T11:45:00', source: 'NISR Census Data', received: 10920, imported: 10920, flagged: 0, rejected: 0, status: 'success', message: 'Manual upload census_2022_final.xlsx', by: 'Jean Paul Habimana' }];


const STATUS_LABEL = {
  success: '✅ Success',
  partial: '⚠️ Imported with warnings',
  failed: '🔴 FAILED'
};
const PAGE = 8;

export function IntegrationAudit() {
  const { state, actions } = useApp();
  const [source, setSource] = useState('all');
  const [status, setStatus] = useState('all');
  const [by, setBy] = useState('all');
  const [range, setRange] = useState('7d');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<AuditRow | null>(null);
  const [expanded, setExpanded] = useState(false);

  const rows: AuditRow[] = useMemo(() => {
    const live = state.syncLog.map((l) => {
      const flagged = l.status === 'partial' ? Math.max(1, Math.round(l.records * 0.08)) : Math.round(l.records * 0.01);
      const manual = l.message.startsWith('Manual upload');
      const rejected = manual ? Number(l.message.match(/(\d+) rejected/)?.[1] ?? 0) : 0;
      return {
        id: l.id,
        at: l.at,
        source: l.sourceName,
        received: l.records + rejected + (l.status === 'failed' ? 0 : flagged),
        imported: l.records,
        flagged: l.status === 'failed' ? 0 : flagged,
        rejected,
        status: l.status,
        message: l.message,
        by: manual ? state.user?.name ?? 'Manual' : 'Automatic'
      } as AuditRow;
    });
    return [...live, ...HISTORY].sort((a, b) => b.at.localeCompare(a.at));
  }, [state.syncLog, state.user]);

  const today = nowISO().slice(0, 10);
  const filtered = rows.filter(
    (r) =>
    (source === 'all' || r.source === source) && (
    status === 'all' || r.status === status) && (
    by === 'all' || (by === 'auto' ? r.by === 'Automatic' : r.by !== 'Automatic')) && (
    range === '7d' || r.at.startsWith(today))
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageRows = filtered.slice((page - 1) * PAGE, page * PAGE);
  const sources = Array.from(new Set(rows.map((r) => r.source)));

  const csvFor = (list: AuditRow[]) =>
  toCSV(list.map((r) => ({ timestamp: r.at, source: r.source, received: r.received, imported: r.imported, flagged: r.flagged, rejected: r.rejected, status: r.status, action_by: r.by, message: r.message })));

  const selectCls = 'text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white';

  return (
    <IntegrationLayout
      title="Data Audit Trail"
      subtitle="Complete record of every data import and transaction in AI Vital"
      breadcrumb="Audit Trail">

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-epi-bg/50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-medium text-epi-muted">Source:</span>
            <select value={source} onChange={(e) => {setSource(e.target.value);setPage(1);}} className={selectCls}>
              <option value="all">All Sources</option>
              {sources.map((s) => <option key={s}>{s}</option>)}
            </select>
            <span className="text-[13px] font-medium text-epi-muted">Status:</span>
            <select value={status} onChange={(e) => {setStatus(e.target.value);setPage(1);}} className={selectCls}>
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="partial">Warning</option>
              <option value="failed">Failed</option>
            </select>
            <span className="text-[13px] font-medium text-epi-muted">Action by:</span>
            <select value={by} onChange={(e) => {setBy(e.target.value);setPage(1);}} className={selectCls}>
              <option value="all">All</option>
              <option value="auto">Automatic</option>
              <option value="manual">Manual</option>
            </select>
            <span className="text-[13px] font-medium text-epi-muted">Date range:</span>
            <select value={range} onChange={(e) => {setRange(e.target.value);setPage(1);}} className={selectCls}>
              <option value="7d">Last 7 days</option>
              <option value="today">Today</option>
            </select>
          </div>
          <button
            onClick={() => {
              downloadFile('aivital-data-audit.csv', csvFor(filtered), 'text/csv');
              actions.toast(`Exported ${filtered.length} audit records.`, 'info');
            }}
            className="px-4 py-1.5 text-[13px] font-bold text-epi border border-epi rounded hover:bg-epi/5 transition-colors bg-white">

            Export Audit Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Timestamp', 'Source', 'Records', 'Imported', 'Flagged', 'Rejected', 'Status', 'Action By', 'View'].map((h) =>
                <th key={h} className={`p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'View' ? 'text-right' : ''}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows.length === 0 &&
              <tr>
                  <td colSpan={9} className="p-6 text-center text-[13px] text-epi-muted">No transactions match these filters.</td>
                </tr>
              }
              {pageRows.map((a) =>
              <tr key={a.id} className={`hover:bg-epi-bg/50 transition-colors ${a.status === 'failed' ? 'bg-epi-red/5' : ''}`}>
                  <td className="p-3 text-[13px] text-epi-text whitespace-nowrap">{fmtDateTime(a.at)}</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">{a.source}</td>
                  <td className="p-3 text-[13px] text-epi-text">{fmtNumber(a.received)}</td>
                  <td className="p-3 text-[13px] text-epi-text">{fmtNumber(a.imported)}</td>
                  <td className="p-3 text-[13px] text-epi-text">{a.status === 'failed' ? '—' : a.flagged}</td>
                  <td className="p-3 text-[13px] text-epi-text">{a.status === 'failed' ? '—' : a.rejected}</td>
                  <td className="p-3 text-[13px] font-bold whitespace-nowrap">{STATUS_LABEL[a.status]}</td>
                  <td className="p-3 text-[13px] text-epi-text">{a.by}</td>
                  <td className="p-3 text-right">
                    <button
                    onClick={() => {
                      setDetail(a);
                      setExpanded(false);
                    }}
                    className="text-[13px] font-medium text-epi hover:underline whitespace-nowrap">

                      {a.status === 'failed' ? 'View Error Log' : 'View Details'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[13px] text-epi-muted">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE + 1}–{Math.min(page * PAGE, filtered.length)} of {filtered.length} transactions
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-3 py-1 border border-border rounded hover:bg-epi-bg disabled:opacity-50">
              Previous
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page === pages} className="px-3 py-1 border border-border rounded hover:bg-epi-bg disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {detail &&
      <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDetail(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-border shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
            <div className="p-6 border-b border-border flex items-center justify-between bg-epi-bg/50">
              <h2 className="text-[18px] font-bold text-epi-text">
                Audit Record — {detail.source} / {fmtDateTime(detail.at)}
              </h2>
              <button onClick={() => setDetail(null)} aria-label="Close" className="p-2 hover:bg-white rounded-full text-epi-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-epi-bg p-3 rounded border border-border text-center">
                  <div className="text-[18px] font-bold text-epi-text">{fmtNumber(detail.received)}</div>
                  <div className="text-[11px] text-epi-muted uppercase tracking-wider font-bold">Received</div>
                </div>
                <div className="bg-[#00A550]/10 p-3 rounded border border-[#00A550]/20 text-center">
                  <div className="text-[18px] font-bold text-[#00A550]">{fmtNumber(detail.imported)}</div>
                  <div className="text-[11px] text-[#00A550] uppercase tracking-wider font-bold">Imported</div>
                </div>
                <div className="bg-epi-amber/10 p-3 rounded border border-epi-amber/20 text-center">
                  <div className="text-[18px] font-bold text-epi-amber">{detail.flagged}</div>
                  <div className="text-[11px] text-epi-amber uppercase tracking-wider font-bold">Flagged</div>
                </div>
              </div>
              <div className="space-y-3 text-[13px]">
                {[
              ['Result', detail.message],
              ['Status', STATUS_LABEL[detail.status]],
              ['Triggered by', detail.by === 'Automatic' ? 'Automated schedule' : `Manual — ${detail.by}`],
              ['Data version tag', `v${detail.at.slice(0, 10).replace(/-/g, '.')}.${detail.at.slice(11, 16).replace(':', '')}`]].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-3 border-b border-border pb-2">
                    <span className="text-epi-muted">{k}</span>
                    <span className="font-bold text-epi-text text-right">{v}</span>
                  </div>
              )}
              </div>
              {detail.flagged > 0 &&
            <div>
                  <h3 className="text-[14px] font-bold text-epi-text mb-3">Flagged Records ({detail.flagged})</h3>
                  {expanded ?
              <ul className="bg-epi-bg rounded border border-border p-3 text-[12px] font-mono space-y-1 max-h-48 overflow-y-auto">
                      {Array.from({ length: Math.min(detail.flagged, 12) }, (_, i) =>
                <li key={i}>
                          RW-{detail.source.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}-{detail.at.slice(0, 10).replace(/-/g, '')}-{String(100 + i * 37).padStart(4, '0')} · {['missing district', 'format warning', 'outlier value', 'unmapped term'][i % 4]}
                        </li>
                )}
                      {detail.flagged > 12 && <li className="text-epi-muted">…and {detail.flagged - 12} more</li>}
                    </ul> :

              <button
                onClick={() => setExpanded(true)}
                className="w-full bg-epi-bg rounded border border-border p-3 text-[13px] text-epi-muted text-center hover:bg-border/50 transition-colors">

                      Click to expand list of flagged items
                    </button>
              }
                </div>
            }
            </div>
            <div className="p-6 border-t border-border bg-epi-bg/50">
              <button
              onClick={() => downloadFile(`audit-${detail.id}.csv`, csvFor([detail]), 'text/csv')}
              className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">

                Download Full Log (CSV)
              </button>
            </div>
          </div>
        </>
      }
    </IntegrationLayout>);

}
