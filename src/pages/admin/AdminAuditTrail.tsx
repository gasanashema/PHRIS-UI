import { Fragment, useEffect, useMemo, useState } from 'react';
import { Search, Download, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useApp } from '../../store/AppStore';
import { downloadFile, fmtDate, fmtTime, nowISO, toCSV } from '../../lib/format';
import type { Activity } from '../../types';

const PAGE = 12;
const ACTION_FILTERS: Record<string, (a: Activity) => boolean> = {
  'All Actions': () => true,
  Login: (a) => /logged in|login/i.test(a.action),
  Logout: (a) => /logged out/i.test(a.action),
  'Alert Actions': (a) => /alert/i.test(a.action),
  'Report Generated': (a) => /report/i.test(a.action),
  'User Changes': (a) => a.module === 'User Mgmt' || a.module === 'Roles',
  'Config Changed': (a) => a.module === 'Configuration' || /configuration/i.test(a.action),
  'Data & Pipeline': (a) => ['Integration', 'Processing', 'Prediction'].includes(a.module)
};

export function AdminAuditTrail() {
  const { state, actions } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [q, setQ] = useState('');
  const [action, setAction] = useState('All Actions');
  const [role, setRole] = useState('All Roles');
  const [page, setPage] = useState(1);
  const [json, setJson] = useState<string | null>(null);

  const roles = ['All Roles', ...Array.from(new Set(state.activity.map((a) => a.role)))];
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return [...state.activity].
    sort((a, b) => b.at.localeCompare(a.at)).
    filter(
      (a) =>
      (!date || a.at.startsWith(date)) && (
      !t || a.actor.toLowerCase().includes(t) || a.actorEmail.toLowerCase().includes(t) || a.action.toLowerCase().includes(t)) &&
      ACTION_FILTERS[action](a) && (
      role === 'All Roles' || a.role === role)
    );
  }, [state.activity, date, q, action, role]);

  useEffect(() => setPage(1), [date, q, action, role]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const pageRows = rows.slice((page - 1) * PAGE, page * PAGE);
  const today = nowISO().slice(0, 10);
  const todayCount = state.activity.filter((a) => a.at.startsWith(today)).length;
  const users = new Set(state.activity.filter((a) => a.at.startsWith(today)).map((a) => a.actorEmail)).size;
  const flags = state.activity.filter((a) => a.flagged).length;

  const exportCsv = () => {
    downloadFile(
      'aivital-audit-log.csv',
      toCSV(rows.map((a) => ({ time: a.at, user: a.actorEmail, name: a.actor, role: a.role, module: a.module, action: a.action, detail: a.detail, ip: a.ip, status: a.flagged ? 'security flag' : 'success' }))),
      'text/csv'
    );
    actions.logAdminEvent('Audit', 'Exported audit log', `${rows.length} events`);
    actions.toast(`Exported ${rows.length} audit events to CSV.`, 'info');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; Audit Trail</div>
        <h1 className="text-[24px] font-bold text-admin-text">Audit Trail</h1>
        <p className="text-[14px] text-admin-muted">Complete record of all user actions. Every event is permanently logged.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Date"
            className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin text-admin-text" />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search user, email or action..."
              className="h-10 pl-9 pr-4 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin w-[230px]" />

          </div>
          <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 px-3 bg-white border border-border rounded-md text-[13px]" aria-label="Action">
            {Object.keys(ACTION_FILTERS).map((k) => <option key={k}>{k}</option>)}
          </select>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 px-3 bg-white border border-border rounded-md text-[13px]" aria-label="Role">
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
          {(date || q || action !== 'All Actions' || role !== 'All Roles') &&
          <button
            onClick={() => {
              setDate('');
              setQ('');
              setAction('All Actions');
              setRole('All Roles');
            }}
            className="text-[13px] font-bold text-admin hover:underline">

              Clear filters
            </button>
          }
        </div>
        <button onClick={exportCsv} className="h-10 px-4 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Log (CSV)
        </button>
      </div>

      <div className="bg-admin-sidebar text-white px-6 py-3 rounded-t-lg flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] font-medium">
        <span>{todayCount} events today</span>
        <span className="text-white/30">|</span>
        <span>{users} users active today</span>
        <span className="text-white/30">|</span>
        <button onClick={() => setQ('failed')} className="text-admin-red font-bold hover:underline">
          {flags} security flag{flags === 1 ? '' : 's'}
        </button>
      </div>

      <div className="bg-white shadow-sm border border-border rounded-b-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                {['Time', 'User', 'Role', 'Action', 'Module', 'IP Address', 'Status'].map((h) =>
                <th key={h} className="px-4 py-3">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows.length === 0 &&
              <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-admin-muted">No events match these filters.</td>
                </tr>
              }
              {pageRows.map((r, i) =>
              <Fragment key={r.id}>
                  <tr
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className={`cursor-pointer transition-colors ${r.flagged ? 'bg-admin-red/5 hover:bg-admin-red/10' : i % 2 === 0 ? 'bg-white hover:bg-admin-bg/50' : 'bg-admin-bg/30 hover:bg-admin-bg/50'}`}>

                    <td className="px-4 py-3 text-admin-muted">
                      {expanded === r.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </td>
                    <td className="px-4 py-3 text-admin-muted whitespace-nowrap">
                      {r.at.startsWith(today) ? fmtTime(r.at) : `${fmtDate(r.at).replace(', 2026', '')} ${fmtTime(r.at)}`}
                    </td>
                    <td className="px-4 py-3 font-medium text-admin-text">{r.actorEmail}</td>
                    <td className="px-4 py-3 text-admin-text">{r.role}</td>
                    <td className="px-4 py-3 font-bold text-admin-text">{r.action}</td>
                    <td className="px-4 py-3 text-admin-muted">{r.module}</td>
                    <td className="px-4 py-3 text-admin-muted">{r.ip}</td>
                    <td className="px-4 py-3 font-bold whitespace-nowrap">{r.flagged ? '🔴 Security Flag' : '✅ Success'}</td>
                  </tr>
                  {expanded === r.id &&
                <tr className="bg-admin-bg/80 border-b border-border">
                      <td colSpan={8} className="px-6 sm:px-12 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[13px]">
                          <div>
                            <div className="text-admin-muted mb-1">Actor</div>
                            <div className="text-admin-text font-medium">{r.actor}</div>
                          </div>
                          <div>
                            <div className="text-admin-muted mb-1">Detail</div>
                            <div className="text-admin-text">{r.detail || '—'}</div>
                          </div>
                          <div>
                            <div className="text-admin-muted mb-1">Session ID</div>
                            <div className="font-mono text-admin-text">sess_{r.id.replace(/[^a-z0-9]/gi, '').slice(-12)}</div>
                          </div>
                          <div>
                            <div className="text-admin-muted mb-1">Raw Payload</div>
                            <button
                          onClick={() => setJson(JSON.stringify(r, null, 2))}
                          className="text-admin font-bold hover:underline">

                              View JSON
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3 bg-white">
          <span className="text-[13px] text-admin-muted">
            Showing {rows.length === 0 ? 0 : (page - 1) * PAGE + 1}–{Math.min(page * PAGE, rows.length)} of {rows.length} events
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-muted disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded text-[13px] font-medium ${n === page ? 'bg-admin text-white' : 'hover:bg-admin-bg text-admin-text'}`}>

                {n}
              </button>
            )}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} aria-label="Next page" className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-muted disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {json &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={(e) => e.target === e.currentTarget && setJson(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-admin-text">Event payload</h3>
              <button onClick={() => setJson(null)} className="text-[13px] font-bold text-admin hover:underline">Close</button>
            </div>
            <pre className="bg-[#1A1A2E] text-[#A7F3D0] text-[12px] rounded-md p-4 overflow-auto max-h-[60vh]">{json}</pre>
          </div>
        </div>
      }
    </AdminLayout>);

}
