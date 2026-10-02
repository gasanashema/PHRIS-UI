import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, BellOff } from 'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { notificationsFor, useApp, useCurrentUser } from '../../store/AppStore';
import { SeverityBadge, StatusBadge, SimulatedTag } from '../../components/shared/Badges';
import { SEVERITY_META, fmtDateTime, timeAgo } from '../../lib/format';

type Tab = 'all' | 'unread' | 'alerts' | 'other';

export function DhoNotifications() {
  const { state, actions } = useApp();
  const user = useCurrentUser('dho');
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = notificationsFor(state, user);
  const unread = all.filter((n) => !n.read).length;
  const list = useMemo(() => {
    if (tab === 'unread') return all.filter((n) => !n.read);
    if (tab === 'alerts') return all.filter((n) => n.alertId);
    if (tab === 'other') return all.filter((n) => !n.alertId);
    return all;
  }, [all, tab]);

  const selected = all.find((n) => n.id === selectedId) ?? null;
  const selectedAlert = selected?.alertId ? state.alerts.find((a) => a.id === selected.alertId) : undefined;

  const select = (id: string) => {
    setSelectedId(id);
    actions.markNotificationRead(id);
  };

  const simulate = () => {
    const id = actions.simulateIncomingAlert(user.district === 'National' ? 'Huye' : user.district);
    if (id) setTab('unread');
  };

  const tabs: {id: Tab;label: string;}[] = [
  { id: 'all', label: `All (${all.length})` },
  { id: 'unread', label: `Unread (${unread})` },
  { id: 'alerts', label: 'Alerts' },
  { id: 'other', label: 'Reports & System' }];


  return (
    <DhoLayout
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread notification${unread === 1 ? '' : 's'}` : 'You are all caught up'}
      breadcrumb="Notifications">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) =>
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${tab === t.id ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:text-admin-text'}`}>

              {t.label}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={simulate}
            title="Demo helper: generates a new AI prediction alert for your district"
            className="h-10 px-4 bg-white border border-dashed border-admin text-admin text-[13px] font-semibold rounded-md hover:bg-admin/5 flex items-center gap-2">

            <Sparkles className="w-4 h-4" /> Simulate incoming AI alert <SimulatedTag>Demo</SimulatedTag>
          </button>
          <button
            onClick={() => actions.markAllNotificationsRead()}
            disabled={unread === 0}
            className="h-10 px-4 bg-admin hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-md flex items-center gap-2">

            <Check className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          {list.length === 0 ?
          <div className="p-12 text-center">
              <BellOff className="w-8 h-8 text-admin-muted mx-auto mb-3" />
              <div className="text-[14px] font-bold text-admin-text">Nothing here</div>
              <div className="text-[13px] text-admin-muted">No notifications in this view.</div>
            </div> :

          <ul className="divide-y divide-border">
              {list.map((n) =>
            <li key={n.id}>
                  <button
                onClick={() => select(n.id)}
                className={`w-full text-left px-5 py-4 flex gap-3 transition-colors ${selectedId === n.id ? 'bg-admin/10' : n.read ? 'hover:bg-admin-bg/50' : 'bg-admin/5 hover:bg-admin/10'}`}>

                    <span className="text-[16px] leading-5 shrink-0">
                      {n.severity === 'info' ? 'ℹ️' : SEVERITY_META[n.severity].emoji}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-start justify-between gap-3">
                        <span className={`text-[14px] leading-snug ${n.read ? 'text-admin-text' : 'font-bold text-admin-text'}`}>
                          {n.title}
                        </span>
                        <span className="text-[11px] text-admin-muted whitespace-nowrap">{timeAgo(n.at)}</span>
                      </span>
                      <span className="block text-[13px] text-admin-muted mt-1 line-clamp-2">{n.body}</span>
                    </span>
                    {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-admin-red shrink-0 mt-1.5" aria-label="Unread" />}
                  </button>
                </li>
            )}
            </ul>
          }
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 lg:sticky lg:top-24">
            {!selected ?
            <div className="text-center py-8">
                <div className="text-[14px] font-bold text-admin-text mb-1">Select a notification</div>
                <p className="text-[13px] text-admin-muted">
                  Opening a notification marks it as read. Alert notifications link
                  straight to the alert so you can acknowledge and respond.
                </p>
              </div> :

            <>
                <div className="flex items-center gap-2 mb-2">
                  {selected.severity !== 'info' ?
                <SeverityBadge severity={selected.severity} /> :

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-admin-info/10 text-admin-info">
                      ℹ️ INFO
                    </span>
                }
                  <span className="text-[12px] text-admin-muted">{fmtDateTime(selected.at)}</span>
                </div>
                <h2 className="text-[18px] font-bold text-admin-text mb-2">{selected.title}</h2>
                <p className="text-[14px] text-admin-text leading-relaxed mb-5">{selected.body}</p>

                {selectedAlert &&
              <div className="border border-border rounded-md p-4 mb-5 bg-admin-bg/50">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-admin-muted mb-2">
                      Related alert
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[13px] font-bold">{selectedAlert.id}</span>
                      <StatusBadge status={selectedAlert.status} />
                    </div>
                    <div className="text-[13px] text-admin-text">
                      {selectedAlert.disease} · {selectedAlert.sector ?? selectedAlert.district} · {selectedAlert.probability}% probability
                    </div>
                  </div>
              }

                {selected.link &&
              <button
                onClick={() => navigate(selected.link!)}
                className="h-11 w-full bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md flex items-center justify-center gap-2">

                    {selectedAlert ?
                selectedAlert.status === 'active' ?
                'Open alert & acknowledge' :
                'Open alert' :
                'Open'}{' '}
                    <ArrowRight className="w-4 h-4" />
                  </button>
              }
                {!selected.link &&
              <Link to="/dho" className="text-[13px] font-bold text-admin hover:underline">
                    Back to overview →
                  </Link>
              }
              </>
            }
          </div>
        </div>
      </div>
    </DhoLayout>);

}
