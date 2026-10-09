import { useState } from 'react';
import { WarningLayout } from '../../components/warning/WarningLayout';
import { useApp } from '../../store/AppStore';
import { isOpenStatus } from '../../lib/format';
import { Check, X } from 'lucide-react';
export function WarningDelivery() {
  const { state, actions } = useApp();
  const [retry, setRetry] = useState<'idle' | 'sending' | 'delivered'>('idle');
  const gicumbi = state.alerts.find((a) => a.id === 'ALT-2026-003');
  const canEscalate = !!gicumbi && isOpenStatus(gicumbi.status) && gicumbi.status !== 'escalated';
  return (
    <WarningLayout
      title="Notification Delivery Tracking"
      subtitle="Real-time delivery status for all alert notifications — email and SMS via MTN/Airtel Rwanda"
      breadcrumb="Notification Delivery">
      
      {/* Top Summary Strip */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit">
        <span className="text-epi-text">
          Total notifications sent today: 47
        </span>
        <span className="text-border">|</span>
        <span className="text-epi-text">
          Email Email: 32 sent, 31 delivered (97%)
        </span>
        <span className="text-border">|</span>
        <span className="text-epi-text">
          SMS SMS: 15 sent, 14 delivered (93%)
        </span>
        <span className="text-border">|</span>
        <span className="text-epi-red flex items-center gap-1.5"><X className="w-4 h-4" /> Failed: 2 (being retried)</span>
      </div>

      {/* Failed Delivery Action Panel */}
      <div className="bg-epi-amber/10 border-2 border-epi-amber rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm mb-8">
        <div className="flex-1">
          <h3 className="text-[16px] font-bold text-epi-text mb-2">
            SMS SMS delivery failed for Alice Niyonzima (Gicumbi DHO) — 2
            attempts failed.
          </h3>
          <div className="text-[14px] text-epi-text mb-1">
            Alternate number on file:{' '}
            <span className="font-bold">+250 788 300 401</span>
          </div>
          <div className="text-[13px] text-epi-muted">
            Network: Airtel Rwanda (Primary: MTN Rwanda — unreachable)
          </div>
        </div>
        <div className="flex flex-col gap-3 shrink-0 w-full md:w-64">
          <button
            disabled={retry !== 'idle'}
            onClick={() => {
              setRetry('sending');
              window.setTimeout(() => {
                setRetry('delivered');
                if (gicumbi) actions.addAlertNote(gicumbi.id, 'Alert SMS re-sent via Airtel (+250 788 300 401) — delivered to Alice Niyonzima (simulated).');
              }, 1500);
            }}
            className="w-full py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-70 transition-colors shadow-sm flex items-center justify-center gap-1.5">
            {retry === 'idle' ? 'Retry via Airtel Number' : retry === 'sending' ? 'Sending via Airtel…' : <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Delivered via Airtel</span>}
          </button>
          <a href="tel:+250788300401" className="w-full py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors text-center">
            Call Directly
          </a>
          <button
            disabled={!canEscalate}
            onClick={() => gicumbi && actions.escalateAlert(gicumbi.id, 'Northern Province Director (Level 2)', 'DHO unreachable — SMS delivery failed twice')}
            className="w-full py-2 bg-white border border-epi-red text-epi-red text-[13px] font-bold rounded-md hover:bg-epi-red/10 disabled:opacity-50 transition-colors">
            {gicumbi?.status === 'escalated' ? `Escalated — ${gicumbi.escalatedTo?.split(' (')[0]}` : canEscalate ? 'Escalate Without Waiting' : 'Alert already handled'}
          </button>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Alert
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Recipient
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Role
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Channel
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Sent
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Delivered
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Read
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Response
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                  ALT-001
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  Dr. Aline Uwimana
                </td>
                <td className="p-4 text-[13px] text-epi-muted">Rusizi DHO</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Email Email + SMS SMS
                </td>
                <td className="p-4 text-[13px] text-epi-text">09:16 AM</td>
                <td className="p-4 text-[13px] text-[#00A550] font-medium">
                  <span className="flex items-center gap-1">09:16 AM <Check className="w-3.5 h-3.5" /></span>
                </td>
                <td className="p-4 text-[13px] text-epi-text">09:18 AM Viewed</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Acknowledged 10:30 AM
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  ● Complete
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                  ALT-001
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  RBC Epidemiology
                </td>
                <td className="p-4 text-[13px] text-epi-muted">National</td>
                <td className="p-4 text-[13px] text-epi-text">Email Email</td>
                <td className="p-4 text-[13px] text-epi-text">09:16 AM</td>
                <td className="p-4 text-[13px] text-[#00A550] font-medium">
                  <span className="flex items-center gap-1">09:16 AM <Check className="w-3.5 h-3.5" /></span>
                </td>
                <td className="p-4 text-[13px] text-epi-text">09:45 AM Viewed</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Noted — no action needed
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  ● Received
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                  ALT-002
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  Jean Nshuti
                </td>
                <td className="p-4 text-[13px] text-epi-muted">Kayonza DHO</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Email Email + SMS SMS
                </td>
                <td className="p-4 text-[13px] text-epi-text">14:22 PM</td>
                <td className="p-4 text-[13px] text-[#00A550] font-medium">
                  <span className="flex items-center gap-1">14:23 PM <Check className="w-3.5 h-3.5" /></span>
                </td>
                <td className="p-4 text-[13px] text-epi-text">15:40 PM Viewed</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Acknowledged 15:47 PM
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  ● Complete
                </td>
              </tr>
              <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                  ALT-003
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  Alice Niyonzima
                </td>
                <td className="p-4 text-[13px] text-epi-muted">Gicumbi DHO</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Email Email + SMS SMS
                </td>
                <td className="p-4 text-[13px] text-epi-text">16:01 PM</td>
                <td className="p-4 text-[13px] text-epi-text">
                  <div className="text-[#00A550] flex items-center gap-1">Email <Check className="w-3.5 h-3.5" /> Delivered</div>
                  <div className="text-epi-red font-bold flex items-center gap-1">SMS <X className="w-3.5 h-3.5" /> SMS Failed</div>
                </td>
                <td className="p-4 text-[13px] text-epi-red font-medium">
                  <span className="flex items-center gap-1"><X className="w-3.5 h-3.5" /> Not read</span>
                </td>
                <td className="p-4 text-[13px] text-epi-amber font-bold">
                  No response
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-red">
                  ● Action needed
                </td>
              </tr>
              <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                <td className="p-4 text-[13px] font-mono font-bold text-epi-text">
                  ALT-003
                </td>
                <td className="p-4 text-[13px] font-bold text-epi-text">
                  Alice Niyonzima
                </td>
                <td className="p-4 text-[13px] text-epi-muted">Gicumbi DHO</td>
                <td className="p-4 text-[13px] text-epi-text">SMS SMS Retry</td>
                <td className="p-4 text-[13px] text-epi-text">16:15 PM</td>
                <td className="p-4 text-[13px] text-epi-red font-bold">
                  <span className="flex items-center gap-1">SMS <X className="w-3.5 h-3.5" /> Failed again</span>
                </td>
                <td className="p-4 text-[13px] text-epi-muted">—</td>
                <td className="p-4 text-[13px] text-epi-muted">—</td>
                <td className="p-4 text-[13px] font-bold text-epi-red">
                  ● Retry via alternate number
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </WarningLayout>);

}