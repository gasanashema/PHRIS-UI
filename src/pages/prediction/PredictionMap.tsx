import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { AlertTriangle, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { isOpenStatus, downloadFile, toCSV, fmtDateTime } from '../../lib/format';
import { useApp } from '../../store/AppStore';
import { DISTRICT_PROVINCE, SEED_DISTRICT_RISK } from '../../data/seed';
import type { DistrictRisk } from '../../types';

type Mode = 'score' | 'disease' | 'trend' | 'population' | 'border';
const MODES: {id: Mode;label: string;}[] = [
{ id: 'score', label: 'Risk Scores' },
{ id: 'disease', label: 'Dominant Disease' },
{ id: 'trend', label: 'Trend Arrows' },
{ id: 'population', label: 'Population at Risk' },
{ id: 'border', label: 'Cross-Border Signals' }];

const BORDER = ['Rusizi', 'Rubavu', 'Nyamasheke', 'Burera', 'Musanze', 'Kirehe', 'Ngoma', 'Nyagatare', 'Nyaruguru', 'Gisagara'];
const PROVINCES = ['Northern', 'Western', 'Kigali', 'Eastern', 'Southern'];

const bg = (s: number) => s >= 80 ? 'bg-epi-red text-white' : s >= 60 ? 'bg-[#F97316] text-white' : s >= 40 ? 'bg-epi-amber text-white' : 'bg-[#00A550]/50 text-epi-text';
const label = (s: number) => s >= 80 ? ['CRITICAL', 'text-epi-red'] : s >= 60 ? ['HIGH', 'text-[#F97316]'] : s >= 40 ? ['MODERATE', 'text-epi-amber'] : ['LOW', 'text-[#00A550]'];
const atRisk = (r: DistrictRisk) => Math.round((r.score / 100) * (180000 + r.district.length * 9000) * 0.12);

function TrendIcon({ t, className = 'w-4 h-4' }: {t: DistrictRisk['trend'];className?: string;}) {
  return t === 'up' ? <ArrowUpRight className={className} /> : t === 'down' ? <ArrowDownRight className={className} /> : <ArrowRight className={className} />;
}

export function PredictionMap() {
  const { state, actions } = useApp();
  const [mode, setMode] = useState<Mode>('score');
  const [disease, setDisease] = useState('all');
  const [run, setRun] = useState<'current' | 'previous'>('current');
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(params.get('district') ?? 'Rusizi');

  const data = run === 'current' ? state.districtRisk : SEED_DISTRICT_RISK;
  const last = state.predictionRuns.find((r) => r.status === 'complete');
  const diseases = Array.from(new Set(state.districtRisk.map((r) => r.disease))).sort();
  const sel = data.find((r) => r.district === selected) ?? data[0];
  const selAlert = state.alerts.find((a) => a.district === selected && isOpenStatus(a.status));
  const national = Math.round(data.reduce((a, r) => a + r.score, 0) / data.length);
  const provinceAvg = PROVINCES.map((p) => {
    const ds = data.filter((r) => r.province === p);
    return { p, score: Math.round(ds.reduce((a, r) => a + r.score, 0) / ds.length) };
  }).sort((a, b) => b.score - a.score);
  const topDiseases = diseases.
  map((d) => ({ d, n: data.filter((r) => r.disease === d && r.score >= 40).length })).
  filter((x) => x.n > 0).
  sort((a, b) => b.n - a.n);

  const exportCsv = () => {
    downloadFile(
      `aivital-risk-map-${run}.csv`,
      toCSV(data.map((r) => ({ district: r.district, province: r.province, top_disease: r.disease, score: r.score, trend: r.trend, confidence_pct: r.confidence, population_at_risk: atRisk(r) }))),
      'text/csv'
    );
    actions.toast('Risk map exported as CSV.', 'info');
  };

  return (
    <PredictionLayout
      title="National Risk Score Map"
      subtitle={`AI-predicted risk levels — All 30 Rwanda districts | ${run === 'current' ? `Latest run ${last ? fmtDateTime(last.at) : ''}` : 'Previous run (June 5, 07:00)'}`}
      breadcrumb="National Risk Map">

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map((m) =>
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold shadow-sm transition-colors ${mode === m.id ? 'bg-epi text-white' : 'bg-white border border-border text-epi-muted hover:bg-epi-bg'}`}>

              {m.label}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={disease} onChange={(e) => setDisease(e.target.value)} aria-label="Disease" className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option value="all">Showing: All Diseases</option>
            {diseases.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={run} onChange={(e) => setRun(e.target.value as typeof run)} aria-label="Prediction run" className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm">
            <option value="current">Current prediction</option>
            <option value="previous">Previous prediction (07:00)</option>
          </select>
          <button onClick={exportCsv} className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors shadow-sm">
            Export Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-lg shadow-card border border-border p-5">
          <div className="text-[12px] text-epi-muted mb-3">Schematic map — districts grouped by province. Click a district for details.</div>
          <div className="space-y-4">
            {PROVINCES.map((p) =>
            <div key={p}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-epi-muted mb-2">{p === 'Kigali' ? 'Kigali City' : `${p} Province`}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2">
                  {data.filter((r) => DISTRICT_PROVINCE[r.district] === p).map((r) => {
                  const dim = disease !== 'all' && r.disease !== disease;
                  const border = BORDER.includes(r.district);
                  const prev = SEED_DISTRICT_RISK.find((x) => x.district === r.district)?.score ?? r.score;
                  return (
                    <button
                      key={r.district}
                      onClick={() => setSelected(r.district)}
                      className={`relative rounded-md p-2 text-left transition-all ${bg(r.score)} ${dim ? 'opacity-25' : ''} ${selected === r.district ? 'ring-2 ring-epi-text ring-offset-2' : 'hover:scale-[1.03]'} ${mode === 'border' && border ? 'outline outline-2 outline-dashed outline-[#F97316] outline-offset-2' : ''}`}>

                        <div className="text-[12px] font-bold truncate">{r.district}</div>
                        <div className="text-[18px] font-bold leading-tight flex items-center gap-1">
                          {mode === 'score' && r.score}
                          {mode === 'disease' && <span className="text-[12px]">{r.disease}</span>}
                          {mode === 'trend' &&
                        <>
                              <TrendIcon t={r.trend} className="w-5 h-5" />
                              <span className="text-[11px] font-semibold">{r.score - prev >= 0 ? '+' : ''}{run === 'current' ? r.score - prev : 0}</span>
                            </>
                        }
                          {mode === 'population' && <span className="text-[13px]">{(atRisk(r) / 1000).toFixed(1)}k</span>}
                          {mode === 'border' && (border ? <span className="text-[11px] flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> border</span> : <span className="text-[11px]">—</span>)}
                        </div>
                        {state.alerts.some((a) => a.district === r.district && isOpenStatus(a.status) && a.severity === 'red') &&
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-pulse" />
                      }
                      </button>);

                })}
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] font-bold">
            <span className="text-[#00A550]">🟢 Low &lt;40</span>
            <span className="text-epi-amber">🟡 Moderate 40–59</span>
            <span className="text-[#F97316]">🟠 High 60–79</span>
            <span className="text-epi-red">🔴 Critical 80+</span>
            <span className="text-epi-muted">● open red alert</span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {sel &&
          <div className="bg-white rounded-lg shadow-card border border-border p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[16px] font-bold text-epi-text">{sel.district} District</h3>
                <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${bg(sel.score)}`}>{sel.score}/100</span>
              </div>
              <div className="text-[13px] text-epi-text space-y-1 mb-3">
                <div className="flex justify-between"><span className="text-epi-muted">Primary disease:</span><span className="font-bold">{sel.disease}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Province:</span><span className="font-bold">{sel.province}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Population at risk:</span><span className="font-bold">~{atRisk(sel).toLocaleString('en-US')}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Trend:</span><span className="font-bold flex items-center gap-1"><TrendIcon t={sel.trend} className="w-3 h-3" /> {sel.trend}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Model confidence:</span><span className="font-bold">{sel.confidence}%</span></div>
                {BORDER.includes(sel.district) && <div className="text-[12px] font-bold text-[#F97316]">🌍 Cross-border watch district</div>}
              </div>
              {selAlert ?
            <Link to={`/warning/detail?id=${selAlert.id}`} className="block w-full py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark text-center">
                  View alert {selAlert.id} →
                </Link> :

            <Link to="/prediction/disease" className="block w-full py-2 bg-white border border-epi text-epi text-[12px] font-bold rounded hover:bg-epi/5 text-center">
                  View Full Prediction →
                </Link>
            }
            </div>
          }

          <div className="bg-white rounded-lg shadow-card border border-border p-6 flex-1">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">Rwanda Risk Summary</h2>
            <div className="text-center mb-6">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">Overall National Risk</div>
              <div className={`text-2xl font-bold ${label(national)[1]}`}>{label(national)[0]}</div>
              <div className="text-[14px] text-epi-muted">Average score: {national}/100</div>
            </div>
            <h3 className="text-[13px] font-bold text-epi-text mb-3 uppercase tracking-wider">Breakdown by Province</h3>
            <div className="space-y-2 mb-6">
              {provinceAvg.map(({ p, score }) =>
              <div key={p} className="flex justify-between items-center text-[13px]">
                  <span className="text-epi-text">{p}</span>
                  <span className={`font-bold ${label(score)[1]}`}>{score}/100</span>
                </div>
              )}
            </div>
            <h3 className="text-[13px] font-bold text-epi-text mb-3 uppercase tracking-wider">Top Disease Risks Nationally</h3>
            <div className="space-y-2 mb-6">
              {topDiseases.map((x, i) =>
              <div key={x.d} className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-epi-text">{i + 1}. {x.d}</span>
                  <span className="text-epi-muted font-medium">{x.n} district{x.n > 1 ? 's' : ''} ≥ 40</span>
                </div>
              )}
            </div>
            <Link to="/prediction/history" className="block w-full py-2.5 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors text-center">
              View All Predictions →
            </Link>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}
