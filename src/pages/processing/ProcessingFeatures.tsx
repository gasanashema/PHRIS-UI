import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
const jsonLines: {
  indent?: boolean;
  comment?: string;
  key?: string;
  value?: string;
  type?: 'string' | 'number' | 'bool';
}[] = [
{
  comment: '// Case trend features'
},
{
  key: 'cases_this_week',
  value: '87',
  type: 'number'
},
{
  key: 'cases_7day_avg',
  value: '54.3',
  type: 'number'
},
{
  key: 'wow_growth_rate',
  value: '0.45',
  type: 'number'
},
{
  key: 'doubling_time_days',
  value: '4.2',
  type: 'number'
},
{
  key: 'r0_estimate',
  value: '2.3',
  type: 'number'
},
{
  comment: '// Population features'
},
{
  key: 'incidence_per_1000',
  value: '1.74',
  type: 'number'
},
{
  key: 'attack_rate',
  value: '0.256',
  type: 'number'
},
{
  key: 'cfr',
  value: '0.034',
  type: 'number'
},
{
  comment: '// Environmental features'
},
{
  key: 'rainfall_14day_lag_corr',
  value: '0.79',
  type: 'number'
},
{
  key: 'water_quality_score',
  value: '2.1',
  type: 'number'
},
{
  key: 'wash_coverage_pct',
  value: '0.41',
  type: 'number'
},
{
  comment: '// Seasonal features'
},
{
  key: 'seasonal_baseline_dev',
  value: '3.40',
  type: 'number'
},
{
  key: 'rainy_season_active',
  value: 'true',
  type: 'bool'
},
{
  key: 'historical_june_avg',
  value: '18.4',
  type: 'number'
},
{
  comment: '// Access features'
},
{
  key: 'healthcare_access_score',
  value: '3.8',
  type: 'number'
},
{
  key: 'chw_coverage_score',
  value: '4.2',
  type: 'number'
},
{
  comment: '// Composite'
},
{
  key: 'vulnerability_index',
  value: '91',
  type: 'number'
},
{
  key: 'cross_border_risk',
  value: 'true',
  type: 'bool'
}];

const featureRows = [
{
  raw: 'Daily case counts',
  feature: '7-day moving average',
  method: 'Rolling mean',
  output: '"87 → avg 54.3/day"'
},
{
  raw: 'Case counts over time',
  feature: 'Week-over-week growth rate',
  method: '% change calculation',
  output: '"38 cases → +45% vs last week"'
},
{
  raw: 'Population + cases',
  feature: 'Disease density score',
  method: 'Normalized per 1,000',
  output: '"1.74 per 1,000 residents"'
},
{
  raw: 'Rainfall data + cases',
  feature: 'Rainfall-disease lag correlation',
  method: 'Pearson correlation (14-day lag)',
  output: '"r = 0.79 (strong)"'
},
{
  raw: 'Distance to facility',
  feature: 'Healthcare access score',
  method: 'Composite index 0–10',
  output: '"Tumba sector: 3.2/10 (poor)"'
},
{
  raw: 'Multiple disease rates',
  feature: 'Combined vulnerability index',
  method: 'Weighted composite',
  output: '"Rusizi: 91/100 (very high)"'
},
{
  raw: 'Historical case data',
  feature: 'Seasonal baseline deviation',
  method: 'Z-score vs 3-year baseline',
  output: '"+340% above June normal"'
},
{
  raw: 'CHW activity data',
  feature: 'Community surveillance score',
  method: 'Coverage rate index',
  output: '"Mukura: 2.1/10 (critical gap)"'
}];

function valueColor(type?: 'string' | 'number' | 'bool') {
  if (type === 'number') return 'text-[#f87171]';
  if (type === 'bool') return 'text-[#c084fc]';
  return 'text-[#fde047]';
}
export function ProcessingFeatures() {
  return (
    <ProcessingLayout
      title="Feature Engineering Pipeline"
      subtitle="Transforming clean data into AI-ready inputs for outbreak prediction"
      breadcrumb="Feature Engineering">
      
      {/* Top Progress Card */}
      <div className="bg-epi text-white rounded-lg p-6 shadow-card mb-6">
        <h2 className="text-[16px] font-bold mb-4 flex items-center gap-2">
          🧠 Feature Engineering Pipeline — Currently Running
        </h2>
        <div className="w-full bg-white/20 rounded-full h-2 mb-3">
          <div
            className="bg-white h-2 rounded-full"
            style={{
              width: '62%'
            }}>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between text-[13px] font-medium opacity-90 gap-3">
          <span>62% complete</span>
          <span>Processing 47,230 records</span>
          <span>Estimated completion: 15:28 PM</span>
          <span>Features generated so far: 1,847</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              Raw Data → AI Features
            </h2>
            <p className="text-[13px] text-epi-muted">
              How raw numbers become meaningful AI inputs
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Raw Input
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Engineered Feature
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Method
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Example Output
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {featureRows.map((row, idx) =>
                <tr key={idx} className="hover:bg-epi-bg/50">
                    <td className="p-3 text-[13px] text-epi-text">{row.raw}</td>
                    <td className="p-3 text-[13px] font-bold text-epi-text">
                      {row.feature}
                    </td>
                    <td className="p-3 text-[13px] text-epi-muted">
                      {row.method}
                    </td>
                    <td className="p-3 text-[13px] font-mono text-epi">
                      {row.output}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-epi-text">
                Sample AI Input Package — Rusizi District, Cholera
              </h2>
              <p className="text-[13px] text-epi-muted">
                What the AI model receives as input
              </p>
            </div>

            <div className="bg-[#0B3A36] p-6 text-[13px] font-mono leading-relaxed overflow-x-auto flex-1">
              <div className="text-white/90">
                <div>
                  <span className="text-[#4ade80]">{'{'}</span>
                </div>
                <div className="pl-4">
                  <span className="text-[#67e8f9]">"district"</span>
                  <span>: </span>
                  <span className="text-[#fde047]">"Rusizi"</span>
                  <span>,</span>
                </div>
                <div className="pl-4">
                  <span className="text-[#67e8f9]">"disease"</span>
                  <span>: </span>
                  <span className="text-[#fde047]">"Cholera"</span>
                  <span>,</span>
                </div>
                <div className="pl-4">
                  <span className="text-[#67e8f9]">"date"</span>
                  <span>: </span>
                  <span className="text-[#fde047]">"2026-06-05"</span>
                  <span>,</span>
                </div>
                {jsonLines.map((line, idx) =>
                line.comment ?
                <div key={idx} className="pl-4 pt-2">
                      <span className="text-white/50">{line.comment}</span>
                    </div> :

                <div key={idx} className="pl-4">
                      <span className="text-[#67e8f9]">"{line.key}"</span>
                      <span>: </span>
                      <span className={valueColor(line.type)}>
                        {line.value}
                      </span>
                      <span>,</span>
                    </div>

                )}
                <div>
                  <span className="text-[#4ade80]">{'}'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-epi/10 border-t border-epi/20">
              <div className="text-[13px] text-epi-text font-medium flex items-start gap-2">
                <span className="text-[16px]">💡</span>
                <p>
                  With these features, the AI model can predict: Outbreak
                  probability, expected case count in 2–4 weeks, which
                  interventions will have the most impact, and confidence level
                  of the prediction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}