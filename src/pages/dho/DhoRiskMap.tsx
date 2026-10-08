import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { InterventionDrawer } from '../../components/dho/InterventionDrawer';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { SeverityBadge, StatusBadge } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import { HUYE_SECTORS } from '../../data/seed';
import {
  SEVERITY_META,
  addDays,
  fmtNumber,
  isOpenStatus,
  maxSeverity,
  nowISO } from
'../../lib/format';
import type { Severity } from '../../types';

const LAYERS = [
'Disease Risk',
'Health Facilities',
'Case Hotspots',
'Population Density',
'CHW Coverage'];


// Schematic sector layout (not to geographic scale)
const GEOM: Record<string, {x: number;y: number;w: number;h: number;}> = {
  Tumba: { x: 20, y: 20, w: 120, h: 90 },
  Ngoma: { x: 150, y: 20, w: 120, h: 90 },
  Maraba: { x: 280, y: 20, w: 110, h: 90 },
  Huye: { x: 20, y: 120, w: 120, h: 90 },
  Mukura: { x: 150, y: 120, w: 120, h: 90 },
  Kinazi: { x: 280, y: 120, w: 110, h: 90 },
  Sovu: { x: 20, y: 220, w: 120, h: 80 },
  Mbazi: { x: 150, y: 220, w: 120, h: 80 },
  Ruhashya: { x: 280, y: 220, w: 110, h: 80 }
};

type Period = 'current' | '7d' | '30d';

