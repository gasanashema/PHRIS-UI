import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import { useApp } from '../../store/AppStore';
import type { DistrictRisk } from '../../types';

// Districts the analytics team had already validated before this session
const PRE_VALIDATED = ['Rusizi', 'Kayonza', 'Huye', 'Musanze', 'Gasabo', 'Kicukiro', 'Rulindo', 'Burera'];
const DRIVERS: Record<string, string> = {
  Cholera: 'Cholera + water quality',
  Malaria: 'Malaria + rainfall',
  Malnutrition: 'Malnutrition + low WASH',
  Measles: 'Measles + vaccination gaps',
  Mpox: 'Mpox + cross-border movement',
  Typhoid: 'Typhoid + water quality',
  'Diarrheal Disease': 'Diarrheal + sanitation',
  Respiratory: 'Respiratory + air quality'
};
const FACTOR_SETS: Record<string, [string, number, string][]> = {
  Malaria: [['Malaria case trend', 0.33, 'bg-epi-red'], ['Rainfall above normal', 0.22, 'bg-epi-amber'], ['CHW coverage gap', 0.17, 'bg-[#EAB308]'], ['WASH score', 0.14, 'bg-epi'], ['Vaccination rate', 0.09, 'bg-epi-info'], ['Historical pattern', 0.05, 'bg-epi-muted']],
  Cholera: [['Cholera case trend', 0.34, 'bg-epi-red'], ['Water source contamination', 0.24, 'bg-epi-amber'], ['WASH score', 0.18, 'bg-[#EAB308]'], ['Rainfall / flooding', 0.12, 'bg-epi'], ['Population movement', 0.08, 'bg-epi-info'], ['Historical pattern', 0.04, 'bg-epi-muted']]
};
const DEFAULT_FACTORS: [string, number, string][] = [['Case trend', 0.32, 'bg-epi-red'], ['Environmental factors', 0.2, 'bg-epi-amber'], ['Service coverage gap', 0.18, 'bg-[#EAB308]'], ['WASH score', 0.14, 'bg-epi'], ['Vaccination rate', 0.1, 'bg-epi-info'], ['Historical pattern', 0.06, 'bg-epi-muted']];

type Band = 'Critical' | 'High' | 'Moderate' | 'Low';
const bandOf = (s: number): Band => s >= 80 ? 'Critical' : s >= 60 ? 'High' : s >= 40 ? 'Moderate' : 'Low';
const BAND: Record<Band, {chip: string;ring: string;text: string;label: string;}> = {
  Critical: { chip: 'bg-epi-red/10 text-epi-red border-epi-red/20', ring: 'border-epi-red', text: 'text-epi-red', label: '🔴 Critical' },
  High: { chip: 'bg-epi-amber/10 text-epi-amber border-epi-amber/20', ring: 'border-epi-amber', text: 'text-epi-amber', label: '🟠 High' },
  Moderate: { chip: 'bg-[#FEF08A]/40 text-[#A16207] border-[#FDE047]', ring: 'border-[#EAB308]', text: 'text-[#A16207]', label: '🟡 Moderate' },
  Low: { chip: 'bg-white text-epi-accent border-border', ring: 'border-epi-accent', text: 'text-epi-accent', label: '🟢 Low' }
};
const TREND: Record<DistrictRisk['trend'], string> = { up: '↑ Rising', down: '↓ Falling', stable: '→ Stable' };

