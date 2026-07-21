import React, { useState } from 'react';
import { IntegrationLayout } from '../../components/integration/IntegrationLayout';
import {
  Plus,
  X,
  Hospital,
  Microscope,
  Smartphone,
  BarChart2,
  CloudRain,
  Pill,
  Monitor,
  Droplet,
  Wheat } from
'lucide-react';
const sources = [
{
  id: 1,
  name: 'DHIS2 / HMIS',
  icon: Hospital,
  status: '🟢 Active',
  type: 'REST API',
  url: 'dhis2.moh.gov.rw/api',
  auth: 'API Key ••••••••••',
  freq: 'Every 2 hours',
  format: 'JSON',
  extra: 'Districts: All 30',
  lastSync: 'June 5, 13:00',
  btn1: 'Configure',
  btn2: 'Test Connection',
  border: 'border-border'
},
{
  id: 2,
  name: 'RBC Laboratory System',
  icon: Microscope,
  status: '🟢 Active',
  type: 'REST API',
  url: 'labsystem.rbc.gov.rw/api',
  auth: 'Username + Password',
  freq: 'Every 1 hour',
  format: 'JSON',
  extra: '',
  lastSync: 'June 5, 12:45',
  btn1: 'Configure',
  btn2: 'Test Connection',
  border: 'border-border'
},
{
  id: 3,
  name: 'CHW Mobile Reports',
  icon: Smartphone,
  status: '🟡 Delayed',
  type: 'REST API',
  url: 'chwapp.moh.gov.rw/api',
  auth: 'API Key',
  freq: 'Daily 7:00 AM',
  format: 'JSON',
  extra: '',
  lastSync: 'June 5, 07:12',
  warning: '⚠️ 34 failed runs this month — investigate',
  btn1: 'Configure',
  btn2: 'Investigate',
  border: 'border-border'
},
{
  id: 4,
  name: 'NISR Census Data',
  icon: BarChart2,
  status: '🟢 Active',
  type: 'Manual Upload',
  url: '',
  auth: '',
  freq: '',
  format: 'Excel / CSV',
  extra: 'Uploaded by: Jean Paul Habimana',
  lastSync: 'June 2, 2026',
  btn1: 'Upload New File',
  btn2: 'View History',
  border: 'border-border'
},
{
  id: 5,
  name: 'Rwanda Met Agency',
  icon: CloudRain,
  status: '🔴 Disconnected',
  type: 'REST API',
  url: 'meteo.gov.rw/api/v2',
  auth: 'API Key',
  freq: '',
  format: '',
  extra: '',
  lastSync: 'June 2 (last successful)',
  error: 'Connection timeout — SSL certificate expired',
  btn1: 'Reconnect',
  btn2: 'View Error Log',
  border: 'border-epi-red bg-epi-red/5',
  btn1Class: 'bg-epi-red text-white hover:bg-epi-red/90 border-epi-red'
},
{
  id: 6,
  name: 'Pharmacy / Rwanda FDA',
  icon: Pill,
  status: '🟢 Active',
  type: 'REST API',
  url: '',
  auth: '',
  freq: 'Every 4 hours',
  format: 'JSON',
  extra: '',
  lastSync: 'June 5, 11:00',
  btn1: 'Configure',
  btn2: 'Test Connection',
  border: 'border-border'
},
{
  id: 7,
  name: 'EMR Systems',
  icon: Monitor,
  status: '🟡 Partial',
  type: 'REST API',
  url: '',
  auth: '',
  freq: 'Every 6 hours',
  format: 'XML → JSON',
  extra: 'Coverage: 12 of 30 districts',
  lastSync: '',
  warning: '⚠️ 18 districts not yet on EMR system',
  btn1: 'Configure',
  btn2: 'View Coverage',
  border: 'border-border'
},
{
  id: 8,
  name: 'WASAC',
  icon: Droplet,
  status: '🟢 Active',
  type: 'REST API',
  url: '',
  auth: '',
  freq: 'Daily 6:00 AM',
  format: 'CSV',
  extra: '',
  lastSync: 'June 5, 06:00',
  btn1: 'Configure',
  btn2: 'Test Connection',
  border: 'border-border'
},
{
  id: 9,
  name: 'MINAGRI',
  icon: Wheat,
  status: '🟢 Active',
  type: 'REST API',
  url: '',
  auth: '',
  freq: 'Daily 8:00 AM',
  format: 'JSON',
  extra: '',
  lastSync: 'June 5, 08:00',
  btn1: 'Configure',
  btn2: 'Test Connection',
  border: 'border-border'
}];

