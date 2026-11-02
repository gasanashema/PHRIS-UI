import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WarningLayout } from '../../components/warning/WarningLayout';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { sortAlerts, useApp } from '../../store/AppStore';
import { DISTRICT_PROVINCE } from '../../data/seed';
import { fmtDate, isOpenStatus, nowISO, timeAgo } from '../../lib/format';
import { SeverityBadge, StatusBadge } from '../../components/shared/Badges';
import type { Severity } from '../../types';

function hours(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

export function WarningOverview() {
  const { state } = useApp();
  const [filter, setFilter] = useState<'all' | 'red' | 'orange' | 'yellow'>('all');

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
  const within = ackHours.length
    ? Math.round((ackHours.filter((h) => h <= state.rules.autoEscalateHours).length / ackHours.length) * 100)
    : 0;

  const alertDistricts = new Set(open.map((a) => a.district));

  const filteredAlerts = open.filter((a) => (filter === 'all' ? true : a.severity === filter));

  return (
    <WarningLayout
      title="Early Warning Overview"
      subtitle={`${fmtDate(nowISO())} | Rwanda National Health Alert System | Real-time surveillance — all 30 districts`}
      breadcrumb="Warning Overview"
    >
      <div className="space-y-6">
        {/* Row 1: Minimal Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/warning/alerts"
            className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-epi-red" />
                  <span>Critical Threats</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center text-epi">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[28px] font-bold text-epi-text leading-none mb-1">
                {red.length}
              </div>
            </div>
            <div className="text-[12px] text-epi-muted pt-2 border-t border-border/60">
              {red.length > 0 ? (
                <span className="font-semibold text-epi-text">{red.map((a) => a.district).join(', ')} active</span>
              ) : (
                <span>No critical threats active</span>
              )}
            </div>
          </Link>

          <Link
            to="/warning/alerts"
            className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                  <span>High & Watch Alerts</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#F97316]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[28px] font-bold text-epi-text leading-none mb-1">
                {orange.length + yellow.length}
              </div>
            </div>
            <div className="text-[12px] text-epi-muted pt-2 border-t border-border/60">
              <span className="font-semibold text-epi-text">{orange.length}</span> high priority · <span className="font-semibold text-epi-text">{yellow.length}</span> under monitoring
            </div>
          </Link>

          <Link
            to="/warning/history"
            className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00A550]" />
                  <span>Resolved Today</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#00A550]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[28px] font-bold text-epi-text leading-none mb-1">
                {resolvedToday.length}
              </div>
            </div>
            <div className="text-[12px] text-epi-muted pt-2 border-t border-border/60">
              Closed & mitigated today
            </div>
          </Link>

          <Link
            to="/warning/escalation"
            className="bg-white p-5 rounded-lg shadow-xs border border-border flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-epi" />
                  <span>Average Response Time</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center text-epi">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-[28px] font-bold text-epi-text leading-none mb-1">
                {avg.toFixed(1)} <span className="text-[14px] font-normal text-epi-muted">hours</span>
              </div>
            </div>
            <div className="text-[12px] text-epi-muted pt-2 border-t border-border/60 flex items-center justify-between">
              <span className={within >= 85 ? 'text-[#00A550] font-semibold' : 'text-epi-amber font-semibold'}>
                {within}% within SLA
              </span>
              <span>Target &lt; 3.0h</span>
            </div>
          </Link>
        </div>

        {/* Row 2: Active Alerts Console */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-bold text-epi-text">
                Active National Health Alerts
              </h2>
              <p className="text-[12px] text-epi-muted mt-0.5">
                Surveillance signals flagged by automated predictive pipeline and clinical notification channels
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { key: 'all', label: `All Active (${open.length})` },
                  { key: 'red', label: `Critical (${red.length})`, dot: 'bg-epi-red' },
                  { key: 'orange', label: `High (${orange.length})`, dot: 'bg-[#F97316]' },
                  { key: 'yellow', label: `Watch (${yellow.length})`, dot: 'bg-yellow-500' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                    filter === tab.key
                      ? 'bg-epi text-white shadow-xs'
                      : 'bg-white border border-border text-epi-muted hover:text-epi-text hover:bg-epi-bg/40'
                  }`}
                >
                  {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-epi-muted text-[13px]">
              <p className="font-bold text-[15px] text-epi-text">No active alerts</p>
              <p className="text-[12px] mt-1 text-epi-muted">
                No alerts currently match the selected severity filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
                  <tr>
                    <th className="px-5 py-3.5">Alert ID</th>
                    <th className="px-5 py-3.5">Disease</th>
                    <th className="px-5 py-3.5">District & Sector</th>
                    <th className="px-5 py-3.5">Severity</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Probability</th>
                    <th className="px-5 py-3.5">Triggered</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAlerts.map((a) => (
                    <tr key={a.id} className="hover:bg-epi-bg/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-epi-text">
                        <Link
                          to={`/warning/detail?id=${a.id}`}
                          className="hover:text-epi hover:underline"
                        >
                          {a.id}
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-bold text-epi-text">
                        {a.disease}
                      </td>
                      <td className="px-5 py-4 text-epi-muted">
                        <span className="font-semibold text-epi-text">{a.district}</span>
                        {a.sector ? ` · ${a.sector}` : ''}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <SeverityBadge severity={a.severity} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-5 py-4 font-semibold text-epi-text">
                        {a.probability}%
                      </td>
                      <td className="px-5 py-4 text-epi-muted whitespace-nowrap">
                        {timeAgo(a.triggeredAt)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/warning/detail?id=${a.id}`}
                          className="font-bold text-[12px] text-epi hover:underline inline-flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 bg-epi-bg/30 border-t border-border flex items-center justify-between text-[12px] text-epi-muted">
            <span>
              Showing <span className="font-semibold text-epi-text">{filteredAlerts.length}</span> of{' '}
              <span className="font-semibold text-epi-text">{open.length}</span> active alerts
            </span>
            <Link
              to="/warning/alerts"
              className="font-bold text-epi hover:underline inline-flex items-center gap-1"
            >
              <span>Manage all alerts in Alerts Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Row 3: Geographic Coverage & Response SLA Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Hotspots */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-epi-text">
                  Geographic Hotspot Distribution
                </h3>
                <span className="text-[12px] font-bold text-epi-text bg-epi-bg px-2.5 py-1 rounded border border-border">
                  {alertDistricts.size} of 30 districts active
                </span>
              </div>
              <p className="text-[12px] text-epi-muted mb-4">
                Districts currently reporting anomalous disease activity requiring district health officer intervention.
              </p>

              <div className="space-y-2.5 mb-5">
                {Array.from(alertDistricts).map((d) => {
                  const districtAlerts = open.filter((a) => a.district === d);
                  const highestRisk: Severity = districtAlerts.some((a) => a.severity === 'red')
                    ? 'red'
                    : districtAlerts.some((a) => a.severity === 'orange')
                    ? 'orange'
                    : 'yellow';
                  const diseases = Array.from(new Set(districtAlerts.map((a) => a.disease))).join(', ');
                  return (
                    <div
                      key={d}
                      className="p-3 rounded-lg border border-border flex items-center justify-between bg-epi-bg/20"
                    >
                      <div className="flex items-center gap-2.5">
                        <SeverityBadge severity={highestRisk} />
                        <div>
                          <div className="font-bold text-epi-text text-[13px]">{d} District</div>
                          <div className="text-[11px] text-epi-muted">{diseases}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-semibold text-epi-text">
                          {districtAlerts.length} alert{districtAlerts.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-[12px]">
              <span className="text-epi-muted">
                {30 - alertDistricts.size} districts under normal baseline surveillance
              </span>
              <Link
                to="/geo"
                className="font-bold text-epi hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Response SLA & Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-epi-text">
                  National Response SLA Compliance
                </h3>
                <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Target &lt; {state.rules.autoEscalateHours}h
                </span>
              </div>
              <p className="text-[12px] text-epi-muted mb-4">
                Percentage of alerts triaged and acknowledged within the standard response protocol window.
              </p>

              {/* SLA Bar */}
              <div className="p-4 bg-epi-bg/30 rounded-lg border border-border mb-5">
                <div className="flex items-center justify-between text-[13px] font-bold text-epi-text mb-2">
                  <span>SLA Compliance Rate</span>
                  <span className={within >= 85 ? 'text-[#00A550]' : 'text-epi-amber'}>
                    {within}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-border mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      within >= 85 ? 'bg-[#00A550]' : within >= 70 ? 'bg-epi-amber' : 'bg-epi-red'
                    }`}
                    style={{ width: `${within}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-epi-muted font-medium">
                  <span>0%</span>
                  <span>Minimum Standard: 85%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* District benchmarks */}
              <div className="grid grid-cols-2 gap-4 text-[12px]">
                <div className="p-3 rounded-lg border border-border bg-white">
                  <div className="font-bold text-epi-muted uppercase tracking-wider text-[10px] mb-2">
                    Leading Response
                  </div>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between">
                      <span className="text-epi-text">Musanze</span>
                      <span className="font-bold text-[#00A550]">0.8h</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-epi-text">Gasabo</span>
                      <span className="font-bold text-[#00A550]">1.1h</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-epi-text">Huye</span>
                      <span className="font-bold text-[#00A550]">1.4h</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border bg-white">
                  <div className="font-bold text-epi-muted uppercase tracking-wider text-[10px] mb-2">
                    Escalation Watch
                  </div>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between">
                      <span className="text-epi-text">Gicumbi</span>
                      <span className="font-bold text-epi-red">6.8h</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-epi-text">Ngororero</span>
                      <span className="font-bold text-[#F97316]">5.4h</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-epi-text">Nyaruguru</span>
                      <span className="font-bold text-[#F97316]">4.9h</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-[12px]">
              <span className="text-epi-muted">
                {unack.length} unacknowledged alerts pending
              </span>
              <Link
                to="/warning/escalation"
                className="font-bold text-epi hover:underline inline-flex items-center gap-1"
              >
                <span>Escalation Protocols</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </WarningLayout>
  );
}
