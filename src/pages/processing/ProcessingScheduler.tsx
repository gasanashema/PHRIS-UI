import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import { Modal, FieldLabel, inputCls, btnPrimary, btnSecondary } from '../../components/shared/Modal';
import { useApp } from '../../store/AppStore';
import { PIPELINE_STAGES } from '../../data/seed';
import { demoNow, fmtDate, fmtTime, nowISO } from '../../lib/format';

interface JobDef {
  name: string;
  frequency: string;
  duration: string;
  pipeline: boolean; // part of the main processing pipeline
  next: string;
}

const INITIAL: JobDef[] = [
{ name: 'Data Cleaning', frequency: 'Every 2 hours', duration: '~15 min', pipeline: true, next: '15:00' },
{ name: 'Metric Calculation', frequency: 'Every 2 hours', duration: '~20 min', pipeline: true, next: '15:00' },
{ name: 'Feature Engineering', frequency: 'Every 6 hours', duration: '~45 min', pipeline: true, next: '19:00' },
{ name: 'Trend Analysis', frequency: 'Daily — 07:00', duration: '~30 min', pipeline: false, next: 'Tomorrow 07:00' },
{ name: 'Geographic Aggregation', frequency: 'Daily — 07:00', duration: '~25 min', pipeline: true, next: 'Tomorrow 07:00' },
{ name: 'Temporal Aggregation', frequency: 'Daily — 07:30', duration: '~20 min', pipeline: false, next: 'Tomorrow 07:30' },
{ name: 'Age Standardization', frequency: 'Weekly — Monday', duration: '~40 min', pipeline: false, next: 'Next Monday' },
{ name: 'Met Agency Import', frequency: 'Every 3 hours', duration: '~5 min', pipeline: false, next: 'Retry manually' }];


const FREQS = ['Every 1 hour', 'Every 2 hours', 'Every 3 hours', 'Every 6 hours', 'Daily — 07:00', 'Daily — 07:30', 'Weekly — Monday'];

const TIMELINE = [
{ h: 3, label: 'Full backup' },
{ h: 7, label: 'Trend + Geo' },
{ h: 10, label: 'Features' },
{ h: 13, label: 'Clean + Metrics' },
{ h: 15, label: 'Clean + Metrics' },
{ h: 17, label: 'Features' },
{ h: 19, label: 'Features' }];