export function AnalystRiskScores() {
  const { state, actions } = useApp();
  const [band, setBand] = useState<Band | 'All'>('All');
  const [sort, setSort] = useState('score-desc');
  const [selected, setSelected] = useState('Kayonza');
  const [valStatus, setValStatus] = useState('');
  const [newScore, setNewScore] = useState(84);
  const [note, setNote] = useState('');

  const validation = (d: string) => {
    const act = state.activity.find((a) => a.module === 'Prediction' && a.action.endsWith(`risk score — ${d}`));
    if (act) return act.action.includes('flagged') ? '🚩 Flagged' : act.action.includes('adjusted') ? '✏️ Adjusted' : '✅ Validated';
    return PRE_VALIDATED.includes(d) ? '✅ Validated' : '⚠️ Pending';
  };
  const rows = state.districtRisk.
  filter((r) => band === 'All' || bandOf(r.score) === band).
  sort((a, b) =>
  sort === 'score-asc' ? a.score - b.score :
  sort === 'conf' ? b.confidence - a.confidence :
  sort === 'name' ? a.district.localeCompare(b.district) :
  b.score - a.score
  );
  const count = (b: Band) => state.districtRisk.filter((r) => bandOf(r.score) === b).length;
  const sel = state.districtRisk.find((r) => r.district === selected) ?? state.districtRisk[0];
  const selBand = bandOf(sel.score);
  const factors = (FACTOR_SETS[sel.disease] ?? DEFAULT_FACTORS).map(([name, w, color]) => ({ name, color, pts: Math.round(sel.score * w) }));
  const total = factors.reduce((s, f) => s + f.pts, 0);
  if (factors.length) factors[0].pts += sel.score - total; // keep the breakdown summing exactly to the score
  const selValidation = validation(sel.district);

  const choose = (d: string) => {
    setSelected(d);
    setValStatus('');
    setNote('');
    setNewScore(state.districtRisk.find((r) => r.district === d)?.score ?? 50);
  };
  const submit = () => {
    const decision = valStatus === 'adjust' ? 'Adjust' : valStatus === 'flag' ? 'Flag' : 'Validate';
    actions.overrideRisk(sel.district, newScore, decision, note.trim() || 'No notes');
    setValStatus('');
    setNote('');
  };
  const needsNote = valStatus === 'adjust' || valStatus === 'flag';

  return (
    <AnalystLayout
      title="AI Risk Score Review"
      subtitle="Validate and adjust AI Vital risk predictions across all 30 districts"
      breadcrumb="Risk Score Review">

      <div className="bg-epi-bg border border-border rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-[13px]">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-epi-muted">
              Model Accuracy (last 90 days):
            </span>{' '}
            <span className="font-bold text-epi-text">84.7%</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div>
            <span className="text-epi-muted">Predictions Made:</span>{' '}
            <span className="font-bold text-epi-text">1,240</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div>
            <span className="text-epi-muted">Correct:</span>{' '}
            <span className="font-bold text-epi-accent">1,051</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div>
            <span className="text-epi-muted">False Positives:</span>{' '}
            <span className="font-bold text-epi-amber">98</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div>
            <span className="text-epi-muted">Missed Outbreaks:</span>{' '}
            <span className="font-bold text-epi-red">11</span>
          </div>
        </div>
        <Link to="/prediction/performance" className="text-epi font-medium hover:underline">
          Last model retrain: May 15, 2026 →
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[55%_minmax(0,1fr)] gap-6">
        {/* Left - Table */}
        <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col h-fit">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-epi-text">
              District Risk Scores — AI Vital Predictions
            </h2>
          </div>
          <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center justify-between bg-epi-bg/30">
            <div className="flex flex-wrap gap-2 text-[12px] font-bold">
              <button onClick={() => setBand('All')} className={`bg-white px-3 py-1.5 rounded-full border hover:border-epi ${band === 'All' ? 'border-epi ring-1 ring-epi' : 'border-border'}`}>
                All ({state.districtRisk.length})
              </button>
              {(['Critical', 'High', 'Moderate', 'Low'] as Band[]).map((b) =>
              <button key={b} onClick={() => setBand(b)} className={`px-3 py-1.5 rounded-full border ${BAND[b].chip} ${band === b ? 'ring-1 ring-epi' : ''}`}>
                  {BAND[b].label} ({count(b)})
                </button>
              )}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-8 px-2 bg-white border border-border rounded text-[12px] focus:outline-none focus:border-epi">
              <option value="score-desc">Sort: Risk Score ▼</option>
              <option value="score-asc">Sort: Risk Score ▲</option>
              <option value="conf">Sort: AI Confidence ▼</option>
              <option value="name">Sort: District A–Z</option>
            </select>
          </div>
          <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border sticky top-0">
                <tr>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Province</th>
                  <th className="px-4 py-3">Risk Score</th>
                  <th className="px-4 py-3">Main Driver</th>
                  <th className="px-4 py-3">Trend</th>
                  <th className="px-4 py-3">AI Conf.</th>
                  <th className="px-4 py-3">Validation</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) =>
                <tr
                  key={row.district}
                  onClick={() => choose(row.district)}
                  className={`cursor-pointer hover:bg-epi-bg/30 ${row.district === sel.district ? 'bg-epi/5' : ''}`}>

                    <td className="px-4 py-3 font-bold text-epi-text">{row.district}</td>
                    <td className="px-4 py-3 text-epi-muted">{row.province}</td>
                    <td className={`px-4 py-3 font-bold ${BAND[bandOf(row.score)].text}`}>{row.score}/100</td>
                    <td className="px-4 py-3 text-epi-muted truncate max-w-[140px]" title={DRIVERS[row.disease] ?? row.disease}>
                      {row.score < 20 ? 'Low risk' : DRIVERS[row.disease] ?? row.disease}
                    </td>
                    <td className={`px-4 py-3 font-medium whitespace-nowrap ${row.trend === 'up' ? 'text-epi-red' : row.trend === 'down' ? 'text-epi-accent' : 'text-epi-muted'}`}>
                      {TREND[row.trend]}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.confidence}%</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{validation(row.district)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                      onClick={(e) => {
                        e.stopPropagation();
                        choose(row.district);
                        document.getElementById('risk-detail')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[12px] font-bold text-epi hover:underline whitespace-nowrap">
                        {row.score >= 40 ? 'Review · Adjust' : 'View'}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - Detail Panel */}
        <div id="risk-detail" className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col h-fit scroll-mt-4">
          <div className="mb-6">
            <div className="text-[12px] font-medium text-epi-muted mb-1">
              Currently showing: {sel.district} District
            </div>
            <h2 className="text-[18px] font-bold text-epi-text">
              {sel.district} District — Risk Score Breakdown
            </h2>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center shrink-0 ${BAND[selBand].ring}`}>
              <div className="text-[32px] font-bold text-epi-text leading-none">{sel.score}</div>
              <div className="text-[14px] font-medium text-epi-muted">/ 100</div>
            </div>
            <div>
              <div className={`text-[18px] font-bold mb-1 ${BAND[selBand].text}`}>{selBand.toUpperCase()} RISK</div>
              <p className="text-[13px] text-epi-muted leading-relaxed">
                AI model indicates {selBand === 'Low' ? 'a low' : selBand === 'Moderate' ? 'a moderate' : 'a high'} probability of {sel.disease.toLowerCase()} outbreak within
                14 days based on {factors.length} weighted factors (confidence {sel.confidence}%).
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-[14px] font-bold text-epi-text">Risk factor breakdown</h3>
            {factors.map((f) =>
            <div key={f.name}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-epi-text">{f.name}</span>
                  <span className="font-bold">{f.pts} pts</span>
                </div>
                <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                  <div className={`h-full ${f.color}`} style={{ width: `${f.pts}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-between text-[13px] font-bold pt-2 border-t border-border">
              <span>Total Score</span>
              <span>{sel.score} / 100</span>
            </div>
          </div>

          <div className="bg-epi-bg border border-border rounded-lg p-5">
            <h3 className="text-[14px] font-bold text-epi-text mb-4 flex items-center justify-between gap-2">
              Analyst Validation
              <span className={`text-[12px] font-bold px-2 py-1 rounded ${selValidation.includes('Pending') ? 'text-epi-amber bg-epi-amber/10' : 'text-epi-accent bg-epi-accent/10'}`}>
                {selValidation.includes('Pending') ? '⚠️ Pending validation' : selValidation}
              </span>
            </h3>

            <div className="space-y-3 mb-4">
              {[['valid', 'Validate (agree with AI score)'], ['adjust', 'Adjust Score (override)'], ['flag', 'Flag as Incorrect']].map(([k, label]) =>
              <label key={k} className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                  <input type="radio" name="val" checked={valStatus === k} onChange={() => setValStatus(k)} className="accent-epi" /> {label}
                </label>
              )}
            </div>

            {valStatus === 'adjust' &&
            <div className="mb-4">
                <label className="flex justify-between text-[12px] font-bold text-epi-muted mb-2">
                  <span>New Score (0-100)</span>
                  <span className="text-epi-text">{sel.score} → {newScore}</span>
                </label>
                <input
                type="range"
                min="0"
                max="100"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full accent-epi" />
              </div>
            }

            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={needsNote ? 'Reason required for overrides and flags…' : 'Add validation notes...'}
              className="w-full px-3 py-2 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi resize-none mb-4" />

            <button
              onClick={submit}
              disabled={!valStatus || needsNote && !note.trim() || valStatus === 'adjust' && newScore === sel.score}
              className="w-full h-10 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Validation
            </button>
            <p className="text-[11px] text-epi-muted mt-2">
              Adjusted scores update the shared district risk used by Prediction maps and the Risk Probability table.
            </p>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}
