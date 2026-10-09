import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { useApp } from '../../store/AppStore';
import { isOpenStatus } from '../../lib/format';

const TIMEFRAME: Record<string, number> = {
  'Timeframe: Next 1 week': 0.85,
  'Timeframe: Next 2–4 weeks': 1,
  'Timeframe: Next 4–8 weeks': 1.1
};
const BANDS = [
['HIGH PROBABILITY', 70, 101, 'bg-epi-red/5 text-epi-red', 'bg-epi-red'],
['MODERATE PROBABILITY', 50, 70, 'bg-epi-amber/10 text-[#F97316]', 'bg-[#F97316]'],
['LOW PROBABILITY', 0, 50, 'bg-[#00A550]/5 text-[#00A550]', 'bg-epi-amber']] as
const;
const sel = 'text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-white shadow-sm';

export function PredictionProbability() {
  const { state } = useApp();
  const [disease, setDisease] = useState('all');
  const [province, setProvince] = useState('all');
  const [minP, setMinP] = useState(30);
  const [timeframe, setTimeframe] = useState('Timeframe: Next 2–4 weeks');
  const open = state.alerts.filter((a) => isOpenStatus(a.status));
  const rows = open.
  map((a) => {
    const g = Math.max(0.02, Number(a.change.replace(/[^0-9.-]/g, '')) / 100 || 0.1);
    const risk = state.districtRisk.find((r) => r.district === a.district);
    return { a, p: Math.min(99, Math.round(a.probability * TIMEFRAME[timeframe])), conf: risk?.confidence ?? 80, r0: Math.min(4, 1 + g * 0.9) };
  }).
  filter((r) => (disease === 'all' || r.a.disease === disease) && (province === 'all' || r.a.province === province) && r.p > minP).
  sort((x, y) => y.p - x.p);
  return (
    <PredictionLayout
      title="Outbreak Probability Calculator"
      subtitle="Probability of outbreak occurring if conditions remain unchanged"
      breadcrumb="Outbreak Probability">
      
      {/* Explainer Banner */}
      <div className="bg-epi/10 border border-epi/20 p-4 rounded-lg mb-6 flex items-start gap-3">
        <span className="text-[20px]"></span>
        <div className="text-[13px] text-epi-text leading-relaxed">
          <span className="font-bold">How to read this:</span> A 91% probability
          means — if conditions stay the same and nothing is done, there is a
          91% chance a full outbreak will occur within the stated timeframe.
          This is a forecast, not a certainty.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 flex-wrap">
        <select value={disease} onChange={(e) => setDisease(e.target.value)} aria-label="Disease" className={sel}>
          <option value="all">Disease: All Diseases</option>
          {Array.from(new Set(open.map((a) => a.disease))).sort().map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={province} onChange={(e) => setProvince(e.target.value)} aria-label="Province" className={sel}>
          <option value="all">Province: All</option>
          {['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={minP} onChange={(e) => setMinP(Number(e.target.value))} aria-label="Minimum probability" className={sel}>
          {[0, 30, 50, 70].map((p) => <option key={p} value={p}>Min probability: &gt;{p}%</option>)}
        </select>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} aria-label="Timeframe" className={sel}>
          {Object.keys(TIMEFRAME).map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Main Probability Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  District
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Disease
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Probability
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Timeframe
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Confidence
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  R0
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 &&
              <tr><td colSpan={8} className="p-6 text-center text-[13px] text-epi-muted">No outbreaks match these filters.</td></tr>
              }
              {BANDS.map(([label, lo, hi, cls, bar]) => {
                const band = rows.filter((r) => r.p >= lo && r.p < hi);
                if (band.length === 0) return null;
                return (
                  <Fragment key={label}>
                    <tr className={cls}>
                      <td colSpan={8} className="p-2 text-[11px] font-bold uppercase tracking-wider pl-4">{label}</td>
                    </tr>
                    {band.map((r) =>
                    <tr key={r.a.id} className="hover:bg-epi-bg/50">
                        <td className="p-4 text-[14px] font-bold text-epi-text">{r.a.district}</td>
                        <td className="p-4 text-[13px] text-epi-text">{r.a.disease}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold w-10">{r.p}%</span>
                            <div className="w-24 h-2 bg-epi-bg rounded-full overflow-hidden">
                              <div className={`h-full ${bar}`} style={{ width: `${r.p}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[13px] text-epi-text">{timeframe.replace('Timeframe: ', '')}</td>
                        <td className="p-4 text-[13px] font-bold text-[#00A550]">{r.conf >= 85 ? '● High' : '● Medium'} ({r.conf}%)</td>
                        <td className={`p-4 text-[13px] font-bold ${r.r0 > 2 ? 'text-epi-red' : r.r0 > 1 ? 'text-[#F97316]' : 'text-[#00A550]'}`}>{r.r0.toFixed(1)}</td>
                        <td className="p-4 text-[13px] font-bold">{r.p >= 70 ? '● Act immediately' : r.p >= 50 ? '● Prepare response' : '● Monitor'}</td>
                        <td className="p-4 text-[13px] text-right">
                          <Link to={`/warning/detail?id=${r.a.id}`} className="text-epi font-medium hover:underline">{r.p >= 70 ? 'Respond' : 'Review'}</Link>
                        </td>
                      </tr>
                    )}
                  </Fragment>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* R0 Explanation Card */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 w-full max-w-2xl">
        <h2 className="text-[14px] font-bold text-epi-text mb-4">
          R0 Reference Guide:
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px]">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">&lt; 1.0</div>
            <div className="text-epi-muted">Disease dying out</div>
            <div className="text-[#00A550] font-bold">●</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">= 1.0</div>
            <div className="text-epi-muted">Stable, not growing</div>
            <div className="text-epi-amber font-bold">●</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">1.1–2.0</div>
            <div className="text-epi-muted">Growing → alert</div>
            <div className="text-[#F97316] font-bold">●</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-epi-text">&gt; 2.0</div>
            <div className="text-epi-muted">Rapidly spreading</div>
            <div className="text-epi-red font-bold">●</div>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}