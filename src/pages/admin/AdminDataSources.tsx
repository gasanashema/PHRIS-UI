import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, X, Loader2, Check } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataSourceDetailsModal, DataSourceItem } from '../../components/admin/DataSourceDetailsModal';
import { SOURCE_ICONS, STATUS_LABEL } from '../integration/IntegrationSources';
import { useApp } from '../../store/AppStore';
import { fmtNumber, timeAgo } from '../../lib/format';
import type { DataSource } from '../../types';

// Names used by the rich metadata in DataSourceDetailsModal
const DETAIL_NAME: Record<string, string> = {
  dhis2: 'DHIS2 / HMIS',
  lab: 'RBC National Laboratory',
  chw: 'CHW Mobile Reports',
  nisr: 'NISR Census & Demographics',
  met: 'Rwanda Meteorological Agency',
  wasac: 'WASAC (Water & Sanitation)',
  minagri: 'MINAGRI (Agriculture/Nutrition)',
  emr: 'Electronic Medical Records (EMR)',
  pharmacy: 'Pharmacy & Medicine Dispensing'
};

function spark(s: DataSource) {
  const base = [40, 35, 50, 45, 60, 55, 65];
  if (s.status === 'disconnected') return base.map((v, i) => ({ v: i >= 3 ? 0 : v }));
  if (!s.enabled) return base.map(() => ({ v: 0 }));
  return base.map((v, i) => ({ v: i === 6 ? Math.min(90, 40 + s.recordsToday % 50) : v }));
}

function toItem(s: DataSource): DataSourceItem {
  return {
    name: DETAIL_NAME[s.id] ?? s.name,
    icon: SOURCE_ICONS[s.icon],
    status: STATUS_LABEL[s.status].label,
    time: timeAgo(s.lastSync),
    recs: s.connection === 'Manual Upload' && !s.recordsToday ? 'Static data' : `${fmtNumber(s.recordsToday)} records`,
    up: `${s.health}%`,
    spark: spark(s),
    action: s.status === 'disconnected' ? 'Reconnect' : 'Configure',
    isRed: s.status === 'disconnected'
  };
}

