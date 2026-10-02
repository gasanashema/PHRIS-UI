import { useState } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { Clock, X, Loader2 } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { addHours, demoNow, fmtDateTime, fmtTime, nowISO, timeAgo } from '../../lib/format';
import type { DataSource } from '../../types';

const FREQUENCIES = ['Every 30 min', 'Every 1 hour', 'Every 2 hours', 'Every 4 hours', 'Every 6 hours', 'Daily 6:00 AM', 'Daily 7:00 AM', 'Daily 8:00 AM', 'Weekly', 'On upload'];

function nextRun(s: DataSource): string {
  const f = s.frequency;
  const hourly = f.match(/Every (\d+) (hour|min)/);
  if (hourly) {
    const hours = hourly[2] === 'min' ? Number(hourly[1]) / 60 : Number(hourly[1]);
    let t = s.lastSync;
    while (new Date(t) <= demoNow()) t = addHours(t, hours);
    return t;
  }
  const daily = f.match(/Daily (\d+):(\d+)/);
  if (daily) {
    const today = nowISO().slice(0, 10);
    const candidate = `${today}T${daily[1].padStart(2, '0')}:${daily[2]}:00`;
    return new Date(candidate) > demoNow() ? candidate : addHours(candidate, 24);
  }
  if (f === 'Weekly') return addHours(s.lastSync, 24 * 7);
  return '';
}

