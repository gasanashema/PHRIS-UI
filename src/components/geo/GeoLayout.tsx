import React from 'react';
import {
  Map as MapIcon,
  Flame,
  Building2,
  Clock,
  PlaySquare,
  CloudRain,
  Globe,
  ShieldAlert,
  Download } from
'lucide-react';
import { ModuleShell } from '../shared/ModuleShell';
interface GeoLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
  hideHeader?: boolean;
}
export function GeoLayout({
  title,
  subtitle,
  breadcrumb,
  children,
  hideHeader = false
}: GeoLayoutProps) {
  return (
    <ModuleShell
      collapsible
      hideHeader={hideHeader}
      fallbackRole="epi"
      homePath="/geo"
      headerTitle="Geographic Health Intelligence"
      breadcrumbPrefix="AI Vital > Geographic Intelligence"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      searchPlaceholder="Search alerts by district or disease..."
      searchTarget="/warning/history"
      chip={
      <span className="inline-flex bg-epi/10 border border-epi/20 px-3 py-1.5 rounded-full text-[12px] font-bold text-epi items-center gap-1.5 whitespace-nowrap">
          🗺️ 30 Districts Active
        </span>
      }
      nav={[
      { path: '/geo', icon: MapIcon, label: 'Main Map', exact: true },
      { path: '/geo/heat', icon: Flame, label: 'Disease Heat Map' },
      { path: '/geo/facilities', icon: Building2, label: 'Health Facilities' },
      { path: '/geo/access', icon: Clock, label: 'Accessibility Map' },
      { path: '/geo/animation', icon: PlaySquare, label: 'Spread Animation' },
      { path: '/geo/environment', icon: CloudRain, label: 'Environmental Overlays' },
      { path: '/geo/cross-border', icon: Globe, label: 'Cross-Border Map' },
      { path: '/geo/vulnerability', icon: ShieldAlert, label: 'Vulnerability Map' },
      { path: '/geo/export', icon: Download, label: 'Export & Reports' }]
      }>

      {children}
    </ModuleShell>);

}
