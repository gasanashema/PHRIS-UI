import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Database,
  Settings,
  ClipboardList,
  Megaphone,
  HardDrive } from
'lucide-react';
import { ModuleShell } from '../shared/ModuleShell';
import { useApp } from '../../store/AppStore';
interface AdminLayoutProps {
  children: React.ReactNode;
}
export function AdminLayout({ children }: AdminLayoutProps) {
  const { state } = useApp();
  const pending = state.users.filter((u) => u.status === 'Pending Approval').length;
  const flags = state.activity.filter((a) => a.flagged).length;
  return (
    <ModuleShell
      logo="admin"
      fallbackRole="admin"
      homePath="/admin"
      headerTitle="Admin Control Panel"
      breadcrumbPrefix="Admin Panel"
      pageHeading={false}
      footer={false}
      searchPlaceholder="Search users by name or email..."
      searchTarget="/admin/users"
      nav={[
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard Overview' },
      { path: '/admin/users', icon: Users, label: 'User Management', badge: pending },
      { path: '/admin/roles', icon: ShieldCheck, label: 'Roles & Permissions' },
      { path: '/admin/data-sources', icon: Database, label: 'Data Sources' },
      { path: '/admin/system-config', icon: Settings, label: 'System Configuration' },
      { path: '/admin/audit', icon: ClipboardList, label: 'Audit Trail', badge: flags },
      { path: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
      { path: '/admin/backup', icon: HardDrive, label: 'Backup & Data' }]
      }>

      {children}
    </ModuleShell>);

}
