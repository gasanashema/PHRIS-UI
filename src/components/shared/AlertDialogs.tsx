import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Alert, Investigation } from '../../types';
import { useApp } from '../../store/AppStore';
import { SEVERITY_META } from '../../lib/format';
import {
  FieldLabel,
  Modal,
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputCls,
  textareaCls } from
'./Modal';

export type AlertDialogKind =
'ack' |
'note' |
'escalate' |
'resolve' |
'dismiss' |
'investigate';

const ESCALATION_TARGETS = {
  dho: [
  'RBC Epidemiology (Level 3)',
  'Southern Province Director (Level 2)'],

  national: [
  'RBC Epidemiology (Level 3)',
  'Ministry of Health Emergency Operations (Level 4)',
  'WHO Rwanda (Level 5)']

};

const INVESTIGATORS = [
'Dr. Jean Paul Habimana',
'Dr. Patrick Bizimana',
'Dr. Samuel Habyarimana'];


const TEAM_OPTIONS = [
'District Health Officer',
'RBC Laboratory technician',
'Environmental health officer (WASAC)',
'CHW supervisor',
'Data manager'];


/**
 * Hook exposing the full alert response workflow (acknowledge, note, escalate,
 * resolve, dismiss, request investigation) as dialogs backed by the shared
 * store. Every screen that shows alerts uses this so behaviour is identical.
 */
export function useAlertDialogs() {
  const [dialog, setDialog] = useState<{kind: AlertDialogKind;alert: Alert;} | null>(null);
  const open = (kind: AlertDialogKind, alert: Alert) => setDialog({ kind, alert });
  const element = <AlertDialogs dialog={dialog} onClose={() => setDialog(null)} />;
  return { open, element };
}

