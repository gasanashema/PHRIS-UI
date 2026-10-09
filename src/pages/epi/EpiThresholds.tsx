import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { useApp, useCurrentUser } from '../../store/AppStore';
const THRESHOLDS = [
{
  disease: 'Cholera',
  range: '0–10/week',
  val: 87,
  thres: 'Epidemic threshold (30)',
  over: '+190% over',
  status: '● Epidemic',
  sent: 'Sent June 1',
  action: 'Active Investigation'
},
{
  disease: 'Malaria',
  range: '0–200/week',
  val: 450,
  thres: 'Alert threshold (300)',
  over: '+50% over',
  status: '● Alert',
  sent: 'Sent June 3',
  action: 'Monitoring'
},
{
  disease: 'Mpox',
  range: '0–1/week',
  val: 3,
  thres: 'Watch threshold (2)',
  over: '+50% over',
  status: '● Alert',
  sent: 'Sent June 5',
  action: 'Signal under review'
},
{
  disease: 'Measles',
  range: '0–5/week',
  val: 23,
  thres: 'Watch threshold (15)',
  over: '+53% over',
  status: '● Watch',
  sent: 'Sent June 2',
  action: 'Monitoring'
},
{
  disease: 'Typhoid',
  range: '0–20/week',
  val: 34,
  thres: 'Watch threshold (30)',
  over: '+13% over',
  status: '● Watch',
  sent: 'Sent June 4',
  action: 'Monitoring'
},
{
  disease: 'Meningitis',
  range: '0–3/week',
  val: 5,
  thres: 'Watch threshold (5)',
  over: 'At threshold',
  status: '● Watch',
  sent: 'Borderline',
  action: 'Monitor closely'
},
{
  disease: 'Diarrheal Disease',
  range: '0–150/week',
  val: 178,
  thres: 'Alert threshold (200)',
  over: 'Below threshold',
  status: '● Normal',
  sent: '—',
  action: 'Routine'
},
{
  disease: 'COVID-19',
  range: '0–50/week',
  val: 12,
  thres: 'Well below',
  over: 'Below threshold',
  status: '● Normal',
  sent: '—',
  action: 'Routine'
}];

export function EpiThresholds() {
  const { actions } = useApp();
  const user = useCurrentUser('epi');
  const [requested, setRequested] = useState(false);
  const requestReview = () => {
    actions.sendNotification(
      {
        title: 'Threshold review requested',
        body: `${user.name} requested a review of epidemic thresholds (Cholera, Malaria) from the Threshold Monitoring screen.`,
        severity: 'info',
        roles: ['admin'],
        link: '/admin/config'
      },
      { module: 'Epidemiology', action: 'Requested threshold review' }
    );
    setRequested(true);
    actions.toast('Review request sent to system administrators.');
  };
  return (
    <EpiLayout
      title="Epidemic Threshold Monitoring"
      subtitle="Rwanda national disease thresholds — WHO and RBC standards"
      breadcrumb="Epidemic Thresholds">
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-epi-red/10 px-4 py-2 rounded-full border border-epi-red/20 text-[13px] font-bold text-epi-red shadow-sm">
          ● 1 Epidemic threshold crossed
        </div>
        <div className="bg-epi-amber/10 px-4 py-2 rounded-full border border-epi-amber/20 text-[13px] font-bold text-epi-amber shadow-sm">
          ● 2 Alert thresholds crossed
        </div>
        <div className="bg-[#FEF08A]/40 px-4 py-2 rounded-full border border-[#FDE047] text-[13px] font-bold text-[#A16207] shadow-sm">
          ● 3 Watch thresholds crossed
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-epi-accent shadow-sm">
          ● 6 Diseases within normal range
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Disease</th>
                <th className="px-4 py-3">Normal Range</th>
                <th className="px-4 py-3">This Week</th>
                <th className="px-4 py-3">vs Threshold</th>
                <th className="px-4 py-3">% Over Threshold</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Alert Sent</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {THRESHOLDS.map((row, i) => {
                const isRed = row.status.includes('Epidemic');
                const isOrange = row.status.includes('Alert');
                const isYellow = row.status.includes('Watch');
                return (
                  <tr
                    key={i}
                    className={`hover:bg-epi-bg/30 ${isRed ? 'bg-epi-red/5' : isOrange ? 'bg-epi-amber/5' : isYellow ? 'bg-[#FEF08A]/10' : ''}`}>
                    
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.disease}
                    </td>
                    <td className="px-4 py-3 text-epi-muted">{row.range}</td>
                    <td className="px-4 py-3 font-bold text-epi-text">
                      {row.val}
                    </td>
                    <td className="px-4 py-3 text-epi-muted">{row.thres}</td>
                    <td
                      className={`px-4 py-3 font-medium ${isRed || isOrange || isYellow ? 'text-epi-red' : 'text-epi-muted'}`}>
                      
                      {row.over}
                    </td>
                    <td className="px-4 py-3 font-bold">{row.status}</td>
                    <td className="px-4 py-3 text-epi-muted">{row.sent}</td>
                    <td className="px-4 py-3 font-medium text-epi-text">
                      {row.action}
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[12px] text-epi-muted mb-8 flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
        <span>
          Thresholds set by RBC Epidemiology Division in accordance with WHO
          AFRO and IHR 2005 standards. Last reviewed: March 2026.
        </span>
        {user.role === 'admin' ?
        <Link to="/admin/config" className="text-epi font-bold hover:underline whitespace-nowrap">
            Configure Thresholds →
          </Link> :

        <button onClick={requestReview} disabled={requested} className="text-epi font-bold hover:underline disabled:opacity-60 disabled:no-underline whitespace-nowrap inline-flex items-center gap-1">
            {requested ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Review requested from Admin</span>
              </>
            ) : (
              'Request threshold review (Admin only)'
            )}
          </button>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-card border border-border p-4">
          <h4 className="text-[13px] font-bold text-epi-text mb-2">
            Cholera Trend (8 weeks)
          </h4>
          <div className="h-20 flex items-end gap-1 relative pt-4">
            <div className="absolute top-4 left-0 right-0 border-t border-dashed border-epi-red" />
            {[2, 3, 1, 2, 4, 9, 21, 87].map((v, i) =>
            <div
              key={i}
              className="flex-1 bg-epi-red/80 rounded-t-sm"
              style={{
                height: `${v / 87 * 100}%`
              }} />

            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card border border-border p-4">
          <h4 className="text-[13px] font-bold text-epi-text mb-2">
            Malaria Trend (8 weeks)
          </h4>
          <div className="h-20 flex items-end gap-1 relative pt-4">
            <div className="absolute top-8 left-0 right-0 border-t border-dashed border-epi-amber" />
            {[180, 210, 240, 280, 310, 350, 410, 450].map((v, i) =>
            <div
              key={i}
              className="flex-1 bg-epi-amber/80 rounded-t-sm"
              style={{
                height: `${v / 450 * 100}%`
              }} />

            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card border border-border p-4">
          <h4 className="text-[13px] font-bold text-epi-text mb-2">
            Mpox Trend (8 weeks)
          </h4>
          <div className="h-20 flex items-end gap-1 relative pt-4">
            <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-epi-amber" />
            {[0, 0, 0, 0, 1, 0, 2, 3].map((v, i) =>
            <div
              key={i}
              className="flex-1 bg-epi-amber/80 rounded-t-sm"
              style={{
                height: `${v / 4 * 100}%`
              }} />

            )}
          </div>
        </div>
      </div>
    </EpiLayout>);

}