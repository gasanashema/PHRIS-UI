import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { RefreshCw, CheckCircle2, Loader2, Clock, AlertCircle, AlertTriangle, PauseCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
'recharts';
import { useApp } from '../../store/AppStore';
import { fmtNumber, fmtTime, timeAgo } from '../../lib/format';
import type { DataSource, PipelineState } from '../../types';

const throughputData = [
{ time: '00:00', actual: 200, expected: 200 },
{ time: '02:00', actual: 250, expected: 250 },
{ time: '04:00', actual: 220, expected: 220 },
{ time: '06:00', actual: 300, expected: 300 },
{ time: '07:00', actual: 150, expected: 400 },
{ time: '08:00', actual: 1200, expected: 500 },
{ time: '10:00', actual: 400, expected: 400 },
{ time: '12:00', actual: 450, expected: 450 },
{ time: '13:00', actual: 500, expected: 500 }];


type StageState = 'ok' | 'running' | 'waiting' | 'warn' | 'failed' | 'paused';
interface Stage {state: StageState;label: string;progress?: number;}

// Derive per-stage status for a source from its connection state and the processing pipeline
function stagesFor(s: DataSource, p: PipelineState): Stage[] {
  if (!s.enabled) return Array(5).fill({ state: 'paused', label: 'disabled' });
  if (s.status === 'disconnected')
  return [
  { state: 'failed', label: `FAILED — ${s.error?.split(' — ')[1] ?? 'unreachable'}` },
  { state: 'failed', label: 'skipped' },
  { state: 'failed', label: 'skipped' },
  { state: 'failed', label: 'skipped' },
  { state: 'failed', label: 'NO DATA' }];

  if (s.syncing)
  return [
  { state: 'running', label: 'syncing…' },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'pending' }];

  if (s.status === 'delayed')
  return [
  { state: 'failed', label: `delayed — last ${fmtTime(s.lastSync)}` },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'stale data' }];

  const collected: Stage = {
    state: 'ok',
    label: s.recordsToday ? `${fmtNumber(s.recordsToday)} records` : `static file, ${timeAgo(s.lastSync)}`
  };
  const flagged = Math.round(s.recordsToday * (100 - s.quality) / 100);
  const validation: Stage =
  s.status === 'partial' ?
  { state: 'warn', label: `${fmtNumber(flagged)} warnings` } :
  { state: 'ok', label: flagged ? `${fmtNumber(s.recordsToday - flagged)} passed, ${flagged} flagged` : '100% passed' };
  const newSinceRun = s.lastSync > p.lastRunAt;
  if (p.status === 'running') {
    const stageIdx = p.stageIndex; // 0 ingest … 5 model
    return [
    collected,
    validation,
    stageIdx <= 3 ? { state: 'running', label: 'processing', progress: p.progress } : { state: 'ok', label: 'standardized' },
    stageIdx <= 4 ? { state: 'waiting', label: 'waiting' } : { state: 'running', label: 'committing', progress: p.progress },
    { state: 'waiting', label: 'pending' }];

  }
  if (newSinceRun)
  return [
  collected,
  validation,
  { state: 'waiting', label: 'queued for next run' },
  { state: 'waiting', label: 'waiting' },
  { state: 'waiting', label: 'previous batch in use' }];

  return [
  collected,
  validation,
  { state: 'ok', label: 'standardized' },
  { state: 'ok', label: 'committed' },
  { state: s.status === 'partial' ? 'warn' : 'ok', label: s.status === 'partial' ? 'partial' : 'ready for use' }];

}

function StageCell({ stage }: {stage: Stage;}) {
  const icon = {
    ok: <CheckCircle2 className="w-5 h-5 text-[#00A550]" />,
    running: <Loader2 className="w-5 h-5 text-epi animate-spin" />,
    waiting: <Clock className="w-5 h-5 text-epi-muted" />,
    warn: <AlertTriangle className="w-5 h-5 text-epi-amber" />,
    failed: <AlertCircle className="w-5 h-5 text-epi-red" />,
    paused: <PauseCircle className="w-5 h-5 text-epi-muted" />
  }[stage.state];
  const text =
  stage.state === 'failed' ? 'text-epi-red font-medium' : stage.state === 'warn' ? 'text-epi-amber font-medium' : 'text-epi-muted';
  return (
    <td className="p-4 text-center">
      <div className="flex flex-col items-center gap-1">
        {icon}
        {stage.progress !== undefined ?
        <div className="w-16 h-1.5 bg-epi-bg rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-epi transition-all" style={{ width: `${stage.progress}%` }}></div>
          </div> :

        <span className={`text-[11px] ${text}`}>{stage.label}</span>
        }
      </div>
    </td>);

}

