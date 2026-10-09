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
  Cell } from
'recharts';
import { UserPlus, CheckSquare, Square, User } from 'lucide-react';
import type { Investigation, InvestigationStatus } from '../../types';
import { useApp } from '../../store/AppStore';
import { SeverityBadge, EmptyState } from './Badges';
import { addDays, fmtDate, fmtDateTime, fmtShortDate, timeAgo } from '../../lib/format';
import { inputCls, textareaCls } from './Modal';

const LEADS = ['Dr. Jean Paul Habimana', 'Dr. Patrick Bizimana', 'Dr. Samuel Habyarimana'];

const STATUS_STYLE: Record<InvestigationStatus, {label: string;cls: string;band: string;}> = {
  requested: { label: 'Requested', cls: 'bg-yellow-400/15 text-yellow-700', band: 'bg-admin-amber' },
  active: { label: 'Active', cls: 'bg-admin-red/10 text-admin-red', band: 'bg-admin-red' },
  closed: { label: 'Closed', cls: 'bg-admin-accent/10 text-admin-accent', band: 'bg-admin-accent' }
};

const CHECKLIST = [
'Alert received and triaged',
'Investigation opened',
'Lead investigator assigned',
'Field team deployed',
'Suspected source identified',
'Lab confirmation',
'Intervention effectiveness assessed',
'Investigation report finalized'];


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
  const [tab, setTab] = useState<'summary' | 'curve' | 'updates'>('summary');
  const [update, setUpdate] = useState('');
  const [member, setMember] = useState('');

  const list = useMemo(
    () =>
    state.investigations.
    filter((i) => !district || i.district === district).
    filter((i) => statusFilter === 'all' || i.status === statusFilter).
    sort((a, b) => {
      const order = { requested: 0, active: 1, closed: 2 };
      return order[a.status] - order[b.status] || b.openedAt.localeCompare(a.openedAt);
    }),
    [state.investigations, district, statusFilter]
  );

  const inv = state.investigations.find((i) => i.id === selectedId) ?? list[0];
  const alert = inv?.alertId ? state.alerts.find((a) => a.id === inv.alertId) : undefined;
  const progress = inv ? checklistProgress(inv) : [];
  const done = progress.filter(Boolean).length;
  const interventions = inv ?
  state.interventions.filter((x) => x.alertId && x.alertId === inv.alertId) :
  [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
      {/* List */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden h-fit">
        <div className="p-4 border-b border-border flex flex-wrap gap-2">
          {(['all', 'requested', 'active', 'closed'] as const).map((s) =>
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize ${statusFilter === s ? 'bg-admin text-white' : 'bg-admin-bg text-admin-muted hover:text-admin-text'}`}>

              {s}
            </button>
          )}
        </div>
        {list.length === 0 ?
        <EmptyState
          title="No investigations"
          body={district ? 'Request one from an alert when the cause needs field investigation.' : undefined} /> :


        <ul className="divide-y divide-border max-h-[640px] overflow-y-auto">
            {list.map((i) =>
          <li key={i.id}>
                <button
              onClick={() => {
                onSelect(i.id);
                setTab('summary');
              }}
              className={`w-full text-left p-4 transition-colors ${inv?.id === i.id ? 'bg-admin/10' : 'hover:bg-admin-bg/50'}`}>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[12px] font-bold text-admin-text">{i.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${STATUS_STYLE[i.status].cls}`}>
                      {STATUS_STYLE[i.status].label}
                    </span>
                  </div>
                  <div className="text-[14px] font-bold text-admin-text">
                    {i.disease} — {i.sector ? `${i.sector}, ` : ''}{i.district}
                  </div>
                  <div className="text-[12px] text-admin-muted mt-0.5">
                    Lead: {i.lead} · {i.priority} · opened {timeAgo(i.openedAt)}
                  </div>
                </button>
              </li>
          )}
          </ul>
        }
      </div>

      {/* Detail */}
      {!inv ?
      <div className="bg-white rounded-lg shadow-sm border border-border">
          <EmptyState title="Select an investigation" />
        </div> :

      <div className="min-w-0">
          <div className={`${STATUS_STYLE[inv.status].band} text-white px-4 sm:px-6 py-3 rounded-t-lg font-medium text-[14px] flex flex-wrap items-center gap-2`}>
            <span className="font-bold">{inv.id}</span>
            <span className="text-white/50">|</span>
            <span>{inv.disease}, {inv.sector ? `${inv.sector} · ` : ''}{inv.district}</span>
            <span className="text-white/50">|</span>
            <span>{inv.cases} cases</span>
            <span className="text-white/50">|</span>
            <span>Priority: {inv.priority}</span>
            <span className="text-white/50">|</span>
            <span>Opened {fmtDate(inv.openedAt)}</span>
          </div>
          <div className="bg-white border-x border-b border-border rounded-b-lg mb-6 shadow-sm flex overflow-x-auto">
            {[
          ['summary', 'Summary & Actions'],
          ['curve', 'Epidemic Curve'],
          ['updates', `Field Updates (${inv.updates.length})`]].
          map(([k, label]) =>
          <button
            key={k}
            onClick={() => setTab(k as typeof tab)}
            className={`px-5 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === k ? 'border-admin text-admin' : 'border-transparent text-admin-muted hover:text-admin-text'}`}>

                {label}
              </button>
          )}
          </div>

          {tab === 'summary' &&
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-4">Investigation profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-[13px]">
                    <div>
                      <div className="text-admin-muted mb-1">Disease</div>
                      <div className="font-bold">{inv.disease}</div>
                    </div>
                    <div>
                      <div className="text-admin-muted mb-1">Location</div>
                      <div className="font-bold">
                        {inv.sector ? `${inv.sector} Sector, ` : ''}{inv.district} District
                      </div>
                    </div>
                    <div>
                      <div className="text-admin-muted mb-1">Linked alert</div>
                      {alert ?
                  <Link to={alertLink(alert.id)} className="font-bold text-admin hover:underline inline-flex items-center gap-2">
                          {alert.id} <SeverityBadge severity={alert.severity} />
                        </Link> :

                  <div className="font-bold">—</div>
                  }
                    </div>
                    <div>
                      <div className="text-admin-muted mb-1">Cases (at opening)</div>
                      <div className="font-bold">{inv.cases}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-admin-muted mb-1">Working hypothesis</div>
                      <div className="font-medium bg-admin-bg p-3 rounded border border-border">{inv.hypothesis}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-4">Manage investigation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Lead investigator</label>
                      <select
                    value={inv.lead}
                    onChange={(e) => actions.updateInvestigation(inv.id, { lead: e.target.value })}
                    className={inputCls}>

                        {Array.from(new Set([inv.lead, ...LEADS])).map((l) =>
                    <option key={l}>{l}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Priority</label>
                      <select
                    value={inv.priority}
                    onChange={(e) =>
                    actions.updateInvestigation(inv.id, { priority: e.target.value as Investigation['priority'] })
                    }
                    className={inputCls}>

                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inv.status === 'requested' &&
                <button
                  onClick={() => actions.updateInvestigation(inv.id, { status: 'active' }, 'Request accepted. Field team being mobilised.')}
                  className="h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md">

                        Accept & Start Investigation
                      </button>
                }
                    {inv.status === 'active' &&
                <button
                  onClick={() => actions.updateInvestigation(inv.id, { status: 'closed' }, 'Investigation closed. Outbreak contained.')}
                  className="h-10 px-4 bg-admin-accent hover:opacity-90 text-white text-[13px] font-semibold rounded-md">

                        Close Investigation
                      </button>
                }
                    {inv.status === 'closed' &&
                <button
                  onClick={() => actions.updateInvestigation(inv.id, { status: 'active' }, 'Investigation reopened.')}
                  className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg">

                        Reopen
                      </button>
                }
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-3">Add field update</h3>
                  <textarea
                rows={3}
                value={update}
                onChange={(e) => setUpdate(e.target.value)}
                placeholder="e.g. Field team deployed. 4 water points sampled; lab results expected in 48h."
                className={textareaCls} />

                  <div className="flex justify-end mt-3">
                    <button
                  disabled={!update.trim()}
                  onClick={() => {
                    actions.addInvestigationUpdate(inv.id, update.trim());
                    setUpdate('');
                  }}
                  className="h-10 px-4 bg-admin hover:bg-admin-hover disabled:opacity-50 text-white text-[13px] font-semibold rounded-md">

                      Post Update
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-3">Checklist</h3>
                  <div className="flex items-center justify-between text-[12px] font-bold text-admin-text mb-2">
                    <span>Progress</span>
                    <span>{done} of {CHECKLIST.length}</span>
                  </div>
                  <div className="h-2 bg-admin-bg rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-admin-accent rounded-full" style={{ width: `${done / CHECKLIST.length * 100}%` }} />
                  </div>
                  <div className="space-y-2 text-[13px]">
                    {CHECKLIST.map((c, i) =>
                <div key={c} className={`flex items-start gap-2 ${progress[i] ? 'text-admin-text' : 'text-admin-muted'}`}>
                        <span className="shrink-0 mt-0.5">
                          {progress[i] ? <CheckSquare className="w-4 h-4 text-admin-accent" /> : <Square className="w-4 h-4 text-admin-muted" />}
                        </span> {c}
                      </div>
                )}
                  </div>
                  <p className="text-[11px] text-admin-muted mt-3">
                    Steps tick automatically from status changes and field updates.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-3">Field team</h3>
                  <div className="space-y-2 text-[13px] mb-3">
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-admin-muted shrink-0" /> <span className="font-bold">{inv.lead}</span> (Lead)</div>
                    {inv.team.map((t) =>
                <div key={t} className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-admin-muted shrink-0" /> {t}</div>
                )}
                  </div>
                  <div className="flex gap-2">
                    <input
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  placeholder="Add team member"
                  className={inputCls} />

                    <button
                  disabled={!member.trim()}
                  onClick={() => {
                    actions.updateInvestigation(inv.id, { team: [...inv.team, member.trim()] }, `Added team member: ${member.trim()}.`);
                    setMember('');
                  }}
                  aria-label="Add team member"
                  className="h-10 px-3 bg-admin disabled:opacity-50 text-white rounded-md">

                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-border p-5">
                  <h3 className="text-[15px] font-bold text-admin-text mb-3">Related interventions</h3>
                  {interventions.length === 0 ?
              <p className="text-[13px] text-admin-muted">None logged against the linked alert.</p> :

              <ul className="space-y-2 text-[13px]">
                      {interventions.map((x) =>
                <li key={x.id} className="flex justify-between gap-3">
                          <span className="text-admin-text">{x.action}</span>
                          <span className="font-semibold text-admin-muted whitespace-nowrap">{x.status}</span>
                        </li>
                )}
                    </ul>
              }
                </div>
              </div>
            </div>
        }

          {tab === 'curve' &&
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-[16px] font-bold text-admin-text mb-1">
                {inv.disease} Epidemic Curve — {inv.sector ?? inv.district}
              </h2>
              <p className="text-[13px] text-admin-muted mb-6">Daily new cases around the investigation start (illustrative)</p>
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={epiCurve(inv)} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                      {epiCurve(inv).map((_, i) =>
                  <Cell key={i} fill={i >= 6 ? '#FCA5A5' : '#D32F2F'} />
                  )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        }

          {tab === 'updates' &&
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <ol className="relative border-l-2 border-border ml-2 space-y-4">
                {[...inv.updates].reverse().map((u, i) =>
            <li key={i} className="ml-4">
                    <span className={`absolute -left-[7px] w-3 h-3 rounded-full border-2 border-white ${u.kind === 'status' ? 'bg-admin-accent' : 'bg-admin-amber'}`} />
                    <div className="text-[12px] text-admin-muted">
                      {fmtDateTime(u.at)} · <span className="font-semibold text-admin-text">{u.author}</span>
                    </div>
                    <div className="text-[13px] text-admin-text">{u.text}</div>
                  </li>
            )}
              </ol>
            </div>
        }
        </div>
      }
    </div>);

}
