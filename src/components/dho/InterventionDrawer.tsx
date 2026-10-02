import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Intervention, InterventionStatus } from '../../types';
import { useApp } from '../../store/AppStore';
import { HUYE_SECTORS } from '../../data/seed';
import { fmtDate, nowISO } from '../../lib/format';

const SECTORS = [...HUYE_SECTORS.map((s) => s.name), 'Rwaniro', 'All sectors'];

interface Props {
  open: boolean;
  onClose: () => void;
  /** Prefill values when logging from an alert or map sector. */
  prefill?: Partial<Pick<Intervention, 'alertId' | 'sector' | 'disease'>>;
  /** When provided the drawer edits this intervention instead of creating one. */
  editing?: Intervention | null;
  district?: string;
  onSaved?: (id: string) => void;
}

const dateOnly = (iso?: string) => iso ? iso.slice(0, 10) : '';

/** Slide-out form to log a new intervention or update an existing one. */
export function InterventionDrawer({
  open,
  onClose,
  prefill,
  editing,
  district = 'Huye',
  onSaved
}: Props) {
  const { state, actions } = useApp();
  const districtAlerts = state.alerts.filter((a) => a.district === district);

  const [date, setDate] = useState('');
  const [due, setDue] = useState('');
  const [action, setAction] = useState('');
  const [disease, setDisease] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [who, setWho] = useState('');
  const [alertId, setAlertId] = useState('');
  const [status, setStatus] = useState<InterventionStatus>('Planned');
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTouched(false);
    if (editing) {
      setDate(dateOnly(editing.date));
      setDue(dateOnly(editing.due));
      setAction(editing.action);
      setDisease(editing.disease);
      setSector(editing.sector);
      setWho(editing.who);
      setAlertId(editing.alertId ?? '');
      setStatus(editing.status);
      setOutcome(editing.outcome);
      setNotes('');
    } else {
      const linked = prefill?.alertId ? state.alerts.find((a) => a.id === prefill.alertId) : undefined;
      setDate(nowISO().slice(0, 10));
      setDue('');
      setAction('');
      setDisease(prefill?.disease ?? linked?.disease ?? '');
      setSector(prefill?.sector ?? linked?.sector ?? SECTORS[0]);
      setWho(state.user?.name ?? '');
      setAlertId(prefill?.alertId ?? '');
      setStatus('Ongoing');
      setOutcome('');
      setNotes('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing, prefill?.alertId, prefill?.sector, prefill?.disease]);

  if (!open) return null;

  const valid = action.trim() && disease.trim() && who.trim() && date;

  const save = () => {
    setTouched(true);
    if (!valid) return;
    if (editing) {
      actions.updateIntervention(
        editing.id,
        {
          action: action.trim(),
          disease: disease.trim(),
          sector,
          who: who.trim(),
          status,
          outcome: outcome.trim() || editing.outcome,
          due: due ? `${due}T17:00:00` : editing.due,
          alertId: alertId || undefined
        },
        notes.trim() || undefined
      );
      onSaved?.(editing.id);
    } else {
      const id = actions.addIntervention({
        date: `${date}T${nowISO().slice(11)}`,
        due: due ? `${due}T17:00:00` : undefined,
        action: action.trim(),
        disease: disease.trim(),
        sector,
        district,
        who: who.trim(),
        status,
        outcome: outcome.trim() || (status === 'Completed' ? 'Completed' : 'Pending evaluation'),
        alertId: alertId || undefined,
        notes: notes.trim() || undefined
      });
      onSaved?.(id);
    }
    onClose();
  };

  const fieldCls = (bad: boolean) =>
  `w-full h-10 px-3 border rounded-md text-[13px] focus:outline-none focus:border-admin ${bad ? 'border-admin-red' : 'border-border'}`;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
        <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-admin-text">
              {editing ? `Update Intervention ${editing.id}` : 'Log New Intervention'}
            </h2>
            {editing &&
            <div className="text-[12px] text-admin-muted">
                Logged {fmtDate(editing.date)}
              </div>
            }
          </div>
          <button onClick={onClose} aria-label="Close" className="text-admin-muted hover:text-admin-text">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!editing &&
          <Field label="Date">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldCls(touched && !date)} />
            </Field>
          }
          <Field label="Action Description">
            <textarea
              rows={3}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Describe the response action..."
              className={`w-full px-3 py-2 border rounded-md text-[13px] focus:outline-none focus:border-admin resize-none ${touched && !action.trim() ? 'border-admin-red' : 'border-border'}`} />

            {touched && !action.trim() &&
            <p className="text-[12px] text-admin-red mt-1">Describe the action taken.</p>
            }
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Disease / Concern">
              <input
                type="text"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="e.g. Cholera"
                className={fieldCls(touched && !disease.trim())} />

            </Field>
            <Field label="Sector">
              <select value={sector} onChange={(e) => setSector(e.target.value)} className={fieldCls(false)}>
                {SECTORS.map((s) =>
                <option key={s}>{s}</option>
                )}
              </select>
            </Field>
          </div>
          <Field label="Responsible Person / Team">
            <input
              type="text"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="e.g. Emmanuel Nkurunziza"
              className={fieldCls(touched && !who.trim())} />

          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InterventionStatus)}
                className={fieldCls(false)}>

                <option>Planned</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Overdue</option>
              </select>
            </Field>
            <Field label="Expected Completion">
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={fieldCls(false)} />
            </Field>
          </div>
          <Field label="Outcome / Progress">
            <input
              type="text"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="e.g. 3 of 4 water sources inspected"
              className={fieldCls(false)} />

          </Field>
          <Field label="Link to Alert (optional)">
            <select value={alertId} onChange={(e) => setAlertId(e.target.value)} className={fieldCls(false)}>
              <option value="">— None —</option>
              {districtAlerts.map((a) =>
              <option key={a.id} value={a.id}>
                  {a.id} — {a.disease}, {a.sector ?? a.district} ({a.status})
                </option>
              )}
            </select>
          </Field>
          <Field label={editing ? 'Progress note (added to history)' : 'Notes'}>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-border rounded-md text-[13px] focus:outline-none focus:border-admin resize-none" />

          </Field>
          {editing?.notes &&
          <div className="bg-admin-bg rounded-md p-3 text-[12px] text-admin-muted whitespace-pre-line">
              <div className="font-bold text-admin-text mb-1">Previous notes</div>
              {editing.notes}
            </div>
          }
        </div>
        <div className="p-6 border-t border-border bg-admin-bg flex gap-3 shrink-0">
          <button
            onClick={save}
            className="flex-1 h-10 bg-admin hover:bg-admin-hover text-white text-[14px] font-semibold rounded-md">

            {editing ? 'Save Changes' : 'Save Intervention'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 bg-white border border-border hover:bg-admin-bg text-admin-muted text-[14px] font-semibold rounded-md">

            Cancel
          </button>
        </div>
      </div>
    </>);

}

function Field({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#374151] mb-1.5">{label}</label>
      {children}
    </div>);

}
