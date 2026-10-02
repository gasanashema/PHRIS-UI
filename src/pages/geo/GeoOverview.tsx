import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { X, ArrowRight, Search } from 'lucide-react';
import { useApp, districtLevel, severityCounts } from '../../store/AppStore';
import { DISTRICT_PROVINCE } from '../../data/seed';
import { DISTRICT_XY, DISTRICT_POP_K, BORDER_DISTRICTS, rainfallFor, facilitiesFor } from '../../data/geo';
import { SEVERITY_META, isOpenStatus, fmtDateTime, nowISO, downloadFile, toCSV } from '../../lib/format';

type Layer = 'risk' | 'cases' | 'alerts' | 'facilities' | 'population' | 'environment' | 'border';
const LAYERS: [Layer, string][] = [
['risk', '🔥 Risk Scores'],
['cases', '🦠 Disease Cases'],
['alerts', '⚠️ Active Alerts'],
['facilities', '🏥 Facilities'],
['population', '👥 Population'],
['environment', '🌧️ Environment'],
['border', '🌍 Cross-Border']];

const PROVINCE_OPTIONS = ['All Rwanda', 'Western', 'Northern', 'Kigali', 'Southern', 'Eastern'];
const PERIODS: Record<string, number> = { Current: 1, 'Last week': 0.9, 'Last month': 0.78 };
const riskColor = (s: number) => s >= 80 ? '#D32F2F' : s >= 60 ? '#F57C00' : s >= 40 ? '#F59E0B' : '#00A550';
const riskLabel = (s: number) => s >= 80 ? '🔴' : s >= 60 ? '🟠' : s >= 40 ? '🟡' : '🟢';

