import { useNavigate, useParams } from 'react-router-dom';
import { DhoLayout } from '../../components/dho/DhoLayout';
import { InvestigationWorkspace } from '../../components/shared/InvestigationWorkspace';
import { useCurrentUser } from '../../store/AppStore';

export function DhoInvestigations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useCurrentUser('dho');
  const district = user.role === 'dho' ? user.district : 'Huye';
  return (
    <DhoLayout
      title={`Outbreak Investigations — ${district} District`}
      subtitle="Investigations requested from district alerts and handled with the RBC epidemiology team"
      breadcrumb={id ? `Investigations > ${id}` : 'Investigations'}>

      <InvestigationWorkspace
        district={district}
        selectedId={id}
        onSelect={(invId) => navigate(`/dho/investigations/${invId}`)}
        alertLink={(alertId) => `/dho/alerts/${alertId}`} />

    </DhoLayout>);

}
