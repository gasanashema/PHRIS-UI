import { useMemo, useState } from 'react';
import {
  FileText,
  Activity,
  Hospital,
  Users,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle,
  Loader2 } from
'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { SimulatedTag } from '../../components/shared/Badges';
import { useApp, useCurrentUser } from '../../store/AppStore';
import type { AppState } from '../../store/AppStore';
import type { GeneratedReport, ReportSummary, Severity } from '../../types';
import {
  addDays,
  downloadFile,
  escapeHtml,
  fmtDate,
  isOpenStatus,
  nowISO,
  toCSV } from
'../../lib/format';

const REPORT_TYPES = [
{
  id: 'weekly',
  icon: FileText,
  emoji: '📋',
  title: 'Weekly Situation Report',
  desc: 'Complete weekly health status for submission to RBC'
},
{
  id: 'outbreak',
  icon: Activity,
  emoji: '🦠',
  title: 'Disease Outbreak Summary',
  desc: 'Focused report on active disease alerts and response'
},
{
  id: 'facility',
  icon: Hospital,
  emoji: '🏥',
  title: 'Facility Performance Report',
  desc: 'Reporting compliance and stock levels per facility'
},
{
  id: 'chw',
  icon: Users,
  emoji: '👥',
  title: 'CHW Activity Report',
  desc: 'Community health worker coverage and activity summary'
}];


const SECTIONS = [
'Executive Summary',
'Disease Trends',
'Alert Summary',
'Facility Data',
'CHW Activity',
'Interventions',
'Map'];

const DEFAULT_SECTIONS: Record<string, string[]> = {
  weekly: SECTIONS.slice(0, 6),
  outbreak: ['Executive Summary', 'Alert Summary', 'Interventions', 'Map'],
  facility: ['Executive Summary', 'Facility Data'],
  chw: ['Executive Summary', 'CHW Activity']
};

const TOP_DISEASES = [
{ name: 'Malaria', cases: 52 },
{ name: 'Cholera', cases: 38 },
{ name: 'Diarrheal Disease', cases: 31 },
{ name: 'Measles', cases: 14 },
{ name: 'Respiratory', cases: 10 }];


interface Params {
  district: string;
  from: string;
  to: string;
  severities: Severity[];
  disease: string;
}

function filterAlerts(state: AppState, p: Params) {
  return state.alerts.filter(
    (a) =>
    a.district === p.district &&
    a.triggeredAt.slice(0, 10) <= p.to && (
    // include alerts raised in the period, or still open during it
    a.triggeredAt.slice(0, 10) >= p.from || isOpenStatus(a.status) || (a.closedAt ?? '') >= p.from) &&
    p.severities.includes(a.severity) && (
    p.disease === 'All diseases' || a.disease === p.disease)
  );
}

function buildSummary(state: AppState, p: Params): ReportSummary {
  const alerts = filterAlerts(state, p);
  const ids = new Set(alerts.map((a) => a.id));
  const interventions = state.interventions.filter(
    (i) =>
    i.district === p.district && (
    i.alertId && ids.has(i.alertId) || i.date.slice(0, 10) >= p.from && i.date.slice(0, 10) <= p.to) && (
    p.disease === 'All diseases' || i.disease === p.disease)
  );
  const bySev: Record<Severity, number> = { red: 0, orange: 0, yellow: 0, green: 0 };
  alerts.forEach((a) => bySev[a.severity]++);
  const open = alerts.filter((a) => isOpenStatus(a.status));
  const investigations = state.investigations.filter(
    (i) => i.district === p.district && i.status !== 'closed'
  );
  const highlights: string[] = [];
  const unack = open.filter((a) => a.status === 'active');
  if (unack.length) highlights.push(`${unack.length} alert(s) still awaiting acknowledgement: ${unack.map((a) => a.id).join(', ')}.`);
  const esc = alerts.filter((a) => a.status === 'escalated');
  if (esc.length) highlights.push(`${esc.length} alert(s) escalated: ${esc.map((a) => `${a.id} → ${a.escalatedTo}`).join('; ')}.`);
  const resolved = alerts.filter((a) => a.status === 'resolved');
  if (resolved.length) highlights.push(`${resolved.length} alert(s) resolved during the period.`);
  const done = interventions.filter((i) => i.status === 'Completed');
  if (done.length) highlights.push(`Completed interventions: ${done.map((i) => i.action).join('; ')}.`);
  const overdue = interventions.filter((i) => i.status === 'Overdue');
  if (overdue.length) highlights.push(`${overdue.length} intervention(s) overdue — follow-up required.`);
  if (investigations.length) highlights.push(`${investigations.length} investigation(s) open: ${investigations.map((i) => `${i.id} (${i.disease}, ${i.status})`).join('; ')}.`);
  if (!highlights.length) highlights.push('No significant events in the selected period.');
  return {
    alertsTotal: alerts.length,
    alertsBySeverity: bySev,
    alertsOpen: open.length,
    alertsAcknowledged: alerts.filter((a) => a.acknowledgedAt).length,
    alertsResolved: resolved.length,
    interventionsTotal: interventions.length,
    interventionsCompleted: done.length,
    investigationsActive: investigations.length,
    topDiseases: TOP_DISEASES.filter((d) => p.disease === 'All diseases' || d.name === p.disease),
    highlights
  };
}

