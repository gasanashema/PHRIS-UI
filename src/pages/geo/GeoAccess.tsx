import { useState } from 'react';
import { X, Check, Mountain } from 'lucide-react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { useApp, useCurrentUser } from '../../store/AppStore';
import { DISTRICT_XY, DISTRICT_POP_K } from '../../data/geo';
import { DISTRICT_PROVINCE } from '../../data/seed';
import { addDays, downloadFile, fmtDate, nowISO, toCSV } from '../../lib/format';

type Mode = 'Walking' | 'Motorcycle' | 'Vehicle';
const MODE_FACTOR: Record<Mode, number> = { Walking: 2.6, Motorcycle: 1, Vehicle: 0.75 };
const LEVELS: Record<string, number> = { 'Health Post+': 0.55, 'Health Center+': 1, 'District Hospital': 2.1 };
// Terrain-adjusted motorcycle minutes from the remotest populated cell to the nearest health centre
const BASE_MIN: Record<string, number> = {
  Nyaruguru: 165, Nyamagabe: 140, Rutsiro: 130, Ngororero: 105, Karongi: 100, Nyamasheke: 115, Rusizi: 95, Burera: 110, Gakenke: 100, Nyabihu: 95,
  Gicumbi: 85, Rulindo: 75, Musanze: 60, Rubavu: 55, Huye: 70, Gisagara: 80, Nyanza: 65, Ruhango: 65, Muhanga: 70, Kamonyi: 60,
  Bugesera: 75, Ngoma: 70, Kirehe: 90, Kayonza: 85, Gatsibo: 80, Nyagatare: 95, Rwamagana: 55, Nyarugenge: 20, Gasabo: 30, Kicukiro: 25
};
const GAP_SECTOR: Record<string, string> = { Nyaruguru: 'Nkomane', Nyamagabe: 'Kitabi', Rutsiro: 'Mushonyi', Nyamasheke: 'Bushekeri', Ngororero: 'Muhanda', Burera: 'Kagogo', Karongi: 'Mutuntu', Rusizi: 'Bweyeye', Gakenke: 'Coko', Nyabihu: 'Jomba' };
const BANDS = [
{ max: 30, label: 'Within 30 min', color: '#104E49', text: 'text-[#00A550]', bar: 'bg-[#00A550]', icon: '●' },
{ max: 60, label: '30 min–1 hour', color: '#00A550', text: 'text-epi-amber', bar: 'bg-epi-amber', icon: '●' },
{ max: 120, label: '1–2 hours', color: '#F59E0B', text: 'text-[#F97316]', bar: 'bg-[#F97316]', icon: '●' },
{ max: Infinity, label: '2+ hours', color: '#D32F2F', text: 'text-epi-red', bar: 'bg-epi-red', icon: '●' }];

const bandOf = (m: number) => BANDS.findIndex((b) => m <= b.max);
const fmtMin = (m: number) => m < 60 ? `${Math.round(m)} min` : `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, '0')}min`;

