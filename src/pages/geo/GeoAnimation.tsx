import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { Play, Pause, SkipForward, SkipBack, Check, Film } from 'lucide-react';

interface Sector {name: string;x: number;y: number;cases: number[];} // cases per day (8 days)
interface Scenario {
  key: string;
  disease: string;
  icon: string;
  district: string;
  alertId: string;
  dates: string[];
  sectors: Sector[];
  deaths: number[];
  source: {x: number;y: number;label: string;};
  response?: {x: number;y: number;label: string;day: number;};
  events: {day: number;color: string;text: string;}[];
}
const DATES = ['May 29', 'May 30', 'May 31', 'June 1', 'June 2', 'June 3', 'June 4', 'June 5'];
const SCENARIOS: Scenario[] = [
{
  key: 'cholera-rusizi', disease: 'Cholera', icon: '●', district: 'Rusizi', alertId: 'ALT-2026-001', dates: DATES,
  sectors: [
  { name: 'Bugarama', x: 25, y: 35, cases: [4, 9, 16, 24, 31, 38, 44, 41] },
  { name: 'Nzahaha', x: 55, y: 30, cases: [0, 0, 2, 6, 11, 17, 24, 22] },
  { name: 'Kamembe', x: 45, y: 60, cases: [0, 0, 0, 1, 4, 9, 14, 12] }],
  deaths: [0, 0, 1, 1, 2, 2, 3, 3],
  source: { x: 25, y: 35, label: 'Source: Bugarama water point' },
  response: { x: 28, y: 38, label: 'ORS + Water treatment deployed June 4', day: 6 },
  events: [
  { day: 0, color: '#D32F2F', text: '● First cases — Bugarama sector' },
  { day: 3, color: '#F59E0B', text: 'Alert ALT-001 generated' },
  { day: 5, color: '#1D72B8', text: 'Lab confirmed cholera' },
  { day: 6, color: '#00A550', text: 'ORS + water treatment deployed' },
  { day: 7, color: '#00A550', text: 'Cases declining' }]
},
{
  key: 'cholera-huye', disease: 'Cholera', icon: '●', district: 'Huye', alertId: 'ALT-2026-051', dates: DATES,
  sectors: [
  { name: 'Tumba', x: 40, y: 40, cases: [0, 2, 4, 7, 10, 14, 19, 23] },
  { name: 'Ngoma', x: 60, y: 45, cases: [0, 0, 1, 2, 4, 6, 8, 11] },
  { name: 'Mukura', x: 35, y: 65, cases: [0, 0, 0, 0, 1, 2, 3, 5] }],
  deaths: [0, 0, 0, 0, 0, 1, 1, 1],
  source: { x: 40, y: 40, label: 'Suspected source: Tumba spring' },
  events: [
  { day: 1, color: '#D32F2F', text: '● Cluster reported by Tumba HC' },
  { day: 4, color: '#1D72B8', text: 'RDT positive samples' },
  { day: 7, color: '#F59E0B', text: 'Red alert ALT-051 generated' }]
},
{
  key: 'malaria-kayonza', disease: 'Malaria', icon: '●', district: 'Kayonza', alertId: 'ALT-2026-002', dates: DATES,
  sectors: [
  { name: 'Rukara', x: 30, y: 30, cases: [40, 46, 55, 63, 72, 80, 86, 84] },
  { name: 'Mukarange', x: 60, y: 35, cases: [22, 25, 30, 36, 41, 47, 52, 50] },
  { name: 'Kabare', x: 50, y: 65, cases: [10, 12, 15, 19, 23, 26, 30, 29] }],
  deaths: [0, 0, 0, 1, 1, 1, 2, 2],
  source: { x: 30, y: 30, label: 'Breeding sites: Rukara wetlands' },
  response: { x: 34, y: 34, label: 'Indoor residual spraying started June 4', day: 6 },
  events: [
  { day: 0, color: '#D32F2F', text: '● Cases above seasonal baseline' },
  { day: 2, color: '#F59E0B', text: 'Alert ALT-002 generated' },
  { day: 6, color: '#00A550', text: 'Spraying campaign started' },
  { day: 7, color: '#00A550', text: 'Growth slowing' }]
}];

const SPEEDS: Record<string, number> = { '0.5x': 1600, '1x': 800, '2x': 400 };
const colorFor = (c: number) => c >= 30 ? '#7B0000' : c >= 15 ? '#D32F2F' : c >= 6 ? '#F57C00' : c > 0 ? '#F59E0B' : 'transparent';

