import React, { useState } from 'react';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
const DISTRICTS = [
{
  dist: 'Rusizi',
  prov: 'Western',
  score: 91,
  driver: 'Cholera + water quality',
  trend: '↑ Rising',
  conf: '89%',
  val: '✅ Validated',
  action: 'Review · Adjust'
},
{
  dist: 'Kayonza',
  prov: 'Eastern',
  score: 84,
  driver: 'Malaria + rainfall',
  trend: '↑ Rising',
  conf: '82%',
  val: '✅ Validated',
  action: 'Review · Adjust'
},
{
  dist: 'Bugesera',
  prov: 'Eastern',
  score: 72,
  driver: 'Malaria + poor CHW coverage',
  trend: '→ Stable',
  conf: '76%',
  val: '⚠️ Pending',
  action: 'Review · Adjust'
},
{
  dist: 'Huye',
  prov: 'Southern',
  score: 61,
  driver: 'Malnutrition + low WASH',
  trend: '→ Stable',
  conf: '71%',
  val: '✅ Validated',
  action: 'Review · Adjust'
},
{
  dist: 'Nyaruguru',
  prov: 'Southern',
  score: 58,
  driver: 'Under-5 mortality',
  trend: '↓ Improving',
  conf: '68%',
  val: '⚠️ Pending',
  action: 'Review · Adjust'
},
{
  dist: 'Musanze',
  prov: 'Northern',
  score: 18,
  driver: 'Low risk',
  trend: '↓ Falling',
  conf: '91%',
  val: '✅ Validated',
  action: 'View'
}];

