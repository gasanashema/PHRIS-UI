import { Link } from 'react-router-dom';
import {
  Bell,
  ShieldAlert,
  TrendingUp,
  Hospital,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Check } from
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
import { SeverityBadge, StatusBadge } from '../../components/shared/Badges';
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

const sectorTone: Record<string, { bg: string; dot: string; label: string }> = {
  red: { bg: 'bg-white hover:bg-red-50/40', dot: 'bg-admin-red', label: 'Critical' },
  orange: { bg: 'bg-white hover:bg-amber-50/40', dot: 'bg-[#F97316]', label: 'High' },
  yellow: { bg: 'bg-white hover:bg-yellow-50/40', dot: 'bg-yellow-500', label: 'Watch' },
  green: { bg: 'bg-white hover:bg-emerald-50/40', dot: 'bg-[#00A550]', label: 'Normal' }
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
  const lastRun = state.pipeline.lastRunAt;

  return (
    <DhoLayout
      title={`${district} District — Today's Overview`}
      subtitle={`${fmtDate(nowISO())} | Data last processed: ${fmtTime(lastRun)} (${timeAgo(lastRun)})`}
      breadcrumb="District Overview">

      {/* Action needed banner */}
      {unack.length > 0 && (
        <div className="bg-white border border-border rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="text-[14px] text-admin-text flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-admin-red shrink-0" />
            <div>
              <span className="font-bold text-admin-text">
                {unack.length} alert{unack.length > 1 ? 's' : ''} awaiting DHO acknowledgement.
              </span>{' '}
              <span className="text-admin-muted">
                {unack[0].disease} in {unack[0].sector ?? district} — {unack[0].probability}% outbreak probability.
              </span>
            </div>
          </div>
          <Link
            to={`/dho/alerts/${unack[0].id}`}
            className="h-8 px-4 bg-admin hover:bg-admin-hover text-white text-[12px] font-bold rounded-md inline-flex items-center shrink-0 transition-colors"
          >
            Review {unack[0].id} →
          </Link>
        </div>
      )}

      {/* Row 1: Minimal Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link
          to="/dho/risk-map"
          className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-admin-muted font-medium">District Threat Level</span>
              <div className="w-8 h-8 rounded-full bg-admin-bg flex items-center justify-center text-admin">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[22px] font-bold text-admin-text leading-none mb-1 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                level === 'red' ? 'bg-admin-red' : level === 'orange' ? 'bg-[#F97316]' : level === 'yellow' ? 'bg-yellow-500' : 'bg-[#00A550]'
              }`} />
              <span>{level === 'red' ? 'Critical Emergency' : level === 'orange' ? 'High Risk' : level === 'yellow' ? 'Watch Phase' : 'Normal Baseline'}</span>
            </div>
          </div>
          <div className="text-[12px] text-admin-muted pt-2 border-t border-border/60">
            {elevatedSince ? `Elevated since ${fmtDate(elevatedSince).replace(', 2026', '')}` : 'Routine district surveillance'}
          </div>
        </Link>

        <Link
          to="/dho/alerts"
          className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-admin-muted font-medium">Active District Alerts</span>
              <div className="w-8 h-8 rounded-full bg-admin-bg flex items-center justify-center text-admin">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
              {open.length}
            </div>
          </div>
          <div className="text-[12px] text-admin-muted pt-2 border-t border-border/60 flex items-center justify-between">
            {unack.length > 0 ? (
              <span className="text-admin-red font-semibold">{unack.length} awaiting review</span>
            ) : (
              <span>All alerts acknowledged</span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-admin-red" title={`${bySev('red')} critical`} />
              <span className="w-2 h-2 rounded-full bg-[#F97316]" title={`${bySev('orange')} high`} />
              <span className="w-2 h-2 rounded-full bg-yellow-500" title={`${bySev('yellow')} watch`} />
            </span>
          </div>
        </Link>

        <Link
          to="/dho/trends"
          className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-admin-muted font-medium">Weekly Incident Cases</span>
              <div className="w-8 h-8 rounded-full bg-admin-bg flex items-center justify-center text-admin">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
              {diseaseData.reduce((s, d) => s + d.cases, 0)}
            </div>
          </div>
          <div className="text-[12px] text-admin-muted pt-2 border-t border-border/60 flex items-center justify-between">
            <span className="text-[#F97316] font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18% vs last week
            </span>
            <span>Malaria leading</span>
          </div>
        </Link>

        <Link
          to="/dho/facilities"
          className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-admin-muted font-medium">Facility Reporting</span>
              <div className="w-8 h-8 rounded-full bg-admin-bg flex items-center justify-center text-admin">
                <Hospital className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
              12 <span className="text-[16px] text-admin-muted font-normal">/ 15</span>
            </div>
          </div>
          <div className="text-[12px] text-admin-muted pt-2 border-t border-border/60 flex items-center justify-between">
            <span>80% submitted</span>
            <span className="font-medium text-admin-amber">{reminded ? 'Reminders sent' : '3 pending'}</span>
          </div>
        </Link>
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
                const tone = sectorTone[risk] || sectorTone.green;
                return (
                  <Link
                    key={s.name}
                    to={`/dho/risk-map?sector=${s.name}`}
                    title={`Open ${s.name} on the risk map`}
                    className={`rounded-lg p-3.5 flex flex-col items-center justify-center aspect-[4/3] border border-border hover:shadow-xs transition ${tone.bg}`}
                  >
                    <span className="text-[13px] font-bold text-admin-text mb-1">{s.name}</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-admin-muted">
                      <span className={`w-2 h-2 rounded-full ${tone.dot}`} />
                      <span>{tone.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-admin-muted">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-admin-red" /> Critical</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F97316]" /> High</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Watch</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00A550]" /> Normal Baseline</span>
              </div>
              <Link
                to="/dho/risk-map"
                className="text-[13px] font-bold text-admin hover:underline"
              >
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
            {open.length === 0 && (
              <div className="text-center py-6 text-[13px] text-admin-muted">
                <CheckCircle2 className="w-6 h-6 text-admin-accent mx-auto mb-2" />
                No open alerts in {district}.
              </div>
            )}
            {open.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="border border-border bg-admin-bg/30 rounded-lg p-3.5"
              >
                <div className="text-[13px] font-bold text-admin-text mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={a.severity} />
                    <span>{a.disease}</span>
                    <span className="text-[12px] font-mono text-admin-muted">{a.id}</span>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="text-[12px] text-admin-muted mb-1.5">
                  Sector: <span className="font-semibold text-admin-text">{a.sector ?? '—'}</span> · {timeAgo(a.triggeredAt)}
                </div>
                <div className="text-[12px] text-admin-text mb-3">
                  {a.reasons[0]} ({a.probability}% probability)
                </div>
                <div className="flex gap-2">
                  {a.status === 'active' && (
                    <button
                      onClick={() => dialogs.open('ack', a)}
                      className="h-8 px-3.5 bg-admin hover:bg-admin-hover text-white text-[12px] font-semibold rounded-md transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <Link
                    to={`/dho/alerts/${a.id}`}
                    className="h-8 px-3.5 bg-white border border-border text-admin-text hover:bg-admin-bg text-[12px] font-semibold rounded-md inline-flex items-center transition-colors"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
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

                    <span className="font-medium text-admin-text inline-flex items-center gap-1.5">
                      {f.ok ? (
                        <Check className="w-3.5 h-3.5 text-admin-accent shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-admin-amber shrink-0" />
                      )}
                      <span>{f.name}</span>
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
              className="mt-4 h-10 border border-admin-amber text-admin-amber hover:bg-admin-amber/10 disabled:opacity-60 disabled:cursor-not-allowed text-[13px] font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-1.5">
              {reminded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Reminder sent to 3 facilities</span>
                </>
              ) : (
                'Send reminder to 3 facilities'
              )}
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

                <span className="pt-1.5 shrink-0">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    n.severity === 'red' ? 'bg-admin-red' :
                    n.severity === 'orange' ? 'bg-[#F97316]' :
                    n.severity === 'yellow' ? 'bg-yellow-500' :
                    n.severity === 'green' ? 'bg-[#00A550]' : 'bg-admin-accent'
                  }`} />
                </span>
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
