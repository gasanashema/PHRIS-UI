import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Activity,
  Bell,
  Plug,
  ShieldCheck,
  FileText,
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
export function AdminDashboard() {
  const roleData = [
  {
    name: 'Administrators',
    count: 4,
    color: '#104E49'
  },
  {
    name: 'Epidemiologists',
    count: 18,
    color: '#1D72B8'
  },
  {
    name: 'Analysts',
    count: 31,
    color: '#00A550'
  },
  {
    name: 'District Officers',
    count: 30,
    color: '#104E49'
  },
  {
    name: 'Pending',
    count: 8,
    color: '#F59E0B'
  }];

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; Dashboard Overview
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          System Overview
        </h1>
        <p className="text-[14px] text-admin-muted">
          Rwanda — National Health Surveillance Platform | Last refreshed:
          Today, 08:47 AM
        </p>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col relative overflow-hidden">
          <Users className="w-5 h-5 text-admin mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            247
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Total Registered Users
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[12px] font-bold text-admin-accent">
            <ArrowUpRight className="w-3 h-3" /> +3 this week
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <div className="w-5 h-5 rounded-full bg-admin-accent/20 flex items-center justify-center mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-admin-accent animate-pulse" />
          </div>
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            38
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Active Users Today
          </div>
          <div className="text-[12px] text-admin-muted mt-auto pt-2">
            Currently online
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <Bell className="w-5 h-5 text-admin-red mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            7
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Active Risk Alerts
          </div>
          <div className="text-[12px] font-medium mt-auto pt-2 flex gap-2">
            <span className="text-admin-red">2 🔴</span>
            <span className="text-admin-amber">3 🟠</span>
            <span className="text-admin-yellow">2 🟡</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <Plug className="w-5 h-5 text-admin-info mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            7 <span className="text-[18px] text-admin-muted">of 9</span>
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Data Sources Online
          </div>
          <div className="text-[12px] text-admin-amber font-medium mt-auto pt-2">
            2 sources need attention
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <ShieldCheck className="w-5 h-5 text-admin-accent mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            94%
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            System Health Score
          </div>
          <div className="w-full h-1.5 bg-border rounded-full mt-auto">
            <div className="w-[94%] h-full bg-admin-accent rounded-full" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <FileText className="w-5 h-5 text-admin-muted mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            12
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Reports Generated Today
          </div>
          <div className="text-[12px] text-admin-muted mt-auto pt-2">
            3 pending approval
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              Live Data Source Status
            </h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-admin-bg/50 text-admin-muted font-medium">
                <tr>
                  <th className="px-5 py-3">Source Name</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Last Updated</th>
                  <th className="px-5 py-3">Records Today</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                {
                  name: 'DHIS2 / HMIS',
                  status: '🟢 Active',
                  time: '2h ago',
                  recs: '1,204 records',
                  action: 'View',
                  actionColor: 'text-admin'
                },
                {
                  name: 'RBC Laboratory',
                  status: '🟢 Active',
                  time: '1h ago',
                  recs: '347 records',
                  action: 'View',
                  actionColor: 'text-admin'
                },
                {
                  name: 'CHW Reports',
                  status: '🟡 Delayed',
                  time: '6h ago',
                  recs: '89 records',
                  action: 'Investigate',
                  actionColor: 'text-admin-amber'
                },
                {
                  name: 'NISR Census',
                  status: '🟢 Active',
                  time: '1 day ago',
                  recs: 'Static',
                  action: 'View',
                  actionColor: 'text-admin'
                },
                {
                  name: 'Rwanda Met Agency',
                  status: '🔴 Disconnected',
                  time: '3 days ago',
                  recs: '0 records',
                  action: 'Fix Now',
                  actionColor: 'text-admin-red font-bold'
                },
                {
                  name: 'WASAC',
                  status: '🟢 Active',
                  time: '4h ago',
                  recs: '56 records',
                  action: 'View',
                  actionColor: 'text-admin'
                },
                {
                  name: 'MINAGRI',
                  status: '🟡 Delayed',
                  time: '8h ago',
                  recs: '12 records',
                  action: 'Investigate',
                  actionColor: 'text-admin-amber'
                }].
                map((row, i) =>
                <tr key={i} className="hover:bg-admin-bg/30">
                    <td className="px-5 py-3 font-medium text-admin-text">
                      {row.name}
                    </td>
                    <td className="px-5 py-3">{row.status}</td>
                    <td className="px-5 py-3 text-admin-muted">{row.time}</td>
                    <td className="px-5 py-3 text-admin-muted">{row.recs}</td>
                    <td className="px-5 py-3">
                      <button className={`hover:underline ${row.actionColor}`}>
                        {row.action}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              Recent System Activity
            </h2>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {[
              {
                time: '08:45 AM',
                user: 'admin@moh.gov.rw',
                action: 'Added new user',
                context: '— aline.uwimana@rbc.gov.rw'
              },
              {
                time: '08:22 AM',
                user: 'jp.habimana@rbc.gov.rw',
                action: 'Generated Malaria Situation Report',
                context: ''
              },
              {
                time: '07:55 AM',
                user: 'officer@huye.gov.rw',
                action: 'Acknowledged RED alert',
                context: '— Cholera Huye District'
              },
              {
                time: '07:30 AM',
                user: 'system',
                action: 'Weekly epidemiological bulletin auto-sent',
                context: 'to 234 recipients'
              },
              {
                time: '07:00 AM',
                user: 'system',
                action: 'Scheduled backup completed successfully',
                context: ''
              }].
              map((item, i) =>
              <div key={i} className="text-[13px] leading-relaxed">
                  <span className="text-admin-muted">
                    {item.time} | {item.user} |{' '}
                  </span>
                  <span className="font-bold text-admin-text">
                    {item.action}
                  </span>
                  <span className="text-admin-text"> {item.context}</span>
                </div>
              )}
            </div>
            <Link
              to="/admin/audit"
              className="text-[13px] font-bold text-admin hover:underline flex items-center gap-1 mt-4 pt-4 border-t border-border">
              
              View Full Audit Trail <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              Active Risk Alerts — Nationwide
            </h2>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-[13px]">
              <tbody className="divide-y divide-border">
                {[
                {
                  badge: '🔴 RED',
                  bg: 'bg-admin-red/10 text-admin-red',
                  disease: 'Cholera',
                  district: 'Rusizi District',
                  time: '2h ago',
                  action: 'Respond'
                },
                {
                  badge: '🔴 RED',
                  bg: 'bg-admin-red/10 text-admin-red',
                  disease: 'Malaria',
                  district: 'Kayonza',
                  time: '5h ago',
                  action: 'Respond'
                },
                {
                  badge: '🟠 ORANGE',
                  bg: 'bg-admin-amber/10 text-admin-amber',
                  disease: 'Measles',
                  district: 'Nyamagabe',
                  time: '1 day ago',
                  action: 'Review'
                },
                {
                  badge: '🟡 YELLOW',
                  bg: 'bg-yellow-100 text-yellow-700',
                  disease: 'Diarrhea',
                  district: 'Muhanga',
                  time: '2 days ago',
                  action: 'Monitor'
                }].
                map((row, i) =>
                <tr key={i} className="hover:bg-admin-bg/30">
                    <td className="px-5 py-3">
                      <span
                      className={`px-2 py-1 rounded text-[11px] font-bold ${row.bg}`}>
                      
                        {row.badge}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-admin-text">
                      {row.disease}
                    </td>
                    <td className="px-5 py-3 text-admin-muted">
                      {row.district}
                    </td>
                    <td className="px-5 py-3 text-admin-muted">{row.time}</td>
                    <td className="px-5 py-3">
                      <button className="text-admin font-medium hover:underline">
                        {row.action}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-4 border-t border-border">
              <Link
                to="#"
                className="text-[13px] font-bold text-admin hover:underline flex items-center gap-1">
                
                View All Alerts <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-admin-text">
              Users by Role
            </h2>
            <Link
              to="/admin/users"
              className="text-[13px] font-bold text-admin hover:underline flex items-center gap-1">
              
              Manage Users <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 flex-1 flex items-center justify-center min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roleData}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 20,
                  left: 40,
                  bottom: 0
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
                  width={120} />
                
                <Tooltip
                  cursor={{
                    fill: 'transparent'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} />
                
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