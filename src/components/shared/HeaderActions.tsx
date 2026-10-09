import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  LogOut,
  UserCircle,
  RotateCcw,
  Users,
  Check,
  Plug,
  Cpu,
  BrainCircuit,
  Siren,
  Globe2,
  Info,
  LayoutDashboard } from
'lucide-react';
import type { Role } from '../../types';
import { notificationsFor, useApp, useCurrentUser } from '../../store/AppStore';
import { PERSONAS, ROLE_HOME } from '../../data/seed';
import { SEVERITY_META, timeAgo } from '../../lib/format';

function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

const MODULES = [
{ key: 'integration', path: '/integration', label: 'Data Integration', desc: 'Sources, sync & uploads', icon: Plug },
{ key: 'processing', path: '/processing', label: 'Data Processing', desc: 'Cleaning & feature pipeline', icon: Cpu },
{ key: 'prediction', path: '/prediction', label: 'AI Risk Prediction', desc: 'Run & review predictions', icon: BrainCircuit },
{ key: 'warning', path: '/warning', label: 'Early Warning', desc: 'National alert management', icon: Siren },
{ key: 'geo', path: '/geo', label: 'Geographic Intelligence', desc: 'Maps & spatial risk', icon: Globe2 }] as
const;

// Which platform modules each role can open from the module switcher.
const MODULE_ACCESS: Record<Role, string[]> = {
  admin: ['integration', 'processing', 'prediction', 'warning', 'geo'],
  dho: ['prediction', 'warning', 'geo'],
  epi: ['prediction', 'warning', 'geo', 'processing'],
  analyst: ['processing', 'prediction', 'warning', 'geo'],
  integration: ['integration', 'processing', 'prediction']
};

const ROLE_ORDER: Role[] = ['dho', 'epi', 'analyst', 'integration', 'admin'];

interface HeaderActionsProps {
  /** Persona used if the screen is opened directly without signing in. */
  fallbackRole: Role;
}

/**
 * Right-hand side of every dashboard header: live notification bell, module
 * switcher and user menu (profile, switch demo account, reset, log out).
 */
