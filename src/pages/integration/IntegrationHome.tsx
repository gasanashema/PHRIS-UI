import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  Plug,
  Database,
  ShieldCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  Loader2 } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceLine,
  Cell } from
'recharts';
import { useApp } from '../../store/AppStore';
import { Modal } from '../../components/shared/Modal';
import { STATUS_LABEL } from './IntegrationSources';
import { demoNow, fmtDateTime, fmtNumber, timeAgo } from '../../lib/format';
import type { DataSource } from '../../types';

const dailyData = [
{ date: 'May 30', dhis2: 4100, emr: 2000, chw: 1200, pharmacy: 800, other: 500, avg: 8600 },
{ date: 'May 31', dhis2: 4200, emr: 2100, chw: 1250, pharmacy: 850, other: 520, avg: 8700 },
{ date: 'Jun 1', dhis2: 4150, emr: 2050, chw: 1220, pharmacy: 820, other: 510, avg: 8750 },
{ date: 'Jun 2', dhis2: 4300, emr: 2150, chw: 1300, pharmacy: 880, other: 540, avg: 8800 },
{ date: 'Jun 3', dhis2: 4250, emr: 2100, chw: 1280, pharmacy: 860, other: 530, avg: 8850 },
{ date: 'Jun 4', dhis2: 4200, emr: 2080, chw: 0, pharmacy: 870, other: 520, avg: 8900 }];