export function ProcessingScheduler() {
  const { state, actions } = useApp();
  const [defs, setDefs] = useState<JobDef[]>(INITIAL);
  const [editing, setEditing] = useState<{mode: 'new' | 'edit';index?: number;name: string;frequency: string;} | null>(null);
  const running = state.pipeline.status === 'running';
  const now = demoNow();
  const nowPct = (now.getHours() * 60 + now.getMinutes()) / 1440 * 100;

  const latest = (name: string) => state.jobs.find((j) => j.name === name);
  const stageRunning = (name: string) =>
  running && (
  name === 'Data Cleaning' && state.pipeline.stageIndex === 1 ||
  name === 'Metric Calculation' && state.pipeline.stageIndex === 2 ||
  name === 'Geographic Aggregation' && state.pipeline.stageIndex === 3 ||
  name === 'Feature Engineering' && state.pipeline.stageIndex === 4);

  const save = () => {
    if (!editing || !editing.name.trim()) return;
    if (editing.mode === 'new') {
      setDefs([...defs, { name: editing.name.trim(), frequency: editing.frequency, duration: '—', pipeline: false, next: 'Scheduled' }]);
      actions.logAdminEvent('Processing', `Added processing job — ${editing.name.trim()}`, editing.frequency);
      actions.toast(`Job “${editing.name.trim()}” scheduled ${editing.frequency.toLowerCase()}.`);
    } else {
      setDefs(defs.map((d, i) => i === editing.index ? { ...d, frequency: editing.frequency } : d));
      actions.logAdminEvent('Processing', `Changed job schedule — ${editing.name}`, editing.frequency);
      actions.toast(`${editing.name} now runs ${editing.frequency.toLowerCase()}.`);
    }
    setEditing(null);
  };

  return (
    <ProcessingLayout
      title="Processing Job Scheduler"
      subtitle="Automated data processing pipeline — Rwanda national health data"
      breadcrumb="Job Scheduler">

      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-8 overflow-x-auto">
        <h2 className="text-[16px] font-bold text-epi-text mb-6">Today's Processing Schedule — {fmtDate(nowISO())}</h2>
        <div className="relative pt-8 pb-16 min-w-[640px]">
          <div className="absolute left-0 right-0 top-10 h-1 bg-epi-bg rounded-full"></div>
          <div className="flex justify-between text-[11px] font-bold text-epi-muted absolute left-0 right-0 top-0">
            {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t) => <span key={t}>{t}</span>)}
          </div>
          {TIMELINE.map((t) => {
            const done = t.h * 60 < now.getHours() * 60 + now.getMinutes();
            return (
              <div
                key={`${t.h}-${t.label}`}
                className={`absolute top-8 w-3 h-5 rounded-full z-10 ${done ? 'bg-epi' : 'bg-epi-bg border-2 border-epi'}`}
                style={{ left: `${t.h / 24 * 100}%` }}>

                <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-center ${done ? 'text-epi' : 'text-epi-muted'}`}>
                  {String(t.h).padStart(2, '0')}:00
                  <br />
                  {t.label} {done ? '✅' : '🔄'}
                </div>
              </div>);

          })}
          <div className="absolute top-4 bottom-0 w-px border-l-2 border-dashed border-epi-amber z-0" style={{ left: `${nowPct}%` }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold text-epi-amber whitespace-nowrap bg-white px-1">
              📍 Now — {fmtTime(nowISO())}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold text-epi-text">All Processing Jobs</h2>
          <div className="flex gap-3">
            <button
              onClick={actions.runPipeline}
              disabled={running}
              className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg disabled:opacity-60 transition-colors flex items-center gap-2">

              {running && <Loader2 className="w-4 h-4 animate-spin" />}
              {running ? `Running — ${PIPELINE_STAGES[state.pipeline.stageIndex].label}` : 'Run All Jobs Now'}
            </button>
            <button
              onClick={() => setEditing({ mode: 'new', name: '', frequency: FREQS[1] })}
              className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">

              Add New Job
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['Job Name', 'Frequency', 'Duration', 'Last Run', 'Status', 'Next Run', 'Actions'].map((h) =>
                <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {defs.map((d, i) => {
                const job = latest(d.name);
                const isRunning = stageRunning(d.name) || job?.status === 'running';
                const failed = !isRunning && job?.status === 'failed';
                return (
                  <tr key={d.name} className={failed ? 'bg-epi-red/5 hover:bg-epi-red/10' : 'hover:bg-epi-bg/50'}>
                    <td className="p-4 text-[14px] font-bold text-epi-text">{d.name}</td>
                    <td className="p-4 text-[13px] text-epi-text">{d.frequency}</td>
                    <td className="p-4 text-[13px] text-epi-muted">{job?.duration && job.duration !== '—' ? job.duration : d.duration}</td>
                    <td className="p-4 text-[13px] text-epi-text whitespace-nowrap">
                      {job ? `${fmtTime(job.at)} ${job.status === 'failed' ? '🔴' : '✅'}` : '—'}
                    </td>
                    <td className={`p-4 text-[13px] font-bold whitespace-nowrap ${failed ? 'text-epi-red' : isRunning ? 'text-epi-amber' : 'text-[#00A550]'}`}>
                      {isRunning ? '🟡 Running' : failed ? '🔴 Failed' : job ? '🟢 Success' : '⚪ Not run yet'}
                    </td>
                    <td className="p-4 text-[13px] text-epi-text whitespace-nowrap">{failed ? 'Retry manually' : d.next}</td>
                    <td className="p-4 text-[13px] text-epi font-medium text-right whitespace-nowrap">
                      {failed && job ?
                      <>
                          <button onClick={() => actions.retryJob(job.id)} className="hover:underline">Retry</button> ·{' '}
                          {d.name === 'Met Agency Import' ?
                        <Link to="/integration/sources" className="hover:underline">Fix</Link> :

                        <Link to="/integration/mapping" className="hover:underline">Fix</Link>
                        }
                        </> :
                      isRunning ?
                      <Link to="/processing" className="hover:underline">View Progress</Link> :

                      <>
                          <button onClick={() => setEditing({ mode: 'edit', index: i, name: d.name, frequency: d.frequency })} className="hover:underline">Edit</button>
                          {d.pipeline &&
                        <>
                              {' · '}
                              <button onClick={actions.runPipeline} disabled={running} className="hover:underline disabled:opacity-40">Run Now</button>
                            </>
                        }
                        </>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border text-[12px] text-epi-muted">
          Cleaning, metrics, aggregation and feature engineering run together as one pipeline; “Run Now” starts the full pipeline.
        </div>
      </div>

      <Modal
        open={!!editing}
        title={editing?.mode === 'new' ? 'Add processing job' : `Edit schedule — ${editing?.name}`}
        onClose={() => setEditing(null)}
        footer={
        <>
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} disabled={!editing?.name.trim()} onClick={save}>Save</button>
          </>
        }>

        {editing &&
        <div className="space-y-4">
            {editing.mode === 'new' &&
          <div>
                <FieldLabel>Job name</FieldLabel>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Nutrition indicator refresh" className={inputCls} />
              </div>
          }
            <div>
              <FieldLabel>Frequency</FieldLabel>
              <select value={editing.frequency} onChange={(e) => setEditing({ ...editing, frequency: e.target.value })} className={inputCls}>
                {Array.from(new Set([editing.frequency, ...FREQS])).map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
        }
      </Modal>
    </ProcessingLayout>);

}
