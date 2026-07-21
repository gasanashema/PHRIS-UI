import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Plus,
  Hospital,
  Users,
  Clock,
  ArrowUpRight,
  ArrowRight } from
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
const SECTORS = [
{
  name: 'Tumba',
  risk: 'red'
},
{
  name: 'Ngoma',
  risk: 'orange'
},
{
  name: 'Maraba',
  risk: 'orange'
},
{
  name: 'Mbazi',
  risk: 'green'
},
{
  name: 'Mukura',
  risk: 'yellow'
},
{
  name: 'Sovu',
  risk: 'green'
},
{
  name: 'Kinazi',
  risk: 'yellow'
},
{
  name: 'Huye',
  risk: 'orange'
}];

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

export function DhoOverview() {
  return (
    <DhoLayout
      title="Huye District — Today's Overview"
      subtitle="Thursday, June 5, 2026 | Data last updated: 08:34 AM (2 hours ago)"
      breadcrumb="District Overview">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-admin-amber rounded-lg shadow-sm p-5 flex flex-col text-white">
          <div className="text-[12px] font-semibold uppercase tracking-wider opacity-90 mb-2">
            District Risk Level
          </div>
          <div className="text-[24px] font-bold leading-none mb-1">
            🟠 ORANGE
          </div>
          <div className="text-[13px] opacity-90">Alert — action required</div>
          <div className="text-[11px] opacity-75 mt-auto pt-2">
            Elevated since June 3
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Bell className="w-5 h-5 text-admin-red mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            3
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Active Alerts
          </div>
          <div className="text-[11px] font-medium mt-2 flex gap-1.5">
            <span className="text-admin-red">1🔴</span>
            <span className="text-admin-amber">1🟠</span>
            <span className="text-yellow-500">1🟡</span>
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
            145
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Cases This Week
          </div>
          <div className="flex items-center gap-1 text-[12px] font-bold text-admin-red mt-2">
            <ArrowUpRight className="w-3 h-3" /> +18% vs last week
          </div>
          <div className="text-[11px] text-admin-muted mt-auto pt-1">
            Across all diseases
          </div>
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
            3 not yet submitted
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Users className="w-5 h-5 text-admin mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            2,340
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Population at Risk
          </div>
          <div className="text-[11px] text-admin-muted mt-2">
            Estimated vulnerable residents
          </div>
          <Link
            to="/dho/risk-map"
            className="text-[12px] font-bold text-admin hover:underline mt-auto pt-1">
            
            View vulnerability map →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-5 flex flex-col">
          <Clock className="w-5 h-5 text-admin-muted mb-3" />
          <div className="text-[28px] font-bold text-admin-text leading-none mb-1">
            2h ago
          </div>
          <div className="text-[13px] text-admin-muted font-medium">
            Last Data Update
          </div>
          <div className="text-[11px] text-admin-muted mt-2">
            DHIS2 + CHW reports
          </div>
          <div className="text-[11px] text-admin-accent font-medium mt-auto pt-1">
            🟢 Data flowing
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              Huye District — Sector Risk Map
            </h2>
          </div>
          <div className="p-5 flex-1">
            <div className="grid grid-cols-4 gap-3">
              {SECTORS.map((s) =>
              <div
                key={s.name}
                className={`rounded-md p-4 flex flex-col items-center justify-center aspect-[4/3] font-bold ${riskFill[s.risk]}`}>
                
                  <span className="text-[14px]">{s.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-4 text-[12px] text-admin-muted">
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
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              Active Alerts — Huye District
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {[
            {
              border: 'border-admin-red',
              badge: '🔴 RED',
              title: 'Cholera Risk Rising',
              meta: 'Sector: Tumba | Since: June 3 (2 days ago)',
              body: 'Cases up 340% week-over-week. Outbreak probability: 82%.'
            },
            {
              border: 'border-admin-amber',
              badge: '🟠 ORANGE',
              title: 'Malaria Threshold Crossed',
              meta: 'Sector: Ngoma | Since: June 4 (1 day ago)',
              body: '87 cases this week vs threshold of 50.'
            },
            {
              border: 'border-yellow-400',
              badge: '🟡 YELLOW',
              title: 'Low Vaccination Coverage',
              meta: 'Sector: Mukura | Since: June 2 (3 days ago)',
              body: 'Measles coverage 61% vs 95% target.'
            }].
            map((a, i) =>
            <div
              key={i}
              className={`border-l-4 ${a.border} bg-admin-bg/50 rounded-r-md p-3`}>
              
                <div className="text-[13px] font-bold text-admin-text mb-1">
                  {a.badge} | {a.title}
                </div>
                <div className="text-[12px] text-admin-muted mb-1">
                  {a.meta}
                </div>
                <div className="text-[12px] text-admin-text mb-3">{a.body}</div>
                <div className="flex gap-2">
                  <button className="h-8 px-3 bg-admin hover:bg-admin-hover text-white text-[12px] font-semibold rounded">
                    Acknowledge
                  </button>
                  <button className="h-8 px-3 bg-white border border-border text-admin-text text-[12px] font-semibold rounded">
                    Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-admin-text">
              Facility Reporting — Today
            </h2>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {[
              {
                name: 'Huye District Hospital',
                time: 'Reported 08:12 AM',
                ok: true
              },
              {
                name: 'Tumba Health Center',
                time: 'Reported 07:45 AM',
                ok: true
              },
              {
                name: 'Mbazi Health Center',
                time: 'Reported 09:00 AM',
                ok: true
              },
              {
                name: 'Mukura Health Post',
                time: 'Not yet reported',
                ok: false
              },
              {
                name: 'Kinazi Health Post',
                time: 'Not yet reported',
                ok: false
              },
              {
                name: 'Maraba Health Center',
                time: 'Not yet reported',
                ok: false
              }].
              map((f, i) =>
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
                  
                    {f.time}
                  </span>
                </div>
              )}
            </div>
            <button className="mt-4 h-10 border border-admin-amber text-admin-amber hover:bg-admin-amber/10 text-[13px] font-semibold rounded-md transition-colors">
              Send reminder to 3 facilities
            </button>
          </div>
        </div>
      </div>
    </DhoLayout>);

}