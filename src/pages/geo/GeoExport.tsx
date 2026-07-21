import React from 'react';
import { GeoLayout } from '../../components/geo/GeoLayout';
import {
  Image,
  FileText,
  Video,
  Link as LinkIcon,
  Database } from
'lucide-react';
export function GeoExport() {
  return (
    <GeoLayout
      title="Export Map"
      subtitle="Save and share AI Vital maps for reports, presentations, and field use"
      breadcrumb="Export & Reports">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Map Preview */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-card border border-border p-4">
            <div className="relative w-full aspect-video bg-[#1A1A1A] rounded-lg overflow-hidden border border-border flex items-center justify-center mb-4">
              {/* Simulated Map Preview (Cholera Heat Map) */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                  'radial-gradient(#404040 1px, transparent 1px)',
                  backgroundSize: '10px 10px'
                }}>
              </div>
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                viewBox="0 0 100 100"
                preserveAspectRatio="none">
                
                <path
                  d="M20,20 L40,10 L60,20 L80,10 L90,40 L80,70 L60,90 L40,80 L20,90 L10,60 Z"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="0.5" />
                
              </svg>
              <div className="absolute bottom-[20%] left-[20%] w-32 h-32 bg-[#7B0000] rounded-full blur-xl opacity-80 mix-blend-screen"></div>
              <div className="absolute bottom-[25%] left-[18%] w-20 h-20 bg-[#F57C00] rounded-full blur-lg opacity-70 mix-blend-screen"></div>

              <div className="absolute top-2 left-2 bg-black/60 text-white/90 text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                AI Vital | Rwanda National Health Map
              </div>
            </div>

            <div className="text-center">
              <div className="text-[14px] font-bold text-epi-text mb-1">
                Current view: Cholera Heat Map | Rwanda National | June 5, 2026
              </div>
              <button className="text-[13px] font-bold text-epi hover:underline">
                Configure map before export →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Export Options */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Card 1 - Static Image */}
          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <Image className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">
                Static Image
              </h3>
              <p className="text-[13px] text-epi-muted mb-4">
                PNG or JPG — for reports and presentations
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                    Format
                  </label>
                  <select className="w-full text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1.5 focus:outline-none bg-white">
                    <option>PNG (transparent bg)</option>
                    <option>JPG (white bg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                    Resolution
                  </label>
                  <select className="w-full text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1.5 focus:outline-none bg-white">
                    <option>Standard (1920px)</option>
                    <option>High (3840px)</option>
                  </select>
                </div>
              </div>

              <button className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
                Export as Image
              </button>
            </div>
          </div>

          {/* Card 2 - Print-Ready PDF */}
          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">
                Print-Ready PDF
              </h3>
              <p className="text-[13px] text-epi-muted mb-3">
                PDF with legend and title — for printing and field teams without
                internet
              </p>
              <div className="text-[12px] text-epi-text bg-epi-bg p-2 rounded border border-border mb-4">
                <span className="font-bold">Includes:</span> Map + legend +
                title + date + AI Vital footer
              </div>
              <button className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
                Export as PDF
              </button>
            </div>
          </div>

          {/* Card 3 - Animated Video */}
          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">
                Animated Video
              </h3>
              <p className="text-[13px] text-epi-muted mb-3">
                MP4 video of outbreak spread animation — for presentations and
                meetings
              </p>
              <div className="flex gap-4 text-[12px] text-epi-text mb-4">
                <div>
                  <span className="text-epi-muted">Duration:</span>{' '}
                  <span className="font-bold">7 days × 2 seconds = 14s</span>
                </div>
                <div>
                  <span className="text-epi-muted">Format:</span>{' '}
                  <span className="font-bold">MP4 1080p</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
                Export Animation (MP4)
              </button>
            </div>
          </div>

          {/* Card 4 - Interactive Link */}
          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">
                Interactive Link
              </h3>
              <p className="text-[13px] text-epi-muted mb-3">
                Shareable link to live map — colleagues can explore the same
                view online
              </p>
              <div className="bg-epi-bg p-2 rounded border border-border text-[12px] font-mono text-epi-text mb-4 break-all">
                aivital.rbc.gov.rw/map/share/chol-rusizi-0605
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors">
                  Copy Link
                </button>
                <button className="px-6 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg transition-colors">
                  Send by Email
                </button>
              </div>
            </div>
          </div>

          {/* Card 5 - Data Export */}
          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">
                Data Export
              </h3>
              <p className="text-[13px] text-epi-muted mb-3">
                Raw geographic data — for further analysis
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] text-epi-muted">Formats:</span>
                <span className="text-[12px] font-bold text-epi-text bg-epi-bg px-2 py-1 rounded border border-border">
                  Excel
                </span>
                <span className="text-[12px] font-bold text-epi-text bg-epi-bg px-2 py-1 rounded border border-border">
                  CSV
                </span>
                <span className="text-[12px] font-bold text-epi-text bg-epi-bg px-2 py-1 rounded border border-border">
                  GeoJSON
                </span>
              </div>
              <button className="px-6 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded hover:bg-epi/5 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}