import React from 'react';
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
export function WarningOverview() {
  return (
    <WarningLayout
      title="Early Warning Overview"
      subtitle="Thursday, June 5, 2026 | Rwanda National Health Alert System | Real-time monitoring — all 30 districts"
      breadcrumb="Warning Overview">
      
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-epi-red rounded-lg p-5 shadow-card border-none flex flex-col text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-[13px] font-bold leading-tight">
              Critical Alerts (Red)
            </h3>
          </div>
          <div className="text-2xl font-bold mb-1">2</div>
          <p className="text-[11px] text-white/80 mb-2">Rusizi · Kayonza</p>
          <div className="mt-auto">
            <span className="text-[10px] font-bold bg-white text-epi-red px-2 py-0.5 rounded">
              🔴 IMMEDIATE ACTION REQUIRED
            </span>
          </div>
        </div>

        <div className="bg-[#F57C00] rounded-lg p-5 shadow-card border-none flex flex-col text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-[13px] font-bold leading-tight">
              High Alerts (Orange)
            </h3>
          </div>
          <div className="text-2xl font-bold mb-1">5</div>
          <p className="text-[11px] text-white/80 mb-2">Action needed soon</p>
          <div className="mt-auto text-[10px] font-medium leading-tight">
            Bugesera · Huye · Gicumbi · Nyamagabe · Rubavu
          </div>
        </div>

        <div className="bg-epi-amber rounded-lg p-5 shadow-card border-none flex flex-col text-epi-text">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
              <Eye className="w-4 h-4 text-epi-text" />
            </div>
            <h3 className="text-[13px] font-bold leading-tight">
              Watch Alerts (Yellow)
            </h3>
          </div>
          <div className="text-2xl font-bold mb-1">8</div>
          <p className="text-[11px] opacity-80 mb-2">Monitor closely</p>
          <div className="mt-auto text-[10px] font-bold">
            Within normal response window
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border-l-4 border-l-[#00A550] flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#00A550]" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Resolved Today
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">3</div>
          <p className="text-[11px] text-epi-muted mb-2">Alerts closed today</p>
          <div className="mt-auto text-[10px] font-medium text-epi-muted">
            ALT-089 · ALT-090 · ALT-092
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Average Response Time
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">
            4.2{' '}
            <span className="text-[14px] font-normal text-epi-muted">
              hours
            </span>
          </div>
          <p className="text-[11px] text-epi-muted mb-2">
            National average today
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#00A550] flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> 34% faster than last
              year
            </span>
            <span className="text-[10px] font-bold text-epi-amber">
              🟡 Close to 3h target
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border-l-4 border-l-epi-amber flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-amber/10 flex items-center justify-center">
              <BellOff className="w-4 h-4 text-epi-amber" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Unacknowledged
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">1</div>
          <p className="text-[11px] text-epi-muted mb-2 leading-tight">
            ALT-003 — Gicumbi DHO has not responded
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#F97316]">
              🟠 Auto-escalation in 47 min
            </span>
            <button className="text-[11px] font-bold text-epi-red hover:underline text-left">
              Escalate now →
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Alert Severity Band */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-6">
        <h2 className="text-[16px] font-bold text-epi-text mb-4">
          Active Alerts by Severity — Rwanda National View
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* RED Column */}
          <div className="bg-epi-red/5 rounded-lg p-4 border border-epi-red/20">
            <h3 className="text-[13px] font-bold text-epi-red mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-epi-red"></div>
              RED (2 alerts)
            </h3>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-epi-red text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-001 | Cholera | Rusizi
                </div>
                <div className="text-epi-muted mb-1">2 days ago</div>
                <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-epi-red text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-002 | Malaria | Kayonza
                </div>
                <div className="text-epi-muted mb-1">1 day ago</div>
                <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
              </div>
            </div>
          </div>

          {/* ORANGE Column */}
          <div className="bg-[#F97316]/5 rounded-lg p-4 border border-[#F97316]/20">
            <h3 className="text-[13px] font-bold text-[#F97316] mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
              ORANGE (5 alerts)
            </h3>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-[#F97316] text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-003 | Measles | Gicumbi
                </div>
                <div className="text-epi-muted mb-1">1 day ago</div>
                <div className="text-epi-amber font-bold">⚠️ PENDING</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-[#F97316] text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-006 | Malaria | Bugesera
                </div>
                <div className="text-epi-muted mb-1">6h ago</div>
                <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-[#F97316] text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-007 | Cholera | Huye
                </div>
                <div className="text-epi-muted mb-1">5h ago</div>
                <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-[#F97316] text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-008 | Typhoid | Nyamagabe
                </div>
                <div className="text-epi-muted mb-1">4h ago</div>
                <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-[#F97316] text-[12px]">
                <div className="font-bold text-epi-text mb-1">
                  ALT-009 | Mpox | Rubavu
                </div>
                <div className="text-epi-muted mb-1">3h ago</div>
                <div className="text-[#00A550] font-bold">Acknowledged ✅</div>
              </div>
            </div>
          </div>

          {/* YELLOW Column */}
          <div className="bg-epi-amber/5 rounded-lg p-4 border border-epi-amber/20 flex flex-col">
            <h3 className="text-[13px] font-bold text-epi-amber mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-epi-amber"></div>
              YELLOW (8 alerts)
            </h3>
            <div className="flex-1 bg-white/50 rounded border border-epi-amber/20 p-3 flex items-center justify-center text-center">
              <div className="text-[12px] text-epi-muted font-medium">
                8 compact pills (scrollable)
                <br />
                showing district, disease, time
              </div>
            </div>
          </div>

          {/* GREEN Column */}
          <div className="bg-[#00A550]/5 rounded-lg p-4 border border-[#00A550]/20 flex flex-col">
            <h3 className="text-[13px] font-bold text-[#00A550] mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00A550]"></div>
              GREEN (monitoring)
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
              <div className="text-[13px] font-bold text-epi-text">
                22 districts — no alerts active
              </div>
              <div className="text-[12px] text-epi-muted">
                Routine surveillance ongoing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Map */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-4">
            Active Alerts — Rwanda Map
          </h2>

          <div className="flex-1 bg-epi-bg rounded-lg border border-border relative min-h-[300px] flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                'radial-gradient(#104E49 1px, transparent 1px)',
                backgroundSize: '15px 15px'
              }}>
            </div>

            {/* Map representation */}
            <div className="relative w-full h-full max-w-md mx-auto">
              {/* Rusizi */}
              <div className="absolute bottom-10 left-10 flex flex-col items-center">
                <div className="w-4 h-4 bg-epi-red rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Rusizi
                </span>
                <span className="text-[10px] font-bold text-[#F97316] absolute -left-4 -top-2">
                  ⚠️
                </span>
              </div>

              {/* Rubavu */}
              <div className="absolute top-20 left-16 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Rubavu
                </span>
                <span className="text-[10px] font-bold text-[#F97316] absolute -right-4 -top-2">
                  ⚠️
                </span>
              </div>

              {/* Kayonza */}
              <div className="absolute top-32 right-10 flex flex-col items-center">
                <div className="w-4 h-4 bg-epi-red rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Kayonza
                </span>
              </div>

              {/* Bugesera */}
              <div className="absolute bottom-24 right-32 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Bugesera
                </span>
              </div>

              {/* Huye */}
              <div className="absolute bottom-16 left-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Huye
                </span>
              </div>

              {/* Nyamagabe */}
              <div className="absolute bottom-20 left-1/3 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Nyamagabe
                </span>
              </div>

              {/* Gicumbi */}
              <div className="absolute top-12 left-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
                <span className="text-[10px] font-bold mt-1 bg-white/80 px-1 rounded">
                  Gicumbi
                </span>
              </div>

              {/* Yellow pins scattered */}
              <div className="absolute top-24 left-1/3 w-3 h-3 bg-epi-amber rounded-full border-2 border-white shadow-sm"></div>
              <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-epi-amber rounded-full border-2 border-white shadow-sm"></div>
              <div className="absolute top-40 right-32 w-3 h-3 bg-epi-amber rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>

          <div className="mt-4 text-right">
            <button className="text-[13px] font-bold text-epi hover:underline flex items-center justify-end gap-1 ml-auto">
              View Full Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Panel - Gauge */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <h2 className="text-[16px] font-bold text-epi-text mb-6">
            National Response Performance
          </h2>

          <div className="flex flex-col items-center mb-8">
            <div className="text-[13px] font-bold text-epi-text text-center mb-4 max-w-[200px]">
              94% of alerts acknowledged within 4 hours
            </div>

            <div className="relative w-48 h-24 overflow-hidden mb-2">
              {/* Colored Arc: Red (<70), Amber (70-90), Green (>90) */}
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-epi-red border-l-epi-amber border-b-[#00A550] border-r-[#00A550] rotate-45"></div>

              {/* Needle pointing to 94% (green zone) */}
              <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-epi-text origin-bottom -translate-x-1/2 rotate-[70deg] rounded-t-full"></div>
              <div className="absolute bottom-[-4px] left-1/2 w-3 h-3 bg-epi-text rounded-full -translate-x-1/2"></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                  Best responding:
                </h3>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex justify-between">
                    <span className="text-epi-text">🥇 Musanze</span>
                    <span className="font-bold text-[#00A550]">avg 0.8h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-epi-text">🥈 Gasabo</span>
                    <span className="font-bold text-[#00A550]">avg 1.1h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-epi-text">🥉 Huye</span>
                    <span className="font-bold text-[#00A550]">avg 1.4h</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                  Needs improvement:
                </h3>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex justify-between">
                    <span className="text-epi-text">⚠️ Gicumbi</span>
                    <span className="font-bold text-epi-red">avg 6.8h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-epi-text">⚠️ Ngororero</span>
                    <span className="font-bold text-[#F97316]">avg 5.4h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-epi-text">⚠️ Nyaruguru</span>
                    <span className="font-bold text-[#F97316]">avg 4.9h</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WarningLayout>);

}