import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Check, Search, FileSearch } from 'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { useApp, useCurrentUser, sortAlerts } from '../../store/AppStore';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { SeverityBadge, StatusBadge, EmptyState } from '../../components/shared/Badges';
import { SEVERITY_META, addHours, demoNow, fmtDateTime, isOpenStatus, timeAgo } from '../../lib/format';
import type { Alert } from '../../types';

type Filter = 'open' | 'red' | 'orange' | 'yellow' | 'unack' | 'ack' | 'closed';

export function DhoAlerts() {
  const { state, actions } = useApp();
  const user = useCurrentUser('dho');
  const district = user.role === 'dho' ? user.district : 'Huye';
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>('open');
  const [sort, setSort] = useState<'recent' | 'severity' | 'disease'>('severity');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [expanded, setExpanded] = useState<string[]>([]);
  const dialogs = useAlertDialogs();

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  const all = state.alerts.filter((a) => a.district === district);
  const open = all.filter((a) => isOpenStatus(a.status));

  // Expand the most urgent unacknowledged alert by default
  useEffect(() => {
    if (expanded.length === 0) {
      const first = sortAlerts(open.filter((a) => a.status === 'active'), 'severity')[0] ?? sortAlerts(open, 'severity')[0];
      if (first) setExpanded([first.id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = {
    open: open.length,
    red: open.filter((a) => a.severity === 'red').length,
    orange: open.filter((a) => a.severity === 'orange').length,
    yellow: open.filter((a) => a.severity === 'yellow').length,
    unack: open.filter((a) => a.status === 'active').length,
    ack: open.filter((a) => a.status !== 'active').length,
    closed: all.filter((a) => !isOpenStatus(a.status)).length
  };

  const list = useMemo(() => {
    let l: Alert[] = all;
    if (filter === 'closed') l = all.filter((a) => !isOpenStatus(a.status));else
    {
      l = open;
      if (filter === 'red' || filter === 'orange' || filter === 'yellow') l = l.filter((a) => a.severity === filter);
      if (filter === 'unack') l = l.filter((a) => a.status === 'active');
      if (filter === 'ack') l = l.filter((a) => a.status !== 'active');
    }
    const q = query.trim().toLowerCase();
    if (q)
    l = l.filter((a) =>
    [a.id, a.disease, a.sector ?? '', a.district, a.status].some((f) => f.toLowerCase().includes(q))
    );
    return sortAlerts(l, sort);
  }, [all, open, filter, query, sort]);

  const toggle = (id: string) =>
  setExpanded((e) => e.includes(id) ? e.filter((x) => x !== id) : [...e, id]);

  const chips: {id: Filter;label: string;}[] = [
  { id: 'open', label: `All Open (${counts.open})` },
  { id: 'red', label: `🔴 Red (${counts.red})` },
  { id: 'orange', label: `🟠 Orange (${counts.orange})` },
  { id: 'yellow', label: `🟡 Yellow (${counts.yellow})` },
  { id: 'unack', label: `⚠️ Unacknowledged (${counts.unack})` },
  { id: 'ack', label: `✅ Acknowledged (${counts.ack})` },
  { id: 'closed', label: `🗂 Resolved / Dismissed (${counts.closed})` }];


  return (
    <DhoLayout
      title={`Active Alerts — ${district} District`}
      subtitle={
      counts.unack > 0 ?
      `${counts.open} open alert${counts.open === 1 ? '' : 's'} · ${counts.unack} awaiting your acknowledgement` :
      `${counts.open} open alert${counts.open === 1 ? '' : 's'} · all acknowledged`
      }
      breadcrumb="Active Alerts">

      {/* Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {chips.map((f) =>
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${filter === f.id ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:text-admin-text'}`}>

              {f.label}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (params.get('q')) setParams({});
              }}
              placeholder="Search disease, sector, ID…"
              className="h-10 pl-9 pr-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin w-[220px]" />

          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">

            <option value="severity">Sort: Severity</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="disease">Sort: Disease</option>
          </select>
        </div>
      </div>

      {list.length === 0 &&
      <div className="bg-white rounded-lg border border-border shadow-sm">
          <EmptyState
          title={query ? `No alerts match “${query}”` : 'No alerts in this view'}
          body="Try another filter or clear the search." />

        </div>
      }

      <div className="space-y-4">
        {list.map((a) => {
          const m = SEVERITY_META[a.severity];
          const isOpen = expanded.includes(a.id);
          const escalationDue = addHours(a.triggeredAt, state.rules.autoEscalateHours);
          const overdue = a.status === 'active' && new Date(escalationDue) < demoNow();
          const immediate = a.actions.filter((x) => x.phase === 'immediate');
          const short = a.actions.filter((x) => x.phase === 'short');
          const linkedInterventions = state.interventions.filter((i) => i.alertId === a.id);

          if (!isOpen)
          return (
            <div
              key={a.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 ${m.borderL} border-y border-r border-border p-4 sm:p-5`}>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button onClick={() => toggle(a.id)} className="text-left min-w-0">
                    <div className="text-[14px] font-bold text-admin-text flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={a.severity} />
                      <span>
                        {a.disease} | {a.sector ?? a.district} Sector
                      </span>
                      <span className="font-mono text-[12px] text-admin-muted">{a.id}</span>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="text-[13px] text-admin-muted mt-1 truncate">
                      Triggered {timeAgo(a.triggeredAt)}
                      {a.acknowledgedBy && ` · Acknowledged by ${a.acknowledgedBy}`}
                      {a.timeline.filter((t) => t.kind === 'note').slice(-1).map((t) => ` · “${t.text}”`)}
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === 'active' &&
                  <button
                    onClick={() => dialogs.open('ack', a)}
                    className="h-8 px-3 bg-admin hover:bg-admin-hover text-white text-[12px] font-semibold rounded">

                        Acknowledge
                      </button>
                  }
                    <button
                    onClick={() => toggle(a.id)}
                    className="text-admin-muted hover:text-admin-text flex items-center gap-1 text-[13px] font-semibold">

                      <ChevronDown className="w-4 h-4" /> Expand
                    </button>
                  </div>
                </div>
              </div>);


          return (
            <div key={a.id} className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className={`${m.bg} px-4 sm:px-6 py-3 font-bold text-[15px] flex items-center justify-between gap-3`}>
                <span>
                  {m.emoji} {m.label} ALERT — {a.id}
                </span>
                <button
                  onClick={() => toggle(a.id)}
                  className="flex items-center gap-1 text-[12px] font-semibold opacity-90 hover:opacity-100">

                  <ChevronUp className="w-4 h-4" /> Collapse
                </button>
              </div>
              <div className={`px-4 sm:px-6 py-3 ${m.soft.split(' ')[0]} border-b border-border flex flex-wrap gap-x-6 gap-y-1 text-[13px]`}>
                <span>
                  <span className="text-admin-muted">Disease:</span>{' '}
                  <strong className="text-admin-text">{a.disease}</strong>
                </span>
                <span>
                  <span className="text-admin-muted">Sector:</span>{' '}
                  <strong className="text-admin-text">{a.sector ?? '—'}</strong>
                </span>
                <span>
                  <span className="text-admin-muted">Triggered:</span>{' '}
                  <strong className="text-admin-text">{fmtDateTime(a.triggeredAt)}</strong>
                </span>
                <span>
                  <span className="text-admin-muted">Source:</span>{' '}
                  <strong className="text-admin-text">{a.source}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-admin-muted">Status:</span> <StatusBadge status={a.status} />
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
                <div>
                  <h3 className="text-[14px] font-bold text-admin-text mb-3">
                    Why This Alert Was Triggered
                  </h3>
                  <ul className="space-y-2 text-[13px] text-admin-text list-disc pl-4">
                    {a.reasons.map((r) =>
                    <li key={r}>{r}</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-admin-text mb-3">
                    Recommended Actions{' '}
                    <span className="text-admin-muted font-medium text-[12px]">
                      ({a.actions.filter((x) => x.done).length}/{a.actions.length} done)
                    </span>
                  </h3>
                  {[
                  ['Immediate (0–24 hours)', immediate],
                  ['Short-term (1–7 days)', short]].
                  map(([label, items]) =>
                  (items as Alert['actions']).length > 0 &&
                  <div key={label as string} className="mb-4">
                          <div className="text-[12px] font-bold text-admin-muted uppercase tracking-wider mb-2">
                            {label as string}
                          </div>
                          <div className="space-y-2">
                            {(items as Alert['actions']).map((x) =>
                      <label
                        key={x.id}
                        className="flex items-start gap-2 text-[13px] text-admin-text cursor-pointer">

                                <input
                          type="checkbox"
                          checked={x.done}
                          disabled={!isOpenStatus(a.status)}
                          onChange={() => actions.toggleAlertAction(a.id, x.id)}
                          className="mt-0.5 rounded border-border text-admin focus:ring-admin" />

                                <span className={x.done ? 'line-through text-admin-muted' : ''}>{x.label}</span>
                              </label>
                      )}
                          </div>
                        </div>

                  )}
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-admin-text mb-3">Response Timeline</h3>
                  <div className="space-y-3 text-[13px]">
                    <div>
                      <span className="text-admin-muted">Acknowledged:</span>{' '}
                      <strong className={a.acknowledgedAt ? 'text-admin-accent' : 'text-admin-red'}>
                        {a.acknowledgedAt ? `✅ ${a.acknowledgedBy}, ${fmtDateTime(a.acknowledgedAt)}` : '❌ Not yet'}
                      </strong>
                    </div>
                    {a.status === 'active' &&
                    <div>
                        <span className="text-admin-muted">Auto-escalation due:</span>{' '}
                        <strong className={overdue ? 'text-admin-red' : 'text-admin-text'}>
                          {fmtDateTime(escalationDue)} {overdue && '(overdue)'}
                        </strong>
                      </div>
                    }
                    {a.escalatedTo &&
                    <div>
                        <span className="text-admin-muted">Escalated to:</span>{' '}
                        <strong className="text-[#F97316]">{a.escalatedTo}</strong>
                      </div>
                    }
                    <div>
                      <span className="text-admin-muted">Investigation:</span>{' '}
                      {a.investigationId ?
                      <Link to={`/dho/investigations/${a.investigationId}`} className="font-bold text-admin hover:underline">
                          {a.investigationId} →
                        </Link> :

                      <strong className="text-admin-text">None</strong>
                      }
                    </div>
                    <div>
                      <span className="text-admin-muted">Interventions:</span>{' '}
                      <strong className="text-admin-text">{linkedInterventions.length}</strong>
                    </div>
                    <div className="border-t border-border pt-2 text-[12px] text-admin-muted">
                      Latest: {a.timeline[a.timeline.length - 1]?.text}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-border bg-admin-bg/50 flex flex-wrap gap-3">
                {a.status === 'active' ?
                <button
                  onClick={() => dialogs.open('ack', a)}
                  className="h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">

                    <Check className="w-4 h-4" /> Acknowledge Alert
                  </button> :
                isOpenStatus(a.status) ?
                <span className="h-10 px-4 bg-admin-accent text-white text-[13px] font-semibold rounded-md flex items-center gap-2">
                    <Check className="w-4 h-4" /> Acknowledged
                  </span> :
                null}
                {isOpenStatus(a.status) &&
                <>
                    <button
                    onClick={() => dialogs.open('note', a)}
                    className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg transition-colors">

                      📝 Add Response Note
                    </button>
                    {a.status !== 'escalated' &&
                  <button
                    onClick={() => dialogs.open('escalate', a)}
                    className="h-10 px-4 bg-white border border-admin-red text-admin-red text-[13px] font-semibold rounded-md hover:bg-admin-red/10 transition-colors">

                        ⬆️ Escalate to RBC
                      </button>
                  }
                    {!a.investigationId &&
                  <button
                    onClick={() => dialogs.open('investigate', a)}
                    className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg transition-colors flex items-center gap-2">

                        <FileSearch className="w-4 h-4" /> Request Investigation
                      </button>
                  }
                    {a.status !== 'active' &&
                  <button
                    onClick={() => dialogs.open('resolve', a)}
                    className="h-10 px-4 bg-white border border-admin-accent text-admin-accent text-[13px] font-semibold rounded-md hover:bg-admin-accent/10 transition-colors">

                        ✔️ Mark Resolved
                      </button>
                  }
                  </>
                }
                <Link
                  to={`/dho/alerts/${a.id}`}
                  className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg transition-colors flex items-center">

                  📄 View Full Details
                </Link>
              </div>
            </div>);

        })}
      </div>

      {dialogs.element}
    </DhoLayout>);

}
