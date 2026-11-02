import { Link } from 'react-router-dom';
import {
  Users,
  Bell,
  Plug,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell } from
'recharts';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SeverityBadge } from '../../components/shared/Badges';
import { sortAlerts, useApp } from '../../store/AppStore';
import { STATUS_LABEL } from '../integration/IntegrationSources';
import { fmtNumber, fmtTime, isOpenStatus, nowISO, timeAgo } from '../../lib/format';

const ROLE_BARS = [
{ name: 'Administrators', role: 'Administrator', color: '#104E49' },
{ name: 'Epidemiologists', role: 'Epidemiologist', color: '#1D72B8' },
{ name: 'Analysts', role: 'Public Health Analyst', color: '#00A550' },
{ name: 'District Officers', role: 'District Health Officer', color: '#104E49' },
{ name: 'Data Integration', role: 'Data Integration Engineer', color: '#6B7280' }];


export function AdminDashboard() {
  const { state, actions } = useApp();
  const users = state.users;
  const pending = users.filter((u) => u.status === 'Pending Approval').length;
  const activeToday = users.filter((u) => u.login.startsWith('Today')).length;
  const open = sortAlerts(state.alerts.filter((a) => isOpenStatus(a.status)), 'severity');
  const bySev = (s: string) => open.filter((a) => a.severity === s).length;
  const online = state.sources.filter((s) => s.enabled && s.status !== 'disconnected').length;
  const attention = state.sources.filter((s) => s.status !== 'active' && s.status !== 'disabled').length;
  const enabled = state.sources.filter((s) => s.enabled);
  const health = enabled.length ? Math.round(enabled.reduce((a, s) => a + s.health, 0) / enabled.length) : 0;
  const roleData = [
  ...ROLE_BARS.map((r) => ({ ...r, count: users.filter((u) => u.role === r.role && u.status !== 'Pending Approval').length })),
  { name: 'Pending', role: '', color: '#F59E0B', count: pending }];


  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; Dashboard Overview</div>
        <h1 className="text-[24px] font-bold text-admin-text">System Overview</h1>
        <p className="text-[14px] text-admin-muted">Rwanda — National Health Surveillance Platform | Last refreshed: Today, {fmtTime(nowISO())}</p>
      </div>

      {/* Row 1: Top 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-admin-muted font-medium">System Health</span>
              <ShieldCheck className="w-5 h-5 text-admin-accent" />
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-2">{health}%</div>
          </div>
          <div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-2">
              <div className="h-full bg-admin-accent rounded-full transition-all" style={{ width: `${health}%` }} />
            </div>
            <div className="text-[12px] font-medium text-admin-muted">
              {attention ? `${attention} source${attention > 1 ? 's' : ''} need review` : 'All services operational'}
            </div>
          </div>
        </div>

        <Link to="/admin/data-sources" className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-admin-muted font-medium">Data Sources</span>
              <Plug className="w-5 h-5 text-admin-info" />
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-2">
              {online} <span className="text-[16px] font-normal text-admin-muted">/ {state.sources.length}</span>
            </div>
          </div>
          <div className="text-[12px] font-medium pt-1">
            {attention > 0 ? (
              <span className="text-admin-amber font-semibold">{attention} needing attention</span>
            ) : (
              <span className="text-admin-accent font-semibold">All streams online</span>
            )}
          </div>
        </Link>

        <Link to="/warning/alerts" className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-admin-muted font-medium">Active Alerts</span>
              <Bell className="w-5 h-5 text-admin-red" />
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-2">{open.length}</div>
          </div>
          <div className="text-[12px] font-medium pt-1 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-admin-text font-semibold" title="Critical alerts">
              <span className="w-2 h-2 rounded-full bg-admin-red shrink-0" />
              {bySev('red')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-admin-text font-semibold" title="High alerts">
              <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0" />
              {bySev('orange')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-admin-text font-semibold" title="Watch alerts">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
              {bySev('yellow')}
            </span>
          </div>
        </Link>

        <Link to="/admin/users" className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-admin-muted font-medium">Platform Users</span>
              <Users className="w-5 h-5 text-admin" />
            </div>
            <div className="text-[28px] font-bold text-admin-text leading-none mb-2">{users.length}</div>
          </div>
          <div className="text-[12px] font-medium pt-1">
            {pending > 0 ? (
              <span className="text-admin-amber font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> {pending} awaiting approval
              </span>
            ) : (
              <span className="text-admin-muted">{activeToday} signed in today</span>
            )}
          </div>
        </Link>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-admin-text">Live Data Source Status</h2>
            <Link to="/admin/data-sources" className="text-[13px] font-bold text-admin hover:underline">All sources →</Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-admin-bg/50 text-admin-muted font-medium">
                <tr>
                  {['Source Name', 'Status', 'Last Updated', 'Records Today', 'Action'].map((h) =>
                  <th key={h} className="px-5 py-3">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {state.sources.map((s) => {
                  const down = s.status === 'disconnected';
                  const warn = s.status === 'delayed' || s.status === 'partial';
                  return (
                    <tr key={s.id} className="hover:bg-admin-bg/30">
                      <td className="px-5 py-3 font-medium text-admin-text">{s.name}</td>
                      <td className="px-5 py-3 whitespace-nowrap">{s.syncing ? '⏱ Syncing' : STATUS_LABEL[s.status].label}</td>
                      <td className="px-5 py-3 text-admin-muted whitespace-nowrap">{timeAgo(s.lastSync)}</td>
                      <td className="px-5 py-3 text-admin-muted">{s.connection === 'Manual Upload' && !s.recordsToday ? 'Static' : `${fmtNumber(s.recordsToday)} records`}</td>
                      <td className="px-5 py-3">
                        {down ?
                        <button onClick={() => actions.reconnectSource(s.id)} disabled={s.syncing} className="text-admin-red font-bold hover:underline disabled:opacity-50">
                            {s.syncing ? 'Fixing…' : 'Fix Now'}
                          </button> :
                        warn ?
                        <Link to={`/integration/sources?edit=${s.id}`} className="text-admin-amber hover:underline">Investigate</Link> :

                        <Link to="/admin/data-sources" className="text-admin hover:underline">View</Link>
                        }
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">Recent System Activity</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {[...state.activity].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6).map((item) =>
              <div key={item.id} className={`text-[13px] leading-relaxed ${item.flagged ? 'text-admin-red' : ''}`}>
                  <span className="text-admin-muted">
                    {fmtTime(item.at)} | {item.actorEmail} |{' '}
                  </span>
                  <span className="font-bold text-admin-text">{item.action}</span>
                  {item.detail && <span className="text-admin-text"> — {item.detail}</span>}
                </div>
              )}
            </div>
            <Link to="/admin/audit" className="text-[13px] font-bold text-admin hover:underline flex items-center gap-1 mt-4 pt-4 border-t border-border">
              View Full Audit Trail <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">Active Risk Alerts — Nationwide</h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <tbody className="divide-y divide-border">
                {open.slice(0, 6).map((a) =>
                <tr key={a.id} className="hover:bg-admin-bg/30">
                    <td className="px-5 py-3"><SeverityBadge severity={a.severity} /></td>
                    <td className="px-5 py-3 font-bold text-admin-text">{a.disease}</td>
                    <td className="px-5 py-3 text-admin-muted">{a.district}</td>
                    <td className="px-5 py-3 text-admin-muted whitespace-nowrap">{timeAgo(a.triggeredAt)}</td>
                    <td className="px-5 py-3">
                      <Link to={`/warning/detail?id=${a.id}`} className="text-admin font-medium hover:underline">
                        {a.status === 'active' ? 'Respond' : a.severity === 'yellow' ? 'Monitor' : 'Review'}
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-4 border-t border-border">
              <Link to="/warning/alerts" className="text-[13px] font-bold text-admin hover:underline flex items-center gap-1">
                View All Alerts <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-admin-text">Users by Role</h2>
            <Link to="/admin/users" className="text-[13px] font-bold text-admin hover:underline flex items-center gap-1">
              Manage Users <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={roleData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} width={120} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {roleData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>);

}
