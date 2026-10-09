import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  UserPlus,
  User,
  Search,
  CheckCircle2,
  Circle,
  MapPin,
  Clock,
  Send,
  AlertCircle,
  ExternalLink,
  Users,
  Activity,
  Layers,
  FileText,
  Calendar,
  CheckSquare
} from 'lucide-react';
import type { Investigation, InvestigationStatus } from '../../types';
import { useApp } from '../../store/AppStore';
import { SeverityBadge, EmptyState } from './Badges';
import { addDays, fmtDate, fmtDateTime, fmtShortDate, timeAgo } from '../../lib/format';
import { inputCls, textareaCls } from './Modal';

const LEADS = ['Dr. Jean Paul Habimana', 'Dr. Patrick Bizimana', 'Dr. Samuel Habyarimana'];

const CHECKLIST = [
  'Alert received and triaged',
  'Investigation opened',
  'Lead investigator assigned',
  'Field team deployed',
  'Suspected source identified',
  'Lab confirmation',
  'Intervention effectiveness assessed',
  'Investigation report finalized'
];

function checklistProgress(inv: Investigation) {
  const text = inv.updates.map((u) => u.text.toLowerCase()).join(' ');
  return CHECKLIST.map((_, i) => {
    if (i === 0) return true;
    if (i === 1) return inv.status !== 'requested';
    if (i === 2) return inv.status !== 'requested' && !!inv.lead;
    if (i === 3) return text.includes('field team') || text.includes('deployed');
    if (i === 4) return text.includes('source');
    if (i === 5) return text.includes('lab') || text.includes('confirm');
    if (i === 6) return inv.status === 'closed' || text.includes('effective') || text.includes('declin');
    return inv.status === 'closed';
  });
}

// Deterministic epidemic curve derived from the case count.
function epiCurve(inv: Investigation) {
  const days = 8;
  const peak = Math.max(3, Math.round(inv.cases / 4.5));
  const shape = [0.15, 0.28, 0.45, 0.7, 1, 0.95, 0.72, 0.45];
  return Array.from({ length: days }, (_, i) => ({
    date: fmtShortDate(addDays(inv.openedAt, i - 3)),
    cases: Math.max(1, Math.round(peak * shape[i]))
  }));
}

interface Props {
  district?: string; // restrict to a district (DHO view)
  selectedId?: string;
  onSelect: (id: string) => void;
  alertLink: (alertId: string) => string;
}

