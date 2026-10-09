import { useState } from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
export function GeoCrossBorder() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <GeoLayout breadcrumb="Cross-Border Map" hideHeader={true}>
      {/* Top Header (Small) */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-white/90 backdrop-blur-sm border-b border-border flex items-center px-6 z-20">
        <span className="text-[13px] font-bold text-epi-text">
          Cross-Border Disease Surveillance | Rwanda + Neighboring Countries
          | Updated: June 4, 2026 (WHO AFRO)
        </span>
      </div>

      <div className="absolute inset-0 flex pt-10">
        {/* Main Map Area (65%) */}
        <div className="w-[65%] h-full relative bg-[#1A1A1A] overflow-hidden">
          {/* Simulated Dark Terrain Map */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
          </div>

          {/* Neighbor Labels */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[24px] font-bold text-white/20 -rotate-90 tracking-[0.5em] pointer-events-none">
            D R C
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[24px] font-bold text-white/20 tracking-[0.5em] pointer-events-none">
            U G A N D A
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[24px] font-bold text-white/20 rotate-90 tracking-[0.5em] pointer-events-none">
            T A N Z A N I A
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[24px] font-bold text-white/20 tracking-[0.5em] pointer-events-none">
            B U R U N D I
          </div>

          {/* Rwanda Outline (Central) */}
          <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] border-2 border-white/30 rounded-[20%] pointer-events-none"></div>

          {/* DRC Threat Overlays */}
          {/* North Kivu (Mpox) */}
          <div className="absolute top-[30%] left-[10%] w-32 h-32 bg-[#F57C00]/30 rounded-full blur-xl animate-pulse mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-[35%] left-[15%] text-white text-[10px] font-bold bg-black/60 px-2.5 py-1.5 rounded border border-white/20">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F57C00]" /> Mpox — Active Outbreak</div>
            <div className="text-white/80 font-normal">45 confirmed cases</div>
          </div>

          {/* South Kivu (Cholera) */}
          <div
            className="absolute bottom-[30%] left-[10%] w-40 h-40 bg-[#D32F2F]/40 rounded-full blur-xl animate-pulse mix-blend-screen cursor-pointer z-10"
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}>
          </div>
          <div className="absolute bottom-[35%] left-[12%] text-white text-[10px] font-bold bg-black/60 px-2.5 py-1.5 rounded border border-white/20 pointer-events-none">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D32F2F]" /> Cholera — Active Outbreak</div>
            <div className="text-white/80 font-normal">234 cases this month</div>
          </div>

          {/* Uganda Threat Overlay */}
          <div className="absolute top-[10%] left-[40%] w-32 h-24 bg-[#F59E0B]/20 rounded-full blur-xl mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-[15%] left-[45%] text-white text-[10px] font-bold bg-black/60 px-2.5 py-1.5 rounded border border-white/20 pointer-events-none">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Ebola — 2 Suspected Cases</div>
            <div className="text-white/80 font-normal">Under investigation</div>
          </div>

          {/* Burundi Threat Overlay */}
          <div className="absolute bottom-[10%] left-[45%] w-40 h-24 bg-[#F59E0B]/10 rounded-full blur-xl mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-[12%] left-[50%] text-white text-[10px] font-bold bg-black/60 px-2.5 py-1.5 rounded border border-white/20 pointer-events-none">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Malaria — Elevated</div>
            <div className="text-white/80 font-normal">+28% above baseline</div>
          </div>

          {/* Border Crossing Markers */}
          {/* Grande Barriere, Rusizi */}
          <div className="absolute bottom-[35%] left-[20%] flex flex-col items-center z-20">
            <div className="w-3 h-3 bg-[#D32F2F] rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-[9px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
              Grande Barriere
              <br />
              <span className="text-[#D32F2F]">
                Cholera + Mpox crossing risk
              </span>
            </div>
          </div>

          {/* Petite Barriere, Rusizi */}
          <div className="absolute bottom-[30%] left-[22%] flex flex-col items-center z-20">
            <div className="w-3 h-3 bg-[#D32F2F] rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-[9px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
              Petite Barriere
              <br />
              <span className="text-[#D32F2F]">Active cholera screening</span>
            </div>
          </div>

          {/* Petite Barriere Rubavu/Goma */}
          <div className="absolute top-[35%] left-[20%] flex flex-col items-center z-20">
            <div className="w-3 h-3 bg-[#F57C00] rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-[9px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
              Petite Barriere Rubavu
              <br />
              <span className="text-[#F57C00]">Mpox screening active</span>
            </div>
          </div>

          {/* Kagitumba (Uganda border) */}
          <div className="absolute top-[20%] left-[50%] flex flex-col items-center z-20">
            <div className="w-3 h-3 bg-[#F59E0B] rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-[9px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
              Kagitumba
              <br />
              <span className="text-[#F59E0B]">Ebola watch — screening</span>
            </div>
          </div>

          {/* Rusumo (Tanzania border) */}
          <div className="absolute top-[50%] right-[20%] flex flex-col items-center z-20">
            <div className="w-3 h-3 bg-[#00A550] rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-[9px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
              Rusumo
              <br />
              <span className="text-[#00A550]">Normal</span>
            </div>
          </div>

          {/* Akanyaru (Burundi border) */}
          <div className="absolute bottom-[20%] left-[55%] flex flex-col items-center z-20">
            <div className="w-3 h-3 bg-[#F59E0B] rounded-full border-2 border-white shadow-sm"></div>
            <div className="text-[9px] font-bold mt-1 bg-white/90 text-epi-text px-1 rounded shadow-sm whitespace-nowrap">
              Akanyaru
              <br />
              <span className="text-[#F59E0B]">Malaria elevated</span>
            </div>
          </div>

          {/* Rwanda Border Districts Highlighted */}
          {/* Rusizi */}
          <div className="absolute bottom-[28%] left-[22%] w-16 h-16 border-2 border-dashed border-[#D32F2F] rounded-lg bg-[#D32F2F]/20 pointer-events-none"></div>
          {/* Rubavu */}
          <div className="absolute top-[32%] left-[22%] w-12 h-12 border-2 border-dashed border-[#F57C00] rounded-lg bg-[#F57C00]/20 pointer-events-none"></div>
          {/* Nyamasheke */}
          <div className="absolute bottom-[40%] left-[24%] w-14 h-14 border-2 border-dashed border-[#F59E0B] rounded-lg bg-[#F59E0B]/20 pointer-events-none"></div>
          {/* Musanze + Burera */}
          <div className="absolute top-[22%] left-[40%] w-24 h-12 border-2 border-dashed border-[#F59E0B] rounded-lg bg-[#F59E0B]/10 pointer-events-none"></div>

          {/* Hover Popup */}
          {showPopup &&
          <div className="absolute bottom-[35%] left-[25%] bg-white rounded-lg shadow-xl border border-border p-4 w-72 z-30 pointer-events-none">
              <h3 className="text-[14px] font-bold text-epi-text mb-1">
                DRC — South Kivu (Bukavu)
              </h3>
              <div className="text-[12px] font-bold text-epi-red mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-epi-red" />
                <span>Cholera — ACTIVE OUTBREAK</span>
              </div>

              <div className="space-y-1.5 text-[12px] mb-3">
                <div className="flex justify-between">
                  <span className="text-epi-muted">Cases:</span>{' '}
                  <span className="font-bold text-epi-text">
                    234 this month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-epi-muted">Distance to Rwanda:</span>{' '}
                  <span className="font-bold text-epi-text">4km</span>
                </div>
                <div className="text-[10px] text-epi-muted text-right -mt-1">
                  (Rusizi District border)
                </div>
              </div>

              <div className="bg-epi-bg p-2 rounded border border-border mb-3">
                <div className="text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-2">
                  Impact on Rwanda:
                </div>
                <div className="text-[12px] mb-1">
                  <span className="text-epi-muted">
                    Rwanda districts at risk:
                  </span>
                  <br />
                  <span className="font-bold text-epi-text">
                    Rusizi ● | Nyamasheke ●
                  </span>
                </div>
                <div className="text-[12px] mb-1">
                  <span className="text-epi-muted">Alert thresholds:</span>{' '}
                  <span className="font-bold text-epi-red">LOWERED -40%</span>
                </div>
                <div className="text-[12px]">
                  <span className="text-epi-muted">Screening:</span>{' '}
                  <span className="font-bold text-epi-text">
                    Active at Grande Barriere
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-epi-muted">
                WHO source: AFRO Bulletin
                <br />
                June 4, 2026
              </div>
            </div>
          }
        </div>

        {/* Right Panel (35%) */}
        <div className="w-[35%] h-full bg-white border-l border-border flex flex-col overflow-y-auto">
          <div className="p-6">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">
              Regional Threat Assessment
            </h2>

            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-epi-bg border-b border-border">
                      <th className="p-3 text-[11px] font-bold text-epi-muted uppercase tracking-wider">
                        Country/Region
                      </th>
                      <th className="p-3 text-[11px] font-bold text-epi-muted uppercase tracking-wider">
                        Disease
                      </th>
                      <th className="p-3 text-[11px] font-bold text-epi-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="p-3 text-[11px] font-bold text-epi-muted uppercase tracking-wider">
                        Rwanda Risk
                      </th>
                      <th className="p-3 text-[11px] font-bold text-epi-muted uppercase tracking-wider">
                        Affected Districts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                      <td className="p-3 text-[12px] font-bold text-epi-text">
                        DRC South Kivu
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">Cholera</td>
                      <td className="p-3 text-[12px] font-bold text-epi-red">
                        ● Active
                      </td>
                      <td className="p-3 text-[12px] font-bold text-epi-red">
                        ● Very High
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">
                        Rusizi, Nyamasheke
                      </td>
                    </tr>
                    <tr className="bg-[#F97316]/5 hover:bg-[#F97316]/10">
                      <td className="p-3 text-[12px] font-bold text-epi-text">
                        DRC North Kivu
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">Mpox</td>
                      <td className="p-3 text-[12px] font-bold text-epi-red">
                        ● Active
                      </td>
                      <td className="p-3 text-[12px] font-bold text-[#F97316]">
                        ● High
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">
                        Rubavu, Nyabihu
                      </td>
                    </tr>
                    <tr className="bg-epi-amber/5 hover:bg-epi-amber/10">
                      <td className="p-3 text-[12px] font-bold text-epi-text">
                        Uganda SW
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">Ebola</td>
                      <td className="p-3 text-[12px] font-bold text-epi-amber">
                        ● Watch
                      </td>
                      <td className="p-3 text-[12px] font-bold text-epi-amber">
                        ● Moderate
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">
                        Musanze, Burera, Gakenke
                      </td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[12px] font-bold text-epi-text">
                        Burundi N
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">Malaria</td>
                      <td className="p-3 text-[12px] font-bold text-[#F97316]">
                        ● Elevated
                      </td>
                      <td className="p-3 text-[12px] font-bold text-epi-amber">
                        ● Moderate
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">
                        Kirehe, Ngoma
                      </td>
                    </tr>
                    <tr className="hover:bg-epi-bg/50">
                      <td className="p-3 text-[12px] font-bold text-epi-text">
                        Tanzania NW
                      </td>
                      <td className="p-3 text-[12px] text-epi-text">None</td>
                      <td className="p-3 text-[12px] font-bold text-[#00A550]">
                        ● Normal
                      </td>
                      <td className="p-3 text-[12px] font-bold text-[#00A550]">
                        ● Low
                      </td>
                      <td className="p-3 text-[12px] text-epi-muted">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-5 mb-6 shadow-sm">
              <h3 className="text-[13px] font-bold text-epi-text mb-3">
                Active adjustments due to cross-border threats:
              </h3>
              <ul className="space-y-2 text-[13px] text-epi-text mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-epi-red font-bold">↓</span>
                  <div>
                    <span className="font-bold">Cholera threshold -40%</span>
                    <br />
                    <span className="text-[11px] text-epi-muted">
                      (Rusizi, Nyamasheke)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F97316] font-bold">↓</span>
                  <div>
                    <span className="font-bold">Mpox threshold -30%</span>
                    <br />
                    <span className="text-[11px] text-epi-muted">
                      (Rubavu, Nyabihu)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-epi-amber font-bold">↓</span>
                  <div>
                    <span className="font-bold">
                      Ebola alert threshold active
                    </span>
                    <br />
                    <span className="text-[11px] text-epi-muted">
                      (Musanze, Burera)
                    </span>
                  </div>
                </li>
              </ul>
              <div className="text-[11px] text-epi-muted pt-3 border-t border-border">
                Source: WHO AFRO | June 4, 2026
              </div>
            </div>

            <div className="bg-epi/10 border border-epi/20 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[16px]"></span>
                <h3 className="text-[13px] font-bold text-epi-text">
                  Cross-Border Threshold Logic:
                </h3>
              </div>
              <p className="text-[12px] text-epi-text leading-relaxed mb-3">
                When DRC, Uganda, or Burundi reports an active outbreak, AI
                Vital automatically lowers alert thresholds in Rwanda's border
                districts for that disease — without waiting for Rwanda cases to
                appear.
              </p>
              <p className="text-[12px] text-epi-text leading-relaxed">
                This gives Rwanda's DHOs advance warning to prepare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}