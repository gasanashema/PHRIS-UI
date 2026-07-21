import React, { useState } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import { Clock, X } from 'lucide-react';
const schedules = [
{
  source: 'DHIS2 / HMIS',
  freq: 'Every 2 hours',
  sched: 'Continuous',
  last: 'Today 13:00',
  next: 'Today 15:00',
  status: '🟢 On schedule'
},
{
  source: 'RBC Laboratory',
  freq: 'Every 1 hour',
  sched: 'Continuous',
  last: 'Today 12:45',
  next: 'Today 13:30',
  status: '🟢 On schedule'
},
{
  source: 'CHW Mobile Reports',
  freq: 'Daily',
  sched: '7:00 AM',
  last: 'Today 07:12',
  next: 'Tomorrow 07:00',
  status: '🟡 Delayed today'
},
{
  source: 'Rwanda Met Agency',
  freq: 'Daily',
  sched: '6:00 AM',
  last: 'June 2 (failed)',
  next: 'Tomorrow 06:00',
  status: '🔴 Offline',
  isError: true
},
{
  source: 'Pharmacy / FDA',
  freq: 'Every 4 hours',
  sched: 'Continuous',
  last: 'Today 11:00',
  next: 'Today 15:00',
  status: '🟢 On schedule'
},
{
  source: 'EMR Systems',
  freq: 'Every 6 hours',
  sched: 'Continuous',
  last: 'Today 09:00',
  next: 'Today 15:00',
  status: '🟡 Partial'
},
{
  source: 'WASAC',
  freq: 'Daily',
  sched: '6:00 AM',
  last: 'Today 06:00',
  next: 'Tomorrow 06:00',
  status: '🟢 On schedule'
},
{
  source: 'MINAGRI',
  freq: 'Daily',
  sched: '8:00 AM',
  last: 'Today 08:00',
  next: 'Tomorrow 08:00',
  status: '🟢 On schedule'
},
{
  source: 'NISR Census',
  freq: 'Manual only',
  sched: 'On demand',
  last: 'June 2, 2026',
  next: 'When uploaded',
  status: '🟢 No schedule needed',
  isManual: true
}];

export function IntegrationScheduling() {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <IntegrationLayout
      title="Data Pull Scheduling"
      subtitle="Configure when each data source is pulled into AI Vital"
      breadcrumb="Scheduling">
      
      <div className="bg-white border border-border rounded-lg p-4 mb-6 shadow-sm flex items-center gap-2">
        <Clock className="w-5 h-5 text-epi" />
        <span className="text-[14px] font-bold text-epi-text">
          Next scheduled run: RBC Lab API — in 12 minutes (13:30)
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Frequency
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Schedule
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Last Run
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Next Run
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedules.map((s, idx) =>
              <tr
                key={idx}
                className={`hover:bg-epi-bg/50 transition-colors ${s.isError ? 'bg-epi-red/5' : ''}`}>
                
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    {s.source}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{s.freq}</td>
                  <td className="p-4 text-[13px] text-epi-text">{s.sched}</td>
                  <td className="p-4 text-[13px] text-epi-text">{s.last}</td>
                  <td className="p-4 text-[13px] text-epi-text">{s.next}</td>
                  <td
                  className={`p-4 text-[13px] font-bold ${s.isError ? 'text-epi-red' : ''}`}>
                  
                    {s.status}
                  </td>
                  <td className="p-4 text-right">
                    {s.isManual ?
                  <span className="text-epi-muted">—</span> :

                  <div className="flex items-center justify-end gap-2">
                        <button
                      onClick={() => setShowEdit(true)}
                      className="text-[13px] font-medium text-epi hover:underline">
                      
                          Edit
                        </button>
                        {s.isError && <span className="text-epi-muted">·</span>}
                        {s.isError &&
                    <button className="text-[13px] font-medium text-epi hover:underline">
                            Force Retry
                          </button>
                    }
                      </div>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Panel */}
        {showEdit &&
        <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-right">
            <div className="p-6 border-b border-border flex items-center justify-between bg-epi-bg/50">
              <h2 className="text-[18px] font-bold text-epi-text">
                Edit Schedule — DHIS2 / HMIS
              </h2>
              <button
              onClick={() => setShowEdit(false)}
              className="p-2 hover:bg-white rounded-full text-epi-muted">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Pull Frequency
                </label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                  <option>Every 30 min</option>
                  <option>Hourly</option>
                  <option selected>Every 2 hours</option>
                  <option>Every 6 hours</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Manual only</option>
                </select>
              </div>

              <div className="bg-epi-bg p-4 rounded-lg border border-border space-y-4">
                <h3 className="text-[13px] font-bold text-epi-text">
                  Retry on failure
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-epi-muted">
                    Max retries:
                  </span>
                  <select className="border border-border rounded px-2 py-1 text-[13px] focus:outline-none bg-white">
                    <option>1</option>
                    <option>2</option>
                    <option selected>3</option>
                    <option>5</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-epi-muted">
                    Retry interval:
                  </span>
                  <select className="border border-border rounded px-2 py-1 text-[13px] focus:outline-none bg-white">
                    <option>5 min</option>
                    <option>10 min</option>
                    <option selected>15 min</option>
                    <option>30 min</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-epi-text">
                  Alert admin if missed runs &gt;
                </span>
                <select className="border border-border rounded px-2 py-1 text-[13px] focus:outline-none bg-white">
                  <option>1</option>
                  <option selected>2</option>
                  <option>3</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-5 bg-epi rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-[14px] font-bold text-epi-text">
                  Active schedule
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-epi-bg/50 flex items-center justify-end gap-3">
              <button
              onClick={() => setShowEdit(false)}
              className="text-[13px] font-bold text-epi-muted hover:text-epi-text mr-auto">
              
                Cancel
              </button>
              <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Force Run Now
              </button>
              <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
                Save Schedule
              </button>
            </div>
          </div>
        }
      </div>
    </IntegrationLayout>);

}