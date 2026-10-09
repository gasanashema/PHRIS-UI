import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  Plus,
  X,
  Hospital,
  Microscope,
  Smartphone,
  BarChart2,
  CloudRain,
  Pill,
  Monitor,
  Droplet,
  Wheat,
  Plug,
  RefreshCw,
  Loader2,
  Check,
  Search } from
'lucide-react';
import { useApp } from '../../store/AppStore';
import { Modal } from '../../components/shared/Modal';
import { SimulatedTag, EmptyState } from '../../components/shared/Badges';
import { fmtDateTime, fmtNumber, timeAgo } from '../../lib/format';
import type { DataSource, SourceStatus } from '../../types';

export const SOURCE_ICONS: Record<DataSource['icon'], typeof Hospital> = {
  hospital: Hospital,
  lab: Microscope,
  phone: Smartphone,
  census: BarChart2,
  weather: CloudRain,
  pharmacy: Pill,
  emr: Monitor,
  water: Droplet,
  agri: Wheat,
  generic: Plug
};

export const STATUS_LABEL: Record<SourceStatus, {label: string;cls: string;}> = {
  active: { label: '● Active', cls: 'text-epi-text' },
  delayed: { label: '● Delayed', cls: 'text-epi-text' },
  partial: { label: '● Partial', cls: 'text-epi-text' },
  disconnected: { label: '● Disconnected', cls: 'text-epi-red' },
  disabled: { label: '● Disabled', cls: 'text-epi-muted' }
};

const EMPTY: Omit<DataSource, 'id'> = {
  name: '',
  shortName: '',
  icon: 'generic',
  description: '',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: '',
  auth: 'API Key',
  frequency: 'Every 2 hours',
  format: 'JSON',
  coverage: 'All 30 districts',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-05T00:00:00',
  recordsToday: 0,
  quality: 100,
  health: 90
};

