import { useState } from 'react';
import { EpiLayout } from '../../components/epi/EpiLayout';
const OTHER_LABS: [string, string][] = [
['Rwamagana Hospital Lab', '🟢 Online | 4 pending'],
['Gihundwe Hospital Lab (Rusizi)', '🟢 Online | 7 pending'],
['Gisenyi Hospital Lab', '🟢 Online | 3 pending'],
['Kabgayi Hospital Lab', '🟢 Online | 2 pending'],
['Nyagatare Hospital Lab', '🟡 Delayed | 4 pending'],
['Kibogora Hospital Lab', '🟢 Online | 1 pending'],
['Byumba Hospital Lab', '🟢 Online | 2 pending'],
['Kigeme Hospital Lab', '🟢 Online | 3 pending']];

const LABS = [
{
  disease: 'Cholera',
  samples: 94,
  pos: 71,
  neg: 18,
  pend: 5,
  rate: '75.5%',
  turn: '1.8 days ✅',
  warn: false
},
{
  disease: 'Malaria (RDT)',
  samples: 167,
  pos: 43,
  neg: 119,
  pend: 5,
  rate: '25.7%',
  turn: '0.2 days ✅',
  warn: false
},
{
  disease: 'Measles',
  samples: 28,
  pos: 9,
  neg: 15,
  pend: 4,
  rate: '32.1%',
  turn: '4.1 days ⚠️',
  warn: false
},
{
  disease: 'Typhoid',
  samples: 32,
  pos: 4,
  neg: 22,
  pend: 6,
  rate: '12.5%',
  turn: '3.8 days ⚠️',
  warn: false
},
{
  disease: 'Mpox',
  samples: 4,
  pos: 0,
  neg: 1,
  pend: 3,
  rate: 'Pending',
  turn: '5.0 days 🔴',
  warn: true
}];

