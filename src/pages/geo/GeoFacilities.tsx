import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { useApp } from '../../store/AppStore';
import { DISTRICT_XY } from '../../data/geo';
import { downloadFile, fmtDate, nowISO } from '../../lib/format';

type FType = 'Referral Hospital' | 'District Hospital' | 'Health Center' | 'Health Post';
type Stock = 'Good' | 'Low' | 'Out';
interface Facility {
  name: string;
  type: FType;
  district: string;
  sector: string;
  dx: number;
  dy: number; // offset from district centroid (%)
  catchment: number;
  cases: number;
  reportedAt?: string; // undefined = not reported today
  daysLate?: number;
  stock: {ORS: Stock;RDT: Stock;ACT: Stock;Chlorine: Stock;};
  incharge: string;
  phone: string;
}
const ok = { ORS: 'Good', RDT: 'Good', ACT: 'Good', Chlorine: 'Good' } as const;
const FACILITIES: Facility[] = [
{ name: 'CHUB (Butare University Hospital)', type: 'Referral Hospital', district: 'Huye', sector: 'Ngoma', dx: 2, dy: -2, catchment: 450000, cases: 41, reportedAt: '07:30', stock: ok, incharge: 'Dr. Ntaganda', phone: '+250 788 100 100' },
{ name: 'Huye District Hospital', type: 'District Hospital', district: 'Huye', sector: 'Huye', dx: -3, dy: 2, catchment: 45000, cases: 23, reportedAt: '08:12', stock: ok, incharge: 'Dr. Mukamana', phone: '+250 788 100 400' },
{ name: 'Tumba Health Center', type: 'Health Center', district: 'Huye', sector: 'Tumba', dx: 3, dy: 4, catchment: 18000, cases: 8, reportedAt: '07:45', stock: { ORS: 'Out', RDT: 'Good', ACT: 'Good', Chlorine: 'Low' }, incharge: 'Nurse Bizimana', phone: '+250 788 100 411' },
{ name: 'Mukura Health Post', type: 'Health Post', district: 'Huye', sector: 'Mukura', dx: -5, dy: -3, catchment: 6000, cases: 0, daysLate: 2, stock: { ORS: 'Good', RDT: 'Low', ACT: 'Good', Chlorine: 'Good' }, incharge: 'CHW Gasana', phone: '+250 788 100 433' },
{ name: 'Kinazi Health Post', type: 'Health Post', district: 'Huye', sector: 'Kinazi', dx: 4, dy: -4, catchment: 5200, cases: 0, daysLate: 1, stock: ok, incharge: 'CHW Mutesi', phone: '+250 788 100 438' },
{ name: 'Ruhengeri Referral Hospital', type: 'Referral Hospital', district: 'Musanze', sector: 'Muhoza', dx: 0, dy: 2, catchment: 380000, cases: 19, reportedAt: '08:40', stock: ok, incharge: 'Dr. Habyarimana', phone: '+250 788 200 100' },
{ name: 'Gisenyi District Hospital', type: 'District Hospital', district: 'Rubavu', sector: 'Gisenyi', dx: -2, dy: 2, catchment: 160000, cases: 15, reportedAt: '08:05', stock: ok, incharge: 'Dr. Uwase', phone: '+250 788 200 300' },
{ name: 'Gihundwe District Hospital', type: 'District Hospital', district: 'Rusizi', sector: 'Kamembe', dx: 3, dy: -3, catchment: 210000, cases: 52, reportedAt: '07:55', stock: { ORS: 'Low', RDT: 'Good', ACT: 'Good', Chlorine: 'Low' }, incharge: 'Dr. Niyonsaba', phone: '+250 788 300 100' },
{ name: 'Bugarama Health Center', type: 'Health Center', district: 'Rusizi', sector: 'Bugarama', dx: -3, dy: 4, catchment: 24000, cases: 31, reportedAt: '08:20', stock: { ORS: 'Good', RDT: 'Good', ACT: 'Good', Chlorine: 'Low' }, incharge: 'Nurse Iradukunda', phone: '+250 788 300 122' },
{ name: 'Kibungo Referral Hospital', type: 'Referral Hospital', district: 'Ngoma', sector: 'Kibungo', dx: 0, dy: 0, catchment: 300000, cases: 22, reportedAt: '08:30', stock: ok, incharge: 'Dr. Kayitesi', phone: '+250 788 400 100' },
{ name: 'Rukara Health Center', type: 'Health Center', district: 'Kayonza', sector: 'Rukara', dx: -2, dy: -3, catchment: 21000, cases: 38, reportedAt: '09:10', stock: { ORS: 'Good', RDT: 'Low', ACT: 'Low', Chlorine: 'Good' }, incharge: 'Nurse Mugabo', phone: '+250 788 400 211' },
{ name: 'Kigeme Health Center', type: 'Health Center', district: 'Nyamagabe', sector: 'Kigeme', dx: 2, dy: 2, catchment: 19000, cases: 6, daysLate: 1, stock: { ORS: 'Good', RDT: 'Low', ACT: 'Good', Chlorine: 'Good' }, incharge: 'Nurse Uwimana', phone: '+250 788 500 140' },
{ name: 'Ngororero Health Center', type: 'Health Center', district: 'Ngororero', sector: 'Ngororero', dx: 0, dy: 2, catchment: 17000, cases: 5, daysLate: 0, stock: ok, incharge: 'Nurse Hakizimana', phone: '+250 788 500 220' },
{ name: 'Mushonyi Health Post', type: 'Health Post', district: 'Rutsiro', sector: 'Mushonyi', dx: 2, dy: 3, catchment: 4800, cases: 0, daysLate: 0, stock: ok, incharge: 'CHW Nshimiyimana', phone: '+250 788 500 260' },
{ name: 'CHUK (Kigali University Hospital)', type: 'Referral Hospital', district: 'Nyarugenge', sector: 'Nyarugenge', dx: 0, dy: 0, catchment: 1200000, cases: 64, reportedAt: '07:15', stock: ok, incharge: 'Dr. Mugisha', phone: '+250 788 600 100' },
{ name: 'Kacyiru Health Center', type: 'Health Center', district: 'Gasabo', sector: 'Kacyiru', dx: 0, dy: 2, catchment: 42000, cases: 11, reportedAt: '08:00', stock: ok, incharge: 'Nurse Ingabire', phone: '+250 788 600 210' },
{ name: 'Nyagatare District Hospital', type: 'District Hospital', district: 'Nyagatare', sector: 'Nyagatare', dx: 0, dy: 3, catchment: 250000, cases: 27, reportedAt: '08:45', stock: { ORS: 'Good', RDT: 'Low', ACT: 'Good', Chlorine: 'Good' }, incharge: 'Dr. Rutayisire', phone: '+250 788 700 100' }];