export function GeoOverview() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [layer, setLayer] = useState<Layer>('risk');
  const [region, setRegion] = useState('All Rwanda');
  const [period, setPeriod] = useState('Current');
  const [zoom, setZoom] = useState(1);
  const [find, setFind] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const scale = PERIODS[period];
  const open = state.alerts.filter((a) => isOpenStatus(a.status));
  const rows = state.districtRisk.map((r) => {
    const alerts = open.filter((a) => a.district === r.district);
    const cases = Math.round((alerts.reduce((s, a) => s + a.cases, 0) + r.score * 2) * scale);
    return { ...r, score: Math.round(r.score * scale), alerts, cases, level: districtLevel(state, r.district) };
  });
  const byName = (d: string) => rows.find((r) => r.district === d);
  const sel = selected ? byName(selected) : undefined;
  const counts = severityCounts(open);
  const national = Math.round(rows.reduce((s, r) => s + r.score, 0) / Math.max(1, rows.length));
  const top3 = [...rows].sort((a, b) => b.score - a.score).slice(0, 3);
  const maxCases = Math.max(...rows.map((r) => r.cases), 1);
  const inRegion = (d: string) => region === 'All Rwanda' || DISTRICT_PROVINCE[d] === region;

  const markerFor = (r: (typeof rows)[number]) => {
    switch (layer) {
      case 'cases':
        return { color: riskColor(r.cases / maxCases * 100), size: 14 + r.cases / maxCases * 40, label: String(r.cases) };
      case 'alerts':
        return r.alerts.length ?
        { color: SEVERITY_META[r.level].hex, size: 22 + r.alerts.length * 6, label: String(r.alerts.length) } :
        { color: '#4B5563', size: 10, label: '' };
      case 'facilities':
        return { color: '#1D72B8', size: 12 + facilitiesFor(r.district), label: String(facilitiesFor(r.district)) };
      case 'population':
        return { color: '#7C3AED', size: 10 + (DISTRICT_POP_K[r.district] ?? 400) / 20, label: `${DISTRICT_POP_K[r.district]}k` };
      case 'environment':{
          const mm = rainfallFor(r.district);
          return { color: mm >= 140 ? '#1D72B8' : mm >= 115 ? '#60A5FA' : '#BFDBFE', size: 18 + (mm - 90) / 3, label: `${mm}` };
        }
      case 'border':
        return BORDER_DISTRICTS.includes(r.district) ?
        { color: '#F57C00', size: 24, label: '⚠️' } :
        { color: '#4B5563', size: 10, label: '' };
      default:
        return { color: riskColor(r.score), size: 16 + r.score / 3, label: String(r.score) };
    }
  };

  const doFind = () => {
    const q = find.trim().toLowerCase();
    if (!q) return;
    const hit = rows.find((r) => r.district.toLowerCase().startsWith(q)) ?? rows.find((r) => r.district.toLowerCase().includes(q));
    if (hit) {
      setSelected(hit.district);
      setRegion('All Rwanda');
    }
  };
  const exportMap = () => {
    downloadFile(
      `rwanda-map-${layer}.csv`,
      toCSV(rows.filter((r) => inRegion(r.district)).map((r) => ({ district: r.district, province: r.province, risk_score: r.score, top_disease: r.disease, open_alerts: r.alerts.length, cases: r.cases, population_k: DISTRICT_POP_K[r.district], facilities: facilitiesFor(r.district), rainfall_mm: rainfallFor(r.district) }))),
      'text/csv'
    );
  };

  return (
    <GeoLayout breadcrumb="Main Map" hideHeader={true}>
      {/* Map Container (Fullscreen) */}
      <div className="absolute inset-0 bg-[#1A1A1A] overflow-hidden">
        {/* Simulated Dark Terrain Map */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* District markers (schematic positions) */}
        <div
          className={`absolute top-[190px] xl:top-[130px] bottom-[40px] sm:bottom-[190px] left-6 transition-all ${showRightPanel ? 'right-6 lg:right-[360px]' : 'right-6'}`}>
          <div className="relative w-full h-full origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
            {/* DRC border */}
            <div className="absolute left-[3%] top-[18%] bottom-[2%] border-l-4 border-dashed border-[#F57C00]/80" />
            <div className="absolute left-[4%] top-[48%] bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 backdrop-blur-sm">
              ⚠️ DRC border
            </div>
            {/* Refugee camps */}
            {[['Mahama', 84, 76], ['Nyabiheke', 72, 20], ['Kigeme', 30, 70], ['Kiziba', 22, 54]].map(([n, x, y]) =>
            <div key={n as string} title={`${n} refugee camp`} className="absolute text-[11px] bg-black/50 px-1 rounded border border-white/20" style={{ left: `${x}%`, top: `${y}%` }}>
                🏕️
              </div>
            )}
            {rows.map((r) => {
              const p = DISTRICT_XY[r.district];
              if (!p) return null;
              const m = markerFor(r);
              const dim = !inRegion(r.district);
              const isSel = selected === r.district;
              return (
                <button
                  key={r.district}
                  onClick={() => setSelected(isSel ? null : r.district)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-opacity ${dim ? 'opacity-20' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}>

                  <span
                    className={`rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 ${isSel ? 'border-white ring-4 ring-white/40' : 'border-white/40'} ${layer === 'alerts' && r.level === 'red' ? 'animate-pulse' : ''}`}
                    style={{ width: m.size, height: m.size, background: `${m.color}CC`, boxShadow: `0 0 ${m.size / 2}px ${m.color}` }}>
                    {m.size >= 18 ? m.label : ''}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-white/80 group-hover:text-white whitespace-nowrap">{r.district}</span>
                </button>);

            })}
          </div>
        </div>

        {/* District popup */}
        {sel &&
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 lg:right-[360px] bg-white rounded-lg shadow-xl border border-border p-4 w-[300px] max-w-[calc(100%-32px)] z-30">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[14px] font-bold text-epi-text">📍 {sel.district} District</h3>
                <div className="text-[11px] text-epi-muted mb-3">{sel.province === 'Kigali' ? 'Kigali City' : `${sel.province} Province`}</div>
              </div>
              <button aria-label="Close" onClick={() => setSelected(null)} className="text-epi-muted hover:text-epi-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-[12px] mb-3">
              <div className="flex justify-between"><span className="text-epi-muted">AI Risk Score:</span> <span className="font-bold" style={{ color: riskColor(sel.score) }}>{sel.score}/100 {riskLabel(sel.score)}</span></div>
              <div className="flex justify-between"><span className="text-epi-muted">Primary Threat:</span> <span className="font-bold text-epi-text">{sel.disease}</span></div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Active Alert:</span>{' '}
                <span className={`font-bold ${sel.alerts.length ? SEVERITY_META[sel.level].text : 'text-epi-muted'}`}>
                  {sel.alerts.length ? `${sel.alerts[0].id}${sel.alerts.length > 1 ? ` +${sel.alerts.length - 1}` : ''} ${SEVERITY_META[sel.level].emoji}` : 'None'}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-epi-muted">Cases this week:</span> <span className="font-bold text-epi-text">{sel.cases}</span></div>
              <div className="flex justify-between"><span className="text-epi-muted">AI confidence:</span> <span className="font-bold text-epi-text">{sel.confidence}%</span></div>
              <div className="flex justify-between"><span className="text-epi-muted">Population:</span> <span className="font-bold text-epi-text">~{DISTRICT_POP_K[sel.district]?.toLocaleString()}k</span></div>
              <div className="flex justify-between"><span className="text-epi-muted">Facilities:</span> <span className="text-epi-text">{facilitiesFor(sel.district)} health facilities</span></div>
            </div>

            {BORDER_DISTRICTS.includes(sel.district) &&
          <div className="bg-epi-amber/10 border border-epi-amber/30 p-2 rounded text-[11px] font-bold text-[#F57C00] mb-3">
                ⚠️ Border district — monitored for cross-border transmission
              </div>
          }

            <div className="flex gap-2">
              <Link to={`/prediction/map?district=${sel.district}`} className="flex-1 py-1.5 bg-epi text-white text-[11px] font-bold rounded text-center">
                View Full District →
              </Link>
              {sel.alerts.length ?
            <Link to={`/warning/detail?id=${sel.alerts[0].id}`} className="flex-1 py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded text-center">
                  Open Alert →
                </Link> :

            <Link to={`/warning/history?q=${sel.district}`} className="flex-1 py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded text-center">
                  Alert history →
                </Link>
            }
            </div>
          </div>
        }
      </div>

      {/* Top Title Bar (Small) */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-sm text-white/90 text-[11px] font-medium flex items-center px-6 z-20">
        Rwanda National Health Map | {fmtDateTime(nowISO())} | Schematic district positions
      </div>

      {/* Top Control Bar (Floating) */}
      <div className="absolute top-12 left-4 right-4 sm:left-6 sm:right-6 bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col xl:flex-row items-center justify-between gap-3 z-20">
        <div className="flex flex-wrap items-center gap-2">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg">
            {PROVINCE_OPTIONS.map((p) => <option key={p} value={p}>📍 {p === 'All Rwanda' || p === 'Kigali' ? p : `${p} Province`}</option>)}
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doFind();
            }}
            className="relative">

            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              list="geo-districts"
              placeholder="Find location..."
              className="w-40 text-[13px] border border-border rounded-md pl-3 pr-7 py-1.5 focus:outline-none" />
            <datalist id="geo-districts">{rows.map((r) => <option key={r.district} value={r.district} />)}</datalist>
            <button type="submit" aria-label="Find" className="absolute right-2 top-1/2 -translate-y-1/2 text-epi-muted"><Search className="w-3.5 h-3.5" /></button>
          </form>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))} className="px-3 py-1.5 bg-white hover:bg-epi-bg text-epi-text font-bold border-r border-border">
              +
            </button>
            <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))} className="px-3 py-1.5 bg-white hover:bg-epi-bg text-epi-text font-bold">
              -
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {LAYERS.map(([k, label]) =>
          <button
            key={k}
            onClick={() => setLayer(k)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${layer === k ? 'bg-epi text-white' : 'bg-white border border-border text-epi-muted hover:bg-epi-bg'}`}>
              {label}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white">
            {Object.keys(PERIODS).map((p) => <option key={p} value={p}>📅 {p}</option>)}
          </select>
          <button onClick={() => navigate('/geo/animation')} className="px-4 py-1.5 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark">
            🎬 Animate
          </button>
          <button onClick={exportMap} title="Download the current map layer data as CSV" className="px-4 py-1.5 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg">
            📤 Export Map
          </button>
        </div>
      </div>

      {/* Right Floating Panel */}
      {showRightPanel ?
      <div className="hidden lg:flex absolute top-40 xl:top-32 right-6 w-[320px] bg-white rounded-lg shadow-xl border border-border flex-col z-20 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-[14px] font-bold text-epi-text">Rwanda At a Glance</h2>
            <button aria-label="Hide panel" onClick={() => setShowRightPanel(false)} className="text-epi-muted hover:text-epi-text">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">National risk summary</div>
              <div className="flex items-end gap-2">
                <span className="text-[18px] font-bold" style={{ color: riskColor(national) }}>
                  {riskLabel(national)} {national >= 80 ? 'CRITICAL' : national >= 60 ? 'HIGH' : national >= 40 ? 'MODERATE' : 'LOW'} RISK
                </span>
              </div>
              <div className="text-[13px] text-epi-text font-medium mt-1">Average district score: {national}/100</div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">Active alerts summary</div>
              <Link to="/warning/alerts" className="flex flex-wrap gap-2">
                <span className="bg-epi-red/10 text-epi-red text-[12px] font-bold px-2 py-1 rounded border border-epi-red/20">🔴 {counts.red} Red</span>
                <span className="bg-[#F57C00]/10 text-[#F57C00] text-[12px] font-bold px-2 py-1 rounded border border-[#F57C00]/20">🟠 {counts.orange} Orange</span>
                <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[12px] font-bold px-2 py-1 rounded border border-[#F59E0B]/20">🟡 {counts.yellow} Yellow</span>
              </Link>
            </div>

            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">Top 3 threat districts</div>
              <div className="space-y-2 text-[13px]">
                {top3.map((r, i) =>
              <button key={r.district} onClick={() => setSelected(r.district)} className="w-full flex justify-between items-center bg-epi-bg p-2 rounded hover:bg-epi/10">
                    <span className="font-bold text-epi-text">{i + 1}. {r.district}</span>
                    <span className="font-bold" style={{ color: riskColor(r.score) }}>{r.score}/100 {riskLabel(r.score)}</span>
                  </button>
              )}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">Live stats</div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between"><span className="text-epi-muted">Open alerts (national):</span> <span className="font-bold text-epi-text">{open.length}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Cases this week (mapped):</span> <span className="font-bold text-epi-text">{rows.reduce((s, r) => s + r.cases, 0).toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Data sources online:</span>{' '}
                  <span className="font-bold text-epi-text">
                    {state.sources.filter((s) => s.status === 'active').length}/{state.sources.length}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/epi" className="w-full py-2 bg-epi/5 border border-epi/20 text-epi text-[13px] font-bold rounded hover:bg-epi/10 transition-colors flex items-center justify-center gap-1">
              Open Full Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div> :

      <button onClick={() => setShowRightPanel(true)} className="hidden lg:block absolute top-40 xl:top-32 right-6 z-20 px-3 py-1.5 bg-white rounded-md shadow-lg border border-border text-[12px] font-bold text-epi">
          Show summary
        </button>
      }

      {/* Map Legend (Floating Bottom Left) */}
      <div className="hidden sm:block absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4 z-20 w-64">
        <div className="text-[11px] font-bold text-epi-text mb-2">{LAYERS.find(([k]) => k === layer)?.[1].slice(3)}</div>
        {layer === 'risk' || layer === 'cases' ?
        <>
            <div className="flex items-center gap-1 mb-1">
              <div className="flex-1 h-2 bg-[#00A550] rounded-l"></div>
              <div className="flex-1 h-2 bg-[#F59E0B]"></div>
              <div className="flex-1 h-2 bg-[#F57C00]"></div>
              <div className="flex-1 h-2 bg-[#D32F2F] rounded-r"></div>
            </div>
            <div className="flex justify-between text-[9px] font-bold mb-3">
              <span className="text-[#00A550]">🟢 Low</span>
              <span className="text-[#F59E0B]">🟡 Mod</span>
              <span className="text-[#F57C00]">🟠 High</span>
              <span className="text-[#D32F2F]">🔴 Crit</span>
            </div>
            <div className="text-[10px] text-epi-muted">{layer === 'risk' ? 'Circle size and label = AI risk score (0–100)' : 'Relative weekly case load'}</div>
          </> :

        <div className="text-[10px] text-epi-muted">
            {layer === 'alerts' && 'Colour = highest open alert severity; label = number of open alerts.'}
            {layer === 'facilities' && 'Label = number of health facilities (approx.).'}
            {layer === 'population' && 'Label = population in thousands (2022 census, approx.).'}
            {layer === 'environment' && 'Label = monthly rainfall in mm (demonstration values).'}
            {layer === 'border' && 'Highlighted districts share an international border.'}
          </div>
        }
        <div className="mt-3 pt-2 border-t border-border grid grid-cols-2 gap-1 text-[10px] text-epi-muted">
          <span>🏕️ Refugee camp</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 border-t-2 border-dashed border-[#F57C00]" /> DRC border</span>
        </div>
        <div className="text-[9px] text-epi-muted mt-2">Click a district for details. Positions are schematic.</div>
      </div>
    </GeoLayout>);

}
