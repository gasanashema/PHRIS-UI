import React from 'react';
import { ProcessingLayout } from '../../components/processing/ProcessingLayout';
export function ProcessingScheduler() {
  return (
    <ProcessingLayout
      title="Processing Job Scheduler"
      subtitle="Automated data processing pipeline — Rwanda national health data"
      breadcrumb="Job Scheduler">
      
      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-card border border-border p-6 mb-8">
        <h2 className="text-[16px] font-bold text-epi-text mb-6">
          Today's Processing Schedule — June 5, 2026
        </h2>

        <div className="relative pt-8 pb-4">
          {/* Base line */}
          <div className="absolute left-0 right-0 top-10 h-1 bg-epi-bg rounded-full"></div>

          {/* Time markers */}
          <div className="flex justify-between text-[11px] font-bold text-epi-muted absolute left-0 right-0 top-0">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>

          {/* Jobs */}
          {/* 03:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi-muted rounded-full z-10"
            style={{
              left: '12.5%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi-muted text-center">
              03:00 AM
              <br />
              Full backup ✅
            </div>
          </div>

          {/* 07:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi rounded-full z-10"
            style={{
              left: '29.1%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi text-center">
              07:00 AM
              <br />
              Trend + Geo ✅
            </div>
          </div>

          {/* 09:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi rounded-full z-10"
            style={{
              left: '37.5%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi text-center">
              09:00 AM
              <br />
              Cleaning ✅
            </div>
          </div>

          {/* 11:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi rounded-full z-10"
            style={{
              left: '45.8%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi text-center">
              11:00 AM
              <br />
              Features ✅
            </div>
          </div>

          {/* 13:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi rounded-full z-10"
            style={{
              left: '54.1%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi text-center">
              13:00 PM
              <br />
              Clean + Metrics ✅
            </div>
          </div>

          {/* 15:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi-bg border-2 border-epi rounded-full z-10"
            style={{
              left: '62.5%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi-muted text-center">
              15:00 PM
              <br />
              Clean + Metrics 🔄
            </div>
          </div>

          {/* 17:00 */}
          <div
            className="absolute top-8 w-3 h-5 bg-epi-bg border-2 border-epi rounded-full z-10"
            style={{
              left: '70.8%'
            }}>
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-max text-[11px] font-medium text-epi-muted text-center">
              17:00 PM
              <br />
              Features 🔄
            </div>
          </div>

          {/* Current Time Marker */}
          <div
            className="absolute top-4 bottom-0 w-px border-l-2 border-dashed border-epi-amber z-0"
            style={{
              left: '57.2%'
            }}>
            
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold text-epi-amber whitespace-nowrap bg-white px-1">
              📍 Now — 13:45 PM
            </div>
          </div>
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-epi-text">
            All Processing Jobs
          </h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
              Run All Jobs Now
            </button>
            <button className="px-4 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
              Add New Job
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-epi-bg border-b border-border">
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Job Name
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Frequency
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Duration
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Last Run
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                  Next Run
                </th>
                <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Data Cleaning
                </td>
                <td className="p-4 text-[13px] text-epi-text">Every 2 hours</td>
                <td className="p-4 text-[13px] text-epi-muted">~15 min</td>
                <td className="p-4 text-[13px] text-epi-text">13:00 PM ✅</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Success
                </td>
                <td className="p-4 text-[13px] text-epi-text">15:00 PM</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Edit</button> ·{' '}
                  <button className="hover:underline">Run Now</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Metric Calculation
                </td>
                <td className="p-4 text-[13px] text-epi-text">Every 2 hours</td>
                <td className="p-4 text-[13px] text-epi-muted">~20 min</td>
                <td className="p-4 text-[13px] text-epi-text">13:00 PM ✅</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Success
                </td>
                <td className="p-4 text-[13px] text-epi-text">15:00 PM</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Edit</button> ·{' '}
                  <button className="hover:underline">Run Now</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Feature Engineering
                </td>
                <td className="p-4 text-[13px] text-epi-text">Every 6 hours</td>
                <td className="p-4 text-[13px] text-epi-muted">~45 min</td>
                <td className="p-4 text-[13px] text-epi-text">13:00 PM ✅</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Running
                </td>
                <td className="p-4 text-[13px] text-epi-text">19:00 PM</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">View Progress</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Trend Analysis
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Daily — 07:00 AM
                </td>
                <td className="p-4 text-[13px] text-epi-muted">~30 min</td>
                <td className="p-4 text-[13px] text-epi-text">07:00 AM ✅</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Success
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Tomorrow 07:00
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Geographic Aggregation
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Daily — 07:00 AM
                </td>
                <td className="p-4 text-[13px] text-epi-muted">~25 min</td>
                <td className="p-4 text-[13px] text-epi-text">07:00 AM ✅</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Success
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Tomorrow 07:00
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Temporal Aggregation
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Daily — 07:30 AM
                </td>
                <td className="p-4 text-[13px] text-epi-muted">~20 min</td>
                <td className="p-4 text-[13px] text-epi-text">07:30 AM ✅</td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Success
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Tomorrow 07:30
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-epi-bg/50">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Age Standardization
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Weekly — Monday
                </td>
                <td className="p-4 text-[13px] text-epi-muted">~40 min</td>
                <td className="p-4 text-[13px] text-epi-text">
                  Monday 07:00 ✅
                </td>
                <td className="p-4 text-[13px] font-bold text-[#00A550]">
                  🟢 Success
                </td>
                <td className="p-4 text-[13px] text-epi-text">Next Monday</td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Edit</button>
                </td>
              </tr>
              <tr className="bg-epi-red/5 hover:bg-epi-red/10">
                <td className="p-4 text-[14px] font-bold text-epi-text">
                  Met Agency Import
                </td>
                <td className="p-4 text-[13px] text-epi-text">Every 3 hours</td>
                <td className="p-4 text-[13px] text-epi-muted">~5 min</td>
                <td className="p-4 text-[13px] text-epi-text">04:28 AM 🔴</td>
                <td className="p-4 text-[13px] font-bold text-epi-red">
                  🔴 Failed
                </td>
                <td className="p-4 text-[13px] text-epi-text">
                  Retry manually
                </td>
                <td className="p-4 text-[13px] text-epi font-medium text-right">
                  <button className="hover:underline">Retry</button> ·{' '}
                  <button className="hover:underline">Fix</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ProcessingLayout>);

}