function AlertDialogs({
  dialog,
  onClose



}: {dialog: {kind: AlertDialogKind;alert: Alert;} | null;onClose: () => void;}) {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const role = state.user?.role;
  const targets = role === 'dho' ? ESCALATION_TARGETS.dho : ESCALATION_TARGETS.national;

  const [text, setText] = useState('');
  const [target, setTarget] = useState(targets[0]);
  const [reason, setReason] = useState('');
  const [lead, setLead] = useState(INVESTIGATORS[0]);
  const [priority, setPriority] = useState<Investigation['priority']>('High');
  const [team, setTeam] = useState<string[]>(['District Health Officer']);

  // Reset form whenever a new dialog opens
  useEffect(() => {
    if (!dialog) return;
    setText('');
    setReason('');
    setTarget(targets[0]);
    setLead(INVESTIGATORS[0]);
    setPriority(dialog.alert.severity === 'red' ? 'Critical' : dialog.alert.severity === 'orange' ? 'High' : 'Medium');
    setTeam(['District Health Officer']);
    if (dialog.kind === 'investigate') {
      setText(
        dialog.alert.disease === 'Cholera' || dialog.alert.disease === 'Diarrheal Disease' ?
        `Suspected contaminated water source in ${dialog.alert.sector ?? dialog.alert.district}` :
        `Investigate cause of rising ${dialog.alert.disease.toLowerCase()} cases in ${dialog.alert.sector ?? dialog.alert.district}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  if (!dialog) return null;
  const { kind, alert } = dialog;
  const where = alert.sector ? `${alert.sector}, ${alert.district}` : alert.district;
  const heading = `${SEVERITY_META[alert.severity].emoji} ${alert.id} — ${alert.disease}, ${where}`;

  if (kind === 'ack') {
    return (
      <Modal
        open
        title="Acknowledge this alert?"
        subtitle={heading}
        onClose={onClose}
        footer={
        <>
            <button className={btnSecondary} onClick={onClose}>Cancel</button>
            <button
            className={btnPrimary}
            onClick={() => {
              actions.acknowledgeAlert(alert.id, text.trim() || undefined);
              onClose();
            }}>

              Yes, Acknowledge
            </button>
          </>
        }>

        <p className="text-[14px] text-admin-muted mb-4">
          Acknowledging confirms you have seen this alert and are responding. It
          stops auto-escalation and is logged permanently in the audit trail.
        </p>
        <FieldLabel>Initial response note (optional)</FieldLabel>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Contacted Tumba HC, ORS stock being checked."
          className={textareaCls} />

      </Modal>);

  }

  if (kind === 'note') {
    return (
      <Modal
        open
        title="Add response note"
        subtitle={heading}
        onClose={onClose}
        footer={
        <>
            <button className={btnSecondary} onClick={onClose}>Cancel</button>
            <button
            className={btnPrimary}
            disabled={!text.trim()}
            onClick={() => {
              actions.addAlertNote(alert.id, text.trim());
              onClose();
            }}>

              Add Note
            </button>
          </>
        }>

        <FieldLabel>Note</FieldLabel>
        <textarea
          rows={4}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What has been done, who was contacted, what is planned next…"
          className={textareaCls} />

      </Modal>);

  }

  if (kind === 'escalate') {
    return (
      <Modal
        open
        title="Escalate alert"
        subtitle={heading}
        onClose={onClose}
        footer={
        <>
            <button className={btnSecondary} onClick={onClose}>Cancel</button>
            <button
            className={btnDanger}
            onClick={() => {
              actions.escalateAlert(alert.id, target, reason.trim() || undefined);
              onClose();
            }}>

              Yes, Escalate
            </button>
          </>
        }>

        <p className="text-[14px] text-admin-muted mb-4">
          The selected authority will be notified immediately. This action is
          logged permanently.
        </p>
        <div className="space-y-4">
          <div>
            <FieldLabel>Escalate to</FieldLabel>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className={inputCls}>
              {targets.map((t) =>
              <option key={t}>{t}</option>
              )}
            </select>
          </div>
          <div>
            <FieldLabel>Reason for escalation</FieldLabel>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Local capacity exceeded — need rapid response team and additional ORS supplies."
              className={textareaCls} />

          </div>
        </div>
      </Modal>);

  }

  if (kind === 'resolve' || kind === 'dismiss') {
    const isResolve = kind === 'resolve';
    const presets = isResolve ?
    ['No new cases for 7 days', 'Cases back below threshold', 'Outbreak contained after intervention'] :
    ['False positive — data entry error', 'Duplicate of an existing alert', 'Already handled under another alert'];
    return (
      <Modal
        open
        title={isResolve ? 'Mark alert as resolved' : 'Dismiss alert'}
        subtitle={heading}
        onClose={onClose}
        footer={
        <>
            <button className={btnSecondary} onClick={onClose}>Cancel</button>
            <button
            className={isResolve ? btnPrimary : btnDanger}
            disabled={!reason.trim()}
            onClick={() => {
              if (isResolve) actions.resolveAlert(alert.id, reason.trim());else
              actions.dismissAlert(alert.id, reason.trim());
              onClose();
            }}>

              {isResolve ? 'Mark Resolved' : 'Dismiss Alert'}
            </button>
          </>
        }>

        <p className="text-[14px] text-admin-muted mb-4">
          {isResolve ?
          'Resolved alerts move to Alert History and the sector risk level is recalculated.' :
          'Dismissed alerts are kept in Alert History for audit but no longer count as active.'}
        </p>
        <FieldLabel>{isResolve ? 'Resolution' : 'Reason'}</FieldLabel>
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((p) =>
          <button
            key={p}
            type="button"
            onClick={() => setReason(p)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${reason === p ? 'bg-admin text-white border-admin' : 'bg-white border-border text-admin-muted hover:text-admin-text'}`}>

              {p}
            </button>
          )}
        </div>
        <textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Or describe the outcome…"
          className={textareaCls} />

      </Modal>);

  }

  // investigate
  const toggleTeam = (m: string) =>
  setTeam((t) => t.includes(m) ? t.filter((x) => x !== m) : [...t, m]);
  return (
    <Modal
      open
      title={role === 'epi' ? 'Open outbreak investigation' : 'Request outbreak investigation'}
      subtitle={heading}
      onClose={onClose}
      footer={
      <>
          <button className={btnSecondary} onClick={onClose}>Cancel</button>
          <button
          className={btnPrimary}
          disabled={!text.trim()}
          onClick={() => {
            const id = actions.requestInvestigation(alert.id, {
              lead,
              priority,
              hypothesis: text.trim(),
              team
            });
            onClose();
            navigate(role === 'dho' ? `/dho/investigations/${id}` : `/epi/investigations?id=${id}`);
          }}>

            {role === 'epi' ? 'Open Investigation' : 'Send Request'}
          </button>
        </>
      }>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Lead investigator (RBC)</FieldLabel>
            <select value={lead} onChange={(e) => setLead(e.target.value)} className={inputCls}>
              {INVESTIGATORS.map((i) =>
              <option key={i}>{i}</option>
              )}
            </select>
          </div>
          <div>
            <FieldLabel>Priority</FieldLabel>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Investigation['priority'])}
              className={inputCls}>

              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>
        </div>
        <div>
          <FieldLabel>Working hypothesis</FieldLabel>
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={textareaCls} />

        </div>
        <div>
          <FieldLabel>Field team</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEAM_OPTIONS.map((m) =>
            <label key={m} className="flex items-center gap-2 text-[13px] text-admin-text cursor-pointer">
                <input
                type="checkbox"
                checked={team.includes(m)}
                onChange={() => toggleTeam(m)}
                className="rounded border-border text-admin focus:ring-admin" />

                {m}
              </label>
            )}
          </div>
        </div>
      </div>
    </Modal>);

}