export function IntegrationSources() {
  const [showPanel, setShowPanel] = useState(false);
  return (
    <IntegrationLayout
      title="Data Source Connections"
      subtitle="Configure and manage all Rwanda health data source integrations"
      breadcrumb="Sources">
      
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowPanel(true)}
          className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors flex items-center gap-2">
          
          <Plus className="w-4 h-4" />
          Add New Data Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {sources.map((src) =>
        <div
          key={src.id}
          className={`bg-white rounded-lg p-6 shadow-card border flex flex-col ${src.border}`}>
          
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-epi-bg flex items-center justify-center">
                  <src.icon className="w-5 h-5 text-epi" />
                </div>
                <h3 className="text-[16px] font-bold text-epi-text">
                  {src.name}
                </h3>
              </div>
              <span className="text-[12px] font-bold bg-epi-bg px-2 py-1 rounded-full">
                {src.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <div className="text-[11px] text-epi-muted font-medium uppercase tracking-wider mb-1">
                  Connection
                </div>
                <div className="text-[13px] font-medium text-epi-text">
                  {src.type}
                </div>
              </div>
              {src.freq &&
            <div>
                  <div className="text-[11px] text-epi-muted font-medium uppercase tracking-wider mb-1">
                    Frequency
                  </div>
                  <div className="text-[13px] font-medium text-epi-text">
                    {src.freq}
                  </div>
                </div>
            }
              {src.format &&
            <div>
                  <div className="text-[11px] text-epi-muted font-medium uppercase tracking-wider mb-1">
                    Format
                  </div>
                  <div className="text-[13px] font-medium text-epi-text">
                    {src.format}
                  </div>
                </div>
            }
            </div>

            <div className="space-y-1 mb-6 flex-1">
              {src.url &&
            <div className="text-[12px] text-epi-muted">
                  <span className="font-medium text-epi-text">URL:</span>{' '}
                  {src.url}
                </div>
            }
              {src.auth &&
            <div className="text-[12px] text-epi-muted">
                  <span className="font-medium text-epi-text">Auth:</span>{' '}
                  {src.auth}
                </div>
            }
              {src.extra &&
            <div className="text-[12px] text-epi-muted">{src.extra}</div>
            }
              {src.warning &&
            <div className="text-[12px] font-medium text-epi-amber mt-2">
                  {src.warning}
                </div>
            }
              {src.error &&
            <div className="text-[12px] font-medium text-epi-red mt-2">
                  Error: {src.error}
                </div>
            }
            </div>

            <div className="pt-4 border-t border-border mt-auto">
              <div className="text-[12px] text-epi-muted mb-4">
                Last sync:{' '}
                <span className="font-medium text-epi-text">
                  {src.lastSync}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                className={`flex-1 py-2 text-[13px] font-bold rounded-md border transition-colors ${src.btn1Class || 'border-epi text-epi hover:bg-epi/5'}`}>
                
                  {src.btn1}
                </button>
                <button className="flex-1 py-2 text-[13px] font-bold rounded-md border border-border text-epi-text hover:bg-epi-bg transition-colors">
                  {src.btn2}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-out Panel */}
        {showPanel &&
        <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-white border-l border-border shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
            <div className="p-6 border-b border-border flex items-center justify-between bg-epi-bg/50">
              <h2 className="text-[18px] font-bold text-epi-text">
                Configure Data Source
              </h2>
              <button
              onClick={() => setShowPanel(false)}
              className="p-2 hover:bg-white rounded-full text-epi-muted">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Source Name
                </label>
                <input
                type="text"
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi"
                placeholder="e.g. DHIS2 / HMIS" />
              
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Source Description
                </label>
                <textarea
                rows={2}
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi"
                placeholder="Brief description...">
              </textarea>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Connection Type
                </label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                  <option>REST API</option>
                  <option>File Upload</option>
                  <option>Manual Entry</option>
                  <option>SFTP</option>
                  <option>Database</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Connection URL
                </label>
                <input
                type="text"
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi"
                placeholder="https://" />
              
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Authentication Type
                </label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                  <option>API Key</option>
                  <option>Username+Password</option>
                  <option>OAuth 2.0</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  API Key or Username
                </label>
                <input
                type="password"
                value="••••••••••"
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi" />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">
                    Data Pull Frequency
                  </label>
                  <select className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                    <option>Every 30 min</option>
                    <option>Hourly</option>
                    <option>Every 2 hours</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Manual only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-epi-text mb-1">
                    Data Format
                  </label>
                  <select className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi">
                    <option>JSON</option>
                    <option>CSV</option>
                    <option>Excel</option>
                    <option>XML</option>
                    <option>HL7 FHIR</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-epi-text mb-1">
                  Districts Covered
                </label>
                <select
                className="w-full border border-border rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-epi"
                multiple
                size={3}>
                
                  <option selected>All 30 Districts</option>
                  <option>Gasabo</option>
                  <option>Nyarugenge</option>
                  <option>Kicukiro</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-5 bg-epi rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-[14px] font-bold text-epi-text">
                  Active
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-epi-bg/50 flex items-center justify-end gap-3">
              <button
              onClick={() => setShowPanel(false)}
              className="text-[13px] font-bold text-epi-muted hover:text-epi-text mr-auto">
              
                Cancel
              </button>
              <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Test Connection
              </button>
              <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
                Save Configuration
              </button>
            </div>
          </div>
        }
      </div>
    </IntegrationLayout>);

}