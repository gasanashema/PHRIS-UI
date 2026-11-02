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
  ExternalLink,
  Users,
  Activity,
  Layers,
  FileText,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Microscope,
  Check
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

  const inv = selectedId ? state.investigations.find((i) => i.id === selectedId) : undefined;
  const alert = inv?.alertId ? state.alerts.find((a) => a.id === inv.alertId) : undefined;
  const progress = inv ? checklistProgress(inv) : [];
  const done = progress.filter(Boolean).length;
  const interventions = inv
    ? state.interventions.filter((x) => x.alertId && x.alertId === inv.alertId)
    : [];

  // --------------------------------------------------------------------------
  // VIEW 1: DEDICATED FULL-WIDTH INVESTIGATION WORKSPACE (When an ID is selected)
  // --------------------------------------------------------------------------
  if (inv) {
    return (
      <div className="space-y-6">
        {/* Navigation Bar & Investigation Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border">
          <button
            onClick={() => onSelect('')}
            className="inline-flex items-center gap-2 text-[13px] font-bold text-epi hover:underline group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to All Investigations</span>
          </button>

          {/* Quick switcher to other investigations */}
          <div className="flex items-center gap-2 text-[12px] text-epi-muted">
            <span className="font-medium">Switch Investigation:</span>
            <select
              value={inv.id}
              onChange={(e) => onSelect(e.target.value)}
              className="py-1 px-2.5 bg-white border border-border rounded-md text-[12px] font-semibold text-epi-text focus:outline-none focus:ring-1 focus:ring-epi"
            >
              {state.investigations
                .filter((i) => !district || i.district === district)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} — {item.disease} ({item.district})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Spacious Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[12px] font-bold px-2.5 py-0.5 bg-epi-bg/80 border border-border rounded text-epi-text">
                  {inv.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-semibold ${
                    inv.status === 'requested'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                      : inv.status === 'active'
                      ? 'bg-red-50 text-epi-red border border-red-200/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inv.status === 'requested'
                        ? 'bg-[#F97316]'
                        : inv.status === 'active'
                        ? 'bg-epi-red'
                        : 'bg-[#00A550]'
                    }`}
                  />
                  <span>
                    {inv.status === 'requested'
                      ? 'Requested by District'
                      : inv.status === 'active'
                      ? 'Active Outbreak'
                      : 'Contained / Closed'}
                  </span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    inv.priority === 'Critical'
                      ? 'bg-red-100 text-epi-red'
                      : inv.priority === 'High'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {inv.priority} Priority
                </span>
              </div>

              <h1 className="text-[22px] font-bold text-epi-text">
                {inv.disease} Outbreak Investigation
              </h1>
              <p className="text-[13px] text-epi-muted flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-epi-muted shrink-0" />
                <span>{inv.sector ? `${inv.sector} Sector, ` : ''}{inv.district} District</span>
                <span>·</span>
                <span>Opened {fmtDate(inv.openedAt)} ({timeAgo(inv.openedAt)})</span>
              </p>
            </div>

            {/* Action Buttons */}
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
                  className="h-10 px-5 bg-epi hover:bg-epi-dark text-white text-[13px] font-bold rounded-md flex items-center gap-2 shadow-xs transition-colors"
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
                  className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-md flex items-center gap-2 shadow-xs transition-colors"
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
                  className="h-10 px-5 bg-white border border-border text-epi-text hover:bg-epi-bg/60 text-[13px] font-semibold rounded-md flex items-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4" /> Reopen Investigation
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-epi-muted">
                Cumulative Cases
              </div>
              <div className="text-[22px] font-bold text-epi-text mt-0.5">{inv.cases}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-epi-muted">
                Lead Investigator
              </div>
              <div className="text-[14px] font-bold text-epi-text truncate mt-1">{inv.lead}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-epi-muted">
                Investigation Milestones
              </div>
              <div className="text-[14px] font-bold text-epi-text mt-1">
                {done} of {CHECKLIST.length} completed ({Math.round((done / CHECKLIST.length) * 100)}%)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-epi-muted">
                Assigned Team Size
              </div>
              <div className="text-[14px] font-bold text-epi-text mt-1">
                {inv.team.length + 1} personnel deployed
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Full-Width Tab Navigation */}
        <div className="bg-white border border-border rounded-lg shadow-xs flex overflow-x-auto">
          {(
            [
              { id: 'overview', label: 'Overview & Milestones' },
              { id: 'updates', label: `Field Activity & Log (${inv.updates.length})` },
              { id: 'curve', label: 'Epidemic Curve' },
              { id: 'team', label: `Personnel & Interventions (${inv.team.length + 1})` }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3.5 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-epi text-epi bg-epi/5'
                  : 'border-transparent text-epi-muted hover:text-epi-text hover:bg-epi-bg/40'
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
              {/* Working Hypothesis & Context */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-epi-text mb-3">
                    Epidemiological Hypothesis & Source
                  </h3>
                  <div className="p-4 bg-epi-bg/50 rounded-lg border border-border text-[13px] text-epi-text leading-relaxed mb-5">
                    <span className="font-bold block mb-1 text-epi-text">Suspected Transmission Vector:</span>
                    {inv.hypothesis}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] pt-3 border-t border-border">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-epi-muted block mb-1">
                      Linked Early Warning Alert
                    </span>
                    {alert ? (
                      <Link
                        to={alertLink(alert.id)}
                        className="inline-flex items-center gap-2 font-bold text-epi hover:underline bg-epi/5 px-3 py-1.5 rounded border border-epi/20"
                      >
                        <span>{alert.id}</span>
                        <SeverityBadge severity={alert.severity} />
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-epi-muted" />
                      </Link>
                    ) : (
                      <span className="text-epi-muted font-medium">No alert linked</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-epi-muted block mb-1">
                      Transmission Focus
                    </span>
                    <span className="font-bold text-epi-text">
                      {inv.sector ? `${inv.sector} Sector, ` : ''}{inv.district} District
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Controls */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-epi-text mb-4">
                    Investigation Controls
                  </h3>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-epi-muted mb-1.5">
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
                      <label className="block text-[12px] font-semibold text-epi-muted mb-1.5">
                        Outbreak Priority Level
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

                <div className="text-[12px] text-epi-muted bg-epi-bg/50 p-3 rounded border border-border">
                  Field escalation alerts and lab reports will route to {inv.lead}.
                </div>
              </div>
            </div>

            {/* Outbreak Response Lifecycle Milestones */}
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-epi-text">
                    Outbreak Response Lifecycle (WHO & RBC Standard)
                  </h3>
                  <p className="text-[12px] text-epi-muted mt-0.5">
                    Standard eight-stage national outbreak investigation protocol
                  </p>
                </div>
                <div className="text-[12px] font-bold text-epi-text">
                  Lifecycle Progress: <span className="text-epi">{done} of {CHECKLIST.length} milestones complete</span>
                </div>
              </div>

              <div className="h-2.5 bg-epi-bg rounded-full overflow-hidden mb-6 border border-border">
                <div
                  className="h-full bg-epi rounded-full transition-all duration-300"
                  style={{ width: `${(done / CHECKLIST.length) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {CHECKLIST.map((step, idx) => {
                  const isDone = progress[idx];
                  return (
                    <div
                      key={step}
                      className={`p-3.5 rounded-lg border text-[12px] flex items-start gap-3 transition-colors ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200 text-epi-text'
                          : 'bg-white border-border text-epi-muted'
                      }`}
                    >
                      <span className="shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-epi-muted/60" />
                        )}
                      </span>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-epi-muted mb-0.5">
                          Milestone {idx + 1}
                        </div>
                        <div className={`font-semibold ${isDone ? 'text-epi-text' : 'text-epi-muted'}`}>
                          {step}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[12px] text-epi-muted mt-5 bg-epi-bg/40 p-3 rounded border border-border">
                Milestones advance automatically as teams document field findings, submit laboratory confirmations, and assess community intervention outcomes.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: FIELD ACTIVITY & UPDATES */}
        {tab === 'updates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-[16px] font-bold text-epi-text mb-2">
                Log New Field Update
              </h3>
              <p className="text-[12px] text-epi-muted mb-3">
                Record field sampling, laboratory verifications, household contacts, or clinical observations.
              </p>
              <textarea
                rows={3}
                value={update}
                onChange={(e) => setUpdate(e.target.value)}
                placeholder="e.g. Field team deployed. 4 water points sampled in Bugarama Sector; laboratory cultures expected in 48 hours."
                className={textareaCls}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[12px] text-epi-muted">
                  Logged by: <span className="font-semibold text-epi-text">{inv.lead}</span>
                </span>
                <button
                  disabled={!update.trim()}
                  onClick={() => {
                    actions.addInvestigationUpdate(inv.id, update.trim());
                    setUpdate('');
                  }}
                  className="h-9 px-5 bg-epi hover:bg-epi-dark disabled:opacity-50 text-white text-[12px] font-bold rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Post Update
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-[16px] font-bold text-epi-text mb-4">
                Field Activity Log ({inv.updates.length})
              </h3>

              {inv.updates.length === 0 ? (
                <p className="text-[13px] text-epi-muted text-center py-8">
                  No field updates logged yet for this investigation.
                </p>
              ) : (
                <ol className="relative border-l-2 border-border ml-3 space-y-5">
                  {[...inv.updates].reverse().map((u, i) => (
                    <li key={i} className="ml-5">
                      <span
                        className={`absolute -left-[7px] w-3 h-3 rounded-full border-2 border-white ${
                          u.kind === 'status' ? 'bg-epi' : 'bg-[#F97316]'
                        }`}
                      />
                      <div className="flex items-center gap-2 text-[12px] text-epi-muted mb-1">
                        <span className="font-bold text-epi-text">{u.author}</span>
                        <span>·</span>
                        <span>{fmtDateTime(u.at)}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.kind === 'status'
                              ? 'bg-epi/10 text-epi'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {u.kind === 'status' ? 'Status Change' : 'Field Note'}
                        </span>
                      </div>
                      <div className="text-[13px] text-epi-text bg-epi-bg/40 p-3.5 rounded border border-border/80">
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
                <h2 className="text-[16px] font-bold text-epi-text">
                  {inv.disease} Epidemic Curve — {inv.sector ? `${inv.sector}, ` : ''}{inv.district}
                </h2>
                <p className="text-[12px] text-epi-muted mt-0.5">
                  Daily distribution of incident cases over the investigation window
                </p>
              </div>
              <div className="text-[12px] font-semibold text-epi-muted">
                Cumulative Cases: <span className="font-bold text-epi-text">{inv.cases}</span>
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

            <div className="p-4 bg-epi-bg/40 rounded-lg border border-border text-[12px] text-epi-muted leading-relaxed">
              <span className="font-bold text-epi-text block mb-1">Epidemiological Trajectory:</span>
              A sharp single peak indicates point-source exposure (e.g., contaminated water source or shared food point), whereas ongoing multimodal peaks suggest continuous human-to-human transmission requiring intensified contact tracing.
            </div>
          </div>
        )}

        {/* TAB 4: TEAM & INTERVENTIONS */}
        {tab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-[16px] font-bold text-epi-text mb-3">
                Field Response Personnel
              </h3>
              <div className="space-y-3 text-[13px] mb-5">
                <div className="flex items-center justify-between p-3 rounded bg-epi/5 border border-epi/20">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-epi shrink-0" />
                    <span className="font-bold text-epi-text">{inv.lead}</span>
                  </div>
                  <span className="text-[11px] font-bold bg-epi text-white px-2 py-0.5 rounded">
                    Lead Investigator
                  </span>
                </div>

                {inv.team.map((t) => (
                  <div key={t} className="flex items-center gap-2 p-3 rounded bg-epi-bg/40 border border-border">
                    <User className="w-4 h-4 text-epi-muted shrink-0" />
                    <span className="font-medium text-epi-text">{t}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  placeholder="Add field personnel or lab technician..."
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
                  className="h-10 px-4 bg-epi hover:bg-epi-dark disabled:opacity-50 text-white rounded-md flex items-center gap-1.5 text-[12px] font-bold transition-colors shrink-0"
                >
                  <UserPlus className="w-4 h-4" /> Add Member
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-[16px] font-bold text-epi-text mb-3">
                Public Health Interventions
              </h3>
              {interventions.length === 0 ? (
                <div className="text-center py-10 text-epi-muted text-[13px] bg-epi-bg/20 rounded border border-dashed border-border p-5">
                  <p className="font-semibold text-epi-text">No active interventions linked</p>
                  <p className="text-[12px] mt-1 text-epi-muted">
                    Countermeasures deployed from the early warning alert console will link here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3 text-[13px]">
                  {interventions.map((x) => (
                    <li key={x.id} className="p-3.5 bg-epi-bg/30 rounded border border-border flex justify-between items-center gap-3">
                      <div>
                        <div className="font-bold text-epi-text">{x.action}</div>
                        <div className="text-[11px] text-epi-muted mt-0.5">{x.id}</div>
                      </div>
                      <span className="font-semibold text-[11px] px-2.5 py-0.5 rounded bg-white border border-border text-epi-muted uppercase tracking-wider">
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
    );
  }

  // --------------------------------------------------------------------------
  // VIEW 2: SPACIOUS, UNCLUSTERED OUTBREAK INVESTIGATIONS DIRECTORY
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top 4 Minimal Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium">Total Investigations</div>
            <div className="text-[26px] font-bold text-epi-text mt-1">{counts.all}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-epi/10 flex items-center justify-center text-epi">
            <Microscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-epi-red" />
              <span>Active Outbreaks</span>
            </div>
            <div className="text-[26px] font-bold text-epi-text mt-1">{counts.active}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-epi-red">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span>Awaiting Acceptance</span>
            </div>
            <div className="text-[26px] font-bold text-epi-text mt-1">{counts.requested}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F97316]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A550]" />
              <span>Contained Outbreaks</span>
            </div>
            <div className="text-[26px] font-bold text-epi-text mt-1">{counts.closed}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#00A550]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Directory Console: Search, Filters, and Table */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-epi-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by disease, district, sector, or lead..."
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-epi-bg/40 border border-border rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-epi"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
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
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
                  statusFilter === s.key
                    ? 'bg-epi text-white shadow-xs'
                    : 'bg-white border border-border text-epi-muted hover:text-epi-text hover:bg-epi-bg/50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spacious Table */}
        {list.length === 0 ? (
          <div className="p-12 text-center text-epi-muted text-[13px]">
            <p className="font-bold text-[15px] text-epi-text">No investigations found</p>
            <p className="text-[13px] mt-1 text-epi-muted">
              {search
                ? 'Try matching a different disease, location, or investigator.'
                : 'No investigations in this category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
                <tr>
                  <th className="px-5 py-3.5">Investigation ID</th>
                  <th className="px-5 py-3.5">Disease & Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Cases</th>
                  <th className="px-5 py-3.5">Lead Investigator</th>
                  <th className="px-5 py-3.5">Opened</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((item) => {
                  const statusDot =
                    item.status === 'requested'
                      ? 'bg-[#F97316]'
                      : item.status === 'active'
                      ? 'bg-epi-red'
                      : 'bg-[#00A550]';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      className="hover:bg-epi-bg/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-epi-text">
                        {item.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-epi-text text-[14px]">
                          {item.disease}
                        </div>
                        <div className="text-[12px] text-epi-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{item.sector ? `${item.sector}, ` : ''}{item.district}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-epi-text">
                          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            item.priority === 'Critical'
                              ? 'bg-red-100 text-epi-red'
                              : item.priority === 'High'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-epi-text">
                        {item.cases}
                      </td>
                      <td className="px-5 py-4 text-epi-text font-medium">
                        {item.lead}
                      </td>
                      <td className="px-5 py-4 text-epi-muted whitespace-nowrap">
                        {timeAgo(item.openedAt)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item.id);
                          }}
                          className="h-8 px-3.5 bg-epi hover:bg-epi-dark text-white text-[12px] font-bold rounded-md inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
