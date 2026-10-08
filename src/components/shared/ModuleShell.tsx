import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import type { Role } from '../../types';
import { EpiLogo } from '../epi/EpiLogo';
import { AdminLogo } from '../admin/AdminLogo';
import { HeaderActions } from './HeaderActions';

export interface ShellNavItem {
  path: string;
  icon: React.ComponentType<{className?: string;}>;
  label: string;
  badge?: number;
  exact?: boolean;
}

interface ModuleShellProps {
  nav: ShellNavItem[];
  homePath: string;
  headerTitle: string;
  breadcrumbPrefix: string;
  breadcrumb?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  banner?: React.ReactNode;
  chip?: React.ReactNode;
  fallbackRole: Role;
  searchPlaceholder: string;
  /** Page the header search navigates to, receiving `?q=` */
  searchTarget: string;
  footer?: boolean;
  logo?: 'epi' | 'admin';
  /** Geo: icon-only sidebar that expands on hover, full-bleed content */
  collapsible?: boolean;
  hideHeader?: boolean;
  /** Admin pages render their own page heading */
  pageHeading?: boolean;
}

/**
 * Shared dashboard chrome (sidebar, header, identity banner, footer) used by
 * every role and module layout. Each layout keeps its own nav, banner and
 * header chip; this component provides consistent behaviour: live
 * notifications, module switcher, user menu, working search and responsive
 * sidebar.
 */
export function ModuleShell({
  nav,
  homePath,
  headerTitle,
  breadcrumbPrefix,
  breadcrumb,
  title,
  subtitle,
  children,
  banner,
  chip,
  fallbackRole,
  searchPlaceholder,
  searchTarget,
  footer = true,
  logo = 'epi',
  collapsible = false,
  hideHeader = false,
  pageHeading = true
}: ModuleShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const showLabels = !collapsible || isExpanded || isMobileMenuOpen;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`${searchTarget}?q=${encodeURIComponent(q)}`);
  };

  const Logo = logo === 'admin' ? AdminLogo : EpiLogo;

  return (
    <div className={`min-h-screen bg-epi-bg font-sans text-epi-text flex ${collapsible ? 'overflow-hidden' : ''}`}>
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      <aside
        onMouseEnter={() => collapsible && setIsExpanded(true)}
        onMouseLeave={() => collapsible && setIsExpanded(false)}
        className={`bg-[#104E49] flex flex-col fixed inset-y-0 left-0 z-50 transform transition-all duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full w-[240px]'} ${collapsible && !isMobileMenuOpen ? isExpanded ? 'lg:w-[240px]' : 'lg:w-[56px]' : ''}`}>

        <div className={`h-16 flex items-center justify-between ${collapsible ? 'px-4' : 'px-6'} border-b border-white/10 overflow-hidden whitespace-nowrap`}>
          {showLabels ?
          <Logo variant="light" /> :

          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-white shrink-0">
              AI
            </div>
          }
          <button
            className="lg:hidden text-white/70 hover:text-white shrink-0 ml-2"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}>

            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          {nav.map((item) => {
            const isActive = item.exact ?
            currentPath === item.path :
            currentPath === item.path ||
            item.path !== homePath && currentPath.startsWith(item.path);
            return (
              <Link
                key={item.path + item.label}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                title={!showLabels ? item.label : undefined}
                className={`flex items-center ${collapsible ? 'gap-4 px-4' : 'gap-3 px-6'} py-3 text-[14px] font-medium transition-colors relative ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>

                {isActive &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A550]" />
                }
                <item.icon className={`${collapsible ? 'w-6 h-6' : 'w-5 h-5'} shrink-0 ${isActive ? 'text-[#00A550]' : ''}`} />
                <span
                  className={`flex-1 whitespace-nowrap transition-opacity duration-300 ${showLabels ? 'opacity-100' : 'opacity-0'}`}>

                  {item.label}
                </span>
                {!!item.badge && showLabels &&
                <span className="bg-epi-red text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                }
              </Link>);

          })}
        </nav>
      </aside>

      <div className={`flex-1 ${collapsible ? 'lg:ml-[56px] relative' : 'lg:ml-[240px]'} flex flex-col min-h-screen w-full lg:w-auto min-w-0`}>
        <header className="h-16 bg-white border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="lg:hidden text-epi-muted hover:text-epi-text"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}>

              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[15px] font-bold text-epi-text hidden sm:block truncate">
              {headerTitle}
            </span>
          </div>

          <form onSubmit={onSearch} className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-epi-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 bg-epi-bg border border-border rounded-md text-[14px] focus:outline-none focus:border-epi" />

            </div>
          </form>

          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            {chip && <div className="hidden xl:block">{chip}</div>}
            <HeaderActions fallbackRole={fallbackRole} />
          </div>
        </header>

        {banner}

        {collapsible ?
        <main className="flex-1 relative flex flex-col overflow-x-hidden">
            {!hideHeader &&
          <div className="px-4 lg:px-8 pt-6 pb-2 bg-white border-b border-border z-10 relative">
                <div className="text-[13px] text-epi-muted font-medium mb-1">
                  {breadcrumbPrefix} &gt; {breadcrumb}
                </div>
                {title && <h1 className="text-[24px] font-bold text-epi-text">{title}</h1>}
                {subtitle && <p className="text-[14px] text-epi-muted">{subtitle}</p>}
              </div>
          }
            <div className="flex-1 relative">{children}</div>
          </main> :

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto">
              {pageHeading &&
            <div className="mb-8">
                  <div className="text-[13px] text-epi-muted font-medium mb-1">
                    {breadcrumbPrefix} &gt; {breadcrumb}
                  </div>
                  {title && <h1 className="text-[24px] font-bold text-epi-text">{title}</h1>}
                  {subtitle && <p className="text-[14px] text-epi-muted">{subtitle}</p>}
                </div>
            }
              {children}
            </div>
          </main>
        }

        {footer && !hideHeader &&
        <footer className="py-6 text-center text-[12px] text-epi-muted border-t border-border mt-auto bg-white/40">
            AI Vital | Rwanda Biomedical Centre | Ministry of Health Rwanda | AUCA June 2026
          </footer>
        }
      </div>
    </div>);

}

/** Standard dark identity strip shown under the header. */
export function IdentityBanner({
  children,
  tone = 'default'



}: {children: React.ReactNode;tone?: 'default' | 'danger' | 'calm';}) {
  const bg =
  tone === 'danger' ?
  'bg-gradient-to-r from-[#B71C1C] to-[#D32F2F]' :
  tone === 'calm' ?
  'bg-gradient-to-r from-[#104E49] to-[#0B3A36]' :
  'bg-epi';
  return (
    <div
      className={`h-12 ${bg} flex items-center px-4 lg:px-8 text-white text-[13px] font-medium gap-1 overflow-x-auto whitespace-nowrap hide-scrollbar shadow-sm`}>

      {children}
    </div>);

}

export function Sep() {
  return <span className="mx-2 text-white/40">|</span>;
}