export function EpiLab() {
  const [allLabs, setAllLabs] = useState(false);
  return (
    <EpiLayout
      title="Laboratory Data Integration"
      subtitle="RBC National Reference Laboratory + District Laboratory Network"
      breadcrumb="Laboratory Data">
      
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
          <div className="text-[12px] font-medium text-epi-muted mb-1">
            Samples Collected This Week
          </div>
          <div className="text-[20px] font-bold text-epi-text">340</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
          <div className="text-[12px] font-medium text-epi-muted mb-1">
            Confirmed Positive
          </div>
          <div className="text-[20px] font-bold text-epi-text">
            127{' '}
            <span className="text-[12px] font-medium text-epi-muted">
              (37.4%)
            </span>
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
          <div className="text-[12px] font-medium text-epi-muted mb-1">
            Pending Results
          </div>
          <div className="text-[20px] font-bold text-epi-text">45</div>
        </div>
        <div className="bg-epi-amber/10 border border-epi-amber/30 rounded-lg p-4 shadow-sm">
          <div className="text-[12px] font-medium text-epi-amber mb-1">
            Average Turnaround
          </div>
          <div className="text-[20px] font-bold text-epi-amber">
            3.2 days ⚠️
          </div>
          <div className="text-[10px] font-medium text-epi-text mt-1">
            (above 2-day target)
          </div>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
          <div className="text-[12px] font-medium text-epi-muted mb-1">
            Labs Reporting
          </div>
          <div className="text-[20px] font-bold text-epi-text">8 / 12</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
          <div className="text-[12px] font-medium text-epi-muted mb-1">
            Discordant Cases
          </div>
          <div className="text-[20px] font-bold text-epi-text">6</div>
          <div className="text-[10px] font-medium text-epi-muted mt-1">
            (clinical vs lab mismatch)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[55%_45%] gap-6">
        {/* Left Col */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-epi-text">
                Confirmed Cases by Disease — This Week
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-epi-bg/50 text-epi-muted font-medium border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Disease</th>
                    <th className="px-4 py-3">Samples</th>
                    <th className="px-4 py-3 text-epi-red">Positive</th>
                    <th className="px-4 py-3">Negative</th>
                    <th className="px-4 py-3">Pending</th>
                    <th className="px-4 py-3">Conf. Rate</th>
                    <th className="px-4 py-3">Avg Turnaround</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {LABS.map((row, i) =>
                  <tr
                    key={i}
                    className={
                    row.warn ? 'bg-epi-amber/10' : 'hover:bg-epi-bg/30'
                    }>
                    
                      <td className="px-4 py-3 font-bold text-epi-text">
                        {row.disease}
                      </td>
                      <td className="px-4 py-3">{row.samples}</td>
                      <td className="px-4 py-3 font-bold text-epi-red">
                        {row.pos}
                      </td>
                      <td className="px-4 py-3">{row.neg}</td>
                      <td className="px-4 py-3 font-medium text-epi-amber">
                        {row.pend}
                      </td>
                      <td className="px-4 py-3 text-epi-muted">{row.rate}</td>
                      <td className="px-4 py-3 font-medium">{row.turn}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-epi-amber/10 border border-epi-amber/30 rounded-lg p-4 flex gap-3">
            <span className="text-[16px]">⚠️</span>
            <div className="text-[13px] text-epi-text font-medium leading-relaxed">
              <span className="font-bold">
                Average lab turnaround time is 3.2 days — above the 2-day
                target.
              </span>{' '}
              Delayed results slow outbreak response. Recommendation: prioritize
              cholera and suspected VHF samples.
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-5">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">
              45 Samples Awaiting Results
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-l-epi-red border border-border rounded-r-lg p-3 bg-white">
                <div className="text-[12px] font-bold text-epi-red mb-1">
                  🔴 URGENT — 3 Mpox samples
                </div>
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  Rubavu (DRC border)
                </div>
                <div className="text-[12px] text-epi-muted">
                  Sent June 3 | Day 2 pending | Expected: June 6
                </div>
              </div>
              <div className="border-l-4 border-l-epi-amber border border-border rounded-r-lg p-3 bg-white">
                <div className="text-[12px] font-bold text-epi-amber mb-1">
                  🟠 HIGH — 5 Cholera samples
                </div>
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  Rusizi District
                </div>
                <div className="text-[12px] text-epi-muted">
                  Sent June 4 | Day 1 pending | Expected: June 6
                </div>
              </div>
              <div className="border-l-4 border-l-border border border-border rounded-r-lg p-3 bg-white">
                <div className="text-[12px] font-bold text-epi-muted mb-1">
                  🟡 NORMAL — 37 other samples
                </div>
                <div className="text-[13px] font-bold text-epi-text mb-1">
                  Various districts
                </div>
                <div className="text-[12px] text-epi-muted">
                  Expected: June 6–8
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-5">
            <h2 className="text-[14px] font-bold text-epi-text mb-3">
              Lab Network Status
            </h2>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium text-epi-text">
                  RBC National Lab — Kigali
                </span>
                <span className="text-epi-muted">🟢 Online | 12 pending</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium text-epi-text">
                  Butare University Hospital Lab
                </span>
                <span className="text-epi-muted">🟢 Online | 8 pending</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-medium text-epi-text">
                  Ruhengeri Hospital Lab
                </span>
                <span className="text-epi-amber font-medium">
                  🟡 Delayed | 6 pending
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-epi-text">
                  Kibungo Hospital Lab
                </span>
                <span className="text-epi-muted">🟢 Online | 5 pending</span>
              </div>
              {allLabs && OTHER_LABS.map(([name, status]) =>
              <div key={name} className="flex justify-between items-center py-2 border-t border-border">
                  <span className="font-medium text-epi-text">{name}</span>
                  <span className={status.includes('Delayed') ? 'text-epi-amber font-medium' : 'text-epi-muted'}>{status}</span>
                </div>
              )}
            </div>
            <button onClick={() => setAllLabs(!allLabs)} className="text-[12px] font-bold text-epi hover:underline mt-3">
              {allLabs ? 'Show fewer ↑' : 'View all 12 labs →'}
            </button>
          </div>
        </div>
      </div>
    </EpiLayout>);

}