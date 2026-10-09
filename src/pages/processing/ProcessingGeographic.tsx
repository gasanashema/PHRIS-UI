import { useState } from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import { useApp } from '../../store/AppStore';
import { DISTRICT_PROVINCE, HUYE_SECTORS } from '../../data/seed';
import { fmtNumber } from '../../lib/format';

type Level = 'cell' | 'sector' | 'district' | 'province' | 'national';
const LEVELS: { id: Level; label: string }[] = [
  { id: 'cell', label: 'Village/Cell' },
  { id: 'sector', label: 'Sector' },
  { id: 'district', label: 'District' },
  { id: 'province', label: 'Province' },
  { id: 'national', label: 'National' }
];


interface AggRow {name: string;cases: number;population: number;}

const hash = (s: string) => s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

export function ProcessingGeographic() {
  const { state } = useApp();
  const [level, setLevel] = useState<Level>('sector');

  // Sector-level data for Huye (source of truth for the drill-down)
  const sectors: AggRow[] = HUYE_SECTORS.map((s) => ({ name: s.name, cases: s.casesThisWeek, population: s.population }));
  const huyeCases = sectors.reduce((a, s) => a + s.cases, 0);
  const districtRow = (d: string): AggRow =>
  d === 'Huye' ?
  { name: 'Huye', cases: huyeCases, population: 321347 } :
  {
    name: d,
    cases: Math.round((state.districtRisk.find((r) => r.district === d)?.score ?? 20) * 2.4),
    population: 250000 + hash(d) * 97 % 200000
  };
  const districts = Object.keys(DISTRICT_PROVINCE).map(districtRow);
  const provinces: AggRow[] = Array.from(new Set(Object.values(DISTRICT_PROVINCE))).map((p) => {
    const ds = districts.filter((d) => DISTRICT_PROVINCE[d.name] === p);
    return { name: p === 'Kigali' ? 'Kigali City' : `${p} Province`, cases: ds.reduce((a, d) => a + d.cases, 0), population: ds.reduce((a, d) => a + d.population, 0) };
  });
  const tumba = HUYE_SECTORS[0];
  const cells: AggRow[] = ['Cyarwa', 'Cyimana', 'Gitwa', 'Mpare', 'Rango B'].map((c, i) => {
    const share = [0.34, 0.24, 0.18, 0.14, 0.1][i];
    return { name: `${c} Cell`, cases: Math.round(tumba.casesThisWeek * share), population: Math.round(tumba.population * (0.25 - i * 0.03)) };
  });

  const view: {title: string;source: string;unit: string;rows: AggRow[];total: string;} =
  level === 'cell' ?
  { title: 'Tumba Sector — Aggregated by Cell', source: '5 cells · 41 villages', unit: 'Cell', rows: cells, total: 'TUMBA TOTAL' } :
  level === 'sector' ?
  { title: 'Huye District — Aggregated by Sector', source: `${sectors.length} sectors · 47 cells · 234 villages`, unit: 'Sector', rows: sectors, total: 'HUYE TOTAL' } :
  level === 'district' ?
  {
    title: 'Southern Province — Aggregated by District',
    source: '8 districts',
    unit: 'District',
    rows: districts.filter((d) => DISTRICT_PROVINCE[d.name] === 'Southern'),
    total: 'SOUTHERN TOTAL'
  } :
  level === 'province' ?
  { title: 'Rwanda — Aggregated by Province', source: '5 provinces · 30 districts', unit: 'Province', rows: provinces, total: 'NATIONAL TOTAL' } :
  { title: 'Rwanda — National Total', source: '30 districts · 416 sectors', unit: 'Country', rows: [{ name: 'Rwanda', cases: provinces.reduce((a, p) => a + p.cases, 0), population: provinces.reduce((a, p) => a + p.population, 0) }], total: 'NATIONAL TOTAL' };

  const rows = [...view.rows].sort((a, b) => b.cases - a.cases);
  const totalCases = rows.reduce((a, r) => a + r.cases, 0);
  const totalPop = rows.reduce((a, r) => a + r.population, 0);
  const idx = LEVELS.findIndex((l) => l.id === level);
  const rate = (r: AggRow) => r.cases / r.population * 1000;
  const bar = (share: number) => share >= 0.25 ? 'bg-epi-red' : share >= 0.14 ? 'bg-[#F97316]' : share >= 0.1 ? 'bg-epi-amber' : 'bg-[#00A550]';

  return (
    <ProcessingLayout
      title="Geographic Aggregation"
      subtitle="Rwanda administrative hierarchy data rollup — Village → Sector → District → Province → National"
      breadcrumb="Geographic Aggregation">

      <div className="flex flex-wrap items-center gap-3 mb-4">
        {LEVELS.map((l) =>
        <button
          key={l.id}
          onClick={() => setLevel(l.id)}
          className={`px-5 py-2.5 rounded-full text-[14px] font-bold shadow-sm transition-colors ${level === l.id ? 'bg-epi text-white' : 'bg-white border border-border text-epi-muted hover:bg-epi-bg'}`}>

            {l.label}
          </button>
        )}
      </div>
      <div className="text-[13px] text-epi-muted mb-8 font-medium">
        Viewing: <span className="text-epi-text font-bold">{LEVELS[idx].label} Level</span> | Source batch: {state.pipeline.lastBatchId} | Aggregation method: Sum
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-lg shadow-card border border-border p-6">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">Administrative Hierarchy</h2>
          <div className="font-mono text-[13px] leading-7 text-epi-text space-y-0.5">
            {[
            { d: 0, lvl: 'national' as Level, label: 'Rwanda (National)' },
            { d: 1, lvl: 'province' as Level, label: 'Southern Province' },
            { d: 2, lvl: 'district' as Level, label: 'Huye District' },
            { d: 3, lvl: 'sector' as Level, label: 'Tumba Sector' },
            { d: 4, lvl: 'cell' as Level, label: 'Cyarwa Cell' }].
            map((n) =>
            <button
              key={n.lvl}
              onClick={() => setLevel(n.lvl === 'national' ? 'province' : n.lvl === 'province' ? 'district' : n.lvl === 'district' ? 'sector' : n.lvl === 'sector' ? 'cell' : 'cell')}
              style={{ paddingLeft: n.d * 20 }}
              className={`block w-full text-left rounded px-2 hover:bg-epi-bg ${LEVELS[idx - 1]?.id === n.lvl || level === 'national' && n.lvl === 'national' ? 'bg-epi/10 font-bold text-epi' : ''}`}>

                {n.label}
              </button>
            )}
            <div className="text-epi-muted pl-2 text-[12px] mt-2">Click a level to drill into its children.</div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-[18px] font-bold text-epi-text mb-1">{view.title}</h2>
            <p className="text-[13px] text-epi-muted">Source: {view.source}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  {[view.unit, 'Cases', 'Population', 'Incidence Rate', 'Contribution to Total'].map((h, i) =>
                  <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${i >= 1 && i <= 3 ? 'text-right' : ''}`}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => {
                  const share = totalCases ? r.cases / totalCases : 0;
                  return (
                    <tr key={r.name} className="hover:bg-epi-bg/50">
                      <td className="p-4 text-[14px] font-bold text-epi-text">{r.name}</td>
                      <td className="p-4 text-[14px] text-epi-text text-right">{fmtNumber(r.cases)}</td>
                      <td className="p-4 text-[14px] text-epi-text text-right">{fmtNumber(r.population)}</td>
                      <td className="p-4 text-[14px] text-epi-text text-right">{rate(r).toFixed(2)}/1,000</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-epi-text w-10">{Math.round(share * 100)}%</span>
                          <div className="flex-1 h-2 bg-epi-bg rounded-full overflow-hidden min-w-[60px]">
                            <div className={`h-full ${bar(share)}`} style={{ width: `${share * 100}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>);

                })}
                {rows.length > 1 &&
                <tr className="bg-epi/5 border-t-2 border-epi">
                    <td className="p-4 text-[14px] font-bold text-epi">{view.total}</td>
                    <td className="p-4 text-[14px] font-bold text-epi text-right">{fmtNumber(totalCases)}</td>
                    <td className="p-4 text-[14px] font-bold text-epi text-right">{fmtNumber(totalPop)}</td>
                    <td className="p-4 text-[14px] font-bold text-epi text-right">{(totalCases / totalPop * 1000).toFixed(2)}/1,000</td>
                    <td className="p-4 text-[14px] font-bold text-epi">100%</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-border mt-auto flex justify-between gap-3">
            <button onClick={() => setLevel(LEVELS[idx + 1].id)} disabled={idx >= LEVELS.length - 1} className="text-[13px] font-bold text-epi hover:underline disabled:text-epi-muted disabled:no-underline">
              {idx < LEVELS.length - 1 ? `Drill-up to ${LEVELS[idx + 1].label} →` : 'Top level reached'}
            </button>
            <button onClick={() => setLevel(LEVELS[idx - 1].id)} disabled={idx === 0} className="text-[13px] font-bold text-epi hover:underline disabled:text-epi-muted disabled:no-underline">
              {idx > 0 ? `Drill-down to ${LEVELS[idx - 1].label} →` : 'Lowest level reached'}
            </button>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}