export function IntegrationSources() {
  const { state, actions } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [panel, setPanel] = useState<{mode: 'new' | 'edit';source?: DataSource;} | null>(null);
  const [historyFor, setHistoryFor] = useState<DataSource | null>(null);
  const [draft, setDraft] = useState<Omit<DataSource, 'id'>>(EMPTY);
  const [test, setTest] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  useEffect(() => {
    if (params.get('q') !== null) setQ(params.get('q') ?? '');
    const edit = params.get('edit');
    const src = edit ? state.sources.find((s) => s.id === edit) : undefined;
    if (src) openEdit(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const openEdit = (s: DataSource) => {
    const { id: _id, ...rest } = s;
    setDraft(rest);
    setTest('idle');
    setPanel({ mode: 'edit', source: s });
  };
  const openNew = () => {
    setDraft(EMPTY);
    setTest('idle');
    setPanel({ mode: 'new' });
  };
  const closePanel = () => {
    setPanel(null);
    if (params.get('edit')) setParams({});
  };

  const runTest = () => {
    setTest('testing');
    window.setTimeout(() => {
      const broken = panel?.source?.status === 'disconnected' || !draft.url.trim() && draft.connection === 'Automatic API';
      setTest(broken ? 'fail' : 'ok');
    }, 1000);
  };

  const save = () => {
    if (!draft.name.trim()) return;
    if (panel?.mode === 'edit' && panel.source) {
      actions.updateSource(panel.source.id, {
        ...draft,
        status: draft.enabled ? panel.source.status === 'disabled' ? panel.source.pausedStatus ?? 'active' : panel.source.status : 'disabled'
      });
    } else {
      actions.addSource({ ...draft, shortName: draft.shortName || draft.name.split(' ')[0], lastSync: '2026-06-05T14:30:00' });
    }
    closePanel();
  };

  const list = state.sources.filter(
    (s) => !q || `${s.name} ${s.description} ${s.status}`.toLowerCase().includes(q.toLowerCase())
  );
  const history = historyFor ? state.syncLog.filter((l) => l.sourceId === historyFor.id) : [];
  const inputCls = 'w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi';

  return (
    <IntegrationLayout
      title="Data Source Connections"
      subtitle="Configure and manage all Rwanda health data source integrations"
      breadcrumb="Sources">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-epi-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter sources…"
              className="h-10 pl-9 pr-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi w-[220px]" />

          </div>
          <SimulatedTag>No real systems contacted</SimulatedTag>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => actions.syncAllSources()}
            className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors flex items-center gap-2">

            <RefreshCw className="w-4 h-4" /> Sync All Now
          </button>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors flex items-center gap-2">

            <Plus className="w-4 h-4" /> Add New Data Source
          </button>
        </div>
      </div>

      {list.length === 0 &&
      <div className="bg-white rounded-lg border border-border">
          <EmptyState title={`No sources match “${q}”`} />
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((src) => {
          const Icon = SOURCE_ICONS[src.icon];
          const st = STATUS_LABEL[src.status];
          const down = src.status === 'disconnected';
          const manual = src.connection === 'Manual Upload';
          return (
            <div
              key={src.id}
              className={`bg-white rounded-lg p-6 shadow-card border flex flex-col ${down ? 'border-epi-red bg-epi-red/5' : 'border-border'} ${!src.enabled ? 'opacity-70' : ''}`}>

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-epi-bg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-epi" />
                  </div>
                  <h3 className="text-[16px] font-bold text-epi-text">{src.name}</h3>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-[12px] font-bold bg-epi-bg px-2 py-1 rounded-full ${st.cls}`}>
                    {src.syncing ? '⏱ Syncing…' : st.label}
                  </span>
                  <button
                    role="switch"
                    aria-checked={src.enabled}
                    aria-label={`${src.enabled ? 'Disable' : 'Enable'} ${src.name}`}
                    onClick={() => actions.toggleSource(src.id)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-epi-muted">

                    {src.enabled ? 'Enabled' : 'Disabled'}
                    <span className={`w-8 h-4 rounded-full relative transition-colors ${src.enabled ? 'bg-epi' : 'bg-border'}`}>
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${src.enabled ? 'left-4' : 'left-0.5'}`} />
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                ['Connection', src.apiType],
                ['Frequency', src.frequency],
                ['Format', src.format]].
                map(([k, v]) =>
                <div key={k}>
                    <div className="text-[11px] text-epi-muted font-medium uppercase tracking-wider mb-1">{k}</div>
                    <div className="text-[13px] font-medium text-epi-text">{v || '—'}</div>
                  </div>
                )}
              </div>

              <div className="space-y-1 mb-6 flex-1">
                <div className="text-[12px] text-epi-muted">{src.description}</div>
                {src.url &&
                <div className="text-[12px] text-epi-muted">
                    <span className="font-medium text-epi-text">URL:</span> {src.url}
                  </div>
                }
                {src.auth &&
                <div className="text-[12px] text-epi-muted">
                    <span className="font-medium text-epi-text">Auth:</span> {src.auth}
                  </div>
                }
                {src.coverage && <div className="text-[12px] text-epi-muted">{src.coverage}</div>}
                {src.warning && <div className="text-[12px] font-medium text-epi-amber mt-2">{src.warning}</div>}
                {src.error && <div className="text-[12px] font-medium text-epi-red mt-2">Error: {src.error}</div>}
              </div>

              <div className="pt-4 border-t border-border mt-auto">
                <div className="text-[12px] text-epi-muted mb-4 flex flex-wrap justify-between gap-2">
                  <span>
                    Last sync: <span className="font-medium text-epi-text">{timeAgo(src.lastSync)}</span>
                    {down && ' (last successful)'}
                  </span>
                  <span>
                    Today: <span className="font-medium text-epi-text">{fmtNumber(src.recordsToday)} records</span>
                  </span>
                </div>
                <div className="flex gap-3">
                  {down ?
                  <button
                    onClick={() => actions.reconnectSource(src.id)}
                    disabled={src.syncing}
                    className="flex-1 py-2 text-[13px] font-bold rounded-md border bg-epi-red text-white hover:bg-epi-red/90 border-epi-red disabled:opacity-60 flex items-center justify-center gap-2">

                      {src.syncing && <Loader2 className="w-4 h-4 animate-spin" />}
                      {src.syncing ? 'Reconnecting…' : 'Reconnect'}
                    </button> :
                  manual ?
                  <Link
                    to={`/integration/upload?source=${src.id}`}
                    className="flex-1 py-2 text-[13px] font-bold rounded-md border border-epi text-epi hover:bg-epi/5 text-center">

                      Upload New File
                    </Link> :

                  <button
                    onClick={() => actions.syncSource(src.id)}
                    disabled={src.syncing || !src.enabled}
                    title={!src.enabled ? 'Enable the source to sync' : undefined}
                    className="flex-1 py-2 text-[13px] font-bold rounded-md border border-epi text-epi hover:bg-epi/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">

                      {src.syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      {src.syncing ? 'Syncing…' : 'Sync Now'}
                    </button>
                  }
                  <button
                    onClick={() => openEdit(src)}
                    className="flex-1 py-2 text-[13px] font-bold rounded-md border border-border text-epi-text hover:bg-epi-bg transition-colors">

                    Configure
                  </button>
                </div>
                <button
                  onClick={() => setHistoryFor(src)}
                  className="mt-3 text-[12px] font-bold text-epi hover:underline">

                  {down ? 'View error log' : 'View sync history'} →
                </button>
              </div>
            </div>);

        })}
      </div>

      {/* Configure / add panel */}
      {panel &&
      <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closePanel} />
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-border shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
            <div className="p-6 border-b border-border flex items-center justify-between bg-epi-bg/50">
              <h2 className="text-[18px] font-bold text-epi-text">
                {panel.mode === 'new' ? 'Add Data Source' : `Configure — ${panel.source?.name}`}
              </h2>
              <button onClick={closePanel} aria-label="Close" className="p-2 hover:bg-white rounded-full text-epi-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">Source Name</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} placeholder="e.g. DHIS2 / HMIS" />
                {!draft.name.trim() && <p className="text-[12px] text-epi-red mt-1">A name is required.</p>}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">Source Description</label>
                <textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">Connection Type</label>
                  <select
                  value={draft.connection === 'Manual Upload' ? 'File Upload' : draft.apiType}
                  onChange={(e) =>
                  setDraft({
                    ...draft,
                    apiType: e.target.value === 'File Upload' ? 'Manual Upload' : e.target.value,
                    connection: e.target.value === 'File Upload' ? 'Manual Upload' : 'Automatic API'
                  })
                  }
                  className={inputCls}>

                    <option>REST API</option>
                    <option>File Upload</option>
                    <option>SFTP</option>
                    <option>Database</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">Authentication</label>
                  <select value={draft.auth.split(' ')[0] === 'API' ? 'API Key' : draft.auth} onChange={(e) => setDraft({ ...draft, auth: e.target.value })} className={inputCls}>
                    <option>API Key</option>
                    <option>Username + Password</option>
                    <option>OAuth 2.0</option>
                    <option>None</option>
                  </select>
                </div>
              </div>
              {draft.connection === 'Automatic API' &&
            <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">Connection URL</label>
                  <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} className={inputCls} placeholder="https://" />
                </div>
            }
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">Pull Frequency</label>
                  <select value={draft.frequency} onChange={(e) => setDraft({ ...draft, frequency: e.target.value })} className={inputCls}>
                    {['Every 30 min', 'Every 1 hour', 'Every 2 hours', 'Every 4 hours', 'Every 6 hours', 'Daily 6:00 AM', 'Daily 7:00 AM', 'Daily 8:00 AM', 'Weekly', 'On upload', draft.frequency].
                  filter((v, i, arr) => arr.indexOf(v) === i).
                  map((f) =>
                  <option key={f}>{f}</option>
                  )}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">Data Format</label>
                  <select value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })} className={inputCls}>
                    {['JSON', 'CSV', 'Excel / CSV', 'XML → JSON', 'HL7 FHIR', draft.format].
                  filter((v, i, arr) => arr.indexOf(v) === i).
                  map((f) =>
                  <option key={f}>{f}</option>
                  )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">Coverage</label>
                <input value={draft.coverage} onChange={(e) => setDraft({ ...draft, coverage: e.target.value })} className={inputCls} />
              </div>
              <button
              type="button"
              onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
              className="flex items-center gap-3 pt-2">

                <span className={`w-10 h-5 rounded-full relative transition-colors ${draft.enabled ? 'bg-epi' : 'bg-border'}`}>
                  <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${draft.enabled ? 'right-1' : 'left-1'}`} />
                </span>
                <span className="text-[14px] font-bold text-epi-text">{draft.enabled ? 'Active' : 'Disabled'}</span>
              </button>

              {test !== 'idle' &&
            <div
              className={`rounded-md p-3 text-[13px] font-medium ${test === 'testing' ? 'bg-epi-bg text-epi-muted' : test === 'ok' ? 'bg-[#00A550]/10 text-[#00A550]' : 'bg-epi-red/10 text-epi-red'}`}>

                  {test === 'testing' && (
                    <span className="flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin text-epi-muted" /> Testing connection…</span>
                  )}
                  {test === 'ok' && (
                    <span className="flex items-center gap-1.5 text-[#00A550]"><Check className="w-4 h-4" /> Connection successful — endpoint responded in 124 ms (simulated).</span>
                  )}
                  {test === 'fail' && (
                    <span className="flex items-center gap-1.5 text-epi-red"><X className="w-4 h-4" /> Connection failed — {panel.source?.error ?? 'no URL configured'}.</span>
                  )}
                </div>
            }
            </div>

            <div className="p-6 border-t border-border bg-epi-bg/50 flex items-center justify-end gap-3">
              <button onClick={closePanel} className="text-[13px] font-bold text-epi-muted hover:text-epi-text mr-auto">
                Cancel
              </button>
              <button
              onClick={runTest}
              disabled={test === 'testing'}
              className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">

                Test Connection
              </button>
              <button
              onClick={save}
              disabled={!draft.name.trim()}
              className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-50 transition-colors">

                {panel.mode === 'new' ? 'Add Source' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </>
      }

      <Modal
        open={!!historyFor}
        title={`${historyFor?.name ?? ''} — sync history`}
        subtitle="Most recent first"
        onClose={() => setHistoryFor(null)}
        width="max-w-[640px]">

        {history.length === 0 ?
        <div className="text-[13px] text-epi-muted">No sync runs recorded yet in this session.</div> :

        <table className="w-full text-[13px]">
            <thead className="text-epi-muted text-left">
              <tr>
                <th className="pb-2">Time</th>
                <th className="pb-2">Records</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((h) =>
            <tr key={h.id}>
                  <td className="py-2 whitespace-nowrap">{fmtDateTime(h.at)}</td>
                  <td className="py-2">{fmtNumber(h.records)}</td>
                  <td className={`py-2 font-bold ${h.status === 'failed' ? 'text-epi-red' : h.status === 'partial' ? 'text-epi-amber' : 'text-[#00A550]'}`}>
                    {h.status}
                  </td>
                  <td className="py-2 text-epi-muted">{h.message}</td>
                </tr>
            )}
            </tbody>
          </table>
        }
      </Modal>
    </IntegrationLayout>);

}
