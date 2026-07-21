import React, { useState } from 'react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { ConfirmModal } from '../../components/dho/ConfirmModal';
const LAYERS = [
'Disease Risk',
'Health Facilities',
'Case Hotspots',
'Population Density',
'CHW Coverage'];

const SECTORS = [
{
  name: 'Tumba',
  risk: 'red',
  x: 20,
  y: 20,
  w: 120,
  h: 90,
  critical: true
},
{
  name: 'Ngoma',
  risk: 'orange',
  x: 150,
  y: 20,
  w: 120,
  h: 90
},
{
  name: 'Maraba',
  risk: 'orange',
  x: 280,
  y: 20,
  w: 110,
  h: 90
},
{
  name: 'Huye',
  risk: 'orange',
  x: 20,
  y: 120,
  w: 120,
  h: 90
},
{
  name: 'Mukura',
  risk: 'yellow',
  x: 150,
  y: 120,
  w: 120,
  h: 90
},
{
  name: 'Kinazi',
  risk: 'yellow',
  x: 280,
  y: 120,
  w: 110,
  h: 90
},
{
  name: 'Sovu',
  risk: 'green',
  x: 20,
  y: 220,
  w: 120,
  h: 80
},
{
  name: 'Mbazi',
  risk: 'green',
  x: 150,
  y: 220,
  w: 120,
  h: 80
},
{
  name: 'Ruhashya',
  risk: 'green',
  x: 280,
  y: 220,
  w: 110,
  h: 80
}];

const fill: Record<string, string> = {
  red: '#D32F2F',
  orange: '#F59E0B',
  yellow: '#EAB308',
  green: '#00A550'
};
export function DhoRiskMap() {
  const [activeLayers, setActiveLayers] = useState<string[]>(['Disease Risk']);
  const [selected, setSelected] = useState('Tumba');
  const [escalateOpen, setEscalateOpen] = useState(false);
  const toggleLayer = (l: string) =>
  setActiveLayers((p) =>
  p.includes(l) ? p.filter((x) => x !== l) : [...p, l]
  );
  return (
    <DhoLayout
      title="Huye District — Risk Map"
      subtitle="Sector-level health risk visualization | Updated every 4 hours"
      breadcrumb="Risk Map">
      
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {LAYERS.map((l) =>
          <button
            key={l}
            onClick={() => toggleLayer(l)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${activeLayers.includes(l) ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:text-admin-text'}`}>
            
              {l}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-[13px] text-admin-muted">
          <span className="font-medium">Showing: Current</span>
          <button className="px-2 py-1 rounded border border-border hover:bg-white">
            ← Past 7 days
          </button>
          <button className="px-2 py-1 rounded border border-border hover:bg-white">
            Past 30 days →
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-border p-5 relative">
          <svg viewBox="0 0 410 310" className="w-full h-auto">
            {SECTORS.map((s) =>
            <g
              key={s.name}
              onClick={() => setSelected(s.name)}
              className="cursor-pointer">
              
                <rect
                x={s.x}
                y={s.y}
                width={s.w}
                height={s.h}
                rx={6}
                fill={fill[s.risk]}
                opacity={selected === s.name ? 1 : 0.85}
                stroke={selected === s.name ? '#1A1A2E' : 'white'}
                strokeWidth={selected === s.name ? 3 : 1.5} />
              
                <text
                x={s.x + s.w / 2}
                y={s.y + s.h / 2}
                textAnchor="middle"
                fill={s.risk === 'yellow' ? '#1A1A2E' : 'white'}
                fontSize="13"
                fontWeight="bold">
                
                  {s.critical ? `🔴 ${s.name}` : s.name}
                </text>
                {activeLayers.includes('Health Facilities') &&
              <text x={s.x + 12} y={s.y + 20} fontSize="14">
                    ⚕
                  </text>
              }
                {activeLayers.includes('Case Hotspots') && (
              s.name === 'Tumba' || s.name === 'Ngoma') &&
              <circle
                cx={s.x + s.w / 2}
                cy={s.y + s.h / 2 + 14}
                r={s.name === 'Tumba' ? 26 : 18}
                fill="#D32F2F"
                opacity={0.3} />

              }
              </g>
            )}
          </svg>
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur border border-border rounded-md px-3 py-2 text-[12px] flex flex-col gap-1 shadow-sm">
            <div className="flex gap-3">
              <span>🔴 Critical</span>
              <span>🟠 Alert</span>
              <span>🟡 Watch</span>
              <span>🟢 Normal</span>
            </div>
            <div className="flex gap-3 text-admin-muted">
              <span>⚕ Health Facility</span>
              <span>🔥 Case Hotspot</span>
            </div>
          </div>
        </div>

        {/* Sector Detail Panel */}
        <div className="w-full lg:w-[35%] bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <div className="text-[12px] text-admin-muted font-medium mb-1">
            Sector Details
          </div>
          <h2 className="text-[18px] font-bold text-admin-text mb-3">
            {selected} Sector
          </h2>
          <span className="self-start bg-admin-red/10 text-admin-red px-3 py-1 rounded-full text-[12px] font-bold mb-4">
            🔴 RED
          </span>

          <div className="space-y-3 text-[13px] mb-4">
            <div className="flex justify-between">
              <span className="text-admin-muted">Active alerts</span>
              <span className="font-bold text-admin-text">1 red — cholera</span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">Cases this week</span>
              <span className="font-bold text-admin-text">38</span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">Population</span>
              <span className="font-bold text-admin-text">28,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">Health facilities</span>
              <span className="font-bold text-admin-text">1 (Tumba HC)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">CHW sectors</span>
              <span className="font-bold text-admin-text">
                3 active, 0 inactive
              </span>
            </div>
          </div>

          <div className="bg-admin-bg rounded-md p-3 mb-4">
            <div className="text-[12px] font-bold text-admin-text mb-1">
              Recommended action
            </div>
            <p className="text-[13px] text-admin-muted">
              Deploy oral rehydration supplies. Inspect water sources. Alert
              community health workers.
            </p>
          </div>

          <div className="mt-auto space-y-2">
            <button className="w-full h-10 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors">
              Log Intervention for {selected}
            </button>
            <button
              onClick={() => setEscalateOpen(true)}
              className="w-full h-10 bg-white border border-admin-red text-admin-red hover:bg-admin-red/10 text-[13px] font-semibold rounded-md transition-colors">
              
              Escalate to RBC
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={escalateOpen}
        title="Escalate to RBC?"
        message={`This will escalate the ${selected} Sector cholera alert to the Rwanda Biomedical Centre and the Southern Province Director. This action will be logged permanently.`}
        confirmLabel="Yes, Escalate"
        destructive
        onConfirm={() => setEscalateOpen(false)}
        onCancel={() => setEscalateOpen(false)} />
      
    </DhoLayout>);

}