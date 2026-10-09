import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Bell,
  Activity,
  ClipboardList,
  TrendingUp,
  Plus } from
'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { Modal } from '../../components/shared/Modal';
import { SeverityBadge } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import { fmtDate, fmtTime, isOpenStatus, nowISO } from '../../lib/format';
import type { Severity } from '../../types';

interface SurveillanceItem {
  disease: string;
  cases: number;
  vs: string;
  trend: string;
  districts: string;
  risk: Severity;
  action: string;
}

const SURVEILLANCE: SurveillanceItem[] = [
{
  disease: 'Malaria',
  cases: 450,
  vs: '+12%',
  trend: '↑ Rising',
  districts: '18 districts',
  risk: 'orange',
  action: 'Investigate'
},
{
  disease: 'Cholera',
  cases: 87,
  vs: '+45%',
  trend: '↑ Sharp Rise',
  districts: '3 districts',
  risk: 'red',
  action: 'Active Investigation →'
},
{
  disease: 'Measles',
  cases: 23,
  vs: '-5%',
  trend: '↓ Falling',
  districts: '4 districts',
  risk: 'yellow',
  action: 'Monitor'
},
{
  disease: 'Typhoid',
  cases: 34,
  vs: '+8%',
  trend: '↑ Rising',
  districts: '6 districts',
  risk: 'yellow',
  action: 'Monitor'
},
{
  disease: 'COVID-19',
  cases: 12,
  vs: '0%',
  trend: '→ Stable',
  districts: '2 districts',
  risk: 'green',
  action: 'Routine'
},
{
  disease: 'Diarrheal Disease',
  cases: 178,
  vs: '+3%',
  trend: '→ Stable',
  districts: '22 districts',
  risk: 'green',
  action: 'Routine'
},
{
  disease: 'Mpox',
  cases: 3,
  vs: '+200%',
  trend: '↑ Alert',
  districts: '1 district (Rubavu)',
  risk: 'orange',
  action: 'Investigate'
},
{
  disease: 'Meningitis',
  cases: 5,
  vs: '-20%',
  trend: '↓ Falling',
  districts: '2 districts',
  risk: 'green',
  action: 'Routine'
},
{
  disease: 'Rift Valley Fever',
  cases: 0,
  vs: '0%',
  trend: '→ None',
  districts: '0 districts',
  risk: 'green',
  action: 'Cross-border watch'
},
{
  disease: 'Viral Hemorrhagic Fever',
  cases: 0,
  vs: '0%',
  trend: '→ None',
  districts: '0 districts',
  risk: 'green',
  action: 'DRC border watch'
},
{
  disease: 'Malnutrition',
  cases: 234,
  vs: '+1%',
  trend: '→ Stable',
  districts: '12 districts',
  risk: 'yellow',
  action: 'Monitor'
},
{
  disease: 'Respiratory',
  cases: 89,
  vs: '-8%',
  trend: '↓ Falling',
  districts: '15 districts',
  risk: 'green',
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

  return (
    <EpiLayout
      title="National Disease Overview"
      subtitle={`${fmtDate(nowISO())} | Rwanda — All Districts | Last updated: ${fmtTime(state.pipeline.lastRunAt)}`}
      breadcrumb="National Overview">

      {/* Row 1: Top 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/warning/alerts"
          className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-epi-muted font-medium">National Threat Level</span>
              <ShieldAlert className={`w-5 h-5 ${level === 'high' ? 'text-epi-red' : level === 'moderate' ? 'text-[#F97316]' : 'text-[#00A550]'}`} />
            </div>
            <div className="text-[24px] font-bold text-epi-text leading-none mb-2 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${level === 'high' ? 'bg-epi-red' : level === 'moderate' ? 'bg-[#F97316]' : 'bg-[#00A550]'}`} />
              <span>{level === 'high' ? 'High Risk' : level === 'moderate' ? 'Moderate Risk' : 'Low Risk'}</span>
            </div>
          </div>
          <div className="text-[12px] font-medium pt-1 text-epi-muted">
            {red.length > 0 ? (
              <span className="text-epi-red font-semibold">{red.length} critical alert{red.length > 1 ? 's' : ''} active</span>
            ) : (
              <span className="text-[#00A550] font-semibold">All indicators within baseline</span>
            )}
          </div>
        </Link>

        <Link
          to="/warning/alerts"
          className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-epi-muted font-medium">Active Alerts</span>
              <Bell className="w-5 h-5 text-epi-red" />
            </div>
            <div className="text-[28px] font-bold text-epi-text leading-none mb-2">{open.length}</div>
          </div>
          <div className="text-[12px] font-medium pt-1 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-epi-text font-semibold" title="Critical alerts">
              <span className="w-2 h-2 rounded-full bg-epi-red shrink-0" />
              {red.length}
            </span>
            <span className="inline-flex items-center gap-1.5 text-epi-text font-semibold" title="High alerts">
              <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0" />
              {open.filter((a) => a.severity === 'orange').length}
            </span>
            <span className="inline-flex items-center gap-1.5 text-epi-text font-semibold" title="Watch alerts">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
              {open.filter((a) => a.severity === 'yellow').length}
            </span>
          </div>
        </Link>

        <Link
          to="/epi/investigations"
          className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-epi-muted font-medium">Active Investigations</span>
              <ClipboardList className="w-5 h-5 text-epi" />
            </div>
            <div className="text-[28px] font-bold text-epi-text leading-none mb-2">{invOpen.length}</div>
          </div>
          <div className="text-[12px] font-medium pt-1">
            {requested.length > 0 ? (
              <span className="text-epi-red font-semibold">{requested.length} awaiting district review</span>
            ) : (
              <span className="text-epi-muted">Active in {watch.length || 1} districts</span>
            )}
          </div>
        </Link>

        <Link
          to="/epi/surveillance"
          className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-epi-muted font-medium">New Cases This Week</span>
              <Activity className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="text-[28px] font-bold text-epi-text leading-none mb-2">1,240</div>
          </div>
          <div className="text-[12px] font-medium pt-1 flex items-center gap-1 text-[#F97316] font-semibold">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" /> +8% vs previous week
          </div>
        </Link>
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
                  const isRed = row.risk === 'red';
                  const isOrange = row.risk === 'orange';
                  return (
                    <tr key={i} className={`hover:bg-epi-bg/30 ${isRed ? 'bg-epi-red/5' : isOrange ? 'bg-epi-amber/5' : ''}`}>
                      <td className="px-4 py-3 font-bold text-epi-text">{row.disease}</td>
                      <td className="px-4 py-3 font-medium text-epi-text">{row.cases}</td>
                      <td className="px-4 py-3 text-epi-muted">{row.vs}</td>
                      <td className={`px-4 py-3 font-medium ${row.trend.includes('↑') ? 'text-epi-amber' : row.trend.includes('↓') ? 'text-epi-accent' : 'text-epi-muted'}`}>{row.trend}</td>
                      <td className="px-4 py-3 text-epi-muted">{row.districts}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><SeverityBadge severity={row.risk} /></td>
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
              const dotBg = inv.status === 'requested' ? 'bg-[#EAB308]' : inv.priority === 'Critical' ? 'bg-epi-red' : 'bg-epi-amber';
              return (
                <div key={inv.id} className={`border-l-4 ${tone} border border-border rounded-r-lg p-4 bg-white`}>
                  <div className={`text-[11px] font-bold mb-1 flex items-center gap-1.5 ${label}`}>
                    <span className={`w-2 h-2 rounded-full inline-block ${dotBg}`} />
                    <span>{inv.status === 'requested' ? 'REQUESTED BY DISTRICT' : inv.priority === 'Critical' ? 'ACTIVE OUTBREAK' : 'UNDER INVESTIGATION'}</span>
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
