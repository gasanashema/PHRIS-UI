import { Link } from 'react-router-dom';
import {
  Bell,
  Plus,
  Hospital,
  Users,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  FileSearch,
  Target } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell } from
'recharts';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { useAlertDialogs } from '../../components/shared/AlertDialogs';
import { StatusBadge } from '../../components/shared/Badges';
import {
  districtLevel,
  notificationsFor,
  sectorRisk,
  sortAlerts,
  useApp,
  useCurrentUser } from
'../../store/AppStore';
import { HUYE_SECTORS } from '../../data/seed';
import {
  SEVERITY_META,
  fmtDate,
  fmtTime,
  isOpenStatus,
  nowISO,
  timeAgo } from
'../../lib/format';

const riskFill: Record<string, string> = {
  red: 'bg-admin-red text-white',
  orange: 'bg-admin-amber text-white',
  yellow: 'bg-yellow-400 text-admin-text',
  green: 'bg-admin-accent text-white'
};
const diseaseData = [
{
  name: 'Malaria',
  cases: 52,
  color: '#F59E0B'
},
{
  name: 'Cholera',
  cases: 38,
  color: '#D32F2F'
},
{
  name: 'Diarrheal',
  cases: 31,
  color: '#F59E0B'
},
{
  name: 'Measles',
  cases: 14,
  color: '#EAB308'
},
{
  name: 'Respiratory',
  cases: 10,
  color: '#1D72B8'
}];

const FACILITIES = [
{ name: 'Huye District Hospital', time: 'Reported 08:12 AM', ok: true },
{ name: 'Tumba Health Center', time: 'Reported 07:45 AM', ok: true },
{ name: 'Mbazi Health Center', time: 'Reported 09:00 AM', ok: true },
{ name: 'Mukura Health Post', time: 'Not yet reported', ok: false },
{ name: 'Kinazi Health Post', time: 'Not yet reported', ok: false },
{ name: 'Maraba Health Center', time: 'Not yet reported', ok: false }];


