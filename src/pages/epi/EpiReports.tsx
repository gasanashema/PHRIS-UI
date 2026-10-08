import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, BarChart2, Globe } from 'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { Modal, btnPrimary, btnSecondary } from '../../components/shared/Modal';
import { SimulatedTag } from '../../components/shared/Badges';
import { useApp, AppState } from '../../store/AppStore';
import { downloadFile, fmtDate, isOpenStatus, nowISO, addDays } from '../../lib/format';
import type { GeneratedReport, ReportSummary, Severity } from '../../types';

type Kind = 'bulletin' | 'outbreak' | 'trend' | 'border';

const KIND_META: Record<Kind, {title: string;sections: string[];}> = {
  bulletin: { title: 'Weekly Epidemiological Bulletin', sections: ['Executive Summary', 'Alert Summary', 'Disease Trends', 'Interventions'] },
  outbreak: { title: 'Outbreak Investigation Report', sections: ['Executive Summary', 'Alert Summary', 'Interventions'] },
  trend: { title: 'Disease Trend Analysis', sections: ['Executive Summary', 'Disease Trends'] },
  border: { title: 'Cross-Border Health Report', sections: ['Executive Summary', 'Alert Summary'] }
};
const BORDER_DISTRICTS = ['Rusizi', 'Rubavu', 'Nyamasheke', 'Kirehe', 'Nyagatare', 'Burera', 'Gicumbi', 'Nyaruguru', 'Bugesera', 'Gisagara'];
const NATIONAL_DISEASES = [
{ name: 'Malaria', cases: 4218 },
{ name: 'Diarrheal disease', cases: 1342 },
{ name: 'Respiratory infection', cases: 987 },
{ name: 'Cholera', cases: 87 },
{ name: 'Measles', cases: 23 }];

const RECIPIENTS = 234;

function scopeAlerts(state: AppState, kind: Kind) {
  if (kind === 'border') return state.alerts.filter((a) => BORDER_DISTRICTS.includes(a.district));
  if (kind === 'outbreak') {
    const districts = new Set(state.investigations.filter((i) => i.status !== 'closed').map((i) => i.district));
    return state.alerts.filter((a) => districts.has(a.district));
  }
  return state.alerts;
}

function buildSummary(state: AppState, kind: Kind): ReportSummary {
  const alerts = scopeAlerts(state, kind);
  const bySev: Record<Severity, number> = { red: 0, orange: 0, yellow: 0, green: 0 };
  alerts.forEach((a) => bySev[a.severity]++);
  const open = alerts.filter((a) => isOpenStatus(a.status));
  const invs = state.investigations.filter((i) => i.status !== 'closed');
  const ints = state.interventions;
  const highlights: string[] = [];
  if (bySev.red) highlights.push(`${bySev.red} red alert(s): ${alerts.filter((a) => a.severity === 'red').map((a) => `${a.disease} — ${a.district}`).join('; ')}.`);
  const unack = open.filter((a) => a.status === 'active');
  if (unack.length) highlights.push(`${unack.length} alert(s) not yet acknowledged by district teams.`);
  const esc = alerts.filter((a) => a.status === 'escalated');
  if (esc.length) highlights.push(`${esc.length} alert(s) escalated to national level.`);
  if (kind !== 'trend' && invs.length) highlights.push(`${invs.length} investigation(s) open: ${invs.map((i) => `${i.id} (${i.disease}, ${i.district})`).join('; ')}.`);
  if (kind === 'trend') highlights.push('Malaria cases declining after the April–May peak; cholera trending upward in Western Province lakeshore districts.');
  if (kind === 'border') highlights.push(`Border districts monitored: ${BORDER_DISTRICTS.length}. Cross-border coordination active at Rusizi and Rubavu.`);
  if (!highlights.length) highlights.push('No significant events in this period.');
  return {
    alertsTotal: alerts.length,
    alertsBySeverity: bySev,
    alertsOpen: open.length,
    alertsAcknowledged: alerts.filter((a) => a.acknowledgedAt).length,
    alertsResolved: alerts.filter((a) => a.status === 'resolved').length,
    interventionsTotal: ints.length,
    interventionsCompleted: ints.filter((i) => i.status === 'Completed').length,
    investigationsActive: invs.length,
    topDiseases: NATIONAL_DISEASES,
    highlights
  };
}

