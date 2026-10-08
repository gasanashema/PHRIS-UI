import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import { useApp } from '../../store/AppStore';

interface Row {
  district: string;
  province: string;
  completeness: number;
  accuracy: number;
  consistency: number;
  trend: 'up' | 'down' | 'stable';
  notified: string;
  group: 'Top Performers' | 'Mid Performers' | 'Poor Performers';
  issues: string[];
}

const ROWS: Row[] = [
{ district: 'Gasabo', province: 'Kigali', completeness: 97, accuracy: 95, consistency: 98, trend: 'stable', notified: '—', group: 'Top Performers', issues: ['2 facilities reported late'] },
{ district: 'Musanze', province: 'Northern', completeness: 95, accuracy: 94, consistency: 96, trend: 'up', notified: '—', group: 'Top Performers', issues: ['Minor date-format corrections'] },
{ district: 'Kicukiro', province: 'Kigali', completeness: 94, accuracy: 93, consistency: 95, trend: 'stable', notified: '—', group: 'Top Performers', issues: ['EMR/DHIS2 mismatch on 14 records'] },
{ district: 'Huye', province: 'Southern', completeness: 89, accuracy: 91, consistency: 87, trend: 'up', notified: '—', group: 'Mid Performers', issues: ['3 facilities not yet reported today', 'Facility code RW-HY-099 unmapped'] },
{ district: 'Rusizi', province: 'Western', completeness: 72, accuracy: 78, consistency: 70, trend: 'down', notified: '✅ Sent', group: 'Mid Performers', issues: ['Outbreak surge overwhelming data entry', 'Missing age on 36 cholera cases'] },
{ district: 'Nyamagabe', province: 'Southern', completeness: 61, accuracy: 65, consistency: 58, trend: 'down', notified: '✅ Sent June 3', group: 'Poor Performers', issues: ['CHW batch rejected — 3 unmapped Kinyarwanda terms', '47 records excluded today'] },
{ district: 'Ngororero', province: 'Western', completeness: 58, accuracy: 62, consistency: 54, trend: 'down', notified: '✅ Sent June 4', group: 'Poor Performers', issues: ['2 health posts offline for 5 days', 'Duplicate lab records'] }];


const overall = (r: Row) => Math.round((r.completeness + r.accuracy + r.consistency) / 3);
const tone = (s: number) => s >= 80 ? ['🟢', 'text-[#00A550]'] : s >= 60 ? ['🟠', 'text-[#F97316]'] : ['🔴', 'text-epi-red'];

