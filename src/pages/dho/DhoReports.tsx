import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Hospital,
  Users,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle } from
'lucide-react';
import { DhoLayout } from '../../components/dho/DhoLayout';
const REPORT_TYPES = [
{
  id: 'weekly',
  icon: FileText,
  emoji: '📋',
  title: 'Weekly Situation Report',
  desc: 'Complete weekly health status for submission to RBC'
},
{
  id: 'outbreak',
  icon: Activity,
  emoji: '🦠',
  title: 'Disease Outbreak Summary',
  desc: 'Focused report on active disease alerts and response'
},
{
  id: 'facility',
  icon: Hospital,
  emoji: '🏥',
  title: 'Facility Performance Report',
  desc: 'Reporting compliance and stock levels per facility'
},
{
  id: 'chw',
  icon: Users,
  emoji: '👥',
  title: 'CHW Activity Report',
  desc: 'Community health worker coverage and activity summary'
}];

const SECTIONS = [
'Executive Summary',
'Disease Trends',
'Alert Summary',
'Facility Data',
'CHW Activity',
'Interventions',
'Map'];

const RECENT = [
{
  title: 'Weekly Situation Report — Huye District',
  date: 'June 2, 2026',
  format: 'PDF',
  status: 'Submitted to RBC',
  ok: true,
  action: 'Share'
},
{
  title: 'Disease Alert Summary',
  date: 'June 1, 2026',
  format: 'PDF + Word',
  status: 'Shared with District Mayor',
  ok: true,
  action: 'Share'
},
{
  title: 'Facility Performance',
  date: 'May 26, 2026',
  format: 'Excel',
  status: 'Sent to 15 facility in-charges',
  ok: true,
  action: 'Share'
},
{
  title: 'CHW Activity Report',
  date: 'May 19, 2026',
  format: 'PDF',
  status: 'Not yet submitted',
  ok: false,
  action: 'Submit Now'
}];

export function DhoReports() {
  const [selected, setSelected] = useState<string | null>('weekly');
  const [checked, setChecked] = useState<string[]>(SECTIONS.slice(0, 5));
  const [lang, setLang] = useState('English');
  const [fmt, setFmt] = useState('PDF');
  const toggle = (s: string) =>
  setChecked((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  return (
    <DhoLayout
      title="Reports — Huye District"
      subtitle="Generate and export official district health reports"
      breadcrumb="Reports">
      
      <div className="grid grid-cols-[55%_45%] gap-6">
        {/* Left — generator */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-admin-text mb-1">
              Generate a Report
            </h2>
            <p className="text-[13px] text-admin-muted mb-4">
              Step 1 — Select report type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {REPORT_TYPES.map((r) => {
                const active = selected === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${active ? 'border-admin bg-admin/5' : 'border-border hover:border-admin/40'}`}>
                    
                    <div className="text-[22px] mb-2">{r.emoji}</div>
                    <div className="text-[14px] font-bold text-admin-text mb-1">
                      {r.title}
                    </div>
                    <div className="text-[12px] text-admin-muted leading-snug">
                      {r.desc}
                    </div>
                  </button>);

              })}
            </div>
          </div>

          {selected &&
          <div className="bg-white rounded-lg shadow-card border border-border p-6 space-y-5">
              <div>
                <h3 className="text-[15px] font-bold text-admin-text mb-1">
                  Step 2 — Report Parameters
                </h3>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                  Report period
                </label>
                <div className="flex items-center gap-2">
                  <input
                  type="date"
                  className="flex-1 h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />
                
                  <span className="text-admin-muted text-[13px]">to</span>
                  <input
                  type="date"
                  className="flex-1 h-10 px-3 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin" />
                
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-2">
                  Include sections
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SECTIONS.map((s) =>
                <label
                  key={s}
                  className="flex items-center gap-2 text-[13px] text-admin-text cursor-pointer">
                  
                      <input
                    type="checkbox"
                    checked={checked.includes(s)}
                    onChange={() => toggle(s)}
                    className="w-4 h-4 rounded accent-admin" />
                  
                      {s}
                    </label>
                )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                    Language
                  </label>
                  <div className="flex gap-1.5">
                    {['English', 'French', 'Kinyarwanda'].map((l) =>
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 h-9 rounded-md text-[11px] font-semibold transition-colors ${lang === l ? 'bg-admin text-white' : 'bg-admin-bg text-admin-muted border border-border'}`}>
                    
                        {l}
                      </button>
                  )}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                    Export format
                  </label>
                  <div className="flex gap-1.5">
                    {['PDF', 'Word', 'Excel'].map((f) =>
                  <button
                    key={f}
                    onClick={() => setFmt(f)}
                    className={`flex-1 h-9 rounded-md text-[12px] font-semibold transition-colors ${fmt === f ? 'bg-admin text-white' : 'bg-admin-bg text-admin-muted border border-border'}`}>
                    
                        {f}
                      </button>
                  )}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button className="w-full h-11 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md">
                  Generate Report
                </button>
              </div>
              {/* Preview pane */}
              <div className="border border-dashed border-border rounded-lg p-6 bg-admin-bg text-center">
                <div className="bg-white border border-border rounded-md shadow-sm max-w-[260px] mx-auto p-4 text-left">
                  <div className="text-[10px] font-bold text-admin">
                    HUYE DISTRICT HEALTH OFFICE
                  </div>
                  <div className="text-[13px] font-bold text-admin-text mt-1">
                    {REPORT_TYPES.find((r) => r.id === selected)?.title}
                  </div>
                  <div className="text-[9px] text-admin-muted mt-0.5">
                    Southern Province · June 2026
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="space-y-1">
                    <div className="h-1.5 bg-admin-bg rounded w-full" />
                    <div className="h-1.5 bg-admin-bg rounded w-4/5" />
                    <div className="h-1.5 bg-admin-bg rounded w-5/6" />
                  </div>
                </div>
                <p className="text-[11px] text-admin-muted mt-3">
                  Report preview — first page
                </p>
              </div>
            </div>
          }
        </div>

        {/* Right — recent reports */}
        <div className="bg-white rounded-lg shadow-card border border-border p-6 h-fit">
          <h2 className="text-[16px] font-bold text-admin-text mb-4">
            Recently Generated Reports
          </h2>
          <div className="space-y-3">
            {RECENT.map((r, i) =>
            <div
              key={i}
              className="border border-border rounded-lg p-4 hover:bg-admin-bg/30">
              
                <div className="text-[14px] font-bold text-admin-text mb-1">
                  {r.title}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-admin-muted mb-2">
                  <span>{r.date}</span>
                  <span className="text-border">·</span>
                  <span className="font-medium">{r.format}</span>
                </div>
                <div
                className={`flex items-center gap-1.5 text-[12px] font-medium mb-3 ${r.ok ? 'text-admin-accent' : 'text-admin-amber'}`}>
                
                  {r.ok ?
                <CheckCircle className="w-3.5 h-3.5" /> :

                <AlertTriangle className="w-3.5 h-3.5" />
                }
                  {r.status}
                </div>
                <div className="flex items-center gap-3 text-[12px] font-bold">
                  <button className="text-admin hover:underline flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <span className="text-border">·</span>
                  <button className="text-admin hover:underline flex items-center gap-1">
                    {r.action === 'Share' ?
                  <Share2 className="w-3.5 h-3.5" /> :
                  null}{' '}
                    {r.action}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DhoLayout>);

}