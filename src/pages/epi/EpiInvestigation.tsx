import { useSearchParams } from 'react-router-dom';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { InvestigationWorkspace } from '../../components/shared/InvestigationWorkspace';
import { useApp } from '../../store/AppStore';

export function EpiInvestigation() {
  const [params, setParams] = useSearchParams();
  const { state } = useApp();
  const selected = params.get('id') ?? undefined;
  const active = state.investigations.filter((i) => i.status === 'active').length;
  const requested = state.investigations.filter((i) => i.status === 'requested').length;
  return (
    <EpiLayout
      title="Outbreak Investigations"
      subtitle={`${active} active · ${requested} awaiting acceptance · national view`}
      breadcrumb={selected ? `Outbreak Investigations > ${selected}` : 'Outbreak Investigations'}>

      <InvestigationWorkspace
        selectedId={selected}
        onSelect={(id) => setParams({ id })}
        alertLink={(alertId) => `/warning/detail?id=${alertId}`} />

    </EpiLayout>);

}
