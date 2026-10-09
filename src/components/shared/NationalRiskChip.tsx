import { Link } from 'react-router-dom';
import { useApp } from '../../store/AppStore';
import { isOpenStatus } from '../../lib/format';

/** Header chip summarising national alert load (live from the store). */
export function NationalRiskChip() {
  const { state } = useApp();
  const open = state.alerts.filter((a) => isOpenStatus(a.status));
  const red = open.filter((a) => a.severity === 'red').length;
  const orange = open.filter((a) => a.severity === 'orange').length;
  const [label, cls, dotBg] =
  red > 0 ?
  [`HIGH RISK — ${red} red alert${red > 1 ? 's' : ''}`, 'bg-epi-red/10 text-epi-red border-epi-red/30', 'bg-epi-red'] :
  orange > 0 ?
  ['MODERATE RISK — National', 'bg-epi-amber/15 text-epi-amber border-epi-amber/30', 'bg-epi-amber'] :
  ['LOW RISK — National', 'bg-[#00A550]/10 text-[#00A550] border-[#00A550]/30', 'bg-[#00A550]'];
  return (
    <Link
      to="/warning/alerts"
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap ${cls}`}>
      <span className={`w-2 h-2 rounded-full ${dotBg}`} />
      {label}
    </Link>);

}
