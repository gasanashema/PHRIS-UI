import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  AlertTriangle,
  Search,
  Settings,
  ArrowUpCircle,
  Radio,
  ClipboardList,
  BarChart2,
  Globe } from
'lucide-react';
import { IdentityBanner, ModuleShell, Sep } from '../shared/ModuleShell';
import { useApp } from '../../store/AppStore';
import { fmtTime, isOpenStatus } from '../../lib/format';
interface WarningLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function WarningLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: WarningLayoutProps) {
  const { state } = useApp();
  const open = state.alerts.filter((a) => isOpenStatus(a.status));
  const red = open.filter((a) => a.severity === 'red');
  const unack = open.filter((a) => a.status === 'active').length;
  const latest = [...state.alerts].sort((a, b) => b.triggeredAt.localeCompare(a.triggeredAt))[0];
  return (
    <ModuleShell
      fallbackRole="epi"
      homePath="/warning"
      headerTitle="Early Warning Module"
      breadcrumbPrefix="AI Vital > Early Warning"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      searchPlaceholder="Search alerts by disease, district or ID..."
      searchTarget="/warning/history"
      chip={
      red.length > 0 ?
      <Link
        to="/warning/alerts"
        className="inline-flex bg-epi-red px-3 py-1.5 rounded-full text-[12px] font-bold text-white items-center gap-1.5 whitespace-nowrap">

            <AlertTriangle className="w-3.5 h-3.5" /> {red.length} Red Alert{red.length > 1 ? 's' : ''} Active
          </Link> :

      <span className="inline-flex items-center gap-1.5 bg-[#00A550]/10 text-[#00A550] border border-[#00A550]/30 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#00A550]" /> No red alerts
          </span>

      }
      nav={[
      { path: '/warning', icon: Home, label: 'Warning Overview', exact: true },
      { path: '/warning/alerts', icon: AlertTriangle, label: 'Active Alerts', badge: open.length },
      { path: '/warning/detail', icon: Search, label: 'Alert Detail' },
      { path: '/warning/config', icon: Settings, label: 'Alert Configuration' },
      { path: '/warning/escalation', icon: ArrowUpCircle, label: 'Escalation Manager', badge: unack },
      { path: '/warning/delivery', icon: Radio, label: 'Notification Delivery' },
      { path: '/warning/history', icon: ClipboardList, label: 'Alert History & Response' },
      { path: '/warning/effectiveness', icon: BarChart2, label: 'Alert Effectiveness' },
      { path: '/warning/cross-border', icon: Globe, label: 'Cross-Border Alerts' }]
      }
      banner={
      <IdentityBanner tone={red.length > 0 ? 'danger' : 'calm'}>
          {red.length > 0 ?
        <>
              <span className="inline-flex items-center gap-1.5 font-bold"><AlertTriangle className="w-3.5 h-3.5" /> ACTIVE EMERGENCY</span>
              <Sep />
              <span>
                {red.length} Red Alert{red.length > 1 ? 's' : ''} Open
              </span>
              {red.map((a) =>
          <span key={a.id} className="contents">
                  <Sep />
                  <Link to={`/warning/detail?id=${a.id}`} className="font-bold hover:underline">
                    {a.district} — {a.disease}
                  </Link>
                </span>
          )}
            </> :

        <span className="inline-flex items-center gap-1.5 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-400" /> No red alerts open — routine monitoring</span>
        }
          {latest &&
        <>
              <Sep />
              <span>Last alert generated: {fmtTime(latest.triggeredAt)} ({latest.id})</span>
            </>
        }
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
