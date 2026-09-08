import React, { useState } from 'react';
import {
  Database,
  Activity,
  FileText,
  CloudRain,
  Droplets,
  Stethoscope,
  Pill,
  AlertTriangle,
  X } from
'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
import { DataSourceDetailsModal, DataSourceItem } from '../../components/admin/DataSourceDetailsModal';

export function AdminDataSources() {
  const [drawerConfig, setDrawerConfig] = useState({
    open: false,
    sourceName: '',
    isReconnect: false
  });
  const [selectedSourceForDetails, setSelectedSourceForDetails] = useState<DataSourceItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const sparkData = [
  {
    v: 40
  },
  {
    v: 35
  },
  {
    v: 50
  },
  {
    v: 45
  },
  {
    v: 60
  },
  {
    v: 55
  },
  {
    v: 65
  }];

  const sparkDataFail = [
  {
    v: 40
  },
  {
    v: 35
  },
  {
    v: 50
  },
  {
    v: 0
  },
  {
    v: 0
  },
  {
    v: 0
  },
  {
    v: 0
  }];

  const sources = [
  {
    name: 'DHIS2 / HMIS',
    icon: Database,
    status: '🟢 Active',
    time: '2h ago',
    recs: '1,204 records',
    up: '99.1%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'RBC National Laboratory',
    icon: Activity,
    status: '🟢 Active',
    time: '1h ago',
    recs: '347 records',
    up: '97.8%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'CHW Mobile Reports',
    icon: FileText,
    status: '🟡 Delayed',
    time: '6h ago',
    recs: '89 records',
    up: '91.2%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'NISR Census & Demographics',
    icon: UsersIcon,
    status: '🟢 Active',
    time: '1 day ago',
    recs: 'Static data',
    up: '100%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'Rwanda Meteorological Agency',
    icon: CloudRain,
    status: '🔴 Disconnected',
    time: '3 days ago',
    recs: '0 records',
    up: '71.4%',
    spark: sparkDataFail,
    action: 'Reconnect',
    isRed: true
  },
  {
    name: 'WASAC (Water & Sanitation)',
    icon: Droplets,
    status: '🟢 Active',
    time: '4h ago',
    recs: '56 records',
    up: '95.6%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'MINAGRI (Agriculture/Nutrition)',
    icon: FileText,
    status: '🟡 Delayed',
    time: '8h ago',
    recs: '12 records',
    up: '88.3%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'Electronic Medical Records (EMR)',
    icon: Stethoscope,
    status: '🟢 Active',
    time: '3h ago',
    recs: '892 records',
    up: '98.2%',
    spark: sparkData,
    action: 'Configure'
  },
  {
    name: 'Pharmacy & Medicine Dispensing',
    icon: Pill,
    status: '🟢 Active',
    time: '2h ago',
    recs: '234 records',
    up: '96.7%',
    spark: sparkData,
    action: 'Configure'
  }];

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; Data Sources
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          Health Data Sources
        </h1>
        <p className="text-[14px] text-admin-muted">
          Live monitoring of all 9 Rwanda health data connections
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-text shadow-sm">
          🟢 7 Active
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-text shadow-sm">
          🟡 1 Delayed
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-border text-[13px] font-bold text-admin-text shadow-sm">
          🔴 1 Disconnected
        </div>
        <div className="bg-admin-amber/10 px-4 py-2 rounded-full border border-admin-amber/20 text-[13px] font-bold text-admin-amber shadow-sm">
          ⚠️ 2 Need Attention
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sources.map((s, i) =>
        <div
          key={i}
          className={`bg-white rounded-lg shadow-sm border ${s.isRed ? 'border-admin-red' : 'border-border'} p-5 flex flex-col`}>
          
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                className={`w-10 h-10 rounded-md flex items-center justify-center ${s.isRed ? 'bg-admin-red/10 text-admin-red' : 'bg-admin-bg text-admin'}`}>
                
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-admin-text leading-tight max-w-[160px]">
                  {s.name}
                </h3>
              </div>
              <span className="text-[12px] font-bold bg-admin-bg px-2 py-1 rounded">
                {s.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <div className="text-[11px] text-admin-muted uppercase tracking-wider mb-1">
                  Last Sync
                </div>
                <div className="text-[13px] font-medium text-admin-text">
                  {s.time}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-admin-muted uppercase tracking-wider mb-1">
                  Records Today
                </div>
                <div className="text-[13px] font-medium text-admin-text">
                  {s.recs}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-admin-muted uppercase tracking-wider mb-1">
                  Uptime (30d)
                </div>
                <div
                className={`text-[13px] font-bold ${s.isRed ? 'text-admin-red' : 'text-admin-accent'}`}>
                
                  {s.up}
                </div>
              </div>
            </div>

            <div className="h-10 mb-4 opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.spark}>
                  <Line
                  type="monotone"
                  dataKey="v"
                  stroke={s.isRed ? '#D32F2F' : '#104E49'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false} />
                
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setSelectedSourceForDetails(s)}
                className="text-[13px] font-bold text-admin hover:underline"
              >
                View Details
              </button>
              <button
              onClick={() =>
              setDrawerConfig({
                open: true,
                sourceName: s.name,
                isReconnect: s.isRed || false
              })
              }
              className={`h-8 px-4 text-[13px] font-semibold rounded transition-colors ${s.isRed ? 'bg-admin-red hover:bg-red-700 text-white' : 'bg-admin-bg hover:bg-border text-admin-text'}`}>
              
                {s.action}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-admin-amber/10 border border-admin-amber/20 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-admin-amber/20 transition-colors">
        <AlertTriangle className="w-5 h-5 text-admin-amber shrink-0 mt-0.5" />
        <p className="text-[14px] text-admin-text font-medium">
          <span className="font-bold">
            ⚠️ Rwanda Meteorological Agency has been disconnected for 3 days.
          </span>{' '}
          Environmental risk predictions may be affected. Click to investigate →
        </p>
      </div>

      {/* Slide-out Drawer */}
      {drawerConfig.open &&
      <>
          <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() =>
          setDrawerConfig((prev) => ({
            ...prev,
            open: false
          }))
          } />
        
          <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="text-[18px] font-bold text-admin-text">
                {drawerConfig.isReconnect ?
              'Reconnect Data Source' :
              'Data Source Configuration'}
              </h2>
              <button
              onClick={() =>
              setDrawerConfig((prev) => ({
                ...prev,
                open: false
              }))
              }
              className="text-admin-muted hover:text-admin-text">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Source Name
                </label>
                <input
                type="text"
                value={drawerConfig.sourceName}
                disabled
                className="w-full h-10 px-3 bg-admin-bg border border-border rounded-md text-admin-muted outline-none" />
              
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Connection URL / Endpoint
                </label>
                <input
                type="text"
                defaultValue="https://api.example.gov.rw/v1/sync"
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
              
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  API Key / Token
                </label>
                <input
                type="password"
                defaultValue="••••••••••••••••"
                className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none" />
              
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Sync Frequency
                </label>
                <select className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none bg-white">
                  <option>Real-time</option>
                  <option>Hourly</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Data Format
                </label>
                <select className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-admin focus:border-admin outline-none bg-white">
                  <option>JSON</option>
                  <option>XML</option>
                  <option>CSV</option>
                  <option>HL7 FHIR</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-medium text-admin-text">
                      Active
                    </div>
                    <div className="text-[12px] text-admin-muted">
                      Enable data synchronization
                    </div>
                  </div>
                  <div className="w-11 h-6 bg-admin-accent rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <button className="w-full h-10 mt-2 bg-admin-bg border border-border hover:bg-border text-admin-text text-[14px] font-semibold rounded-md transition-colors">
                  Test Connection
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-admin-bg flex gap-3 shrink-0">
              <button
              onClick={() =>
              setDrawerConfig((prev) => ({
                ...prev,
                open: false
              }))
              }
              className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-text text-[14px] font-semibold rounded-md transition-colors">
              
                Cancel
              </button>
              <button
              onClick={() => {
                setDrawerConfig((prev) => ({
                  ...prev,
                  open: false
                }));
                setShowSuccess(true);
              }}
              className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md transition-colors">
              
                Save Configuration
              </button>
            </div>
          </div>
        </>
      }

      <SuccessModal
        open={showSuccess}
        title="Data source updated"
        message="Connection settings saved. The next sync will use the new configuration."
        onClose={() => setShowSuccess(false)} />

      <DataSourceDetailsModal
        open={!!selectedSourceForDetails}
        source={selectedSourceForDetails}
        onClose={() => setSelectedSourceForDetails(null)}
        onConfigure={(sourceName, isReconnect) => {
          setDrawerConfig({
            open: true,
            sourceName,
            isReconnect
          });
        }}
      />
    </AdminLayout>);

}
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>);

}