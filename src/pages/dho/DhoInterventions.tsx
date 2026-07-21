import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
const SECTORS = [
'Tumba',
'Ngoma',
'Mbazi',
'Mukura',
'Huye',
'Ruhashya',
'Maraba',
'Sovu',
'Kinazi',
'Rwaniro'];

const INTERVENTIONS = [
{
  date: 'June 4, 2026',
  action: 'Deployed ORS supplies to Tumba HC',
  disease: 'Cholera',
  sector: 'Tumba',
  who: 'Emmanuel Nkurunziza',
  status: 'Ongoing',
  outcome: 'Pending evaluation'
},
{
  date: 'June 3, 2026',
  action: 'Water source inspection',
  disease: 'Cholera',
  sector: 'Tumba',
  who: 'WASAC + DHO',
  status: 'Ongoing',
  outcome: '2 of 4 sources inspected'
},
{
  date: 'May 28, 2026',
  action: 'Organized measles vaccination outreach',
  disease: 'Measles',
  sector: 'Mukura',
  who: 'Mukura Health Center',
  status: 'Completed',
  outcome: '847 children vaccinated'
},
{
  date: 'May 25, 2026',
  action: 'Malaria spray campaign',
  disease: 'Malaria',
  sector: 'Ngoma',
  who: 'RBC + District',
  status: 'Completed',
  outcome: '1,240 households covered'
},
{
  date: 'May 20, 2026',
  action: 'CHW refresher training',
  disease: 'General',
  sector: 'All sectors',
  who: 'Emmanuel Nkurunziza',
  status: 'Overdue',
  outcome: 'Scheduled for June 1 — not completed'
}];

const statusBadge = (s: string) => {
  if (s === 'Ongoing')
  return <span className="text-admin-amber font-semibold">🟡 Ongoing</span>;
  if (s === 'Completed')
  return <span className="text-admin-accent font-semibold">✅ Completed</span>;
  return <span className="text-admin-red font-semibold">⏰ Overdue</span>;
};
export function DhoInterventions() {
  const [open, setOpen] = useState(false);
  return (
    <DhoLayout
      title="Intervention Tracker — Huye District"
      subtitle="Record and monitor all district health response actions"
      breadcrumb="Interventions">
      
      {/* Summary stats + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
            🎯 8 Total Interventions
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm text-admin-amber">
            🟡 3 Ongoing
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm text-admin-accent">
            ✅ 4 Completed
          </div>
          <div className="bg-admin-red/10 px-4 py-2 rounded-full border border-admin-red/20 text-[13px] font-bold shadow-sm text-admin-red">
            ⏰ 1 Overdue
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-10 px-5 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md flex items-center gap-2">
          
          <Plus className="w-4 h-4" /> Log New Intervention
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Disease</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Responsible</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INTERVENTIONS.map((it, i) =>
              <tr
                key={i}
                className={`hover:bg-admin-bg/30 ${it.status === 'Overdue' ? 'bg-admin-red/5' : ''}`}>
                
                  <td className="px-4 py-3 text-admin-muted whitespace-nowrap">
                    {it.date}
                  </td>
                  <td className="px-4 py-3 font-bold text-admin-text">
                    {it.action}
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{it.disease}</td>
                  <td className="px-4 py-3 text-admin-muted">{it.sector}</td>
                  <td className="px-4 py-3 text-admin-muted">{it.who}</td>
                  <td className="px-4 py-3">{statusBadge(it.status)}</td>
                  <td className="px-4 py-3 text-admin-muted">{it.outcome}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                      <button className="text-admin hover:underline">
                        {it.status === 'Overdue' ?
                      'Reschedule' :
                      it.status === 'Completed' ?
                      'View' :
                      'Update'}
                      </button>
                      {it.status !== 'Completed' &&
                    <>
                          <span className="text-border">·</span>
                          <button className="text-admin hover:underline">
                            View
                          </button>
                        </>
                    }
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out form */}
      {open &&
      <>
          <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setOpen(false)} />
        
          <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-admin-text">
                Log New Intervention
              </h2>
              <button
              onClick={() => setOpen(false)}
              className="text-admin-muted hover:text-admin-text">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <Field label="Date">
                <input
                type="date"
                className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />
              
              </Field>
              <Field label="Action Description">
                <textarea
                rows={3}
                placeholder="Describe the response action..."
                className="w-full px-3 py-2 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin resize-none" />
              
              </Field>
              <Field label="Disease / Concern">
                <input
                type="text"
                placeholder="e.g. Cholera"
                className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />
              
              </Field>
              <Field label="Sector">
                <select className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
                  {SECTORS.map((s) =>
                <option key={s}>{s}</option>
                )}
                </select>
              </Field>
              <Field label="Responsible Person / Team">
                <input
                type="text"
                placeholder="e.g. Emmanuel Nkurunziza"
                className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />
              
              </Field>
              <Field label="Expected Completion Date">
                <input
                type="date"
                className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />
              
              </Field>
              <Field label="Link to Alert (optional)">
                <select className="w-full h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
                  <option>— None —</option>
                  <option>ALT-2026-051 — Cholera, Tumba</option>
                  <option>ALT-2026-049 — Malaria, Ngoma</option>
                  <option>ALT-2026-047 — Measles, Mukura</option>
                </select>
              </Field>
              <Field label="Notes">
                <textarea
                rows={2}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin resize-none" />
              
              </Field>
            </div>
            <div className="p-6 border-t border-border bg-admin-bg flex gap-3 shrink-0">
              <button
              onClick={() => setOpen(false)}
              className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md">
              
                Save Intervention
              </button>
              <button
              onClick={() => setOpen(false)}
              className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-muted text-[14px] font-semibold rounded-md">
              
                Cancel
              </button>
            </div>
          </div>
        </>
      }
    </DhoLayout>);

}
function Field({
  label,
  children



}: {label: string;children: React.ReactNode;}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
        {label}
      </label>
      {children}
    </div>);

}