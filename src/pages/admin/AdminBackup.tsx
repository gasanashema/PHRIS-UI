import { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Database,
  Download,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  X,
  Loader2 } from
'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
import { useApp } from '../../store/AppStore';
import { downloadFile, fmtDate, fmtDateTime, fmtTime } from '../../lib/format';
import type { Backup } from '../../types';

const RETENTION_OPTIONS = ['1 year', '2 years', '3 years', '5 years', '10 years'];

export function AdminBackup() {
  const { state, actions } = useApp();
  const [restoreFrom, setRestoreFrom] = useState<Backup | null>(null);
  const [success, setSuccess] = useState<{title: string;message: string;} | null>(null);
  const [retention, setRetention] = useState<Record<string, string>>({
    'Patient/case records': '10 years',
    'Audit trail logs': '5 years',
    'Alert history': '3 years',
    'Raw imported data': '2 years',
    'System logs': '1 year'
  });
  const [retentionDirty, setRetentionDirty] = useState(false);

  const backups = state.backups;
  const running = backups.some((b) => b.status === 'Running');
  const lastOk = backups.find((b) => b.status === 'Success');
  const used = 247 + (backups.length - 4) * 12.5;

  const download = (b: Backup) => {
    downloadFile(
      `aivital-backup-manifest-${b.at.slice(0, 10)}.json`,
      JSON.stringify({ id: b.id, createdAt: b.at, type: b.type, size: b.size, note: 'Manifest only — database backups are simulated in this prototype.' }, null, 2),
      'application/json'
    );
    actions.logAdminEvent('Backup', 'Downloaded backup manifest', fmtDateTime(b.at));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; Backup & Data</div>
        <h1 className="text-[24px] font-bold text-admin-text">Backup & Data Management</h1>
        <p className="text-[14px] text-admin-muted">Protect Rwanda's national health data with automated and manual backups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <ShieldCheck className="w-5 h-5 text-admin-accent mb-3" />
          <div className="text-[13px] text-admin-muted font-medium mb-1">Last Successful Backup</div>
          <div className="text-[20px] font-bold text-admin-text mb-3">{lastOk ? fmtDateTime(lastOk.at) : '—'}</div>
          <div className="mt-auto">
            <span className="bg-admin-accent/10 text-admin-accent px-2 py-1 rounded text-[12px] font-bold">
              {running ? '⏳ Backup in progress' : '🟢 Successful'}
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <Clock className="w-5 h-5 text-admin-info mb-3" />
          <div className="text-[13px] text-admin-muted font-medium mb-1">Next Scheduled Backup</div>
          <div className="text-[20px] font-bold text-admin-text mb-3">Tomorrow 03:00</div>
          <div className="mt-auto">
            <span className="bg-admin-info/10 text-admin-info px-2 py-1 rounded text-[12px] font-bold">🟢 Scheduled</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <Database className="w-5 h-5 text-admin mb-3" />
          <div className="text-[13px] text-admin-muted font-medium mb-1">Backup Storage Used</div>
          <div className="text-[20px] font-bold text-admin-text mb-3">
            {used.toFixed(0)} GB <span className="text-[14px] text-admin-muted font-normal">of 500 GB</span>
          </div>
          <div className="mt-auto">
            <div className="w-full h-2 bg-admin-bg rounded-full overflow-hidden">
              <div className="h-full bg-admin" style={{ width: `${Math.min(100, used / 5)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[65%]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-[18px] font-bold text-admin-text">Backup History</h2>
            <button
              onClick={actions.runBackup}
              disabled={running}
              className="h-9 px-4 bg-admin hover:bg-admin-hover disabled:opacity-60 text-white text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">

              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {running ? 'Backup running…' : 'Trigger Manual Backup Now'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
                  <tr>
                    {['Date', 'Time', 'Type', 'Size', 'Status', 'Initiated By'].map((h) =>
                    <th key={h} className="px-5 py-3">{h}</th>
                    )}
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {backups.map((b) =>
                  <tr key={b.id} className="hover:bg-admin-bg/30">
                      <td className="px-5 py-3 font-medium text-admin-text whitespace-nowrap">{fmtDate(b.at)}</td>
                      <td className="px-5 py-3 text-admin-muted">{fmtTime(b.at)}</td>
                      <td className="px-5 py-3 text-admin-muted">{b.type}</td>
                      <td className="px-5 py-3 text-admin-muted">{b.size}</td>
                      <td className="px-5 py-3 font-bold whitespace-nowrap">
                        {b.status === 'Success' ? '✅ Success' : b.status === 'Running' ? '⏳ Running' : '🔴 Failed'}
                      </td>
                      <td className="px-5 py-3 text-admin-muted">{b.type === 'Auto' ? 'System' : 'Administrator'}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {b.status === 'Failed' &&
                      <button onClick={actions.runBackup} disabled={running} className="text-[12px] font-bold text-admin hover:underline disabled:opacity-40">
                            Retry
                          </button>
                      }
                        {b.status === 'Success' &&
                      <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                            <button onClick={() => download(b)} className="text-admin hover:underline flex items-center gap-1">
                              <Download className="w-3 h-3" /> Download
                            </button>
                            <span className="text-border">·</span>
                            <button onClick={() => setRestoreFrom(b)} className="text-admin-red hover:underline flex items-center gap-1">
                              <RotateCcw className="w-3 h-3" /> Restore
                            </button>
                          </div>
                      }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%]">
          <h2 className="text-[18px] font-bold text-admin-text mb-4">Data Retention Policy</h2>
          <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
            <div className="p-5 space-y-4">
              {Object.entries(retention).map(([label, val]) =>
              <div key={label} className="flex items-center justify-between gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="text-[13px] font-bold text-admin-text">{label}</div>
                  <select
                  value={val}
                  onChange={(e) => {
                    setRetention({ ...retention, [label]: e.target.value });
                    setRetentionDirty(true);
                  }}
                  className="h-8 px-2 border border-border rounded bg-white text-[13px]">

                    {RETENTION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-border bg-admin-bg/50 mt-auto">
              <button
                disabled={!retentionDirty}
                onClick={() => {
                  actions.logAdminEvent('Backup', 'Updated data retention policy', Object.entries(retention).map(([k, v]) => `${k}: ${v}`).join('; '));
                  setRetentionDirty(false);
                  setSuccess({ title: 'Retention policy saved', message: 'The new data retention policy has been applied.' });
                }}
                className="w-full h-10 bg-admin hover:bg-admin-hover disabled:opacity-50 text-white text-[14px] font-semibold rounded-md transition-colors">

                {retentionDirty ? 'Save Retention Policy' : 'Policy saved'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {restoreFrom &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[440px] p-6 flex flex-col animate-in zoom-in-95">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-admin-red/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-admin-red" />
              </div>
              <button onClick={() => setRestoreFrom(null)} aria-label="Close" className="text-admin-muted hover:text-admin-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-[20px] font-bold text-admin-text mb-2">Restore System Backup?</h3>
            <p className="text-[14px] text-admin-muted mb-6 leading-relaxed">
              You are about to restore the database to the backup from{' '}
              <strong className="text-admin-text">{fmtDateTime(restoreFrom.at)}</strong>. Any data collected after this
              time would be permanently lost. (In this prototype the restore is simulated and no demo data changes.)
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setRestoreFrom(null)} className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
                Cancel
              </button>
              <button
              onClick={() => {
                actions.logAdminEvent('Backup', 'Initiated system restore (simulated)', fmtDateTime(restoreFrom.at));
                setSuccess({ title: 'Restore initiated', message: `Restoring from the ${fmtDateTime(restoreFrom.at)} backup (simulated). Users may be briefly logged out.` });
                setRestoreFrom(null);
              }}
              className="flex-1 h-10 bg-admin-red hover:bg-red-700 text-white text-[14px] font-semibold rounded-md transition-colors">

                Yes, Restore Backup
              </button>
            </div>
          </div>
        </div>
      }

      <SuccessModal open={!!success} title={success?.title ?? ''} message={success?.message ?? ''} onClose={() => setSuccess(null)} />
    </AdminLayout>);

}
