import React, { useState } from 'react';
import {
  Search,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  UploadCloud,
  Download,
  FileSpreadsheet } from
'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
export function AdminUsers() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerRole, setDrawerRole] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importFile, setImportFile] = useState<string | null>(null);
  const users = [
  {
    id: 1,
    name: 'Jean Paul Habimana',
    email: 'jp.habimana@rbc.gov.rw',
    role: 'Epidemiologist',
    inst: 'RBC',
    dist: 'National',
    login: 'Today 08:22',
    status: '🟢 Active'
  },
  {
    id: 2,
    name: 'Aline Uwimana',
    email: 'a.uwimana@moh.gov.rw',
    role: 'Public Health Analyst',
    inst: 'MOH',
    dist: 'National',
    login: 'Today 07:45',
    status: '🟢 Active'
  },
  {
    id: 3,
    name: 'Emmanuel Nkurunziza',
    email: 'e.nkurunziza@huye.gov.rw',
    role: 'District Health Officer',
    inst: 'Huye DHO',
    dist: 'Huye',
    login: 'Yesterday',
    status: '🟢 Active'
  },
  {
    id: 4,
    name: 'Marie Mukamana',
    email: 'm.mukamana@musanze.gov.rw',
    role: 'District Health Officer',
    inst: 'Musanze DHO',
    dist: 'Musanze',
    login: '3 days ago',
    status: '🟡 Inactive'
  },
  {
    id: 5,
    name: 'Patrick Bizimana',
    email: 'p.bizimana@rbc.gov.rw',
    role: 'Epidemiologist',
    inst: 'RBC',
    dist: 'National',
    login: 'Never',
    status: '🟠 Pending Approval',
    pending: true
  }];

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelected(selected.length === users.length ? [] : users.map((u) => u.id));
  };
  const handleSaveUser = () => {
    setShowDrawer(false);
    setShowSuccess(true);
  };
  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; User Management
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          User Management
        </h1>
        <p className="text-[14px] text-admin-muted">
          247 registered users across all roles and institutions
        </p>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input
              type="text"
              placeholder="Search by name, email..."
              className="h-10 pl-9 pr-4 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin w-[220px]" />
            
          </div>
          <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            <option>All Roles</option>
            <option>Administrator</option>
            <option>Epidemiologist</option>
            <option>Analyst</option>
            <option>District Officer</option>
          </select>
          <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            <option>All Institutions</option>
            <option>RBC</option>
            <option>Ministry of Health</option>
            <option>NISR</option>
            <option>District Health Office</option>
            <option>Health Center</option>
          </select>
          <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            <option>All Districts</option>
            <option>Kigali City</option>
            <option>Huye</option>
            <option>Musanze</option>
            <option>Rubavu</option>
            <option>Kayonza</option>
            <option>Rusizi</option>
          </select>
          <select className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
            <option>Status — All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowImport(true)}
            className="h-10 px-4 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">
            
            <Upload className="w-4 h-4" /> Import Users
          </button>
          <button
            onClick={() => setShowDrawer(true)}
            className="h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">
            
            <Plus className="w-4 h-4" /> Add New User
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 &&
      <div className="bg-admin-sidebar text-white px-6 py-3 rounded-t-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[14px] font-medium">
            {selected.length} users selected
          </span>
          <div className="flex items-center gap-4 text-[13px] font-semibold">
            <button className="hover:text-admin-amber transition-colors">
              Deactivate
            </button>
            <button className="hover:text-admin-accent transition-colors">
              Reset Password
            </button>
            <button className="hover:text-admin-red transition-colors">
              Delete
            </button>
            <button className="hover:text-white/70 transition-colors">
              Export
            </button>
          </div>
        </div>
      }

      {/* Table */}
      <div
        className={`bg-white shadow-sm border border-border overflow-hidden ${selected.length > 0 ? 'rounded-b-lg' : 'rounded-lg'}`}>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === users.length}
                    onChange={toggleAll}
                    className="rounded border-border text-admin focus:ring-admin" />
                  
                </th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Last Login</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) =>
              <tr
                key={u.id}
                className={`hover:bg-admin-bg/30 ${u.pending ? 'bg-admin-amber/5' : ''}`}>
                
                  <td className="px-4 py-3">
                    <input
                    type="checkbox"
                    checked={selected.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                    className="rounded border-border text-admin focus:ring-admin" />
                  
                  </td>
                  <td className="px-4 py-3 font-bold text-admin-text">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{u.email}</td>
                  <td className="px-4 py-3 text-admin-text">{u.role}</td>
                  <td className="px-4 py-3 text-admin-muted">{u.inst}</td>
                  <td className="px-4 py-3 text-admin-muted">{u.dist}</td>
                  <td className="px-4 py-3 text-admin-muted">{u.login}</td>
                  <td className="px-4 py-3 font-medium">{u.status}</td>
                  <td className="px-4 py-3 text-right">
                    {u.pending ?
                  <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                        <button className="text-admin-accent hover:underline">
                          Approve
                        </button>
                        <span className="text-border">·</span>
                        <button className="text-admin-red hover:underline">
                          Reject
                        </button>
                      </div> :

                  <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                        <button className="text-admin hover:underline">
                          Edit
                        </button>
                        <span className="text-border">·</span>
                        <button
                      className={
                      u.status.includes('Inactive') ?
                      'text-admin-accent hover:underline' :
                      'text-admin-amber hover:underline'
                      }>
                      
                          {u.status.includes('Inactive') ?
                      'Activate' :
                      'Deactivate'}
                        </button>
                      </div>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-admin-bg/30">
          <span className="text-[13px] text-admin-muted">
            Showing 1–10 of 247 users
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-muted">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-admin text-white text-[13px] font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-text text-[13px] font-medium">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-text text-[13px] font-medium">
              3
            </button>
            <span className="px-1 text-admin-muted">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-text text-[13px] font-medium">
              25
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-muted">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      {showDrawer &&
      <>
          <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowDrawer(false)} />
        
          <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-admin-text">
                Add / Edit User
              </h2>
              <button
              onClick={() => setShowDrawer(false)}
              className="text-admin-muted hover:text-admin-text">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Full Name
                </label>
                <input
                type="text"
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
              
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Email
                </label>
                <input
                type="email"
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
              
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Phone
                </label>
                <div className="flex">
                  <div className="h-10 px-3 bg-admin-bg border border-border border-r-0 rounded-l-md flex items-center text-admin-text font-medium text-[14px]">
                    +250
                  </div>
                  <input
                  type="tel"
                  className="flex-1 h-10 px-3 border border-border rounded-r-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
                
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Organization
                </label>
                <select className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none bg-white">
                  <option>RBC</option>
                  <option>MOH</option>
                  <option>NISR</option>
                  <option>District Health Office</option>
                  <option>Health Center</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Institution
                </label>
                <input
                type="text"
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
              
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Role
                </label>
                <select
                value={drawerRole}
                onChange={(e) => setDrawerRole(e.target.value)}
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none bg-white">
                
                  <option value="">Select role...</option>
                  <option value="admin">Administrator</option>
                  <option value="epi">Epidemiologist</option>
                  <option value="analyst">Public Health Analyst</option>
                  <option value="dho">District Health Officer</option>
                </select>
              </div>

              {drawerRole === 'dho' &&
            <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-[14px] font-medium text-admin-text">
                    District Assignment
                  </label>
                  <select className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none bg-white">
                    <option>Kigali City</option>
                    <option>Huye</option>
                    <option>Musanze</option>
                    <option>Rubavu</option>
                    <option>Kayonza</option>
                    <option>Rusizi</option>
                  </select>
                </div>
            }

              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-medium text-admin-text">
                      Status
                    </div>
                    <div className="text-[12px] text-admin-muted">
                      User can log in
                    </div>
                  </div>
                  <div className="w-11 h-6 bg-admin-accent rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-medium text-admin-text">
                      MFA Required
                    </div>
                    <div className="text-[12px] text-admin-muted">
                      Enforce 2FA on next login
                    </div>
                  </div>
                  <div className="w-11 h-6 bg-admin-accent rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-admin-bg flex gap-3 shrink-0">
              <button
              onClick={() => setShowDrawer(false)}
              className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
              
                Cancel
              </button>
              <button
              onClick={handleSaveUser}
              className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
              
                Save User
              </button>
            </div>
          </div>
        </>
      }

      {/* Import Users Modal */}
      {showImport &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[520px] animate-in zoom-in-95">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-admin" />
                <h2 className="text-[18px] font-bold text-admin-text">
                  Import Users
                </h2>
              </div>
              <button
              onClick={() => {
                setShowImport(false);
                setImportFile(null);
              }}
              className="text-admin-muted hover:text-admin-text">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-[14px] text-admin-muted leading-relaxed">
                Bulk-add users by uploading a CSV or Excel file. Each row will
                be created as a pending account and sent an invitation email.
              </p>

              {/* Template download */}
              <div className="flex items-center justify-between p-4 bg-admin-bg rounded-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-border flex items-center justify-center text-admin">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-admin-text">
                      Need the format?
                    </div>
                    <div className="text-[12px] text-admin-muted">
                      Download the user import template
                    </div>
                  </div>
                </div>
                <button className="h-9 px-3 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Template
                </button>
              </div>

              {/* Dropzone */}
              <label
              htmlFor="user-import-file"
              className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-admin hover:bg-admin-bg/40 transition-colors">
              
                <input
                id="user-import-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) =>
                setImportFile(e.target.files?.[0]?.name ?? null)
                } />
              
                <UploadCloud className="w-8 h-8 text-admin-muted mx-auto mb-3" />
                {importFile ?
              <div className="text-[14px] font-bold text-admin-text flex items-center justify-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-admin" />
                    {importFile}
                  </div> :

              <>
                    <div className="text-[14px] font-semibold text-admin-text">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-[12px] text-admin-muted mt-1">
                      CSV or Excel — up to 1,000 users
                    </div>
                  </>
              }
              </label>

              {/* Required columns */}
              <div>
                <div className="text-[12px] font-bold text-admin-muted uppercase tracking-wider mb-2">
                  Required columns
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                'Full Name',
                'Email',
                'Role',
                'Institution',
                'District'].
                map((c) =>
                <span
                  key={c}
                  className="px-2.5 py-1 bg-admin-bg border border-border rounded text-[12px] font-medium text-admin-text">
                  
                      {c}
                    </span>
                )}
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded border-border text-admin focus:ring-admin" />
              
                <span className="text-[13px] text-admin-text">
                  Send invitation emails to imported users
                </span>
              </label>
            </div>

            <div className="p-6 border-t border-border bg-admin-bg flex gap-3">
              <button
              onClick={() => {
                setShowImport(false);
                setImportFile(null);
              }}
              className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
              
                Cancel
              </button>
              <button
              disabled={!importFile}
              onClick={() => {
                setShowImport(false);
                setImportFile(null);
                setImportSuccess(true);
              }}
              className="flex-1 h-10 bg-admin hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-md transition-colors flex items-center justify-center gap-2">
              
                <UploadCloud className="w-4 h-4" /> Import Users
              </button>
            </div>
          </div>
        </div>
      }

      <SuccessModal
        open={showSuccess}
        title="User saved"
        message="The user account has been created and an invitation email was sent."
        onClose={() => setShowSuccess(false)} />
      

      <SuccessModal
        open={importSuccess}
        title="Users imported"
        message="Your file was processed successfully. The new accounts have been added and invitation emails are on their way."
        onClose={() => setImportSuccess(false)} />
      
    </AdminLayout>);

}