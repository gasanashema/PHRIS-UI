import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../store/AppStore';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
import { ArrowUpRight, ArrowRight, ArrowDownRight } from 'lucide-react';
export function PredictionPerformance() {
  const { actions } = useApp();
  const [retrain, setRetrain] = useState<'idle' | 'running' | 'done'>('idle');
  const startRetrain = () => {
    setRetrain('running');
    actions.logAdminEvent('Prediction', 'Triggered model retrain (simulated)', 'Corrections from missed predictions applied');
    window.setTimeout(() => {
      setRetrain('done');
      actions.toast('Model retrain finished (simulated). Validation accuracy 85.1% — v3.3 ready for review.');
    }, 3000);
  };
  return (
    <PredictionLayout
      title="AI Model Performance"
      subtitle="Prediction accuracy tracking — Rwanda historical validation"
      breadcrumb="Model Performance">
      
      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Overall Accuracy
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">
            84.7% <span className="text-[16px]">🟢</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Predictions Made (90 days)
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">1,240</div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-card border border-border flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Correct Predictions
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">1,051</div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-card border-2 border-epi-red flex flex-col">
          <h3 className="text-[13px] font-bold text-epi-muted leading-tight mb-2">
            Missed Outbreaks (false negatives)
          </h3>
          <div className="text-2xl font-bold text-epi-text mb-1">
            11 <span className="text-[16px]">🔴</span>
          </div>
          <div className="text-[11px] font-bold text-epi-red mt-auto">
            11 missed outbreaks reviewed for model improvement
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-[16px] font-bold text-epi-text">
              Prediction Accuracy by Disease
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-epi-bg border-b border-border">
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Disease
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Predictions
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    Correct
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    False Positives
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-right">
                    False Negatives
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="p-4 text-[12px] font-bold text-epi-muted uppercase tracking-wider text-center">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Malaria
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    145
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    128
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    12
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    5
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        88.3%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '88.3%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟢</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <ArrowUpRight className="w-4 h-4 text-[#00A550] mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Cholera
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    67
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    54
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    8
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    5
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        80.6%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '80.6%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟢</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <ArrowUpRight className="w-4 h-4 text-[#00A550] mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Malnutrition
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    89
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    71
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    11
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    7
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        79.8%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '79.8%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <ArrowRight className="w-4 h-4 text-epi-muted mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Typhoid
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    45
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    35
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    6
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    4
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        77.8%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '77.8%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <ArrowRight className="w-4 h-4 text-epi-muted mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Measles
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    34
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    26
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    5
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    3
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        76.5%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '76.5%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <ArrowUpRight className="w-4 h-4 text-[#00A550] mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    Mpox
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    12
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    9
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    1
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    2
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        75.0%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '75.0%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-[11px] font-bold text-epi-muted">
                    New
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    VHF
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    8
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    6
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    1
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    1
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        75.0%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-epi-amber"
                          style={{
                            width: '75.0%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟡</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-[11px] font-bold text-epi-muted">
                    New
                  </td>
                </tr>
                <tr className="hover:bg-epi-bg/50">
                  <td className="p-4 text-[14px] font-bold text-epi-text">
                    COVID-19
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    34
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    28
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    3
                  </td>
                  <td className="p-4 text-[13px] text-epi-text text-right">
                    3
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-epi-text w-10">
                        82.4%
                      </span>
                      <div className="w-20 h-2 bg-epi-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00A550]"
                          style={{
                            width: '82.4%'
                          }}>
                        </div>
                      </div>
                      <span className="text-[10px]">🟢</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <ArrowDownRight className="w-4 h-4 text-epi-red mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Chart */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-6">
              Model Accuracy Over Time (Jan–Jun 2026)
            </h2>

            <div className="relative h-48 w-full mb-4">
              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-[10px] text-epi-muted font-medium text-right pr-2">
                <span>85%</span>
                <span>84%</span>
                <span>83%</span>
                <span>82%</span>
                <span>81%</span>
              </div>

              {/* X Axis */}
              <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] text-epi-muted font-medium">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>

              {/* Chart Area */}
              <div className="absolute left-10 right-0 top-0 bottom-6 border-l border-b border-border">
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100">
                  
                  <polyline
                    points="0,100 20,75 40,62.5 60,50 80,25 100,7.5"
                    fill="none"
                    stroke="#104E49"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round" />
                  
                  <circle cx="0" cy="100" r="4" fill="#104E49" />
                  <circle cx="20" cy="75" r="4" fill="#104E49" />
                  <circle cx="40" cy="62.5" r="4" fill="#104E49" />
                  <circle cx="60" cy="50" r="4" fill="#104E49" />
                  <circle cx="80" cy="25" r="4" fill="#104E49" />
                  <circle cx="100" cy="7.5" r="4" fill="#104E49" />
                </svg>

                {/* Annotation */}
                <div className="absolute top-[10%] right-[5%] bg-epi-bg border border-border p-2 rounded shadow-sm text-[11px] font-bold text-epi-text whitespace-nowrap z-20">
                  Model retrained June 2 — accuracy improved
                </div>
              </div>
            </div>
          </div>

          {/* Missed Outbreaks Review */}
          <div className="bg-white rounded-lg shadow-card border border-border p-6 flex-1 flex flex-col">
            <h2 className="text-[16px] font-bold text-epi-text mb-4">
              11 Missed Outbreaks — Root Cause Analysis
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-epi-bg flex items-center justify-center text-[12px] font-bold text-epi-text shrink-0">
                  1
                </div>
                <div>
                  <div className="text-[13px] font-bold text-epi-text mb-1">
                    Data gap
                  </div>
                  <div className="text-[13px] text-epi-muted">
                    6 cases — CHW reporting gap meant early signals were missed
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-epi-bg flex items-center justify-center text-[12px] font-bold text-epi-text shrink-0">
                  2
                </div>
                <div>
                  <div className="text-[13px] font-bold text-epi-text mb-1">
                    Model weight
                  </div>
                  <div className="text-[13px] text-epi-muted">
                    3 cases — water quality factor underweighted for Typhoid
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-epi-bg flex items-center justify-center text-[12px] font-bold text-epi-text shrink-0">
                  3
                </div>
                <div>
                  <div className="text-[13px] font-bold text-epi-text mb-1">
                    Cross-border lag
                  </div>
                  <div className="text-[13px] text-epi-muted">
                    2 cases — DRC signal arrived too late (3-day delay)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <div className="text-[12px] text-epi-muted mb-3 italic">
                "Apply corrections to model" → triggers retraining workflow.
              </div>
              <div className="flex gap-3">
                <button onClick={startRetrain} disabled={retrain !== 'idle'} className="flex-1 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark disabled:opacity-70 transition-colors flex items-center justify-center gap-2">
                  {retrain === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {retrain === 'idle' ? 'Trigger Model Retrain' : retrain === 'running' ? 'Retraining (simulated)…' : '✓ v3.3 trained — pending review'}
                </button>
                <Link to="/prediction/history" className="flex-1 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors text-center">
                  View All Missed Predictions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}