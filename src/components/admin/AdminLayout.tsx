import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Database,
  Settings,
  ClipboardList,
  Megaphone,
  HardDrive,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X } from
'lucide-react';
import { AdminLogo } from './AdminLogo';
interface AdminLayoutProps {
  children: React.ReactNode;
}
export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    path: '/admin',
    icon: LayoutDashboard,
    label: 'Dashboard Overview'
  },
  {
    path: '/admin/users',
    icon: Users,
    label: 'User Management'
  },
  {
    path: '/admin/roles',
    icon: ShieldCheck,
    label: 'Roles & Permissions'
  },
  {
    path: '/admin/data-sources',
    icon: Database,
    label: 'Data Sources'
  },
  {
    path: '/admin/system-config',
    icon: Settings,
    label: 'System Configuration'
  },
  {
    path: '/admin/audit',
    icon: ClipboardList,
    label: 'Audit Trail'
  },
  {
    path: '/admin/announcements',
    icon: Megaphone,
    label: 'Announcements'
  },
  {
    path: '/admin/backup',
    icon: HardDrive,
    label: 'Backup & Data'
  }];

  return (
    <div className="min-h-screen bg-admin-bg font-sans text-admin-text flex">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Left Sidebar */}
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

        <nav className="flex-1 py-6 space-y-1">
          {navItems.map((item, i) => {
            const isActive =
            currentPath === item.path ||
            item.path !== '/admin' && currentPath.startsWith(item.path);
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-[14px] font-medium transition-colors relative ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                
                {isActive &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-accent" />
                }
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-admin-accent' : ''}`} />
                
                {item.label}
              </Link>);

          })}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen w-full lg:w-auto">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-admin-muted hover:text-admin-text"
              onClick={() => setIsMobileMenuOpen(true)}>
              
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[15px] font-bold text-admin-text hidden sm:block">
              Admin Control Panel
            </span>
          </div>

          <div className="flex-1 max-w-xl mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
              <input
                type="text"
                placeholder="Search users, alerts, modules..."
                className="w-full h-10 pl-10 pr-4 bg-admin-bg border border-border rounded-md text-[14px] focus:outline-none focus:ring-1 focus:ring-admin focus:border-admin" />
              
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative text-admin-muted hover:text-admin-text transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-admin-red rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 lg:gap-3 pl-4 lg:pl-6 border-l border-border cursor-pointer hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-admin flex items-center justify-center text-white font-bold text-xs shrink-0">
                AD
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[13px] font-bold text-admin-text leading-none">
                  System Administrator
                </span>
                <span className="text-[11px] font-medium text-admin-muted mt-1">
                  RBC
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-admin-muted ml-1 hidden sm:block" />
            </div>
            <Link
              to="/login"
              replace
              aria-label="Log out"
              title="Log out"
              className="text-admin-muted hover:text-admin-red transition-colors">
              
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>);

}