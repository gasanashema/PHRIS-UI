import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Clock, Smartphone, Map, Database } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
import { useApp } from '../../store/AppStore';
import type { Threshold } from '../../types';

const TABS = [
{ icon: Bell, label: 'Alert Thresholds' },
{ icon: Calendar, label: 'Report Scheduling' },
{ icon: Clock, label: 'Session & Security' },
{ icon: Smartphone, label: 'Notifications' },
{ icon: Map, label: 'Geographic Boundaries' },
{ icon: Database, label: 'Data Retention' }];


function Switch({ on, onClick, label }: {on: boolean;onClick: () => void;label: string;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${on ? 'bg-admin-accent' : 'bg-border'}`}>

      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${on ? 'right-1' : 'left-1'}`} />
    </button>);

}

export function AdminSystemConfig() {
  const { state, actions } = useApp();
  const [tab, setTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draft, setDraft] = useState<Threshold[]>(state.thresholds);
  const [aiPct, setAiPct] = useState(state.rules.aiPct);
  const [escalate, setEscalate] = useState(state.rules.autoEscalateHours);
  const [schedules, setSchedules] = useState([
  { name: 'Weekly Epidemiological Bulletin', freq: 'Every Monday', time: '07:00', recs: 234, active: true },
  { name: "Minister's Health Brief", freq: 'Every Monday', time: '08:00', recs: 6, active: true },
  { name: 'District Alert Summary', freq: 'Every Monday', time: '09:00', recs: 30, active: true }]
  );
  const [security, setSecurity] = useState({ timeout: '30', expiry: '90', lockout: '5', mfa: true });
  const [notify, setNotify] = useState({ sms: true, email: true, whatsapp: false, quietHours: false });

  useEffect(() => setDraft(state.thresholds), [state.thresholds]);
  useEffect(() => {
    setAiPct(state.rules.aiPct);
    setEscalate(state.rules.autoEscalateHours);
  }, [state.rules]);

  const invalid = draft.filter((t) => !(t.yellow <= t.orange && t.orange <= t.red));
  const changed = draft.filter((t) => {
    const cur = state.thresholds.find((x) => x.disease === t.disease)!;
    return cur.yellow !== t.yellow || cur.orange !== t.orange || cur.red !== t.red;
  });

  const setVal = (disease: string, k: 'yellow' | 'orange' | 'red', v: string) =>
  setDraft((d) => d.map((t) => t.disease === disease ? { ...t, [k]: Math.max(0, Number(v) || 0) } : t));

  const saveAll = () => {
    if (invalid.length) {
      setTab(0);
      return;
    }
    changed.forEach((t) => actions.updateThreshold(t.disease, { yellow: t.yellow, orange: t.orange, red: t.red }));
    if (aiPct !== state.rules.aiPct || escalate !== state.rules.autoEscalateHours) {
      actions.updateRules({ aiPct, autoEscalateHours: escalate });
    }
    actions.logAdminEvent('Configuration', 'Saved system configuration', `${changed.length} threshold change(s)`);
    setShowSuccess(true);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; System Configuration</div>
        <h1 className="text-[24px] font-bold text-admin-text">System Configuration</h1>
        <p className="text-[14px] text-admin-muted">Configure how AI Vital behaves across all modules and users</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[240px] shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((t, i) =>
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-[14px] font-medium whitespace-nowrap transition-colors ${i === tab ? 'bg-admin text-white' : 'text-admin-muted hover:bg-white hover:text-admin-text'}`}>

                <t.icon className="w-5 h-5" />
                {t.label}
              </button>
            )}
          </nav>
        </div>

        <div className="flex-1 space-y-6 min-w-0">
          {tab === 0 &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-[18px] font-bold text-admin-text mb-1">Disease Alert Thresholds</h2>
              <p className="text-[14px] text-admin-muted mb-6">
                Weekly case counts that trigger each alert level. These are the same thresholds used by the{' '}
                <Link to="/warning/config" className="text-admin font-semibold hover:underline">Early Warning module</Link>.
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Disease</th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-yellow-500" />
                          Yellow
                        </span>
                      </th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                          Orange
                        </span>
                      </th>
                      <th className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-admin-red" />
                          Red
                        </span>
                      </th>
                      <th className="px-4 py-3">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {draft.map((d) => {
                    const bad = !(d.yellow <= d.orange && d.orange <= d.red);
                    return (
                      <tr key={d.disease} className={bad ? 'bg-admin-red/5' : ''}>
                          <td className="px-4 py-3 font-bold text-admin-text">
                            {d.disease}
                            {bad && <div className="text-[11px] text-admin-red font-medium">Must increase: yellow ≤ orange ≤ red</div>}
                          </td>
                          {(['yellow', 'orange', 'red'] as const).map((k) =>
                        <td key={k} className="px-4 py-3">
                              <input
                            type="number"
                            min={0}
                            value={d[k]}
                            onChange={(e) => setVal(d.disease, k, e.target.value)}
                            aria-label={`${d.disease} ${k}`}
                            className="w-20 h-8 px-2 border border-border rounded text-center focus:outline-none focus:border-admin" />

                            </td>
                        )}
                          <td className="px-4 py-3 text-admin-muted">{d.unit}</td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-admin-text">AI probability for Orange alert (%) — Red at +20</label>
                  <input type="number" min={10} max={90} value={aiPct} onChange={(e) => setAiPct(Math.min(90, Math.max(10, Number(e.target.value) || 0)))} className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-admin-text">Auto-escalation window (hours)</label>
                  <input type="number" min={1} value={escalate} onChange={(e) => setEscalate(Math.max(1, Number(e.target.value) || 1))} className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin" />
                </div>
              </div>
            </div>
          }

          {tab === 1 &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-[18px] font-bold text-admin-text mb-4">Report Scheduling</h2>
              <div className="space-y-4">
                {schedules.map((r, i) =>
              <div key={r.name} className="flex flex-wrap items-center justify-between gap-3 p-4 border border-border rounded-md">
                    <div>
                      <div className="font-bold text-admin-text text-[14px]">{r.name}</div>
                      <div className="text-[13px] text-admin-muted mt-1">
                        {r.freq} | {r.time} | {r.recs} recipients
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                    type="time"
                    value={r.time}
                    onChange={(e) => setSchedules((s) => s.map((x, j) => j === i ? { ...x, time: e.target.value } : x))}
                    aria-label={`${r.name} time`}
                    className="h-8 px-2 border border-border rounded text-[13px]" />

                      <Switch
                    label={r.name}
                    on={r.active}
                    onClick={() => setSchedules((s) => s.map((x, j) => j === i ? { ...x, active: !x.active } : x))} />

                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {tab === 2 &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-5">
              <h2 className="text-[18px] font-bold text-admin-text">Session & Security</h2>
              {[
            ['timeout', 'Session timeout (minutes of inactivity)'],
            ['expiry', 'Password expiry (days)'],
            ['lockout', 'Failed logins before lockout']].
            map(([k, l]) =>
            <div key={k} className="flex flex-wrap items-center justify-between gap-3">
                  <label className="text-[14px] text-admin-text">{l}</label>
                  <input
                type="number"
                min={1}
                value={security[k as 'timeout']}
                onChange={(e) => setSecurity({ ...security, [k]: e.target.value })}
                className="w-24 h-9 px-2 border border-border rounded text-center" />

                </div>
            )}
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-admin-text">Require MFA for all users</span>
                <Switch label="Require MFA" on={security.mfa} onClick={() => setSecurity({ ...security, mfa: !security.mfa })} />
              </div>
            </div>
          }

          {tab === 3 &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-6 space-y-5">
              <h2 className="text-[18px] font-bold text-admin-text">Notification Channels</h2>
              {[
            ['sms', 'SMS gateway (MTN / Airtel)'],
            ['email', 'Email (gov.rw SMTP relay)'],
            ['whatsapp', 'WhatsApp Business alerts'],
            ['quietHours', 'Quiet hours for yellow alerts (22:00–06:00)']].
            map(([k, l]) =>
            <div key={k} className="flex items-center justify-between">
                  <span className="text-[14px] text-admin-text">{l}</span>
                  <Switch label={l} on={notify[k as 'sms']} onClick={() => setNotify({ ...notify, [k]: !notify[k as 'sms'] })} />
                </div>
            )}
              <p className="text-[12px] text-admin-muted">Delivery channels are simulated — no SMS or email is actually sent.</p>
            </div>
          }

          {tab === 4 &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-[18px] font-bold text-admin-text mb-2">Geographic Boundaries</h2>
              <p className="text-[14px] text-admin-muted mb-4">
                Administrative hierarchy used for aggregation: 5 provinces · 30 districts · 416 sectors · 2,148 cells.
                Boundaries follow the NISR 2022 census release.
              </p>
              <Link to="/processing/geographic" className="text-[13px] font-bold text-admin hover:underline">
                View geographic aggregation →
              </Link>
            </div>
          }

          {tab === 5 &&
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-[18px] font-bold text-admin-text mb-2">Data Retention</h2>
              <p className="text-[14px] text-admin-muted mb-4">Retention periods and backups are managed on the Backup & Data page.</p>
              <Link to="/admin/backup" className="text-[13px] font-bold text-admin hover:underline">
                Open Backup & Data →
              </Link>
            </div>
          }

          {invalid.length > 0 &&
          <div className="text-[13px] text-admin-red font-medium">
              Fix {invalid.length} threshold row{invalid.length > 1 ? 's' : ''} before saving.
            </div>
          }
          <button
            onClick={saveAll}
            className="w-full h-12 bg-admin hover:bg-admin-hover text-white text-[15px] font-semibold rounded-md transition-colors">

            Save All Configuration
          </button>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        title="Configuration saved"
        message={`System configuration changes are now live across all modules${changed.length ? ` (${changed.length} threshold change${changed.length > 1 ? 's' : ''})` : ''}.`}
        onClose={() => setShowSuccess(false)} />

    </AdminLayout>);

}
