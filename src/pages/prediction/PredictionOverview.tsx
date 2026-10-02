import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import {
  MapPin,
  BrainCircuit,
  Target,
  Sparkles,
  Microscope,
  RefreshCw,
  ArrowUpRight,
  ArrowRight,
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle2 } from
'lucide-react';
import { SeverityBadge, SimulatedTag } from '../../components/shared/Badges';
import { severityForSignal, useApp } from '../../store/AppStore';
import { fmtDateTime, isOpenStatus, timeAgo } from '../../lib/format';
import type { DistrictRisk } from '../../types';

const HORIZONS = ['Next 7 days', 'Next 14 days', 'Next 28 days'];
const SCOPES = ['All priority diseases', 'Cholera', 'Malaria', 'Diarrheal Disease', 'Typhoid', 'Measles'];
const RUN_STEPS = [
'Loading processed batch',
'Joining weather & population features',
'Scoring 30 districts × 8 diseases',
'Applying alert thresholds'];


const bandColor = (s: number) =>
s >= 80 ? 'bg-epi-red' : s >= 60 ? 'bg-[#F97316]' : s >= 40 ? 'bg-epi-amber' : 'bg-[#00A550]';
const textColor = (s: number) =>
s >= 80 ? 'text-epi-red' : s >= 60 ? 'text-[#F97316]' : s >= 40 ? 'text-epi-amber' : 'text-[#00A550]';
const emoji = (s: number) => s >= 80 ? '🔴' : s >= 60 ? '🟠' : s >= 40 ? '🟡' : '🟢';