const NATIONAL = { total: 924, hospitals: 44, centers: 501, posts: 379, notReported: 77 };
const STOCK_ICON: Record<Stock, string> = { Good: '🟢', Low: '🟠', Out: '🔴' };
const worstStock = (f: Facility): Stock => Object.values(f.stock).includes('Out') ? 'Out' : Object.values(f.stock).includes('Low') ? 'Low' : 'Good';
const selectCls = 'text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm';

export function GeoFacilities() {
  const { state, actions } = useApp();
  const [type, setType] = useState('All');
  const [reporting, setReporting] = useState('All');
  const [stock, setStock] = useState('All');
  const [district, setDistrict] = useState('All');
  const [selected, setSelected] = useState<string | null>('Huye District Hospital');
  const [allStock, setAllStock] = useState(false);
  const [flagged, setFlagged] = useState<string[]>([]);

  const reported = (f: Facility) => !!f.reportedAt;
  const list = FACILITIES.filter((f) =>
  (type === 'All' || (type === 'Hospitals' ? f.type.includes('Hospital') : f.type === type)) && (
  reporting === 'All' || (reporting === 'Reported') === reported(f)) && (
  stock === 'All' || worstStock(f) === stock) && (
  district === 'All' || f.district === district)
  );
  const sel = selected ? FACILITIES.find((f) => f.name === selected) : undefined;
  const missing = FACILITIES.filter((f) => !reported(f));
  const allReminded = missing.every((f) => state.remindersSent.includes(f.name));
  const stockAlerts = FACILITIES.filter((f) => worstStock(f) !== 'Good').sort((a, b) => (worstStock(a) === 'Out' ? 0 : 1) - (worstStock(b) === 'Out' ? 0 : 1));
  const districts = Array.from(new Set(FACILITIES.map((f) => f.district))).sort();

  const flagStock = (f: Facility) => {
    const issues = Object.entries(f.stock).filter(([, v]) => v !== 'Good').map(([k, v]) => `${k} ${v === 'Out' ? 'out of stock' : 'low'}`);
    actions.sendNotification(
      {
        title: `Stock issue flagged — ${f.name}`,
        body: issues.length ? issues.join(', ') + '.' : 'Stock verification requested.',
        severity: worstStock(f) === 'Out' ? 'orange' : 'yellow',
        roles: ['dho', 'epi'],
        district: f.district,
        link: f.district === 'Huye' ? '/dho/facilities' : undefined
      },
      { module: 'Geographic Intelligence', action: 'Flagged facility stock issue' }
    );
    setFlagged((p) => [...p, f.name]);
    actions.toast(`Stock issue at ${f.name} flagged to the ${f.district} DHO and Epidemiology.`);
  };
  const facilityReport = (f: Facility) => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${f.name}</title><style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#1A1A2E}h1{color:#104E49}td{border:1px solid #E5E7EB;padding:6px 10px}table{border-collapse:collapse}</style></head><body>
<h1>${f.name}</h1><p>${f.type} · ${f.sector} sector, ${f.district} District · Catchment ${f.catchment.toLocaleString()}</p>
<table><tr><td>Cases reported today</td><td>${f.cases}</td></tr><tr><td>Reporting</td><td>${f.reportedAt ? `Reported ${f.reportedAt}` : `Not reported (${f.daysLate ? `${f.daysLate} day(s) late` : 'due today'})`}</td></tr>
${Object.entries(f.stock).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
<p>In charge: ${f.incharge} · ${f.phone}</p><p style="color:#6B7280;font-size:12px">${fmtDate(nowISO())} · AI Vital prototype, demonstration data.</p></body></html>`;
    downloadFile(`facility-${f.name.replace(/\W+/g, '-').toLowerCase()}.html`, html, 'text/html');
  };

  return (
    <GeoLayout breadcrumb="Health Facilities" hideHeader={true}>
      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 lg:right-[37%] bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col xl:flex-row items-center justify-between gap-3 z-20">
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Facility type" value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
            <option value="All">All Facilities</option>
            <option value="Hospitals">Hospitals</option>
            <option value="Health Center">Health Centers</option>
            <option value="Health Post">Health Posts</option>
          </select>
          <select aria-label="Reporting status" value={reporting} onChange={(e) => setReporting(e.target.value)} className={selectCls}>
            <option value="All">Reporting status: All</option>
            <option value="Reported">Reported today</option>
            <option value="Not reported">Not reported</option>
          </select>
          <select aria-label="Stock status" value={stock} onChange={(e) => setStock(e.target.value)} className={selectCls}>
            <option value="All">Stock status: All</option>
            <option value="Out">🔴 Stock-out</option>
            <option value="Low">🟠 Low stock</option>
            <option value="Good">🟢 Good</option>
          </select>
          <select aria-label="District" value={district} onChange={(e) => setDistrict(e.target.value)} className={selectCls}>
            <option value="All">District: All Districts</option>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="text-[12px] font-medium text-epi-text bg-epi-bg px-4 py-1.5 rounded-md border border-border">
          Showing <span className="font-bold">{list.length}</span> of {FACILITIES.length} key facilities | national:{' '}
          <span className="font-bold">{NATIONAL.total}</span> mapped, <span className="font-bold text-epi-red">{NATIONAL.notReported}</span> not yet reported ⚠️
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Main Map Area */}
        <div className="w-full lg:w-[65%] min-h-[560px] lg:h-full relative bg-[#E5E7EB] overflow-hidden shrink-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
          </div>

          <div className="absolute top-[190px] md:top-[120px] bottom-10 left-8 right-8">
            {Object.entries(DISTRICT_XY).map(([d, p]) =>
            <span key={d} className="absolute -translate-x-1/2 text-[9px] text-epi-muted/70 pointer-events-none" style={{ left: `${p.x}%`, top: `calc(${p.y}% + 14px)` }}>{d}</span>
            )}
            {list.map((f) => {
              const p = DISTRICT_XY[f.district];
              const ring = !reported(f) ? 'border-epi-red animate-pulse' : worstStock(f) === 'Out' ? 'border-epi-red' : worstStock(f) === 'Low' ? 'border-[#F97316]' : 'border-[#00A550]';
              const isSel = selected === f.name;
              return (
                <button
                  key={f.name}
                  title={f.name}
                  onClick={() => setSelected(isSel ? null : f.name)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center hover:scale-110 transition-transform ${isSel ? 'z-20' : 'z-10'}`}
                  style={{ left: `${p.x + f.dx}%`, top: `${p.y + f.dy}%` }}>

                  <span
                    className={`rounded-full border-2 shadow-sm ${ring} ${isSel ? 'ring-2 ring-epi ring-offset-1' : ''} ${f.type === 'Referral Hospital' ? 'w-5 h-5 bg-[#1D72B8]' : f.type === 'District Hospital' ? 'w-4 h-4 bg-[#1D72B8]' : f.type === 'Health Center' ? 'w-3 h-3 bg-white' : 'w-2 h-2 bg-gray-300'}`} />
                  {(f.type === 'Referral Hospital' || isSel) &&
                  <span className="text-[10px] font-bold mt-1 bg-white/90 px-1 rounded shadow-sm whitespace-nowrap">
                      {f.name.split(' (')[0]}{f.type === 'Referral Hospital' ? ' ⭐' : ''}
                    </span>
                  }
                </button>);

            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow border border-border p-3 text-[10px] text-epi-muted space-y-1">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1D72B8] border-2 border-[#00A550]" /> Hospital</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white border-2 border-[#00A550]" /> Health center</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300 border border-[#00A550]" /> Health post</div>
            <div>Ring: 🟢 OK · 🟠 low stock · 🔴 stock-out / not reported</div>
          </div>

          {/* Facility popup */}
          {sel &&
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl border border-border p-4 w-72 max-w-[calc(100%-32px)] max-h-[70%] overflow-y-auto z-30">
              <div className="flex justify-between">
                <h3 className="text-[14px] font-bold text-epi-text flex items-center gap-2">🏥 {sel.name}</h3>
                <button aria-label="Close" onClick={() => setSelected(null)} className="text-epi-muted text-[12px]">✕</button>
              </div>
              <div className="text-[11px] text-epi-muted mb-3">
                Type: {sel.type}
                <br />
                District: {sel.district} | Sector: {sel.sector}
                <br />
                Catchment: {sel.catchment.toLocaleString()} people
              </div>
              <div className="bg-epi-bg/50 p-2 rounded border border-border mb-3">
                <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">📊 Today:</div>
                <div className="text-[12px] flex justify-between"><span className="text-epi-text">Cases reported:</span> <span className="font-bold">{reported(sel) ? sel.cases : '—'}</span></div>
                <div className="text-[12px] flex justify-between">
                  <span className="text-epi-text">Reporting status:</span>{' '}
                  {reported(sel) ?
                <span className="font-bold text-[#00A550]">✅ Reported {sel.reportedAt}</span> :
                state.remindersSent.includes(sel.name) ?
                <span className="font-bold text-epi-amber">📨 Reminder sent</span> :

                <span className="font-bold text-epi-red">❌ Not reported{sel.daysLate ? ` (${sel.daysLate}d)` : ''}</span>
                }
                </div>
              </div>
              <div className="bg-epi-bg/50 p-2 rounded border border-border mb-3">
                <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">📦 Stock Status:</div>
                {Object.entries(sel.stock).map(([k, v]) =>
              <div key={k} className="text-[12px] flex justify-between">
                    <span className="text-epi-text">{k}:</span>
                    <span className={`font-bold ${v === 'Good' ? 'text-[#00A550]' : v === 'Low' ? 'text-[#F97316]' : 'text-epi-red'}`}>{STOCK_ICON[v]} {v === 'Out' ? 'Out of stock' : v}</span>
                  </div>
              )}
              </div>
              <div className="text-[11px] text-epi-text mb-3">
                👤 In Charge: {sel.incharge}
                <br />
                📞 <a href={`tel:${sel.phone.replace(/\s/g, '')}`} className="hover:underline">{sel.phone}</a>
              </div>
              <div className="flex flex-col gap-2">
                {sel.district === 'Huye' ?
              <Link to="/dho/facilities" className="w-full py-1.5 bg-epi text-white text-[11px] font-bold rounded text-center">View Full Facility Report →</Link> :

              <button onClick={() => facilityReport(sel)} className="w-full py-1.5 bg-epi text-white text-[11px] font-bold rounded">View Full Facility Report →</button>
              }
                {flagged.includes(sel.name) ?
              <span className="w-full py-1.5 bg-epi-accent/10 text-epi-accent text-[11px] font-bold rounded text-center">✓ Stock issue flagged</span> :

              <button onClick={() => flagStock(sel)} className="w-full py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded">
                    Flag Stock Issue →
                  </button>
              }
              </div>
            </div>
          }
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[35%] lg:h-full bg-white border-l border-border flex flex-col lg:pt-6 lg:overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">Health Facility Overview</h2>

            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Summary stats (national)</div>
              <div className="text-[14px] font-bold text-epi-text mb-2">Total facilities: {NATIONAL.total}</div>
              <ul className="space-y-2 text-[13px] text-epi-text ml-2">
                <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1D72B8] rounded-full border border-border"></div> Hospitals: {NATIONAL.hospitals}</li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 bg-white rounded-full border-2 border-border"></div> Health Centers: {NATIONAL.centers}</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-300 rounded-full border border-border ml-0.5"></div> Health Posts: {NATIONAL.posts}</li>
              </ul>
            </div>

            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">Today's reporting</div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="font-bold text-[#00A550]">✅ Reported: {NATIONAL.total - NATIONAL.notReported} (92%)</span>
                <span className="font-bold text-epi-red">❌ Not reported: {NATIONAL.notReported} (8%)</span>
              </div>
              <div className="w-full h-2 bg-epi-red/20 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-[#00A550]" style={{ width: '92%' }}></div>
              </div>
              <div className="bg-epi-red/5 border border-epi-red/20 rounded-lg p-4">
                <div className="text-[12px] font-bold text-epi-red mb-2">Not reported list (top {missing.length} at risk):</div>
                <ul className="space-y-2 text-[13px] text-epi-text mb-4">
                  {missing.map((f) =>
                  <li key={f.name} className="flex justify-between gap-2">
                      <button onClick={() => setSelected(f.name)} className="text-left hover:underline">⚠️ {f.name}, {f.district}</button>
                      <span className={`font-bold whitespace-nowrap ${state.remindersSent.includes(f.name) ? 'text-epi-amber' : f.daysLate && f.daysLate >= 2 ? 'text-epi-red' : f.daysLate ? 'text-[#F97316]' : 'text-epi-muted'}`}>
                        {state.remindersSent.includes(f.name) ? '📨 reminded' : f.daysLate ? `${f.daysLate} day${f.daysLate > 1 ? 's' : ''}` : 'today'}
                      </span>
                    </li>
                  )}
                </ul>
                <button
                  disabled={allReminded}
                  onClick={() => {
                    actions.sendFacilityReminder(missing.map((f) => f.name));
                    actions.toast(`Reminder sent to ${NATIONAL.notReported} non-reporting facilities (simulated SMS).`);
                  }}
                  className="w-full py-2 bg-epi-amber text-epi-text text-[13px] font-bold rounded hover:bg-epi-amber/90 transition-colors disabled:opacity-60">
                  {allReminded ? '✓ Reminders sent' : `Send bulk reminder to ${NATIONAL.notReported} facilities`}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3 flex items-center justify-between">
                Stock alerts ({stockAlerts.length})
                <button onClick={() => setAllStock(!allStock)} className="text-[11px] text-epi hover:underline normal-case">
                  {allStock ? 'Show fewer ↑' : 'View all stock alerts →'}
                </button>
              </div>
              <ul className="space-y-2 text-[13px]">
                {(allStock ? stockAlerts : stockAlerts.slice(0, 3)).map((f) => {
                  const w = worstStock(f);
                  return (
                    <li key={f.name}>
                      <button onClick={() => setSelected(f.name)} className="w-full text-left flex items-start gap-2 bg-white p-2 rounded border border-border shadow-sm hover:border-epi">
                        <span className="text-[14px]">{STOCK_ICON[w]}</span>
                        <div>
                          <div className="font-bold text-epi-text">{f.name}</div>
                          <div className={`font-medium ${w === 'Out' ? 'text-epi-red' : 'text-[#F97316]'}`}>
                            {Object.entries(f.stock).filter(([, v]) => v !== 'Good').map(([k, v]) => `${k} ${v === 'Out' ? 'out of stock' : 'low'}`).join(', ')}
                          </div>
                        </div>
                      </button>
                    </li>);

                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}
