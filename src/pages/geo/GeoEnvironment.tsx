import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { useApp } from '../../store/AppStore';
import { DISTRICT_XY, rainfallFor } from '../../data/geo';
import { fmtDateTime } from '../../lib/format';

type EnvKey = 'rainfall' | 'temperature' | 'water' | 'flood';
type DiseaseKey = 'Cholera' | 'Malaria' | 'Diarrheal';
const ENV: Record<EnvKey, {label: string;icon: string;unit: string;source: string;}> = {
  rainfall: { label: 'Rainfall', icon: '', unit: 'mm', source: 'met' },
  temperature: { label: 'Temperature', icon: '', unit: '°C', source: 'met' },
  water: { label: 'Water quality (risk)', icon: '', unit: '/10', source: 'wasac' },
  flood: { label: 'Flood risk', icon: '', unit: '/10', source: 'met' }
};
const DISEASE_ICON: Record<DiseaseKey, string> = { Cholera: '', Malaria: '', Diarrheal: '' };
const CHOLERA: Record<string, number> = { Rusizi: 87, Nyamasheke: 34, Rutsiro: 28, Karongi: 15, Ngororero: 12, Rubavu: 8, Huye: 23, Nyamagabe: 6, Nyabihu: 4 };
const FLOOD: Record<string, number> = { Rusizi: 9, Nyamasheke: 7, Rubavu: 7, Nyabihu: 6, Karongi: 6, Rutsiro: 5, Ngororero: 6, Musanze: 5, Gakenke: 6, Nyarugenge: 4 };