export function ProcessingQuality() {
  const { actions } = useApp();
  const [open, setOpen] = useState<string | null>(null);
  const [notified, setNotified] = useState<Record<string, string>>({});

  const flag = (r: Row, escalate: boolean) => {
    actions.sendNotification(
      escalate ?
      {
        title: `Data quality escalation — ${r.district}`,
        body: `${r.district} data quality is ${overall(r)}% and falling. ${r.issues[0]}. National support requested.`,
        severity: 'orange',
        link: '/processing/quality',
        roles: ['admin', 'epi', 'integration']
      } :
      {
        title: `Data quality flag — ${r.district}`,
        body: `Your district's data quality score is ${overall(r)}%. Top issue: ${r.issues[0]}.`,
        severity: 'yellow',
        link: r.district === 'Huye' ? '/dho/facilities' : undefined,
        roles: ['dho'],
        district: r.district
      },
      { module: 'Processing', action: `${escalate ? 'Escalated' : 'Flagged'} data quality — ${r.district}` }
    );
    setNotified({ ...notified, [r.district]: escalate ? '⬆️ Escalated today' : '🚩 Flagged today' });
    actions.toast(escalate ? `${r.district} escalated to the national data team.` : `${r.district} DHO notified about data quality.`, 'warning');
  };

  const groups = ['Top Performers', 'Mid Performers', 'Poor Performers'] as const;

  return (
    <ProcessingLayout
      title="Data Quality Scores"
      subtitle="District-level data reliability scoring — updated after each processing run"
      breadcrumb="Data Quality Scores">

      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit max-w-full">
        <span className="text-[#00A550]">🟢 19 Districts: Good (≥80%)</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 7 Districts: Fair (60–79%)</span>
        <span className="text-border">|</span>
        <span className="text-[#F97316]">🟠 3 Districts: Poor (40–59%)</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 1 District: Critical (&lt;40%)</span>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                {['District', 'Province', 'Completeness', 'Accuracy', 'Consistency', 'Overall Score', 'Trend', 'DHO Notified', 'Actions'].map((h, i) =>
                <th key={h} className={`p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider ${i >= 2 && i <= 5 || i === 8 ? 'text-right' : i === 6 ? 'text-center' : ''}`}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groups.map((g) =>
              <Fragment key={g}>
                  <tr className="bg-epi-bg/50">
                    <td colSpan={9} className="p-2 text-[11px] font-bold text-epi-muted uppercase tracking-wider pl-4">{g}</td>
                  </tr>
                  {ROWS.filter((r) => r.group === g).map((r) => {
                  const s = overall(r);
                  const [emoji, cls] = tone(s);
                  return (
                    <Fragment key={r.district}>
                        <tr className={g === 'Poor Performers' ? 'bg-epi-red/5 hover:bg-epi-red/10' : 'hover:bg-epi-bg/50'}>
                          <td className="p-4 text-[14px] font-bold text-epi-text">{r.district}</td>
                          <td className="p-4 text-[13px] text-epi-text">{r.province}</td>
                          <td className="p-4 text-[13px] text-epi-text text-right">{r.completeness}%</td>
                          <td className="p-4 text-[13px] text-epi-text text-right">{r.accuracy}%</td>
                          <td className="p-4 text-[13px] text-epi-text text-right">{r.consistency}%</td>
                          <td className={`p-4 text-[14px] font-bold text-right ${cls}`}>{emoji} {s}%</td>
                          <td className={`p-4 text-[14px] font-bold text-center ${r.trend === 'up' ? 'text-[#00A550]' : r.trend === 'down' ? 'text-epi-red' : 'text-epi-muted'}`}>
                            {r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→ Stable'}
                          </td>
                          <td className="p-4 text-[13px] font-bold text-epi-text whitespace-nowrap">{notified[r.district] ?? r.notified}</td>
                          <td className="p-4 text-[13px] text-epi font-medium text-right whitespace-nowrap">
                            <button onClick={() => setOpen(open === r.district ? null : r.district)} className="hover:underline">
                              {open === r.district ? 'Hide' : 'View'}
                            </button>
                            {g === 'Mid Performers' && s < 80 &&
                          <>
                                {' · '}
                                <button onClick={() => flag(r, false)} disabled={!!notified[r.district]} className="hover:underline disabled:opacity-40">Flag</button>
                              </>
                          }
                            {g === 'Poor Performers' &&
                          <>
                                {' · '}
                                <button onClick={() => flag(r, true)} disabled={!!notified[r.district]} className="hover:underline disabled:opacity-40">Escalate</button>
                              </>
                          }
                          </td>
                        </tr>
                        {open === r.district &&
                      <tr className="bg-epi-bg/60">
                            <td colSpan={9} className="px-6 py-4 text-[13px]">
                              <div className="font-bold text-epi-text mb-1">Why {r.district} scores {s}%</div>
                              <ul className="list-disc pl-5 text-epi-muted mb-2">
                                {r.issues.map((i) => <li key={i}>{i}</li>)}
                              </ul>
                              <div className="flex flex-wrap gap-4">
                                <Link to="/processing/cleaning" className="text-epi font-bold hover:underline">Open cleaning review →</Link>
                                <Link to="/integration/validation" className="text-epi font-bold hover:underline">Validation issues →</Link>
                              </div>
                            </td>
                          </tr>
                      }
                      </Fragment>);

                })}
                </Fragment>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border p-6">
        <h2 className="text-[16px] font-bold text-epi-text mb-6">How Quality Scores Are Calculated</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
          ['Completeness (33%)', '% of expected fields that have values. Missing age, date, or disease name all reduce this score.'],
          ['Accuracy (33%)', '% of values that pass validation rules. Impossible values, wrong formats, failed cross-checks reduce score.'],
          ['Consistency (33%)', '% of records that are consistent across sources. A case reported in DHIS2 but not in EMR reduces score.']].
          map(([t, d]) =>
          <div key={t}>
              <h3 className="text-[14px] font-bold text-epi-text mb-2">{t}</h3>
              <p className="text-[13px] text-epi-muted leading-relaxed">{d}</p>
            </div>
          )}
        </div>
      </div>
    </ProcessingLayout>);

}
