import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Database,
  Download,
  RotateCcw,
  RefreshCw,
  FileText,
  AlertTriangle,
  X } from
'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
export function AdminBackup() {
  const [showModal, setShowModal] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    open: false,
    title: '',
    message: ''
  });
  const handleManualBackup = () => {
    setSuccessConfig({
      open: true,
      title: 'Backup started',
      message:
      'A manual backup has been queued and will appear in history shortly.'
    });
  };
  const handleSaveRetention = () => {
    setSuccessConfig({
      open: true,
      title: 'Retention policy saved',
      message: 'The new data retention policy has been applied.'
    });
  };
  const handleRestore = () => {
    setShowModal(false);
    setSuccessConfig({
      open: true,
      title: 'Restore initiated',
      message:
      'The system is restoring from the selected backup. Users may be briefly logged out.'
    });
  };
  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; Backup & Data
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          Backup & Data Management
        </h1>
        <p className="text-[14px] text-admin-muted">
          Protect Rwanda's national health data with automated and manual
          backups
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <ShieldCheck className="w-5 h-5 text-admin-accent mb-3" />
          <div className="text-[13px] text-admin-muted font-medium mb-1">
            Last Backup
          </div>
          <div className="text-[20px] font-bold text-admin-text mb-3">
            Today 03:00 AM
          </div>
          <div className="mt-auto">
            <span className="bg-admin-accent/10 text-admin-accent px-2 py-1 rounded text-[12px] font-bold">
              🟢 Successful
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <Clock className="w-5 h-5 text-admin-info mb-3" />
          <div className="text-[13px] text-admin-muted font-medium mb-1">
            Next Scheduled Backup
          </div>
          <div className="text-[20px] font-bold text-admin-text mb-3">
            Tomorrow 03:00 AM
          </div>
          <div className="mt-auto">
            <span className="bg-admin-info/10 text-admin-info px-2 py-1 rounded text-[12px] font-bold">
              🟢 Scheduled
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-border flex flex-col">
          <Database className="w-5 h-5 text-admin mb-3" />
          <div className="text-[13px] text-admin-muted font-medium mb-1">
            Backup Storage Used
          </div>
          <div className="text-[20px] font-bold text-admin-text mb-3">
            247 GB{' '}
            <span className="text-[14px] text-admin-muted font-normal">
              of 500 GB
            </span>
          </div>
          <div className="mt-auto">
            <div className="w-full h-2 bg-admin-bg rounded-full overflow-hidden">
              <div className="h-full bg-admin w-[49%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - History */}
        <div className="w-full lg:w-[65%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-admin-text">
              Backup History
            </h2>
            <button
              onClick={handleManualBackup}
              className="h-9 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">
              
              <RefreshCw className="w-4 h-4" /> Trigger Manual Backup Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Size</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Initiated By</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                  {
                    date: 'June 5, 2026',
                    time: '03:00 AM',
                    type: 'Auto',
                    size: '12.4 GB',
                    status: '✅ Success',
                    by: 'System',
                    isRed: false
                  },
                  {
                    date: 'June 4, 2026',
                    time: '03:00 AM',
                    type: 'Auto',
                    size: '12.1 GB',
                    status: '✅ Success',
                    by: 'System',
                    isRed: false
                  },
                  {
                    date: 'June 3, 2026',
                    time: '02:15 PM',
                    type: 'Manual',
                    size: '12.0 GB',
                    status: '✅ Success',
                    by: 'admin@moh.gov.rw',
                    isRed: false
                  },
                  {
                    date: 'June 2, 2026',
                    time: '03:00 AM',
                    type: 'Auto',
                    size: '11.8 GB',
                    status: '🔴 Failed',
                    by: 'System',
                    isRed: true
                  }].
                  map((r, i) =>
                  <tr key={i} className="hover:bg-admin-bg/30">
                      <td className="px-5 py-3 font-medium text-admin-text">
                        {r.date}
                      </td>
                      <td className="px-5 py-3 text-admin-muted">{r.time}</td>
                      <td className="px-5 py-3 text-admin-muted">{r.type}</td>
                      <td className="px-5 py-3 text-admin-muted">{r.size}</td>
                      <td className="px-5 py-3 font-bold">{r.status}</td>
                      <td className="px-5 py-3 text-admin-muted">{r.by}</td>
                      <td className="px-5 py-3 text-right">
                        {r.isRed ?
                      <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                            <button className="text-admin hover:underline">
                              Retry
                            </button>
                            <span className="text-border">·</span>
                            <button className="text-admin-muted hover:underline">
                              View Log
                            </button>
                          </div> :

                      <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                            <button className="text-admin hover:underline flex items-center gap-1">
                              <Download className="w-3 h-3" /> Download
                            </button>
                            <span className="text-border">·</span>
                            <button
                          onClick={() => setShowModal(true)}
                          className="text-admin-red hover:underline flex items-center gap-1">
                          
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

        {/* Right - Policy */}
        <div className="w-full lg:w-[35%]">
          <div className="mb-4">
            <h2 className="text-[18px] font-bold text-admin-text">
              Data Retention Policy
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
            <div className="p-5 space-y-4">
              {[
              {
                label: 'Patient/case records',
                val: 'Keep for 10 years'
              },
              {
                label: 'Audit trail logs',
                val: 'Keep for 5 years'
              },
              {
                label: 'Alert history',
                val: 'Keep for 3 years'
              },
              {
                label: 'Raw imported data',
                val: 'Keep for 2 years'
              },
              {
                label: 'System logs',
                val: 'Keep for 1 year'
              }].
              map((p, i) =>
              <div
                key={i}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                
                  <div>
                    <div className="text-[13px] font-bold text-admin-text">
                      {p.label}
                    </div>
                    <div className="text-[13px] text-admin-muted">{p.val}</div>
                  </div>
                  <button className="text-admin hover:text-admin-hover p-1">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-border bg-admin-bg/50 mt-auto">
              <button
                onClick={handleSaveRetention}
                className="w-full h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
                
                Save Retention Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[440px] p-6 flex flex-col animate-in zoom-in-95">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-admin-red/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-admin-red" />
              </div>
              <button
              onClick={() => setShowModal(false)}
              className="text-admin-muted hover:text-admin-text">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-[20px] font-bold text-admin-text mb-2">
              Restore System Backup?
            </h3>
            <p className="text-[14px] text-admin-muted mb-6 leading-relaxed">
              You are about to restore the database to the backup from{' '}
              <strong className="text-admin-text">
                June 3, 2026 (02:15 PM)
              </strong>
              . Any data collected after this time will be permanently lost.
              This action cannot be undone.
            </p>

            <div className="flex gap-3 w-full">
              <button
              onClick={() => setShowModal(false)}
              className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
              
                Cancel
              </button>
              <button
              onClick={handleRestore}
              className="flex-1 h-10 bg-admin-red hover:bg-red-700 text-white text-[14px] font-semibold rounded-md transition-colors">
              
                Yes, Restore Backup
              </button>
            </div>
          </div>
        </div>
      }

      <SuccessModal
        open={successConfig.open}
        title={successConfig.title}
        message={successConfig.message}
        onClose={() =>
        setSuccessConfig((prev) => ({
          ...prev,
          open: false
        }))
        } />
      
    </AdminLayout>);

}