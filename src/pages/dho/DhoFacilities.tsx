import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Phone } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { DhoLayout } from '../../components/dho/DhoLayout';
const FACILITIES = [
{
  name: 'Huye District Hospital',
  type: 'Hospital',
  sector: 'Huye',
  cases: '23',
  report: '✅ Reported 08:12',
  stock: '🟢 Good',
  stockColor: 'text-admin-accent',
  incharge: 'Dr. Mukamana',
  reported: true
},
{
  name: 'Tumba Health Center',
  type: 'Health Center',
  sector: 'Tumba',
  cases: '8',
  report: '✅ Reported 07:45',
  stock: '🔴 Critical — ORS out',
  stockColor: 'text-admin-red',
  incharge: 'Nurse Bizimana',
  reported: true,
  flag: true
},
{
  name: 'Ngoma Health Center',
  type: 'Health Center',
  sector: 'Ngoma',
  cases: '14',
  report: '✅ Reported 08:55',
  stock: '🟡 Medium',
  stockColor: 'text-admin-amber',
  incharge: 'Nurse Uwera',
  reported: true
},
{
  name: 'Mbazi Health Center',
  type: 'Health Center',
  sector: 'Mbazi',
  cases: '2',
  report: '✅ Reported 09:00',
  stock: '🟢 Good',
  stockColor: 'text-admin-accent',
  incharge: 'Nurse Kamanzi',
  reported: true
},
{
  name: 'Mukura Health Post',
  type: 'Health Post',
  sector: 'Mukura',
  cases: '—',
  report: '❌ Not Reported',
  stock: '🟡 Medium',
  stockColor: 'text-admin-amber',
  incharge: 'CHW Gasana',
  reported: false
}];

const caseBreakdown = [
{
  name: 'Cholera',
  v: 5,
  color: '#D32F2F'
},
{
  name: 'Malaria',
  v: 2,
  color: '#F59E0B'
},
{
  name: 'Diarrhea',
  v: 1,
  color: '#1D72B8'
}];

const stockLevels = [
{
  item: 'ORS',
  val: '0 units',
  status: 'Critical — restock needed',
  color: 'text-admin-red'
},
{
  item: 'Chlorine tablets',
  val: '12 units',
  status: 'Low',
  color: 'text-admin-red'
},
{
  item: 'Malaria RDTs',
  val: '45 units',
  status: 'Medium',
  color: 'text-admin-amber'
},
{
  item: 'ACT (malaria meds)',
  val: '120 units',
  status: 'Good',
  color: 'text-admin-accent'
},
{
  item: 'Paracetamol',
  val: '340 units',
  status: 'Good',
  color: 'text-admin-accent'
}];

