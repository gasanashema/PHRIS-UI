
import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Radio,
  Users } from
'lucide-react';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { Modal, FieldLabel, textareaCls, btnPrimary, btnSecondary } from '../../components/shared/Modal';
import { useApp, useCurrentUser } from '../../store/AppStore';
import { fmtTime, nowISO } from '../../lib/format';

const assignments = [
{
  code: 'FIELD-0261',
  incident: 'Cholera outbreak verification',
  district: 'Rusizi',
  team: 'Dr. Jean Paul Habimana + 5 members',
  status: 'In field',
  update: 'Last update 22 minutes ago',
  tone: 'red'
},
{
  code: 'FIELD-0264',
  incident: 'Malaria transmission assessment',
  district: 'Kayonza',
  team: 'Dr. Aline Uwimana + 4 members',
  status: 'Lab coordination',
  update: 'Specimens en route to RBC',
  tone: 'amber'
},
{
  code: 'FIELD-0268',
  incident: 'Mpox case verification',
  district: 'Rubavu',
  team: 'District rapid response team',
  status: 'Deployment planned',
  update: 'Departure scheduled 10:30 AM',
  tone: 'green'
}];


const checklist = [
{ label: 'Verify case definitions with facility focal person', complete: true },
{ label: 'Collect and label clinical specimens', complete: true },
{ label: 'Map exposure sites and water points', complete: false },
{ label: 'Brief district command team on early findings', complete: false }];


const SEED_LOG: Record<string, {at: string;by: string;text: string;}[]> = {
  'FIELD-0261': [
  { at: '2026-06-05T08:10', by: 'Dr. Jean Paul Habimana', text: 'Team arrived Bugarama HC. 14 suspected cases line-listed.' },
  { at: '2026-06-05T11:45', by: 'Field epidemiologist', text: '6 rectal swabs collected; cold chain confirmed for transport to RBC.' }],
  'FIELD-0264': [{ at: '2026-06-05T09:30', by: 'Dr. Aline Uwimana', text: 'RDT positivity 41% at Rukara HC. Specimens dispatched to RBC.' }],
  'FIELD-0268': [{ at: '2026-06-05T07:50', by: 'Rubavu DHO', text: 'Vehicle and PPE allocated. Departure scheduled 10:30.' }]
};
const MORE_VISITS = [
['Jun 8 · 09:00', 'Kigeme Sector, Nyamagabe', 'Follow-up on diarrheal cluster'],
['Jun 9 · 10:00', 'Rukara Sector, Kayonza', 'Vector control coordination'],
['Jun 10 · 08:00', 'Gisenyi Sector, Rubavu', 'Mpox contact tracing review']];

