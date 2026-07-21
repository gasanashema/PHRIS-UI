import React from 'react';
import { FileText, Activity, BarChart2, Globe } from 'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
export function EpiReports() {
  return (
    <EpiLayout
      title="Epidemiological Reports"
      subtitle="Official AI Vital epidemiological documentation"
      breadcrumb="Epi Reports">
      
      <div className="bg-epi text-white rounded-lg p-6 mb-8 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <h2 className="text-[20px] font-bold mb-2">
            📋 Weekly Epidemiological Bulletin — Week 23, 2026
          </h2>
          <p className="text-[14px] text-white/80 mb-4">
            Auto-generated from live data | Ready for review and distribution
            <br />
            234 recipients | Last manual bulletin took 2.5 days — this was
            generated in 14 minutes
          </p>
          <div className="flex gap-3">
            <button className="h-10 px-5 bg-white text-epi text-[14px] font-bold rounded-md hover:bg-white/90">
              Review Bulletin
            </button>
            <button className="h-10 px-5 bg-epi-accent text-white text-[14px] font-bold rounded-md hover:bg-epi-accent/90">
              Approve & Send
            </button>
            <button className="h-10 px-5 border border-white/30 hover:bg-white/10 text-white text-[14px] font-bold rounded-md">
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-epi/10 flex items-center justify-center text-epi">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-epi-text">
              Weekly Epi Bulletin
            </h3>
          </div>
          <p className="text-[13px] text-epi-muted mb-4">
            Automated weekly summary of all diseases, alerts, outbreaks, and
            district performance.
          </p>
          <div className="text-[12px] text-epi-muted space-y-1 mb-6">
            <div>
              Frequency:{' '}
              <span className="font-medium text-epi-text">
                Every Monday 7:00 AM
              </span>
            </div>
            <div>
              Last generated:{' '}
              <span className="font-medium text-epi-text">June 2, 2026</span>
            </div>
            <div>
              Status:{' '}
              <span className="font-medium text-epi-accent">
                ✅ Sent to 234 recipients
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <button className="flex-1 h-9 bg-epi-bg border border-border hover:border-epi text-epi-text text-[13px] font-bold rounded-md">
              View Latest
            </button>
            <button className="flex-1 h-9 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
              Generate Now
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-epi-red/10 flex items-center justify-center text-epi-red">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-epi-text">
              Outbreak Investigation Report
            </h3>
          </div>
          <p className="text-[13px] text-epi-muted mb-4">
            Full investigation findings per confirmed outbreak — for MOH, WHO,
            and partners.
          </p>
          <div className="text-[12px] text-epi-muted space-y-1 mb-6">
            <div>
              Active reports:{' '}
              <span className="font-medium text-epi-text">
                2 open outbreaks
              </span>
            </div>
            <div>
              Last generated:{' '}
              <span className="font-medium text-epi-text">
                June 1, 2026 (Cholera — Rusizi)
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <button className="flex-1 h-9 bg-epi-bg border border-border hover:border-epi text-epi-text text-[13px] font-bold rounded-md">
              View Reports
            </button>
            <button className="flex-1 h-9 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
              Create New
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-epi-amber/10 flex items-center justify-center text-epi-amber">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-epi-text">
              Disease Trend Analysis
            </h3>
          </div>
          <p className="text-[13px] text-epi-muted mb-4">
            Monthly national disease trend analysis for policy and planning.
          </p>
          <div className="text-[12px] text-epi-muted space-y-1 mb-6">
            <div>
              Frequency:{' '}
              <span className="font-medium text-epi-text">
                Monthly (1st of month)
              </span>
            </div>
            <div>
              Last generated:{' '}
              <span className="font-medium text-epi-text">June 1, 2026</span>
            </div>
            <div>
              Status:{' '}
              <span className="font-medium text-epi-accent">
                ✅ Sent to MOH and partners
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <button className="flex-1 h-9 bg-epi-bg border border-border hover:border-epi text-epi-text text-[13px] font-bold rounded-md">
              View Latest
            </button>
            <button className="flex-1 h-9 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
              Generate Now
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card border border-border p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-epi-info/10 flex items-center justify-center text-epi-info">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-epi-text">
              Cross-Border Health Report
            </h3>
          </div>
          <p className="text-[13px] text-epi-muted mb-4">
            Disease situation near DRC, Uganda, Burundi, and Tanzania borders —
            for national security and WHO reporting.
          </p>
          <div className="text-[12px] text-epi-muted space-y-1 mb-6">
            <div>
              Frequency:{' '}
              <span className="font-medium text-epi-text">Weekly</span>
            </div>
            <div>
              Last generated:{' '}
              <span className="font-medium text-epi-text">June 3, 2026</span>
            </div>
            <div>
              Status:{' '}
              <span className="font-medium text-epi-accent">
                ✅ Sent to RBC + WHO Rwanda
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <button className="flex-1 h-9 bg-epi-bg border border-border hover:border-epi text-epi-text text-[13px] font-bold rounded-md">
              View Latest
            </button>
            <button className="flex-1 h-9 bg-epi hover:bg-epi-hover text-white text-[13px] font-bold rounded-md">
              Generate Now
            </button>
          </div>
        </div>
      </div>
    </EpiLayout>);

}