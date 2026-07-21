import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Map as MapIcon,
  Activity,
  Search,
  BarChart2,
  Calendar,
  GitBranch,
  Users,
  LineChart,
  Settings,
  History,
  Bell,
  ChevronDown,
  LogOut,
  BrainCircuit,
  Menu,
  X } from
'lucide-react';
import { EpiLogo } from '../epi/EpiLogo';
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
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    path: '/prediction',
    icon: Home,
    label: 'Prediction Overview',
    exact: true
  },
  {
    path: '/prediction/map',
    icon: MapIcon,
    label: 'National Risk Map'
  },
  {
    path: '/prediction/disease',
    icon: Activity,
    label: 'Disease Predictions'
  },
  {
    path: '/prediction/factors',
    icon: Search,
    label: 'Risk Factor Analysis'
  },
  {
    path: '/prediction/probability',
    icon: BarChart2,
    label: 'Outbreak Probability'
  },
  {
    path: '/prediction/timeline',
    icon: Calendar,
    label: 'Prediction Timeline'
  },
  {
    path: '/prediction/scenarios',
    icon: GitBranch,
    label: 'What-If Scenarios'
  },
  {
    path: '/prediction',
    icon: Users,
    label: 'Vulnerable Groups'
  },
  {
    path: '/prediction/performance',
    icon: LineChart,
    label: 'Model Performance'
  },
  {
    path: '/prediction',
    icon: Settings,
    label: 'Model Configuration'
  },
  {
    path: '/prediction',
    icon: History,
    label: 'Prediction History'
  }];

  return (
    <div className="min-h-screen bg-epi-bg font-sans text-epi-text flex">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`w-[240px] bg-[#104E49] flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <EpiLogo variant="light" />
          <button
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}>
            
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const isActive = item.exact ?
            currentPath === item.path :
            currentPath.startsWith(item.path) && item.path !== '/prediction';
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-colors relative ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                
                {isActive &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A550]" />
                }
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                
                <span className="flex-1">{item.label}</span>
              </Link>);

          })}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen w-full lg:w-auto">
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="lg:hidden text-epi-muted hover:text-epi-text"
              onClick={() => setIsMobileMenuOpen(true)}>
              
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[15px] font-bold text-epi-text hidden sm:block">
              AI Risk Prediction Module
            </span>
          </div>

          <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-epi-muted" />
              <input
                type="text"
                placeholder="Search districts, diseases, predictions..."
                className="w-full h-10 pl-10 pr-4 bg-epi-bg border border-border rounded-md text-[14px] focus:outline-none focus:border-epi" />
              
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <button className="relative text-epi-muted hover:text-epi-text">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-epi-red rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                4
              </span>
            </button>
            <span className="hidden sm:inline-flex bg-epi/10 border border-epi/20 px-3 py-1.5 rounded-full text-[12px] font-bold text-epi flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" /> Model Active — 84.7%
              Accuracy
            </span>
            <div className="flex items-center gap-2 pl-3 lg:pl-4 border-l border-border cursor-pointer hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-[#104E49] flex items-center justify-center text-white font-bold text-xs shrink-0">
                JPH
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[13px] font-bold text-epi-text leading-tight">
                  Dr. Jean Paul Habimana
                </span>
                <span className="text-[11px] text-epi-muted leading-tight">
                  Epidemiologist, RBC
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-epi-muted ml-1 hidden lg:block" />
            </div>
            <Link
              to="/login"
              replace
              aria-label="Log out"
              title="Log out"
              className="text-epi-muted hover:text-epi-red ml-1 lg:ml-2 transition-colors">
              
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Identity Banner */}
        <div className="h-12 bg-gradient-to-r from-[#104E49] to-[#0B3A36] flex items-center px-4 lg:px-8 text-white text-[13px] font-medium justify-between shadow-sm overflow-x-auto whitespace-nowrap hide-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <BrainCircuit className="w-4 h-4 text-white/80" />
            <span className="font-bold">AI Vital Prediction Engine</span>
            <span className="mx-2 text-white/40">|</span>
            <span>Rwanda National Health Surveillance</span>
            <span className="mx-2 text-white/40">|</span>
            <span>Model Accuracy: 84.7%</span>
            <span className="mx-2 text-white/40">|</span>
            <span>Last Retrain: June 2, 2026</span>
            <span className="mx-2 text-white/40">|</span>
            <span>Active Predictions: 240 districts × diseases</span>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-8">
              <div className="text-[13px] text-epi-muted font-medium mb-1">
                AI Vital &gt; AI Risk Prediction &gt; {breadcrumb}
              </div>
              <h1 className="text-[24px] font-bold text-epi-text">{title}</h1>
              {subtitle &&
              <p className="text-[14px] text-epi-muted">{subtitle}</p>
              }
            </div>
            {children}
          </div>
        </main>

        <footer className="py-6 text-center text-[12px] text-epi-muted border-t border-border mt-auto">
          AI Vital | Rwanda Biomedical Centre | Ministry of Health Rwanda | AUCA
          June 2026
        </footer>
      </div>
    </div>);

}