export function DhoFacilities() {
  const { state, actions } = useApp();
  const [detail, setDetail] = useState<(typeof FACILITIES)[number] | null>(null);
  const [q, setQ] = useState('');
  const [typeF, setTypeF] = useState('All Types');
  const [statusF, setStatusF] = useState('All Status');
  const [stockF, setStockF] = useState('Stock: All');
  const [flagged, setFlagged] = useState<string[]>([]);
  const [resupply, setResupply] = useState<string[]>([]);
  const list = FACILITIES.filter(
    (f) =>
    (!q || f.name.toLowerCase().includes(q.toLowerCase()) || f.sector.toLowerCase().includes(q.toLowerCase())) && (
    typeF === 'All Types' || f.type === typeF) && (
    statusF === 'All Status' || (statusF === 'Reported') === f.reported) && (
    stockF === 'Stock: All' || f.stock.includes(stockF))
  );
  const lowStock = FACILITIES.filter((f) => !f.stock.includes('Good')).length;
  const notReported = FACILITIES.filter((f) => !f.reported).length;
  const phone = (f: (typeof FACILITIES)[number]) => `+250788${(f.name.length * 7919 % 900000 + 100000).toString()}`;
  return (
    <DhoLayout
      title="Health Facilities — Huye District"
      subtitle={`${FACILITIES.length} facilities | ${FACILITIES.length - notReported} reported today | ${notReported} pending`}
      breadcrumb="Health Facilities">
      
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          🏥 3 Hospitals
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          🏨 8 Health Centers
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold shadow-sm">
          🏠 4 Health Posts
        </div>
        <div className="bg-admin-amber/10 px-4 py-2 rounded-full border border-admin-amber/20 text-[13px] font-bold text-admin-amber shadow-sm">
          ⚠️ {lowStock} facilities with low stock
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search facility or sector..."
            className="h-10 pl-9 pr-4 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin w-[220px]" />
          
        </div>
        <select value={typeF} onChange={(e) => setTypeF(e.target.value)} aria-label="Type" className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
          <option>All Types</option>
          <option>Hospital</option>
          <option>Health Center</option>
          <option>Health Post</option>
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)} aria-label="Reporting status" className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
          <option>All Status</option>
          <option>Reported</option>
          <option>Not Reported</option>
        </select>
        <select value={stockF} onChange={(e) => setStockF(e.target.value)} aria-label="Stock" className="h-10 px-3 bg-white border border-border rounded-md text-[13px] focus:outline-none focus:border-admin">
          <option>Stock: All</option>
          <option>Good</option>
          <option>Low</option>
          <option>Critical</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3">Facility Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Cases Today</th>
                <th className="px-4 py-3">Reporting Status</th>
                <th className="px-4 py-3">Stock Status</th>
                <th className="px-4 py-3">In Charge</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.length === 0 &&
              <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-admin-muted">No facilities match these filters.</td>
                </tr>
              }
              {list.map((f, i) =>
              <tr
                key={i}
                className={`hover:bg-admin-bg/30 ${f.reported ? '' : 'bg-admin-amber/5'}`}>
                
                  <td className="px-4 py-3 font-bold text-admin-text">
                    {f.name}
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{f.type}</td>
                  <td className="px-4 py-3 text-admin-muted">{f.sector}</td>
                  <td className="px-4 py-3 text-admin-text">{f.cases}</td>
                  <td
                  className={`px-4 py-3 font-medium ${f.reported ? 'text-admin-text' : 'text-admin-amber'}`}>
                  
                    {!f.reported && state.remindersSent.includes(f.name) ? '📨 Reminder sent' : f.report}
                  </td>
                  <td className={`px-4 py-3 font-medium ${f.stockColor}`}>
                    {f.stock}
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{f.incharge}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-[12px] font-bold">
                      <button
                      onClick={() => setDetail(f)}
                      className="text-admin hover:underline">
                      
                        View
                      </button>
                      <span className="text-border">·</span>
                      {f.reported ?
                    <a href={`tel:${phone(f)}`} className="text-admin hover:underline">
                          Contact
                        </a> :

                    <button
                      onClick={() => actions.sendFacilityReminder([f.name])}
                      disabled={state.remindersSent.includes(f.name)}
                      className="text-admin hover:underline disabled:text-admin-muted disabled:no-underline">
                      
                          {state.remindersSent.includes(f.name) ? 'Reminded' : 'Send Reminder'}
                        </button>
                    }
                      {f.flag &&
                    <>
                          <span className="text-border">·</span>
                          <button
                        onClick={() => {
                          if (flagged.includes(f.name)) return;
                          setFlagged([...flagged, f.name]);
                          actions.logAdminEvent('Facilities', `Flagged facility for follow-up — ${f.name}`, f.stock);
                          actions.toast(`${f.name} flagged for follow-up. Logged in the audit trail.`, 'warning');
                        }}
                        className="text-admin-red hover:underline">
                        
                            {flagged.includes(f.name) ? '⚠️ Flagged' : '⚠️ Flag'}
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

      {detail &&
      <>
          <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setDetail(null)} />
        
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-admin-text">
                {detail.name}
              </h2>
              <button
              onClick={() => setDetail(null)}
              aria-label="Close"
              className="text-admin-muted hover:text-admin-text">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-[13px] font-bold text-admin-text mb-2">
                  Basic Info
                </h3>
                <div className="text-[13px] text-admin-muted space-y-1">
                  <div>Type: {detail.type} · Sector: {detail.sector}</div>
                  <div>In charge: {detail.incharge}</div>
                  <div>Phone: {phone(detail)}</div>
                  <div>Stock: {detail.stock} · {detail.report}</div>
                  <Link to={`/dho/risk-map?sector=${detail.sector}`} className="inline-block mt-1 text-admin font-bold hover:underline">View sector on risk map →</Link>
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-admin-text mb-2">
                  Today — Cases by Disease
                </h3>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caseBreakdown}>
                      <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: '#6B7280'
                      }} />
                    
                      <Bar dataKey="v" radius={[4, 4, 0, 0]} barSize={32}>
                        {caseBreakdown.map((e, i) =>
                      <Cell key={i} fill={e.color} />
                      )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-admin-text mb-2">
                  Stock Levels
                </h3>
                <div className="space-y-2">
                  {stockLevels.map((s, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between text-[13px] border-b border-border pb-2 last:border-0">
                  
                      <span className="text-admin-text font-medium">
                        {s.item}
                      </span>
                      <span className={`font-bold ${s.color}`}>
                        {s.val}{' '}
                        <span className="font-normal">({s.status})</span>
                      </span>
                    </div>
                )}
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-admin-text mb-2">
                  Reporting — Last 7 Days
                </h3>
                <div className="flex gap-1">
                  {['✅', '✅', '✅', '❌', '✅', '✅', '✅'].map((d, i) =>
                <span key={i} className="text-[16px]">
                      {d}
                    </span>
                )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border bg-admin-bg flex flex-col gap-3 shrink-0">
              <a href={`tel:${phone(detail)}`} className="h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Call {detail.incharge}
              </a>
              <button
              disabled={resupply.includes(detail.name)}
              onClick={() => {
                setResupply([...resupply, detail.name]);
                actions.sendNotification(
                  {
                    title: `Emergency resupply requested — ${detail.name}`,
                    body: `${detail.name} (${detail.sector}) reports: ${detail.stock}. Requested by the Huye DHO.`,
                    severity: 'orange',
                    roles: ['admin', 'epi']
                  },
                  { module: 'Facilities', action: `Requested emergency resupply — ${detail.name}` }
                );
                actions.toast('Emergency resupply request sent to RBC / Rwanda Medical Supply (simulated).');
              }}
              className="h-10 bg-admin hover:bg-admin-hover disabled:opacity-60 text-white text-[14px] font-semibold rounded-md">
              
                {resupply.includes(detail.name) ? '✓ Resupply requested' : 'Request Emergency Resupply'}
              </button>
            </div>
          </div>
        </>
      }
    </DhoLayout>);

}