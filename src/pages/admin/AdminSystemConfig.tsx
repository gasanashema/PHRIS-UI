import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Smartphone,
  Map,
  Database,
  ChevronDown,
  ChevronUp } from
'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
export function AdminSystemConfig() {
  const [reportOpen, setReportOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const tabs = [
  {
    icon: Bell,
    label: 'Alert Thresholds'
  },
  {
    icon: Calendar,
    label: 'Report Scheduling'
  },
  {
    icon: Clock,
    label: 'Session & Security'
  },
  {
    icon: Smartphone,
    label: 'Notifications'
  },
  {
    icon: Map,
    label: 'Geographic Boundaries'
  },
  {
    icon: Database,
    label: 'Data Retention'
  }];

  const diseases = [
  {
    name: 'Malaria',
    y: '50',
    o: '120',
    r: '300'
  },
  {
    name: 'Cholera',
    y: '5',
    o: '15',
    r: '30'
  },
  {
    name: 'Measles',
    y: '3',
    o: '10',
    r: '25'
  },
  {
    name: 'Diarrheal Disease',
    y: '80',
    o: '200',
    r: '500'
  },
  {
    name: 'Typhoid',
    y: '10',
    o: '30',
    r: '75'
  },
  {
    name: 'Meningitis',
    y: '2',
    o: '5',
    r: '15'
  }];

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; System Configuration
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          System Configuration
        </h1>
        <p className="text-[14px] text-admin-muted">
          Configure how AI Vital behaves across all modules and users
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Tabs */}
        <div className="w-full lg:w-[240px] shrink-0">
          <nav className="space-y-1">
            {tabs.map((t, i) =>
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-[14px] font-medium transition-colors ${i === 0 ? 'bg-admin text-white' : 'text-admin-muted hover:bg-white hover:text-admin-text'}`}>
              
                <t.icon className="w-5 h-5" />
                {t.label}
              </button>
            )}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-[18px] font-bold text-admin-text mb-1">
              Disease Alert Thresholds
            </h2>
            <p className="text-[14px] text-admin-muted mb-6">
              Set the case count or rate that triggers each alert level per
              disease.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-admin-bg/50 text-admin-muted font-medium border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Disease</th>
                    <th className="px-4 py-3">🟡 Yellow Threshold</th>
                    <th className="px-4 py-3">🟠 Orange Threshold</th>
                    <th className="px-4 py-3">🔴 Red Threshold</th>
                    <th className="px-4 py-3">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {diseases.map((d, i) =>
                  <tr key={i}>
                      <td className="px-4 py-3 font-bold text-admin-text">
                        {d.name}
                      </td>
                      <td className="px-4 py-3">
                        <input
                        type="text"
                        defaultValue={d.y}
                        className="w-20 h-8 px-2 border border-border rounded text-center focus:outline-none focus:border-admin" />
                      
                      </td>
                      <td className="px-4 py-3">
                        <input
                        type="text"
                        defaultValue={d.o}
                        className="w-20 h-8 px-2 border border-border rounded text-center focus:outline-none focus:border-admin" />
                      
                      </td>
                      <td className="px-4 py-3">
                        <input
                        type="text"
                        defaultValue={d.r}
                        className="w-20 h-8 px-2 border border-border rounded text-center focus:outline-none focus:border-admin" />
                      
                      </td>
                      <td className="px-4 py-3">
                        <select className="h-8 px-2 border border-border rounded bg-white focus:outline-none focus:border-admin">
                          <option>Cases/week</option>
                          <option>% increase</option>
                        </select>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-admin-text">
                  R0 Orange Threshold
                </label>
                <input
                  type="text"
                  defaultValue="1.2"
                  className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin" />
                
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-admin-text">
                  R0 Red Threshold
                </label>
                <input
                  type="text"
                  defaultValue="2.0"
                  className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin" />
                
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-admin-text">
                  Outbreak Probability Red Alert (%)
                </label>
                <input
                  type="text"
                  defaultValue="75%"
                  className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin" />
                
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <button
              onClick={() => setReportOpen(!reportOpen)}
              className="w-full p-6 flex items-center justify-between bg-white hover:bg-admin-bg/50 transition-colors">
              
              <h2 className="text-[18px] font-bold text-admin-text">
                Report Scheduling
              </h2>
              {reportOpen ?
              <ChevronUp className="w-5 h-5 text-admin-muted" /> :

              <ChevronDown className="w-5 h-5 text-admin-muted" />
              }
            </button>

            {reportOpen &&
            <div className="p-6 pt-0 border-t border-border">
                <div className="space-y-4 pt-4">
                  {[
                {
                  name: 'Weekly Epidemiological Bulletin',
                  freq: 'Every Monday',
                  time: '07:00 AM',
                  recs: '234 recipients',
                  active: true
                },
                {
                  name: "Minister's Health Brief",
                  freq: 'Every Monday',
                  time: '08:00 AM',
                  recs: '6 recipients',
                  active: true
                },
                {
                  name: 'District Alert Summary',
                  freq: 'Every Monday',
                  time: '09:00 AM',
                  recs: '30 recipients',
                  active: true
                }].
                map((r, i) =>
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-border rounded-md">
                  
                      <div>
                        <div className="font-bold text-admin-text text-[14px]">
                          {r.name}
                        </div>
                        <div className="text-[13px] text-admin-muted mt-1">
                          {r.freq} | {r.time} | {r.recs}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-[13px] font-bold text-admin hover:underline">
                          Edit
                        </button>
                        <div
                      className={`w-11 h-6 rounded-full relative cursor-pointer ${r.active ? 'bg-admin-accent' : 'bg-border'}`}>
                      
                          <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${r.active ? 'right-1' : 'left-1'}`} />
                      
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }
          </div>

          <button
            onClick={() => setShowSuccess(true)}
            className="w-full h-12 bg-admin hover:bg-admin-hover text-white text-[15px] font-semibold rounded-md transition-colors">
            
            Save All Configuration
          </button>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        title="Configuration saved"
        message="System configuration changes are now live across all modules."
        onClose={() => setShowSuccess(false)} />
      
    </AdminLayout>);

}