export function AnalystRiskScores() {
  const [valStatus, setValStatus] = useState('pending');
  return (
    <AnalystLayout
      title="AI Risk Score Review"
      subtitle="Validate and adjust AI Vital risk predictions across all 30 districts"
      breadcrumb="Risk Score Review">
      
      <div className="bg-epi-bg border border-border rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between text-[13px]">
        <div className="flex items-center gap-4">
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
        <div className="text-epi-muted font-medium">
          Last model retrain: May 15, 2026
        </div>
      </div>

      <div className="grid grid-cols-[55%_45%] gap-6">
        {/* Left - Table */}
        <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden flex flex-col h-fit">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-epi-text">
              District Risk Scores — AI Vital Predictions
            </h2>
          </div>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-epi-bg/30">
            <div className="flex gap-2 text-[12px] font-bold">
              <span className="bg-white px-3 py-1.5 rounded-full border border-border cursor-pointer hover:border-epi">
                All
              </span>
              <span className="bg-epi-red/10 text-epi-red px-3 py-1.5 rounded-full border border-epi-red/20 cursor-pointer">
                🔴 Critical (2)
              </span>
              <span className="bg-epi-amber/10 text-epi-amber px-3 py-1.5 rounded-full border border-epi-amber/20 cursor-pointer">
                🟠 High (5)
              </span>
              <span className="bg-[#FEF08A]/40 text-[#A16207] px-3 py-1.5 rounded-full border border-[#FDE047] cursor-pointer">
                🟡 Moderate (8)
              </span>
              <span className="bg-white text-epi-accent px-3 py-1.5 rounded-full border border-border cursor-pointer">
                🟢 Low (15)
              </span>
            </div>
            <select className="h-8 px-2 bg-white border border-border rounded text-[12px] focus:outline-none focus:border-epi">
              <option>Sort: Risk Score ▼</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
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
                {DISTRICTS.map((row, i) =>
                <tr
                  key={i}
                  className={`hover:bg-epi-bg/30 ${row.dist === 'Kayonza' ? 'bg-epi/5' : ''}`}>
                  
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.dist}
                    </td>
                    <td className="px-4 py-3 text-epi-muted">{row.prov}</td>
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.score}/100
                    </td>
                    <td className="px-4 py-3 text-epi-muted truncate max-w-[120px]">
                      {row.driver}
                    </td>
                    <td
                    className={`px-4 py-3 font-medium ${row.trend.includes('↑') ? 'text-epi-red' : row.trend.includes('↓') ? 'text-epi-accent' : 'text-epi-muted'}`}>
                    
                      {row.trend}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.conf}</td>
                    <td className="px-4 py-3 font-medium">{row.val}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[12px] font-bold text-epi hover:underline">
                        {row.action}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - Detail Panel */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col h-fit">
          <div className="mb-6">
            <div className="text-[12px] font-medium text-epi-muted mb-1">
              Currently showing: Kayonza District
            </div>
            <h2 className="text-[18px] font-bold text-epi-text">
              Kayonza District — Risk Score Breakdown
            </h2>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-32 h-32 rounded-full border-8 border-epi-amber flex flex-col items-center justify-center shrink-0">
              <div className="text-[32px] font-bold text-epi-text leading-none">
                84
              </div>
              <div className="text-[14px] font-medium text-epi-muted">
                / 100
              </div>
            </div>
            <div>
              <div className="text-[18px] font-bold text-epi-amber mb-1">
                HIGH RISK
              </div>
              <p className="text-[13px] text-epi-muted leading-relaxed">
                AI model indicates high probability of malaria outbreak within
                14 days based on 6 weighted factors.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-[14px] font-bold text-epi-text">
              Risk factor breakdown
            </h3>
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-epi-text">Malaria case trend</span>
                <span className="font-bold">28 pts</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-epi-red"
                  style={{
                    width: '28%'
                  }} />
                
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-epi-text">Rainfall above normal</span>
                <span className="font-bold">18 pts</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-epi-amber"
                  style={{
                    width: '18%'
                  }} />
                
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-epi-text">CHW coverage gap</span>
                <span className="font-bold">14 pts</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EAB308]"
                  style={{
                    width: '14%'
                  }} />
                
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-epi-text">WASH score</span>
                <span className="font-bold">12 pts</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-epi"
                  style={{
                    width: '12%'
                  }} />
                
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-epi-text">Vaccination rate</span>
                <span className="font-bold">8 pts</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-epi-info"
                  style={{
                    width: '8%'
                  }} />
                
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-epi-text">Historical pattern</span>
                <span className="font-bold">4 pts</span>
              </div>
              <div className="h-2 bg-epi-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-epi-muted"
                  style={{
                    width: '4%'
                  }} />
                
              </div>
            </div>
            <div className="flex justify-between text-[13px] font-bold pt-2 border-t border-border">
              <span>Total Score</span>
              <span>84 / 100</span>
            </div>
          </div>

          <div className="bg-epi-bg border border-border rounded-lg p-5">
            <h3 className="text-[14px] font-bold text-epi-text mb-4 flex items-center justify-between">
              Analyst Validation
              <span className="text-[12px] font-bold text-epi-amber bg-epi-amber/10 px-2 py-1 rounded">
                ⚠️ Pending validation
              </span>
            </h3>

            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                <input
                  type="radio"
                  name="val"
                  checked={valStatus === 'valid'}
                  onChange={() => setValStatus('valid')}
                  className="accent-epi" />
                {' '}
                Validate (agree with AI score)
              </label>
              <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                <input
                  type="radio"
                  name="val"
                  checked={valStatus === 'adjust'}
                  onChange={() => setValStatus('adjust')}
                  className="accent-epi" />
                {' '}
                Adjust Score (override)
              </label>
              <label className="flex items-center gap-2 text-[13px] text-epi-text cursor-pointer">
                <input
                  type="radio"
                  name="val"
                  checked={valStatus === 'flag'}
                  onChange={() => setValStatus('flag')}
                  className="accent-epi" />
                {' '}
                Flag as Incorrect
              </label>
            </div>

            {valStatus === 'adjust' &&
            <div className="mb-4">
                <label className="block text-[12px] font-bold text-epi-muted mb-2">
                  New Score (0-100)
                </label>
                <input
                type="range"
                min="0"
                max="100"
                defaultValue="84"
                className="w-full accent-epi" />
              
              </div>
            }

            <textarea
              rows={2}
              placeholder="Add validation notes..."
              className="w-full px-3 py-2 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-epi resize-none mb-4" />
            

            <button className="w-full h-10 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md">
              Submit Validation
            </button>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}