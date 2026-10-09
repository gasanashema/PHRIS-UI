import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Biohazard,
  MapPin,
  Plus,
  Activity,
  Microscope,
  ClipboardList } from
'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { Modal } from '../../components/shared/Modal';
import { SeverityBadge } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import { fmtDate, fmtTime, isOpenStatus, nowISO } from '../../lib/format';
const SURVEILLANCE = [
{
  disease: 'Malaria',
  cases: 450,
  vs: '+12%',
  trend: '↑ Rising',
  districts: '18 districts',
  risk: '● Orange',
  action: 'Investigate'
},
{
  disease: 'Cholera',
  cases: 87,
  vs: '+45%',
  trend: '↑ Sharp Rise',
  districts: '3 districts',
  risk: '● Red',
  action: 'Active Investigation →'
},
{
  disease: 'Measles',
  cases: 23,
  vs: '-5%',
  trend: '↓ Falling',
  districts: '4 districts',
  risk: '● Yellow',
  action: 'Monitor'
},
{
  disease: 'Typhoid',
  cases: 34,
  vs: '+8%',
  trend: '↑ Rising',
  districts: '6 districts',
  risk: '● Yellow',
  action: 'Monitor'
},
{
  disease: 'COVID-19',
  cases: 12,
  vs: '0%',
  trend: '→ Stable',
  districts: '2 districts',
  risk: '● Green',
  action: 'Routine'
},
{
  disease: 'Diarrheal Disease',
  cases: 178,
  vs: '+3%',
  trend: '→ Stable',
  districts: '22 districts',
  risk: '● Green',
  action: 'Routine'
},
{
  disease: 'Mpox',
  cases: 3,
  vs: '+200%',
  trend: '↑ Alert',
  districts: '1 district (Rubavu — DRC border)',
  risk: '● Orange',
  action: 'Investigate'
},
{
  disease: 'Meningitis',
  cases: 5,
  vs: '-20%',
  trend: '↓ Falling',
  districts: '2 districts',
  risk: '● Green',
  action: 'Routine'
},
{
  disease: 'Rift Valley Fever',
  cases: 0,
  vs: '0%',
  trend: '→ None',
  districts: '0 districts',
  risk: '● Green',
  action: 'Cross-border watch'
},
{
  disease: 'Viral Hemorrhagic Fever',
  cases: 0,
  vs: '0%',
  trend: '→ None',
  districts: '0 districts',
  risk: '● Green',
  action: 'DRC border watch'
},
{
  disease: 'Malnutrition',
  cases: 234,
  vs: '+1%',
  trend: '→ Stable',
  districts: '12 districts',
  risk: '● Yellow',
  action: 'Monitor'
},
{
  disease: 'Respiratory',
  cases: 89,
  vs: '-8%',
  trend: '↓ Falling',
  districts: '15 districts',
  risk: '● Green',
  action: 'Routine'
}];

