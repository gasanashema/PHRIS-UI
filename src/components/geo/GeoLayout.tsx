import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Map as MapIcon,
  Flame,
  Building2,
  Clock,
  PlaySquare,
  CloudRain,
  Globe,
  ShieldAlert,
  Download,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X } from
'lucide-react';
import { EpiLogo } from '../epi/EpiLogo';
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
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    path: '/geo',
    icon: MapIcon,
    label: 'Main Map',
    exact: true
  },
  {
    path: '/geo/heat',
    icon: Flame,
    label: 'Disease Heat Map'
  },
  {
    path: '/geo/facilities',
    icon: Building2,
    label: 'Health Facilities'
  },
  {
    path: '/geo/access',
    icon: Clock,
    label: 'Accessibility Map'
  },
  {
    path: '/geo/animation',
    icon: PlaySquare,
    label: 'Spread Animation'
  },
  {
    path: '/geo/environment',
    icon: CloudRain,
    label: 'Environmental Overlays'
  },
  {
    path: '/geo/cross-border',
    icon: Globe,
    label: 'Cross-Border Map'
  },
  {
    path: '/geo/vulnerability',
    icon: ShieldAlert,
    label: 'Vulnerability Map'
  },
  {
    path: '/geo/export',
    icon: Download,
    label: 'Export & Reports'
  }];

  return (
    <div className="min-h-screen bg-epi-bg font-sans text-epi-text flex overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar - Collapsed by default, expands on hover */}
      <aside
        className={`bg-[#104E49] flex flex-col fixed inset-y-0 left-0 z-50 transform transition-all duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full lg:w-[56px]'} ${isSidebarExpanded && !isMobileMenuOpen ? 'lg:w-[240px]' : ''}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}>
        
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 overflow-hidden whitespace-nowrap">
          {isSidebarExpanded || isMobileMenuOpen ?
          <EpiLogo variant="light" /> :

          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-white shrink-0">
              AI
            </div>
          }
          <button
            className="lg:hidden text-white/70 hover:text-white shrink-0 ml-2"
            onClick={() => setIsMobileMenuOpen(false)}>
            
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item, i) => {
            const isActive = item.exact ?
            currentPath === item.path :
            currentPath.startsWith(item.path) && item.path !== '/geo';
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 text-[14px] font-medium transition-colors relative ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                title={!isSidebarExpanded ? item.label : undefined}>
                
                {isActive &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A550]" />
                }
                <item.icon
                  className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : ''}`} />
                
                <span
                  className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarExpanded || isMobileMenuOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
                  
                  {item.label}
                </span>
              </Link>);

          })}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-[56px] flex flex-col min-h-screen relative w-full lg:w-auto">
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="lg:hidden text-epi-muted hover:text-epi-text"
              onClick={() => setIsMobileMenuOpen(true)}>
              
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[15px] font-bold text-epi-text hidden sm:block">
              Geographic Health Intelligence
            </span>
          </div>

          <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-epi-muted" />
              <input
                type="text"
                placeholder="Search district, sector, facility..."
                className="w-full h-10 pl-10 pr-4 bg-epi-bg border border-border rounded-md text-[14px] focus:outline-none focus:border-epi" />
              
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <button className="relative text-epi-muted hover:text-epi-text">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-epi-red rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                7
              </span>
            </button>
            <span className="hidden sm:inline-flex bg-epi/10 border border-epi/20 px-3 py-1.5 rounded-full text-[12px] font-bold text-epi flex items-center gap-1.5">
              🗺️ 30 Districts Active
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

        <main className="flex-1 relative flex flex-col overflow-x-hidden">
          {!hideHeader &&
          <div className="px-4 lg:px-8 pt-6 pb-2 bg-white border-b border-border z-10 relative">
              <div className="text-[13px] text-epi-muted font-medium mb-1">
                AI Vital &gt; Geographic Intelligence &gt; {breadcrumb}
              </div>
              {title &&
            <h1 className="text-[24px] font-bold text-epi-text">{title}</h1>
            }
              {subtitle &&
            <p className="text-[14px] text-epi-muted">{subtitle}</p>
            }
            </div>
          }
          <div className="flex-1 relative">{children}</div>
        </main>

        {!hideHeader &&
        <footer className="py-4 text-center text-[12px] text-epi-muted border-t border-border bg-white z-10 relative">
            AI Vital | Rwanda Biomedical Centre | Ministry of Health Rwanda |
            AUCA June 2026
          </footer>
        }
      </div>
    </div>);

}