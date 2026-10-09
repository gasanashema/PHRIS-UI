import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { InterventionDrawer } from '../../components/dho/InterventionDrawer';
import { EmptyState } from '../../components/shared/Badges';
import { useApp, useCurrentUser } from '../../store/AppStore';
import { fmtDate } from '../../lib/format';
import type { Intervention, InterventionStatus } from '../../types';

const statusBadge = (s: InterventionStatus) => {
  if (s === 'Ongoing')
    return <span className="inline-flex items-center gap-1.5 text-admin-amber font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-admin-amber" /> Ongoing</span>;
  if (s === 'Planned')
    return <span className="inline-flex items-center gap-1.5 text-admin-info font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-admin-info" /> Planned</span>;
  if (s === 'Completed')
    return <span className="inline-flex items-center gap-1.5 text-admin-accent font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-admin-accent" /> Completed</span>;
  return <span className="inline-flex items-center gap-1.5 text-admin-red font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-admin-red" /> Overdue</span>;
};

export function DhoInterventions() {
  const { state } = useApp();
  const user = useCurrentUser('dho');
  const district = user.role === 'dho' ? user.district : 'Huye';
  const [drawer, setDrawer] = useState<{open: boolean;editing: Intervention | null;}>({ open: false, editing: null });
  const [filter, setFilter] = useState<'all' | InterventionStatus>('all');

  const all = useMemo(
    () =>
    state.interventions.
    filter((i) => i.district === district).
    sort((a, b) => b.date.localeCompare(a.date)),
    [state.interventions, district]
  );
  const list = filter === 'all' ? all : all.filter((i) => i.status === filter);
  const count = (s: InterventionStatus) => all.filter((i) => i.status === s).length;

  const chips: {id: 'all' | InterventionStatus;label: string;cls: string;}[] = [
  { id: 'all', label: `All (${all.length})`, cls: 'text-admin-text' },
  { id: 'Planned', label: `Planned (${count('Planned')})`, cls: 'text-admin-info' },
  { id: 'Ongoing', label: `Ongoing (${count('Ongoing')})`, cls: 'text-admin-amber' },
  { id: 'Completed', label: `Completed (${count('Completed')})`, cls: 'text-admin-accent' },
  { id: 'Overdue', label: `Overdue (${count('Overdue')})`, cls: 'text-admin-red' }];


  return (
    <DhoLayout
      title={`Intervention Tracker — ${district} District`}
      subtitle="Record and monitor all district health response actions"
      breadcrumb="Interventions">

      {/* Summary stats + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          {chips.map((c) =>
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-4 py-2 rounded-full border text-[13px] font-bold shadow-sm transition-colors ${filter === c.id ? 'bg-admin text-white border-admin' : `bg-white border-border ${c.cls} hover:bg-admin-bg`}`}>

              {c.label}
            </button>
          )}
        </div>
        <button
          onClick={() => setDrawer({ open: true, editing: null })}
          className="h-10 px-5 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md flex items-center gap-2">

          <Plus className="w-4 h-4" /> Log New Intervention
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        {list.length === 0 ?
        <EmptyState title="No interventions in this view" /> :

        <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Disease</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Responsible</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Alert</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((it) =>
              <tr
                key={it.id}
                className={`hover:bg-admin-bg/30 ${it.status === 'Overdue' ? 'bg-admin-red/5' : ''}`}>

                    <td className="px-4 py-3 text-admin-muted whitespace-nowrap">
                      {fmtDate(it.date)}
                      {it.due && it.status !== 'Completed' &&
                  <div className="text-[11px]">Due {fmtDate(it.due).replace(', 2026', '')}</div>
                  }
                    </td>
                    <td className="px-4 py-3 font-bold text-admin-text">{it.action}</td>
                    <td className="px-4 py-3 text-admin-muted">{it.disease}</td>
                    <td className="px-4 py-3 text-admin-muted">{it.sector}</td>
                    <td className="px-4 py-3 text-admin-muted">{it.who}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{statusBadge(it.status)}</td>
                    <td className="px-4 py-3 text-admin-muted">{it.outcome}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {it.alertId ?
                  <Link to={`/dho/alerts/${it.alertId}`} className="font-mono text-[12px] text-admin hover:underline">
                          {it.alertId}
                        </Link> :

                  <span className="text-admin-muted">—</span>
                  }
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                    onClick={() => setDrawer({ open: true, editing: it })}
                    className="text-[12px] font-bold text-admin hover:underline">

                        {it.status === 'Overdue' ?
                    'Reschedule' :
                    it.status === 'Completed' ?
                    'View' :
                    'Update'}
                      </button>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
      </div>

      <InterventionDrawer
        open={drawer.open}
        editing={drawer.editing}
        district={district}
        onClose={() => setDrawer({ open: false, editing: null })} />

    </DhoLayout>);

}