export function HeaderActions({ fallbackRole }: HeaderActionsProps) {
  const { state, actions } = useApp();
  const user = useCurrentUser(fallbackRole);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<null | 'bell' | 'modules' | 'user'>(null);
  const close = () => setOpenMenu(null);
  const ref = useOutsideClose(openMenu !== null, close);

  const notes = notificationsFor(state, user);
  const unread = notes.filter((n) => !n.read).length;
  const allowed = MODULES.filter((m) => MODULE_ACCESS[user.role].includes(m.key));

  const openNotification = (id: string, link?: string) => {
    actions.markNotificationRead(id);
    close();
    if (link) navigate(link);
  };

  const switchRole = (role: Role) => {
    actions.login(role);
    close();
    navigate(ROLE_HOME[role]);
  };

  return (
    <div ref={ref} className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
      {/* Module switcher */}
      <button
        onClick={() => setOpenMenu(openMenu === 'modules' ? null : 'modules')}
        aria-label="Open platform modules"
        title="Platform modules"
        className={`p-1.5 rounded-md transition-colors ${openMenu === 'modules' ? 'bg-admin-bg text-admin' : 'text-admin-muted hover:text-admin-text hover:bg-admin-bg'}`}>

        <LayoutGrid className="w-5 h-5" />
      </button>

      {/* Notification bell */}
      <button
        onClick={() => setOpenMenu(openMenu === 'bell' ? null : 'bell')}
        aria-label={`Notifications (${unread} unread)`}
        className={`relative p-1.5 rounded-md transition-colors ${openMenu === 'bell' ? 'bg-admin-bg text-admin' : 'text-admin-muted hover:text-admin-text hover:bg-admin-bg'}`}>

        <Bell className="w-5 h-5" />
        {unread > 0 &&
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-admin-red rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        }
      </button>

      {/* User chip */}
      <button
        onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}
        className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border hover:opacity-80">

        <div className="w-8 h-8 rounded-full bg-admin flex items-center justify-center text-white font-bold text-xs shrink-0">
          {user.initials}
        </div>
        <div className="hidden lg:flex flex-col items-start">
          <span className="text-[13px] font-bold text-admin-text leading-tight">
            {user.name}
          </span>
          <span className="text-[11px] text-admin-muted leading-tight">
            {user.roleLabel}
            {user.district !== 'National' ? ` · ${user.district}` : ''}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-admin-muted hidden lg:block" />
      </button>

      {/* ---- Dropdowns ---- */}
      {openMenu === 'bell' &&
      <div className="absolute right-0 top-12 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-border rounded-lg shadow-floating z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="text-[14px] font-bold text-admin-text">
              Notifications{' '}
              <span className="text-admin-muted font-medium">({unread} unread)</span>
            </div>
            {unread > 0 &&
          <button
            onClick={() => actions.markAllNotificationsRead()}
            className="text-[12px] font-bold text-admin hover:underline flex items-center gap-1">

                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
          }
          </div>
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border">
            {notes.length === 0 &&
          <div className="p-6 text-center text-[13px] text-admin-muted">
                You're all caught up.
              </div>
          }
            {notes.slice(0, 8).map((n) =>
          <button
            key={n.id}
            onClick={() => openNotification(n.id, n.link)}
            className={`w-full text-left px-4 py-3 hover:bg-admin-bg/60 transition-colors flex gap-3 ${n.read ? '' : 'bg-admin/5'}`}>

                <span className="shrink-0 mt-0.5">
                  {n.severity === 'info' ? (
                    <Info className="w-4 h-4 text-admin-info" />
                  ) : (
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        n.severity === 'red'
                          ? 'bg-admin-red'
                          : n.severity === 'orange'
                          ? 'bg-[#F97316]'
                          : n.severity === 'yellow'
                          ? 'bg-yellow-500'
                          : 'bg-admin-accent'
                      }`}
                    />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-[13px] leading-snug ${n.read ? 'text-admin-text' : 'font-bold text-admin-text'}`}>
                    {n.title}
                  </span>
                  <span className="block text-[12px] text-admin-muted line-clamp-2 mt-0.5">
                    {n.body}
                  </span>
                  <span className="block text-[11px] text-admin-muted mt-1">
                    {timeAgo(n.at)}
                  </span>
                </span>
                {!n.read &&
            <span className="w-2 h-2 rounded-full bg-admin-red shrink-0 mt-1.5" />
            }
              </button>
          )}
          </div>
          {user.role === 'dho' &&
        <Link
          to="/dho/notifications"
          onClick={close}
          className="block text-center px-4 py-2.5 border-t border-border text-[13px] font-bold text-admin hover:bg-admin-bg">

              View all notifications →
            </Link>
        }
        </div>
      }

      {openMenu === 'modules' &&
      <div className="absolute right-0 top-12 w-[320px] max-w-[calc(100vw-2rem)] bg-white border border-border rounded-lg shadow-floating z-50 p-2">
          <Link
          to={ROLE_HOME[user.role]}
          onClick={close}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-admin-bg">

            <LayoutDashboard className="w-5 h-5 text-admin" />
            <span>
              <span className="block text-[13px] font-bold text-admin-text">
                My dashboard
              </span>
              <span className="block text-[11px] text-admin-muted">
                {user.roleLabel}
              </span>
            </span>
          </Link>
          <div className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-admin-muted">
            AI Vital platform modules
          </div>
          {allowed.map((m) =>
        <Link
          key={m.key}
          to={m.path}
          onClick={close}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-admin-bg">

              <m.icon className="w-5 h-5 text-admin-muted" />
              <span>
                <span className="block text-[13px] font-semibold text-admin-text">
                  {m.label}
                </span>
                <span className="block text-[11px] text-admin-muted">{m.desc}</span>
              </span>
            </Link>
        )}
        </div>
      }

      {openMenu === 'user' &&
      <div className="absolute right-0 top-12 w-[280px] max-w-[calc(100vw-2rem)] bg-white border border-border rounded-lg shadow-floating z-50 py-2">
          <div className="px-4 py-2 border-b border-border mb-1">
            <div className="text-[13px] font-bold text-admin-text">{user.name}</div>
            <div className="text-[12px] text-admin-muted">{user.email}</div>
          </div>
          <Link
          to="/profile"
          onClick={close}
          className="flex items-center gap-2 px-4 py-2 text-[13px] text-admin-text hover:bg-admin-bg">

            <UserCircle className="w-4 h-4" /> Profile & settings
          </Link>
          <div className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-admin-muted flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Switch demo account
          </div>
          {ROLE_ORDER.map((r) =>
        <button
          key={r}
          onClick={() => switchRole(r)}
          className="w-full flex items-center justify-between px-4 py-1.5 text-[13px] text-admin-text hover:bg-admin-bg text-left">

              <span>
                {PERSONAS[r].roleLabel}
                <span className="text-admin-muted"> — {PERSONAS[r].name.replace('Dr. ', '')}</span>
              </span>
              {user.role === r && <Check className="w-4 h-4 text-admin-accent" />}
            </button>
        )}
          <div className="h-px bg-border my-1" />
          <button
          onClick={() => {
            actions.resetDemo();
            close();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-admin-text hover:bg-admin-bg text-left">

            <RotateCcw className="w-4 h-4" /> Reset demo data
          </button>
          <button
          onClick={() => {
            actions.logout();
            close();
            navigate('/login', { replace: true });
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-[13px] text-admin-red hover:bg-admin-red/5 text-left">

            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      }
    </div>);

}
