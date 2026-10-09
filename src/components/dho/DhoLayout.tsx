import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  Bell,
  Hospital,
  TrendingUp,
  Users,
  Target,
  FileText,
  BellRing,
  FileSearch,
  Search,
  MapPin,
  Menu,
  X } from
'lucide-react';
import { AdminLogo } from '../admin/AdminLogo';
import { HeaderActions } from '../shared/HeaderActions';
import { districtLevel, notificationsFor, useApp, useCurrentUser } from '../../store/AppStore';
import { SEVERITY_META, isOpenStatus } from '../../lib/format';
interface DhoLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  children: React.ReactNode;
}
export function DhoLayout({
  title,
  subtitle,
  breadcrumb,
  children
}: DhoLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { state } = useApp();
  const user = useCurrentUser('dho');
  const district = user.role === 'dho' ? user.district : 'Huye';

  const openAlerts = state.alerts.filter(
    (a) => a.district === district && isOpenStatus(a.status)
  ).length;
  const unread = notificationsFor(state, user).filter((n) => !n.read).length;
  const openInv = state.investigations.filter(
    (i) => i.district === district && i.status !== 'closed'
  ).length;
  const level = districtLevel(state, district);
  const levelMeta = SEVERITY_META[level];

  const navItems: {path: string;icon: typeof Home;label: string;badge?: number;}[] = [
  {
    path: '/dho',
    icon: Home,
    label: 'District Overview'
  },
  {
    path: '/dho/risk-map',
    icon: Map,
    label: 'Risk Map'
  },
  {
    path: '/dho/alerts',
    icon: Bell,
    label: 'Active Alerts',
    badge: openAlerts
  },
  {
    path: '/dho/investigations',
    icon: FileSearch,
    label: 'Investigations',
    badge: openInv
  },
  {
    path: '/dho/facilities',
    icon: Hospital,
    label: 'Health Facilities'
  },
  {
    path: '/dho/trends',
    icon: TrendingUp,
    label: 'Disease Trends'
  },
  {
    path: '/dho/chw-reports',
    icon: Users,
    label: 'CHW Reports'
  },
  {
    path: '/dho/interventions',
    icon: Target,
    label: 'Interventions'
  },
  {
    path: '/dho/reports',
    icon: FileText,
    label: 'Reports'
  },
  {
    path: '/dho/notifications',
    icon: BellRing,
    label: 'Notifications',
    badge: unread
  }];

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/dho/alerts?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-admin-bg font-sans text-admin-text flex">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`w-[240px] bg-admin flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <AdminLogo variant="light" />
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
            item.path !== '/dho' && currentPath.startsWith(item.path);
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-colors relative ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>

                {isActive &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-accent" />
                }
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-admin-accent' : ''}`} />

                <span className="flex-1">{item.label}</span>
                {!!item.badge &&
                <span className="bg-admin-red text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                    {item.badge}
                  </span>
                }
              </Link>);

          })}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen w-full lg:w-auto min-w-0">
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="lg:hidden text-admin-muted hover:text-admin-text"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}>

              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[15px] font-bold text-admin-text hidden sm:block truncate">
              {district} District — Health Officer Dashboard
            </span>
          </div>

          <form onSubmit={onSearch} className="flex-1 max-w-md mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search alerts by disease, sector or ID..."
                className="w-full h-10 pl-10 pr-4 bg-admin-bg border border-border rounded-md text-[14px] focus:outline-none focus:border-admin" />

            </div>
          </form>

          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <Link
              to="/dho/alerts"
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border ${levelMeta.soft} ${levelMeta.border}`}>
              <span
                className={`w-2 h-2 rounded-full ${
                  level === 'red'
                    ? 'bg-admin-red'
                    : level === 'orange'
                    ? 'bg-[#F97316]'
                    : level === 'yellow'
                    ? 'bg-yellow-500'
                    : 'bg-admin-accent'
                }`}
              />
              {levelMeta.label} {level === 'green' ? 'STATUS' : 'ALERT'} — {district}
            </Link>
            <HeaderActions fallbackRole="dho" />
          </div>
        </header>

        {/* District Identity Banner */}
        <div className="h-12 bg-admin flex items-center px-4 lg:px-8 text-white text-[13px] font-medium gap-1 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <MapPin className="w-4 h-4 mr-1 shrink-0" />
          <span className="font-bold">{district} District — Southern Province</span>
          <span className="mx-2 text-white/40">|</span>
          <span>Population: 321,347</span>
          <span className="mx-2 text-white/40">|</span>
          <span>15 Health Facilities</span>
          <span className="mx-2 text-white/40">|</span>
          <span>Nearest Referral: CHUB (Butare University Hospital)</span>
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-8">
              <div className="text-[13px] text-admin-muted font-medium mb-1">
                {district} District &gt; {breadcrumb}
              </div>
              <h1 className="text-[24px] font-bold text-admin-text">{title}</h1>
              {subtitle &&
              <p className="text-[14px] text-admin-muted">{subtitle}</p>
              }
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>);

}
