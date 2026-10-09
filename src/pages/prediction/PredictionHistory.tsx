import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { SeverityBadge, SimulatedTag, EmptyState } from '../../components/shared/Badges';
import { severityForSignal, useApp } from '../../store/AppStore';
import { fmtDateTime } from '../../lib/format';

export function PredictionHistory() {
  const { state } = useApp();
  const [open, setOpen] = useState<string | null>(state.predictionRuns[0]?.id ?? null);
  const runs = state.predictionRuns;

  return (
    <PredictionLayout
      title="Prediction History"
      subtitle="Every prediction run, its inputs and the alerts it generated"
      breadcrumb="Prediction History">

      <div className="flex items-center gap-2 mb-4 text-[13px] text-epi-muted">
        <SimulatedTag>Simulated model</SimulatedTag>
        Runs are produced by a deterministic frontend simulation, not a trained ML model.
      </div>
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        {runs.length === 0 ?
        <EmptyState title="No prediction runs yet" /> :

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-epi-bg border-b border-border text-epi-muted">
              <tr>
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Run</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Input batch</th>
                <th className="px-4 py-3">Horizon / scope</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Weather data</th>
                <th className="px-4 py-3">Alerts generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.map((r) =>
              <Fragment key={r.id}>
                  <tr
                  onClick={() => setOpen(open === r.id ? null : r.id)}
                  className="hover:bg-epi-bg/50 cursor-pointer">

                    <td className="px-4 py-3 text-epi-muted">
                      {open === r.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-epi-text">{r.id}</td>
                    <td className="px-4 py-3 text-epi-muted whitespace-nowrap">{fmtDateTime(r.at)}</td>
                    <td className="px-4 py-3 font-mono text-[12px]">{r.batchId}</td>
                    <td className="px-4 py-3">{r.horizon} · {r.diseaseScope}</td>
                    <td className="px-4 py-3 font-bold">{r.status === 'running' ? 'Running…' : `${r.confidence}%`}</td>
                    <td className="px-4 py-3">{r.environmental ? '● Included' : '● Missing'}</td>
                    <td className="px-4 py-3">
                      {r.alertsGenerated.length === 0 ?
                    <span className="text-epi-muted">None</span> :
                    r.alertsGenerated.map((id) =>
                    <Link
                      key={id}
                      to={`/warning/detail?id=${id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-epi font-bold hover:underline mr-2">

                              {id}
                            </Link>
                    )}
                    </td>
                  </tr>
                  {open === r.id &&
                <tr className="bg-epi-bg/40">
                      <td colSpan={8} className="px-8 py-4">
                        {r.signals.length === 0 ?
                    <div className="text-[13px] text-epi-muted">
                            No new district-level risk signals above threshold in this run
                            {r.status === 'running' ? ' (still running)' : ''}.
                          </div> :

                    <table className="w-full text-[12px]">
                            <thead className="text-epi-muted">
                              <tr>
                                <th className="py-1 text-left">Location</th>
                                <th className="py-1 text-left">Disease</th>
                                <th className="py-1 text-left">Probability</th>
                                <th className="py-1 text-left">Confidence</th>
                                <th className="py-1 text-left">Level (current rules)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.signals.map((s) =>
                        <tr key={`${s.district}-${s.disease}`}>
                                  <td className="py-1 font-bold">{s.sector ? `${s.sector}, ` : ''}{s.district}</td>
                                  <td className="py-1">{s.disease}</td>
                                  <td className="py-1">{s.probability}%</td>
                                  <td className="py-1">{s.confidence}%</td>
                                  <td className="py-1">
                                    <SeverityBadge severity={severityForSignal(s, state.thresholds, state.rules)} />
                                  </td>
                                </tr>
                        )}
                            </tbody>
                          </table>
                    }
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>
        }
      </div>
    </PredictionLayout>);

}