export function IntegrationPipeline() {
  const { state } = useApp();
  const [source, setSource] = useState('all');
  const [status, setStatus] = useState('all');
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);

  const rows = state.sources.
  map((s) => ({ s, stages: stagesFor(s, state.pipeline) })).
  filter(({ s }) => source === 'all' || s.id === source).
  filter(({ stages }) => {
    if (status === 'all') return true;
    if (status === 'running') return stages.some((x) => x.state === 'running' || x.state === 'waiting');
    if (status === 'failed') return stages.some((x) => x.state === 'failed' || x.state === 'warn');
    return stages.every((x) => x.state === 'ok');
  });

  const failures = state.syncLog.filter((l) => l.status !== 'success');
  const errorData = [
  { name: 'Connection failures', value: failures.filter((f) => f.status === 'failed').length + 7, color: '#D32F2F' },
  { name: 'Validation rejections', value: 12, color: '#F59E0B' },
  { name: 'Partial syncs', value: failures.filter((f) => f.status === 'partial').length + 3, color: '#F97316' },
  { name: 'Timeout errors', value: 6, color: '#EAB308' }];

  const totalErrors = errorData.reduce((a, e) => a + e.value, 0);
  const needAction = state.sources.filter((s) => s.status === 'disconnected' || s.status === 'delayed').length;

  const selectCls = 'text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm';

  return (
    <IntegrationLayout
      title="Data Pipeline Dashboard"
      subtitle="Real-time view of data flow through all processing stages"
      breadcrumb="Pipeline Dashboard">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select value={source} onChange={(e) => setSource(e.target.value)} className={selectCls} aria-label="Source">
            <option value="all">All Sources</option>
            {state.sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Status">
            <option value="all">Status: All</option>
            <option value="running">In progress / waiting</option>
            <option value="failed">Failed / warnings</option>
            <option value="complete">Complete</option>
          </select>
          {state.pipeline.status === 'running' &&
          <span className="text-[12px] font-bold text-epi flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing run in progress
            </span>
          }
        </div>
        <button
          onClick={() => setRefreshedAt(new Date().toLocaleTimeString())}
          className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-epi border border-epi rounded-md hover:bg-epi/5 transition-colors bg-white">

          <RefreshCw className="w-4 h-4" />
          Refresh {refreshedAt && <span className="text-epi-muted font-normal ml-1">(updated {refreshedAt})</span>}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-6">
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[16px] font-bold text-epi-text">Live Pipeline Status — {source === 'all' ? 'All Sources' : state.sources.find((s) => s.id === source)?.name}</h2>
          <span className="text-[12px] text-epi-muted">Latest processed batch: <span className="font-mono font-bold">{state.pipeline.lastBatchId}</span></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Source', 'Collection', 'Validation', 'Processing', 'Storage', 'Available'].map((h, i) =>
                <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${i ? 'text-center' : 'w-48'}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 &&
              <tr>
                  <td colSpan={6} className="p-6 text-center text-[13px] text-epi-muted">No sources match these filters.</td>
                </tr>
              }
              {rows.map(({ s, stages }) => {
                const bad = stages.some((x) => x.state === 'failed');
                const warn = stages.some((x) => x.state === 'warn');
                return (
                  <tr key={s.id} className={bad ? 'bg-epi-red/10' : warn ? 'bg-epi-amber/10' : 'hover:bg-epi-bg/50'}>
                    <td className="p-4">
                      <div className="text-[14px] font-bold text-epi-text">{s.name}</div>
                      {s.status === 'disconnected' &&
                      <Link to="/integration/sources" className="text-[11px] font-bold text-epi-red mt-1 hover:underline block">
                          🔴 Source offline — reconnect →
                        </Link>
                      }
                    </td>
                    {stages.map((st, i) => <StageCell key={i} stage={st} />)}
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">Records Processed Per Hour</h2>
          <div className="h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} domain={[0, 1500]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="actual" name="Actual Throughput" stroke="#104E49" strokeWidth={3} dot={{ r: 4, fill: '#104E49', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expected" name="Expected Baseline" stroke="#F97316" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[12px] text-epi-muted">📉 The 07:00 dip is the CHW App delay; the 08:00 spike is the DHIS2 + EMR batch sync.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-2">Pipeline Errors — Last 24 Hours</h2>
          <div className="flex-1 flex items-center justify-center relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={errorData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {errorData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[16px] font-bold text-epi-text">{totalErrors}</span>
              <span className="text-[11px] text-epi-muted">total errors</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4 px-4">
            {errorData.map((err) =>
            <div key={err.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: err.color }}></div>
                <span className="text-[12px] text-epi-text">{err.name} ({err.value})</span>
              </div>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
            <div className="text-[12px] font-medium text-epi-text">
              <div className="mb-1">{totalErrors - needAction} auto-resolved ✅</div>
              <div className={needAction ? 'text-epi-red font-bold' : 'text-[#00A550] font-bold'}>
                {needAction ? `${needAction} source${needAction > 1 ? 's' : ''} require admin action 🔴` : 'No sources need action'}
              </div>
            </div>
            <Link to="/integration/health" className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
              View All Errors
            </Link>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}
