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
        red.length > 0 ? (
          <Link
            to="/warning/alerts"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{red.length} Active High-Risk Alert{red.length > 1 ? 's' : ''}</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 border border-white/20 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Routine Monitoring</span>
          </span>
        )
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
        { path: '/warning/cross-border', icon: Globe, label: 'Cross-Border Alerts' }
      ]}
      banner={
        <IdentityBanner tone="calm">
          {red.length > 0 ? (
            <>
              <span className="inline-flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Active Alert Surveillance</span>
              </span>
              <Sep />
              <span>
                {red.length} High-Risk Alert{red.length > 1 ? 's' : ''} Open
              </span>
              {red.map((a) => (
                <span key={a.id} className="contents">
                  <Sep />
                  <Link to={`/warning/detail?id=${a.id}`} className="font-bold hover:underline">
                    {a.district} — {a.disease}
                  </Link>
                </span>
              ))}
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>No critical alerts open — routine surveillance</span>
            </span>
          )}
          {latest && (
            <>
              <Sep />
              <span>Last alert generated: {fmtTime(latest.triggeredAt)} ({latest.id})</span>
            </>
          )}
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
