import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer } from
'recharts';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
import { useApp } from '../../store/AppStore';
import { downloadFile, fmtDate, nowISO } from '../../lib/format';

type Level = 'Very High' | 'High' | 'Moderate';
interface Group {
  id: string;
  name: string;
  district: string;
  level: Level;
  risks: string;
  population: number;
  coverage: string;
  score: number;
  radar: number[]; // 7 factors, 0–10
  gaps: [string, string][]; // [icon, text]
  recommended: string[];
  cost: number; // RWF
  impact: string;
}
const FACTORS = ['Age risk factor', 'Nutritional status', 'Sanitation access', 'Distance to facility', 'Vaccination coverage', 'Poverty (Ubudehe)', 'Disease exposure'];
const GROUPS: Group[] = [
{
  id: 'u5-rusizi', name: 'Children Under 5 — Rusizi District', district: 'Rusizi', level: 'Very High', risks: 'Cholera + Malnutrition', population: 12400, coverage: 'ORS ✅ | Nutrition ❌ (gap)', score: 91,
  radar: [9, 8, 8, 6, 5, 8, 9],
  gaps: [['❌', 'Therapeutic feeding program — not covering Bugarama sector'], ['❌', 'WASH hygiene kits — out of stock at Rusizi HC since May'], ['⚠️', 'Vitamin A supplementation — only 61% coverage in this group']],
  recommended: ['Deploy therapeutic feeding to Bugarama immediately', 'Restock hygiene kits at Rusizi HC', 'Schedule Vitamin A campaign before August'],
  cost: 4_200_000, impact: 'Prevent ~340 cholera cases + reduce acute malnutrition by est. 18% in this group'
},
{
  id: 'refugees-gicumbi', name: 'Refugees — Gicumbi Camp (Nyabiheke)', district: 'Gicumbi', level: 'High', risks: 'Multiple diseases + limited healthcare access', population: 15600, coverage: 'UNHCR ✅ | WASH ⚠️ partial', score: 78,
  radar: [6, 6, 8, 5, 6, 9, 8],
  gaps: [['⚠️', 'Latrine ratio 1:38 — above the 1:20 emergency standard'], ['⚠️', 'Measles catch-up incomplete for new arrivals'], ['❌', 'No dedicated mental health service in camp']],
  recommended: ['Add 120 latrines with UNHCR WASH partner', 'Measles/rubella catch-up at registration point', 'Deploy psychosocial support team monthly'],
  cost: 6_800_000, impact: 'Reduce diarrheal incidence by est. 30% and close measles immunity gap'
},
{
  id: 'elderly-kayonza', name: 'Elderly (65+) — Kayonza District', district: 'Kayonza', level: 'High', risks: 'Malaria complications', population: 8200, coverage: 'Malaria treatment ✅ | Bednet distribution ❌ (gap)', score: 72,
  radar: [8, 5, 4, 7, 4, 6, 8],
  gaps: [['❌', 'Bednet distribution — elderly-headed households not targeted'], ['⚠️', 'Home-based care visits by CHWs below 40%']],
  recommended: ['Targeted bednet distribution to 3,100 elderly-headed households', 'Include 65+ in CHW home-visit schedule during peak season'],
  cost: 2_600_000, impact: 'Prevent ~210 severe malaria cases this season'
},
{
  id: 'pregnant-nyaruguru', name: 'Pregnant Women — Nyaruguru District', district: 'Nyaruguru', level: 'High', risks: 'Maternal mortality + distance to facility', population: 3100, coverage: 'ANC ✅ | Skilled birth ⚠️ 61%', score: 69,
  radar: [5, 6, 5, 9, 6, 7, 5],
  gaps: [['⚠️', 'Skilled birth attendance 61% (target 90%)'], ['❌', 'No maternity waiting home near Ruheru and Nyabimata sectors']],
  recommended: ['Open maternity waiting home at Ruheru HC', 'Ambulance pre-positioning for remote sectors', 'Community mobilisation for facility delivery'],
  cost: 9_400_000, impact: 'Raise skilled birth attendance to est. 78% within 12 months'
},
{
  id: 'u5-nyamagabe', name: 'Children Under 5 — Nyamagabe District', district: 'Nyamagabe', level: 'Moderate', risks: 'Stunting + malnutrition', population: 9800, coverage: 'Nutrition ⚠️ partial | ECD ✅', score: 54,
  radar: [7, 7, 5, 6, 3, 6, 4],
  gaps: [['⚠️', 'Fortified blended food reaches 58% of eligible children'], ['⚠️', 'Growth monitoring attendance falling since March']],
  recommended: ['Expand fortified food distribution through ECD centres', 'SMS reminders for growth monitoring sessions'],
  cost: 3_100_000, impact: 'Reduce stunting prevalence by est. 3 points over 2 years'
}];