export function IntegrationHome() {
  const { state, actions } = useApp();
  const [logFor, setLogFor] = useState<DataSource | null>(null);
  const src = state.sources;
  const enabled = src.filter((s) => s.enabled);
  const count = (st: string) => src.filter((s) => s.status === st).length;
  const records = src.reduce((sum, s) => sum + s.recordsToday, 0);
  const live = enabled.filter((s) => s.status !== 'disconnected');
  const pass = live.length ? live.reduce((sum, s) => sum + s.quality, 0) / live.length : 0;
  const failures = state.syncLog.filter((l) => l.status !== 'success');
  const ages = enabled.map((s) => (demoNow().getTime() - new Date(s.lastSync).getTime()) / 60000);
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
  const met = src.find((s) => s.id === 'met');
  const byShort = (id: string) => src.find((s) => s.id === id)?.recordsToday ?? 0;

  const chartData = [
  ...dailyData,
  {
    date: 'Jun 5',
    dhis2: byShort('dhis2'),
    emr: byShort('emr'),
    chw: byShort('chw'),
    pharmacy: byShort('pharmacy'),
    other: src.filter((s) => !['dhis2', 'emr', 'chw', 'pharmacy'].includes(s.id)).reduce((a, s) => a + s.recordsToday, 0),
    avg: 8950
  }];

  const healthData = [...src].
  sort((a, b) => b.health - a.health).
  map((s) => ({
    name: s.shortName,
    score: s.enabled ? s.health : 0,
    fill: !s.enabled ? '#9CA3AF' : s.health >= 90 ? '#00A550' : s.health >= 70 ? '#F97316' : '#D32F2F'
  }));

  return (
    <IntegrationLayout
      title="Health Data Integration — Overview"
      subtitle={`All Rwanda health data sources | ${enabled.length} of ${src.length} enabled`}
      breadcrumb="Integration Home">

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-bg flex items-center justify-center">
              <Plug className="w-4 h-4 text-epi-muted" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Total Sources</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{src.length}</div>
          <p className="text-[11px] text-epi-muted mb-2">Configured data sources</p>
          <div className="space-y-1 text-[11px] font-medium mt-auto">
            <div className="text-epi-text">{count('active')} 🟢 Active</div>
            <div className="text-epi-text">{count('delayed') + count('partial')} 🟡 Delayed / partial</div>
            <div className="text-epi-text">{count('disconnected')} 🔴 Disconnected</div>
            {count('disabled') > 0 && <div className="text-epi-muted">{count('disabled')} ⚪ Disabled</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Records Today</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{fmtNumber(records)}</div>
          <p className="text-[11px] text-epi-muted mb-2">Records imported today</p>
          {state.pendingRecords > 0 &&
          <Link to="/processing" className="mt-auto text-[12px] font-bold text-epi hover:underline">
              {fmtNumber(state.pendingRecords)} awaiting processing →
            </Link>
          }
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-epi-accent" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Validation Pass Rate</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-2">{pass.toFixed(1)}%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div className="bg-epi-accent h-1.5 rounded-full" style={{ width: `${pass}%` }}></div>
          </div>
          <Link to="/integration/validation" className="mt-auto text-[12px] font-bold text-epi hover:underline">
            Review flagged records →
          </Link>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-red/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-epi-red" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Sync Failures / Partial</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{failures.length}</div>
          <p className="text-[11px] text-epi-muted mb-2">Recent runs that did not fully succeed</p>
          <div className="space-y-1 text-[11px] font-medium mt-auto mb-2">
            {failures.slice(0, 3).map((f) =>
            <div key={f.id} className="text-epi-text">
                {f.status === 'failed' ? '🔴' : '🟡'} {f.sourceName}
              </div>
            )}
          </div>
          <Link to="/integration/health" className="text-[12px] font-bold text-epi-red hover:underline text-left">
            View source health →
          </Link>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-bg flex items-center justify-center">
              <Clock className="w-4 h-4 text-epi-muted" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Data Freshness</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">
            {avgAge >= 120 ? `${(avgAge / 60).toFixed(1)} h` : `${avgAge} min`}
          </div>
          <p className="text-[11px] text-epi-muted mb-3">Average data age across enabled sources</p>
          <div className="mt-auto">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold mb-1 ${avgAge <= 180 ? 'bg-epi-accent/10 text-epi-accent' : 'bg-epi-amber/10 text-epi-amber'}`}>
              {avgAge <= 180 ? '🟢 Acceptable' : '🟡 Stale data'}
            </span>
            <p className="text-[11px] text-epi-muted">Target: under 3 hours</p>
          </div>
        </div>
      </div>

      {met?.status === 'disconnected' &&
      <div className="bg-epi-red border border-epi-red rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-sm text-white">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] font-bold mb-1">
                🔴 WARNING: Rwanda Meteorological Agency API disconnected since {fmtDateTime(met.lastSync)}.
              </h3>
              <p className="text-[13px] opacity-90">
                Weather and environmental data is missing from all dashboards and AI prediction models. Immediate
                reconnection required.
              </p>
            </div>
          </div>
          <button
          onClick={() => actions.reconnectSource('met')}
          disabled={met.syncing}
          className="px-4 py-2 bg-white text-epi-red text-[13px] font-bold rounded-md hover:bg-white/90 disabled:opacity-80 transition-colors shrink-0 shadow-sm flex items-center gap-2">

            {met.syncing && <Loader2 className="w-4 h-4 animate-spin" />}
            {met.syncing ? 'Reconnecting…' : 'Reconnect Weather API'}
          </button>
        </div>
      }

      {/* Row 2: Data Sources Status Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-epi-text">All Data Sources — Live Status</h2>
            <p className="text-[13px] text-epi-muted">Connection status and ingestion summary (simulated connectors)</p>
          </div>
          <button
            onClick={() => actions.syncAllSources()}
            className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 flex items-center gap-2">

            <RefreshCw className="w-4 h-4" /> Sync All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Source', 'Type', 'Connection', 'Status', 'Last Sync', 'Records Today', 'Data Quality', 'Actions'].map((h) =>
                <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {src.map((s) => {
                const down = s.status === 'disconnected';
                const warn = s.status === 'delayed' || s.status === 'partial';
                return (
                  <tr key={s.id} className={down ? 'bg-epi-red/10 hover:bg-epi-red/20' : warn ? 'bg-epi-amber/10 hover:bg-epi-amber/20' : 'hover:bg-epi-bg/50'}>
                    <td className="p-4 text-[14px] font-bold text-epi-text">
                      {down && <AlertTriangle className="w-4 h-4 text-epi-red inline mr-1" />}
                      {s.name}
                    </td>
                    <td className="p-4 text-[13px] text-epi-muted">{s.description}</td>
                    <td className="p-4 text-[13px] text-epi-text">{s.connection}</td>
                    <td className={`p-4 text-[13px] font-bold whitespace-nowrap ${STATUS_LABEL[s.status].cls}`}>
                      {s.syncing ? '⏳ Syncing…' : STATUS_LABEL[s.status].label}
                    </td>
                    <td className="p-4 text-[13px] text-epi-text whitespace-nowrap">{timeAgo(s.lastSync)}</td>
                    <td className="p-4 text-[13px] text-epi-text">{s.connection === 'Manual Upload' && !s.recordsToday ? 'Static data' : `${fmtNumber(s.recordsToday)} records`}</td>
                    <td className={`p-4 text-[13px] font-bold ${down ? 'text-epi-red' : s.quality < 90 ? 'text-[#F97316]' : 'text-epi-text'}`}>
                      {down ? '🔴 N/A' : `${s.quality >= 95 ? '🟢' : s.quality >= 90 ? '🟡' : '🟠'} ${s.quality.toFixed(1)}%`}
                    </td>
                    <td className="p-4 text-[13px] text-epi-text text-right whitespace-nowrap">
                      {down ?
                      <button onClick={() => actions.reconnectSource(s.id)} disabled={s.syncing} className="text-epi-red hover:underline font-bold">
                          Reconnect
                        </button> :
                      s.connection === 'Manual Upload' ?
                      <Link to={`/integration/upload?source=${s.id}`} className="text-epi hover:underline font-medium">
                          Upload New
                        </Link> :

                      <button onClick={() => actions.syncSource(s.id)} disabled={s.syncing || !s.enabled} className="text-epi hover:underline font-medium disabled:opacity-40">
                          Sync
                        </button>
                      }{' '}
                      ·{' '}
                      <Link to={`/integration/sources?edit=${s.id}`} className="text-epi hover:underline font-medium">
                        Configure
                      </Link>{' '}
                      ·{' '}
                      <button onClick={() => setLogFor(s)} className="text-epi hover:underline font-medium">
                        View Log
                      </button>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-[13px] text-epi-muted">Showing {src.length} of {src.length} sources</span>
          <Link to="/integration/sources" className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
            Manage Sources
          </Link>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">Daily Record Ingestion — All Sources (Last 7 Days)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} domain={[0, 12000]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="dhis2" stackId="a" fill="#104E49" name="DHIS2" />
                <Bar dataKey="emr" stackId="a" fill="#1D72B8" name="EMR" />
                <Bar dataKey="chw" stackId="a" fill="#00A550" name="CHW App" />
                <Bar dataKey="pharmacy" stackId="a" fill="#F59E0B" name="Pharmacy" />
                <Bar dataKey="other" stackId="a" fill="#6B7280" name="Others" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="avg" name="7-day moving avg" stroke="#F97316" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[12px] text-epi-muted mt-2">📉 A CHW App delay on June 4 caused ~1,800 fewer records. Today's bar updates as sources sync.</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">Source Health Scores</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827', fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: '#F4F6F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <ReferenceLine x={80} stroke="#6B7280" strokeDasharray="3 3" label={{ position: 'top', value: 'Min 80%', fill: '#6B7280', fontSize: 11 }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                  {healthData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Modal open={!!logFor} title={`${logFor?.name ?? ''} — sync log`} onClose={() => setLogFor(null)} width="max-w-[640px]">
        {(() => {
          const rows = logFor ? state.syncLog.filter((l) => l.sourceId === logFor.id) : [];
          return rows.length === 0 ?
          <div className="text-[13px] text-epi-muted">No runs recorded for this source yet.</div> :

          <ul className="divide-y divide-border text-[13px]">
              {rows.map((r) =>
            <li key={r.id} className="py-2 flex flex-wrap justify-between gap-3">
                  <span className="whitespace-nowrap">{fmtDateTime(r.at)}</span>
                  <span className={`font-bold ${r.status === 'failed' ? 'text-epi-red' : r.status === 'partial' ? 'text-epi-amber' : 'text-[#00A550]'}`}>{r.status}</span>
                  <span className="text-epi-muted flex-1 min-w-[200px]">{r.message}</span>
                </li>
            )}
            </ul>;

        })()}
      </Modal>
    </IntegrationLayout>);

}
