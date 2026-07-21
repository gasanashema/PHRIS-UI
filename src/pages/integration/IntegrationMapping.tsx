import React from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
const diseaseMapping = [
{
  source: 'DHIS2',
  term: 'P. Falciparum',
  system: 'Malaria (Confirmed)',
  category: 'Infectious Disease',
  status: '✅ Mapped'
},
{
  source: 'RBC Lab',
  term: 'V. Cholerae positive',
  system: 'Cholera (Confirmed)',
  category: 'Infectious Disease',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Impiswi',
  system: 'Diarrheal Disease',
  category: 'Gastrointestinal',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Malariya',
  system: 'Malaria (Suspected)',
  category: 'Infectious Disease',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Inkorora',
  system: 'Respiratory Infection',
  category: 'Respiratory',
  status: '✅ Mapped'
},
{
  source: 'CHW App',
  term: 'Agahagarika',
  system: '[Not mapped — select ▼]',
  category: 'Unknown',
  status: '🟡 Pending',
  isPending: true
},
{
  source: 'EMR',
  term: 'Acute febrile illness NEC',
  system: '[Not mapped — select ▼]',
  category: 'Unknown',
  status: '🟡 Pending',
  isPending: true
},
{
  source: 'CHW App',
  term: "Uburwayi bw'ubutwari",
  system: '[Not mapped — select ▼]',
  category: 'Unknown',
  status: '🟡 Pending',
  isPending: true
}];

const facilityMapping = [
{
  source: 'DHIS2',
  code: 'RW-HY-001',
  system: 'Huye District Hospital',
  district: 'Huye',
  status: '✅ Mapped'
},
{
  source: 'DHIS2',
  code: 'RW-MS-003',
  system: 'Musanze Health Centre',
  district: 'Musanze',
  status: '✅ Mapped'
},
{
  source: 'EMR',
  code: 'RW-HY-099',
  system: '[Unknown — not in registry]',
  district: 'Huye',
  status: '🔴 Error — resolve',
  isError: true
},
{
  source: 'EMR',
  code: 'FAC_KIG_0047',
  system: 'Kacyiru Health Centre',
  district: 'Gasabo',
  status: '✅ Mapped'
}];

