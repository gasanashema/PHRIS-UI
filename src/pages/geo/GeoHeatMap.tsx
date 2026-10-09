import { useEffect, useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { Play, Pause, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { addDays, fmtDate, nowISO } from '../../lib/format';

const DISEASE_OPTIONS = [
['Cholera', 'Cholera'],
['Malaria', 'Malaria'],
['Measles', 'Measles'],
['Typhoid', 'Typhoid'],
['Malnutrition', 'Malnutrition']] as
const;

export function GeoHeatMap() {
  const { state } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [day, setDay] = useState(30); // 0 = 30 days ago, 30 = today
  const [disease, setDisease] = useState('Cholera');
  const [compare, setCompare] = useState(false);

  // Animation: advance one day every 350ms until today
  useEffect(() => {
    if (!isPlaying) return;
    const t = window.setInterval(() => {
      setDay((d) => {
        if (d >= 30) {
          setIsPlaying(false);
          return 30;
        }
        return d + 1;
      });
    }, 350);
    return () => window.clearInterval(t);
  }, [isPlaying]);

  const play = () => {
    if (day >= 30) setDay(0);
    setIsPlaying(true);
  };
  const intensity = 0.25 + 0.75 * (day / 30) ** 1.6;
  const currentDate = addDays(nowISO(), day - 30);
  const ranked = state.districtRisk.
  filter((r) => r.disease === disease).
  sort((a, b) => b.score - a.score);
  const total = ranked.reduce((s, r) => s + r.score, 0) || 1;
  const openAlerts = state.alerts.filter(
    (a) => a.disease === disease && ['active', 'acknowledged', 'escalated'].includes(a.status)
  );
  const isCholera = disease === 'Cholera';
  return (
    <GeoLayout breadcrumb="Disease Heat Map" hideHeader={true}>
      {/* Map Container (Fullscreen) */}
      <div className="absolute inset-0 bg-[#1A1A1A] overflow-hidden">
        {/* Simulated Dark Terrain Map */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
        </div>

        {/* Sector Boundaries (White 40% - visible when zoomed) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          
          <path
            d="M20,20 L25,15 L30,25 L20,20 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.2" />
          
          <path
            d="M30,25 L35,20 L40,30 L30,25 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.2" />
          
          <path
            d="M25,15 L35,20 L30,25 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.2" />
          
        </svg>

        {/* Heat Map Blobs — scaled by the animation day */}
        <div
          style={{ opacity: isCholera ? 1 : 0.35, transition: 'opacity 300ms' }}
          className="absolute inset-0">
        {/* Bugarama (Deep red, largest) */}
        <div
          className="absolute bottom-[15%] left-[15%] w-48 h-48 bg-[#7B0000] rounded-full blur-2xl cursor-pointer mix-blend-screen transition-all duration-300"
          style={{ opacity: 0.8 * intensity, transform: `scale(${0.5 + 0.5 * intensity})` }}
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}>

          {/* Core intensity */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#D32F2F] rounded-full blur-xl"></div>
        </div>

        {/* Kamembe/Rusizi town (Medium orange-red) */}
        <div
          className="absolute bottom-[22%] left-[12%] w-32 h-32 bg-[#F57C00] rounded-full blur-xl mix-blend-screen transition-all duration-300"
          style={{ opacity: 0.7 * intensity, transform: `scale(${0.5 + 0.5 * intensity})` }}>
        </div>

        {/* Karongi (Small amber) */}
        <div
          className="absolute bottom-[40%] left-[18%] w-20 h-20 bg-[#F59E0B] rounded-full blur-lg mix-blend-screen transition-all duration-300"
          style={{ opacity: 0.6 * Math.max(0.2, intensity - 0.2) }}>
        </div>

        {/* Huye (Tiny amber dot) */}
        <div
          className="absolute bottom-[25%] left-[40%] w-12 h-12 bg-[#F59E0B] rounded-full blur-md mix-blend-screen transition-all duration-300"
          style={{ opacity: 0.5 * intensity }}>
        </div>
        </div>

        {!isCholera &&
        <div className="absolute bottom-[45%] left-1/2 -translate-x-1/2 bg-black/70 text-white text-[12px] font-medium px-4 py-2 rounded-md z-10 text-center max-w-sm">
            Sector-level heat data is available for Cholera in this prototype. The panel on the right shows national {disease.toLowerCase()} risk from the latest prediction run.
          </div>
        }

        {/* Sector Labels (Simulated zoom-in view on Rusizi) */}
        {isCholera && day >= 20 &&
        <>
        <div className="absolute bottom-[16%] left-[16%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Bugarama Sector
          <br />
          38 cases ●
        </div>
        <div className="absolute bottom-[12%] left-[18%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Nzahaha Sector
          <br />
          24 cases ●
        </div>
        <div className="absolute bottom-[22%] left-[12%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Kamembe Sector
          <br />
          19 cases ●
        </div>
        <div className="absolute bottom-[18%] left-[10%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Gikundamvura Sector
          <br />6 cases ●
        </div>
        </>
        }

        {/* Hover Popup */}
        {showPopup &&
        <div className="absolute bottom-[25%] left-[25%] bg-white rounded-lg shadow-xl border border-border p-4 w-64 z-30 pointer-events-none">
            <h3 className="text-[13px] font-bold text-epi-text mb-1">
              Bugarama Sector, Rusizi District
            </h3>
            <div className="text-[14px] font-bold text-epi-red mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-epi-red" />
              <span>Cholera Cases This Week: 38</span>
            </div>

            <div className="space-y-1.5 text-[12px] mb-3">
              <div className="flex justify-between">
                <span className="text-epi-muted">Population:</span>{' '}
                <span className="font-bold text-epi-text">28,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Incidence:</span>{' '}
                <span className="font-bold text-epi-text">1.34 per 1,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">vs Last Week:</span>{' '}
                <span className="font-bold text-epi-red">+112% ↑ ↑</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Water quality:</span>{' '}
                <span className="font-bold text-epi-red">2/10 ●</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Nearest facility:</span>{' '}
                <span className="text-epi-text">Bugarama HC (1.2km)</span>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-2">
          <select
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            aria-label="Disease"
            className="text-[14px] font-bold text-epi-text border border-border rounded-md px-4 py-2 focus:outline-none bg-epi-bg shadow-sm">

            {DISEASE_OPTIONS.map(([v, label]) =>
            <option key={v} value={v}>{label}</option>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
          Showing: <span className="font-bold">{day === 30 ? 'This week' : fmtDate(currentDate)}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[12px] font-bold text-epi-muted">
            <label className="flex items-center gap-1 cursor-pointer text-epi-text">
              <input
                type="radio"
                name="view"
                defaultChecked
                className="accent-epi" />
              {' '}
              Heat map
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="view" className="accent-epi" />{' '}
              Choropleth
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="view" className="accent-epi" /> Bubble
              map
            </label>
          </div>
          <div className="w-px h-6 bg-border"></div>
          <button
            onClick={() => setCompare(!compare)}
            aria-pressed={compare}
            className="flex items-center gap-2 text-[12px] font-bold text-epi-text cursor-pointer">

            <div className={`w-8 h-4 rounded-full relative transition-colors ${compare ? 'bg-epi' : 'bg-border'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${compare ? 'left-4' : 'left-0.5'}`}></div>
            </div>
            Compare Two Periods
          </button>
        </div>
      </div>

      {/* Right Floating Panel */}
      <div className="absolute top-24 right-6 w-[320px] bg-white rounded-lg shadow-xl border border-border flex flex-col z-20">
        <div className="p-4 border-b border-border bg-epi-bg/50 rounded-t-lg">
          <h2 className="text-[15px] font-bold text-epi-text">
            {DISEASE_OPTIONS.find(([v]) => v === disease)?.[1]} — National Overview
          </h2>
        </div>

        {!isCholera &&
        <div className="p-5 space-y-4 text-[13px]">
            <div className="flex justify-between">
              <span className="text-epi-muted">Open alerts:</span>
              <span className="font-bold text-epi-text">{openAlerts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-epi-muted">Highest-risk district:</span>
              <span className="font-bold text-epi-text">
                {ranked[0] ? `${ranked[0].district} (${ranked[0].score}/100)` : '—'}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">
                AI risk score by district
              </div>
              {ranked.length === 0 && <div className="text-epi-muted">No districts list {disease} as top risk.</div>}
              {ranked.slice(0, 5).map((r) =>
            <div key={r.district} className="flex items-center gap-2 py-1">
                  <span className="w-24 font-bold text-epi-text">{r.district}</span>
                  <div className="flex-1 h-1.5 bg-epi-bg rounded-full">
                    <div
                  className="h-full rounded-full"
                  style={{ width: `${r.score}%`, background: r.score >= 80 ? '#D32F2F' : r.score >= 60 ? '#F97316' : r.score >= 40 ? '#EAB308' : '#00A550' }} />

                  </div>
                  <span className="w-12 text-right">{Math.round(r.score / total * 100)}%</span>
                </div>
            )}
            </div>
          </div>
        }

        {isCholera &&
        <div className="p-5 space-y-5">
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-epi-muted">National total this week:</span>{' '}
              <span className="font-bold text-epi-text text-[16px]">
                87 cases
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-epi-muted">Districts affected:</span>{' '}
              <span className="font-bold text-epi-text">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-epi-muted">Most affected:</span>{' '}
              <span className="font-bold text-epi-text">
                Rusizi (87% of cases)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-epi-muted">vs Last week:</span>{' '}
              <span className="font-bold text-epi-red">+45% ↑</span>
            </div>
            <div className="flex justify-between">
              <span className="text-epi-muted">Outbreak threshold:</span>{' '}
              <span className="text-epi-text">50/week</span>
            </div>
            {compare &&
            <div className="flex justify-between">
                <span className="text-epi-muted">Same week last month:</span>{' '}
                <span className="font-bold text-epi-text">9 cases (+867%)</span>
              </div>
            }
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-epi-muted">Status:</span>{' '}
              <span className="font-bold text-epi-red">● CROSSED</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">
              Case distribution
            </div>
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-epi-muted border-b border-border">
                  <th className="pb-1 font-medium">District</th>
                  <th className="pb-1 font-medium text-right">Cases</th>
                  <th className="pb-1 font-medium pl-2">% of National</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-1.5 font-bold text-epi-text">Rusizi</td>
                  <td className="py-1.5 text-right">87</td>
                  <td className="py-1.5 pl-2">
                    <div className="flex items-center gap-1">
                      <span className="w-6">87%</span>
                      <div className="flex-1 h-1.5 bg-epi-bg rounded-full">
                        <div
                          className="h-full bg-epi-red rounded-full"
                          style={{
                            width: '87%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-epi-text">Karongi</td>
                  <td className="py-1.5 text-right">8</td>
                  <td className="py-1.5 pl-2">
                    <div className="flex items-center gap-1">
                      <span className="w-6">8%</span>
                      <div className="flex-1 h-1.5 bg-epi-bg rounded-full">
                        <div
                          className="h-full bg-[#F57C00] rounded-full"
                          style={{
                            width: '8%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-epi-text">Huye</td>
                  <td className="py-1.5 text-right">4</td>
                  <td className="py-1.5 pl-2">
                    <div className="flex items-center gap-1">
                      <span className="w-6">4%</span>
                      <div className="flex-1 h-1.5 bg-epi-bg rounded-full">
                        <div
                          className="h-full bg-[#F59E0B] rounded-full"
                          style={{
                            width: '4%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-epi-muted">Other 27</td>
                  <td className="py-1.5 text-right text-epi-muted">1</td>
                  <td className="py-1.5 pl-2 text-epi-muted">
                    <div className="flex items-center gap-1">
                      <span className="w-6">1%</span>
                      <div className="flex-1 h-1.5 bg-epi-bg rounded-full">
                        <div
                          className="h-full bg-epi-muted rounded-full"
                          style={{
                            width: '1%'
                          }}>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => setCompare(!compare)}
              className="w-full py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">

              {compare ? 'Hide comparison' : 'Compare to Last Month'}
            </button>
            <button
              onClick={() => {
                setDay(0);
                setIsPlaying(true);
              }}
              className="w-full py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">

              Animate 30 days
            </button>
          </div>
        </div>
        }
      </div>

      {/* Bottom Time Slider (Floating) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4 z-20">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => isPlaying ? setIsPlaying(false) : play()}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            className="w-8 h-8 rounded-full bg-epi text-white flex items-center justify-center hover:bg-epi-dark shrink-0">

            {isPlaying ?
            <Pause className="w-4 h-4" /> :

            <Play className="w-4 h-4 ml-0.5" />
            }
          </button>
          <input
            type="range"
            min={0}
            max={30}
            value={day}
            onChange={(e) => {
              setIsPlaying(false);
              setDay(Number(e.target.value));
            }}
            aria-label="Timeline day"
            className="flex-1 accent-[#104E49]" />

        </div>
        <div className="flex justify-between text-[11px] font-bold text-epi-muted mb-2">
          <span>{fmtDate(addDays(nowISO(), -30))}</span>
          <span className="text-epi-text">{fmtDate(currentDate)}</span>
          <span>{fmtDate(nowISO())}</span>
        </div>
        <div className="flex justify-center items-center gap-2 text-[12px] font-bold text-epi">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Day {day} of 30</span>
          </span>
          <span className="text-border">|</span>
          <button onClick={play} className="hover:underline flex items-center gap-1">
            <span>Animate</span> <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </GeoLayout>);

}