import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Wand2,
  Calculator,
  Map as MapIcon,
  BrainCircuit,
  TrendingUp,
  CalendarClock,
  ShieldCheck,
  Settings } from
'lucide-react';
import { IdentityBanner, ModuleShell, Sep } from '../shared/ModuleShell';
import { useApp } from '../../store/AppStore';
import { PIPELINE_STAGES } from '../../data/seed';
import { fmtNumber, fmtTime } from '../../lib/format';
interface ProcessingLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function ProcessingLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: ProcessingLayoutProps) {
  const { state } = useApp();
  const p = state.pipeline;
  const running = p.status === 'running';
  const failed = state.jobs.filter((j) => j.status === 'failed').length;
  return (
    <ModuleShell
      fallbackRole="integration"
      homePath="/processing"
      headerTitle="Data Processing & Feature Engineering"
      breadcrumbPrefix="AI Vital > Data Processing"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      footer={false}
      searchPlaceholder="Search processing jobs..."
      searchTarget="/processing"
      chip={
      <Link
        to="/processing"
        className="inline-flex bg-epi-bg border border-border px-3 py-1.5 rounded-full text-[12px] font-bold text-epi-text items-center gap-1.5 whitespace-nowrap">

          <Settings className={`w-3.5 h-3.5 text-epi ${running ? 'animate-spin' : ''}`} />
          {running ?
        `Running — ${PIPELINE_STAGES[p.stageIndex].label}` :
        p.staleSources ?
        'New data waiting' :
        `Last run ${fmtTime(p.lastRunAt)}`}
        </Link>
      }
      nav={[
      { path: '/processing', icon: Home, label: 'Processing Overview', exact: true },
      { path: '/processing/cleaning', icon: Wand2, label: 'Data Cleaning' },
      { path: '/processing/metrics', icon: Calculator, label: 'Metrics Calculator' },
      { path: '/processing/geographic', icon: MapIcon, label: 'Geographic Aggregation' },
      { path: '/processing/features', icon: BrainCircuit, label: 'Feature Engineering' },
      { path: '/processing/trends', icon: TrendingUp, label: 'Trend Analysis' },
      { path: '/processing/scheduler', icon: CalendarClock, label: 'Job Scheduler', badge: failed },
      { path: '/processing/quality', icon: ShieldCheck, label: 'Data Quality Scores' }]
      }
      banner={
      <IdentityBanner tone="calm">
          <Settings className="w-4 h-4 text-white/80 mr-1 shrink-0" />
          <span className="font-bold">Data Processing Engine</span>
          <Sep />
          <span>Rwanda National Health Data Pipeline</span>
          <Sep />
          <span>Records Processed: {fmtNumber(p.recordsProcessed)}</span>
          <Sep />
          <span>Overall Data Quality Score: {p.qualityScore}% {p.qualityScore >= 85 ? '🟢' : '🟡'}</span>
          <Sep />
          <span>Latest batch: {p.lastBatchId}</span>
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
