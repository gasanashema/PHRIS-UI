import React from 'react';
import {
  Home,
  BarChart2,
  Search,
  Link as LinkIcon,
  Target,
  ShieldAlert,
  CheckSquare,
  FlaskConical,
  FileText,
  Globe } from
'lucide-react';
import { IdentityBanner, ModuleShell, Sep } from '../shared/ModuleShell';
import { NationalRiskChip } from '../shared/NationalRiskChip';
interface AnalystLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function AnalystLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: AnalystLayoutProps) {
  return (
    <ModuleShell
      fallbackRole="analyst"
      homePath="/analyst"
      headerTitle="Public Health Analyst Dashboard"
      breadcrumbPrefix="AI Vital > Analyst"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      searchPlaceholder="Search alerts by disease, district or ID..."
      searchTarget="/warning/history"
      chip={<NationalRiskChip />}
      nav={[
      { path: '/analyst', icon: Home, label: 'Analyst Overview' },
      { path: '/analyst/indicators', icon: BarChart2, label: 'Health Indicators' },
      { path: '/analyst/explore', icon: Search, label: 'Data Exploration' },
      { path: '/analyst/correlation', icon: LinkIcon, label: 'Correlation Analysis' },
      { path: '/analyst/risk-scores', icon: Target, label: 'Risk Score Review' },
      { path: '/analyst/vulnerable', icon: ShieldAlert, label: 'Vulnerable Populations' },
      { path: '/analyst/data-quality', icon: CheckSquare, label: 'Data Quality' },
      { path: '/analyst/scenarios', icon: FlaskConical, label: 'What-If Scenarios' },
      { path: '/analyst/reports', icon: FileText, label: 'Analysis Reports' }]
      }
      banner={
      <IdentityBanner>
          <Globe className="w-4 h-4 mr-1 shrink-0" />
          <span className="font-bold">National Access — All 30 Districts</span>
          <Sep />
          <span>Rwanda Biomedical Centre (RBC)</span>
          <Sep />
          <span>Health Sector Strategic Plan + Vision 2050 Targets Active</span>
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
