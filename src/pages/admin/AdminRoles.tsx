import React, { useState, Fragment } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
export function AdminRoles() {
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('All Roles');
  const [showSuccess, setShowSuccess] = useState(false);
  const tabs = [
  'All Roles',
  'Administrator',
  'Epidemiologist',
  'Public Health Analyst',
  'District Health Officer'];

  const [matrix, setMatrix] = useState([
  {
    group: 'DATA ACCESS',
    perms: [
    {
      name: 'View national-level data',
      vals: [true, true, true, false]
    },
    {
      name: 'View all 30 districts',
      vals: [true, true, true, false]
    },
    {
      name: 'View own district only',
      vals: [true, true, true, true]
    },
    {
      name: 'Access laboratory data',
      vals: [true, true, true, false]
    }]

  },
  {
    group: 'AI & ANALYTICS',
    perms: [
    {
      name: 'Run AI risk predictions',
      vals: [true, true, true, false]
    },
    {
      name: 'Configure AI models',
      vals: [true, false, false, false]
    },
    {
      name: 'View risk scores',
      vals: [true, true, true, true]
    }]

  },
  {
    group: 'ALERTS',
    perms: [
    {
      name: 'Receive alerts',
      vals: [true, true, true, true]
    },
    {
      name: 'Configure alert thresholds',
      vals: [true, true, false, false]
    },
    {
      name: 'Acknowledge alerts',
      vals: [true, true, true, true]
    },
    {
      name: 'Escalate alerts',
      vals: [true, true, false, true]
    }]

  },
  {
    group: 'REPORTS',
    perms: [
    {
      name: 'Generate reports',
      vals: [true, true, true, true]
    },
    {
      name: 'Approve reports',
      vals: [true, true, false, false]
    },
    {
      name: 'Schedule auto-reports',
      vals: [true, false, false, false]
    }]

  },
  {
    group: 'USER & SYSTEM',
    perms: [
    {
      name: 'Manage users',
      vals: [true, false, false, false]
    },
    {
      name: 'View audit trail',
      vals: [true, false, false, false]
    },
    {
      name: 'System configuration',
      vals: [true, false, false, false]
    }]

  }]
  );
  const toggleCell = (gi: number, pi: number, vi: number) => {
    setMatrix((prev) =>
    prev.map((group, g) =>
    g !== gi ?
    group :
    {
      ...group,
      perms: group.perms.map((perm, p) =>
      p !== pi ?
      perm :
      {
        ...perm,
        vals: perm.vals.map((val, v) => v !== vi ? val : !val)
      }
      )
    }
    )
    );
    setHasChanges(true);
  };
  const handleSave = () => {
    setHasChanges(false);
    setShowSuccess(true);
  };
  return (
    <AdminLayout>
      {hasChanges &&
      <div className="mb-6 bg-admin-amber/10 border border-admin-amber/20 rounded-md p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-admin-amber shrink-0" />
          <p className="text-[14px] text-admin-text font-medium flex-1">
            You have unsaved changes to role permissions.
          </p>
          <button
          onClick={() => setHasChanges(false)}
          className="text-[13px] font-bold text-admin-amber hover:underline">
          
            Dismiss
          </button>
        </div>
      }

      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; Roles & Permissions
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          Roles & Permissions
        </h1>
        <p className="text-[14px] text-admin-muted">
          Control what each user role can see and do across all 18 system
          modules
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) =>
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${activeTab === t ? 'bg-admin text-white' : 'bg-white border border-border text-admin-muted hover:text-admin-text'}`}>
          
            {t}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden mb-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-text font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4 w-[300px]">Permission / Feature</th>
                <th className="px-4 py-4 text-center">Administrator</th>
                <th className="px-4 py-4 text-center">Epidemiologist</th>
                <th className="px-4 py-4 text-center">Analyst</th>
                <th className="px-4 py-4 text-center">District Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {matrix.map((group, i) =>
              <Fragment key={i}>
                  <tr className="bg-admin-bg/30">
                    <td
                    colSpan={5}
                    className="px-6 py-2 text-[11px] font-bold text-admin-muted uppercase tracking-wider">
                    
                      {group.group}
                    </td>
                  </tr>
                  {group.perms.map((perm, j) =>
                <tr key={j} className="hover:bg-admin-bg/10">
                      <td className="px-6 py-3 font-medium text-admin-text">
                        {perm.name}
                      </td>
                      {perm.vals.map((val, k) =>
                  <td key={k} className="px-4 py-3 text-center">
                          <button
                      onClick={() => toggleCell(i, j, k)}
                      aria-pressed={val}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded ${val ? 'bg-admin-accent/10 text-admin-accent hover:bg-admin-accent/20' : 'bg-admin-bg text-admin-muted hover:bg-border'} transition-colors`}>
                      
                            {val ?
                      <Check className="w-4 h-4" /> :

                      <X className="w-4 h-4" />
                      }
                          </button>
                        </td>
                  )}
                    </tr>
                )}
                </Fragment>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-border p-4 px-8 flex items-center justify-end gap-3 z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setHasChanges(false)}
          className="h-10 px-6 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
          
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          className="h-10 px-6 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
          
          Save Changes
        </button>
      </div>

      <SuccessModal
        open={showSuccess}
        title="Permissions updated"
        message="Role permission changes have been applied across all modules."
        onClose={() => setShowSuccess(false)} />
      
    </AdminLayout>);

}