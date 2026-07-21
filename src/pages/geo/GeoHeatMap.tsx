import React, { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { Play, SkipForward, SkipBack, Pause } from 'lucide-react';
export function GeoHeatMap() {
  const [showPopup, setShowPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

        {/* Heat Map Blobs */}
        {/* Bugarama (Deep red, largest) */}
        <div
          className="absolute bottom-[15%] left-[15%] w-48 h-48 bg-[#7B0000] rounded-full blur-2xl opacity-80 cursor-pointer mix-blend-screen"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}>
          
          {/* Core intensity */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#D32F2F] rounded-full blur-xl"></div>
        </div>

        {/* Kamembe/Rusizi town (Medium orange-red) */}
        <div className="absolute bottom-[22%] left-[12%] w-32 h-32 bg-[#F57C00] rounded-full blur-xl opacity-70 mix-blend-screen"></div>

        {/* Karongi (Small amber) */}
        <div className="absolute bottom-[40%] left-[18%] w-20 h-20 bg-[#F59E0B] rounded-full blur-lg opacity-60 mix-blend-screen"></div>

        {/* Huye (Tiny amber dot) */}
        <div className="absolute bottom-[25%] left-[40%] w-12 h-12 bg-[#F59E0B] rounded-full blur-md opacity-50 mix-blend-screen"></div>

        {/* Sector Labels (Simulated zoom-in view on Rusizi) */}
        <div className="absolute bottom-[16%] left-[16%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Bugarama Sector
          <br />
          38 cases 🔴
        </div>
        <div className="absolute bottom-[12%] left-[18%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Nzahaha Sector
          <br />
          24 cases 🔴
        </div>
        <div className="absolute bottom-[22%] left-[12%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Kamembe Sector
          <br />
          19 cases 🟠
        </div>
        <div className="absolute bottom-[18%] left-[10%] text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
          Gikundamvura Sector
          <br />6 cases 🟡
        </div>

        {/* Hover Popup */}
        {showPopup &&
        <div className="absolute bottom-[25%] left-[25%] bg-white rounded-lg shadow-xl border border-border p-4 w-64 z-30 pointer-events-none">
            <h3 className="text-[13px] font-bold text-epi-text mb-1">
              Bugarama Sector, Rusizi District
            </h3>
            <div className="text-[14px] font-bold text-epi-red mb-3">
              💧 Cholera Cases This Week: 38
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
                <span className="font-bold text-epi-red">2/10 🔴</span>
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
          <select className="text-[14px] font-bold text-epi-text border border-border rounded-md px-4 py-2 focus:outline-none bg-epi-bg shadow-sm">
            <option>💧 Cholera ▼</option>
            <option>🦟 Malaria</option>
            <option>💉 Measles</option>
            <option>🌡️ Typhoid</option>
            <option>🍽️ Malnutrition</option>
            <option>All diseases</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white">
            <option>This Week ▼</option>
            <option>Today</option>
            <option>Month</option>
            <option>Last 3 months</option>
            <option>Custom</option>
            <option>Animate</option>
          </select>
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
          <label className="flex items-center gap-2 text-[12px] font-bold text-epi-text cursor-pointer">
            <div className="w-8 h-4 bg-border rounded-full relative">
              <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
            </div>
            Compare Two Periods
          </label>
        </div>
      </div>

      {/* Right Floating Panel */}
      <div className="absolute top-24 right-6 w-[320px] bg-white rounded-lg shadow-xl border border-border flex flex-col z-20">
        <div className="p-4 border-b border-border bg-epi-bg/50 rounded-t-lg">
          <h2 className="text-[15px] font-bold text-epi-text">
            💧 Cholera — National Overview
          </h2>
        </div>

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
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-epi-muted">Status:</span>{' '}
              <span className="font-bold text-epi-red">🔴 CROSSED</span>
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
            <button className="w-full py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
              Compare to Last Month
            </button>
            <button className="w-full py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">
              Animate 30 days
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Time Slider (Floating) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4 z-20">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-epi text-white flex items-center justify-center hover:bg-epi-dark">
            
            {isPlaying ?
            <Pause className="w-4 h-4" /> :

            <Play className="w-4 h-4 ml-0.5" />
            }
          </button>
          <div className="flex-1 relative h-2 bg-epi-bg rounded-full">
            <div
              className="absolute left-0 top-0 bottom-0 bg-epi rounded-full"
              style={{
                width: '100%'
              }}>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-epi rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="flex justify-between text-[11px] font-bold text-epi-muted mb-2">
          <span>May 5, 2026</span>
          <span className="text-epi-text">June 5, 2026</span>
        </div>
        <div className="flex justify-center items-center gap-2 text-[12px] font-bold text-epi">
          <span>📅 30 days</span>
          <span className="text-border">|</span>
          <button className="hover:underline flex items-center gap-1">
            ⏩ Animate <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </GeoLayout>);

}