export function IntegrationMapping() {
  return (
    <IntegrationLayout
      title="Data Mapping & Terminology Standardization"
      subtitle="Translate different source formats so all data speaks the same language in AI Vital"
      breadcrumb="Data Mapping">
      
      {/* Top Summary */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold bg-white px-4 py-3 rounded-lg shadow-sm border border-border mb-6 w-fit">
        <span className="text-[#00A550]">✅ 1,240 Terms Mapped</span>
        <span className="text-border">|</span>
        <span className="text-epi-amber">🟡 82 Terms Pending Mapping</span>
        <span className="text-border">|</span>
        <span className="text-epi-red">🔴 12 Terms Causing Errors Today</span>
      </div>

      {/* Source Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-epi text-white whitespace-nowrap">
          All Sources
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          DHIS2
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          RBC Lab
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-epi-amber/20 border border-epi-amber/30 text-epi-text whitespace-nowrap">
          CHW App
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          EMR
        </button>
        <button className="px-4 py-2 rounded-full text-[13px] font-bold bg-white border border-border text-epi-muted hover:bg-epi-bg whitespace-nowrap">
          WASAC
        </button>
      </div>

      {/* Disease Mapping */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Disease & Diagnosis Term Mapping
          </h2>
          <p className="text-[13px] text-epi-muted">
            Ensure all source disease names resolve to standard AI Vital disease
            codes
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source Term
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider w-8"></th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  System Standard Term
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {diseaseMapping.map((m, idx) =>
              <tr
                key={idx}
                className={`hover:bg-epi-bg/50 transition-colors ${m.isPending ? 'bg-epi-amber/5' : ''}`}>
                
                  <td className="p-4 text-[13px] text-epi-text">{m.source}</td>
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    "{m.term}"
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted text-center">
                    →
                  </td>
                  <td className="p-4">
                    {m.isPending ?
                  <select className="text-[13px] border border-epi-amber rounded px-2 py-1 focus:outline-none bg-white text-epi-muted w-full">
                        <option>{m.system}</option>
                      </select> :

                  <span className="text-[13px] font-bold text-epi-text">
                        {m.system}
                      </span>
                  }
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted">
                    {m.category}
                  </td>
                  <td
                  className={`p-4 text-[13px] font-bold ${m.isPending ? 'text-epi-amber' : ''}`}>
                  
                    {m.status}
                  </td>
                  <td className="p-4 text-right">
                    {m.isPending ?
                  <button className="text-[13px] font-bold text-epi-amber hover:underline">
                        Map Now
                      </button> :

                  <button className="text-[13px] font-medium text-epi hover:underline">
                        Edit
                      </button>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border">
          <button className="px-4 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded-md hover:bg-epi/5 transition-colors">
            + Add Manual Mapping
          </button>
        </div>
      </div>

      {/* Facility Mapping */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Facility Code Translation
          </h2>
          <p className="text-[13px] text-epi-muted">
            Match source facility codes to AI Vital facility registry
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source Code
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider w-8"></th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  AI Vital Facility Name
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  District
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {facilityMapping.map((m, idx) =>
              <tr
                key={idx}
                className={`hover:bg-epi-bg/50 transition-colors ${m.isError ? 'bg-epi-red/5' : ''}`}>
                
                  <td className="p-4 text-[13px] text-epi-text">{m.source}</td>
                  <td className="p-4 text-[13px] font-mono text-epi-text">
                    "{m.code}"
                  </td>
                  <td className="p-4 text-[13px] text-epi-muted text-center">
                    →
                  </td>
                  <td
                  className={`p-4 text-[13px] font-bold ${m.isError ? 'text-epi-red' : 'text-epi-text'}`}>
                  
                    {m.system}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">
                    {m.district}
                  </td>
                  <td
                  className={`p-4 text-[13px] font-bold ${m.isError ? 'text-epi-red' : ''}`}>
                  
                    {m.status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Format Rules */}
      <div className="mb-8">
        <h2 className="text-[16px] font-bold text-epi-text mb-1">
          Data Transformation Rules
        </h2>
        <p className="text-[13px] text-epi-muted mb-4">
          Standardize formats across all sources
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">
              Date Formats
            </h3>
            <div className="text-[13px] text-epi-muted space-y-2 mb-6 flex-1">
              <p>
                All dates normalized to:{' '}
                <span className="font-mono text-epi-text bg-epi-bg px-1 rounded">
                  YYYY-MM-DD
                </span>
              </p>
              <p>Source examples auto-converted:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>'05/06/2026' → '2026-06-05'</li>
                <li>'June 5, 2026' → '2026-06-05'</li>
              </ul>
            </div>
            <div className="text-[13px] font-bold mt-auto">
              Status: 🟢 Active
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">
              Phone Numbers
            </h3>
            <div className="text-[13px] text-epi-muted space-y-2 mb-6 flex-1">
              <p>
                All Rwanda phones normalized to:{' '}
                <span className="font-mono text-epi-text bg-epi-bg px-1 rounded">
                  +250 7XX XXX XXX
                </span>
              </p>
              <p>Source variants auto-converted:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>'0788123456' → '+250 788 123 456'</li>
                <li>'788 123 456' → '+250 788 123 456'</li>
              </ul>
            </div>
            <div className="text-[13px] font-bold mt-auto">
              Status: 🟢 Active
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-card border border-border flex flex-col">
            <h3 className="text-[14px] font-bold text-epi-text mb-3">
              Kinyarwanda Normalization
            </h3>
            <div className="text-[13px] text-epi-muted space-y-2 mb-6 flex-1">
              <p>Kinyarwanda disease terms mapped via translation table.</p>
              <p>
                82 terms currently pending review. CHW app is primary source.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="text-[13px] font-bold text-epi-amber">
                Status: 🟡 82 pending
              </div>
              <button className="px-3 py-1.5 bg-epi-amber text-white text-[12px] font-bold rounded hover:bg-epi-amber/90 transition-colors">
                Review Pending Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </IntegrationLayout>);

}