export function InvestigationWorkspace({ district, selectedId, onSelect, alertLink }: Props) {
  const { state, actions } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | InvestigationStatus>('all');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'overview' | 'updates' | 'curve' | 'team'>('overview');
  const [update, setUpdate] = useState('');
  const [member, setMember] = useState('');

  // Counts for filters
  const counts = useMemo(() => {
    const base = state.investigations.filter((i) => !district || i.district === district);
    return {
      all: base.length,
      active: base.filter((i) => i.status === 'active').length,
      requested: base.filter((i) => i.status === 'requested').length,
      closed: base.filter((i) => i.status === 'closed').length
    };
  }, [state.investigations, district]);

  // Filtered and searched list
  const list = useMemo(
    () =>
      state.investigations
        .filter((i) => !district || i.district === district)
        .filter((i) => statusFilter === 'all' || i.status === statusFilter)
        .filter((i) => {
          if (!search.trim()) return true;
          const q = search.toLowerCase();
          return (
            i.id.toLowerCase().includes(q) ||
            i.disease.toLowerCase().includes(q) ||
            i.district.toLowerCase().includes(q) ||
            (i.sector && i.sector.toLowerCase().includes(q)) ||
            i.lead.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => {
          const order = { requested: 0, active: 1, closed: 2 };
          return order[a.status] - order[b.status] || b.openedAt.localeCompare(a.openedAt);
        }),
    [state.investigations, district, statusFilter, search]
  );

  const inv = state.investigations.find((i) => i.id === selectedId) ?? list[0];
  const alert = inv?.alertId ? state.alerts.find((a) => a.id === inv.alertId) : undefined;
  const progress = inv ? checklistProgress(inv) : [];
  const done = progress.filter(Boolean).length;
  const interventions = inv
    ? state.interventions.filter((x) => x.alertId && x.alertId === inv.alertId)
    : [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6">
      {/* Left Column: Searchable & Filterable Investigation Directory */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden h-fit">
        {/* Search Input */}
        <div className="p-3 border-b border-border bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-admin-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by disease, district, ID..."
              className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-admin-bg/60 border border-border rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-admin"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-2.5 border-b border-border flex flex-wrap gap-1.5 bg-admin-bg/20">
          {(
            [
              { key: 'all', label: `All (${counts.all})` },
              { key: 'active', label: `Active (${counts.active})` },
              { key: 'requested', label: `Requested (${counts.requested})` },
              { key: 'closed', label: `Closed (${counts.closed})` }
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === s.key
                  ? 'bg-admin text-white shadow-xs'
                  : 'bg-white border border-border text-admin-muted hover:text-admin-text hover:bg-admin-bg/50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Investigation Items List */}
        {list.length === 0 ? (
          <div className="p-8 text-center text-admin-muted text-[13px]">
            <p className="font-semibold text-admin-text">No investigations found</p>
            <p className="text-[12px] mt-1 text-admin-muted">
              {search
                ? 'Try matching another disease or district.'
                : district
                ? 'No investigations currently logged for this district.'
                : 'No investigations match this status filter.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border max-h-[680px] overflow-y-auto">
            {list.map((i) => {
              const isSelected = inv?.id === i.id;
              const statusDot =
                i.status === 'requested'
                  ? 'bg-[#F97316]'
                  : i.status === 'active'
                  ? 'bg-admin-red'
                  : 'bg-[#00A550]';
              return (
                <li key={i.id}>
                  <button
                    onClick={() => {
                      onSelect(i.id);
                    }}
                    className={`w-full text-left p-3.5 transition-all border-l-4 ${
                      isSelected
                        ? 'bg-admin/5 border-l-admin'
                        : 'border-l-transparent hover:bg-admin-bg/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-admin-text">
                        {i.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-admin-muted">
                        <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                        <span className="capitalize">{i.status}</span>
                      </span>
                    </div>

                    <div className="text-[13px] font-bold text-admin-text line-clamp-1 mb-1">
                      {i.disease} — {i.sector ? `${i.sector}, ` : ''}{i.district}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-admin-muted">
                      <span>{i.cases} cases · {i.priority}</span>
                      <span>{timeAgo(i.openedAt)}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Right Column: Detailed Investigation View */}
      {!inv ? (
        <div className="bg-white rounded-lg shadow-sm border border-border p-12 text-center">
          <EmptyState title="Select an investigation" body="Choose an investigation from the directory to review its progress and field activities." />
        </div>
      ) : (
        <div className="min-w-0 space-y-6">
          {/* Header Card: Overview & Key Status */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-[12px] font-bold px-2 py-0.5 bg-admin-bg border border-border rounded text-admin-text">
                    {inv.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                      inv.status === 'requested'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : inv.status === 'active'
                        ? 'bg-red-50 text-admin-red border border-red-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        inv.status === 'requested'
                          ? 'bg-[#F97316]'
                          : inv.status === 'active'
                          ? 'bg-admin-red'
                          : 'bg-[#00A550]'
                      }`}
                    />
                    <span className="capitalize">{inv.status === 'requested' ? 'Requested' : inv.status === 'active' ? 'Active Outbreak' : 'Closed / Contained'}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      inv.priority === 'Critical'
                        ? 'bg-red-100/70 text-admin-red'
                        : inv.priority === 'High'
                        ? 'bg-amber-100/70 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {inv.priority} Priority
                  </span>
                </div>

                <h1 className="text-[20px] font-bold text-admin-text">
                  {inv.disease} Outbreak Investigation
                </h1>
                <p className="text-[13px] text-admin-muted flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-admin-muted shrink-0" />
                  {inv.sector ? `${inv.sector} Sector, ` : ''}{inv.district} District
                </p>
              </div>

              {/* Status Action Button */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                {inv.status === 'requested' && (
                  <button
                    onClick={() =>
                      actions.updateInvestigation(
                        inv.id,
                        { status: 'active' },
                        'Request accepted. Field team being mobilised.'
                      )
                    }
                    className="h-9 px-4 bg-admin hover:bg-admin-hover text-white text-[12px] font-bold rounded-md flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept & Start Investigation
                  </button>
                )}
                {inv.status === 'active' && (
                  <button
                    onClick={() =>
                      actions.updateInvestigation(
                        inv.id,
                        { status: 'closed' },
                        'Investigation closed. Outbreak contained.'
                      )
                    }
                    className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-md flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Outbreak Contained
                  </button>
                )}
                {inv.status === 'closed' && (
                  <button
                    onClick={() =>
                      actions.updateInvestigation(
                        inv.id,
                        { status: 'active' },
                        'Investigation reopened.'
                      )
                    }
                    className="h-9 px-4 bg-white border border-border text-admin-text hover:bg-admin-bg text-[12px] font-semibold rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Clock className="w-4 h-4" /> Reopen Investigation
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stat Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-[13px]">
              <div>
                <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  Cases Tracked
                </div>
                <div className="text-[18px] font-bold text-admin-text mt-0.5">{inv.cases}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  Lead Investigator
                </div>
                <div className="font-semibold text-admin-text truncate mt-0.5">{inv.lead}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  Milestone Progress
                </div>
                <div className="font-semibold text-admin-text mt-0.5">
                  {done} of {CHECKLIST.length} stages
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider">
                  Date Opened
                </div>
                <div className="font-semibold text-admin-text mt-0.5">
                  {fmtDate(inv.openedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border border-border rounded-lg shadow-xs flex overflow-x-auto">
            {(
              [
                { id: 'overview', label: 'Overview & Milestones' },
                { id: 'updates', label: `Field Activity (${inv.updates.length})` },
                { id: 'curve', label: 'Epidemic Curve' },
                { id: 'team', label: `Team & Interventions (${inv.team.length + 1})` }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-admin text-admin bg-admin/5'
                    : 'border-transparent text-admin-muted hover:text-admin-text hover:bg-admin-bg/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & MILESTONES */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Outbreak Hypothesis & Linked Context */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-3">
                    Epidemiological Hypothesis & Context
                  </h3>
                  <div className="p-3.5 bg-admin-bg/50 rounded-lg border border-border text-[13px] text-admin-text mb-4 leading-relaxed">
                    <span className="font-bold block mb-1 text-admin-text">Working Hypothesis:</span>
                    {inv.hypothesis}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] pt-1">
                    <div>
                      <span className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider block mb-1">
                        Linked Early Warning Alert
                      </span>
                      {alert ? (
                        <Link
                          to={alertLink(alert.id)}
                          className="inline-flex items-center gap-2 font-bold text-admin hover:underline bg-admin/5 px-2.5 py-1 rounded border border-admin/20"
                        >
                          <span>{alert.id}</span>
                          <SeverityBadge severity={alert.severity} />
                          <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-admin-muted" />
                        </Link>
                      ) : (
                        <span className="text-admin-muted font-medium">None linked</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider block mb-1">
                        Reported Transmission Site
                      </span>
                      <span className="font-semibold text-admin-text">
                        {inv.sector ? `${inv.sector} Sector, ` : ''}{inv.district} District
                      </span>
                    </div>
                  </div>
                </div>

                {/* Management & Assignment */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-admin-text mb-3">
                      Investigation Controls
                    </h3>
                    <div className="space-y-3.5 mb-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-admin-muted mb-1">
                          Lead Investigator
                        </label>
                        <select
                          value={inv.lead}
                          onChange={(e) => actions.updateInvestigation(inv.id, { lead: e.target.value })}
                          className={inputCls}
                        >
                          {Array.from(new Set([inv.lead, ...LEADS])).map((l) => (
                            <option key={l}>{l}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-admin-muted mb-1">
                          Outbreak Priority
                        </label>
                        <select
                          value={inv.priority}
                          onChange={(e) =>
                            actions.updateInvestigation(inv.id, {
                              priority: e.target.value as Investigation['priority']
                            })
                          }
                          className={inputCls}
                        >
                          <option>Critical</option>
                          <option>High</option>
                          <option>Medium</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="text-[12px] text-admin-muted bg-admin-bg/40 p-2.5 rounded border border-border">
                    Field notifications will be addressed directly to {inv.lead}.
                  </div>
                </div>
              </div>

              {/* Investigation Milestones & Progression */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-admin-text">
                      Outbreak Response Lifecycle (WHO / RBC Protocol)
                    </h3>
                    <p className="text-[12px] text-admin-muted mt-0.5">
                      Standard eight-phase outbreak investigation workflow
                    </p>
                  </div>
                  <div className="text-[12px] font-bold text-admin-text">
                    Progress: <span className="text-admin">{done} of {CHECKLIST.length} completed</span>
                  </div>
                </div>

                <div className="h-2 bg-admin-bg rounded-full overflow-hidden mb-6 border border-border">
                  <div
                    className="h-full bg-admin rounded-full transition-all duration-300"
                    style={{ width: `${(done / CHECKLIST.length) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CHECKLIST.map((step, idx) => {
                    const isDone = progress[idx];
                    return (
                      <div
                        key={step}
                        className={`p-3 rounded-lg border text-[12px] flex items-start gap-2.5 transition-colors ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-200/80 text-admin-text'
                            : 'bg-white border-border text-admin-muted'
                        }`}
                      >
                        <span className="shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-admin-muted/60" />
                          )}
                        </span>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-admin-muted mb-0.5">
                            Stage {idx + 1}
                          </div>
                          <div className={`font-semibold ${isDone ? 'text-admin-text' : 'text-admin-muted'}`}>
                            {step}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-admin-muted mt-4 bg-admin-bg/30 p-2.5 rounded border border-border">
                  💡 Milestones advance automatically as teams deploy to the field, identify environmental sources, verify lab specimens, and document interventions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FIELD ACTIVITY & UPDATES */}
          {tab === 'updates' && (
            <div className="space-y-6">
              {/* Post Field Update Box */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                <h3 className="text-[15px] font-bold text-admin-text mb-2">
                  Log Field Update
                </h3>
                <p className="text-[12px] text-admin-muted mb-3">
                  Add observations, case counts, sampling outcomes, or environmental findings.
                </p>
                <textarea
                  rows={3}
                  value={update}
                  onChange={(e) => setUpdate(e.target.value)}
                  placeholder="e.g. Field team deployed. 4 water points sampled in Bugarama; laboratory results expected within 48 hours."
                  className={textareaCls}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[12px] text-admin-muted">
                    Logged under: <span className="font-semibold text-admin-text">{inv.lead}</span>
                  </span>
                  <button
                    disabled={!update.trim()}
                    onClick={() => {
                      actions.addInvestigationUpdate(inv.id, update.trim());
                      setUpdate('');
                    }}
                    className="h-9 px-4 bg-admin hover:bg-admin-hover disabled:opacity-50 text-white text-[12px] font-bold rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Update
                  </button>
                </div>
              </div>

              {/* Chronological Activity Feed */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                <h3 className="text-[15px] font-bold text-admin-text mb-4">
                  Investigation Activity Feed ({inv.updates.length})
                </h3>

                {inv.updates.length === 0 ? (
                  <p className="text-[13px] text-admin-muted text-center py-6">
                    No field updates logged yet.
                  </p>
                ) : (
                  <ol className="relative border-l-2 border-border ml-3 space-y-5">
                    {[...inv.updates].reverse().map((u, i) => (
                      <li key={i} className="ml-5">
                        <span
                          className={`absolute -left-[7px] w-3 h-3 rounded-full border-2 border-white ${
                            u.kind === 'status' ? 'bg-admin' : 'bg-[#F97316]'
                          }`}
                        />
                        <div className="flex items-center gap-2 text-[12px] text-admin-muted mb-1">
                          <span className="font-bold text-admin-text">{u.author}</span>
                          <span>·</span>
                          <span>{fmtDateTime(u.at)}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                              u.kind === 'status'
                                ? 'bg-admin/10 text-admin'
                                : 'bg-amber-100/70 text-amber-800'
                            }`}
                          >
                            {u.kind === 'status' ? 'Status Change' : 'Field Note'}
                          </span>
                        </div>
                        <div className="text-[13px] text-admin-text bg-admin-bg/30 p-3 rounded border border-border/80">
                          {u.text}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EPIDEMIC CURVE */}
          {tab === 'curve' && (
            <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-[16px] font-bold text-admin-text">
                    {inv.disease} Epidemic Curve — {inv.sector ? `${inv.sector}, ` : ''}{inv.district}
                  </h2>
                  <p className="text-[12px] text-admin-muted mt-0.5">
                    Daily distribution of incident cases over the outbreak window
                  </p>
                </div>
                <div className="text-[12px] font-semibold text-admin-muted">
                  Total Cases: <span className="font-bold text-admin-text">{inv.cases}</span>
                </div>
              </div>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={epiCurve(inv)} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                      {epiCurve(inv).map((_, i) => (
                        <Cell key={i} fill={i >= 6 ? '#FCA5A5' : '#D32F2F'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 bg-admin-bg/40 rounded-lg border border-border text-[12px] text-admin-muted leading-relaxed">
                <span className="font-bold text-admin-text block mb-1">Interpretation Guide:</span>
                A sharp single peak indicates point-source exposure (e.g. contaminated common water facility or food point), whereas ongoing, multimodal peaks suggest secondary person-to-person spread requiring intensified contact tracing.
              </div>
            </div>
          )}

          {/* TAB 4: TEAM & INTERVENTIONS */}
          {tab === 'team' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Field Deployment Team */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                <h3 className="text-[15px] font-bold text-admin-text mb-3">
                  Field Investigation Personnel
                </h3>
                <div className="space-y-2.5 text-[13px] mb-4">
                  <div className="flex items-center justify-between p-2.5 rounded bg-admin/5 border border-admin/20">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-admin shrink-0" />
                      <span className="font-bold text-admin-text">{inv.lead}</span>
                    </div>
                    <span className="text-[11px] font-bold bg-admin text-white px-2 py-0.5 rounded">
                      Lead Investigator
                    </span>
                  </div>

                  {inv.team.map((t) => (
                    <div key={t} className="flex items-center gap-2 p-2.5 rounded bg-admin-bg/40 border border-border">
                      <User className="w-4 h-4 text-admin-muted shrink-0" />
                      <span className="font-medium text-admin-text">{t}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                    placeholder="Add field investigator or laboratory technician..."
                    className={inputCls}
                  />
                  <button
                    disabled={!member.trim()}
                    onClick={() => {
                      actions.updateInvestigation(
                        inv.id,
                        { team: [...inv.team, member.trim()] },
                        `Added team member: ${member.trim()}.`
                      );
                      setMember('');
                    }}
                    className="h-10 px-3.5 bg-admin hover:bg-admin-hover disabled:opacity-50 text-white rounded-md flex items-center gap-1.5 text-[12px] font-semibold transition-colors shrink-0"
                  >
                    <UserPlus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {/* Linked Interventions */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                <h3 className="text-[15px] font-bold text-admin-text mb-3">
                  Public Health Interventions
                </h3>
                {interventions.length === 0 ? (
                  <div className="text-center py-8 text-admin-muted text-[13px] bg-admin-bg/20 rounded border border-dashed border-border p-4">
                    <p className="font-medium text-admin-text">No active interventions logged</p>
                    <p className="text-[12px] mt-1 text-admin-muted">
                      Interventions initiated from the alert console will link here.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5 text-[13px]">
                    {interventions.map((x) => (
                      <li key={x.id} className="p-3 bg-admin-bg/30 rounded border border-border flex justify-between items-center gap-3">
                        <div>
                          <div className="font-bold text-admin-text">{x.action}</div>
                          <div className="text-[11px] text-admin-muted mt-0.5">{x.id}</div>
                        </div>
                        <span className="font-semibold text-[11px] px-2 py-0.5 rounded bg-white border border-border text-admin-muted uppercase tracking-wider">
                          {x.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