function reportHtml(r: GeneratedReport) {
  const s = r.summary;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${r.title}</title>
<style>body{font-family:Inter,Arial,sans-serif;color:#1A1A2E;max-width:800px;margin:40px auto;padding:0 20px}h1{color:#104E49}.muted{color:#6B7280;font-size:13px}</style></head>
<body><div class="muted">RWANDA BIOMEDICAL CENTRE · EPIDEMIOLOGY DIVISION</div><h1>${r.title}</h1>
<p class="muted">Period: ${fmtDate(r.periodFrom + 'T00:00:00')} – ${fmtDate(r.periodTo + 'T00:00:00')} · Prepared by ${r.author} · Status: ${r.status}</p>
<h2>Executive Summary</h2><ul>${s.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
${r.sections.includes('Alert Summary') ? `<h2>Alert Summary</h2><p>${s.alertsTotal} alerts (${s.alertsBySeverity.red} red, ${s.alertsBySeverity.orange} orange, ${s.alertsBySeverity.yellow} yellow). ${s.alertsOpen} open, ${s.alertsResolved} resolved.</p>` : ''}
${r.sections.includes('Disease Trends') ? `<h2>Disease Trends</h2><ul>${s.topDiseases.map((d) => `<li>${d.name}: ${d.cases} cases this week</li>`).join('')}</ul>` : ''}
${r.sections.includes('Interventions') ? `<h2>Interventions</h2><p>${s.interventionsTotal} interventions, ${s.interventionsCompleted} completed. ${s.investigationsActive} investigation(s) open.</p>` : ''}
<p class="muted">Generated by the AI Vital frontend prototype. Figures are demonstration data.</p></body></html>`;
}

export function EpiReports() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<GeneratedReport | null>(null);
  const [bulletinId, setBulletinId] = useState<string | null>(null);

  const latest = (kind: Kind) => state.reports.find((r) => r.type === `epi-${kind}`);
  const generate = (kind: Kind, status = 'Draft — awaiting approval') => {
    const r = actions.addReport({
      title: `${KIND_META[kind].title} — ${fmtDate(nowISO())}`,
      type: `epi-${kind}`,
      format: 'HTML',
      language: 'English',
      periodFrom: addDays(nowISO(), -7).slice(0, 10),
      periodTo: nowISO().slice(0, 10),
      district: 'National',
      sections: KIND_META[kind].sections,
      status,
      ok: true,
      summary: buildSummary(state, kind)
    });
    actions.toast(`${KIND_META[kind].title} generated from current data.`);
    return r;
  };
  const view = (kind: Kind) => setPreview(latest(kind) ?? generate(kind));
  const download = (r: GeneratedReport) => {
    downloadFile(`${r.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.html`, reportHtml(r), 'text/html');
  };

  const bulletin = state.reports.find((r) => r.id === bulletinId) ?? latest('bulletin');
  const bulletinSent = !!bulletin && bulletin.status.startsWith('Sent');
  const ensureBulletin = () => {
    if (bulletin && !bulletinSent) return bulletin;
    const r = generate('bulletin');
    setBulletinId(r.id);
    return r;
  };
  const approveBulletin = () => {
    const r = ensureBulletin();
    actions.updateReport(r.id, { status: `Sent to ${RECIPIENTS} recipients` });
    actions.sendNotification(
      {
        title: 'Weekly Epidemiological Bulletin published',
        body: `${r.title} approved and distributed to ${RECIPIENTS} recipients (simulated).`,
        severity: 'info',
        roles: ['dho', 'analyst', 'admin']
      },
      { module: 'Epidemiology', action: 'Approved and sent weekly bulletin' }
    );
    actions.toast(`Bulletin sent to ${RECIPIENTS} recipients (simulated delivery).`);
    setPreview(null);
  };

  const cards: {kind: Kind;icon: typeof FileText;tone: string;desc: string;freq: string;secondary: [string, () => void];primary: [string, () => void];}[] = [
  { kind: 'bulletin', icon: FileText, tone: 'bg-epi/10 text-epi', desc: 'Automated weekly summary of all diseases, alerts, outbreaks, and district performance.', freq: 'Every Monday 7:00 AM', secondary: ['View Latest', () => view('bulletin')], primary: ['Generate Now', () => setBulletinId(generate('bulletin').id)] },
  { kind: 'outbreak', icon: Activity, tone: 'bg-epi-red/10 text-epi-red', desc: 'Full investigation findings per confirmed outbreak — for MOH, WHO, and partners.', freq: `${state.investigations.filter((i) => i.status !== 'closed').length} open investigations`, secondary: ['View Investigations', () => navigate('/epi/investigations')], primary: ['Create New', () => setPreview(generate('outbreak'))] },
  { kind: 'trend', icon: BarChart2, tone: 'bg-epi-amber/10 text-epi-amber', desc: 'Monthly national disease trend analysis for policy and planning.', freq: 'Monthly (1st of month)', secondary: ['View Latest', () => view('trend')], primary: ['Generate Now', () => setPreview(generate('trend'))] },
  { kind: 'border', icon: Globe, tone: 'bg-epi-info/10 text-epi-info', desc: 'Disease situation near DRC, Uganda, Burundi, and Tanzania borders — for national security and WHO reporting.', freq: 'Weekly', secondary: ['View Latest', () => view('border')], primary: ['Generate Now', () => setPreview(generate('border'))] }];


  return (
    <EpiLayout
      title="Epidemiological Reports"
      subtitle="Official AI Vital epidemiological documentation"
      breadcrumb="Epi Reports">

      <div className="bg-epi text-white rounded-lg p-6 mb-8 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <h2 className="text-[20px] font-bold mb-2">
            📋 Weekly Epidemiological Bulletin — Week 23, 2026
          </h2>
          <p className="text-[14px] text-white/80 mb-4">
            {bulletinSent ?
            `✅ ${bulletin!.status} · ${fmtDate(bulletin!.at)}` :
            'Auto-generated from live data | Ready for review and distribution'}
            <br />
            {RECIPIENTS} recipients | Last manual bulletin took 2.5 days — this was
            generated in 14 minutes
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setPreview(ensureBulletin())} className="h-10 px-5 bg-white text-epi text-[14px] font-bold rounded-md hover:bg-white/90">
              Review Bulletin
            </button>
            <button onClick={approveBulletin} disabled={bulletinSent} className="h-10 px-5 bg-epi-accent text-white text-[14px] font-bold rounded-md hover:bg-epi-accent/90 disabled:opacity-60">
              {bulletinSent ? 'Sent ✓' : 'Approve & Send'}
            </button>
            <button onClick={() => download(ensureBulletin())} className="h-10 px-5 border border-white/30 hover:bg-white/10 text-white text-[14px] font-bold rounded-md">
              Download (printable HTML)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c) => {
          const last = latest(c.kind);
          const Icon = c.icon;
          return (
            <div key={c.kind} className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-epi-text">{KIND_META[c.kind].title}</h3>
              </div>
              <p className="text-[13px] text-epi-muted mb-4">{c.desc}</p>
              <div className="text-[12px] text-epi-muted space-y-1 mb-6">
                <div>
                  {c.kind === 'outbreak' ? 'Active: ' : 'Frequency: '}
                  <span className="font-medium text-epi-text">{c.freq}</span>
                </div>
                <div>
                  Last generated:{' '}
                  <span className="font-medium text-epi-text">{last ? fmtDate(last.at) : 'June 1, 2026'}</span>
                </div>
                <div>
                  Status:{' '}
                  <span className="font-medium text-epi-accent">{last ? last.status : '✅ Sent to MOH and partners'}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <button onClick={c.secondary[1]} className="flex-1 h-9 bg-epi-bg border border-border hover:border-epi text-epi-text text-[13px] font-bold rounded-md">
                  {c.secondary[0]}
                </button>
                <button onClick={c.primary[1]} className="flex-1 h-9 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
                  {c.primary[0]}
                </button>
              </div>
            </div>);

        })}
      </div>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title ?? ''}
        subtitle={preview ? `${preview.id} · ${preview.status} · prepared by ${preview.author}` : ''}
        width="max-w-2xl"
        footer={
        preview &&
        <>
              <button className={btnSecondary} onClick={() => download(preview)}>Download</button>
              {preview.type === 'epi-bulletin' && !preview.status.startsWith('Sent') ?
          <button className={btnPrimary} onClick={approveBulletin}>Approve & Send</button> :

          <button className={btnPrimary} onClick={() => setPreview(null)}>Close</button>
          }
            </>
        }>

        {preview &&
        <div className="space-y-4 text-[13px] text-epi-text">
            <SimulatedTag />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
            ['Alerts', preview.summary.alertsTotal],
            ['Open', preview.summary.alertsOpen],
            ['Red', preview.summary.alertsBySeverity.red],
            ['Investigations', preview.summary.investigationsActive]].
            map(([k, v]) =>
            <div key={k} className="bg-epi-bg rounded-md p-3">
                  <div className="text-[11px] text-epi-muted">{k}</div>
                  <div className="text-[18px] font-bold">{v}</div>
                </div>
            )}
            </div>
            <div>
              <div className="font-bold mb-1">Executive summary</div>
              <ul className="list-disc pl-5 space-y-1">
                {preview.summary.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
            {preview.sections.includes('Disease Trends') &&
          <div>
                <div className="font-bold mb-1">Top diseases this week</div>
                <ul className="list-disc pl-5">
                  {preview.summary.topDiseases.map((d) => <li key={d.name}>{d.name}: {d.cases.toLocaleString()} cases</li>)}
                </ul>
              </div>
          }
          </div>
        }
      </Modal>
    </EpiLayout>);

}