function envValue(k: EnvKey, d: string, days: number) {
  const p = DISTRICT_XY[d];
  const scale = days === 30 ? 3.6 : 1; // monthly totals vs weekly
  if (k === 'rainfall') return Math.round(rainfallFor(d) * 0.85 * scale);
  if (k === 'temperature') return Math.round((15.5 + p.x * 0.07 + p.y * 0.02) * 10) / 10;
  if (k === 'water') return Math.min(10, Math.round(((CHOLERA[d] ?? 0) / 12 + (p.x < 30 ? 4 : 2)) * 10) / 10);
  return FLOOD[d] ?? 2;
}
function diseaseValue(k: DiseaseKey, d: string, days: number) {
  const p = DISTRICT_XY[d];
  const scale = days === 30 ? 3.4 : 1;
  if (k === 'Cholera') return Math.round((CHOLERA[d] ?? 1) * scale);
  if (k === 'Malaria') return Math.round((40 + p.x * 4.5 + (p.y > 50 ? 30 : 0)) * scale);
  return Math.round((20 + (CHOLERA[d] ?? 0) * 0.9 + (p.x < 30 ? 15 : 0)) * scale);
}
function pearson(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n,my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0,sxx = 0,syy = 0;
  xs.forEach((x, i) => {
    sxy += (x - mx) * (ys[i] - my);
    sxx += (x - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  });
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}
const envColor = (t: number) => t >= 0.75 ? '#1E3A8A' : t >= 0.5 ? '#3B82F6' : t >= 0.25 ? '#60A5FA' : '#93C5FD';

export function GeoEnvironment() {
  const { state } = useApp();
  const [env, setEnv] = useState<EnvKey>('rainfall');
  const [disease, setDisease] = useState<DiseaseKey>('Cholera');
  const [days, setDays] = useState(7);
  const [correlation, setCorrelation] = useState(true);
  const [layers, setLayers] = useState({ env: true, disease: true, rivers: true });
  const [selected, setSelected] = useState<string | null>(null);

  const met = state.sources.find((s) => s.id === 'met');
  const metDown = !!met && met.status === 'disconnected';
  const rows = Object.keys(DISTRICT_XY).map((d) => ({ district: d, env: envValue(env, d, days), cases: diseaseValue(disease, d, days) }));
  const maxEnv = Math.max(...rows.map((r) => r.env)),minEnv = Math.min(...rows.map((r) => r.env));
  const maxCases = Math.max(...rows.map((r) => r.cases), 1);
  const norm = (v: number) => maxEnv === minEnv ? 0.5 : (v - minEnv) / (maxEnv - minEnv);
  const r = pearson(rows.map((x) => x.env), rows.map((x) => x.cases));
  const strength = `${Math.abs(r) >= 0.7 ? 'Strong' : Math.abs(r) >= 0.4 ? 'Moderate' : 'Weak'} ${r >= 0 ? 'Positive' : 'Negative'}`;
  const top = [...rows].sort((a, b) => b.env - a.env);
  const highEnv = top.slice(0, Math.ceil(rows.length / 4));
  const rest = top.slice(Math.ceil(rows.length / 4));
  const avg = (xs: typeof rows) => xs.reduce((s, x) => s + x.cases, 0) / Math.max(1, xs.length);
  const ratio = avg(rest) ? avg(highEnv) / avg(rest) : 0;
  const sel = selected ? rows.find((x) => x.district === selected) : undefined;
  const e = ENV[env];
  const toggle = (k: keyof typeof layers) => setLayers((l) => ({ ...l, [k]: !l[k] }));
  const Toggle = ({ on, onClick, label }: {on: boolean;onClick: () => void;label: string;}) =>
  <button role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={`w-8 h-4 rounded-full relative ${on ? 'bg-[#00A550]' : 'bg-border'}`}>
      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
    </button>;


  return (
    <GeoLayout breadcrumb="Environmental Overlays" hideHeader={true}>
      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 lg:right-[37%] bg-white rounded-lg shadow-lg border border-border p-2 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">Primary layer:</span>
            <select value={env} onChange={(ev) => setEnv(ev.target.value as EnvKey)} className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg shadow-sm">
              {(Object.keys(ENV) as EnvKey[]).map((k) => <option key={k} value={k}>{ENV[k].icon} {ENV[k].label}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">Disease overlay:</span>
            <select value={disease} onChange={(ev) => setDisease(ev.target.value as DiseaseKey)} className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg shadow-sm">
              {(Object.keys(DISEASE_ICON) as DiseaseKey[]).map((k) => <option key={k} value={k}>{DISEASE_ICON[k]} {k}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">Period:</span>
            <select value={days} onChange={(ev) => setDays(Number(ev.target.value))} className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-epi-text">Show correlation</span>
          <Toggle on={correlation} onClick={() => setCorrelation(!correlation)} label="Show correlation" />
          <span className={`text-[12px] font-bold ml-1 ${correlation ? 'text-[#00A550]' : 'text-epi-muted'}`}>{correlation ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Main Map Area */}
        <div className="w-full lg:w-[65%] min-h-[560px] lg:h-full relative bg-[#1A1A1A] overflow-hidden shrink-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          {metDown && ENV[env].source === 'met' &&
          <div className="absolute top-[150px] md:top-24 left-6 z-20 bg-epi-amber text-white text-[11px] font-bold px-3 py-1.5 rounded shadow">
              Rwanda Met Agency disconnected — showing last received values.{' '}
              <Link to="/integration/sources?q=Met" className="underline">Check source</Link>
            </div>
          }

          <div className="absolute top-[190px] md:top-[120px] bottom-10 left-8 right-8">
            {layers.rivers &&
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M6,40 Q10,55 8,70 T10,92" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
                <path d="M60,98 Q70,85 85,80 T98,70" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
                <path d="M30,35 Q38,45 45,52 T58,62" fill="none" stroke="#60A5FA" strokeWidth="0.4" />
              </svg>
            }
            {rows.map((row) => {
              const p = DISTRICT_XY[row.district];
              const t = norm(row.env);
              const caseDots = Math.min(12, Math.ceil(row.cases / maxCases * 12));
              return (
                <button
                  key={row.district}
                  onClick={() => setSelected(selected === row.district ? null : row.district)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}>

                  {layers.env &&
                  <span
                    className="absolute rounded-full blur-md mix-blend-screen"
                    style={{
                      width: 30 + t * 50,
                      height: 30 + t * 50,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-60%)',
                      background: env === 'temperature' ? `rgba(239,68,68,${0.15 + t * 0.6})` : env === 'flood' ? `rgba(249,115,22,${0.15 + t * 0.6})` : envColor(t),
                      opacity: env === 'temperature' || env === 'flood' ? 1 : 0.35 + t * 0.4
                    }} />
                  }
                  {layers.disease &&
                  <span className="relative flex flex-wrap w-10 gap-0.5 justify-center">
                      {Array.from({ length: caseDots }).map((_, i) =>
                    <span key={i} className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full shadow-[0_0_5px_rgba(211,47,47,0.8)]" />
                    )}
                    </span>
                  }
                  <span className={`relative text-[10px] font-medium mt-0.5 ${selected === row.district ? 'text-white font-bold' : 'text-white/70'}`}>{row.district}</span>
                </button>);

            })}
          </div>

          {correlation &&
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border max-w-[240px] z-10">
              <div className="text-[12px] font-bold text-epi-text mb-1">
                r = {r >= 0 ? '+' : ''}{r.toFixed(2)} | {strength}
              </div>
              <div className="text-[11px] text-epi-muted leading-relaxed">
                The top quarter of districts by {e.label.toLowerCase()} have {ratio.toFixed(1)}× the {disease.toLowerCase()} cases of the rest ({days === 7 ? 'this week' : 'last 30 days'}).
              </div>
            </div>
          }

          {sel &&
          <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-xl border border-border p-4 w-64 z-30">
              <div className="flex justify-between">
                <h3 className="text-[13px] font-bold text-epi-text mb-1">{sel.district}</h3>
                <button aria-label="Close" onClick={() => setSelected(null)} className="text-epi-muted hover:text-epi-text"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-1.5 text-[12px] my-2">
                {(Object.keys(ENV) as EnvKey[]).map((k) =>
              <div key={k} className="flex justify-between">
                    <span className="text-epi-muted">{ENV[k].label}:</span>
                    <span className={`font-bold ${k === env ? 'text-epi' : 'text-epi-text'}`}>{envValue(k, sel.district, days)}{ENV[k].unit === 'mm' ? ' mm' : ENV[k].unit}</span>
                  </div>
              )}
                <div className="flex justify-between"><span className="text-epi-muted">{disease} cases:</span> <span className="font-bold text-epi-red">{sel.cases}</span></div>
              </div>
              <Link to={`/warning/history?q=${sel.district}`} className="text-[12px] font-bold text-epi hover:underline">Alert history →</Link>
            </div>
          }
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[35%] lg:h-full bg-white border-l border-border flex flex-col lg:pt-6 lg:overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">
              {e.label} vs {disease} — Correlation Analysis
            </h2>

            {/* Scatter Plot */}
            <div className="mb-8 pl-10">
              <div className="relative h-48 w-full border-l border-b border-border mb-12">
                <div className="absolute -left-8 top-0 bottom-0 w-6 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right">
                  <span>{maxCases}</span>
                  <span>{Math.round(maxCases / 2)}</span>
                  <span>0</span>
                </div>
                <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[10px] text-epi-muted font-medium">
                  <span>{minEnv}</span>
                  <span>{Math.round((minEnv + maxEnv) / 2)}</span>
                  <span>{maxEnv}</span>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-epi-muted whitespace-nowrap">
                  {e.label} ({e.unit}) — {days === 7 ? 'last 7 days' : 'last 30 days'}
                </div>
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {correlation &&
                  <line x1="0" y1={r >= 0 ? 95 : 10} x2="100" y2={r >= 0 ? 10 : 95} stroke="#104E49" strokeWidth="0.8" strokeDasharray="4,4" opacity={Math.abs(r)} />
                  }
                  {rows.map((row) =>
                  <circle
                    key={row.district}
                    cx={norm(row.env) * 100}
                    cy={100 - row.cases / maxCases * 100}
                    r={row.district === selected ? 3.5 : 2}
                    fill={row.district === selected ? '#D32F2F' : '#1D72B8'}>
                      <title>{`${row.district}: ${row.env}${e.unit}, ${row.cases} cases`}</title>
                    </circle>
                  )}
                </svg>
              </div>

              <div className="bg-epi-bg p-3 rounded border border-border -ml-10">
                <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
                  <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Factor: {e.label} vs {disease}
                  </span>
                  <span className="text-[13px] font-bold text-epi-text">r = {r >= 0 ? '+' : ''}{r.toFixed(2)} | {strength}</span>
                </div>
                <div className="text-[13px] text-epi-text font-medium">
                  {ratio.toFixed(1)}× more cases in the highest-{e.label.toLowerCase()} districts
                </div>
              </div>
            </div>

            {/* Layer Options */}
            <div className="mb-6">
              <h3 className="text-[14px] font-bold text-epi-text mb-4">Active Layers</h3>
              <div className="space-y-3">
                {([
                ['env', e.label, '#1E3A8A'],
                ['disease', `${disease} cases`, '#D32F2F'],
                ['rivers', 'Rivers & lakes', '#60A5FA']] as const).
                map(([k, label, color]) =>
                <div key={k} className={`flex items-center justify-between ${layers[k] ? '' : 'opacity-50'}`}>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                      <div className="w-3 h-3 rounded-full" style={{ background: color }}></div>
                      {label}
                    </div>
                    <Toggle on={layers[k]} onClick={() => toggle(k)} label={label} />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-epi-muted mt-3">Switch the primary layer above to compare temperature, water quality or flood risk.</p>
            </div>

            <div className="pt-4 border-t border-border text-[11px] text-epi-muted leading-relaxed">
              <span className="font-bold">Environmental data:</span> Rwanda Meteorological Agency
              {met ? ` (${metDown ? 'disconnected — last sync ' : 'last sync '}${met.lastSync ? fmtDateTime(met.lastSync) : 'n/a'})` : ''}, WASAC water quality, RLMUA flood maps. Demonstration values.
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}