export function DhoOverview() {
  const { state, actions } = useApp();
  const user = useCurrentUser('dho');
  const district = user.role === 'dho' ? user.district : 'Huye';
  const dialogs = useAlertDialogs();

  const districtAlerts = state.alerts.filter((a) => a.district === district);
  const open = sortAlerts(districtAlerts.filter((a) => isOpenStatus(a.status)), 'severity');
  const unack = open.filter((a) => a.status === 'active');
  const bySev = (s: string) => open.filter((a) => a.severity === s).length;
  const level = districtLevel(state, district);
  const levelMeta = SEVERITY_META[level];
  const elevatedSince = open.
  filter((a) => a.severity === level).
  map((a) => a.triggeredAt).
  sort()[0];
  const missing = FACILITIES.filter((f) => !f.ok).map((f) => f.name);
  const reminded = missing.every((f) => state.remindersSent.includes(f));
  const unread = notificationsFor(state, user).filter((n) => !n.read);
  const activity = state.activity.
  filter((a) => a.district === district || a.actorEmail === user.email).
  slice(0, 6);
  const activeInv = state.investigations.filter((i) => i.district === district && i.status !== 'closed');
  const liveInterventions = state.interventions.filter(
    (i) => i.district === district && (i.status === 'Ongoing' || i.status === 'Planned')
  );
  const lastRun = state.pipeline.lastRunAt;

  return (
    <DhoLayout
      title={`${district} District — Today's Overview`}
      subtitle={`${fmtDate(nowISO())} | Data last processed: ${fmtTime(lastRun)} (${timeAgo(lastRun)})`}
      breadcrumb="District Overview">

      {/* Action needed banner */}
      {unack.length > 0 &&
      <div className="bg-admin-red/10 border border-admin-red/30 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[14px] text-admin-text">
            <span className="font-bold text-admin-red">
              {unack.length} alert{unack.length > 1 ? 's' : ''} awaiting acknowledgement.
            </span>{' '}
            {unack[0].disease} in {unack[0].sector ?? district} — {unack[0].probability}% outbreak probability.
          </div>
          <Link
          to={`/dho/alerts/${unack[0].id}`}
          className="h-9 px-4 bg-admin-red hover:bg-red-700 text-white text-[13px] font-semibold rounded-md inline-flex items-center shrink-0">

            Review {unack[0].id} →
          </Link>
        </div>
      }

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className={`${riskFill[level]} rounded-lg shadow-sm p-5 flex flex-col`}>
          <div className="text-[12px] font-semibold uppercase tracking-wider opacity-90 mb-2">
            District Risk Level
          </div>
          <div className="text-[24px] font-bold leading-none mb-1">
            {levelMeta.emoji} {levelMeta.label}
          </div>
          <div className="text-[13px] opacity-90">
            {level === 'green' ? 'No open alerts' : level === 'yellow' ? 'Watch — monitor closely' : 'Alert — action required'}
          </div>
          <div className="text-[11px] opacity-75 mt-auto pt-2">
            {elevatedSince ? `Elevated since ${fmtDate(elevatedSince).replace(', 2026', '')}` : 'Routine surveillance'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Bell className="w-5 h-5 text-admin-red mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            {open.length}
          </div>
          <div className="text-[13px] text-admin-muted font-medium">Open Alerts</div>
          <div className="text-[11px] font-medium mt-2 flex gap-1.5">
            <span className="text-admin-red">{bySev('red')}🔴</span>
            <span className="text-admin-amber">{bySev('orange')}🟠</span>
            <span className="text-yellow-500">{bySev('yellow')}🟡</span>
          </div>
          <Link
            to="/dho/alerts"
            className="text-[12px] font-bold text-admin hover:underline mt-auto pt-2">

            View all alerts →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Plus className="w-5 h-5 text-admin mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            {diseaseData.reduce((s, d) => s + d.cases, 0)}
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Cases This Week
          </div>
          <div className="flex items-center gap-1 text-[12px] font-bold text-admin-red mt-2">
            <ArrowUpRight className="w-3 h-3" /> +18% vs last week
          </div>
          <Link to="/dho/trends" className="text-[12px] font-bold text-admin hover:underline mt-auto pt-1">
            View trends →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Hospital className="w-5 h-5 text-admin-info mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            12 <span className="text-[16px] text-admin-muted">/ 15</span>
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Facilities Reporting
          </div>
          <div className="w-full h-1.5 bg-admin-bg rounded-full mt-2">
            <div className="w-[80%] h-full bg-admin-amber rounded-full" />
          </div>
          <div className="text-[11px] text-admin-amber font-medium mt-auto pt-1">
            {reminded ? 'Reminders sent to 3 facilities' : '3 not yet submitted'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <FileSearch className="w-5 h-5 text-admin mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            {activeInv.length}
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Open Investigations
          </div>
          <div className="text-[11px] text-admin-muted mt-2 flex items-center gap-1">
            <Target className="w-3 h-3" /> {liveInterventions.length} interventions in progress
          </div>
          <Link
            to="/dho/investigations"
            className="text-[12px] font-bold text-admin hover:underline mt-auto pt-1">

            View investigations →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Clock className="w-5 h-5 text-admin-muted mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            {timeAgo(lastRun).replace(' ago', '')}
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Since Last Data Update
          </div>
          <div className="text-[11px] text-admin-muted mt-2">
            {state.pipeline.lastBatchId}
          </div>
          <div className="text-[11px] text-admin-accent font-medium mt-auto pt-1">
            🟢 DHIS2 + CHW data flowing
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              {district} District — Sector Risk Map
            </h2>
          </div>
          <div className="p-5 flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {HUYE_SECTORS.map((s) => {
                const risk = sectorRisk(state, s.name);
                return (
                  <Link
                    key={s.name}
                    to={`/dho/risk-map?sector=${s.name}`}
                    title={`Open ${s.name} on the risk map`}
                    className={`rounded-md p-4 flex flex-col items-center justify-center aspect-[4/3] font-bold hover:ring-2 hover:ring-admin-text/30 transition ${riskFill[risk]}`}>

                    <span className="text-[14px]">{s.name}</span>
                    <span className="text-[10px] font-semibold opacity-80 uppercase">{SEVERITY_META[risk].word}</span>
                  </Link>);

              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-admin-muted">
                <span>🔴 High Risk</span>
                <span>🟠 Alert</span>
                <span>🟡 Watch</span>
                <span>🟢 Normal</span>
              </div>
              <Link
                to="/dho/risk-map"
                className="text-[13px] font-bold text-admin hover:underline">

                View Full Map →
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-admin-text">
              Open Alerts — {district} District
            </h2>
            <Link to="/dho/alerts" className="text-[12px] font-bold text-admin hover:underline">
              All →
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {open.length === 0 &&
            <div className="text-center py-6 text-[13px] text-admin-muted">
                <CheckCircle2 className="w-6 h-6 text-admin-accent mx-auto mb-2" />
                No open alerts in {district}.
              </div>
            }
            {open.slice(0, 3).map((a) => {
              const m = SEVERITY_META[a.severity];
              return (
                <div
                  key={a.id}
                  className={`border-l-4 ${m.border} bg-admin-bg/50 rounded-r-md p-3`}>

                  <div className="text-[13px] font-bold text-admin-text mb-1 flex flex-wrap items-center gap-2">
                    <span>
                      {m.emoji} {m.label} | {a.disease}
                    </span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-[12px] text-admin-muted mb-1">
                    Sector: {a.sector ?? '—'} | Since: {fmtDate(a.triggeredAt).replace(', 2026', '')} ({timeAgo(a.triggeredAt)})
                  </div>
                  <div className="text-[12px] text-admin-text mb-3">{a.reasons[0]}. Probability: {a.probability}%.</div>
                  <div className="flex gap-2">
                    {a.status === 'active' &&
                    <button
                      onClick={() => dialogs.open('ack', a)}
                      className="h-8 px-3 bg-admin hover:bg-admin-hover text-white text-[12px] font-semibold rounded">

                        Acknowledge
                      </button>
                    }
                    <Link
                      to={`/dho/alerts/${a.id}`}
                      className="h-8 px-3 bg-white border border-border text-admin-text text-[12px] font-semibold rounded inline-flex items-center hover:bg-admin-bg">

                      Details
                    </Link>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-admin-text">
              Top Diseases — This Week
            </h2>
            <Link
              to="/dho/trends"
              className="text-[13px] font-bold text-admin hover:underline">

              View Full Trends →
            </Link>
          </div>
          <div className="p-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={diseaseData}
                layout="vertical"
                margin={{
                  left: 20,
                  right: 30
                }}>

                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#6B7280'
                  }}
                  width={80} />

                <Bar
                  dataKey="cases"
                  radius={[0, 4, 4, 0]}
                  barSize={22}
                  label={{
                    position: 'right',
                    fontSize: 12,
                    fill: '#1A1A2E'
                  }}>

                  {diseaseData.map((e, i) =>
                  <Cell key={i} fill={e.color} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-admin-text">
              Facility Reporting — Today
            </h2>
            <Link to="/dho/facilities" className="text-[13px] font-bold text-admin hover:underline">
              All facilities →
            </Link>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {FACILITIES.map((f, i) => {
                const sent = state.remindersSent.includes(f.name);
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 rounded text-[13px] ${f.ok ? '' : 'bg-admin-amber/10'}`}>

                    <span className="font-medium text-admin-text">
                      {f.ok ? '✅' : '❌'} {f.name}
                    </span>
                    <span
                      className={
                      f.ok ? 'text-admin-muted' : 'text-admin-amber font-medium'
                      }>

                      {f.ok ? f.time : sent ? 'Reminder sent' : f.time}
                    </span>
                  </div>);

              })}
            </div>
            <button
              onClick={() => actions.sendFacilityReminder(missing)}
              disabled={reminded}
              className="mt-4 h-10 border border-admin-amber text-admin-amber hover:bg-admin-amber/10 disabled:opacity-60 disabled:cursor-not-allowed text-[13px] font-semibold rounded-md transition-colors">

              {reminded ? '✓ Reminder sent to 3 facilities' : 'Send reminder to 3 facilities'}
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: notifications + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-admin-text">
              Unread Notifications{' '}
              <span className="text-admin-muted font-medium">({unread.length})</span>
            </h2>
            <Link to="/dho/notifications" className="text-[13px] font-bold text-admin hover:underline">
              Open inbox →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {unread.length === 0 &&
            <div className="p-6 text-center text-[13px] text-admin-muted">No unread notifications.</div>
            }
            {unread.slice(0, 4).map((n) =>
            <Link
              key={n.id}
              to={n.link ?? '/dho/notifications'}
              onClick={() => actions.markNotificationRead(n.id)}
              className="flex gap-3 px-5 py-3 hover:bg-admin-bg/50">

                <span>{n.severity === 'info' ? 'ℹ️' : SEVERITY_META[n.severity].emoji}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-bold text-admin-text">{n.title}</span>
                  <span className="block text-[12px] text-admin-muted truncate">{n.body}</span>
                </span>
                <span className="text-[11px] text-admin-muted whitespace-nowrap">{timeAgo(n.at)}</span>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-admin-text">Recent Activity</h2>
            <Users className="w-4 h-4 text-admin-muted" />
          </div>
          <ul className="divide-y divide-border">
            {activity.length === 0 &&
            <li className="p-6 text-center text-[13px] text-admin-muted">No recent activity.</li>
            }
            {activity.map((a) =>
            <li key={a.id} className="px-5 py-3 text-[13px]">
                <div className="flex justify-between gap-3">
                  <span className="font-bold text-admin-text">{a.action}</span>
                  <span className="text-[11px] text-admin-muted whitespace-nowrap">{timeAgo(a.at)}</span>
                </div>
                <div className="text-[12px] text-admin-muted">
                  {a.actor}
                  {a.detail ? ` · ${a.detail}` : ''}
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {dialogs.element}
    </DhoLayout>);

}
