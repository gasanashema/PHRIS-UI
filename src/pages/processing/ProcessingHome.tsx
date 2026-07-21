import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
import {
  Settings,
  CheckCircle2,
  Database,
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Wand2,
  Calculator,
  Map as MapIcon,
  BrainCircuit,
  Clock } from
'lucide-react';
export function ProcessingHome() {
  return (
    <ProcessingLayout
      title="Data Processing Overview"
      subtitle="Thursday, June 5, 2026 | Rwanda National Health Data Pipeline | Last updated: 13:00 PM"
      breadcrumb="Processing Overview">
      
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-bg flex items-center justify-center">
              <Settings className="w-4 h-4 text-epi animate-spin" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Jobs Running Now
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">3</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Data cleaning · Metric calculation · Feature engineering
          </p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#00A550]/10 text-[#00A550]">
              🟢 Running
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00A550]/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#00A550]" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Last Successful Run
            </h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">
            2h ago — 13:00 PM
          </div>
          <p className="text-[11px] text-epi-muted mb-2">
            All jobs completed successfully
          </p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#00A550]/10 text-[#00A550]">
              🟢 On schedule
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Records Processed Today
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">47,230</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Across 9 data sources and 30 districts
          </p>
          <div className="mt-auto">
            <span className="text-[12px] font-bold text-epi flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +3,400 vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-epi" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Data Quality Score
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-2">89%</div>
          <div className="w-full bg-epi-bg rounded-full h-1.5 mb-2">
            <div
              className="bg-epi h-1.5 rounded-full"
              style={{
                width: '89%'
              }}>
            </div>
          </div>
          <p className="text-[11px] text-epi-muted mb-1">
            3 districts below 70% threshold
          </p>
          <div className="mt-auto">
            <span className="text-[11px] font-bold text-[#00A550]">
              🟢 Good overall
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-red/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-epi-red" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Failed Jobs
            </h3>
          </div>
          <div className="text-2xl font-bold text-epi-text mb-1">2</div>
          <p className="text-[11px] text-epi-muted mb-2">
            Rwanda Met Agency feed · Nyamagabe CHW batch
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[11px] font-bold text-epi-red">
              🔴 Needs attention
            </span>
            <button className="text-[11px] font-bold text-epi-red hover:underline">
              View errors →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-epi-amber/10 flex items-center justify-center">
              <CalendarClock className="w-4 h-4 text-epi-amber" />
            </div>
            <h3 className="text-[13px] font-bold text-epi-muted leading-tight">
              Next Scheduled Run
            </h3>
          </div>
          <div className="text-xl font-bold text-epi-text mb-1">
            15:00 PM today
          </div>
          <p className="text-[11px] text-epi-muted mb-2">
            Data cleaning + metric recalculation
          </p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-epi-amber/10 text-epi-amber">
              🟡 Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Pipeline Flow Diagram */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-6">
        <h2 className="text-[16px] font-bold text-epi-text mb-1">
          National Data Processing Pipeline — Live Status
        </h2>
        <p className="text-[13px] text-epi-muted mb-8">
          Raw data in → Clean, calculated, AI-ready data out
        </p>

        <div className="flex items-center justify-between relative">
          {/* Connecting lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-epi-bg -z-10 -translate-y-1/2"></div>

          {/* Stage 1 */}
          <div className="bg-white border-2 border-epi rounded-lg p-4 w-[180px] shadow-sm relative">
            <div className="text-[11px] font-bold text-epi mb-2 flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> RAW DATA IN
            </div>
            <div className="text-[12px] font-bold text-epi-text mb-1">
              9 sources
            </div>
            <div className="text-[11px] text-epi-muted mb-3">
              47,230 records
            </div>
            <div className="text-[11px] font-bold text-[#00A550]">
              🟢 Flowing
            </div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-epi animate-pulse">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-epi whitespace-nowrap">
              Cleaning...
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-white border-2 border-epi rounded-lg p-4 w-[180px] shadow-sm relative">
            <div className="text-[11px] font-bold text-epi mb-2 flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5" /> DATA CLEANING
            </div>
            <div className="text-[11px] text-epi-muted leading-tight mb-3">
              Errors fixed · Duplicates removed · Names standardized
            </div>
            <div className="text-[11px] font-bold text-[#00A550] flex items-center gap-1">
              <Settings className="w-3 h-3 animate-spin" /> 🟢 Running
            </div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-epi animate-pulse">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-epi whitespace-nowrap">
              Calculating...
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-white border-2 border-epi rounded-lg p-4 w-[180px] shadow-sm relative">
            <div className="text-[11px] font-bold text-epi mb-2 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> METRICS CALCULATED
            </div>
            <div className="text-[11px] text-epi-muted leading-tight mb-3">
              Incidence · CFR · Attack rates · R0 · Doubling time
            </div>
            <div className="text-[11px] font-bold text-[#00A550]">
              🟢 Complete
            </div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-epi">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-white border-2 border-epi rounded-lg p-4 w-[180px] shadow-sm relative">
            <div className="text-[11px] font-bold text-epi mb-2 flex items-center gap-1">
              <MapIcon className="w-3.5 h-3.5" /> AGGREGATED
            </div>
            <div className="text-[11px] text-epi-muted leading-tight mb-3">
              Cell → Sector → District → Province → National
            </div>
            <div className="text-[11px] font-bold text-[#00A550]">
              🟢 Complete
            </div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-epi">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Stage 5 */}
          <div className="bg-white border-2 border-epi-amber rounded-lg p-4 w-[180px] shadow-sm relative">
            <div className="text-[11px] font-bold text-epi-amber mb-2 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" /> FEATURE ENGINEERING
            </div>
            <div className="text-[11px] text-epi-muted leading-tight mb-3">
              AI-ready inputs prepared
            </div>
            <div className="text-[11px] font-bold text-epi-amber mb-1 flex items-center gap-1">
              <Settings className="w-3 h-3 animate-spin" /> 🟡 Running (45 min
              job)
            </div>
            <div className="w-full bg-epi-bg rounded-full h-1.5">
              <div
                className="bg-epi-amber h-1.5 rounded-full"
                style={{
                  width: '62%'
                }}>
              </div>
            </div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-border">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Stage 6 */}
          <div className="bg-epi-bg border-2 border-border rounded-lg p-4 w-[180px] shadow-sm relative opacity-70">
            <div className="text-[11px] font-bold text-epi-muted mb-2 flex items-center gap-1">
              🤖 SENT TO AI MODEL
            </div>
            <div className="text-[11px] text-epi-muted leading-tight mb-3">
              Risk predictions generated
            </div>
            <div className="text-[11px] font-bold text-epi-muted flex items-center gap-1">
              <Clock className="w-3 h-3" /> ⏳ Waiting for Stage 5
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              Processing Job History (Last 24 Hours)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Time
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Job Name
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Records
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-3 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-text">13:00 PM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Data Cleaning
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">14 min</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    12,340 records
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    ✅ Success
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    View log
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-text">13:00 PM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Metric Calculation
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">19 min</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    12,340 records
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    ✅ Success
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    View log
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-text">10:00 AM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Feature Engineering
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">43 min</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    47,230 records
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    ✅ Success
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    View log
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-text">07:00 AM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Trend Analysis
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">28 min</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    47,230 records
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    ✅ Success
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    View log
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-3 text-[13px] text-epi-text">07:00 AM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Geographic Aggregation
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">24 min</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    47,230 records
                  </td>
                  <td className="p-3 text-[13px] font-bold text-[#00A550]">
                    ✅ Success
                  </td>
                  <td className="p-3 text-[13px] text-epi font-medium text-right hover:underline cursor-pointer">
                    View log
                  </td>
                </tr>
                <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                  <td className="p-3 text-[13px] text-epi-text">04:30 AM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Data Cleaning
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">18 min</td>
                  <td className="p-3 text-[13px] text-epi-text">
                    9,840 records
                  </td>
                  <td className="p-3 text-[13px] font-bold text-epi-red">
                    🔴 Failed
                  </td>
                  <td className="p-3 text-[13px] text-epi-red font-bold text-right hover:underline cursor-pointer">
                    View error
                  </td>
                </tr>
                <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                  <td className="p-3 text-[13px] text-epi-text">04:30 AM</td>
                  <td className="p-3 text-[13px] font-bold text-epi-text">
                    Met Agency Import
                  </td>
                  <td className="p-3 text-[13px] text-epi-text">—</td>
                  <td className="p-3 text-[13px] text-epi-text">0 records</td>
                  <td className="p-3 text-[13px] font-bold text-epi-red">
                    🔴 Failed — Source offline
                  </td>
                  <td className="p-3 text-[13px] text-epi-red font-bold text-right hover:underline cursor-pointer">
                    Investigate
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-epi-text flex items-center gap-2">
            ⚠️ Jobs Requiring Attention
          </h2>

          <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-red flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-bold bg-epi-red text-white px-2 py-0.5 rounded">
                🔴 FAILED JOB
              </span>
              <h3 className="text-[14px] font-bold text-epi-text">
                Rwanda Met Agency Import
              </h3>
            </div>
            <div className="text-[12px] text-epi-muted mb-3">
              Failed at: 04:28 AM June 5
            </div>
            <div className="bg-epi-bg p-3 rounded border border-border mb-3 text-[13px]">
              <span className="font-bold text-epi-text">Error:</span>{' '}
              "Connection timeout — source API unreachable"
            </div>
            <div className="bg-epi-red/10 p-3 rounded border border-epi-red/20 mb-4 text-[13px] text-epi-red font-medium">
              <span className="font-bold">Impact:</span> "Environmental risk
              features missing from AI predictions since June 2"
            </div>
            <div className="flex gap-2 mt-auto">
              <button className="flex-1 py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">
                Retry Now
              </button>
              <button className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
                View Error Log
              </button>
              <button className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
                Alert Admin
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-amber flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-bold bg-epi-amber text-white px-2 py-0.5 rounded">
                🟠 PARTIAL FAILURE
              </span>
              <h3 className="text-[14px] font-bold text-epi-text">
                Nyamagabe CHW Batch Processing
              </h3>
            </div>
            <div className="text-[12px] text-epi-muted mb-3">
              Failed at: 04:31 AM June 5
            </div>
            <div className="bg-epi-bg p-3 rounded border border-border mb-3 text-[13px]">
              <span className="font-bold text-epi-text">Error:</span>{' '}
              "Kinyarwanda disease name mapping failed — 3 unknown terms in
              batch"
            </div>
            <div className="bg-epi-amber/10 p-3 rounded border border-epi-amber/20 mb-3 text-[13px] text-[#F97316] font-medium">
              <span className="font-bold">Impact:</span> "47 CHW records from
              Nyamagabe excluded from today's processing"
            </div>
            <div className="text-[12px] text-epi-muted mb-4">
              <span className="font-bold text-epi-text">Unknown terms:</span>{' '}
              "Indwara y'umubabaro" · "Agahinda k'inda" · "Inkorora mbi"
            </div>
            <div className="flex gap-2 mt-auto">
              <button className="flex-1 py-2 bg-epi text-white text-[12px] font-bold rounded hover:bg-epi-dark transition-colors">
                Map Terms Now
              </button>
              <button className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
                View Records
              </button>
              <button className="flex-1 py-2 bg-white border border-border text-epi-text text-[12px] font-bold rounded hover:bg-epi-bg transition-colors">
                Exclude & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProcessingLayout>);

}