export function DhoRiskMap() {
  const { state } = useApp();
  const [params, setParams] = useSearchParams();
  const [activeLayers, setActiveLayers] = useState<string[]>(['Disease Risk', 'Case Hotspots']);
  const [selected, setSelected] = useState(params.get('sector') ?? 'Tumba');
  const [period, setPeriod] = useState<Period>('current');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dialogs = useAlertDialogs();

  useEffect(() => {
    const s = params.get('sector');
    if (s && GEOM[s]) setSelected(s);
  }, [params]);

  const toggleLayer = (l: string) =>
  setActiveLayers((p) =>
  p.includes(l) ? p.filter((x) => x !== l) : [...p, l]
  );
  const on = (l: string) => activeLayers.includes(l);

  // Risk at a point in time, reconstructed from alert history
  const at = period === 'current' ? nowISO() : addDays(nowISO(), period === '7d' ? -7 : -30);
  const riskAt = (sector: string): Severity => {
    const base = HUYE_SECTORS.find((s) => s.name === sector)?.baseRisk ?? 'green';
    const alerts = state.alerts.filter(
      (a) =>
      a.sector === sector &&
      a.triggeredAt <= at && (
      period === 'current' ? isOpenStatus(a.status) : !a.closedAt || a.closedAt > at)
    );
    return maxSeverity([period === '30d' && base !== 'green' ? 'yellow' : base, ...alerts.map((a) => a.severity)]);
  };

  const select = (name: string) => {
    setSelected(name);
    setParams({ sector: name }, { replace: true });
  };

  const profile = HUYE_SECTORS.find((s) => s.name === selected)!;
  const risk = riskAt(selected);
  const sectorAlerts = sortAlerts(
    state.alerts.filter((a) => a.sector === selected && isOpenStatus(a.status)),
    'severity'
  );
  const topAlert = sectorAlerts[0];
  const interventions = state.interventions.filter(
    (i) => i.sector === selected && (i.status === 'Ongoing' || i.status === 'Planned')
  );
  const maxDensity = Math.max(...HUYE_SECTORS.map((s) => s.densityPerKm2));

  return (
    <DhoLayout
      title="Huye District — Risk Map"
      subtitle="Sector-level health risk visualization | Updated every 4 hours | Schematic layout"
      breadcrumb="Risk Map">

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {LAYERS.map((l) =>
          <button
            key={l}
            onClick={() => toggleLayer(l)}
            aria-pressed={on(l)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${on(l) ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:text-admin-text'}`}>

              {on(l) ? '✓ ' : ''}
              {l}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-[13px] text-admin-muted">
          <span className="font-medium">Showing:</span>
          {([
          ['30d', 'Past 30 days'],
          ['7d', 'Past 7 days'],
          ['current', 'Current']] as
          const).map(([k, label]) =>
          <button
            key={k}
            onClick={() => setPeriod(k)}
            className={`px-2.5 py-1 rounded border transition-colors ${period === k ? 'bg-admin text-white border-admin' : 'border-border hover:bg-white'}`}>

              {label}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-border p-5 relative min-w-0">
          {period !== 'current' &&
          <div className="mb-3 text-[12px] font-semibold text-admin-info bg-admin-info/10 border border-admin-info/20 rounded px-3 py-1.5">
              Historical view — risk reconstructed from alert history as of {period === '7d' ? '7' : '30'} days ago.
            </div>
          }
          <svg viewBox="0 0 410 310" className="w-full h-auto" role="img" aria-label="Huye sector risk map">
            {HUYE_SECTORS.map((s) => {
              const g = GEOM[s.name];
              const r = riskAt(s.name);
              const isSel = selected === s.name;
              const fill = on('Disease Risk') ? SEVERITY_META[r].hex : '#E5E7EB';
              const hasOpenAlert = state.alerts.some((a) => a.sector === s.name && isOpenStatus(a.status));
              const hotspot = on('Case Hotspots') && period === 'current' && (hasOpenAlert || s.casesThisWeek >= 20);
              const lowChw = s.chwCoverage < 80;
              const labelDark = !on('Disease Risk') || r === 'yellow';
              return (
                <g
                  key={s.name}
                  onClick={() => select(s.name)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`${s.name} sector, ${SEVERITY_META[r].word}`}>

                  <rect
                    x={g.x}
                    y={g.y}
                    width={g.w}
                    height={g.h}
                    rx={6}
                    fill={fill}
                    opacity={isSel ? 1 : 0.85}
                    stroke={isSel ? '#1A1A2E' : on('CHW Coverage') && lowChw ? '#1A1A2E' : 'white'}
                    strokeDasharray={!isSel && on('CHW Coverage') && lowChw ? '5 4' : undefined}
                    strokeWidth={isSel ? 3 : 1.5} />

                  {on('Population Density') &&
                  <rect
                    x={g.x + 4}
                    y={g.y + g.h - 10}
                    width={(g.w - 8) * (s.densityPerKm2 / maxDensity)}
                    height={5}
                    rx={2}
                    fill="#1A1A2E"
                    opacity={0.45} />

                  }
                  <text
                    x={g.x + g.w / 2}
                    y={g.y + g.h / 2 - (on('CHW Coverage') || on('Population Density') ? 6 : 0)}
                    textAnchor="middle"
                    fill={labelDark ? '#1A1A2E' : 'white'}
                    fontSize="13"
                    fontWeight="bold">

                    {r === 'red' && on('Disease Risk') ? `🔴 ${s.name}` : s.name}
                  </text>
                  {on('CHW Coverage') &&
                  <text
                    x={g.x + g.w / 2}
                    y={g.y + g.h / 2 + 10}
                    textAnchor="middle"
                    fill={labelDark ? '#1A1A2E' : 'white'}
                    fontSize="10">

                      CHW {s.chwCoverage}%
                    </text>
                  }
                  {on('Population Density') &&
                  <text
                    x={g.x + g.w / 2}
                    y={g.y + g.h / 2 + (on('CHW Coverage') ? 22 : 10)}
                    textAnchor="middle"
                    fill={labelDark ? '#1A1A2E' : 'white'}
                    fontSize="10">

                      {fmtNumber(s.densityPerKm2)}/km²
                    </text>
                  }
                  {on('Health Facilities') &&
                  <text x={g.x + 10} y={g.y + 20} fontSize="14">
                      ⚕{s.facilities.length > 1 ? '×' + s.facilities.length : ''}
                    </text>
                  }
                  {hotspot &&
                  <circle
                    cx={g.x + g.w - 22}
                    cy={g.y + 22}
                    r={Math.min(16, 6 + s.casesThisWeek / 8)}
                    fill="#D32F2F"
                    opacity={0.35}>

                      <title>{`${s.casesThisWeek} cases this week`}</title>
                    </circle>
                  }
                </g>);

            })}
          </svg>
          <div className="mt-4 bg-white/90 border border-border rounded-md px-3 py-2 text-[12px] flex flex-col gap-1 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <span>🔴 Critical</span>
              <span>🟠 Alert</span>
              <span>🟡 Watch</span>
              <span>🟢 Normal</span>
            </div>
            <div className="flex flex-wrap gap-3 text-admin-muted">
              {on('Health Facilities') && <span>⚕ Health Facility</span>}
              {on('Case Hotspots') && <span>● Case hotspot (size = cases)</span>}
              {on('Population Density') && <span>▬ Population density</span>}
              {on('CHW Coverage') && <span>┅ CHW coverage below 80%</span>}
            </div>
          </div>
        </div>

        {/* Sector Detail Panel */}
        <div className="w-full lg:w-[36%] bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <div className="text-[12px] text-admin-muted font-medium mb-1">
            Sector Details
          </div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-[18px] font-bold text-admin-text">
              {selected} Sector
            </h2>
            <SeverityBadge severity={risk} />
          </div>

          <div className="space-y-3 text-[13px] mb-4">
            <div className="flex justify-between gap-3">
              <span className="text-admin-muted">Active alerts</span>
              <span className="font-bold text-admin-text text-right">
                {sectorAlerts.length === 0 ?
                'None' :
                sectorAlerts.map((a) => `${a.severity} — ${a.disease.toLowerCase()}`).join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">Cases this week</span>
              <span className="font-bold text-admin-text">{profile.casesThisWeek}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">Population</span>
              <span className="font-bold text-admin-text">{fmtNumber(profile.population)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-admin-muted">Health facilities</span>
              <span className="font-bold text-admin-text text-right">
                {profile.facilities.length} ({profile.facilities.join(', ')})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">CHWs</span>
              <span className="font-bold text-admin-text">
                {profile.chwActive} active, {profile.chwInactive} inactive ({profile.chwCoverage}% coverage)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-admin-muted">Interventions in progress</span>
              <span className="font-bold text-admin-text">{interventions.length}</span>
            </div>
          </div>

          {sectorAlerts.length > 0 &&
          <div className="space-y-2 mb-4">
              {sectorAlerts.map((a) =>
            <Link
              key={a.id}
              to={`/dho/alerts/${a.id}`}
              className="flex items-center justify-between gap-2 border border-border rounded-md px-3 py-2 hover:bg-admin-bg/50">

                  <span className="text-[13px] font-bold text-admin-text">
                    {SEVERITY_META[a.severity].emoji} {a.id} · {a.disease}
                  </span>
                  <StatusBadge status={a.status} />
                </Link>
            )}
            </div>
          }

          <div className="bg-admin-bg rounded-md p-3 mb-4">
            <div className="text-[12px] font-bold text-admin-text mb-1">
              Recommended action
            </div>
            <p className="text-[13px] text-admin-muted">{profile.recommended}</p>
          </div>

          <div className="mt-auto space-y-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-full h-10 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors">

              Log Intervention for {selected}
            </button>
            <button
              onClick={() => topAlert && dialogs.open('escalate', topAlert)}
              disabled={!topAlert || topAlert.status === 'escalated'}
              title={
              !topAlert ?
              'No open alert in this sector to escalate' :
              topAlert.status === 'escalated' ?
              `Already escalated to ${topAlert.escalatedTo}` :
              undefined
              }
              className="w-full h-10 bg-white border border-admin-red text-admin-red hover:bg-admin-red/10 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] font-semibold rounded-md transition-colors">

              {topAlert?.status === 'escalated' ?
              `Escalated to ${topAlert.escalatedTo?.split(' (')[0]}` :
              topAlert ?
              `Escalate ${topAlert.id} to RBC` :
              'No alert to escalate'}
            </button>
          </div>
        </div>
      </div>

      <InterventionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        prefill={{ sector: selected, alertId: topAlert?.id, disease: topAlert?.disease }} />

      {dialogs.element}
    </DhoLayout>);

}
