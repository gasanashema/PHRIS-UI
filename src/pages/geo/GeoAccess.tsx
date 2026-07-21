import React, { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { AlertTriangle } from 'lucide-react';
export function GeoAccess() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <GeoLayout breadcrumb="Accessibility Map" hideHeader={true}>
      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[13px] font-bold text-epi-muted">
            <span className="text-epi-text mr-1">Travel mode:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="mode" className="accent-epi" /> Walking
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-epi-text">
              <input
                type="radio"
                name="mode"
                defaultChecked
                className="accent-epi" />
              {' '}
              Motorcycle
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="mode" className="accent-epi" /> Vehicle
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option>Health Center+ ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option>Travel Time Zones ▼</option>
          </select>
        </div>
      </div>

      <div className="absolute inset-0 flex">
        {/* Main Map Area (65%) */}
        <div className="w-[65%] h-full relative bg-[#E5E7EB] overflow-hidden">
          {/* Muted Grey Fill Map */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)',
              backgroundSize: '15px 15px'
            }}>
          </div>

          {/* District Boundaries (White) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            viewBox="0 0 100 100"
            preserveAspectRatio="none">
            
            <path
              d="M20,20 L40,10 L60,20 L80,10 L90,40 L80,70 L60,90 L40,80 L20,90 L10,60 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M40,10 L50,40 L20,20"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M60,20 L50,40 L80,10"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M50,40 L60,90"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M50,40 L40,80"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
          </svg>

          {/* Accessibility Zones */}

          {/* Zone 1: 0-30 min (Teal) */}
          <div className="absolute top-[40%] left-[50%] w-48 h-48 bg-epi/40 rounded-full blur-xl mix-blend-multiply"></div>
          <div className="absolute bottom-[30%] left-[40%] w-32 h-32 bg-epi/40 rounded-full blur-xl mix-blend-multiply"></div>
          <div className="absolute top-[20%] left-[40%] w-24 h-24 bg-epi/40 rounded-full blur-xl mix-blend-multiply"></div>

          {/* Zone 2: 30m-1h (Light Green) */}
          <div className="absolute top-[35%] left-[45%] w-64 h-64 bg-[#00A550]/30 rounded-full blur-2xl mix-blend-multiply"></div>
          <div className="absolute bottom-[25%] left-[35%] w-48 h-48 bg-[#00A550]/30 rounded-full blur-2xl mix-blend-multiply"></div>

          {/* Zone 3: 1-2h (Amber) */}
          <div className="absolute top-[25%] left-[30%] w-40 h-40 bg-epi-amber/40 rounded-full blur-xl mix-blend-multiply"></div>
          <div className="absolute bottom-[20%] left-[25%] w-32 h-32 bg-epi-amber/40 rounded-full blur-xl mix-blend-multiply"></div>
          <div className="absolute bottom-[40%] right-[20%] w-48 h-48 bg-epi-amber/30 rounded-full blur-xl mix-blend-multiply"></div>

          {/* Zone 4: 2+ hours GAP ZONE (Red Hatched) */}
          <div
            className="absolute bottom-[15%] left-[30%] w-24 h-20 rounded-full blur-md cursor-pointer hover:scale-105 transition-transform z-20"
            style={{
              background:
              'repeating-linear-gradient(45deg, rgba(211,47,47,0.6), rgba(211,47,47,0.6) 5px, rgba(211,47,47,0.2) 5px, rgba(211,47,47,0.2) 10px)'
            }}
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-1 rounded text-[10px] font-bold text-epi-red whitespace-nowrap shadow-sm">
              ⚠️ Coverage gap
            </div>
          </div>

          <div
            className="absolute top-[15%] left-[25%] w-20 h-24 rounded-full blur-md"
            style={{
              background:
              'repeating-linear-gradient(45deg, rgba(211,47,47,0.6), rgba(211,47,47,0.6) 5px, rgba(211,47,47,0.2) 5px, rgba(211,47,47,0.2) 10px)'
            }}>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-1 rounded text-[10px] font-bold text-epi-red whitespace-nowrap shadow-sm">
              ⚠️ Coverage gap
            </div>
          </div>

          {/* Hover Popup */}
          {showPopup &&
          <div className="absolute bottom-[25%] left-[35%] bg-white rounded-lg shadow-xl border border-border p-4 w-72 z-30 pointer-events-none">
              <h3 className="text-[14px] font-bold text-epi-red flex items-center gap-2 mb-1">
                ⚠️ Coverage Gap Zone
              </h3>
              <div className="text-[12px] font-bold text-epi-text">
                Nkomane Sector, Nyaruguru District
              </div>
              <div className="text-[11px] text-epi-muted mb-3">
                Southern Province
              </div>

              <div className="space-y-2 text-[12px] mb-3">
                <div>
                  <span className="text-epi-muted">
                    Travel time to nearest facility:
                  </span>
                  <br />
                  <span className="font-bold text-epi-red">
                    2h 45min by motorcycle
                  </span>
                  <br />
                  <span className="text-[11px] text-epi-muted">
                    (Nyaruguru Health Center)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">
                    Population living in gap:
                  </span>{' '}
                  <span className="font-bold text-epi-text">6,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Under-5 children:</span>{' '}
                  <span className="font-bold text-epi-text">~930</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Pregnant women:</span>{' '}
                  <span className="font-bold text-epi-text">~186</span>
                </div>
                <div>
                  <span className="text-epi-muted">Nearest CHW:</span>{' '}
                  <span className="font-bold text-epi-text">4 active CHWs</span>
                  <br />
                  <span className="text-[11px] text-epi-muted">
                    covering this sector
                  </span>
                </div>
              </div>

              <div className="bg-epi-bg p-2 rounded border border-border mb-3">
                <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                  Recommendation:
                </div>
                <div className="text-[12px] font-bold text-epi-text">
                  Mobile clinic deployment —
                </div>
                <div className="text-[11px] text-epi-text">
                  2x/month would serve this area
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="w-full py-1.5 bg-epi text-white text-[11px] font-bold rounded">
                  Plan Mobile Clinic →
                </button>
                <button className="w-full py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded">
                  Add to Coverage Report →
                </button>
              </div>
            </div>
          }
        </div>

        {/* Right Panel (35%) */}
        <div className="w-[35%] h-full bg-white border-l border-border flex flex-col pt-20 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">
              Rwanda Healthcare Access
            </h2>

            {/* Access Summary */}
            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Access summary
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-epi-text">Within 30 min:</span>
                    <span className="font-bold text-[#00A550]">
                      4.2M people (35%) 🟢
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-epi-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00A550]"
                      style={{
                        width: '35%'
                      }}>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-epi-text">30 min–1 hour:</span>
                    <span className="font-bold text-epi-amber">
                      5.8M people (48%) 🟡
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-epi-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-epi-amber"
                      style={{
                        width: '48%'
                      }}>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-epi-text">1–2 hours:</span>
                    <span className="font-bold text-[#F97316]">
                      1.6M people (13%) 🟠
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-epi-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F97316]"
                      style={{
                        width: '13%'
                      }}>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="text-epi-text">2+ hours:</span>
                    <span className="font-bold text-epi-red">
                      480,000 people (4%) 🔴
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-epi-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-epi-red"
                      style={{
                        width: '4%'
                      }}>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Zone Analysis */}
            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Gap zone analysis
              </div>
              <div className="bg-epi-red/5 border border-epi-red/20 rounded-lg p-4 mb-4">
                <ul className="space-y-2 text-[13px] text-epi-text">
                  <li className="flex justify-between">
                    <span className="text-epi-muted">People in 2h+ gap:</span>
                    <span className="font-bold text-epi-red">480,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-epi-muted">Under-5 in gap:</span>
                    <span className="font-bold text-epi-text">~72,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-epi-muted">
                      Pregnant women in gap:
                    </span>
                    <span className="font-bold text-epi-text">~14,400</span>
                  </li>
                </ul>
              </div>
              <div className="text-[13px] font-bold text-epi-text mb-2">
                Districts with largest gaps:
              </div>
              <ul className="space-y-1.5 text-[13px] text-epi-muted ml-2">
                <li>
                  • Nyaruguru:{' '}
                  <span className="font-bold text-epi-text">48,000</span> in gap
                </li>
                <li>
                  • Nyamagabe:{' '}
                  <span className="font-bold text-epi-text">41,000</span> in gap
                </li>
                <li>
                  • Rutsiro:{' '}
                  <span className="font-bold text-epi-text">38,000</span> in gap
                </li>
              </ul>
            </div>

            {/* Terrain Note */}
            <div className="bg-epi/10 border border-epi/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[16px]">🏔️</span>
                <h3 className="text-[13px] font-bold text-epi-text">
                  Rwanda Terrain Note:
                </h3>
              </div>
              <p className="text-[12px] text-epi-text leading-relaxed">
                Northern and Western provinces have mountainous terrain — actual
                travel times are 2–3× longer than straight-line distance. This
                map uses terrain-adjusted travel times from RLMUA road network
                data.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button className="w-full py-3 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
                Generate Accessibility Report
              </button>
              <button className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Export Gap Zone Data (Excel)
              </button>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}