export function PredictionOverview() {
  const { state, actions } = useApp();
  const [horizon, setHorizon] = useState('Next 14 days');
  const [scope, setScope] = useState('All priority diseases');
  const [step, setStep] = useState(0);

  const running = state.predictionRuns.find((r) => r.status === 'running');
  const last = state.predictionRuns.find((r) => r.status === 'complete');
  const met = state.sources.find((s) => s.id === 'met');
  const envOk = met?.status === 'active' && met.enabled;
  const stale = state.pipeline.staleSources;
  const pipelineRunning = state.pipeline.status === 'running';

  // Animate progress steps while the simulated run is in flight
  useEffect(() => {
    if (!running) {
      setStep(0);
      return;
    }
    const t = window.setInterval(() => setStep((s) => Math.min(RUN_STEPS.length - 1, s + 1)), 800);
    return () => window.clearInterval(t);
  }, [running]);

  const risk = [...state.districtRisk].sort((a, b) => b.score - a.score);
  const high = risk.filter((r) => r.score >= 60);
  const moderate = risk.filter((r) => r.score >= 40 && r.score < 60);
  const low = risk.filter((r) => r.score < 40).slice(-3).reverse();
  const openFor = (r: DistrictRisk) =>
  state.alerts.find((a) => a.district === r.district && isOpenStatus(a.status));

  const Row = ({ r }: {r: DistrictRisk;}) => {
    const alert = openFor(r);
    return (
      <tr className="hover:bg-epi-bg/50">
        <td className="p-3 text-[13px] font-bold text-epi-text">{r.district}</td>
        <td className="p-3 text-[13px] text-epi-text">{r.province}</td>
        <td className="p-3 text-[13px] text-epi-text">{r.score < 25 ? <span className="text-epi-muted italic">None</span> : r.disease}</td>
        <td className={`p-3 text-[13px] font-bold ${textColor(r.score)}`}>{r.score}/100</td>
        <td className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
              <div className={`h-full ${bandColor(r.score)}`} style={{ width: `${r.score}%` }}></div>
            </div>
            <span className="text-[10px]">{emoji(r.score)}</span>
          </div>
        </td>
        <td className={`p-3 text-[13px] font-bold text-center ${r.trend === 'up' ? textColor(r.score) : r.trend === 'down' ? 'text-[#00A550]' : 'text-epi-muted'}`}>
          {r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→'}
        </td>
        <td className="p-3 text-[13px] text-right">
          {alert ?
          <Link to={`/warning/detail?id=${alert.id}`} className="text-epi font-medium hover:underline">
              {alert.status === 'active' ? 'Respond' : 'View alert'}
            </Link> :
          r.score >= 40 ?
          <Link to="/prediction/disease" className="text-epi font-medium hover:underline">Monitor</Link> :

          <span className="text-epi-muted">Routine</span>
          }
        </td>
      </tr>);

  };

  return (
    <PredictionLayout
      title="AI Risk Prediction Overview"
      subtitle={`Rwanda — All 30 Districts | Last prediction run: ${last ? `${fmtDateTime(last.at)} (${timeAgo(last.at)})` : '—'}`}
      breadcrumb="Prediction Overview">

      {/* Run prediction */}
      <div className="bg-white rounded-lg shadow-card border-2 border-epi p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-bold text-epi-text flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-epi" /> Run a risk prediction
            </h2>
            <p className="text-[13px] text-epi-muted">
              Scores every district using the latest processed data batch, then raises alerts where thresholds are crossed.
            </p>
          </div>
          <SimulatedTag>Simulated model</SimulatedTag>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1.5">Input data</label>
            <div className="h-10 px-3 border border-border rounded-md bg-epi-bg flex items-center text-[13px] font-mono font-bold text-epi-text">
              {state.pipeline.lastBatchId}
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1.5">Prediction period</label>
            <select value={horizon} onChange={(e) => setHorizon(e.target.value)} disabled={!!running} className="w-full h-10 px-3 border border-border rounded-md text-[13px] bg-white">
              {HORIZONS.map((h) => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1.5">Diseases</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)} disabled={!!running} className="w-full h-10 px-3 border border-border rounded-md text-[13px] bg-white">
              {SCOPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={() => actions.runPrediction({ horizon, diseaseScope: scope })}
            disabled={!!running || pipelineRunning}
            className="h-10 px-4 bg-epi hover:bg-epi-dark disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-bold rounded-md flex items-center justify-center gap-2">

            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? 'Running prediction…' : pipelineRunning ? 'Waiting for pipeline…' : 'Run Prediction'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
          <span className={`px-2.5 py-1 rounded-full font-bold ${envOk ? 'bg-[#00A550]/10 text-[#00A550]' : 'bg-epi-red/10 text-epi-red'}`}>
            {envOk ? '🟢 Weather features available' : '🔴 Weather data missing (Met Agency offline) — lower confidence'}
          </span>
          {stale &&
          <Link to="/processing" className="px-2.5 py-1 rounded-full font-bold bg-epi-amber/15 text-epi-amber hover:underline">
              🟡 New source data not yet processed — run the pipeline first for the freshest prediction →
            </Link>
          }
          {!envOk &&
          <Link to="/integration/sources" className="px-2.5 py-1 rounded-full font-bold bg-epi-bg text-epi hover:underline">
              Reconnect weather source →
            </Link>
          }
        </div>

        {running &&
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
            {RUN_STEPS.map((s, i) =>
          <div
            key={s}
            className={`rounded-md border p-3 text-[12px] font-semibold flex items-center gap-2 ${i < step ? 'border-[#00A550]/40 bg-[#00A550]/5 text-[#00A550]' : i === step ? 'border-epi bg-epi/5 text-epi' : 'border-border text-epi-muted'}`}>

                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i === step ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="w-4 h-4 rounded-full border border-border" />}
                {s}
              </div>
          )}
          </div>
        }

        {!running && last &&
        <div className="mt-5 border-t border-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="text-[13px] text-epi-text">
                <span className="font-bold">Latest result — {last.id}</span> · {fmtDateTime(last.at)} · {last.horizon} ·{' '}
                {last.diseaseScope} · confidence <strong>{last.confidence}%</strong>
              </div>
              <Link to="/prediction/history" className="text-[12px] font-bold text-epi hover:underline">
                All runs →
              </Link>
            </div>
            {last.signals.length === 0 ?
          <div className="text-[13px] text-epi-muted">No district crossed an alert threshold in this run.</div> :

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {last.signals.map((s) => {
              const sev = severityForSignal(s, state.thresholds, state.rules);
              const created = state.alerts.find(
                (a) => last.alertsGenerated.includes(a.id) && a.district === s.district && a.disease === s.disease
              );
              const existing = state.alerts.find((a) => a.district === s.district && a.disease === s.disease && isOpenStatus(a.status));
              return (
                <div key={`${s.district}-${s.disease}`} className="border border-border rounded-md p-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-bold text-epi-text">
                          {s.disease} — {s.sector ? `${s.sector}, ` : ''}{s.district}
                        </div>
                        <div className="text-[12px] text-epi-muted">
                          Probability {s.probability}% · confidence {s.confidence}% · {s.change} week-on-week
                        </div>
                        <div className="text-[12px] mt-1">
                          {created ?
                      <Link to={`/warning/detail?id=${created.id}`} className="font-bold text-epi-red hover:underline">
                              ⚡ New alert {created.id} generated →
                            </Link> :
                      existing ?
                      <Link to={`/warning/detail?id=${existing.id}`} className="text-epi hover:underline">
                              Updated existing alert {existing.id}
                            </Link> :

                      <span className="text-epi-muted">Below alert threshold</span>
                      }
                        </div>
                      </div>
                      <SeverityBadge severity={sev} />
                    </div>);

            })}
              </div>
          }
          </div>
        }
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-red flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-red/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-epi-red" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">High Risk Districts</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{high.length}</div>
          <p className="text-[11px] text-epi-muted mb-2">
            {high.slice(0, 5).map((r) => `${r.district} ${emoji(r.score)}`).join(' · ')}
          </p>
          <div className="mt-auto">
            <span className="text-[11px] font-bold text-epi-red">🔴 Urgent attention needed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#00A550]" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Active Predictions</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">240</div>
          <p className="text-[11px] text-epi-muted mb-2">8 diseases × 30 districts</p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#00A550]/10 text-[#00A550]">
              {running ? '⏳ Updating…' : '🟢 All running'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Model Accuracy</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-2">84.7%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div className="bg-epi h-1.5 rounded-full" style={{ width: '84.7%' }}></div>
          </div>
          <p className="text-[11px] text-epi-muted mb-1">Last 90 days · 1,051 correct of 1,240</p>
          <div className="mt-auto">
            <span className="text-[11px] font-bold text-[#00A550] flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +1.2% vs last quarter
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Runs Today</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{state.predictionRuns.length}</div>
          <p className="text-[11px] text-epi-muted mb-2">
            {state.predictionRuns.reduce((s, r) => s + r.alertsGenerated.length, 0)} alerts generated in total
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Microscope className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Diseases Being Predicted</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">8</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Malaria · Cholera · Measles · COVID-19 · Typhoid · VHF · Mpox · Malnutrition
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Last Model Retrain</h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">3 days ago</div>
          <p className="text-[11px] text-epi-muted mb-2">June 2, 2026 — trained on 4-year Rwanda data</p>
          <div className="mt-auto">
            <span className="text-[11px] font-medium text-epi-muted">Next retrain: June 16, 2026</span>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">District Risk Scores — AI Vital Predictions</h2>
            <p className="text-[13px] text-epi-muted">Highest and lowest risk districts from the latest run</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  {['District', 'Province', 'Top Disease Risk', 'Score', 'Score Bar', 'Trend', 'Action'].map((h) =>
                  <th key={h} className={`p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${h === 'Trend' ? 'text-center' : ''} ${h === 'Action' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-epi-red/5">
                  <td colSpan={7} className="p-2 text-[11px] font-bold text-epi-red uppercase tracking-wider pl-4">HIGH RISK</td>
                </tr>
                {high.map((r) => <Row key={r.district} r={r} />)}
                <tr className="bg-epi-amber/10">
                  <td colSpan={7} className="p-2 text-[11px] font-bold text-[#F97316] uppercase tracking-wider pl-4">MODERATE RISK</td>
                </tr>
                {moderate.map((r) => <Row key={r.district} r={r} />)}
                <tr className="bg-[#00A550]/5">
                  <td colSpan={7} className="p-2 text-[11px] font-bold text-[#00A550] uppercase tracking-wider pl-4">LOW RISK</td>
                </tr>
                {low.map((r) => <Row key={r.district} r={r} />)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-[16px] font-bold text-epi-text">Prediction Engine Status</h2>
          <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text flex items-center gap-2 mb-3">🧠 AI Vital Prediction Model v3.2</h3>
            <div className={`text-[12px] font-bold mb-4 ${running ? 'text-epi-amber' : 'text-[#00A550]'}`}>
              {running ? '⏳ Prediction run in progress' : '🟢 Active and ready'}
            </div>
            <div className="space-y-3 text-[13px] mb-2">
              <div className="flex justify-between gap-3">
                <span className="text-epi-muted">Input batch:</span>
                <span className="font-medium text-right font-mono">{state.pipeline.lastBatchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Records in batch:</span>
                <span className="font-bold">{state.pipeline.recordsProcessed.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Environmental features:</span>
                <span className={`font-bold ${envOk ? 'text-[#00A550]' : 'text-epi-red'}`}>{envOk ? 'Included' : 'Missing'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Last run confidence:</span>
                <span className="font-bold text-epi">{last ? `${last.confidence}%` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Features used:</span>
                <span className="font-bold">23 input variables</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-card border border-border">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">Alert rules applied to predictions:</h3>
            <ul className="space-y-2 text-[13px] text-epi-text mb-4">
              <li className="flex items-start gap-2">
                <span>{state.rules.aiEnabled ? '✅' : '⬜'}</span>
                <span>AI probability ≥ {state.rules.aiPct}% → Orange, ≥ {state.rules.aiPct + 20}% → Red</span>
              </li>
              <li className="flex items-start gap-2">
                <span>{state.rules.rainyEnabled ? '✅' : '⬜'}</span>
                <span>Rainy season multipliers (Mar–May, Oct–Dec)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>{state.rules.crossBorderEnabled ? '✅' : '⬜'}</span>
                <span>DRC border risk signals (Rusizi, Rubavu, Nyamasheke)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>NISR census denominators</span>
              </li>
            </ul>
            <Link to="/warning/config" className="text-[13px] font-bold text-epi hover:underline inline-flex items-center">
              Configure alert rules <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          {!envOk &&
          <div className="bg-epi-red/5 border border-epi-red/30 rounded-lg p-4 text-[13px] text-epi-text flex gap-2">
              <AlertTriangle className="w-4 h-4 text-epi-red shrink-0 mt-0.5" />
              Weather data has been missing since the Met Agency feed disconnected. Predictions for rainfall-sensitive
              diseases (cholera, malaria) are less certain.
            </div>
          }
        </div>
      </div>
    </PredictionLayout>);

}
