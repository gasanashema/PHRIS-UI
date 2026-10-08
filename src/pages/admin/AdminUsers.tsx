import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { ConfirmModal } from '../../components/dho/ConfirmModal';
import { useApp } from '../../store/AppStore';
import { DISTRICTS } from '../../data/seed';
import { downloadFile, toCSV } from '../../lib/format';
import type { AdminUser } from '../../types';

const PAGE_SIZE = 8;
const ROLES = ['Administrator', 'Epidemiologist', 'Public Health Analyst', 'District Health Officer', 'Data Integration Engineer'];
const INSTITUTIONS = ['RBC', 'MOH', 'NISR', 'District Health Office', 'Health Center'];
const STATUS_ICON: Record<AdminUser['status'], string> = {
  Active: '🟢 Active',
  Inactive: '🟡 Inactive',
  'Pending Approval': '🟠 Pending Approval'
};

type Draft = Omit<AdminUser, 'id' | 'login'>;
const EMPTY: Draft = { name: '', email: '', phone: '', role: '', inst: 'RBC', dist: 'National', status: 'Active', mfa: true };

export function AdminUsers() {
  const { state, actions } = useApp();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [roleF, setRoleF] = useState('All Roles');
  const [instF, setInstF] = useState('All Institutions');
  const [distF, setDistF] = useState('All Districts');
  const [statusF, setStatusF] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [drawer, setDrawer] = useState<{open: boolean;editing?: AdminUser;}>({ open: false });
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState<{title: string;message: string;} | null>(null);
  const [confirm, setConfirm] = useState<{title: string;message: string;label: string;destructive?: boolean;run: () => void;} | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<string | null>(null);

  useEffect(() => {
    if (params.get('q') !== null) setQ(params.get('q') ?? '');
  }, [params]);

  const users = state.users;
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return users.filter(
      (u) =>
      (!t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t)) && (
      roleF === 'All Roles' || u.role === roleF) && (
      instF === 'All Institutions' || u.inst.includes(instF.replace('District Health Office', 'DHO'))) && (
      distF === 'All Districts' || u.dist === distF) && (
      statusF === 'All' || u.status === statusF)
    );
  }, [users, q, roleF, instF, distF, statusF]);

  useEffect(() => setPage(1), [q, roleF, instF, distF, statusF]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allOnPage = pageRows.length > 0 && pageRows.every((u) => selected.includes(u.id));

  const toggleSelect = (id: number) =>
  setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () =>
  setSelected(allOnPage ? selected.filter((id) => !pageRows.some((u) => u.id === id)) : Array.from(new Set([...selected, ...pageRows.map((u) => u.id)])));

  const openNew = () => {
    setDraft(EMPTY);
    setTouched(false);
    setDrawer({ open: true });
  };
  const openEdit = (u: AdminUser) => {
    const { id: _id, login: _login, ...rest } = u;
    setDraft(rest);
    setTouched(false);
    setDrawer({ open: true, editing: u });
  };

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email);
  const emailTaken = users.some((u) => u.email.toLowerCase() === draft.email.toLowerCase() && u.id !== drawer.editing?.id);
  const valid = draft.name.trim() && emailOk && !emailTaken && draft.role && (draft.role !== 'District Health Officer' || draft.dist !== 'National');

  const saveUser = () => {
    setTouched(true);
    if (!valid) return;
    if (drawer.editing) {
      actions.updateUser(drawer.editing.id, draft);
      setSuccess({ title: 'User updated', message: `${draft.name}'s account details were saved.` });
    } else {
      actions.addUser(draft);
      setSuccess({ title: 'User saved', message: `The account for ${draft.name} has been created and an invitation email was sent (simulated).` });
    }
    setDrawer({ open: false });
  };

  const bulk = (label: string, run: () => void, destructive = false) =>
  setConfirm({
    title: `${label} ${selected.length} user${selected.length > 1 ? 's' : ''}?`,
    message: 'This action applies to every selected account and is logged in the audit trail.',
    label,
    destructive,
    run: () => {
      run();
      setSelected([]);
    }
  });

  const exportCsv = (list: AdminUser[]) => {
    downloadFile(
      'aivital-users.csv',
      toCSV(list.map((u) => ({ name: u.name, email: u.email, role: u.role, institution: u.inst, district: u.dist, status: u.status, last_login: u.login }))),
      'text/csv'
    );
    actions.toast(`Exported ${list.length} users to CSV.`, 'info');
  };

  const selectCls = 'h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin';
  const fieldCls = (bad: boolean) =>
  `w-full h-10 px-3 border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none bg-white ${bad ? 'border-admin-red' : 'border-border'}`;

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; User Management</div>
        <h1 className="text-[24px] font-bold text-admin-text">User Management</h1>
        <p className="text-[14px] text-admin-muted">
          {users.length} registered users · {users.filter((u) => u.status === 'Pending Approval').length} awaiting approval
        </p>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email..."
              className="h-10 pl-9 pr-4 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin w-[220px]" />

          </div>
          <select value={roleF} onChange={(e) => setRoleF(e.target.value)} className={selectCls} aria-label="Role">
            <option>All Roles</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={instF} onChange={(e) => setInstF(e.target.value)} className={selectCls} aria-label="Institution">
            <option>All Institutions</option>
            {INSTITUTIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={distF} onChange={(e) => setDistF(e.target.value)} className={selectCls} aria-label="District">
            <option>All Districts</option>
            <option>National</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className={selectCls} aria-label="Status">
            <option value="All">Status — All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending Approval</option>
          </select>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowImport(true)}
            className="h-10 px-4 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">

            <Upload className="w-4 h-4" /> Import Users
          </button>
          <button
            onClick={openNew}
            className="h-10 px-4 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">

            <Plus className="w-4 h-4" /> Add New User
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 &&
      <div className="bg-admin-sidebar text-white px-6 py-3 rounded-t-lg flex flex-wrap items-center justify-between gap-3">
          <span className="text-[14px] font-medium">{selected.length} users selected</span>
          <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold">
            <button onClick={() => bulk('Activate', () => actions.setUsersStatus(selected, 'Active'))} className="hover:text-admin-accent transition-colors">
              Activate
            </button>
            <button onClick={() => bulk('Deactivate', () => actions.setUsersStatus(selected, 'Inactive'))} className="hover:text-admin-amber transition-colors">
              Deactivate
            </button>
            <button
            onClick={() =>
            bulk('Reset password for', () => {
              actions.logAdminEvent('User Mgmt', `Sent password reset to ${selected.length} user(s)`);
              actions.toast(`Password reset links sent to ${selected.length} users (simulated).`);
            })
            }
            className="hover:text-admin-accent transition-colors">

              Reset Password
            </button>
            <button onClick={() => bulk('Delete', () => actions.deleteUsers(selected), true)} className="hover:text-admin-red transition-colors">
              Delete
            </button>
            <button onClick={() => exportCsv(users.filter((u) => selected.includes(u.id)))} className="hover:text-white/70 transition-colors">
              Export
            </button>
            <button onClick={() => setSelected([])} className="text-white/70 hover:text-white" aria-label="Clear selection">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      }

      {/* Table */}
      <div className={`bg-white shadow-sm border border-border overflow-hidden ${selected.length > 0 ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Select all on page" className="rounded border-border text-admin focus:ring-admin" />
                </th>
                {['Full Name', 'Email', 'Role', 'Institution', 'District', 'Last Login', 'Status'].map((h) =>
                <th key={h} className="px-4 py-3">{h}</th>
                )}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows.length === 0 &&
              <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-admin-muted">No users match these filters.</td>
                </tr>
              }
              {pageRows.map((u) => {
                const pending = u.status === 'Pending Approval';
                return (
                  <tr key={u.id} className={`hover:bg-admin-bg/30 ${pending ? 'bg-admin-amber/5' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} aria-label={`Select ${u.name}`} className="rounded border-border text-admin focus:ring-admin" />
                    </td>
                    <td className="px-4 py-3 font-bold text-admin-text">{u.name}</td>
                    <td className="px-4 py-3 text-admin-muted">{u.email}</td>
                    <td className="px-4 py-3 text-admin-text">{u.role}</td>
                    <td className="px-4 py-3 text-admin-muted">{u.inst}</td>
                    <td className="px-4 py-3 text-admin-muted">{u.dist}</td>
                    <td className="px-4 py-3 text-admin-muted">{u.login}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{STATUS_ICON[u.status]}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {pending ?
                      <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                          <button
                          onClick={() => {
                            actions.setUsersStatus([u.id], 'Active');
                            actions.toast(`${u.name} approved — activation email sent (simulated).`);
                          }}
                          className="text-admin-accent hover:underline">

                            Approve
                          </button>
                          <span className="text-border">·</span>
                          <button
                          onClick={() =>
                          setConfirm({
                            title: `Reject ${u.name}?`,
                            message: 'The access request will be removed and the applicant notified by email.',
                            label: 'Reject Request',
                            destructive: true,
                            run: () => actions.deleteUsers([u.id])
                          })
                          }
                          className="text-admin-red hover:underline">

                            Reject
                          </button>
                        </div> :

                      <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                          <button onClick={() => openEdit(u)} className="text-admin hover:underline">Edit</button>
                          <span className="text-border">·</span>
                          <button
                          onClick={() => {
                            actions.setUsersStatus([u.id], u.status === 'Inactive' ? 'Active' : 'Inactive');
                            actions.toast(`${u.name} ${u.status === 'Inactive' ? 'activated' : 'deactivated'}.`);
                          }}
                          className={u.status === 'Inactive' ? 'text-admin-accent hover:underline' : 'text-admin-amber hover:underline'}>

                            {u.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                          </button>
                        </div>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3 bg-admin-bg/30">
          <span className="text-[13px] text-admin-muted">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-muted disabled:opacity-40">

              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded text-[13px] font-medium ${n === page ? 'bg-admin text-white' : 'hover:bg-border text-admin-text'}`}>

                {n}
              </button>
            )}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              aria-label="Next page"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-border text-admin-muted disabled:opacity-40">

              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => exportCsv(filtered)} className="ml-3 h-8 px-3 border border-border rounded text-[12px] font-semibold text-admin-text hover:bg-white flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      {drawer.open &&
      <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDrawer({ open: false })} />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-admin-text">{drawer.editing ? `Edit User — ${drawer.editing.name}` : 'Add New User'}</h2>
              <button onClick={() => setDrawer({ open: false })} aria-label="Close" className="text-admin-muted hover:text-admin-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Full Name</label>
                <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={fieldCls(touched && !draft.name.trim())} />
                {touched && !draft.name.trim() && <p className="text-[12px] text-admin-red">Name is required.</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Email</label>
                <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={fieldCls(touched && (!emailOk || emailTaken))} />
                {touched && !emailOk && <p className="text-[12px] text-admin-red">Enter a valid email address.</p>}
                {emailTaken && <p className="text-[12px] text-admin-red">A user with this email already exists.</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Phone</label>
                <div className="flex">
                  <div className="h-10 px-3 bg-admin-bg border border-border border-r-0 rounded-l-md flex items-center text-admin-text font-medium text-[14px]">+250</div>
                  <input type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="flex-1 min-w-0 h-10 px-3 border border-border rounded-r-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Institution</label>
                <input type="text" value={draft.inst} onChange={(e) => setDraft({ ...draft, inst: e.target.value })} className={fieldCls(false)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Role</label>
                <select
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value, dist: e.target.value === 'District Health Officer' ? draft.dist === 'National' ? 'Huye' : draft.dist : 'National' })}
                className={fieldCls(touched && !draft.role)}>

                  <option value="">Select role...</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                {touched && !draft.role && <p className="text-[12px] text-admin-red">Select a role.</p>}
              </div>

              {draft.role === 'District Health Officer' &&
            <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-admin-text">District Assignment</label>
                  <select value={draft.dist} onChange={(e) => setDraft({ ...draft, dist: e.target.value })} className={fieldCls(false)}>
                    {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
            }

              <div className="pt-4 border-t border-border space-y-4">
                {[
              { k: 'status' as const, title: 'Status', sub: 'User can log in', on: draft.status === 'Active' },
              { k: 'mfa' as const, title: 'MFA Required', sub: 'Enforce 2FA on next login', on: draft.mfa }].
              map((t) =>
              <div key={t.k} className="flex items-center justify-between">
                    <div>
                      <div className="text-[14px] font-medium text-admin-text">{t.title}</div>
                      <div className="text-[12px] text-admin-muted">{t.sub}</div>
                    </div>
                    <button
                  type="button"
                  role="switch"
                  aria-checked={t.on}
                  aria-label={t.title}
                  onClick={() =>
                  t.k === 'status' ?
                  setDraft({ ...draft, status: draft.status === 'Active' ? 'Inactive' : 'Active' }) :
                  setDraft({ ...draft, mfa: !draft.mfa })
                  }
                  className={`w-11 h-6 rounded-full relative transition-colors ${t.on ? 'bg-admin-accent' : 'bg-border'}`}>

                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${t.on ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
              )}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-admin-bg flex gap-3 shrink-0">
              <button onClick={() => setDrawer({ open: false })} className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
                Cancel
              </button>
              <button onClick={saveUser} className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
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
                <h2 className="text-[18px] font-bold text-admin-text">Import Users</h2>
              </div>
              <button
              onClick={() => {
                setShowImport(false);
                setImportFile(null);
              }}
              aria-label="Close"
              className="text-admin-muted hover:text-admin-text">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-[14px] text-admin-muted leading-relaxed">
                Bulk-add users by uploading a CSV or Excel file. Each row will be created as a pending account and sent
                an invitation email.
              </p>
              <div className="flex items-center justify-between p-4 bg-admin-bg rounded-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-border flex items-center justify-center text-admin">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-admin-text">Need the format?</div>
                    <div className="text-[12px] text-admin-muted">Download the user import template</div>
                  </div>
                </div>
                <button
                onClick={() =>
                downloadFile(
                  'aivital-user-import-template.csv',
                  'Full Name,Email,Role,Institution,District\nJane Doe,jane.doe@moh.gov.rw,District Health Officer,Nyanza DHO,Nyanza\n',
                  'text/csv'
                )
                }
                className="h-9 px-3 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2">

                  <Download className="w-4 h-4" /> Template
                </button>
              </div>
              <label
              htmlFor="user-import-file"
              className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-admin hover:bg-admin-bg/40 transition-colors">

                <input id="user-import-file" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => setImportFile(e.target.files?.[0]?.name ?? null)} />
                <UploadCloud className="w-8 h-8 text-admin-muted mx-auto mb-3" />
                {importFile ?
              <div className="text-[14px] font-bold text-admin-text flex items-center justify-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-admin" />
                    {importFile}
                  </div> :

              <>
                    <div className="text-[14px] font-semibold text-admin-text">Click to upload or drag and drop</div>
                    <div className="text-[12px] text-admin-muted mt-1">CSV or Excel — up to 1,000 users</div>
                  </>
              }
              </label>
              <div>
                <div className="text-[12px] font-bold text-admin-muted uppercase tracking-wider mb-2">Required columns</div>
                <div className="flex flex-wrap gap-2">
                  {['Full Name', 'Email', 'Role', 'Institution', 'District'].map((c) =>
                <span key={c} className="px-2.5 py-1 bg-admin-bg border border-border rounded text-[12px] font-medium text-admin-text">{c}</span>
                )}
                </div>
              </div>
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
                actions.importUsers(3, importFile!);
                setShowImport(false);
                setImportFile(null);
                setStatusF('Pending Approval');
                setSuccess({ title: 'Users imported', message: '3 accounts were created as Pending Approval from your file (simulated parsing). Review and approve them in the list.' });
              }}
              className="flex-1 h-10 bg-admin hover:bg-admin-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-md transition-colors flex items-center justify-center gap-2">

                <UploadCloud className="w-4 h-4" /> Import Users
              </button>
            </div>
          </div>
        </div>
      }

      <SuccessModal open={!!success} title={success?.title ?? ''} message={success?.message ?? ''} onClose={() => setSuccess(null)} />
      <ConfirmModal
        open={!!confirm}
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        confirmLabel={confirm?.label}
        destructive={confirm?.destructive}
        onConfirm={() => {
          confirm?.run();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)} />

    </AdminLayout>);

}
