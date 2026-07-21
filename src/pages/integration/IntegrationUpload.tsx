import React from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet } from
'lucide-react';
const history = [
{
  date: 'June 2, 2026',
  by: 'Jean Paul Habimana',
  source: 'NISR Census',
  file: 'census_2022_final.xlsx',
  records: '10,920 rows',
  status: '✅ Imported successfully'
},
{
  date: 'May 15, 2026',
  by: 'Aline Uwimana',
  source: 'MINAGRI',
  file: 'food_security_Q1.csv',
  records: '847 rows',
  status: '✅ Imported successfully'
},
{
  date: 'April 30, 2026',
  by: 'Jean Paul Habimana',
  source: 'WASAC',
  file: 'wash_coverage_apr.xlsx',
  records: '1,204 rows',
  status: '⚠️ Imported with 34 warnings'
}];

export function IntegrationUpload() {
  return (
    <IntegrationLayout
      title="Manual Data Upload"
      subtitle="Upload Excel or CSV files from sources that cannot connect automatically"
      breadcrumb="Manual Upload">
      
      {/* Main Upload Section */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden mb-8 max-w-4xl mx-auto">
        <div className="p-6 border-b border-border text-center">
          <h2 className="text-[20px] font-bold text-epi-text mb-6">
            Upload New Dataset
          </h2>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 text-[13px] font-bold">
            <div className="flex items-center gap-2 text-epi">
              <span className="w-6 h-6 rounded-full bg-epi text-white flex items-center justify-center">
                1
              </span>
              Select File
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className="flex items-center gap-2 text-epi-muted">
              <span className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                2
              </span>
              Map Columns
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className="flex items-center gap-2 text-epi-muted">
              <span className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                3
              </span>
              Validate
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className="flex items-center gap-2 text-epi-muted">
              <span className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                4
              </span>
              Preview
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className="flex items-center gap-2 text-epi-muted">
              <span className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                5
              </span>
              Import
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Dropzone */}
          <div className="border-2 border-dashed border-epi/30 bg-epi/5 rounded-lg p-12 flex flex-col items-center justify-center text-center mb-8 hover:bg-epi/10 transition-colors cursor-pointer">
            <UploadCloud className="w-16 h-16 text-epi mb-4" />
            <h3 className="text-[18px] font-bold text-epi-text mb-2">
              Drag and drop your file here
            </h3>
            <p className="text-[13px] text-epi-muted mb-1">
              Supported formats: .xlsx, .csv, .xls
            </p>
            <p className="text-[13px] text-epi-muted mb-6">
              Maximum file size: 50MB
            </p>
            <button className="px-6 py-2 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark transition-colors">
              Browse Files
            </button>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-epi-text mb-1">
                Select data source this file belongs to ▼
              </label>
              <select className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                <option>NISR Census Data</option>
                <option>MINAGRI</option>
                <option>WASAC</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-1">
                Reporting period (From)
              </label>
              <input
                type="date"
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi" />
              
            </div>
            <div>
              <label className="block text-[13px] font-bold text-epi-text mb-1">
                Reporting period (To)
              </label>
              <input
                type="date"
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi" />
              
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-epi-text mb-1">
                Uploaded by
              </label>
              <input
                type="text"
                value="Jean Paul Habimana"
                disabled
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] bg-epi-bg text-epi-muted" />
              
            </div>
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden max-w-4xl mx-auto">
        <div className="p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-epi-text">
            Recent Manual Uploads
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  File
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Records
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((h, idx) =>
              <tr key={idx} className="hover:bg-epi-bg/50 transition-colors">
                  <td className="p-4 text-[13px] text-epi-text">{h.date}</td>
                  <td className="p-4 text-[13px] text-epi-text">{h.by}</td>
                  <td className="p-4 text-[13px] font-bold text-epi-text">
                    {h.source}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-epi-muted" />
                    {h.file}
                  </td>
                  <td className="p-4 text-[13px] text-epi-text">{h.records}</td>
                  <td className="p-4 text-[13px] font-bold">{h.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </IntegrationLayout>);

}