export function EpiOverview() {
  const { state } = useApp();
  const navigate = useNavigate();
  const dialogs = useAlertDialogs();
  const [picker, setPicker] = useState(false);
  const open = sortAlerts(state.alerts.filter((a) => isOpenStatus(a.status)), 'severity');
  const red = open.filter((a) => a.severity === 'red');
  const watch = Array.from(new Set(open.filter((a) => a.severity !== 'yellow').map((a) => a.district)));
  const invOpen = state.investigations.filter((i) => i.status !== 'closed');
  const requested = invOpen.filter((i) => i.status === 'requested');
  const candidates = open.filter((a) => !a.investigationId);
  const level = red.length > 0 ? 'high' : open.some((a) => a.severity === 'orange') ? 'moderate' : 'low';
  const levelCls = level === 'high' ? 'text-epi-red' : level === 'moderate' ? 'text-epi-amber' : 'text-[#00A550]';

  return (
    <EpiLayout
      title="National Disease Overview"
      subtitle={`${fmtDate(nowISO())} | Rwanda — All Districts | Last updated: ${fmtTime(state.pipeline.lastRunAt)}`}
      breadcrumb="National Overview">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className={`rounded-lg p-4 flex flex-col justify-between border ${level === 'high' ? 'bg-epi-red/10 border-epi-red/30' : level === 'moderate' ? 'bg-epi-amber/10 border-epi-amber/30' : 'bg-[#00A550]/10 border-[#00A550]/30'}`}>
          <div className={`text-[13px] font-bold mb-2 ${levelCls}`}>National Risk Level</div>
          <div className={`text-[20px] font-bold mb-1 ${levelCls}`}>
            {level === 'high' ? '● HIGH RISK' : level === 'moderate' ? '● MODERATE RISK' : '● LOW RISK'}
          </div>
          <div className="text-[11px] text-epi-text font-medium">
            {red.length} red alert{red.length === 1 ? '' : 's'} — {red.length ? 'immediate attention required' : 'no outbreaks at red level'}
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Biohazard className="w-4 h-4 text-epi-red" /> Red-Level Outbreaks
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">{red.length}</div>
          <div className="text-[11px] text-epi-muted space-y-0.5 mb-2">
            {red.slice(0, 3).map((a) =>
            <Link key={a.id} to={`/warning/detail?id=${a.id}`} className="block font-medium text-epi-red hover:underline">
                {a.disease} — {a.district} ●
              </Link>
            )}
          </div>
          <Link to="/epi/investigations" className="text-[11px] font-bold text-epi hover:underline mt-auto">
            Open investigations →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <MapPin className="w-4 h-4 text-epi-amber" /> Districts Under Watch
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">{watch.length}</div>
          <div className="text-[11px] text-epi-muted mb-2">{watch.join(', ')}</div>
          <Link to="/epi/comparison" className="text-[11px] font-bold text-epi hover:underline mt-auto">
            View district comparison →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Activity className="w-4 h-4 text-epi-amber" /> New Cases This Week
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[24px] font-bold text-epi-text">1,240</span>
            <span className="text-[12px] font-bold text-epi-amber">↑ +8% vs last week</span>
          </div>
          <Link to="/epi/surveillance" className="text-[11px] font-bold text-epi hover:underline mt-auto">
            Open surveillance →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <Microscope className="w-4 h-4 text-epi" /> Open Alerts
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">{open.length}</div>
          <Link to="/warning/alerts" className="text-[11px] font-bold text-epi hover:underline mt-auto">
            Early Warning →
          </Link>
        </div>

        <div className="bg-white border border-border rounded-lg p-4 shadow-sm flex flex-col justify-between relative">
          {requested.length > 0 &&
          <div className="absolute top-4 right-4 bg-epi-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Action</div>
          }
          <div className="flex items-center gap-2 text-[13px] font-medium text-epi-muted mb-2">
            <ClipboardList className="w-4 h-4 text-epi" /> Open Investigations
          </div>
          <div className="text-[24px] font-bold text-epi-text mb-1">{invOpen.length}</div>
          <div className="text-[11px] text-epi-muted mt-auto">{requested.length} awaiting acceptance from districts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[65%_minmax(0,1fr)] gap-6">
        <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">Active Disease Monitoring — This Week</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
                <tr>
                  {['Disease', 'Cases This Week', 'vs Last Week', 'Trend', 'Districts Affected', 'Risk Level', 'Action'].map((h) =>
                  <th key={h} className="px-4 py-3">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SURVEILLANCE.map((row, i) => {
                  const isRed = row.risk.includes('Red');
                  const isOrange = row.risk.includes('Orange');
                  return (
                    <tr key={i} className={`hover:bg-epi-bg/30 ${isRed ? 'bg-epi-red/5' : isOrange ? 'bg-epi-amber/5' : ''}`}>
                      <td className="px-4 py-3 font-bold text-epi-text">{row.disease}</td>
                      <td className="px-4 py-3 font-medium text-epi-text">{row.cases}</td>
                      <td className="px-4 py-3 text-epi-muted">{row.vs}</td>
                      <td className={`px-4 py-3 font-medium ${row.trend.includes('↑') ? 'text-epi-amber' : row.trend.includes('↓') ? 'text-epi-accent' : 'text-epi-muted'}`}>{row.trend}</td>
                      <td className="px-4 py-3 text-epi-muted">{row.districts}</td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{row.risk}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/warning/history?q=${encodeURIComponent(row.disease)}`}
                          className={`font-bold text-[12px] hover:underline ${isRed ? 'text-epi-red' : isOrange ? 'text-epi-amber' : 'text-epi'}`}>

                          {row.action}
                        </Link>
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-border p-5 flex flex-col h-fit">
          <div className="mb-4">
            <h2 className="text-[16px] font-bold text-epi-text">Outbreak Investigations</h2>
            <p className="text-[13px] text-epi-muted">{invOpen.length} open investigations</p>
          </div>

          <div className="space-y-3 mb-4">
            {invOpen.slice(0, 4).map((inv) => {
              const tone = inv.status === 'requested' ? 'border-l-[#EAB308]' : inv.priority === 'Critical' ? 'border-l-epi-red' : 'border-l-epi-amber';
              const label = inv.status === 'requested' ? 'text-[#EAB308]' : inv.priority === 'Critical' ? 'text-epi-red' : 'text-epi-amber';
              return (
                <div key={inv.id} className={`border-l-4 ${tone} border border-border rounded-r-lg p-4 bg-white`}>
                  <div className={`text-[11px] font-bold mb-1 ${label}`}>
                    {inv.status === 'requested' ? '● REQUESTED BY DISTRICT' : inv.priority === 'Critical' ? '● ACTIVE OUTBREAK' : '● UNDER INVESTIGATION'}
                  </div>
                  <div className="text-[14px] font-bold text-epi-text mb-2">
                    {inv.disease} — {inv.sector ? `${inv.sector}, ` : ''}{inv.district}
                  </div>
                  <div className="text-[12px] text-epi-muted space-y-1 mb-3">
                    <div>Opened: {fmtDate(inv.openedAt)} | Cases: {inv.cases}</div>
                    <div>Lead: {inv.lead}</div>
                    <div className="font-medium text-epi-text">Latest: {inv.updates[inv.updates.length - 1]?.text}</div>
                  </div>
                  <Link
                    to={`/epi/investigations?id=${inv.id}`}
                    className="inline-flex h-8 px-4 bg-epi hover:bg-epi-dark text-white text-[12px] font-semibold rounded-md items-center justify-center">

                    {inv.status === 'requested' ? 'Review Request' : 'Open Investigation'}
                  </Link>
                </div>);

            })}
          </div>

          <button
            onClick={() => setPicker(true)}
            className="w-full h-10 border-2 border-epi text-epi hover:bg-epi/5 text-[13px] font-bold rounded-md flex items-center justify-center gap-2 mt-auto">

            <Plus className="w-4 h-4" /> New Investigation
          </button>
        </div>
      </div>

      <Modal open={picker} title="Open a new investigation" subtitle="Choose the alert that needs field investigation" onClose={() => setPicker(false)}>
        {candidates.length === 0 ?
        <div className="text-[13px] text-epi-muted">Every open alert already has an investigation.</div> :

        <ul className="divide-y divide-border">
            {candidates.map((a) =>
          <li key={a.id}>
                <button
              onClick={() => {
                setPicker(false);
                dialogs.open('investigate', a);
              }}
              className="w-full text-left py-3 flex items-center justify-between gap-3 hover:bg-epi-bg/50 px-2 rounded">

                  <span>
                    <span className="block text-[13px] font-bold text-epi-text">
                      {a.disease} — {a.sector ? `${a.sector}, ` : ''}{a.district}
                    </span>
                    <span className="block text-[12px] text-epi-muted">{a.id} · {a.probability}% probability</span>
                  </span>
                  <SeverityBadge severity={a.severity} />
                </button>
              </li>
          )}
          </ul>
        }
        <button onClick={() => navigate('/warning/alerts')} className="mt-4 text-[13px] font-bold text-epi hover:underline">
          Browse all alerts →
        </button>
      </Modal>
      {dialogs.element}
    </EpiLayout>);

}
