import React from 'react';
import { AnalystLayout } from '../../components/analyst/AnalystLayout';
export function AnalystReports() {
  return (
    <AnalystLayout
      title="Analysis Reports"
      subtitle="Generate and manage public health analysis reports"
      breadcrumb="Analysis Reports">
      
      <div className="bg-white rounded-lg shadow-card border border-border p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-epi/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-[24px]">📄</span>
        </div>
        <h2 className="text-[20px] font-bold text-epi-text mb-2">
          Analysis Reports
        </h2>
        <p className="text-[14px] text-epi-muted max-w-md mb-6">
          This section allows you to generate, schedule, and export
          comprehensive health intelligence reports based on your analyses.
        </p>
        <button className="h-10 px-6 bg-epi hover:bg-epi-hover text-white text-[14px] font-bold rounded-md">
          Create New Report
        </button>
      </div>
    </AnalystLayout>);

}