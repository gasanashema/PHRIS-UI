import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, FlaskConical, Droplets, Users, AlertTriangle, Lock, Star } from 'lucide-react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { SimulatedTag } from '../../components/shared/Badges';
import { useApp } from '../../store/AppStore';
import { isOpenStatus, nowISO } from '../../lib/format';

interface Params {
  water: boolean;
  ors: number; // % coverage
  relocation: number; // people
  rainfall: number; // % change
  chw: boolean;
}

// Deterministic, illustrative effect sizes (relative risk reduction)
const factor = {
  water: (p: Params) => p.water ? 0.6 : 1,
  ors: (p: Params) => 1 - 0.2 * (p.ors / 100),
  relocation: (p: Params) => 1 - 0.09 * (p.relocation / 500),
  rainfall: (p: Params) => 1 + 0.3 * (p.rainfall / 50),
  chw: (p: Params) => p.chw ? 0.93 : 1
};

function simulate(baseline: number, p: Params) {
  const f = Object.values(factor).reduce((acc, fn) => acc * fn(p), 1);
  return Math.max(1, Math.min(99, Math.round(baseline * f)));
}

function cost(p: Params) {
  return (p.water ? 2_000_000 : 0) + p.ors * 20_000 + p.relocation * 3_600 + (p.chw ? 400_000 : 0);
}

const rwf = (n: number) => `RWF ${n.toLocaleString('en-US')}`;
const colorFor = (r: number) => r >= 80 ? 'bg-epi-red' : r >= 60 ? 'bg-[#F97316]' : r >= 40 ? 'bg-epi-amber' : 'bg-epi';

const NONE: Params = { water: false, ors: 0, relocation: 0, rainfall: 0, chw: false };

function Slider({
    label,
    min,
    max,
    value,
    onChange,
    left,
    right,
    note,
    effect





  }: {label: string;min: number;max: number;value: number;onChange: (v: number) => void;left: string;right: string;note?: string;effect: string;}) {
  return (
  <div>
      <div className="flex justify-between items-end mb-2">
        <label className="text-[13px] font-bold text-epi-text">{label}</label>
        <span className={`text-[12px] font-bold ${effect.startsWith('-') ? 'text-[#00A550]' : effect.startsWith('+') ? 'text-epi-red' : 'text-epi-muted'}`}>
          {effect}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-epi-muted font-bold w-8">{left}</span>
        <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-epi-bg rounded-lg appearance-none cursor-pointer accent-epi" />

        <span className="text-[12px] text-epi font-bold w-10 text-right">{right}</span>
      </div>
      {note && <div className="text-[11px] text-epi-muted mt-1 italic">{note}</div>}
    </div>);
}

