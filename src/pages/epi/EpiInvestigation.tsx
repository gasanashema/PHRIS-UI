import { useSearchParams } from 'react-router-dom';
import { Microscope, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { InvestigationWorkspace } from '../../components/shared/InvestigationWorkspace';
import { useApp } from '../../store/AppStore';

export function EpiInvestigation() {
  const [params, setParams] = useSearchParams();
  const { state } = useApp();
  const selected = params.get('id') ?? undefined;
  const active = state.investigations.filter((i) => i.status === 'active').length;
  const requested = state.investigations.filter((i) => i.status === 'requested').length;
  const closed = state.investigations.filter((i) => i.status === 'closed').length;
  const total = state.investigations.length;

  return (
    <EpiLayout
      title="Outbreak Investigations"
      subtitle={`${active} active · ${requested} awaiting acceptance · national view`}
      breadcrumb={selected ? `Outbreak Investigations > ${selected}` : 'Outbreak Investigations'}
    >
      {/* Top 4 Minimal Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium">Total Investigations</div>
            <div className="text-[24px] font-bold text-epi-text mt-0.5">{total}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-epi/10 flex items-center justify-center text-epi">
            <Microscope className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-admin-red" />
              <span>Active Outbreaks</span>
            </div>
            <div className="text-[24px] font-bold text-epi-text mt-0.5">{active}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-admin-red">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span>Awaiting Review</span>
            </div>
            <div className="text-[24px] font-bold text-epi-text mt-0.5">{requested}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-[#F97316]">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-xs border border-border flex items-center justify-between">
          <div>
            <div className="text-[12px] text-epi-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A550]" />
              <span>Contained / Closed</span>
            </div>
            <div className="text-[24px] font-bold text-epi-text mt-0.5">{closed}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-[#00A550]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      <InvestigationWorkspace
        selectedId={selected}
        onSelect={(id) => setParams({ id })}
        alertLink={(alertId) => `/warning/detail?id=${alertId}`}
      />
    </EpiLayout>
  );
}
