import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { ConfirmModal } from '../../components/dho/ConfirmModal';
export function DhoAlerts() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acked, setAcked] = useState(false);
  const [filter, setFilter] = useState('all');
  return (
    <DhoLayout
      title="Active Alerts — Huye District"
      subtitle="3 active alerts requiring your attention"
      breadcrumb="Active Alerts">
      
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
          {
            id: 'all',
            label: 'All Levels'
          },
          {
            id: 'red',
            label: '🔴 Red (1)'
          },
          {
            id: 'orange',
            label: '🟠 Orange (1)'
          },
          {
            id: 'yellow',
            label: '🟡 Yellow (1)'
          },
          {
            id: 'ack',
            label: '✅ Acknowledged (4)'
          }].
          map((f) =>
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${filter === f.id ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:text-admin-text'}`}>
            
              {f.label}
            </button>
          )}
        </div>
        <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
          <option>Sort: Most Recent</option>
          <option>Severity</option>
          <option>Disease</option>
        </select>
      </div>

      {/* Alert Card 1 - Expanded Red */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden mb-6">
        <div className="bg-admin-red text-white px-6 py-3 font-bold text-[15px]">
          🔴 RED ALERT — ALT-2026-051
        </div>
        <div className="px-6 py-3 bg-admin-red/5 border-b border-border flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
          <span>
            <span className="text-admin-muted">Disease:</span>{' '}
            <strong className="text-admin-text">Cholera</strong>
          </span>
          <span>
            <span className="text-admin-muted">Sector:</span>{' '}
            <strong className="text-admin-text">Tumba</strong>
          </span>
          <span>
            <span className="text-admin-muted">District:</span>{' '}
            <strong className="text-admin-text">Huye</strong>
          </span>
          <span>
            <span className="text-admin-muted">Triggered:</span>{' '}
            <strong className="text-admin-text">June 3, 2026 06:14 AM</strong>
          </span>
          <span>
            <span className="text-admin-muted">Status:</span>{' '}
            <strong className={acked ? 'text-admin-accent' : 'text-admin-red'}>
              {acked ? '✅ Acknowledged' : '🔴 Unacknowledged'}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div>
            <h3 className="text-[14px] font-bold text-admin-text mb-3">
              Why This Alert Was Triggered
            </h3>
            <ul className="space-y-2 text-[13px] text-admin-text list-disc pl-4">
              <li>Cases increased 340% week-over-week</li>
              <li>Outbreak probability: 82%</li>
              <li>R0 = 2.3 (rapidly spreading)</li>
              <li>Rainy season — cholera risk multiplier active</li>
              <li>WASAC flagged water quality issue in Tumba on June 1</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-admin-text mb-3">
              Recommended Actions
            </h3>
            <div className="text-[12px] font-bold text-admin-muted uppercase tracking-wider mb-2">
              Immediate (0–24 hours)
            </div>
            <div className="space-y-2 mb-4">
              {[
              'Deploy ORS and chlorine tablets to Tumba Health Center',
              'Inspect all water sources in Tumba Sector',
              'Alert and brief CHWs in Tumba'].
              map((a, i) =>
              <label
                key={i}
                className="flex items-start gap-2 text-[13px] text-admin-text cursor-pointer">
                
                  <input
                  type="checkbox"
                  className="mt-0.5 rounded border-border text-admin focus:ring-admin" />
                {' '}
                  {a}
                </label>
              )}
            </div>
            <div className="text-[12px] font-bold text-admin-muted uppercase tracking-wider mb-2">
              Short-term (1–7 days)
            </div>
            <div className="space-y-2">
              {[
              'Conduct active case search in Tumba households',
              'Set up oral rehydration point at Tumba market'].
              map((a, i) =>
              <label
                key={i}
                className="flex items-start gap-2 text-[13px] text-admin-text cursor-pointer">
                
                  <input
                  type="checkbox"
                  className="mt-0.5 rounded border-border text-admin focus:ring-admin" />
                {' '}
                  {a}
                </label>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-admin-text mb-3">
              Response Timeline
            </h3>
            <div className="space-y-3 text-[13px]">
              <div>
                <div className="font-medium text-admin-text">
                  Alert sent → June 3, 06:14 AM
                </div>
                <div className="text-admin-muted">
                  SMS/Email sent to Emmanuel Nkurunziza
                </div>
              </div>
              <div>
                <span className="text-admin-muted">Acknowledged:</span>{' '}
                <strong
                  className={acked ? 'text-admin-accent' : 'text-admin-red'}>
                  
                  {acked ? '✅ Yes' : '❌ Not yet'}
                </strong>
              </div>
              <div>
                <span className="text-admin-muted">Escalation due:</span>{' '}
                <strong className="text-admin-text">June 3, 10:14 AM</strong>{' '}
                (if not acknowledged)
              </div>
              <div>
                <span className="text-admin-muted">Escalated to:</span>{' '}
                <strong className="text-admin-text">
                  Dr. Kayitesi — Southern Province Director
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-admin-bg/50 flex flex-wrap gap-3">
          <button
            onClick={() => !acked && setConfirmOpen(true)}
            disabled={acked}
            className={`h-10 px-4 text-white text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2 ${acked ? 'bg-admin-accent cursor-default' : 'bg-admin hover:bg-admin-hover'}`}>
            
            <Check className="w-4 h-4" />{' '}
            {acked ? 'Acknowledged' : 'Acknowledge Alert'}
          </button>
          <button className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg transition-colors">
            📝 Add Response Note
          </button>
          <button className="h-10 px-4 bg-white border border-admin-red text-admin-red text-[13px] font-semibold rounded-md hover:bg-admin-red/10 transition-colors">
            ⬆️ Escalate to RBC
          </button>
          <button className="h-10 px-4 bg-white border border-border text-admin-text text-[13px] font-semibold rounded-md hover:bg-admin-bg transition-colors">
            📄 View Full Details
          </button>
        </div>
      </div>

      {/* Alert Card 2 - Collapsed Orange */}
      <div className="bg-white rounded-lg shadow-sm border-l-4 border-admin-amber border-y border-r border-border p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] font-bold text-admin-text">
              🟠 ORANGE | Malaria | Ngoma Sector | June 4 | Acknowledged ✅ by
              Emmanuel Nkurunziza, June 4 09:22 AM
            </div>
            <div className="text-[13px] text-admin-muted mt-1">
              Response note: "Contacted Ngoma HC. Spray campaign requested for
              June 7."
            </div>
          </div>
          <button className="text-admin-muted hover:text-admin-text flex items-center gap-1 text-[13px] font-semibold shrink-0">
            <ChevronDown className="w-4 h-4" /> Expand
          </button>
        </div>
      </div>

      {/* Alert Card 3 - Collapsed Yellow */}
      <div className="bg-white rounded-lg shadow-sm border-l-4 border-yellow-400 border-y border-r border-border p-5">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold text-admin-text">
            🟡 YELLOW | Measles Vaccination | Mukura Sector | June 2 | Status:
            Acknowledged ✅
          </div>
          <button className="text-admin-muted hover:text-admin-text flex items-center gap-1 text-[13px] font-semibold shrink-0">
            <ChevronDown className="w-4 h-4" /> Expand
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Acknowledge this alert?"
        message="Are you sure you want to acknowledge this alert? This will be logged permanently."
        confirmLabel="Yes, Acknowledge"
        onConfirm={() => {
          setAcked(true);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)} />
      
    </DhoLayout>);

}