export function PredictionScenarios() {
  const { state, actions } = useApp();
  const candidates = [...state.districtRisk].sort((a, b) => b.score - a.score).slice(0, 12);
  const [district, setDistrict] = useState(candidates[0]?.district ?? 'Rusizi');
  const risk = state.districtRisk.find((r) => r.district === district);
  const diseases = Array.from(
    new Set([risk?.disease ?? 'Cholera', ...state.alerts.filter((a) => a.district === district).map((a) => a.disease)])
  );
  const [disease, setDisease] = useState(diseases[0]);
  const alert = state.alerts.find((a) => a.district === district && a.disease === disease && isOpenStatus(a.status));
  const baseline = alert?.probability ?? (risk?.disease === disease ? risk.score : Math.round((risk?.score ?? 40) * 0.7));

  const [p, setP] = useState<Params>({ water: true, ors: 60, relocation: 500, rainfall: 0, chw: true });
  const [ran, setRan] = useState<{params: Params;baseline: number;key: string;} | null>(null);
  const [running, setRunning] = useState(false);
  const [showNothing, setShowNothing] = useState(true);
  const key = `${district}|${disease}`;
  const outdated = !ran || ran.key !== key || JSON.stringify(ran.params) !== JSON.stringify(p) || ran.baseline !== baseline;

  const delta = (fn: (x: Params) => number) => {
    const d = Math.round(baseline - baseline * fn(p));
    return d === 0 ? '0% risk' : d > 0 ? `-${d}% risk` : `+${-d}% risk`;
  };

  const scenarios = useMemo(() => {
    if (!ran) return [];
    const b = ran.baseline;
    const list = [
    { name: 'Your scenario', icon: 'flask', params: ran.params },
    { name: 'ORS + Water Treatment', icon: 'droplet', params: { ...NONE, water: true, ors: 60, rainfall: ran.params.rainfall } },
    { name: 'CHW Visits Only', icon: 'users', params: { ...NONE, chw: true, rainfall: ran.params.rainfall } }];

    if (showNothing) list.push({ name: 'Do Nothing', icon: 'alert', params: { ...NONE, rainfall: Math.max(ran.params.rainfall, 20) } });
    const results = list.map((s) => ({ ...s, result: simulate(b, s.params), cost: cost(s.params) }));
    const best = results.
    filter((r) => r.name !== 'Do Nothing').
    sort((x, y) => x.result - y.result || x.cost - y.cost)[0];
    return results.map((r) => ({ ...r, recommended: r === best }));
  }, [ran, showNothing]);
  const best = scenarios.find((s) => s.recommended);

  const run = () => {
    setRunning(true);
    window.setTimeout(() => {
      setRan({ params: p, baseline, key });
      setRunning(false);
    }, 700);
  };

  const addToPlan = () => {
    if (!best) return;
    actions.addIntervention({
      date: nowISO(),
      action: `Scenario plan: ${best.name} (expected risk ${ran!.baseline}% → ${best.result}%)`,
      disease,
      sector: alert?.sector ?? 'All sectors',
      district,
      who: `${district} DHO`,
      status: 'Planned',
      outcome: `Estimated cost ${rwf(best.cost)}`,
      alertId: alert?.id
    });
  };

  const sendToDho = () => {
    if (!best) return;
    actions.sendNotification(
      {
        title: `Scenario recommendation — ${disease} in ${district}`,
        body: `${best.name} is expected to lower outbreak risk from ${ran!.baseline}% to ${best.result}% at ${rwf(best.cost)}.`,
        severity: 'info',
        alertId: alert?.id,
        link: alert ? `/dho/alerts/${alert.id}` : '/dho',
        roles: ['dho'],
        district
      },
      { module: 'Prediction', action: `Sent scenario recommendation to ${district} DHO` }
    );
    actions.toast(`Recommendation sent to the ${district} District Health Officer.`);
  };




  return (
    <PredictionLayout
      title="What-If Scenario Simulator"
      subtitle="Test interventions before deploying resources — evidence-based decision making"
      breadcrumb="What-If Scenarios">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold text-epi-text">Build Your Scenario</h2>
              <SimulatedTag>Model estimate</SimulatedTag>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    const r = state.districtRisk.find((x) => x.district === e.target.value);
                    setDisease(r?.disease ?? 'Cholera');
                  }}
                  className="w-full text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-epi-bg">

                  {candidates.map((c) => <option key={c.district}>{c.district}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">Disease</label>
                <select
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  className="w-full text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-epi-bg">

                  {diseases.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="p-3 bg-epi-red/10 border border-epi-red/20 rounded-md flex justify-between items-center">
                <span className="text-[13px] font-bold text-epi-text">
                  Baseline risk:
                  <span className="block text-[11px] font-normal text-epi-muted">
                    {alert ? `from alert ${alert.id}` : 'from latest district prediction'}
                  </span>
                </span>
                <span className="text-[16px] font-bold text-epi-red flex items-center gap-1.5">{baseline}% <Lock className="w-4 h-4 text-epi-muted" /></span>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <Slider label="Water treatment deployed" min={0} max={1} value={p.water ? 1 : 0} onChange={(v) => setP({ ...p, water: v === 1 })} left="OFF" right="ON" effect={delta(factor.water)} note={p.water ? 'Sanitation score adjusts to 7/10' : 'Sanitation score stays at 2/10'} />
              <Slider label="ORS distribution" min={0} max={100} value={p.ors} onChange={(v) => setP({ ...p, ors: v })} left="0" right="100%" effect={delta(factor.ors)} note={`${p.ors}% coverage`} />
              <Slider label="Population relocation" min={0} max={500} value={p.relocation} onChange={(v) => setP({ ...p, relocation: v })} left="0" right="500" effect={delta(factor.relocation)} note={`${p.relocation} people from flooded zone`} />
              <Slider label="Rainfall change" min={-50} max={50} value={p.rainfall} onChange={(v) => setP({ ...p, rainfall: v })} left="-50%" right="+50%" effect={delta(factor.rainfall)} note={`${p.rainfall > 0 ? '+' : ''}${p.rainfall}% — external factor, not controllable`} />
              <Slider label="CHW household visits" min={0} max={1} value={p.chw ? 1 : 0} onChange={(v) => setP({ ...p, chw: v === 1 })} left="OFF" right="ON" effect={delta(factor.chw)} />
            </div>

            <div className="mt-6 p-3 bg-epi-bg rounded-md text-[13px] flex justify-between">
              <span className="text-epi-muted">Live estimate with these settings:</span>
              <span className="font-bold text-epi-text">{simulate(baseline, p)}%</span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setShowNothing(!showNothing)}
                className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">

                {showNothing ? "Remove 'Do Nothing' comparison" : "Add 'Do Nothing' for comparison"}
              </button>
              <button
                onClick={run}
                disabled={running}
                className="w-full py-3 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2">

                {running && <Loader2 className="w-4 h-4 animate-spin" />}
                {running ? 'Simulating…' : ran && outdated ? 'Re-run Simulation' : 'Run Simulation'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6 flex-1 flex flex-col">
            <h2 className="text-[18px] font-bold text-epi-text mb-2">
              Simulation Results — {ran ? ran.key.replace('|', ' District ') : `${district} District ${disease}`}
            </h2>
            {ran && outdated &&
            <div className="mb-4 text-[12px] font-semibold text-epi-amber bg-epi-amber/10 rounded px-3 py-1.5">
                Settings changed since the last run — re-run to update the comparison.
              </div>
            }
            {!ran ?
            <div className="flex-1 flex items-center justify-center text-center p-10 text-[14px] text-epi-muted">
                Adjust the levers and press <strong className="mx-1 text-epi-text">Run Simulation</strong> to compare intervention options.
              </div> :

            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-4">
                  {scenarios.map((s) => {
                  const change = s.result - ran.baseline;
                  return (
                    <div
                      key={s.name}
                      className={`rounded-lg p-5 relative overflow-hidden ${s.recommended ? 'bg-epi-bg/50 border-2 border-[#00A550]' : s.name === 'Do Nothing' ? 'bg-epi-red/5 border border-epi-red/30' : 'bg-white border border-border'}`}>

                        {s.recommended &&
                      <div className="absolute top-0 right-0 bg-[#00A550] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1"><Star className="w-3 h-3 fill-white" /> Recommended</div>
                      }
                        {s.name === 'Do Nothing' &&
                      <div className="absolute top-0 right-0 bg-epi-red text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">Not recommended</div>
                      }
                        <h3 className="text-[14px] font-bold text-epi-text mb-4 flex items-center gap-2">
                          {s.icon === 'flask' && <FlaskConical className="w-4 h-4 text-epi" />}
                          {s.icon === 'droplet' && <Droplets className="w-4 h-4 text-blue-600" />}
                          {s.icon === 'users' && <Users className="w-4 h-4 text-purple-600" />}
                          {s.icon === 'alert' && <AlertTriangle className="w-4 h-4 text-epi-red" />}
                          {s.name}
                        </h3>
                        <div className="flex justify-between items-end mb-2">
                          <div className="text-[13px] text-epi-muted">
                            Baseline: {ran.baseline}% → <span className="font-bold text-epi-text">Result: {s.result}%</span>
                          </div>
                          <div className={`text-[13px] font-bold ${change <= 0 ? 'text-[#00A550]' : 'text-epi-red'}`}>
                            {change > 0 ? '+' : ''}{change}%
                          </div>
                        </div>
                        <div className="relative h-4 bg-epi-bg rounded-full overflow-hidden mb-4 border border-border">
                          <div className="absolute left-0 top-0 bottom-0 bg-epi-red/20" style={{ width: `${ran.baseline}%` }}></div>
                          <div className={`absolute left-0 top-0 bottom-0 ${colorFor(s.result)}`} style={{ width: `${s.result}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-epi-muted">Cost estimate:</span>
                          <span className={`font-bold ${s.name === 'Do Nothing' ? 'text-epi-red' : ''}`}>
                            {s.name === 'Do Nothing' ? 'RWF 0 now — est. RWF 45M epidemic cost' : rwf(s.cost)}
                          </span>
                        </div>
                      </div>);

                })}
                </div>

                {best &&
              <div className="mt-auto bg-epi/5 border border-epi/20 rounded-lg p-5">
                    <h3 className="text-[14px] font-bold text-epi-text mb-2">AI Vital Recommendation:</h3>
                    <p className="text-[13px] text-epi-text leading-relaxed mb-4">
                      Deploy <span className="font-bold">{best.name}</span> to reduce {disease.toLowerCase()} outbreak risk in {district} from{' '}
                      {ran.baseline}% to {best.result}% at an estimated {rwf(best.cost)}.
                      {alert && <> Linked to alert <Link to={`/warning/detail?id=${alert.id}`} className="font-bold text-epi hover:underline">{alert.id}</Link>.</>}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={addToPlan} className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
                        Add to Intervention Plan
                      </button>
                      <button onClick={sendToDho} className="px-6 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                        Send to District Officer
                      </button>
                    </div>
                  </div>
              }
              </>
            }
          </div>
        </div>
      </div>
    </PredictionLayout>);

}
