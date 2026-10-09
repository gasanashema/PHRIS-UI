import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Plug,
  GitMerge,
  ShieldCheck,
  UploadCloud,
  Map as MapIcon,
  Clock,
  Activity,
  ClipboardList } from
'lucide-react';
import { IdentityBanner, ModuleShell, Sep } from '../shared/ModuleShell';
import { useApp } from '../../store/AppStore';
import { fmtTime, timeAgo } from '../../lib/format';
interface IntegrationLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function IntegrationLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: IntegrationLayoutProps) {
  const { state } = useApp();
  const src = state.sources;
  const active = src.filter((s) => s.status === 'active').length;
  const degraded = src.filter((s) => s.status === 'delayed' || s.status === 'partial').length;
  const down = src.filter((s) => s.status === 'disconnected').length;
  const disabled = src.filter((s) => s.status === 'disabled').length;
  const lastSync = src.
  filter((s) => s.enabled).
  map((s) => s.lastSync).
  sort().
  slice(-1)[0];
  return (
    <ModuleShell
      fallbackRole="integration"
      homePath="/integration"
      headerTitle="Health Data Integration"
      breadcrumbPrefix="AI Vital > Data Integration"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      searchPlaceholder="Search data sources..."
      searchTarget="/integration/sources"
      chip={
      down > 0 ?
      <Link
        to="/integration/sources"
        className="inline-flex items-center gap-1.5 bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            {down} Source{down > 1 ? 's' : ''} Disconnected
          </Link> :

      <span className="inline-flex items-center gap-1.5 bg-[#00A550]/10 text-[#00A550] border border-[#00A550]/30 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#00A550]" />
            All sources connected
          </span>

      }
      nav={[
      { path: '/integration', icon: Home, label: 'Integration Home', exact: true },
      { path: '/integration/sources', icon: Plug, label: 'Data Source Connections', badge: down },
      { path: '/integration/pipeline', icon: GitMerge, label: 'Pipeline Dashboard' },
      { path: '/integration/validation', icon: ShieldCheck, label: 'Data Validation' },
      { path: '/integration/upload', icon: UploadCloud, label: 'Manual Upload' },
      { path: '/integration/mapping', icon: MapIcon, label: 'Data Mapping' },
      { path: '/integration/scheduling', icon: Clock, label: 'Scheduling' },
      { path: '/integration/health', icon: Activity, label: 'Source Health Monitor' },
      { path: '/integration/audit', icon: ClipboardList, label: 'Audit Trail' }]
      }
      banner={
      <IdentityBanner tone="calm">
          <Plug className="w-4 h-4 text-white/80 mr-1 shrink-0" />
          <span className="font-bold">Data Integration Center</span>
          <Sep />
          <span>{src.length} Sources Configured</span>
          <Sep />
          <span>
            {active} Active | {degraded} Degraded | {down} Disconnected
            {disabled ? ` | ${disabled} Disabled` : ''}
          </span>
          <Sep />
          <span>
            Last sync: {lastSync ? `${fmtTime(lastSync)} (${timeAgo(lastSync)})` : '—'}
          </span>
          {state.pipeline.staleSources &&
        <>
              <Sep />
              <Link to="/processing" className="font-bold underline">
                New data waiting for processing →
              </Link>
            </>
        }
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