export function GeoAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(SCENARIOS[0].key);
  const [day, setDay] = useState(6);
  const [speed, setSpeed] = useState('1x');
  const [loop, setLoop] = useState(false);
  const sc = SCENARIOS.find((s) => s.key === key) ?? SCENARIOS[0];
  const last = sc.dates.length - 1;
  const diseases = Array.from(new Set(SCENARIOS.map((s) => s.disease)));

  useEffect(() => {
    if (!isPlaying) return;
    const t = window.setInterval(() => {
      setDay((d) => {
        if (d < last) return d + 1;
        if (loop) return 0;
        setIsPlaying(false);
        return d;
      });
    }, SPEEDS[speed]);
    return () => window.clearInterval(t);
  }, [isPlaying, speed, loop, last]);

  const play = () => {
    if (!isPlaying && day === last) setDay(0);
    setIsPlaying(!isPlaying);
  };
  const choose = (k: string) => {
    setKey(k);
    setDay(0);
    setIsPlaying(false);
  };
  const pct = day / last * 100;
  const total = sc.sectors.reduce((s, x) => s + x.cases[day], 0);
  const affected = sc.sectors.filter((x) => x.cases[day] > 0).length;
  const peak = Math.max(...sc.sectors.flatMap((x) => x.cases));

  return (
    <GeoLayout breadcrumb="Spread Animation" hideHeader={true}>
      {/* Small Page Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-white/90 backdrop-blur-sm border-b border-border flex items-center px-6 z-20">
        <span className="text-[13px] font-bold text-epi-text truncate inline-flex items-center gap-2">
          <Film className="w-4 h-4 text-epi" />
          <span>Outbreak Spread Animation | {sc.disease} — {sc.district} District | {sc.dates[0]} → {sc.dates[last]}, 2026</span>
        </span>
      </div>

      {/* Top Controls */}
      <div className="absolute top-14 left-6 right-6 sm:right-auto bg-white rounded-lg shadow-lg border border-border p-2 flex flex-wrap items-center gap-2 z-20">
        <select
          value={sc.disease}
          onChange={(e) => choose(SCENARIOS.find((s) => s.disease === e.target.value)!.key)}
          className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg">
          {diseases.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={key} onChange={(e) => choose(e.target.value)} className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg">
          {SCENARIOS.filter((s) => s.disease === sc.disease).map((s) => <option key={s.key} value={s.key}>{s.district} District</option>)}
        </select>
        <div className="text-[12px] font-medium text-epi-muted px-2">
          Date range: {sc.dates[0]} – {sc.dates[last]}, 2026
        </div>
        <Link to={`/warning/detail?id=${sc.alertId}`} className="text-[12px] font-bold text-epi hover:underline px-2">
          Open alert →
        </Link>
      </div>

      {/* Main Map Area */}
      <div className="absolute inset-0 bg-[#1A1A1A] overflow-hidden pt-10 pb-[120px]">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20,20 L40,30 L30,50 L10,40 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.2" />
          <path d="M40,30 L60,20 L70,40 L50,50 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.2" />
          <path d="M30,50 L50,50 L60,70 L40,80 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.2" />
        </svg>

        {/* Sector spread — size and colour follow the selected day's cases */}
        {sc.sectors.map((s) => {
          const c = s.cases[day];
          const size = c ? 40 + c / peak * 160 : 0;
          return (
            <div key={s.name}>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl mix-blend-screen transition-all duration-500"
                style={{ top: `${s.y}%`, left: `${s.x}%`, width: size, height: size, background: colorFor(c), opacity: c ? 0.8 : 0 }} />
              <div className="absolute -translate-x-1/2 text-white/70 text-[12px] font-bold pointer-events-none text-center" style={{ top: `calc(${s.y}% + 18px)`, left: `${s.x}%` }}>
                {s.name}
                <div className="text-[11px] text-white">{c} cases</div>
              </div>
            </div>);

        })}

        <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ top: `${sc.source.y}%`, left: `${sc.source.x}%` }}>
          <div className="w-4 h-4 bg-[#1D72B8] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">●</div>
          <span className="text-[10px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">{sc.source.label}</span>
        </div>

        {sc.response && day >= sc.response.day &&
        <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ top: `${sc.response.y + 6}%`, left: `${sc.response.x + 4}%` }}>
            <div className="w-4 h-4 bg-[#00A550] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-bold mt-1 bg-white/90 text-[#00A550] px-1 rounded shadow-sm whitespace-nowrap">{sc.response.label}</span>
          </div>
        }

        {/* AI projection outlines appear on the final day */}
        {day === last &&
        <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M15,25 Q30,10 65,20 T75,50 T50,85 T15,60 Z" fill="none" stroke="#D32F2F" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.8" />
              <path d="M20,30 Q35,20 60,25 T65,45 T45,70 T20,55 Z" fill="none" stroke="#00A550" strokeWidth="0.3" opacity="0.8" />
            </svg>
            <div className="absolute top-[15%] left-[65%] text-[10px] font-bold text-[#D32F2F] bg-white/80 px-1 rounded">AI projection: if no intervention</div>
            <div className="absolute top-[25%] left-[60%] text-[10px] font-bold text-[#00A550] bg-white/80 px-1 rounded">With intervention</div>
          </>
        }
      </div>

      {/* Bottom Animation Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border flex flex-col z-20">
        <div className="min-h-[72px] px-4 sm:px-6 py-2 flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="hidden sm:block text-[12px] font-bold text-epi-muted w-24 text-right">Day 1 — {sc.dates[0]}</div>

          <div className="flex items-center gap-2">
            <button aria-label="Previous day" onClick={() => setDay((d) => Math.max(0, d - 1))} className="text-epi-muted hover:text-epi-text">
              <SkipBack className="w-4 h-4" />
            </button>
            <button aria-label={isPlaying ? 'Pause' : 'Play'} onClick={play} className="w-8 h-8 rounded-full bg-epi text-white flex items-center justify-center hover:bg-epi-dark">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button aria-label="Next day" onClick={() => setDay((d) => Math.min(last, d + 1))} className="text-epi-muted hover:text-epi-text">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-[160px] relative flex items-center pt-5">
            <input
              type="range"
              aria-label="Timeline"
              min={0}
              max={last}
              value={day}
              onChange={(e) => {
                setIsPlaying(false);
                setDay(Number(e.target.value));
              }}
              className="w-full accent-epi" />
            {sc.events.map((ev) =>
            <div key={ev.text} title={`${sc.dates[ev.day]}: ${ev.text}`} className="absolute top-[calc(50%+10px)] -translate-x-1/2 w-2 h-2 rounded-full pointer-events-none" style={{ left: `${ev.day / last * 100}%`, background: ev.color }} />
            )}
            <div className="absolute top-0 text-[11px] font-bold text-epi bg-white px-2 py-0.5 rounded shadow-sm border border-border whitespace-nowrap" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
              Day {day + 1} — {sc.dates[day]}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select aria-label="Speed" value={speed} onChange={(e) => setSpeed(e.target.value)} className="text-[12px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              {Object.keys(SPEEDS).map((s) => <option key={s}>{s}</option>)}
            </select>
            <select aria-label="Loop" value={loop ? 'on' : 'off'} onChange={(e) => setLoop(e.target.value === 'on')} className="text-[12px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option value="off">Loop: Off</option>
              <option value="on">Loop: On</option>
            </select>
          </div>

          <div className="hidden sm:block text-[12px] font-bold text-epi-muted w-24">Day {last + 1} — {sc.dates[last]}</div>
        </div>

        <div className="bg-epi-bg border-t border-border px-4 sm:px-6 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="text-[13px] font-bold text-epi-text flex flex-wrap gap-x-4">
            <span>Cases: <span className="text-epi-red">{total}</span></span>
            <span className="text-border">|</span>
            <span>Districts: 1</span>
            <span className="text-border">|</span>
            <span>Sectors affected: {affected}</span>
            <span className="text-border">|</span>
            <span>Deaths: <span className="text-epi-red">{sc.deaths[day]}</span></span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-epi-muted">
            {sc.events.map((ev) =>
            <button key={ev.text} onClick={() => setDay(ev.day)} className={`flex items-center gap-1 hover:text-epi-text ${ev.day <= day ? 'text-epi-text' : 'opacity-50'}`}>
                <span className="w-2 h-2 rounded-full" style={{ background: ev.color }}></span> {sc.dates[ev.day]}: {ev.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </GeoLayout>);

}