export function IntegrationScheduling() {
  const { state, actions } = useApp();
  const [edit, setEdit] = useState<DataSource | null>(null);
  const [form, setForm] = useState({ frequency: '', retries: '3', interval: '15 min', missed: '2', enabled: true });

  const rows = state.sources.map((s) => ({ s, next: s.enabled && s.connection === 'Automatic API' ? nextRun(s) : '' }));
  const upcoming = rows.filter((r) => r.next && r.s.status !== 'disconnected').sort((a, b) => a.next.localeCompare(b.next))[0];

  const open = (s: DataSource) => {
    setForm({ frequency: s.frequency, retries: '3', interval: '15 min', missed: '2', enabled: s.enabled });
    setEdit(s);
  };
  const live = edit ? state.sources.find((x) => x.id === edit.id) : undefined;

  const status = (s: DataSource) => {
    if (!s.enabled) return { label: '⚪ Paused', cls: 'text-epi-muted' };
    if (s.connection === 'Manual Upload') return { label: '🟢 No schedule needed', cls: '' };
    if (s.status === 'disconnected') return { label: '🔴 Offline', cls: 'text-epi-red' };
    if (s.status === 'delayed') return { label: '🟡 Delayed today', cls: '' };
    if (s.status === 'partial') return { label: '🟡 Partial', cls: '' };
    return { label: '🟢 On schedule', cls: '' };
  };

  return (
    <IntegrationLayout
      title="Data Pull Scheduling"
      subtitle="Configure when each data source is pulled into AI Vital"
      breadcrumb="Scheduling">

      <div className="bg-white border border-border rounded-lg p-4 mb-6 shadow-sm flex items-center gap-2">
        <Clock className="w-5 h-5 text-epi shrink-0" />
        <span className="text-[14px] font-bold text-epi-text">
          {upcoming ?
          `Next scheduled run: ${upcoming.s.name} — ${fmtTime(upcoming.next)} (${Math.max(1, Math.round((new Date(upcoming.next).getTime() - demoNow().getTime()) / 60000))} min)` :
          'No scheduled runs pending'}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Source', 'Frequency', 'Last Run', 'Next Run', 'Status', 'Edit'].map((h) =>
                <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'Edit' ? 'text-right' : ''}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(({ s, next }) => {
                const st = status(s);
                const manual = s.connection === 'Manual Upload';
                return (
                  <tr key={s.id} className={`hover:bg-epi-bg/50 transition-colors ${s.status === 'disconnected' ? 'bg-epi-red/5' : ''}`}>
                    <td className="p-4 text-[14px] font-bold text-epi-text">{s.name}</td>
                    <td className="p-4 text-[13px] text-epi-text">{manual ? 'Manual only' : s.frequency}</td>
                    <td className="p-4 text-[13px] text-epi-text whitespace-nowrap">
                      {fmtDateTime(s.lastSync)}
                      {s.status === 'disconnected' && <span className="text-epi-red"> (last success)</span>}
                    </td>
                    <td className="p-4 text-[13px] text-epi-text whitespace-nowrap">{manual ? 'When uploaded' : next ? fmtDateTime(next) : '—'}</td>
                    <td className={`p-4 text-[13px] font-bold whitespace-nowrap ${st.cls}`}>{s.syncing ? '⏳ Running' : st.label}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {manual ?
                      <span className="text-epi-muted">—</span> :

                      <div className="flex items-center justify-end gap-2">
                          <button onClick={() => open(s)} className="text-[13px] font-medium text-epi hover:underline">Edit</button>
                          {s.status === 'disconnected' &&
                        <>
                              <span className="text-epi-muted">·</span>
                              <button
                            onClick={() => actions.reconnectSource(s.id)}
                            disabled={s.syncing}
                            className="text-[13px] font-medium text-epi hover:underline disabled:opacity-50">

                                {s.syncing ? 'Retrying…' : 'Force Retry'}
                              </button>
                            </>
                        }
                        </div>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>

        {edit && live &&
        <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setEdit(null)} />
            <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white border-l border-border shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
              <div className="p-6 border-b border-border flex items-center justify-between bg-epi-bg/50">
                <h2 className="text-[18px] font-bold text-epi-text">Edit Schedule — {live.name}</h2>
                <button onClick={() => setEdit(null)} aria-label="Close" className="p-2 hover:bg-white rounded-full text-epi-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">Pull Frequency</label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                    {Array.from(new Set([form.frequency, ...FREQUENCIES])).map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="bg-epi-bg p-4 rounded-lg border border-border space-y-4">
                  <h3 className="text-[13px] font-bold text-epi-text">Retry on failure</h3>
                  {([
                ['retries', 'Max retries:', ['1', '2', '3', '5']],
                ['interval', 'Retry interval:', ['5 min', '10 min', '15 min', '30 min']]] as
                const).map(([k, label, opts]) =>
                <div key={k} className="flex items-center justify-between">
                      <span className="text-[13px] text-epi-muted">{label}</span>
                      <select value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="border border-border rounded px-2 py-1 text-[13px] focus:outline-none bg-white">
                        {opts.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-epi-text">Alert admin if missed runs &gt;</span>
                  <select value={form.missed} onChange={(e) => setForm({ ...form, missed: e.target.value })} className="border border-border rounded px-2 py-1 text-[13px] focus:outline-none bg-white">
                    {['1', '2', '3'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button type="button" onClick={() => setForm({ ...form, enabled: !form.enabled })} className="flex items-center gap-3 pt-4 border-t border-border w-full">
                  <span className={`w-10 h-5 rounded-full relative transition-colors ${form.enabled ? 'bg-epi' : 'bg-border'}`}>
                    <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.enabled ? 'right-1' : 'left-1'}`}></span>
                  </span>
                  <span className="text-[14px] font-bold text-epi-text">{form.enabled ? 'Active schedule' : 'Schedule paused'}</span>
                </button>
                <p className="text-[12px] text-epi-muted">Last successful pull {timeAgo(live.lastSync)}.</p>
              </div>

              <div className="p-6 border-t border-border bg-epi-bg/50 flex items-center justify-end gap-3">
                <button onClick={() => setEdit(null)} className="text-[13px] font-bold text-epi-muted hover:text-epi-text mr-auto">Cancel</button>
                <button
                onClick={() => live.status === 'disconnected' ? actions.reconnectSource(live.id) : actions.syncSource(live.id)}
                disabled={live.syncing || !live.enabled}
                className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg disabled:opacity-50 transition-colors flex items-center gap-2">

                  {live.syncing && <Loader2 className="w-4 h-4 animate-spin" />} Force Run Now
                </button>
                <button
                onClick={() => {
                  actions.updateSource(live.id, { frequency: form.frequency });
                  if (form.enabled !== live.enabled) actions.toggleSource(live.id);
                  setEdit(null);
                }}
                className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">

                  Save Schedule
                </button>
              </div>
            </div>
          </>
        }
      </div>
    </IntegrationLayout>);

}
