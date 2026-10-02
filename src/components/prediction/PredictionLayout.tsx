import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Map as MapIcon,
  Activity,
  Search,
  BarChart2,
  Calendar,
  GitBranch,
  LineChart,
  History,
  BrainCircuit } from
'lucide-react';
import { IdentityBanner, ModuleShell, Sep } from '../shared/ModuleShell';
import { useApp } from '../../store/AppStore';
import { fmtDateTime } from '../../lib/format';
interface PredictionLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function PredictionLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: PredictionLayoutProps) {
  const { state } = useApp();
  const running = state.predictionRuns.find((r) => r.status === 'running');
  const last = state.predictionRuns.find((r) => r.status === 'complete');
  return (
    <ModuleShell
      fallbackRole="epi"
      homePath="/prediction"
      headerTitle="AI Risk Prediction Module"
      breadcrumbPrefix="AI Vital > AI Prediction"
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      searchPlaceholder="Search alerts by disease, district or ID..."
      searchTarget="/warning/history"
      chip={
      <Link
        to="/prediction"
        className="inline-flex bg-epi/10 border border-epi/20 px-3 py-1.5 rounded-full text-[12px] font-bold text-epi items-center gap-1.5 whitespace-nowrap">

          <BrainCircuit className={`w-3.5 h-3.5 ${running ? 'animate-pulse' : ''}`} />
          {running ? 'Prediction running…' : 'Model Active — 84.7% Accuracy'}
        </Link>
      }
      nav={[
      { path: '/prediction', icon: Home, label: 'Prediction Overview', exact: true },
      { path: '/prediction/map', icon: MapIcon, label: 'National Risk Map' },
      { path: '/prediction/disease', icon: Activity, label: 'Disease Predictions' },
      { path: '/prediction/factors', icon: Search, label: 'Risk Factor Analysis' },
      { path: '/prediction/probability', icon: BarChart2, label: 'Outbreak Probability' },
      { path: '/prediction/timeline', icon: Calendar, label: 'Prediction Timeline' },
      { path: '/prediction/scenarios', icon: GitBranch, label: 'What-If Scenarios' },
      { path: '/prediction/performance', icon: LineChart, label: 'Model Performance' },
      { path: '/prediction/history', icon: History, label: 'Prediction History' }]
      }
      banner={
      <IdentityBanner tone="calm">
          <BrainCircuit className="w-4 h-4 text-white/80 mr-1 shrink-0" />
          <span className="font-bold">AI Vital Prediction Engine</span>
          <Sep />
          <span>Model Accuracy: 84.7%</span>
          <Sep />
          <span>Last Retrain: June 2, 2026</span>
          <Sep />
          <span>
            Last run: {last ? `${fmtDateTime(last.at)} (${last.batchId})` : '—'}
          </span>
          <Sep />
          <span>Simulated model — deterministic frontend demo</span>
        </IdentityBanner>
      }>

      {children}
    </ModuleShell>);

}