export function AdminDataSources() {
  const { state, actions } = useApp();
  const [drawer, setDrawer] = useState<DataSource | null>(null);
  const [details, setDetails] = useState<DataSource | null>(null);
  const [form, setForm] = useState({ url: '', frequency: '', format: '', enabled: true });
  const [test, setTest] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const src = state.sources;
  const count = (st: string) => src.filter((s) => s.status === st).length;
  const attention = src.filter((s) => s.status !== 'active' && s.status !== 'disabled').length;
  const met = src.find((s) => s.id === 'met');

  useEffect(() => {
    if (!drawer) return;
    setForm({ url: drawer.url, frequency: drawer.frequency, format: drawer.format, enabled: drawer.enabled });
    setTest('idle');
  }, [drawer]);

  // Keep the open modal in sync with live source changes
  const liveDetails = details ? src.find((s) => s.id === details.id) ?? null : null;

  const openConfigure = (s: DataSource) => {
    if (s.status === 'disconnected') {
      actions.reconnectSource(s.id);
      return;
    }
    setDrawer(s);
  };

  const save = () => {
    if (!drawer) return;
    actions.updateSource(drawer.id, { url: form.url, frequency: form.frequency, format: form.format });
    if (form.enabled !== drawer.enabled) actions.toggleSource(drawer.id);
    setDrawer(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; Data Sources</div>
        <h1 className="text-[24px] font-bold text-admin-text">Health Data Sources</h1>
        <p className="text-[14px] text-admin-muted">
          Live monitoring of all {src.length} Rwanda health data connections ·{' '}
          <Link to="/integration/sources" className="text-admin font-semibold hover:underline">
            Open Data Integration →
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-text shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-admin-accent" />
          {count('active')} Active
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-text shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          {count('delayed') + count('partial')} Delayed / partial
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-text shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-admin-red" />
          {count('disconnected')} Disconnected
        </div>
        {count('disabled') > 0 &&
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-muted shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          {count('disabled')} Disabled
        </div>
        }
        {attention > 0 &&
        <div className="bg-admin-amber/10 px-4 py-2 rounded-full border border-admin-amber/20 text-[13px] font-bold text-admin-amber shadow-sm flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          {attention} Need Attention
        </div>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {src.map((s) => {
          const item = toItem(s);
          const Icon = item.icon;
          return (
            <div key={s.id} className={`bg-white rounded-lg shadow-sm border ${item.isRed ? 'border-admin-red' : 'border-border'} p-5 flex flex-col ${!s.enabled ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${item.isRed ? 'bg-admin-red/10 text-admin-red' : 'bg-admin-bg text-admin'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-admin-text leading-tight max-w-[160px]">{item.name}</h3>
                </div>
                <span className="text-[12px] font-bold bg-admin-bg px-2 py-1 rounded whitespace-nowrap">
                  {s.syncing ? '⏱ Syncing' : item.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                ['Last Sync', item.time],
                ['Records Today', item.recs],
                ['Health', item.up]].
                map(([k, v]) =>
                <div key={k}>
                    <div className="text-[11px] text-admin-muted uppercase tracking-wider mb-1">{k}</div>
                    <div className={`text-[13px] font-medium ${k === 'Health' ? item.isRed ? 'text-admin-red font-bold' : 'text-admin-accent font-bold' : 'text-admin-text'}`}>{v}</div>
                  </div>
                )}
              </div>

              <div className="h-10 mb-4 opacity-50">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={item.spark}>
                    <Line type="monotone" dataKey="v" stroke={item.isRed ? '#D32F2F' : '#104E49'} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <button onClick={() => setDetails(s)} className="text-[13px] font-bold text-admin hover:underline">
                  View Details
                </button>
                <button
                  onClick={() => openConfigure(s)}
                  disabled={s.syncing}
                  className={`h-8 px-4 text-[13px] font-semibold rounded transition-colors flex items-center gap-1.5 disabled:opacity-60 ${item.isRed ? 'bg-admin-red hover:bg-red-700 text-white' : 'bg-admin-bg hover:bg-border text-admin-text'}`}>

                  {s.syncing && item.isRed && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {s.syncing && item.isRed ? 'Reconnecting…' : item.action}
                </button>
              </div>
            </div>);

        })}
      </div>

      {met?.status === 'disconnected' &&
      <button
        onClick={() => setDetails(met)}
        className="w-full text-left bg-admin-amber/10 border border-admin-amber/20 rounded-lg p-4 flex items-start gap-3 hover:bg-admin-amber/20 transition-colors">

          <AlertTriangle className="w-5 h-5 text-admin-amber shrink-0 mt-0.5" />
          <p className="text-[14px] text-admin-text font-medium">
            <span className="font-bold">Rwanda Meteorological Agency is disconnected ({timeAgo(met.lastSync)}).</span>{' '}
            Environmental risk predictions may be affected. Click to investigate →
          </p>
        </button>
      }

      {/* Configure drawer */}
      {drawer &&
      <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDrawer(null)} />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-admin-text">Data Source Configuration</h2>
              <button onClick={() => setDrawer(null)} aria-label="Close" className="text-admin-muted hover:text-admin-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Source Name</label>
                <input type="text" value={drawer.name} disabled className="w-full h-10 px-3 bg-admin-bg border border-border rounded-md text-admin-muted outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Connection URL / Endpoint</label>
                <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://"
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />

              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Sync Frequency</label>
                <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full h-10 px-3 border border-border rounded-md bg-white">
                  {Array.from(new Set([form.frequency, 'Every 30 min', 'Every 1 hour', 'Every 2 hours', 'Every 6 hours', 'Daily 6:00 AM', 'Weekly'])).map((f) =>
                <option key={f}>{f}</option>
                )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Data Format</label>
                <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="w-full h-10 px-3 border border-border rounded-md bg-white">
                  {Array.from(new Set([form.format, 'JSON', 'XML', 'CSV', 'HL7 FHIR'])).map((f) =>
                <option key={f}>{f}</option>
                )}
                </select>
              </div>
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-medium text-admin-text">Active</div>
                    <div className="text-[12px] text-admin-muted">Enable data synchronization</div>
                  </div>
                  <button
                  role="switch"
                  aria-checked={form.enabled}
                  aria-label="Active"
                  onClick={() => setForm({ ...form, enabled: !form.enabled })}
                  className={`w-11 h-6 rounded-full relative transition-colors ${form.enabled ? 'bg-admin-accent' : 'bg-border'}`}>

                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <button
                onClick={() => {
                  setTest('testing');
                  window.setTimeout(() => setTest(form.url.trim() || drawer.connection === 'Manual Upload' ? 'ok' : 'fail'), 900);
                }}
                className="w-full h-10 mt-2 bg-admin-bg border border-border hover:bg-border text-admin-text text-[14px] font-semibold rounded-md transition-colors">

                  {test === 'testing' ? 'Testing…' : 'Test Connection'}
                </button>
                {test === 'ok' && (
                  <div className="text-[13px] font-medium text-admin-accent flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Endpoint responded (simulated).
                  </div>
                )}
                {test === 'fail' && (
                  <div className="text-[13px] font-medium text-admin-red flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> No endpoint URL configured.
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-border bg-admin-bg flex gap-3 shrink-0">
              <button onClick={() => setDrawer(null)} className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
                Cancel
              </button>
              <button onClick={save} className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        </>
      }

      <DataSourceDetailsModal
        open={!!liveDetails}
        source={liveDetails ? toItem(liveDetails) : null}
        onClose={() => setDetails(null)}
        onSync={() => liveDetails && actions.syncSource(liveDetails.id)}
        onConfigure={() => liveDetails && openConfigure(liveDetails)} />

    </AdminLayout>);

}
