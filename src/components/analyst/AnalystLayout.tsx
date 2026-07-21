import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Bell,
  ChevronDown,
  LogOut,
  Globe,
  Menu,
  X } from
'lucide-react';
import { EpiLogo } from '../epi/EpiLogo';
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
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    path: '/analyst',
    icon: Home,
    label: 'Analyst Overview'
  },
  {
    path: '/analyst/indicators',
    icon: BarChart2,
    label: 'Health Indicators'
  },
  {
    path: '/analyst/explore',
    icon: Search,
    label: 'Data Exploration'
  },
  {
    path: '/analyst/correlation',
    icon: LinkIcon,
    label: 'Correlation Analysis'
  },
  {
    path: '/analyst/risk-scores',
    icon: Target,
    label: 'Risk Score Review'
  },
  {
    path: '/analyst/vulnerable',
    icon: ShieldAlert,
    label: 'Vulnerable Populations'
  },
  {
    path: '/analyst/data-quality',
    icon: CheckSquare,
    label: 'Data Quality'
  },
  {
    path: '/analyst/scenarios',
    icon: FlaskConical,
    label: 'What-If Scenarios'
  },
  {
    path: '/analyst/reports',
    icon: FileText,
    label: 'Analysis Reports'
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
        className={`w-[240px] bg-epi flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
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
            const isActive =
            currentPath === item.path ||
            item.path !== '/analyst' && currentPath.startsWith(item.path);
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-colors relative ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                
                {isActive &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-epi-accent" />
                }
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-epi-accent' : ''}`} />
                
                <span className="flex-1">{item.label}</span>
              </Link>);

          })}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen w-full lg:w-auto">
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-epi-muted hover:text-epi-text"
              onClick={() => setIsMobileMenuOpen(true)}>
              
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[15px] font-bold text-epi-text hidden sm:block shrink-0">
              Public Health Analyst Dashboard
            </span>
          </div>

          <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-epi-muted" />
              <input
                type="text"
                placeholder="Search indicators, districts, analyses..."
                className="w-full h-10 pl-10 pr-4 bg-epi-bg border border-border rounded-md text-[14px] focus:outline-none focus:border-epi" />
              
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <button className="relative text-epi-muted hover:text-epi-text">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-epi-red rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>
            <span className="hidden sm:inline-flex bg-epi-amber/15 text-epi-amber border border-epi-amber/30 px-3 py-1.5 rounded-full text-[12px] font-bold">
              🟠 MODERATE RISK — National
            </span>
            <div className="flex items-center gap-2 pl-3 lg:pl-4 border-l border-border cursor-pointer hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-epi flex items-center justify-center text-white font-bold text-xs shrink-0">
                AU
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[13px] font-bold text-epi-text leading-tight">
                  Aline Uwimana
                </span>
                <span className="text-[11px] text-epi-muted leading-tight">
                  Public Health Analyst, RBC
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
        <div className="h-12 bg-epi flex items-center px-4 lg:px-8 text-white text-[13px] font-medium gap-1 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Globe className="w-4 h-4 mr-1 shrink-0" />
          <span className="font-bold">National Access — All 30 Districts</span>
          <span className="mx-2 text-white/40">|</span>
          <span>Rwanda Biomedical Centre (RBC)</span>
          <span className="mx-2 text-white/40">|</span>
          <span>Health Sector Strategic Plan + Vision 2050 Targets Active</span>
        </div>

        <main className="flex-1 p-4 lg:p-8 flex flex-col overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
            <div className="mb-8">
              <div className="text-[13px] text-epi-muted font-medium mb-1">
                AI Vital &gt; Analyst Dashboard &gt; {breadcrumb}
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