export function EpiField() {
  const { actions } = useApp();
  const user = useCurrentUser('epi');
  const [selectedAssignment, setSelectedAssignment] = useState('FIELD-0261');
  const [checks, setChecks] = useState<Record<string, boolean[]>>({});
  const [logs, setLogs] = useState(SEED_LOG);
  const [logOpen, setLogOpen] = useState(false);
  const [entry, setEntry] = useState('');
  const [calendar, setCalendar] = useState(false);
  const done = checks[selectedAssignment] ?? checklist.map((c) => c.complete);
  const pending = done.filter((d) => !d).length;
  const toggle = (i: number) => setChecks((p) => ({ ...p, [selectedAssignment]: done.map((d, j) => j === i ? !d : d) }));
  const addEntry = () => {
    if (!entry.trim()) return;
    setLogs((p) => ({ ...p, [selectedAssignment]: [...(p[selectedAssignment] ?? []), { at: nowISO(), by: user.name, text: entry.trim() }] }));
    setEntry('');
    actions.toast(`Log entry added to ${selectedAssignment}.`);
  };

  return (
    <EpiLayout
      title="Field Investigations"
      subtitle="Coordinate rapid response teams, verify signals, and track operational follow-up"
      breadcrumb="Field Investigations">
      
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard icon={Users} value="3" label="Active field teams" detail="Across 3 districts" tone="green" />
        <StatusCard icon={Radio} value="2" label="Live field updates" detail="Received within the last hour" tone="red" />
        <StatusCard icon={ClipboardCheck} value="14" label="Open action items" detail="7 due today" tone="amber" />
        <StatusCard icon={CalendarDays} value="5" label="Visits scheduled" detail="For the next 48 hours" tone="blue" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <div className="overflow-hidden rounded-lg border border-border bg-white shadow-card">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-epi-text">Current deployments</h2>
              <p className="mt-1 text-[13px] text-epi-muted">Rapid response investigations requiring coordination</p>
            </div>
            <span className="text-[12px] font-bold text-epi">Live operations view</span>
          </div>
          <div className="divide-y divide-border">
            {assignments.map((assignment) => {
              const isSelected = selectedAssignment === assignment.code;
              const statusClass = assignment.tone === 'red' ?
              'bg-epi-red/10 text-epi-red' :
              assignment.tone === 'amber' ?
              'bg-epi-amber/10 text-epi-amber' :
              'bg-epi-accent/10 text-epi-accent';

              return (
                <button
                  key={assignment.code}
                  type="button"
                  onClick={() => setSelectedAssignment(assignment.code)}
                  className={`w-full px-5 py-4 text-left transition-colors ${isSelected ? 'bg-epi-bg/70' : 'hover:bg-epi-bg/30'}`}>
                  
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-epi-muted">{assignment.code}</span>
                        <span className={`rounded px-2 py-1 text-[11px] font-bold ${statusClass}`}>{assignment.status}</span>
                      </div>
                      <h3 className="mt-2 text-[14px] font-bold text-epi-text">{assignment.incident}</h3>
                      <p className="mt-1 flex items-center gap-1 text-[12px] text-epi-muted">
                        <MapPin className="h-3.5 w-3.5" /> {assignment.district} District
                      </p>
                    </div>
                    <div className="text-[12px] text-epi-muted sm:text-right">
                      <p className="font-medium text-epi-text">{assignment.team}</p>
                      <p className="mt-1">{assignment.update}</p>
                    </div>
                  </div>
                </button>);

            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-bold text-epi-text">Field checklist</h2>
              <p className="mt-1 text-[13px] text-epi-muted">Selected deployment: {selectedAssignment}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${pending ? 'bg-epi-amber/10 text-epi-amber' : 'bg-epi-accent/10 text-epi-accent'}`}>{pending ? `${pending} pending` : 'All done'}</span>
          </div>
          <div className="mt-5 space-y-4">
            {checklist.map((item, i) =>
            <button key={item.label} type="button" onClick={() => toggle(i)} className="flex gap-3 text-left w-full">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${done[i] ? 'text-epi-accent' : 'text-border'}`} />
                <div>
                  <p className={`text-[13px] font-medium ${done[i] ? 'text-epi-muted line-through' : 'text-epi-text'}`}>{item.label}</p>
                  <p className="mt-1 text-[12px] text-epi-muted">{done[i] ? 'Completed and synced' : 'Awaiting field team confirmation'}</p>
                </div>
              </button>
            )}
          </div>
          <button onClick={() => setLogOpen(true)} className="mt-6 flex h-10 w-full items-center justify-center rounded-md bg-epi text-[13px] font-bold text-white transition-colors hover:bg-epi-hover">
            Open team coordination log ({(logs[selectedAssignment] ?? []).length})
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-white p-5 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-epi-text">Upcoming field visits</h2>
            <p className="mt-1 text-[13px] text-epi-muted">Confirmed deployment schedule for the next two days</p>
          </div>
          <button onClick={() => setCalendar(!calendar)} className="w-fit rounded-md border border-epi px-3 py-2 text-[12px] font-bold text-epi transition-colors hover:bg-epi/5">{calendar ? 'Show next 48 hours' : 'View field calendar'}</button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
          ['Today · 14:00', 'Bugarama Sector, Rusizi', 'Water source assessment'],
          ['Tomorrow · 08:30', 'Mukamira Sector, Nyabihu', 'Measles verification visit'],
          ['Tomorrow · 13:00', 'Rubavu border post', 'Cross-border case coordination'],
          ...(calendar ? MORE_VISITS : [])].
          map(([time, place, activity]) =>
          <article key={place} className="rounded-md border border-border bg-epi-bg/30 p-4">
              <p className="text-[12px] font-bold text-epi">{time}</p>
              <h3 className="mt-2 text-[14px] font-bold text-epi-text">{place}</h3>
              <p className="mt-1 text-[12px] text-epi-muted">{activity}</p>
            </article>
          )}
        </div>
      </section>

      <Modal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        title={`Coordination log — ${selectedAssignment}`}
        subtitle="Entries are kept for this session only (simulated)"
        footer={
        <>
            <button className={btnSecondary} onClick={() => setLogOpen(false)}>Close</button>
            <button className={btnPrimary} disabled={!entry.trim()} onClick={addEntry}>Add entry</button>
          </>
        }>

        <div className="space-y-3 mb-4">
          {(logs[selectedAssignment] ?? []).map((l, i) =>
          <div key={i} className="border-l-2 border-epi pl-3">
              <div className="text-[11px] text-epi-muted">{fmtTime(l.at)} · {l.by}</div>
              <div className="text-[13px] text-epi-text">{l.text}</div>
            </div>
          )}
        </div>
        <FieldLabel>New entry</FieldLabel>
        <textarea value={entry} onChange={(e) => setEntry(e.target.value)} className={textareaCls} rows={3} placeholder="Field update, decision or request…" />
      </Modal>
    </EpiLayout>);

}

interface StatusCardProps {
  icon: typeof Users;
  value: string;
  label: string;
  detail: string;
  tone: 'green' | 'red' | 'amber' | 'blue';
}

function StatusCard({ icon: Icon, value, label, detail, tone }: StatusCardProps) {
  const color = tone === 'red' ?
  'bg-epi-red/10 text-epi-red' :
  tone === 'amber' ?
  'bg-epi-amber/10 text-epi-amber' :
  tone === 'green' ?
  'bg-epi-accent/10 text-epi-accent' :
  'bg-epi/10 text-epi';

  return (
    <article className="rounded-lg border border-border bg-white p-5 shadow-card">
      <div className={`flex h-9 w-9 items-center justify-center rounded-md ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[26px] font-bold leading-none text-epi-text">{value}</p>
      <p className="mt-2 text-[13px] font-medium text-epi-text">{label}</p>
      <p className="mt-1 text-[12px] text-epi-muted">{detail}</p>
    </article>);

}