export function GeoAccess() {
  const { state, actions } = useApp();
  const user = useCurrentUser('epi');
  const [mode, setMode] = useState<Mode>('Motorcycle');
  const [level, setLevel] = useState('Health Center+');
  const [view, setView] = useState('zones');
  const [selected, setSelected] = useState<string | null>('Nyaruguru');

  const rows = Object.keys(DISTRICT_XY).map((d) => {
    const minutes = BASE_MIN[d] * MODE_FACTOR[mode] * LEVELS[level];
    const pop = DISTRICT_POP_K[d] * 1000;
    // share of the district population beyond 2 hours grows with remoteness
    const gapShare = Math.max(0, Math.min(0.35, (minutes - 90) / 600));
    return { district: d, minutes, band: bandOf(minutes), pop, gap: Math.round(pop * gapShare / 100) * 100 };
  });
  const totalPop = rows.reduce((s, r) => s + r.pop, 0);
  const bandPop = BANDS.map((_, i) => rows.filter((r) => r.band === i).reduce((s, r) => s + r.pop, 0));
  const gapTotal = rows.reduce((s, r) => s + r.gap, 0);
  const worst = [...rows].sort((a, b) => b.gap - a.gap).filter((r) => r.gap > 0).slice(0, 3);
  const sel = selected ? rows.find((r) => r.district === selected) : undefined;
  const planned = (d: string) => state.interventions.some((i) => i.district === d && i.action.startsWith('Mobile clinic'));
  const fmtPeople = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n.toLocaleString();

  const planClinic = (d: string) => {
    actions.addIntervention({
      date: nowISO(),
      due: addDays(nowISO(), 14),
      action: `Mobile clinic — ${GAP_SECTOR[d] ?? 'remote'} sector (2×/month)`,
      disease: 'All',
      sector: GAP_SECTOR[d] ?? '—',
      district: d,
      who: user.name,
      status: 'Planned',
      outcome: 'Pending deployment',
      notes: `Planned from Accessibility Map: ${fmtPeople(rows.find((r) => r.district === d)?.gap ?? 0)} people beyond 2h by ${mode.toLowerCase()} to ${level}.`
    });
    actions.toast(`Mobile clinic planned for ${d}. It now appears in the intervention log.`);
  };
  const addFinding = (d: string, minutes: number, gap: number) =>
  actions.addFinding({
    source: 'Accessibility Map',
    title: `${d}: ${fmtPeople(gap)} people beyond 2h to ${level}`,
    detail: `Remotest areas (${GAP_SECTOR[d] ?? 'remote sectors'}) need ${fmtMin(minutes)} by ${mode.toLowerCase()}. Recommend mobile clinic deployment.`
  });
  const exportData = () =>
  downloadFile(
    `access-gap-zones-${mode.toLowerCase()}.csv`,
    toCSV(rows.map((r) => ({ district: r.district, province: DISTRICT_PROVINCE[r.district], travel_mode: mode, facility_level: level, max_travel_minutes: Math.round(r.minutes), band: BANDS[r.band].label, population: r.pop, people_beyond_2h: r.gap }))),
    'text/csv'
  );
  const report = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Accessibility Report</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;color:#1A1A2E}h1{color:#104E49}td,th{border:1px solid #E5E7EB;padding:6px 10px;text-align:left}table{border-collapse:collapse}</style></head><body>
<h1>Rwanda Healthcare Accessibility Report</h1><p>Travel mode: ${mode} · Facility level: ${level} · ${fmtDate(nowISO())}</p>
<h2>Access summary</h2><ul>${BANDS.map((b, i) => `<li>${b.label}: ${fmtPeople(bandPop[i])} people (${Math.round(bandPop[i] / totalPop * 100)}%)</li>`).join('')}</ul>
<h2>Districts with largest gaps</h2><table><tr><th>District</th><th>Max travel time</th><th>People beyond 2h</th></tr>${worst.map((r) => `<tr><td>${r.district}</td><td>${fmtMin(r.minutes)}</td><td>${r.gap.toLocaleString()}</td></tr>`).join('')}</table>
<p style="color:#6B7280;font-size:12px">Demonstration estimates from the AI Vital prototype.</p></body></html>`;
    downloadFile('accessibility-report.html', html, 'text/html');
  };

  return (
    <GeoLayout breadcrumb="Accessibility Map" hideHeader={true}>
      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 lg:right-[37%] bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex flex-wrap items-center gap-3 text-[13px] font-bold text-epi-muted">
          <span className="text-epi-text mr-1">Travel mode:</span>
          {(Object.keys(MODE_FACTOR) as Mode[]).map((m) =>
          <label key={m} className={`flex items-center gap-1 cursor-pointer ${mode === m ? 'text-epi-text' : ''}`}>
              <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} className="accent-epi" /> {m}
            </label>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select aria-label="Facility level" value={level} onChange={(e) => setLevel(e.target.value)} className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            {Object.keys(LEVELS).map((l) => <option key={l}>{l}</option>)}
          </select>
          <select aria-label="Map view" value={view} onChange={(e) => setView(e.target.value)} className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option value="zones">Travel Time Zones</option>
            <option value="gaps">Gap Zones Only</option>
          </select>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Main Map Area */}
        <div className="w-full lg:w-[65%] min-h-[560px] lg:h-full relative bg-[#E5E7EB] overflow-hidden shrink-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
          </div>

          <div className="absolute top-[150px] md:top-[100px] bottom-10 left-8 right-8">
            {rows.map((r) => {
              const p = DISTRICT_XY[r.district];
              const b = BANDS[r.band];
              const hidden = view === 'gaps' && r.band < 3;
              const isGap = r.band === 3;
              return (
                <button
                  key={r.district}
                  onClick={() => setSelected(selected === r.district ? null : r.district)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}>

                  {!hidden &&
                  <span
                    className="absolute rounded-full blur-md"
                    style={{
                      width: 60,
                      height: 60,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-60%)',
                      background: isGap ?
                      'repeating-linear-gradient(45deg, rgba(211,47,47,0.6), rgba(211,47,47,0.6) 5px, rgba(211,47,47,0.2) 5px, rgba(211,47,47,0.2) 10px)' :
                      `${b.color}66`
                    }} />
                  }
                  {isGap &&
                  <span className="relative bg-white/90 px-1 rounded text-[10px] font-bold text-epi-red whitespace-nowrap shadow-sm">Coverage gap</span>
                  }
                  <span className={`relative text-[10px] font-medium ${selected === r.district ? 'text-epi-text font-bold underline' : 'text-epi-text/70'} ${hidden ? 'opacity-40' : ''}`}>{r.district}</span>
                </button>);

            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow border border-border p-3 text-[10px] font-medium text-epi-muted space-y-1">
            {BANDS.map((b) =>
            <div key={b.label} className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: b.color }} /> {b.label}</div>
            )}
          </div>

          {/* District popup */}
          {sel &&
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl border border-border p-4 w-72 max-w-[calc(100%-32px)] z-30">
              <div className="flex justify-between">
                <h3 className={`text-[14px] font-bold flex items-center gap-2 mb-1 ${sel.band === 3 ? 'text-epi-red' : 'text-epi-text'}`}>
                  {sel.band === 3 ? 'Coverage Gap Zone' : `${BANDS[sel.band].icon} Access Zone`}
                </h3>
                <button aria-label="Close" onClick={() => setSelected(null)} className="text-epi-muted hover:text-epi-text"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-[12px] font-bold text-epi-text">
                {GAP_SECTOR[sel.district] ? `${GAP_SECTOR[sel.district]} Sector, ` : ''}{sel.district} District
              </div>
              <div className="text-[11px] text-epi-muted mb-3">{DISTRICT_PROVINCE[sel.district] === 'Kigali' ? 'Kigali City' : `${DISTRICT_PROVINCE[sel.district]} Province`}</div>

              <div className="space-y-2 text-[12px] mb-3">
                <div>
                  <span className="text-epi-muted">Travel time to nearest facility ({level}):</span>
                  <br />
                  <span className={`font-bold ${BANDS[sel.band].text}`}>{fmtMin(sel.minutes)} by {mode.toLowerCase()}</span>
                </div>
                <div className="flex justify-between"><span className="text-epi-muted">Population beyond 2h:</span> <span className="font-bold text-epi-text">{sel.gap.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Under-5 children:</span> <span className="font-bold text-epi-text">~{Math.round(sel.gap * 0.15).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-epi-muted">Pregnant women:</span> <span className="font-bold text-epi-text">~{Math.round(sel.gap * 0.03).toLocaleString()}</span></div>
              </div>

              {sel.band >= 2 &&
            <div className="bg-epi-bg p-2 rounded border border-border mb-3">
                  <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">Recommendation:</div>
                  <div className="text-[12px] font-bold text-epi-text">Mobile clinic deployment —</div>
                  <div className="text-[11px] text-epi-text">2x/month would serve this area</div>
                </div>
            }

              <div className="flex flex-col gap-2">
                {sel.band >= 2 && (
              planned(sel.district) ?
              <span className="w-full py-1.5 bg-epi-accent/10 text-epi-accent text-[11px] font-bold rounded text-center inline-flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Mobile clinic planned</span> :

              <button onClick={() => planClinic(sel.district)} className="w-full py-1.5 bg-epi text-white text-[11px] font-bold rounded">
                      Plan Mobile Clinic →
                    </button>)
              }
                <button onClick={() => addFinding(sel.district, sel.minutes, sel.gap)} className="w-full py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded">
                  Add to Coverage Report →
                </button>
              </div>
            </div>
          }
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[35%] lg:h-full bg-white border-l border-border flex flex-col lg:pt-6 lg:overflow-y-auto">
          <div className="p-6 flex flex-col flex-1">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">Rwanda Healthcare Access</h2>

            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Access summary — {mode.toLowerCase()} to {level}
              </div>
              <div className="space-y-3">
                {BANDS.map((b, i) => {
                  const pct = Math.round(bandPop[i] / totalPop * 100);
                  return (
                    <div key={b.label}>
                      <div className="flex justify-between text-[13px] mb-1">
                        <span className="text-epi-text">{b.label}:</span>
                        <span className={`font-bold ${b.text}`}>{fmtPeople(bandPop[i])} people ({pct}%) {b.icon}</span>
                      </div>
                      <div className="w-full h-1.5 bg-epi-bg rounded-full overflow-hidden">
                        <div className={`h-full ${b.bar}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>);

                })}
              </div>
              <p className="text-[11px] text-epi-muted mt-2">District-level bands use each district's remotest populated area.</p>
            </div>

            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Gap zone analysis</div>
              <div className="bg-epi-red/5 border border-epi-red/20 rounded-lg p-4 mb-4">
                <ul className="space-y-2 text-[13px] text-epi-text">
                  <li className="flex justify-between"><span className="text-epi-muted">People in 2h+ gap:</span> <span className="font-bold text-epi-red">{gapTotal.toLocaleString()}</span></li>
                  <li className="flex justify-between"><span className="text-epi-muted">Under-5 in gap:</span> <span className="font-bold text-epi-text">~{Math.round(gapTotal * 0.15).toLocaleString()}</span></li>
                  <li className="flex justify-between"><span className="text-epi-muted">Pregnant women in gap:</span> <span className="font-bold text-epi-text">~{Math.round(gapTotal * 0.03).toLocaleString()}</span></li>
                </ul>
              </div>
              <div className="text-[13px] font-bold text-epi-text mb-2">Districts with largest gaps:</div>
              {worst.length ?
              <ul className="space-y-1.5 text-[13px] text-epi-muted ml-2">
                  {worst.map((r) =>
                <li key={r.district}>
                      • <button onClick={() => setSelected(r.district)} className="hover:underline">{r.district}</button>:{' '}
                      <span className="font-bold text-epi-text">{r.gap.toLocaleString()}</span> in gap
                    </li>
                )}
                </ul> :

              <p className="text-[13px] text-epi-muted ml-2">No district has populations beyond 2 hours for this travel mode.</p>
              }
            </div>

            <div className="bg-epi/10 border border-epi/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="w-4 h-4 text-epi" />
                <h3 className="text-[13px] font-bold text-epi-text">Rwanda Terrain Note:</h3>
              </div>
              <p className="text-[12px] text-epi-text leading-relaxed">
                Northern and Western provinces have mountainous terrain — actual travel times are 2–3× longer than
                straight-line distance. Times shown are terrain-adjusted demonstration estimates.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button onClick={report} className="w-full py-3 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
                Generate Accessibility Report
              </button>
              <button onClick={exportData} className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Export Gap Zone Data (CSV)
              </button>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}
