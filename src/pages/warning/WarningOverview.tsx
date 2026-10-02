import { Link } from 'react-router-dom';
import { WarningLayout } from '../../components/warning/WarningLayout';
import {
  Bell,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Clock,
  BellOff,
  ArrowRight,
  ArrowDownRight } from
'lucide-react';
import { sortAlerts, useApp } from '../../store/AppStore';
import { DISTRICT_PROVINCE } from '../../data/seed';
import { fmtDate, isOpenStatus, nowISO, timeAgo } from '../../lib/format';
import type { Alert } from '../../types';

// Approximate pin positions (percent) on the schematic Rwanda map
const PIN: Record<string, {left: string;top: string;}> = {
  Rusizi: { left: '12%', top: '78%' },
  Nyamasheke: { left: '14%', top: '62%' },
  Karongi: { left: '20%', top: '45%' },
  Rutsiro: { left: '22%', top: '32%' },
  Rubavu: { left: '18%', top: '18%' },
  Nyabihu: { left: '28%', top: '22%' },
  Ngororero: { left: '32%', top: '38%' },
  Musanze: { left: '38%', top: '12%' },
  Burera: { left: '48%', top: '8%' },
  Gicumbi: { left: '56%', top: '18%' },
  Rulindo: { left: '48%', top: '26%' },
  Gakenke: { left: '40%', top: '28%' },
  Nyagatare: { left: '80%', top: '10%' },
  Gatsibo: { left: '76%', top: '28%' },
  Kayonza: { left: '82%', top: '44%' },
  Rwamagana: { left: '68%', top: '46%' },
  Kirehe: { left: '86%', top: '66%' },
  Ngoma: { left: '74%', top: '64%' },
  Bugesera: { left: '62%', top: '70%' },
  Gasabo: { left: '58%', top: '38%' },
  Kicukiro: { left: '58%', top: '52%' },
  Nyarugenge: { left: '52%', top: '46%' },
  Kamonyi: { left: '46%', top: '52%' },
  Muhanga: { left: '38%', top: '48%' },
  Ruhango: { left: '40%', top: '60%' },
  Nyanza: { left: '44%', top: '68%' },
  Gisagara: { left: '50%', top: '82%' },
  Huye: { left: '42%', top: '80%' },
  Nyamagabe: { left: '30%', top: '74%' },
  Nyaruguru: { left: '34%', top: '88%' }
};

