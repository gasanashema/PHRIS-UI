import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import {
  Settings,
  CheckCircle2,
  Database,
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
  ArrowUpRight,
  ArrowRight,
  Wand2,
  Calculator,
  Map as MapIcon,
  BrainCircuit,
  Clock,
  Play,
  Loader2 } from
'lucide-react';
import { useApp } from '../../store/AppStore';
import { PIPELINE_STAGES } from '../../data/seed';
import { fmtDateTime, fmtNumber, fmtTime, timeAgo } from '../../lib/format';

const STAGE_ICONS = [Database, Wand2, Calculator, MapIcon, BrainCircuit, BrainCircuit];

export function ProcessingHome() {
  const { state, actions } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  useEffect(() => {
    if (params.get('q') !== null) setQ(params.get('q') ?? '');
  }, [params]);

  const p = state.pipeline;
  const running = p.status === 'running';
  const jobs = state.jobs.filter((j) => !q || `${j.name} ${j.detail ?? ''} ${j.status}`.toLowerCase().includes(q.toLowerCase()));
  const failed = state.jobs.filter((j) => j.status === 'failed');
  const liveSources = state.sources.filter((s) => s.enabled && s.status !== 'disconnected').length;
  const met = state.sources.find((s) => s.id === 'met');
  const metFailed = failed.find((j) => j.name === 'Met Agency Import');
  const chwFailed = failed.find((j) => j.name === 'Data Cleaning' && j.detail?.includes('Kinyarwanda'));

  const stageState = (i: number): 'done' | 'running' | 'waiting' => {
    if (!running) return 'done';
    if (i < p.stageIndex) return 'done';
    if (i === p.stageIndex) return 'running';
    return 'waiting';
  };

  return (
    <ProcessingLayout
      title="Data Processing Overview"
      subtitle={`Rwanda National Health Data Pipeline | Last run: ${fmtDateTime(p.lastRunAt)} (${timeAgo(p.lastRunAt)})`}
      breadcrumb="Processing Overview">

      {/* Pending data banner */}
      {p.staleSources && !running &&
      <div className="bg-epi-amber/10 border border-epi-amber/30 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-[14px] text-epi-text">
            <span className="font-bold">{fmtNumber(state.pendingRecords)} new records</span> have arrived from data
            sources since the last run. Run the pipeline to make them available to the AI model.
          </div>
          <button
          onClick={actions.runPipeline}
          className="h-10 px-4 bg-epi hover:bg-epi-dark text-white text-[13px] font-bold rounded-md flex items-center gap-2 shrink-0">

            <Play className="w-4 h-4" /> Process new data
          </button>
        </div>
      }

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-bg flex items-center justify-center">
              <Settings className={`w-4 h-4 text-epi ${running ? 'animate-spin' : ''}`} />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Pipeline Status</h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">{running ? 'Running' : 'Idle'}</div>
          <p className="text-[11px] text-epi-muted mb-2">
            {running ? `Stage ${p.stageIndex + 1} of ${PIPELINE_STAGES.length}: ${PIPELINE_STAGES[p.stageIndex].label}` : 'Ready for next run'}
          </p>
          <div className="mt-auto">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${running ? 'bg-epi-amber/10 text-epi-amber' : 'bg-[#00A550]/10 text-[#00A550]'}`}>
              {running ? '🟡 Processing' : '🟢 Healthy'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#00A550]" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Last Successful Run</h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">{timeAgo(p.lastRunAt)} — {fmtTime(p.lastRunAt)}</div>
          <p className="text-[11px] text-epi-muted mb-2 font-mono">{p.lastBatchId}</p>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Records Processed</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{fmtNumber(p.recordsProcessed)}</div>
          <p className="text-[11px] text-epi-muted mb-2">Across {liveSources} live sources and 30 districts</p>
          {state.pendingRecords > 0 &&
          <div className="mt-auto">
              <span className="text-[12px] font-bold text-epi flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{fmtNumber(state.pendingRecords)} waiting
              </span>
            </div>
          }
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Data Quality Score</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-2">{p.qualityScore}%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div className="bg-epi h-1.5 rounded-full" style={{ width: `${p.qualityScore}%` }}></div>
          </div>
          <Link to="/processing/quality" className="mt-auto text-[11px] font-bold text-epi hover:underline">
            View by district →
          </Link>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-red/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-epi-red" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Failed Jobs</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{failed.length}</div>
          <p className="text-[11px] text-epi-muted mb-2">{failed.map((j) => j.name).join(' · ') || 'None'}</p>
          {failed.length > 0 &&
          <div className="mt-auto">
              <span className="text-[11px] font-bold text-epi-red">🔴 Needs attention</span>
            </div>
          }
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-amber/10 flex items-center justify-center">
              <CalendarClock className="w-4 h-4 text-epi-amber" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Next Scheduled Run</h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">15:00 today</div>
          <p className="text-[11px] text-epi-muted mb-2">Data cleaning + metric recalculation</p>
          <Link to="/processing/scheduler" className="mt-auto text-[11px] font-bold text-epi hover:underline">
            Manage schedule →
          </Link>
        </div>
      </div>

      {/* Row 2: Pipeline Flow */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h2 className="text-[16px] font-bold text-epi-text mb-1">National Data Processing Pipeline — Live Status</h2>
            <p className="text-[13px] text-epi-muted">Raw data in → Clean, calculated, AI-ready data out</p>
          </div>
          <button
            onClick={actions.runPipeline}
            disabled={running}
            className="h-10 px-4 bg-epi hover:bg-epi-dark disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-md flex items-center gap-2">

            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? 'Pipeline running…' : 'Run Pipeline Now'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {PIPELINE_STAGES.map((stage, i) => {
            const st = stageState(i);
            const Icon = STAGE_ICONS[i];
            return (
              <div
                key={stage.key}
                className={`rounded-lg p-4 border-2 relative transition-colors ${st === 'running' ? 'border-epi-amber bg-epi-amber/5' : st === 'done' ? 'border-epi bg-white' : 'border-border bg-epi-bg opacity-70'}`}>

                <div className={`text-[11px] font-bold mb-2 flex items-center gap-1 uppercase ${st === 'running' ? 'text-epi-amber' : st === 'done' ? 'text-epi' : 'text-epi-muted'}`}>
                  <Icon className="w-3.5 h-3.5" /> {stage.label}
                </div>
                <div className="text-[11px] text-epi-muted leading-tight mb-3 min-h-[28px]">
                  {i === 0 ? `${liveSources} sources · ${fmtNumber(p.recordsProcessed)} records` : stage.desc}
                </div>
                {st === 'running' &&
                <>
                    <div className="text-[11px] font-bold text-epi-amber mb-1 flex items-center gap-1">
                      <Settings className="w-3 h-3 animate-spin" /> Running {p.progress}%
                    </div>
                    <div className="w-full bg-epi-bg rounded-full h-1.5">
                      <div className="bg-epi-amber h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </>
                }
                {st === 'done' &&
                <div className="text-[11px] font-bold text-[#00A550]">
                    {i === PIPELINE_STAGES.length - 1 ? `🟢 Published ${p.lastBatchId}` : '🟢 Complete'}
                  </div>
                }
                {st === 'waiting' &&
                <div className="text-[11px] font-bold text-epi-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ⏳ Waiting
                  </div>
                }
                {i < PIPELINE_STAGES.length - 1 &&
                <ArrowRight className={`hidden xl:block absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${st === 'done' ? 'text-epi' : 'text-border'}`} />
                }
              </div>);

          })}
        </div>
        {!running && !p.staleSources &&
        <div className="mt-5 text-[13px] text-epi-text flex flex-wrap items-center gap-2">
            ✅ Latest batch <span className="font-mono font-bold">{p.lastBatchId}</span> is ready for the AI model.
            <Link to="/prediction" className="font-bold text-epi hover:underline">Run a prediction →</Link>
          </div>
        }
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[16px] font-bold text-epi-text">Processing Job History</h2>
            {q &&
            <button
              onClick={() => {
                setQ('');
                setParams({});
              }}
              className="text-[12px] font-bold text-epi hover:underline">

                Clear filter “{q}” ✕
              </button>
            }
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  {['Time', 'Job Name', 'Duration', 'Records', 'Status', 'Details'].map((h) =>
                  <th key={h} className={`p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'Details' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.length === 0 &&
                <tr>
                    <td colSpan={6} className="p-6 text-center text-[13px] text-epi-muted">No jobs match “{q}”.</td>
                  </tr>
                }
                {jobs.slice(0, 12).map((j) =>
                <tr key={j.id} className={j.status === 'failed' ? 'bg-epi-red/5 hover:bg-epi-red/10' : 'hover:bg-epi-bg/50'}>
                    <td className="p-3 text-[13px] text-epi-text whitespace-nowrap">{fmtDateTime(j.at)}</td>
                    <td className="p-3 text-[13px] font-bold text-epi-text">{j.name}</td>
                    <td className="p-3 text-[13px] text-epi-text">{j.duration}</td>
                    <td className="p-3 text-[13px] text-epi-text">{fmtNumber(j.records)} records</td>
                    <td className={`p-3 text-[13px] font-bold ${j.status === 'failed' ? 'text-epi-red' : j.status === 'running' ? 'text-epi-amber' : 'text-[#00A550]'}`}>
                      {j.status === 'failed' ? '🔴 Failed' : j.status === 'running' ? '⏳ Retrying…' : '✅ Success'}
                    </td>
                    <td className="p-3 text-[13px] text-right">
                      {j.status === 'failed' ?
                    <button onClick={() => actions.retryJob(j.id)} className="text-epi-red font-bold hover:underline">
                          Retry
                        </button> :

                    <span className="text-epi-muted text-[12px]">{j.detail ?? '—'}</span>
                    }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-epi-text flex items-center gap-2">⚠️ Jobs Requiring Attention</h2>
          {!metFailed && !chwFailed &&
          <div className="bg-white rounded-lg p-5 shadow-card border border-border text-[13px] text-epi-muted">
              ✅ No failed jobs — everything is running normally.
            </div>
          }

          {metFailed &&
          <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-red flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[12px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">🔴 FAILED JOB</span>
                <h3 className="text-[14px] font-bold text-epi-text">Rwanda Met Agency Import</h3>
              </div>
              <div className="text-[12px] text-epi-muted mb-3">Failed at: {fmtDateTime(metFailed.at)}</div>
              <div className="bg-epi-bg p-3 rounded border border-border mb-3 text-[13px]">
                <span className="font-bold text-epi-text">Error:</span> "{met?.error ?? 'Source API unreachable'}"
              </div>
              <div className="bg-epi-red/10 p-3 rounded border border-epi-red/20 mb-4 text-[13px] text-epi-red font-medium">
                <span className="font-bold">Impact:</span> Environmental risk features missing from AI predictions.
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                <button onClick={() => actions.retryJob(metFailed.id)} className="flex-1 py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">
                  Retry Now
                </button>
                <Link to="/integration/sources" className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors text-center">
                  Fix Source
                </Link>
                <button
                onClick={() =>
                actions.sendNotification(
                  {
                    title: 'Processing: Met Agency import failing',
                    body: 'The weather import job keeps failing because the source is offline. Please renew the API certificate.',
                    severity: 'orange',
                    link: '/integration/sources',
                    roles: ['admin', 'integration']
                  },
                  { module: 'Processing', action: 'Alerted administrator about failed job' }
                )
                }
                className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">

                  Alert Admin
                </button>
              </div>
            </div>
          }

          {chwFailed &&
          <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-amber flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[12px] font-bold bg-epi-amber text-white px-2 py-0.5 rounded">🟠 PARTIAL FAILURE</span>
                <h3 className="text-[14px] font-bold text-epi-text">Nyamagabe CHW Batch Processing</h3>
              </div>
              <div className="text-[12px] text-epi-muted mb-3">Failed at: {fmtDateTime(chwFailed.at)}</div>
              <div className="bg-epi-bg p-3 rounded border border-border mb-3 text-[13px]">
                <span className="font-bold text-epi-text">Error:</span> "Kinyarwanda disease name mapping failed — 3 unknown terms in batch"
              </div>
              <div className="bg-epi-amber/10 p-3 rounded border border-epi-amber/20 mb-3 text-[13px] text-[#F97316] font-medium">
                <span className="font-bold">Impact:</span> 47 CHW records from Nyamagabe excluded from today's processing
              </div>
              <div className="text-[12px] text-epi-muted mb-4">
                <span className="font-bold text-epi-text">Unknown terms:</span> "Indwara y'umubabaro" · "Agahinda k'inda" · "Inkorora mbi"
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                <Link to="/integration/mapping" className="flex-1 py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors text-center">
                  Map Terms Now
                </Link>
                <button onClick={() => actions.retryJob(chwFailed.id)} className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
                  Exclude & Continue
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </ProcessingLayout>);

}