function exportReport(state: AppState, r: GeneratedReport) {
  const p: Params = {
    district: r.district,
    from: r.periodFrom,
    to: r.periodTo,
    severities: ['red', 'orange', 'yellow'],
    disease: 'All diseases'
  };
  const alerts = filterAlerts(state, p);
  const slug = r.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  if (r.format === 'Excel') {
    const csv = toCSV(
      alerts.map((a) => ({
        alert_id: a.id,
        disease: a.disease,
        sector: a.sector ?? '',
        severity: a.severity,
        status: a.status,
        triggered: a.triggeredAt,
        probability_pct: a.probability,
        cases: a.cases,
        acknowledged_by: a.acknowledgedBy ?? '',
        escalated_to: a.escalatedTo ?? ''
      }))
    );
    downloadFile(`${slug}.csv`, csv, 'text/csv');
    return;
  }
  const s = r.summary;
  const rows = alerts.
  map(
    (a) =>
    `<tr><td>${a.id}</td><td>${a.disease}</td><td>${a.sector ?? ''}</td><td>${a.severity.toUpperCase()}</td><td>${a.status}</td><td>${a.probability}%</td></tr>`
  ).
  join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(r.title)}</title>
<style>body{font-family:Inter,Arial,sans-serif;color:#1A1A2E;max-width:800px;margin:40px auto;padding:0 20px}h1{color:#104E49}table{border-collapse:collapse;width:100%}td,th{border:1px solid #E5E7EB;padding:6px 8px;font-size:13px;text-align:left}th{background:#F4F6F9}.muted{color:#6B7280;font-size:13px}</style></head>
<body><div class="muted">HUYE DISTRICT HEALTH OFFICE · ${r.language} · ${r.format}</div><h1>${escapeHtml(r.title)}</h1>
<p class="muted">Period: ${fmtDate(r.periodFrom + 'T00:00:00')} – ${fmtDate(r.periodTo + 'T00:00:00')} · Prepared by ${escapeHtml(r.author)} · Generated ${fmtDate(r.at)}</p>
${r.sections.includes('Executive Summary') ? `<h2>Executive Summary</h2><ul>${s.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}
${r.sections.includes('Alert Summary') ? `<h2>Alert Summary</h2><p>${s.alertsTotal} alerts (${s.alertsBySeverity.red} red, ${s.alertsBySeverity.orange} orange, ${s.alertsBySeverity.yellow} yellow). ${s.alertsOpen} open, ${s.alertsResolved} resolved.</p><table><tr><th>ID</th><th>Disease</th><th>Sector</th><th>Level</th><th>Status</th><th>Probability</th></tr>${rows}</table>` : ''}
${r.sections.includes('Disease Trends') ? `<h2>Disease Trends</h2><ul>${s.topDiseases.map((d) => `<li>${d.name}: ${d.cases} cases this week</li>`).join('')}</ul>` : ''}
${r.sections.includes('Interventions') ? `<h2>Interventions</h2><p>${s.interventionsTotal} interventions, ${s.interventionsCompleted} completed. ${s.investigationsActive} investigation(s) open.</p>` : ''}
<p class="muted">Generated by the AI Vital frontend prototype. Figures are demonstration data.</p></body></html>`;
  downloadFile(`${slug}.html`, html, 'text/html');
}

export function DhoReports() {
  const { state, actions } = useApp();
  const user = useCurrentUser('dho');
  const district = user.role === 'dho' ? user.district : 'Huye';
  const [selected, setSelected] = useState<string>('weekly');
  const [checked, setChecked] = useState<string[]>(DEFAULT_SECTIONS.weekly);
  const [lang, setLang] = useState('English');
  const [fmt, setFmt] = useState('PDF');
  const [from, setFrom] = useState(addDays(nowISO(), -7).slice(0, 10));
  const [to, setTo] = useState(nowISO().slice(0, 10));
  const [severities, setSeverities] = useState<Severity[]>(['red', 'orange', 'yellow']);
  const [disease, setDisease] = useState('All diseases');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedReport | null>(null);

  const toggle = (s: string) =>
  setChecked((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const toggleSev = (s: Severity) =>
  setSeverities((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const params: Params = { district, from, to, severities, disease };
  const preview = useMemo(() => buildSummary(state, params), [state, district, from, to, severities, disease]); // eslint-disable-line react-hooks/exhaustive-deps
  const type = REPORT_TYPES.find((r) => r.id === selected)!;
  const valid = from && to && from <= to && checked.length > 0 && severities.length > 0;
  const diseases = ['All diseases', ...Array.from(new Set(state.alerts.filter((a) => a.district === district).map((a) => a.disease)))];

  const generate = () => {
    if (!valid) return;
    setGenerating(true);
    setResult(null);
    window.setTimeout(() => {
      const report = actions.addReport({
        title: `${type.title} — ${district} District${disease !== 'All diseases' ? ` (${disease})` : ''}`,
        type: selected,
        format: fmt,
        language: lang,
        periodFrom: from,
        periodTo: to,
        district,
        sections: checked,
        status: 'Draft — not yet submitted',
        ok: false,
        summary: buildSummary(state, params)
      });
      setGenerating(false);
      setResult(report);
      actions.toast(`${type.title} generated. Review it below, then download or submit.`);
    }, 1200);
  };

  const reports = state.reports.filter((r) => r.district === district);

  return (
    <DhoLayout
      title={`Reports — ${district} District`}
      subtitle="Generate and export official district health reports"
      breadcrumb="Reports">

      <div className="grid grid-cols-1 xl:grid-cols-[55%_minmax(0,1fr)] gap-6">
        {/* Left — generator */}
        <div className="space-y-6 min-w-0">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-admin-text mb-1">
              Generate a Report
            </h2>
            <p className="text-[13px] text-admin-muted mb-4">
              Step 1 — Select report type
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TYPES.map((r) => {
                const active = selected === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelected(r.id);
                      setChecked(DEFAULT_SECTIONS[r.id]);
                      setResult(null);
                    }}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${active ? 'border-admin bg-admin/5' : 'border-border hover:border-admin/40'}`}>

                    <div className="text-[22px] mb-2">{r.emoji}</div>
                    <div className="text-[14px] font-bold text-admin-text mb-1">
                      {r.title}
                    </div>
                    <div className="text-[12px] text-admin-muted leading-snug">
                      {r.desc}
                    </div>
                  </button>);

              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-6 space-y-5">
            <h3 className="text-[15px] font-bold text-admin-text">
              Step 2 — Report Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                  Report period
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="flex-1 min-w-0 h-10 px-2 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />

                  <span className="text-admin-muted text-[13px]">to</span>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="flex-1 min-w-0 h-10 px-2 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />

                </div>
                {from > to &&
                <p className="text-[12px] text-admin-red mt-1">Start date must be before end date.</p>
                }
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">District</label>
                <select
                  value={district}
                  disabled
                  title="District Health Officers can report on their own district"
                  className="w-full h-10 px-3 border border-border rounded-md text-[13px] bg-admin-bg text-admin-muted">

                  <option>{district}</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Alert severity</label>
                <div className="flex gap-1.5">
                  {(['red', 'orange', 'yellow'] as Severity[]).map((s) =>
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSev(s)}
                    aria-pressed={severities.includes(s)}
                    className={`flex-1 h-9 rounded-md text-[12px] font-semibold capitalize transition-colors ${severities.includes(s) ? 'bg-admin text-white' : 'bg-admin-bg text-admin-muted border border-border'}`}>

                      {s === 'red' ? '🔴' : s === 'orange' ? '🟠' : '🟡'} {s}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Alert type / disease</label>
                <select
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">

                  {diseases.map((d) =>
                  <option key={d}>{d}</option>
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-2">
                Include sections
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SECTIONS.map((s) =>
                <label
                  key={s}
                  className="flex items-center gap-2 text-[13px] text-admin-text cursor-pointer">

                    <input
                    type="checkbox"
                    checked={checked.includes(s)}
                    onChange={() => toggle(s)}
                    className="w-4 h-4 rounded accent-admin" />

                    {s}
                  </label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                  Language
                </label>
                <div className="flex gap-1.5">
                  {['English', 'French', 'Kinyarwanda'].map((l) =>
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 h-9 rounded-md text-[11px] font-semibold transition-colors ${lang === l ? 'bg-admin text-white' : 'bg-admin-bg text-admin-muted border border-border'}`}>

                      {l}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                  Export format
                </label>
                <div className="flex gap-1.5">
                  {['PDF', 'Word', 'Excel'].map((f) =>
                  <button
                    key={f}
                    onClick={() => setFmt(f)}
                    className={`flex-1 h-9 rounded-md text-[12px] font-semibold transition-colors ${fmt === f ? 'bg-admin text-white' : 'bg-admin-bg text-admin-muted border border-border'}`}>

                      {f}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-admin-bg rounded-md p-3 text-[12px] text-admin-muted">
              Live preview of your selection: <strong className="text-admin-text">{preview.alertsTotal} alerts</strong> (
              {preview.alertsBySeverity.red} red, {preview.alertsBySeverity.orange} orange,{' '}
              {preview.alertsBySeverity.yellow} yellow), <strong className="text-admin-text">{preview.interventionsTotal} interventions</strong>.
            </div>

            <div className="pt-1">
              <button
                onClick={generate}
                disabled={!valid || generating}
                className="w-full h-11 bg-admin hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-md flex items-center justify-center gap-2">

                {generating && <Loader2 className="w-4 h-4 animate-spin" />}
                {generating ? 'Generating report…' : 'Generate Report'}
              </button>
              {!valid && !generating &&
              <p className="text-[12px] text-admin-muted mt-2 text-center">
                  Select a valid period, at least one severity and one section.
                </p>
              }
            </div>
          </div>

          {/* Generated report */}
          {result &&
          <div className="bg-white rounded-lg shadow-card border-2 border-admin p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-[10px] font-bold text-admin tracking-wider">
                    {district.toUpperCase()} DISTRICT HEALTH OFFICE · {result.language.toUpperCase()}
                  </div>
                  <h3 className="text-[17px] font-bold text-admin-text mt-1">{result.title}</h3>
                  <div className="text-[12px] text-admin-muted">
                    {fmtDate(result.periodFrom + 'T00:00:00')} – {fmtDate(result.periodTo + 'T00:00:00')} · {result.id} · {result.format}
                  </div>
                </div>
                <SimulatedTag>Generated in browser</SimulatedTag>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
              ['Alerts', result.summary.alertsTotal],
              ['Open', result.summary.alertsOpen],
              ['Interventions', result.summary.interventionsTotal],
              ['Investigations', result.summary.investigationsActive]].
              map(([k, v]) =>
              <div key={k as string} className="bg-admin-bg rounded-md p-3">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-admin-muted">{k}</div>
                    <div className="text-[22px] font-bold text-admin-text">{v}</div>
                  </div>
              )}
              </div>
              {result.sections.includes('Executive Summary') &&
            <div className="mb-4">
                  <div className="text-[13px] font-bold text-admin-text mb-2">Executive Summary</div>
                  <ul className="list-disc pl-5 space-y-1 text-[13px] text-admin-text">
                    {result.summary.highlights.map((h) =>
                <li key={h}>{h}</li>
                )}
                  </ul>
                </div>
            }
              {result.sections.includes('Disease Trends') && result.summary.topDiseases.length > 0 &&
            <div className="mb-4">
                  <div className="text-[13px] font-bold text-admin-text mb-2">Disease Trends</div>
                  <div className="flex flex-wrap gap-2">
                    {result.summary.topDiseases.map((d) =>
                <span key={d.name} className="px-2.5 py-1 bg-admin-bg rounded text-[12px]">
                        {d.name}: <strong>{d.cases}</strong>
                      </span>
                )}
                  </div>
                </div>
            }
              <div className="text-[12px] text-admin-muted mb-4">
                Sections: {result.sections.join(' · ')}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                onClick={() => {
                  exportReport(state, result);
                  actions.toast(
                    result.format === 'Excel' ?
                    'Exported alert data as CSV (opens in Excel).' :
                    `Exported as a printable HTML document — use your browser's “Save as PDF”. (${result.format} rendering is simulated.)`,
                    'info'
                  );
                }}
                className="h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md flex items-center gap-2">

                  <Download className="w-4 h-4" /> Download {result.format}
                </button>
                <button
                onClick={() => {
                  actions.updateReport(result.id, { status: 'Submitted to RBC', ok: true });
                  setResult({ ...result, status: 'Submitted to RBC', ok: true });
                  actions.toast('Report submitted to RBC (simulated).');
                }}
                disabled={result.ok}
                className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg disabled:opacity-50 flex items-center gap-2">

                  <Share2 className="w-4 h-4" /> {result.ok ? 'Submitted to RBC' : 'Submit to RBC'}
                </button>
              </div>
            </div>
          }
        </div>

        {/* Right — recent reports */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 h-fit">
          <h2 className="text-[16px] font-bold text-admin-text mb-4">
            Recently Generated Reports
          </h2>
          <div className="space-y-3">
            {reports.map((r) =>
            <div
              key={r.id}
              className={`border rounded-lg p-4 hover:bg-admin-bg/30 ${result?.id === r.id ? 'border-admin' : 'border-border'}`}>

                <div className="text-[14px] font-bold text-admin-text mb-1">
                  {r.title}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-admin-muted mb-2">
                  <span>{fmtDate(r.at)}</span>
                  <span className="text-border">·</span>
                  <span className="font-medium">{r.format}</span>
                  <span className="text-border">·</span>
                  <span>{r.author}</span>
                </div>
                <div
                className={`flex items-center gap-1.5 text-[12px] font-medium mb-3 ${r.ok ? 'text-admin-accent' : 'text-admin-amber'}`}>

                  {r.ok ?
                <CheckCircle className="w-3.5 h-3.5" /> :

                <AlertTriangle className="w-3.5 h-3.5" />
                }
                  {r.status}
                </div>
                <div className="flex items-center gap-3 text-[12px] font-bold">
                  <button
                  onClick={() => exportReport(state, r)}
                  className="text-admin hover:underline flex items-center gap-1">

                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <span className="text-border">·</span>
                  {r.ok ?
                <button
                  onClick={() => {
                    actions.updateReport(r.id, { status: 'Shared with District Mayor' });
                    actions.toast('Report shared with the District Mayor (simulated).');
                  }}
                  className="text-admin hover:underline flex items-center gap-1">

                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button> :

                <button
                  onClick={() => {
                    actions.updateReport(r.id, { status: 'Submitted to RBC', ok: true });
                    if (result?.id === r.id) setResult({ ...r, status: 'Submitted to RBC', ok: true });
                    actions.toast('Report submitted to RBC (simulated).');
                  }}
                  className="text-admin hover:underline">

                      Submit Now
                    </button>
                }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DhoLayout>);

}