function hours(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

function AlertMini({ a }: {a: Alert;}) {
  const border =
  a.severity === 'red' ? 'border-l-epi-red' : a.severity === 'orange' ? 'border-l-[#F97316]' : 'border-l-epi-amber';
  return (
    <Link
      to={`/warning/detail?id=${a.id}`}
      className={`block bg-white p-3 rounded shadow-sm border-l-4 ${border} text-[12px] hover:shadow-md transition-shadow`}>

      <div className="font-bold text-epi-text mb-1">
        {a.id.replace('ALT-2026-', 'ALT-')} | {a.disease} | {a.district}
      </div>
      <div className="text-epi-muted mb-1">{timeAgo(a.triggeredAt)}</div>
      {a.status === 'active' ?
      <div className="text-epi-amber font-bold">⚠️ PENDING</div> :
      a.status === 'escalated' ?
      <div className="text-[#F97316] font-bold">⬆️ Escalated</div> :

      <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
      }
    </Link>);

}

export function WarningOverview() {
  const { state } = useApp();
  const open = sortAlerts(state.alerts.filter((a) => isOpenStatus(a.status)), 'recent');
  const red = open.filter((a) => a.severity === 'red');
  const orange = open.filter((a) => a.severity === 'orange');
  const yellow = open.filter((a) => a.severity === 'yellow');
  const unack = open.filter((a) => a.status === 'active');
  const today = nowISO().slice(0, 10);
  const resolvedToday = state.alerts.filter(
    (a) => (a.status === 'resolved' || a.status === 'dismissed') && a.closedAt?.startsWith(today)
  );
  const acked = state.alerts.filter((a) => a.acknowledgedAt);
  const ackHours = acked.map((a) => hours(a.triggeredAt, a.acknowledgedAt!));
  const avg = ackHours.length ? ackHours.reduce((s, h) => s + h, 0) / ackHours.length : 0;
  const within = ackHours.length ?
  Math.round(ackHours.filter((h) => h <= state.rules.autoEscalateHours).length / ackHours.length * 100) :
  0;
  const alertDistricts = new Set(open.map((a) => a.district));
  const pins = Object.keys(DISTRICT_PROVINCE).
  map((d) => {
    const sev = open.filter((a) => a.district === d).map((a) => a.severity);
    const level = sev.includes('red') ? 'red' : sev.includes('orange') ? 'orange' : sev.includes('yellow') ? 'yellow' : null;
    return { district: d, level, alert: open.find((a) => a.district === d) };
  }).
  filter((p) => p.level);

  return (
    <WarningLayout
      title="Early Warning Overview"
      subtitle={`${fmtDate(nowISO())} | Rwanda National Health Alert System | Real-time monitoring — all 30 districts`}
      breadcrumb="Warning Overview">

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <Link to="/warning/alerts" className="bg-epi-red rounded-lg p-5 shadow-card border-none flex flex-col text-white hover:opacity-95">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-[13px] font-bold leading-tight">Critical Alerts (Red)</h3>
          </div>
          <div className="text-2xl font-bold mb-1">{red.length}</div>
          <p className="text-[11px] text-white/80 mb-2">{red.map((a) => a.district).join(' · ') || 'None'}</p>
          {red.length > 0 &&
          <div className="mt-auto">
              <span className="text-[10px] font-bold bg-white text-epi-red px-2 py-0.5 rounded">
                🔴 IMMEDIATE ACTION REQUIRED
              </span>
            </div>
          }
        </Link>

        <div className="bg-[#F57C00] rounded-lg p-5 shadow-card border-none flex flex-col text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-[13px] font-bold leading-tight">High Alerts (Orange)</h3>
          </div>
          <div className="text-2xl font-bold mb-1">{orange.length}</div>
          <p className="text-[11px] text-white/80 mb-2">Action needed soon</p>
          <div className="mt-auto text-[10px] font-medium leading-tight">
            {orange.map((a) => a.district).join(' · ')}
          </div>
        </div>

        <div className="bg-epi-amber rounded-lg p-5 shadow-card border-none flex flex-col text-epi-text">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
              <Eye className="w-4 h-4 text-epi-text" />
            </div>
            <h3 className="text-[13px] font-bold leading-tight">Watch Alerts (Yellow)</h3>
          </div>
          <div className="text-2xl font-bold mb-1">{yellow.length}</div>
          <p className="text-[11px] opacity-80 mb-2">Monitor closely</p>
          <div className="mt-auto text-[10px] font-bold">Within normal response window</div>
        </div>

        <Link to="/warning/history" className="bg-white rounded-lg p-5 shadow-card border-l-4 border-l-[#00A550] flex flex-col hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#00A550]" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Resolved Today</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{resolvedToday.length}</div>
          <p className="text-[11px] text-epi-muted mb-2">Alerts closed today</p>
          <div className="mt-auto text-[10px] font-medium text-epi-muted">
            {resolvedToday.map((a) => a.id.replace('ALT-2026-', 'ALT-')).join(' · ') || '—'}
          </div>
        </Link>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Average Response Time</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">
            {avg.toFixed(1)} <span className="text-[14px] font-normal text-epi-muted">hours</span>
          </div>
          <p className="text-[11px] text-epi-muted mb-2">Alert → acknowledgement</p>
          <div className="mt-auto flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#00A550] flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> 34% faster than last year
            </span>
            <span className={`text-[10px] font-bold ${avg <= 3 ? 'text-[#00A550]' : 'text-epi-amber'}`}>
              {avg <= 3 ? '🟢 Within 3h target' : '🟡 Above 3h target'}
            </span>
          </div>
        </div>

        <Link to="/warning/escalation" className="bg-white rounded-lg p-5 shadow-card border-l-4 border-l-epi-amber flex flex-col hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-amber/10 flex items-center justify-center">
              <BellOff className="w-4 h-4 text-epi-amber" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">Unacknowledged</h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">{unack.length}</div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            {unack.slice(0, 2).map((a) => `${a.id.replace('ALT-2026-', 'ALT-')} (${a.district})`).join(', ') || 'All alerts acknowledged'}
          </p>
          {unack.length > 0 &&
          <span className="mt-auto text-[11px] font-bold text-epi-red">Open escalation manager →</span>
          }
        </Link>
      </div>

      {/* Row 2: Alert Severity Band */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-6">
        <h2 className="text-[16px] font-bold text-epi-text mb-4">
          Active Alerts by Severity — Rwanda National View
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-epi-red/5 rounded-lg p-4 border border-epi-red/20">
            <h3 className="text-[13px] font-bold text-epi-red mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-epi-red"></div>
              RED ({red.length} alerts)
            </h3>
            <div className="space-y-2">
              {red.map((a) => <AlertMini key={a.id} a={a} />)}
            </div>
          </div>

          <div className="bg-[#F97316]/5 rounded-lg p-4 border border-[#F97316]/20">
            <h3 className="text-[13px] font-bold text-[#F97316] mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
              ORANGE ({orange.length} alerts)
            </h3>
            <div className="space-y-2">
              {orange.map((a) => <AlertMini key={a.id} a={a} />)}
            </div>
          </div>

          <div className="bg-epi-amber/5 rounded-lg p-4 border border-epi-amber/20 flex flex-col">
            <h3 className="text-[13px] font-bold text-epi-amber mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-epi-amber"></div>
              YELLOW ({yellow.length} alerts)
            </h3>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
              {yellow.map((a) =>
              <Link
                key={a.id}
                to={`/warning/detail?id=${a.id}`}
                className="px-2.5 py-1 bg-white border border-epi-amber/30 rounded-full text-[11px] font-semibold text-epi-text hover:bg-epi-amber/10">

                  {a.district} · {a.disease} · {timeAgo(a.triggeredAt)}
                </Link>
              )}
            </div>
          </div>

          <div className="bg-[#00A550]/5 rounded-lg p-4 border border-[#00A550]/20 flex flex-col">
            <h3 className="text-[13px] font-bold text-[#00A550] mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00A550]"></div>
              GREEN (monitoring)
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
              <div className="text-[13px] font-bold text-epi-text">
                {30 - alertDistricts.size} districts — no alerts active
              </div>
              <div className="text-[12px] text-epi-muted">Routine surveillance ongoing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-4">Active Alerts — Rwanda Map</h2>
          <div className="flex-1 bg-epi-bg rounded-lg border border-border relative min-h-[320px] overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(#104E49 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
            </div>
            {pins.map((p) =>
            <Link
              key={p.district}
              to={`/warning/detail?id=${p.alert!.id}`}
              title={`${p.district}: ${p.alert!.disease} (${p.level})`}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
              style={PIN[p.district]}>

                <div
                className={`${p.level === 'yellow' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full border-2 border-white shadow-sm ${p.level === 'red' ? 'bg-epi-red animate-pulse' : p.level === 'orange' ? 'bg-[#F97316]' : 'bg-epi-amber'}`}>
              </div>
                {p.level !== 'yellow' &&
              <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">{p.district}</span>
              }
              </Link>
            )}
          </div>
          <div className="mt-4 text-right">
            <Link to="/geo" className="text-[13px] font-bold text-epi hover:underline inline-flex items-center gap-1">
              View Full Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">National Response Performance</h2>
          <div className="flex flex-col items-center mb-8">
            <div className="text-[13px] font-bold text-epi-text text-center mb-4 max-w-[220px]">
              {within}% of alerts acknowledged within {state.rules.autoEscalateHours} hours
            </div>
            <div className="w-full max-w-[260px] h-3 bg-epi-bg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${within >= 90 ? 'bg-[#00A550]' : within >= 70 ? 'bg-epi-amber' : 'bg-epi-red'}`}
                style={{ width: `${within}%` }} />

            </div>
            <div className="flex justify-between w-full max-w-[260px] text-[10px] text-epi-muted mt-1">
              <span>0%</span>
              <span>Target 90%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Best responding:</h3>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex justify-between"><span className="text-epi-text">🥇 Musanze</span><span className="font-bold text-[#00A550]">avg 0.8h</span></li>
                  <li className="flex justify-between"><span className="text-epi-text">🥈 Gasabo</span><span className="font-bold text-[#00A550]">avg 1.1h</span></li>
                  <li className="flex justify-between"><span className="text-epi-text">🥉 Huye</span><span className="font-bold text-[#00A550]">avg 1.4h</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Needs improvement:</h3>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex justify-between"><span className="text-epi-text">⚠️ Gicumbi</span><span className="font-bold text-epi-red">avg 6.8h</span></li>
                  <li className="flex justify-between"><span className="text-epi-text">⚠️ Ngororero</span><span className="font-bold text-[#F97316]">avg 5.4h</span></li>
                  <li className="flex justify-between"><span className="text-epi-text">⚠️ Nyaruguru</span><span className="font-bold text-[#F97316]">avg 4.9h</span></li>
                </ul>
              </div>
            </div>
            <Link to="/warning/history" className="mt-6 inline-block text-[13px] font-bold text-epi hover:underline">
              Response tracking by alert →
            </Link>
          </div>
        </div>
      </div>
    </WarningLayout>);

}
