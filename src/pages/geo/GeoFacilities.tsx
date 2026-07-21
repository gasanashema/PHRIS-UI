import React, { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import { ArrowRight, AlertTriangle } from 'lucide-react';
export function GeoFacilities() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <GeoLayout breadcrumb="Health Facilities" hideHeader={true}>
      {/* Top Control Bar (Floating) */}
      <div className="absolute top-6 left-6 right-6 bg-white rounded-lg shadow-lg border border-border p-2 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        <div className="flex flex-wrap items-center gap-2">
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option>All Facilities ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option>Reporting status: All ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option>Stock status: All ▼</option>
          </select>
          <select className="text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-1.5 focus:outline-none bg-white shadow-sm">
            <option>District: All Districts ▼</option>
          </select>
        </div>

        <div className="text-[12px] font-medium text-epi-text bg-epi-bg px-4 py-1.5 rounded-md border border-border">
          <span className="font-bold">924</span> facilities mapped |{' '}
          <span className="font-bold text-[#00A550]">847</span> reported today
          (92%) | <span className="font-bold text-epi-red">77</span> not yet
          reported ⚠️
        </div>
      </div>

      <div className="absolute inset-0 flex">
        {/* Main Map Area (65%) */}
        <div className="w-[65%] h-full relative bg-[#E5E7EB] overflow-hidden">
          {/* Muted Grey Fill Map */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)',
              backgroundSize: '15px 15px'
            }}>
          </div>

          {/* District Boundaries (White) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            viewBox="0 0 100 100"
            preserveAspectRatio="none">
            
            <path
              d="M20,20 L40,10 L60,20 L80,10 L90,40 L80,70 L60,90 L40,80 L20,90 L10,60 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M40,10 L50,40 L20,20"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M60,20 L50,40 L80,10"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M50,40 L60,90"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
            <path
              d="M50,40 L40,80"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5" />
            
          </svg>

          {/* Facility Icons */}

          {/* Kigali Cluster */}
          <div className="absolute top-[45%] left-[55%] flex flex-wrap w-16 h-16 gap-1 justify-center items-center">
            <div className="w-4 h-4 bg-[#1D72B8] rounded-full border-2 border-[#00A550] shadow-sm z-10"></div>
            <div className="w-4 h-4 bg-[#1D72B8] rounded-full border-2 border-[#00A550] shadow-sm z-10"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00A550] shadow-sm"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00A550] shadow-sm"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00A550] shadow-sm"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full border border-[#00A550]"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full border border-[#00A550]"></div>
          </div>

          {/* CHUB (Butare) */}
          <div
            className="absolute bottom-[25%] left-[45%] flex flex-col items-center cursor-pointer hover:scale-110 transition-transform z-20"
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}>
            
            <div className="w-5 h-5 bg-[#1D72B8] rounded-full border-2 border-[#00A550] shadow-md flex items-center justify-center"></div>
            <span className="text-[10px] font-bold mt-1 bg-white/90 px-1 rounded shadow-sm whitespace-nowrap">
              CHUB ⭐ Referral
            </span>
          </div>

          {/* Ruhengeri */}
          <div className="absolute top-[20%] left-[40%] flex flex-col items-center">
            <div className="w-5 h-5 bg-[#1D72B8] rounded-full border-2 border-[#00A550] shadow-md"></div>
            <span className="text-[10px] font-bold mt-1 bg-white/90 px-1 rounded shadow-sm whitespace-nowrap">
              Ruhengeri ⭐ Referral
            </span>
          </div>

          {/* Gisenyi */}
          <div className="absolute top-[35%] left-[20%] flex flex-col items-center">
            <div className="w-4 h-4 bg-[#1D72B8] rounded-full border-2 border-[#00A550] shadow-sm"></div>
          </div>

          {/* Kibungo */}
          <div className="absolute bottom-[35%] right-[20%] flex flex-col items-center">
            <div className="w-4 h-4 bg-[#1D72B8] rounded-full border-2 border-[#00A550] shadow-sm"></div>
          </div>

          {/* Scattered HCs and HPs */}
          {/* Nyamagabe area (Red rings) */}
          <div className="absolute bottom-[30%] left-[35%] w-2.5 h-2.5 bg-white rounded-full border-2 border-epi-red shadow-sm animate-pulse"></div>
          <div className="absolute bottom-[32%] left-[32%] w-1.5 h-1.5 bg-gray-300 rounded-full border border-epi-red shadow-sm"></div>
          <div className="absolute bottom-[28%] left-[38%] w-1.5 h-1.5 bg-gray-300 rounded-full border border-epi-red shadow-sm"></div>

          {/* Other scattered */}
          <div className="absolute top-[30%] right-[30%] w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00A550] shadow-sm"></div>
          <div className="absolute bottom-[40%] left-[25%] w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00A550] shadow-sm"></div>
          <div className="absolute top-[50%] left-[30%] w-2.5 h-2.5 bg-white rounded-full border-2 border-gray-400 shadow-sm"></div>
          <div className="absolute bottom-[15%] right-[40%] w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00A550] shadow-sm"></div>

          {/* Refugee Camps */}
          <div className="absolute top-[45%] right-[15%] flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded border border-white/20">
            <span className="text-[10px]">🏕️</span>
          </div>

          {/* Hover Popup */}
          {showPopup &&
          <div className="absolute bottom-[30%] left-[48%] bg-white rounded-lg shadow-xl border border-border p-4 w-72 z-30 pointer-events-none">
              <h3 className="text-[14px] font-bold text-epi-text flex items-center gap-2">
                🏥 Huye District Hospital
              </h3>
              <div className="text-[11px] text-epi-muted mb-3">
                Type: District Hospital
                <br />
                District: Huye | Sector: Huye
                <br />
                Catchment: 45,000 people
              </div>

              <div className="bg-epi-bg/50 p-2 rounded border border-border mb-3">
                <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                  📊 Today:
                </div>
                <div className="text-[12px] flex justify-between">
                  <span className="text-epi-text">Cases reported:</span>{' '}
                  <span className="font-bold">23</span>
                </div>
                <div className="text-[12px] flex justify-between">
                  <span className="text-epi-text">Reporting status:</span>{' '}
                  <span className="font-bold text-[#00A550]">
                    ✅ Reported 08:12
                  </span>
                </div>
              </div>

              <div className="bg-epi-bg/50 p-2 rounded border border-border mb-3">
                <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                  📦 Stock Status:
                </div>
                <div className="text-[12px] flex justify-between">
                  <span className="text-epi-text">ORS:</span>{' '}
                  <span className="font-bold text-[#00A550]">
                    🟢 Good (340 units)
                  </span>
                </div>
                <div className="text-[12px] flex justify-between">
                  <span className="text-epi-text">Malaria RDTs:</span>{' '}
                  <span className="font-bold text-[#00A550]">
                    🟢 Good (180 units)
                  </span>
                </div>
                <div className="text-[12px] flex justify-between">
                  <span className="text-epi-text">ACT medication:</span>{' '}
                  <span className="font-bold text-[#00A550]">
                    🟢 Good (120 courses)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-epi-text mb-3">
                👤 In Charge: Dr. Mukamana
                <br />
                📞 +250 788 100 400
              </div>

              <div className="text-[11px] text-epi-muted mb-3">
                🏥 Distance to referral:
                <br />
                <span className="font-bold text-epi-text">
                  45km to CHUB (Butare)
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button className="w-full py-1.5 bg-epi text-white text-[11px] font-bold rounded">
                  View Full Facility Report →
                </button>
                <button className="w-full py-1.5 bg-white border border-border text-epi-text text-[11px] font-bold rounded">
                  Flag Stock Issue →
                </button>
              </div>
            </div>
          }
        </div>

        {/* Right Panel (35%) */}
        <div className="w-[35%] h-full bg-white border-l border-border flex flex-col pt-20 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">
              Health Facility Overview
            </h2>

            {/* Summary Stats */}
            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Summary stats
              </div>
              <div className="text-[14px] font-bold text-epi-text mb-2">
                Total facilities: 924
              </div>
              <ul className="space-y-2 text-[13px] text-epi-text ml-2">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1D72B8] rounded-full border border-border"></div>{' '}
                  Hospitals: 44
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-border"></div>{' '}
                  Health Centers: 501
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full border border-border ml-0.5"></div>{' '}
                  Health Posts: 379
                </li>
              </ul>
            </div>

            {/* Today's Reporting */}
            <div className="mb-8">
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3">
                Today's reporting
              </div>
              <div className="flex justify-between text-[13px] mb-1">
                <span className="font-bold text-[#00A550]">
                  ✅ Reported: 847 (92%)
                </span>
                <span className="font-bold text-epi-red">
                  ❌ Not reported: 77 (8%)
                </span>
              </div>
              <div className="w-full h-2 bg-epi-red/20 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-[#00A550]"
                  style={{
                    width: '92%'
                  }}>
                </div>
              </div>

              <div className="bg-epi-red/5 border border-epi-red/20 rounded-lg p-4">
                <div className="text-[12px] font-bold text-epi-red mb-2">
                  Not reported list (top 5 at risk):
                </div>
                <ul className="space-y-2 text-[13px] text-epi-text mb-4">
                  <li className="flex justify-between">
                    <span>⚠️ Mukura HP, Huye</span>
                    <span className="text-epi-red font-bold">2 days</span>
                  </li>
                  <li className="flex justify-between">
                    <span>⚠️ Nyamagabe HC</span>
                    <span className="text-[#F97316] font-bold">1 day</span>
                  </li>
                  <li className="flex justify-between">
                    <span>⚠️ Kinazi HP, Huye</span>
                    <span className="text-[#F97316] font-bold">1 day</span>
                  </li>
                  <li className="flex justify-between">
                    <span>⚠️ Ngororero HC</span>
                    <span className="text-epi-muted">today</span>
                  </li>
                  <li className="flex justify-between">
                    <span>⚠️ Rutsiro HP</span>
                    <span className="text-epi-muted">today</span>
                  </li>
                </ul>
                <button className="w-full py-2 bg-epi-amber text-epi-text text-[13px] font-bold rounded hover:bg-epi-amber/90 transition-colors">
                  Send bulk reminder to 77 facilities
                </button>
              </div>
            </div>

            {/* Stock Alerts */}
            <div>
              <div className="text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-3 flex items-center justify-between">
                Stock alerts
                <button className="text-[11px] text-epi hover:underline normal-case">
                  View all stock alerts →
                </button>
              </div>
              <ul className="space-y-2 text-[13px]">
                <li className="flex items-start gap-2 bg-white p-2 rounded border border-border shadow-sm">
                  <span className="text-[14px]">🔴</span>
                  <div>
                    <div className="font-bold text-epi-text">Tumba HC</div>
                    <div className="text-epi-red font-medium">
                      ORS out of stock
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-white p-2 rounded border border-border shadow-sm">
                  <span className="text-[14px]">🟠</span>
                  <div>
                    <div className="font-bold text-epi-text">Bugarama HC</div>
                    <div className="text-[#F97316] font-medium">
                      Chlorine low
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-white p-2 rounded border border-border shadow-sm">
                  <span className="text-[14px]">🟡</span>
                  <div>
                    <div className="font-bold text-epi-text">3 facilities</div>
                    <div className="text-epi-amber font-medium">RDTs low</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}