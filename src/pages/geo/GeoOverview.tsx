import React, { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { X, ArrowRight, ArrowUpRight } from 'lucide-react';
export function GeoOverview() {
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  return (
    <GeoLayout breadcrumb="Main Map" hideHeader={true}>
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

        {/* District Boundaries (White 70%) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          
          {/* Abstracted district lines */}
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

        {/* District Fills */}
        {/* Rusizi (Critical) */}
        <div
          className="absolute bottom-[15%] left-[15%] w-32 h-32 bg-[#7B0000]/80 rounded-full blur-xl cursor-pointer"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}>
        </div>

        {/* Kayonza (Critical) */}
        <div className="absolute top-[30%] right-[20%] w-40 h-40 bg-[#D32F2F]/70 rounded-full blur-xl"></div>

        {/* High (Orange) */}
        <div className="absolute bottom-[30%] right-[30%] w-24 h-24 bg-[#F57C00]/60 rounded-full blur-xl"></div>
        <div className="absolute bottom-[25%] left-[40%] w-28 h-28 bg-[#F57C00]/60 rounded-full blur-xl"></div>

        {/* Moderate (Amber) */}
        <div className="absolute top-[20%] left-[40%] w-32 h-32 bg-[#F59E0B]/50 rounded-full blur-xl"></div>
        <div className="absolute top-[35%] left-[25%] w-24 h-24 bg-[#F59E0B]/50 rounded-full blur-xl"></div>

        {/* Low (Green) - General background tint for other areas */}
        <div className="absolute top-[40%] left-[50%] w-64 h-64 bg-[#00A550]/20 rounded-full blur-3xl"></div>

        {/* Alert Pins */}
        <div className="absolute bottom-[20%] left-[20%] flex flex-col items-center">
          <div className="w-4 h-4 bg-[#D32F2F] rounded-full border-2 border-white shadow-[0_0_10px_rgba(211,47,47,0.8)] animate-pulse"></div>
        </div>
        <div className="absolute top-[35%] right-[25%] flex flex-col items-center">
          <div className="w-4 h-4 bg-[#D32F2F] rounded-full border-2 border-white shadow-[0_0_10px_rgba(211,47,47,0.8)] animate-pulse"></div>
        </div>
        <div className="absolute bottom-[35%] right-[32%] flex flex-col items-center">
          <div className="w-3 h-3 bg-[#F57C00] rounded-full border-2 border-white"></div>
        </div>
        <div className="absolute top-[25%] left-[45%] flex flex-col items-center">
          <div className="w-3 h-3 bg-[#F59E0B] rounded-full border-2 border-white"></div>
        </div>

        {/* Refugee Camps */}
        <div className="absolute top-[45%] right-[15%] flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded border border-white/20">
          <span className="text-[10px]">🏕️</span>
        </div>
        <div className="absolute top-[40%] left-[20%] flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded border border-white/20">
          <span className="text-[10px]">🏕️</span>
        </div>

        {/* DRC Border */}
        <div className="absolute left-[10%] top-[20%] bottom-[10%] w-1 border-l-4 border-dashed border-[#F57C00]"></div>
        <div className="absolute left-[12%] top-[50%] bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20 backdrop-blur-sm">
          ⚠️ Active disease threats from DRC
        </div>

        {/* Hover Popup */}
        {showPopup &&
        <div className="absolute bottom-[25%] left-[25%] bg-white rounded-lg shadow-xl border border-border p-4 w-72 z-30 pointer-events-none">
            <h3 className="text-[14px] font-bold text-epi-text">
              📍 Rusizi District
            </h3>
            <div className="text-[11px] text-epi-muted mb-3">
              Western Province
            </div>

            <div className="space-y-1.5 text-[12px] mb-3">
              <div className="flex justify-between">
                <span className="text-epi-muted">AI Risk Score:</span>{' '}
                <span className="font-bold text-epi-red">91/100 🔴</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Primary Threat:</span>{' '}
                <span className="font-bold text-epi-text">Cholera</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Active Alert:</span>{' '}
                <span className="font-bold text-epi-red">ALT-2026-001 🔴</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Cases this week:</span>{' '}
                <span className="font-bold text-epi-text">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Outbreak probability:</span>{' '}
                <span className="font-bold text-epi-red">91%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Population at risk:</span>{' '}
                <span className="font-bold text-epi-text">~28,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-epi-muted">Facilities:</span>{' '}
                <span className="text-epi-text">1 hospital, 8 HCs</span>
              </div>
            </div>

            <div className="text-[10px] text-epi-muted mb-3">
              Last data update: 2h ago
            </div>

            <div className="bg-epi-amber/10 border border-epi-amber/30 p-2 rounded text-[11px] font-bold text-[#F57C00] mb-3">
              ⚠️ DRC border — Cholera active in South Kivu (4km from border)
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-epi text-white text-[11px] font-bold rounded">
                View Full District →
              </button>
              <button className="flex-1 py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded">
                Open Alert →
              </button>
            </div>
          </div>
        }
      </div>

      {/* Top Title Bar (Small) */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 backdrop-blur-sm text-white/90 text-[11px] font-medium flex items-center px-6 z-20">
        Rwanda National Health Map | June 5, 2026 | Updated: 13:00 PM
      </div>

      {/* Top Control Bar (Floating) */}
      <div className="absolute top-12 left-6 right-6 bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-2">
          <select className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg">
            <option>📍 All Rwanda ▼</option>
          </select>
          <input
            type="text"
            placeholder="Find location..."
            className="w-40 text-[13px] border border-border rounded-md px-3 py-1.5 focus:outline-none" />
          
          <div className="flex border border-border rounded-md overflow-hidden">
            <button className="px-3 py-1.5 bg-white hover:bg-epi-bg text-epi-text font-bold border-r border-border">
              +
            </button>
            <button className="px-3 py-1.5 bg-white hover:bg-epi-bg text-epi-text font-bold">
              -
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-epi text-white">
            🔥 Risk Scores
          </button>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg">
            🦠 Disease Cases
          </button>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg">
            ⚠️ Active Alerts
          </button>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg">
            🏥 Facilities
          </button>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg">
            👥 Population
          </button>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg">
            🌧️ Environment
          </button>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg">
            🌍 Cross-Border
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white">
            <option>📅 Current ▼</option>
          </select>
          <button className="px-4 py-1.5 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark">
            🎬 Animate
          </button>
          <button className="px-4 py-1.5 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg">
            📤 Export Map
          </button>
        </div>
      </div>

      {/* Right Floating Panel */}
      {showRightPanel &&
      <div className="absolute top-32 right-6 w-[320px] bg-white rounded-lg shadow-xl border border-border flex flex-col z-20 max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-[14px] font-bold text-epi-text">
              Rwanda At a Glance
            </h2>
            <button
            onClick={() => setShowRightPanel(false)}
            className="text-epi-muted hover:text-epi-text">
            
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                National risk summary
              </div>
              <div className="flex items-end gap-2">
                <span className="text-[18px] font-bold text-[#F57C00]">
                  🟠 MODERATE RISK
                </span>
              </div>
              <div className="text-[13px] text-epi-text font-medium mt-1">
                Score: 52/100
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">
                Active alerts summary
              </div>
              <div className="flex gap-2">
                <span className="bg-epi-red/10 text-epi-red text-[12px] font-bold px-2 py-1 rounded border border-epi-red/20">
                  🔴 2 Red
                </span>
                <span className="bg-[#F57C00]/10 text-[#F57C00] text-[12px] font-bold px-2 py-1 rounded border border-[#F57C00]/20">
                  🟠 5 Orange
                </span>
                <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[12px] font-bold px-2 py-1 rounded border border-[#F59E0B]/20">
                  🟡 8 Yellow
                </span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">
                Top 3 threat districts
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between items-center bg-epi-bg p-2 rounded">
                  <span className="font-bold text-epi-text">1. Rusizi</span>
                  <span className="font-bold text-epi-red">91/100 🔴</span>
                </div>
                <div className="flex justify-between items-center bg-epi-bg p-2 rounded">
                  <span className="font-bold text-epi-text">2. Kayonza</span>
                  <span className="font-bold text-epi-red">84/100 🔴</span>
                </div>
                <div className="flex justify-between items-center bg-epi-bg p-2 rounded">
                  <span className="font-bold text-epi-text">3. Bugesera</span>
                  <span className="font-bold text-[#F57C00]">72/100 🟠</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">
                Live stats
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-epi-muted">
                    Cases today (national):
                  </span>{' '}
                  <span className="font-bold text-epi-text">1,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Facilities reporting:</span>{' '}
                  <span className="font-bold text-epi-text">847/924 (92%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">CHW active sectors:</span>{' '}
                  <span className="font-bold text-epi-text">398/416 (96%)</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-epi/5 border border-epi/20 text-epi text-[13px] font-bold rounded hover:bg-epi/10 transition-colors flex items-center justify-center gap-1">
              Open Full Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      }

      {/* Map Legend (Floating Bottom Left) */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4 z-20 w-72">
        <div className="text-[11px] font-bold text-epi-text mb-2">
          Risk Scores
        </div>
        <div className="flex items-center gap-1 mb-1">
          <div className="flex-1 h-2 bg-[#00A550] rounded-l"></div>
          <div className="flex-1 h-2 bg-[#F59E0B]"></div>
          <div className="flex-1 h-2 bg-[#F57C00]"></div>
          <div className="flex-1 h-2 bg-[#D32F2F] rounded-r"></div>
        </div>
        <div className="flex justify-between text-[9px] text-epi-muted font-bold mb-2">
          <span>0</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>
        <div className="flex justify-between text-[9px] font-bold mb-4">
          <span className="text-[#00A550]">🟢 Low</span>
          <span className="text-[#F59E0B]">🟡 Mod</span>
          <span className="text-[#F57C00]">🟠 High</span>
          <span className="text-[#D32F2F]">🔴 Crit</span>
        </div>

        <div className="text-[11px] font-bold text-epi-text mb-2">Pins</div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[10px] text-epi-muted">
          <div className="flex items-center gap-1">
            <span className="text-[#D32F2F]">🔴</span> Red alert
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#F57C00]">🟠</span> Orange
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#F59E0B]">🟡</span> Yellow
          </div>
          <div className="flex items-center gap-1">
            <span>🏥</span> Hospital
          </div>
          <div className="flex items-center gap-1">
            <span>🏕️</span> Refugee camp
          </div>
          <div className="flex items-center gap-1">
            <span>⚠️</span> Cross-border
          </div>
        </div>
      </div>
    </GeoLayout>);

}