const LEVEL_STYLE: Record<Level, {chip: string;card: string;text: string;label: string;}> = {
  'Very High': { chip: 'bg-epi-red/10 text-epi-red border-epi-red/20', card: 'border-2 border-epi-red bg-epi-red/5', text: 'text-epi-red', label: '🔴 VERY HIGH RISK' },
  High: { chip: 'bg-epi-amber/10 text-epi-amber border-epi-amber/20', card: 'border border-epi-amber bg-white', text: 'text-epi-amber', label: '🟠 HIGH RISK' },
  Moderate: { chip: 'bg-[#FEF08A]/40 text-[#A16207] border-[#FDE047]', card: 'border border-[#FDE047] bg-white', text: 'text-[#A16207]', label: '🟡 MODERATE' }
};

export function AnalystVulnerable() {
  const { actions } = useApp();
  const [filter, setFilter] = useState<Level | 'All'>('All');
  const [selectedId, setSelectedId] = useState(GROUPS[0].id);
  const g = GROUPS.find((x) => x.id === selectedId) ?? GROUPS[0];
  const list = GROUPS.filter((x) => filter === 'All' || x.level === filter);
  const radarData = FACTORS.map((subject, i) => ({ subject, A: g.radar[i], fullMark: 10 }));
  const color = g.level === 'Very High' ? '#D32F2F' : g.level === 'High' ? '#F59E0B' : '#EAB308';

  const generate = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Vulnerability Profile — ${g.name}</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;color:#1A1A2E}h1{color:#104E49}td,th{border:1px solid #E5E7EB;padding:6px 10px;text-align:left}table{border-collapse:collapse}</style></head><body>
<div style="color:#6B7280;font-size:13px">RWANDA BIOMEDICAL CENTRE · HEALTH ANALYTICS</div><h1>Vulnerability Profile — ${g.name}</h1>
<p><b>Score:</b> ${g.score}/100 (${g.level}) · <b>Population:</b> ${g.population.toLocaleString()} · <b>Main risks:</b> ${g.risks}</p>
<h2>Vulnerability factors (0–10)</h2><table>${FACTORS.map((f, i) => `<tr><td>${f}</td><td>${g.radar[i]}</td></tr>`).join('')}</table>
<h2>Coverage gaps</h2><ul>${g.gaps.map(([i, t]) => `<li>${i} ${t}</li>`).join('')}</ul>
<h2>Recommended interventions</h2><ol>${g.recommended.map((r) => `<li>${r}</li>`).join('')}</ol>
<p><b>Estimated cost:</b> RWF ${g.cost.toLocaleString()} (~$${Math.round(g.cost / 1100).toLocaleString()} USD). <b>Expected impact:</b> ${g.impact}.</p>
<p style="color:#6B7280;font-size:12px">Generated ${fmtDate(nowISO())} by the AI Vital prototype. Demonstration data.</p></body></html>`;
    downloadFile(`vulnerability-${g.id}.html`, html, 'text/html');
    actions.addFinding({
      source: 'Vulnerable Populations',
      title: `${g.name}: vulnerability ${g.score}/100 (${g.level})`,
      detail: `Main risks: ${g.risks}. Gaps: ${g.gaps.map(([, t]) => t).join('; ')}. Recommended: ${g.recommended.join('; ')}.`
    });
  };

  return (
    <AnalystLayout
      title="Vulnerable Population Analysis"
      subtitle="High-risk groups identified across Rwanda — June 2026"
      breadcrumb="Vulnerable Populations">

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          Total at-risk people identified:{' '}
          <span className="text-epi">284,300</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          Groups profiled: <span className="text-epi">18</span>
        </div>
        <div className="bg-epi-amber/10 px-4 py-2 rounded-full border border-epi-amber/20 text-[13px] font-bold text-epi-amber shadow-sm">
          Districts with coverage gaps: 7
        </div>
        <div className="bg-epi-red/10 px-4 py-2 rounded-full border border-epi-red/20 text-[13px] font-bold text-epi-red shadow-sm">
          Groups with no program coverage: 3
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[40%_minmax(0,1fr)] gap-6">
        {/* Left - List */}
        <div className="bg-white rounded-lg shadow-card border border-border flex flex-col lg:h-[800px]">
          <div className="p-4 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text mb-3">
              Identified High-Risk Groups
            </h2>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <button onClick={() => setFilter('All')} className={`bg-epi-bg px-2.5 py-1 rounded-full border ${filter === 'All' ? 'border-epi ring-1 ring-epi' : 'border-border'}`}>
                All
              </button>
              {(['Very High', 'High', 'Moderate'] as Level[]).map((l) =>
              <button key={l} onClick={() => setFilter(l)} className={`px-2.5 py-1 rounded-full border ${LEVEL_STYLE[l].chip} ${filter === l ? 'ring-1 ring-epi' : ''}`}>
                  {LEVEL_STYLE[l].label.split(' ')[0]} {l} ({GROUPS.filter((x) => x.level === l).length})
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {list.map((x) =>
            <div key={x.id} className={`rounded-lg p-4 transition-colors ${LEVEL_STYLE[x.level].card} ${x.id === g.id ? 'ring-2 ring-epi' : ''}`}>
                <div className={`text-[11px] font-bold mb-1 ${LEVEL_STYLE[x.level].text}`}>{LEVEL_STYLE[x.level].label}</div>
                <h3 className="text-[15px] font-bold text-epi-text mb-2">{x.name}</h3>
                <div className="text-[12px] text-epi-muted space-y-1 mb-4">
                  <div>Main risks: <span className="font-medium text-epi-text">{x.risks}</span></div>
                  <div>Population: <span className="font-medium text-epi-text">{x.population.toLocaleString()}</span></div>
                  <div>Program coverage: <span className="font-medium text-epi-text">{x.coverage}</span></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-[14px] font-bold ${LEVEL_STYLE[x.level].text}`}>Score: {x.score}/100</div>
                  <button
                  onClick={() => {
                    setSelectedId(x.id);
                    if (window.innerWidth < 1024) document.getElementById('vuln-profile')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`h-8 px-4 text-[12px] font-bold rounded-md ${x.id === g.id ? 'bg-epi text-white' : 'bg-epi-bg border border-border text-epi-text hover:border-epi'}`}>
                    {x.id === g.id ? 'Viewing' : 'View Profile'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Detail */}
        <div id="vuln-profile" className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col lg:h-[800px] overflow-y-auto scroll-mt-4">
          <div className="mb-6">
            <h2 className="text-[20px] font-bold text-epi-text">Vulnerability Profile — {g.name}</h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
            <div className={`absolute top-0 right-0 text-[24px] font-bold ${LEVEL_STYLE[g.level].text}`}>{g.score}/100</div>
            <div className="w-full max-w-[400px] h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A1A2E', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Vulnerability" dataKey="A" stroke={color} fill={color} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[12px] text-epi-muted text-center mt-4">
              7-factor vulnerability radar chart (0-10 scale, higher = more vulnerable)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-epi-bg border border-border rounded-lg p-4">
              <h3 className="text-[14px] font-bold text-epi-text mb-3">Coverage Gaps for This Group:</h3>
              <ul className="space-y-2 text-[13px] text-epi-text">
                {g.gaps.map(([icon, text]) =>
                <li key={text} className="flex items-start gap-2">
                    <span className={icon === '❌' ? 'text-epi-red' : 'text-epi-amber'}>{icon}</span> {text}
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-epi-bg border border-border rounded-lg p-4">
              <h3 className="text-[14px] font-bold text-epi-text mb-3">Recommended interventions:</h3>
              <ol className="space-y-2 text-[13px] text-epi-text list-decimal list-inside">
                {g.recommended.map((r) => <li key={r}>{r}</li>)}
              </ol>
            </div>
          </div>

          <div className="bg-epi/10 border border-epi/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <div>
              <div className="text-[14px] font-bold text-epi-text mb-1">
                Estimated cost of full intervention:{' '}
                <span className="text-epi">RWF {g.cost.toLocaleString()} (~${Math.round(g.cost / 1100).toLocaleString()} USD)</span>
              </div>
              <div className="text-[13px] text-epi-muted">Expected impact: {g.impact}</div>
            </div>
            <button onClick={generate} className="h-10 px-6 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md shrink-0">
              Generate Vulnerability Report
            </button>
          </div>
        </div>
      </div>
    </AnalystLayout>);

}
