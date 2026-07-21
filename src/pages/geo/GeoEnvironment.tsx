import React, { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
export function GeoEnvironment() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <GeoLayout breadcrumb="Environmental Overlays" hideHeader={true}>
      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">
              Primary layer:
            </span>
            <select className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg shadow-sm">
              <option>🌧️ Rainfall ▼</option>
            </select>
          </div>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">
              Disease overlay:
            </span>
            <select className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg shadow-sm">
              <option>💧 Cholera ▼</option>
            </select>
          </div>
          <div className="w-px h-6 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">
              Period:
            </span>
            <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
              <option>Last 7 Days ▼</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-epi-text">
            Show correlation
          </span>
          <div className="w-10 h-5 bg-[#00A550] rounded-full relative cursor-pointer shadow-inner">
            <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
          <span className="text-[12px] font-bold text-[#00A550] ml-1">ON</span>
        </div>
      </div>

      <div className="absolute inset-0 flex">
        {/* Main Map Area (65%) */}
        <div className="w-[65%] h-full relative bg-[#1A1A1A] overflow-hidden">
          {/* Simulated Dark Terrain Map */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
          </div>

          {/* District Boundaries (White 40%) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
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

          {/* Layer 1: Rainfall Heat Map (Blue gradient) */}
          {/* Deep blue (>120mm) - Western Province */}
          <div className="absolute top-[20%] left-[10%] w-48 h-64 bg-[#1E3A8A]/60 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute bottom-[10%] left-[10%] w-40 h-48 bg-[#1E3A8A]/70 rounded-full blur-3xl mix-blend-screen"></div>

          {/* Medium blue (80-120mm) - Southern Province */}
          <div className="absolute bottom-[20%] left-[30%] w-56 h-40 bg-[#3B82F6]/40 rounded-full blur-3xl mix-blend-screen"></div>

          {/* Light blue (<80mm) - Eastern Province */}
          <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-[#93C5FD]/20 rounded-full blur-3xl mix-blend-screen"></div>

          {/* River Lines (Ruzizi River prominent) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
            viewBox="0 0 100 100"
            preserveAspectRatio="none">
            
            <path
              d="M10,80 Q15,85 20,90"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="1" />
            
            <path
              d="M15,20 Q20,30 15,40 T10,60 T10,80"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="0.5" />
            
          </svg>

          {/* Flood Risk Zones (Orange Hatched) */}
          <div
            className="absolute bottom-[15%] left-[15%] w-24 h-24 rounded-full blur-md opacity-60"
            style={{
              background:
              'repeating-linear-gradient(45deg, rgba(249,115,22,0.6), rgba(249,115,22,0.6) 2px, transparent 2px, transparent 6px)'
            }}>
          </div>

          {/* Layer 2: Cholera Cases (Red circles) */}
          {/* Rusizi (Overlapping deep blue) */}
          <div
            className="absolute bottom-[18%] left-[18%] flex flex-wrap w-16 h-16 gap-0.5 justify-center items-center cursor-pointer z-20"
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}>
            
            {[...Array(12)].map((_, i) =>
            <div
              key={i}
              className="w-2.5 h-2.5 bg-[#D32F2F] rounded-full shadow-[0_0_5px_rgba(211,47,47,0.8)]">
            </div>
            )}
          </div>

          {/* Karongi (Overlapping medium blue) */}
          <div className="absolute top-[40%] left-[18%] flex flex-wrap w-8 h-8 gap-0.5 justify-center items-center">
            {[...Array(3)].map((_, i) =>
            <div
              key={i}
              className="w-2 h-2 bg-[#D32F2F] rounded-full shadow-[0_0_5px_rgba(211,47,47,0.8)]">
            </div>
            )}
          </div>

          {/* Correlation Annotation (Floating text box) */}
          <div className="absolute top-[40%] left-[35%] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border max-w-[200px] z-10">
            <div className="text-[12px] font-bold text-epi-text mb-1">
              r = +0.83 | Strong correlation
            </div>
            <div className="text-[11px] text-epi-muted leading-relaxed">
              Districts with &gt;120mm rainfall have 6× more cholera cases this
              week. Source: WASAC + Rwanda Met Agency.
            </div>
          </div>

          {/* Hover Popup */}
          {showPopup &&
          <div className="absolute bottom-[25%] left-[25%] bg-white rounded-lg shadow-xl border border-border p-4 w-72 z-30 pointer-events-none">
              <h3 className="text-[13px] font-bold text-epi-text flex items-center gap-2 mb-1">
                🌧️ + 💧 Environmental Risk Zone
              </h3>
              <div className="text-[12px] font-bold text-epi-text">
                Bugarama Sector, Rusizi
              </div>

              <div className="space-y-2 text-[12px] my-3">
                <div className="flex justify-between">
                  <span className="text-epi-muted">Rainfall this week:</span>{' '}
                  <span className="font-bold text-epi-red">145mm 🔴</span>
                </div>
                <div className="text-[10px] text-epi-muted text-right -mt-2">
                  (Normal June: 65mm)
                </div>

                <div className="flex justify-between">
                  <span className="text-epi-muted">Water quality score:</span>{' '}
                  <span className="font-bold text-epi-red">2/10 🔴</span>
                </div>
                <div className="text-[10px] text-epi-muted text-right -mt-2">
                  (WASAC June 4 reading)
                </div>

                <div className="flex justify-between">
                  <span className="text-epi-muted">Flood risk:</span>{' '}
                  <span className="font-bold text-[#F97316]">
                    HIGH (Ruzizi River)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Cholera cases:</span>{' '}
                  <span className="font-bold text-epi-red">38 🔴</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Correlation strength:</span>{' '}
                  <span className="font-bold text-epi-text">Very High</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border mb-3">
                <span className="text-[12px] font-bold text-epi-text">
                  Environmental risk score:
                </span>
                <span className="text-[16px] font-bold text-epi-red">
                  9.1/10
                </span>
              </div>

              <div className="bg-epi-red/10 border border-epi-red/20 p-2 rounded text-[11px] font-medium text-epi-red">
                <span className="font-bold">AI Alert:</span> 'Heavy rainfall +
                poor water quality + active cases = maximum cholera outbreak
                conditions'
              </div>
            </div>
          }
        </div>

        {/* Right Panel (35%) */}
        <div className="w-[35%] h-full bg-white border-l border-border flex flex-col pt-20 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">
              Rainfall vs Cholera — Correlation Analysis
            </h2>

            {/* Scatter Plot */}
            <div className="mb-8">
              <div className="relative h-48 w-full border-l border-b border-border mb-4">
                {/* Y Axis */}
                <div className="absolute -left-8 top-0 bottom-0 w-6 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-epi-muted whitespace-nowrap">
                  Cholera Cases
                </div>

                {/* X Axis */}
                <div className="absolute left-0 right-0 -bottom-6 h-6 flex justify-between items-end text-[10px] text-epi-muted font-medium">
                  <span>0mm</span>
                  <span>50mm</span>
                  <span>100mm</span>
                  <span>150mm</span>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-epi-muted whitespace-nowrap">
                  Rainfall this week (mm)
                </div>

                {/* Plot Area */}
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100">
                  
                  {/* Trend Line */}
                  <line
                    x1="10"
                    y1="90"
                    x2="90"
                    y2="10"
                    stroke="#104E49"
                    strokeWidth="1"
                    strokeDasharray="4,4" />
                  

                  {/* Dots (Simulated) */}
                  <circle cx="10" cy="95" r="2" fill="#1D72B8" />
                  <circle cx="15" cy="90" r="2" fill="#1D72B8" />
                  <circle cx="20" cy="98" r="2" fill="#1D72B8" />
                  <circle cx="25" cy="85" r="2" fill="#1D72B8" />
                  <circle cx="30" cy="92" r="2" fill="#1D72B8" />

                  <circle cx="40" cy="80" r="2" fill="#1D72B8" />
                  <circle cx="45" cy="75" r="2" fill="#1D72B8" />
                  <circle cx="50" cy="85" r="2" fill="#1D72B8" />

                  <circle cx="60" cy="60" r="2" fill="#1D72B8" />
                  <circle cx="70" cy="50" r="2" fill="#1D72B8" />

                  {/* Rusizi Dot */}
                  <circle cx="90" cy="15" r="4" fill="#D32F2F" />
                  <text
                    x="85"
                    y="10"
                    fontSize="8"
                    fill="#D32F2F"
                    fontWeight="bold">
                    
                    Rusizi
                  </text>
                </svg>
              </div>

              <div className="bg-epi-bg p-3 rounded border border-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Factor: Rainfall vs Cholera
                  </span>
                  <span className="text-[13px] font-bold text-epi-text">
                    r = +0.83 | Strong Positive
                  </span>
                </div>
                <div className="text-[13px] text-epi-text font-medium">
                  "6× more cases in districts with &gt;120mm rainfall"
                </div>
              </div>
            </div>

            {/* Layer Options */}
            <div className="mb-6">
              <h3 className="text-[14px] font-bold text-epi-text mb-4">
                Active Layers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                    <div className="w-3 h-3 rounded-full bg-[#1E3A8A]"></div>
                    🌧️ Rainfall
                  </div>
                  <div className="w-8 h-4 bg-[#00A550] rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    🌡️ Temperature
                  </div>
                  <div className="w-8 h-4 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                    🚿 Water quality
                  </div>
                  <div className="w-8 h-4 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    🌊 Flood zones
                  </div>
                  <div className="w-8 h-4 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    🌿 Vegetation
                  </div>
                  <div className="w-8 h-4 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-epi-text">
                    <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
                    🏭 Sanitation
                  </div>
                  <div className="w-8 h-4 bg-border rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources Note */}
            <div className="mt-auto pt-4 border-t border-border text-[11px] text-epi-muted leading-relaxed">
              <span className="font-bold">Environmental data:</span> Rwanda
              Meteorological Agency (June 3), WASAC water quality (June 4),
              RLMUA flood maps
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}