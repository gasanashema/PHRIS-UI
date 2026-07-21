import React, { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
export function GeoAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <GeoLayout breadcrumb="Spread Animation" hideHeader={true}>
      {/* Small Page Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-white/90 backdrop-blur-sm border-b border-border flex items-center px-6 z-20">
        <span className="text-[13px] font-bold text-epi-text">
          🎬 Outbreak Spread Animation | Cholera — Rusizi District | May 29 →
          June 5, 2026
        </span>
      </div>

      {/* Top Controls */}
      <div className="absolute top-14 left-6 bg-white rounded-lg shadow-lg border border-border p-2 flex items-center gap-2 z-20">
        <select className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg">
          <option>💧 Cholera ▼</option>
        </select>
        <select className="text-[13px] font-bold text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-epi-bg">
          <option>Rusizi District ▼</option>
        </select>
        <div className="text-[12px] font-medium text-epi-muted px-2">
          Date range: May 29 – June 5, 2026
        </div>
      </div>

      {/* Main Map Area */}
      <div className="absolute inset-0 bg-[#1A1A1A] overflow-hidden pt-10 pb-[120px]">
        {/* Simulated Dark Terrain Map */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
        </div>

        {/* Sector Boundaries (White 40%) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          
          <path
            d="M20,20 L40,30 L30,50 L10,40 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.2" />
          
          <path
            d="M40,30 L60,20 L70,40 L50,50 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.2" />
          
          <path
            d="M30,50 L50,50 L60,70 L40,80 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.2" />
          
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-[35%] left-[25%] text-white/50 text-[12px] font-bold pointer-events-none">
          Bugarama
        </div>
        <div className="absolute top-[30%] left-[55%] text-white/50 text-[12px] font-bold pointer-events-none">
          Nzahaha
        </div>
        <div className="absolute top-[60%] left-[45%] text-white/50 text-[12px] font-bold pointer-events-none">
          Kamembe
        </div>

        {/* Disease Spread Blobs (Day 7) */}
        {/* Bugarama */}
        <div className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#7B0000] rounded-full blur-xl opacity-80 mix-blend-screen"></div>
        {/* Nzahaha */}
        <div className="absolute top-[30%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#F57C00] rounded-full blur-xl opacity-70 mix-blend-screen"></div>
        {/* Kamembe */}
        <div className="absolute top-[60%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#F59E0B] rounded-full blur-lg opacity-60 mix-blend-screen"></div>

        {/* Water Flow Arrows (Ruzizi River) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          
          <path
            d="M25,35 Q40,30 55,30"
            fill="none"
            stroke="#1D72B8"
            strokeWidth="0.5"
            strokeDasharray="1,1" />
          
          <polygon points="55,30 53,29 53,31" fill="#1D72B8" />
        </svg>

        {/* Markers */}
        <div className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 bg-[#1D72B8] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[8px]">
            💧
          </div>
          <span className="text-[10px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
            Source: Bugarama water point
          </span>
        </div>

        <div className="absolute top-[38%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 bg-[#00A550] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[8px]">
            💉
          </div>
          <span className="text-[10px] font-bold mt-1 bg-white/90 text-[#00A550] px-1 rounded shadow-sm whitespace-nowrap">
            ORS + Water treatment deployed June 4
          </span>
        </div>

        {/* AI Prediction Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          
          {/* If no intervention (Red dotted) */}
          <path
            d="M15,25 Q30,10 65,20 T75,50 T50,85 T15,60 Z"
            fill="none"
            stroke="#D32F2F"
            strokeWidth="0.3"
            strokeDasharray="1,1"
            opacity="0.8" />
          
          {/* With intervention (Green solid) */}
          <path
            d="M20,30 Q35,20 60,25 T65,45 T45,70 T20,55 Z"
            fill="none"
            stroke="#00A550"
            strokeWidth="0.3"
            opacity="0.8" />
          
        </svg>
        <div className="absolute top-[15%] left-[65%] text-[10px] font-bold text-[#D32F2F] bg-white/80 px-1 rounded">
          If no intervention
        </div>
        <div className="absolute top-[25%] left-[60%] text-[10px] font-bold text-[#00A550] bg-white/80 px-1 rounded">
          With intervention
        </div>
      </div>

      {/* Bottom Animation Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border flex flex-col z-20">
        <div className="h-[72px] px-6 flex items-center gap-6">
          <div className="text-[12px] font-bold text-epi-muted w-24 text-right">
            Day 1 — May 29
          </div>

          <div className="flex items-center gap-2">
            <button className="text-epi-muted hover:text-epi-text">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-epi text-white flex items-center justify-center hover:bg-epi-dark">
              
              {isPlaying ?
              <Pause className="w-4 h-4" /> :

              <Play className="w-4 h-4 ml-0.5" />
              }
            </button>
            <button className="text-epi-muted hover:text-epi-text">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center">
            <div className="w-full h-2 bg-epi-bg rounded-full relative">
              <div
                className="absolute left-0 top-0 bottom-0 bg-epi rounded-full"
                style={{
                  width: '87.5%'
                }}>
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-epi rounded-full shadow-sm cursor-pointer"
                style={{
                  left: '87.5%',
                  transform: 'translate(-50%, -50%)'
                }}>
              </div>
            </div>
            {/* Event Markers */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#D32F2F] rounded-full"
              style={{
                left: '0%'
              }}>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#F59E0B] rounded-full"
              style={{
                left: '37.5%'
              }}>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1D72B8] rounded-full"
              style={{
                left: '62.5%'
              }}>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00A550] rounded-full"
              style={{
                left: '75%'
              }}>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00A550] rounded-full"
              style={{
                left: '87.5%'
              }}>
            </div>

            {/* Current Date Label */}
            <div
              className="absolute -top-6 text-[11px] font-bold text-epi bg-white px-2 py-0.5 rounded shadow-sm border border-border"
              style={{
                left: '87.5%',
                transform: 'translateX(-50%)'
              }}>
              
              Day 7 — June 4
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select className="text-[12px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option>1x ▼</option>
            </select>
            <select className="text-[12px] font-medium text-epi-text border border-border rounded px-2 py-1 focus:outline-none bg-white">
              <option>Loop: Off ▼</option>
            </select>
          </div>

          <div className="text-[12px] font-bold text-epi-muted w-24">
            Day 8 — June 5
          </div>
        </div>

        <div className="bg-epi-bg border-t border-border px-6 py-2 flex items-center justify-between">
          <div className="text-[13px] font-bold text-epi-text flex gap-4">
            <span>
              Cases: <span className="text-epi-red">87</span>
            </span>
            <span className="text-border">|</span>
            <span>Districts: 1</span>
            <span className="text-border">|</span>
            <span>Sectors affected: 3</span>
            <span className="text-border">|</span>
            <span>
              Deaths: <span className="text-epi-red">3</span>
            </span>
          </div>

          <div className="flex gap-4 text-[11px] text-epi-muted">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#D32F2F] rounded-full"></div> May 29:
              🔴 First cases — Bugarama sector
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div> June 1:
              ⚠️ Alert ALT-001 generated
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#1D72B8] rounded-full"></div> June 3:
              🔬 Lab confirmed cholera
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#00A550] rounded-full"></div> June 4:
              💉 ORS + water treatment deployed
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#00A550] rounded-full"></div> June 5:
              📉 Cases declining
            </span>
          </div>
        </div>
      </div>
    </GeoLayout>);

}