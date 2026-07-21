import React, { useState, Fragment } from 'react';
import {
  Search,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronLeft } from
'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
export function AdminAuditTrail() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const rows = [
  {
    id: 1,
    time: '09:15:22',
    user: 'jp.habimana@rbc.gov.rw',
    role: 'Epidemiologist',
    action: 'Logged In',
    mod: 'Auth',
    ip: '197.243.x.x',
    status: '✅ Success',
    isRed: false
  },
  {
    id: 2,
    time: '09:22:47',
    user: 'jp.habimana@rbc.gov.rw',
    role: 'Epidemiologist',
    action: 'Generated Report — Malaria Weekly',
    mod: 'Reports',
    ip: '197.243.x.x',
    status: '✅ Success',
    isRed: false
  },
  {
    id: 3,
    time: '10:05:13',
    user: 'admin@moh.gov.rw',
    role: 'Administrator',
    action: 'Created User — p.bizimana@rbc.gov.rw',
    mod: 'User Mgmt',
    ip: '41.186.x.x',
    status: '✅ Success',
    isRed: false
  },
  {
    id: 4,
    time: '11:30:08',
    user: 'officer@huye.gov.rw',
    role: 'District Officer',
    action: 'Acknowledged RED Alert — ALT-2026-047',
    mod: 'Early Warning',
    ip: '102.90.x.x',
    status: '✅ Success',
    isRed: false
  },
  {
    id: 5,
    time: '11:45:03',
    user: 'unknown@external.com',
    role: '—',
    action: 'Failed Login Attempt (×3)',
    mod: 'Auth',
    ip: '91.134.x.x',
    status: '🔴 Security Flag',
    isRed: true
  }];

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; Audit Trail
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">Audit Trail</h1>
        <p className="text-[14px] text-admin-muted">
          Complete record of all user actions. Every event is permanently
          logged.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin text-admin-text" />
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input
              type="text"
              placeholder="Search user or email..."
              className="h-10 pl-9 pr-4 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin w-[200px]" />
            
          </div>
          <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            <option>All Actions</option>
            <option>Login</option>
            <option>Logout</option>
            <option>Report Generated</option>
            <option>Alert Acknowledged</option>
            <option>User Created</option>
            <option>Config Changed</option>
            <option>Data Exported</option>
          </select>
          <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            <option>All Roles</option>
            <option>Administrator</option>
            <option>Epidemiologist</option>
          </select>
        </div>
        <button className="h-10 px-4 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Log (CSV)
        </button>
      </div>

      <div className="bg-admin-sidebar text-white px-6 py-3 rounded-t-lg flex items-center gap-6 text-[13px] font-medium">
        <span>1,847 events today</span>
        <span className="text-white/30">|</span>
        <span>43 users active</span>
        <span className="text-white/30">|</span>
        <span className="text-admin-red font-bold">3 security flags</span>
      </div>

      <div className="bg-white shadow-sm border border-border rounded-b-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r, i) =>
              <Fragment key={r.id}>
                  <tr
                  onClick={() =>
                  setExpandedRow(expandedRow === r.id ? null : r.id)
                  }
                  className={`cursor-pointer transition-colors ${r.isRed ? 'bg-admin-red/5 hover:bg-admin-red/10' : i % 2 === 0 ? 'bg-white hover:bg-admin-bg/50' : 'bg-admin-bg/30 hover:bg-admin-bg/50'}`}>
                  
                    <td className="px-4 py-3 text-admin-muted">
                      {expandedRow === r.id ?
                    <ChevronDown className="w-4 h-4" /> :

                    <ChevronRight className="w-4 h-4" />
                    }
                    </td>
                    <td className="px-4 py-3 text-admin-muted">{r.time}</td>
                    <td className="px-4 py-3 font-medium text-admin-text">
                      {r.user}
                    </td>
                    <td className="px-4 py-3 text-admin-text">{r.role}</td>
                    <td className="px-4 py-3 font-bold text-admin-text">
                      {r.action}
                    </td>
                    <td className="px-4 py-3 text-admin-muted">{r.mod}</td>
                    <td className="px-4 py-3 text-admin-muted">{r.ip}</td>
                    <td className="px-4 py-3 font-bold">{r.status}</td>
                  </tr>
                  {expandedRow === r.id &&
                <tr className="bg-admin-bg/80 border-b border-border">
                      <td colSpan={8} className="px-12 py-4">
                        <div className="grid grid-cols-3 gap-6 text-[13px]">
                          <div>
                            <div className="text-admin-muted mb-1">
                              Session ID
                            </div>
                            <div className="font-mono text-admin-text">
                              sess_9f8a7b6c5d4e3f2
                            </div>
                          </div>
                          <div>
                            <div className="text-admin-muted mb-1">
                              User Agent
                            </div>
                            <div className="text-admin-text">
                              Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...
                            </div>
                          </div>
                          <div>
                            <div className="text-admin-muted mb-1">
                              Raw Payload
                            </div>
                            <button className="text-admin font-bold hover:underline">
                              View JSON
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                }
                </Fragment>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-white">
          <span className="text-[13px] text-admin-muted">
            Showing 1–20 of 1,847 events
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-muted">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-admin text-white text-[13px] font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-text text-[13px] font-medium">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-text text-[13px] font-medium">
              3
            </button>
            <span className="px-1 text-admin-muted">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-text text-[13px] font-medium">
              93
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-admin-bg text-admin-muted">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>);

}