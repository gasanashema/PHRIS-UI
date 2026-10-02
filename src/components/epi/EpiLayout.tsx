import React from 'react';
import {
  Home,
  Activity,
  Microscope,
  BarChart2,
  AlertTriangle,
  TestTube,
  Map,
  FileText,
  Globe,
  BoxIcon } from
'lucide-react';
import { IdentityBanner, ModuleShell, Sep } from '../shared/ModuleShell';
import { NationalRiskChip } from '../shared/NationalRiskChip';
import { useApp } from '../../store/AppStore';
interface EpiLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function EpiLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: EpiLayoutProps) {
  const { state } = useApp();
  const openInv = state.investigations.filter((i) => i.status !== 'closed').length;
  return (
    <ModuleShell
      fallbackRole="epi"
      homePath="/epi"
      headerTitle="Epidemiologist Dashboard — National View"
      breadcrumbPrefix="AI Vital > Epidemiologist"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      searchPlaceholder="Search alerts by disease, district or ID..."
      searchTarget="/warning/history"
      chip={<NationalRiskChip />}
      nav={[
      { path: '/epi', icon: Home, label: 'National Overview' },
      { path: '/epi/surveillance', icon: Activity, label: 'Disease Surveillance' },
      { path: '/epi/investigations', icon: Microscope, label: 'Outbreak Investigations', badge: openInv },
      { path: '/epi/patterns', icon: BarChart2, label: 'Pattern Analysis' },
      { path: '/epi/thresholds', icon: AlertTriangle, label: 'Epidemic Thresholds' },
      { path: '/epi/lab', icon: TestTube, label: 'Laboratory Data' },
      { path: '/epi/comparison', icon: Map, label: 'District Comparison' },
      { path: '/epi/field', icon: BoxIcon, label: 'Field Investigations' },
      { path: '/epi/reports', icon: FileText, label: 'Epi Reports' }]
      }
      banner={
      <IdentityBanner>
          <Globe className="w-4 h-4 mr-1 shrink-0" />
          <span className="font-bold">National Access — All 30 Districts</span>
          <Sep />
          <span>Rwanda Biomedical Centre (RBC)</span>
          <Sep />
          <span>Kigali, Rwanda</span>
          <Sep />
          <span>Tracking 12 diseases across 15,000+ health facilities and CHW networks</span>
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
