import React from 'react';
import { PredictionLayout } from '../../components/prediction/PredictionLayout';
export function PredictionScenarios() {
  return (
    <PredictionLayout
      title="What-If Scenario Simulator"
      subtitle="Test interventions before deploying resources — evidence-based decision making"
      breadcrumb="What-If Scenarios">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Builder */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6">
            <h2 className="text-[16px] font-bold text-epi-text mb-6">
              Build Your Scenario
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                  District
                </label>
                <select className="w-full text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-epi-bg">
                  <option>Rusizi ▼</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-epi-muted uppercase tracking-wider mb-1">
                  Disease
                </label>
                <select className="w-full text-[13px] font-medium text-epi-text border border-border rounded-md px-3 py-2 focus:outline-none bg-epi-bg">
                  <option>Cholera ▼</option>
                </select>
              </div>
              <div className="p-3 bg-epi-red/10 border border-epi-red/20 rounded-md flex justify-between items-center">
                <span className="text-[13px] font-bold text-epi-text">
                  Baseline risk:
                </span>
                <span className="text-[16px] font-bold text-epi-red">
                  91% 🔒
                </span>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              {/* Param 1 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[13px] font-bold text-epi-text">
                    Water treatment deployed
                  </label>
                  <span className="text-[12px] font-bold text-[#00A550]">
                    -37% risk
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-epi-muted font-bold">
                    OFF
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    defaultValue="1"
                    className="flex-1 h-2 bg-epi-bg rounded-lg appearance-none cursor-pointer accent-epi" />
                  
                  <span className="text-[12px] text-epi font-bold">ON</span>
                </div>
                <div className="text-[11px] text-epi-muted mt-1 italic">
                  sanitation score adjusts to 7/10
                </div>
              </div>

              {/* Param 2 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[13px] font-bold text-epi-text">
                    ORS distribution
                  </label>
                  <span className="text-[12px] font-bold text-[#00A550]">
                    -12% risk
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-epi-muted font-bold">
                    0
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="60"
                    className="flex-1 h-2 bg-epi-bg rounded-lg appearance-none cursor-pointer accent-epi" />
                  
                  <span className="text-[12px] text-epi font-bold">100%</span>
                </div>
                <div className="text-[11px] text-epi-muted mt-1">
                  60% coverage
                </div>
              </div>

              {/* Param 3 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[13px] font-bold text-epi-text">
                    Population relocation
                  </label>
                  <span className="text-[12px] font-bold text-[#00A550]">
                    -8% risk
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-epi-muted font-bold">
                    0
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    defaultValue="500"
                    className="flex-1 h-2 bg-epi-bg rounded-lg appearance-none cursor-pointer accent-epi" />
                  
                  <span className="text-[12px] text-epi font-bold">500</span>
                </div>
                <div className="text-[11px] text-epi-muted mt-1 italic">
                  from flooded zone
                </div>
              </div>

              {/* Param 4 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[13px] font-bold text-epi-text">
                    Rainfall change
                  </label>
                  <span className="text-[12px] font-bold text-epi-muted">
                    0% risk
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-epi-muted font-bold">
                    -50%
                  </span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    defaultValue="0"
                    className="flex-1 h-2 bg-epi-bg rounded-lg appearance-none cursor-pointer accent-epi" />
                  
                  <span className="text-[12px] text-epi-muted font-bold">
                    +50%
                  </span>
                </div>
                <div className="text-[11px] text-epi-muted mt-1 italic">
                  external factor — not controllable
                </div>
              </div>

              {/* Param 5 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[13px] font-bold text-epi-text">
                    CHW household visits
                  </label>
                  <span className="text-[12px] font-bold text-[#00A550]">
                    -6% risk
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-epi-muted font-bold">
                    OFF
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    defaultValue="1"
                    className="flex-1 h-2 bg-epi-bg rounded-lg appearance-none cursor-pointer accent-epi" />
                  
                  <span className="text-[12px] text-epi font-bold">ON</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button className="w-full py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                Add 'Do Nothing' for comparison
              </button>
              <button className="w-full py-3 bg-epi text-white text-[14px] font-bold rounded-md hover:bg-epi-dark transition-colors shadow-sm">
                Run Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-card border border-border p-6 flex-1 flex flex-col">
            <h2 className="text-[18px] font-bold text-epi-text mb-6">
              Simulation Results — Rusizi District Cholera
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Card 1 */}
              <div className="bg-epi-bg/50 rounded-lg p-5 border-2 border-[#00A550] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#00A550] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  ⭐ Recommended
                </div>
                <h3 className="text-[14px] font-bold text-epi-text mb-4">
                  🟢 Deploy ORS + Water Treatment
                </h3>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] text-epi-muted">
                    Baseline: 91% →{' '}
                    <span className="font-bold text-epi-text">Result: 34%</span>
                  </div>
                  <div className="text-[13px] font-bold text-[#00A550]">
                    -57%
                  </div>
                </div>
                <div className="relative h-4 bg-epi-bg rounded-full overflow-hidden mb-4 border border-border">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-epi-red/20"
                    style={{
                      width: '91%'
                    }}>
                  </div>
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-epi"
                    style={{
                      width: '34%'
                    }}>
                  </div>
                </div>
                <div className="space-y-1 text-[12px] text-epi-text">
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Cost estimate:</span>{' '}
                    <span className="font-bold">
                      RWF 3,200,000 (~$2,900 USD)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Time to effect:</span>{' '}
                    <span className="font-bold">5–7 days</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-lg p-5 border border-border">
                <h3 className="text-[14px] font-bold text-epi-text mb-4">
                  🟡 Relocate 500 People
                </h3>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] text-epi-muted">
                    Baseline: 91% →{' '}
                    <span className="font-bold text-epi-text">Result: 61%</span>
                  </div>
                  <div className="text-[13px] font-bold text-[#00A550]">
                    -30%
                  </div>
                </div>
                <div className="relative h-4 bg-epi-bg rounded-full overflow-hidden mb-4 border border-border">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-epi-red/20"
                    style={{
                      width: '91%'
                    }}>
                  </div>
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-epi-amber"
                    style={{
                      width: '61%'
                    }}>
                  </div>
                </div>
                <div className="space-y-1 text-[12px] text-epi-text">
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Cost estimate:</span>{' '}
                    <span className="font-bold">RWF 1,800,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Time to effect:</span>{' '}
                    <span className="font-bold">2–3 days</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-lg p-5 border border-border">
                <h3 className="text-[14px] font-bold text-epi-text mb-4">
                  🟡 CHW Visits Only
                </h3>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] text-epi-muted">
                    Baseline: 91% →{' '}
                    <span className="font-bold text-epi-text">Result: 78%</span>
                  </div>
                  <div className="text-[13px] font-bold text-[#00A550]">
                    -13%
                  </div>
                </div>
                <div className="relative h-4 bg-epi-bg rounded-full overflow-hidden mb-4 border border-border">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-epi-red/20"
                    style={{
                      width: '91%'
                    }}>
                  </div>
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#F97316]"
                    style={{
                      width: '78%'
                    }}>
                  </div>
                </div>
                <div className="space-y-1 text-[12px] text-epi-text">
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Cost estimate:</span>{' '}
                    <span className="font-bold">RWF 400,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Time to effect:</span>{' '}
                    <span className="font-bold">3–5 days</span>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-epi-red/5 rounded-lg p-5 border border-epi-red/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-epi-red text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  ⚠️ Not recommended
                </div>
                <h3 className="text-[14px] font-bold text-epi-text mb-4">
                  🔴 Do Nothing
                </h3>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[13px] text-epi-muted">
                    Baseline: 91% →{' '}
                    <span className="font-bold text-epi-text">Result: 97%</span>
                  </div>
                  <div className="text-[13px] font-bold text-epi-red">+6%</div>
                </div>
                <div className="relative h-4 bg-epi-bg rounded-full overflow-hidden mb-4 border border-border">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-epi-red"
                    style={{
                      width: '97%'
                    }}>
                  </div>
                </div>
                <div className="space-y-1 text-[12px] text-epi-text">
                  <div className="flex justify-between">
                    <span className="text-epi-muted">Cost estimate:</span>{' '}
                    <span className="font-bold text-epi-red">
                      RWF 0 now — estimated RWF 45M epidemic cost
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-epi/5 border border-epi/20 rounded-lg p-5">
              <h3 className="text-[14px] font-bold text-epi-text mb-2">
                AI Vital Recommendation:
              </h3>
              <p className="text-[13px] text-epi-text leading-relaxed mb-4">
                Deploy{' '}
                <span className="font-bold">
                  ORS + Water Treatment (Scenario 1)
                </span>{' '}
                for the highest risk reduction at RWF 3.2M — preventing an
                estimated epidemic that would cost 14× more if left unaddressed.
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-epi text-white text-[13px] font-bold rounded-md hover:bg-epi-dark transition-colors">
                  Add to Intervention Plan
                </button>
                <button className="px-6 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded-md hover:bg-epi-bg transition-colors">
                  Send to District Officer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PredictionLayout>);

}