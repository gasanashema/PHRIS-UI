// Global in-browser store for the AI Vital prototype.
//
// Everything here is SIMULATED frontend state: there is no backend, no real
// authentication, no real ML model and no real connection to external health
// systems. State is kept in React context and mirrored to sessionStorage so a
// page refresh during a demo does not lose progress. "Reset demo data" in the
// user menu restores the seed.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState } from
'react';
import type {
  Activity,
  AdminUser,
  Alert,
  AlertRules,
  Announcement,
  AppNotification,
  Backup,
  DataSource,
  DistrictRisk,
  GeneratedReport,
  AnalystFinding,
  Intervention,
  Investigation,
  PermissionGroup,
  PipelineState,
  PredictionRun,
  PredictionSignal,
  ProcessingJob,
  Role,
  Severity,
  SyncLogEntry,
  Threshold,
  Toast,
  User } from
'../types';
import {
  DISTRICT_PROVINCE,
  HUYE_SECTORS,
  PERSONAS,
  PIPELINE_STAGES,
  SEED_ACTIVITY,
  SEED_ALERTS,
  SEED_ANNOUNCEMENTS,
  SEED_BACKUPS,
  SEED_DISTRICT_RISK,
  SEED_INTERVENTIONS,
  SEED_INVESTIGATIONS,
  SEED_JOBS,
  SEED_NOTIFICATIONS,
  SEED_PERMISSIONS,
  SEED_PIPELINE,
  SEED_PREDICTION_RUNS,
  SEED_REPORTS,
  SEED_RULES,
  SEED_SOURCES,
  SEED_SYNC_LOG,
  SEED_THRESHOLDS,
  SEED_USERS } from
'../data/seed';
import {
  SEVERITY_RANK,
  fmtTime,
  isOpenStatus,
  maxSeverity,
  nowISO,
  resetDemoClock,
  uid } from
'../lib/format';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
export interface AppState {
  version: number;
  user: User | null;
  alerts: Alert[];
  notifications: AppNotification[];
  activity: Activity[];
  investigations: Investigation[];
  interventions: Intervention[];
  sources: DataSource[];
  syncLog: SyncLogEntry[];
  pendingRecords: number; // records synced since last processing run
  pipeline: PipelineState;
  jobs: ProcessingJob[];
  districtRisk: DistrictRisk[];
  predictionRuns: PredictionRun[];
  thresholds: Threshold[];
  rules: AlertRules;
  users: AdminUser[];
  permissions: PermissionGroup[];
  announcements: Announcement[];
  backups: Backup[];
  reports: GeneratedReport[];
  remindersSent: string[]; // facility names reminded today
  demoSignalsUsed: number; // how many scripted demo signals have fired
  analystFindings: AnalystFinding[]; // items queued for the next analysis report
}

const STATE_VERSION = 4;
const STORAGE_KEY = 'aivital-state';

function seedState(): AppState {
  return {
    version: STATE_VERSION,
    user: null,
    alerts: SEED_ALERTS,
    notifications: SEED_NOTIFICATIONS,
    activity: SEED_ACTIVITY,
    investigations: SEED_INVESTIGATIONS,
    interventions: SEED_INTERVENTIONS,
    sources: SEED_SOURCES,
    syncLog: SEED_SYNC_LOG,
    pendingRecords: 0,
    pipeline: SEED_PIPELINE,
    jobs: SEED_JOBS,
    districtRisk: SEED_DISTRICT_RISK,
    predictionRuns: SEED_PREDICTION_RUNS,
    thresholds: SEED_THRESHOLDS,
    rules: SEED_RULES,
    users: SEED_USERS,
    permissions: SEED_PERMISSIONS,
    announcements: SEED_ANNOUNCEMENTS,
    backups: SEED_BACKUPS,
    reports: SEED_REPORTS,
    remindersSent: [],
    demoSignalsUsed: 0,
    analystFindings: []
  };
}

function loadState(): AppState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed.version === STATE_VERSION) {
        // Any simulated async work in flight when the page was reloaded is
        // settled so the UI never gets stuck in a loading state.
        return {
          ...parsed,
          sources: parsed.sources.map((s) => ({ ...s, syncing: false })),
          pipeline:
          parsed.pipeline.status === 'running' ?
          { ...parsed.pipeline, status: 'complete', stageIndex: PIPELINE_STAGES.length - 1, progress: 100 } :
          parsed.pipeline,
          predictionRuns: parsed.predictionRuns.filter((r) => r.status === 'complete'),
          backups: parsed.backups.map((b) =>
          b.status === 'Running' ? { ...b, status: 'Success' } : b
          )
        };
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return seedState();
}

// ---------------------------------------------------------------------------
// Pure helpers used by actions and pages
// ---------------------------------------------------------------------------
const ROLE_AUDIT_LABEL: Record<Role, string> = {
  admin: 'Administrator',
  dho: 'District Officer',
  epi: 'Epidemiologist',
  analyst: 'Analyst',
  integration: 'Data Integration'
};

function actorOf(s: AppState) {
  return s.user ?
  {
    actor: s.user.name,
    actorEmail: s.user.email,
    role: ROLE_AUDIT_LABEL[s.user.role],
    ip: s.user.role === 'dho' ? '102.90.x.x' : '197.243.x.x'
  } :
  { actor: 'AI Vital', actorEmail: 'system@aivital.rw', role: 'System', ip: '—' };
}

function withActivity(
s: AppState,
module: string,
action: string,
detail = '',
extra: Partial<Activity> = {})
: Activity[] {
  const entry: Activity = {
    id: uid('act'),
    at: nowISO(),
    module,
    action,
    detail,
    ...actorOf(s),
    ...extra
  };
  return [entry, ...s.activity];
}

function notify(
list: AppNotification[],
n: Omit<AppNotification, 'id' | 'at' | 'read'>)
: AppNotification[] {
  return [{ ...n, id: uid('n'), at: nowISO(), read: false }, ...list];
}

export function nextAlertId(alerts: Alert[]): string {
  const max = alerts.reduce((m, a) => {
    const n = Number(a.id.split('-')[2]);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ALT-2026-${String(max + 1).padStart(3, '0')}`;
}

function nextSeq(ids: string[], prefix: string, pad = 3): string {
  const max = ids.reduce((m, id) => {
    const n = Number(id.replace(/\D/g, '').slice(-pad));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${prefix}${String(max + 1).padStart(pad, '0')}`;
}

/** Notifications visible to a given user (role + district scoping). */
export function notificationsFor(state: AppState, user: User | null) {
  if (!user) return [];
  return state.notifications.
  filter(
    (n) =>
    n.roles.includes(user.role) && (
    user.role !== 'dho' || !n.district || n.district === user.district)
  ).
  sort((x, y) => y.at.localeCompare(x.at));
}

/** Alert link appropriate for the viewer's role. */
export function alertLink(alert: Alert, role: Role | undefined) {
  if (role === 'dho') return `/dho/alerts/${alert.id}`;
  return `/warning/detail?id=${alert.id}`;
}

/** Effective risk for a sector: its baseline raised by any open alerts. */
export function sectorRisk(state: AppState, sector: string): Severity {
  const base = HUYE_SECTORS.find((s) => s.name === sector)?.baseRisk ?? 'green';
  const alertSev = state.alerts.
  filter((a) => a.sector === sector && isOpenStatus(a.status)).
  map((a) => a.severity);
  return maxSeverity([base, ...alertSev]);
}

/** District level = highest severity among open alerts in the district. */
export function districtLevel(state: AppState, district: string): Severity {
  return maxSeverity(
    state.alerts.
    filter((a) => a.district === district && isOpenStatus(a.status)).
    map((a) => a.severity)
  );
}

export function severityForSignal(
sig: PredictionSignal,
thresholds: Threshold[],
rules: AlertRules)
: Severity {
  let byProb: Severity = 'green';
  if (rules.aiEnabled) {
    if (sig.probability >= rules.aiPct + 20) byProb = 'red';else
    if (sig.probability >= rules.aiPct) byProb = 'orange';else
    if (sig.probability >= 40) byProb = 'yellow';
  } else if (sig.probability >= 40) {
    byProb = 'yellow';
  }
  const t = thresholds.find((x) => x.disease === sig.disease);
  let byCases: Severity = 'green';
  if (t) {
    if (sig.cases >= t.red) byCases = 'red';else
    if (sig.cases >= t.orange) byCases = 'orange';else
    if (sig.cases >= t.yellow && t.yellow > 0) byCases = 'yellow';
  }
  return maxSeverity([byProb, byCases]);
}

// Scripted prediction signals. The simulated "model" returns these each run;
// probabilities shift deterministically with the run parameters.
const CANDIDATE_SIGNALS: PredictionSignal[] = [
{
  district: 'Huye',
  sector: 'Maraba',
  province: 'Southern',
  disease: 'Diarrheal Disease',
  probability: 71,
  confidence: 84,
  cases: 24,
  threshold: 150,
  change: '+60%',
  reasons: [
  'Diarrheal cases up 60% in 7 days (CHW reports, Maraba market area)',
  'WASAC water-quality test failed at 2 of 5 water points',
  'Neighbouring Tumba sector has an active cholera alert']

},
{
  district: 'Ngororero',
  province: 'Western',
  disease: 'Cholera',
  probability: 52,
  confidence: 80,
  cases: 7,
  threshold: 5,
  change: '+75%',
  reasons: [
  'Cases (7) above yellow threshold (5)',
  'Heavy rainfall forecast for the next 10 days',
  'Upstream of Rusizi cholera outbreak along the same river basin']

},
{
  district: 'Nyaruguru',
  province: 'Southern',
  disease: 'Typhoid',
  probability: 47,
  confidence: 79,
  cases: 12,
  threshold: 10,
  change: '+20%',
  reasons: ['Cases (12) above yellow threshold (10)']
},
{
  district: 'Rusizi',
  sector: 'Bugarama',
  province: 'Western',
  disease: 'Cholera',
  probability: 93,
  confidence: 88,
  cases: 87,
  threshold: 50,
  change: '+45%',
  reasons: ['Cases (87) > Red threshold (50)', 'Doubling time 4.2 days']
}];


// Extra scripted signals used by "Simulate incoming alert" on the DHO screens.
const DEMO_DHO_SIGNALS: PredictionSignal[] = [
CANDIDATE_SIGNALS[0],
{
  district: 'Huye',
  sector: 'Kinazi',
  province: 'Southern',
  disease: 'Typhoid',
  probability: 46,
  confidence: 81,
  cases: 11,
  threshold: 10,
  change: '+38%',
  reasons: ['Cases (11) above yellow threshold (10)', 'Kinazi Health Post reports late 2 weeks in a row']
},
{
  district: 'Huye',
  sector: 'Sovu',
  province: 'Southern',
  disease: 'Measles',
  probability: 62,
  confidence: 83,
  cases: 3,
  threshold: 3,
  change: '+200%',
  reasons: ['3 suspected measles cases in one village', 'Vaccination coverage 74% vs 95% target']
}];


const ACTIONS_BY_DISEASE: Record<string, string[]> = {
  'Diarrheal Disease': [
  'Test water points around Maraba market',
  'Brief CHWs on ORS and hygiene messaging',
  'Daily case line-list from Maraba HC'],

  Cholera: ['Deploy ORS and chlorine tablets', 'Inspect water sources', 'Active case search'],
  Typhoid: ['Test drinking water at affected villages', 'Verify facility line-lists'],
  Measles: ['Isolate suspected cases', 'Ring vaccination around suspected cases'],
  Malaria: ['Bed net distribution', 'Indoor residual spraying']
};

function alertFromSignal(
id: string,
sig: PredictionSignal,
severity: Severity,
source: Alert['source'])
: Alert {
  const at = nowISO();
  const acts = ACTIONS_BY_DISEASE[sig.disease] ?? ['Verify signal with facility reports'];
  return {
    id,
    disease: sig.disease,
    district: sig.district,
    sector: sig.sector,
    province: sig.province || DISTRICT_PROVINCE[sig.district] || 'Unknown',
    severity,
    status: 'active',
    triggeredAt: at,
    probability: sig.probability,
    cases: sig.cases,
    threshold: sig.threshold,
    change: sig.change,
    source,
    reasons: [...sig.reasons, `AI outbreak probability: ${sig.probability}% (confidence ${sig.confidence}%)`],
    actions: acts.map((label, i) => ({
      id: `a${i + 1}`,
      label,
      phase: i < 2 ? 'immediate' : 'short',
      done: false
    })),
    timeline: [
    {
      at,
      author: 'AI Vital',
      text: `Alert generated by the prediction engine (probability ${sig.probability}%).`,
      kind: 'system'
    },
    {
      at,
      author: 'AI Vital',
      text: `SMS and email sent to ${sig.district} District Health Officer.`,
      kind: 'system'
    }]

  };
}

function alertNotifications(
list: AppNotification[],
alert: Alert)
: AppNotification[] {
  const where = alert.sector ? `${alert.sector}, ${alert.district}` : alert.district;
  const title = `${alert.severity.toUpperCase()} alert — ${alert.disease} in ${alert.sector ?? alert.district}`;
  const body = `${alert.id}: outbreak probability ${alert.probability}% in ${where}. ${
  alert.severity === 'red' || alert.severity === 'orange' ?
  'Acknowledge within 4 hours.' :
  'Monitor closely.'}`;
  let out = notify(list, {
    title,
    body,
    severity: alert.severity,
    alertId: alert.id,
    link: `/dho/alerts/${alert.id}`,
    roles: ['dho'],
    district: alert.district
  });
  out = notify(out, {
    title,
    body,
    severity: alert.severity,
    alertId: alert.id,
    link: `/warning/detail?id=${alert.id}`,
    roles: ['epi', 'analyst', 'admin']
  });
  return out;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
type Updater = (s: AppState) => AppState;

export interface AppActions {
  // auth
  login: (role: Role, opts?: {silent?: boolean;}) => User;
  logout: () => void;
  resetDemo: () => void;
  updateProfile: (patch: Partial<User>) => void;
  // toasts
  toast: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
  // alerts
  acknowledgeAlert: (id: string, note?: string) => void;
  escalateAlert: (id: string, to: string, reason?: string) => void;
  resolveAlert: (id: string, reason: string) => void;
  dismissAlert: (id: string, reason: string) => void;
  addAlertNote: (id: string, text: string) => void;
  toggleAlertAction: (id: string, actionId: string) => void;
  simulateIncomingAlert: (district: string) => string | null;
  // notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendNotification: (n: Omit<AppNotification, 'id' | 'at' | 'read'>, activity: {module: string;action: string;}) => void;
  // investigations
  requestInvestigation: (
  alertId: string,
  input: {lead: string;priority: Investigation['priority'];hypothesis: string;team: string[];})
  => string;
  updateInvestigation: (id: string, patch: Partial<Investigation>, note?: string) => void;
  addInvestigationUpdate: (id: string, text: string) => void;
  // interventions
  addIntervention: (input: Omit<Intervention, 'id'>) => string;
  updateIntervention: (id: string, patch: Partial<Intervention>, note?: string) => void;
  sendFacilityReminder: (facilities: string[]) => void;
  // integration
  syncSource: (id: string) => void;
  syncAllSources: () => void;
  reconnectSource: (id: string) => void;
  toggleSource: (id: string) => void;
  updateSource: (id: string, patch: Partial<DataSource>) => void;
  addSource: (input: Omit<DataSource, 'id'>) => void;
  recordUpload: (sourceId: string, filename: string, records: number, rejected: number) => void;
  // processing
  runPipeline: () => void;
  retryJob: (jobId: string) => void;
  // prediction
  runPrediction: (input: {horizon: string;diseaseScope: string;}) => void;
  overrideRisk: (district: string, score: number, decision: string, note: string) => void;
  // warning config
  updateThreshold: (disease: string, patch: Partial<Threshold>) => void;
  updateRules: (patch: Partial<AlertRules>) => void;
  resetRules: () => void;
  // admin
  addUser: (u: Omit<AdminUser, 'id' | 'login'>) => void;
  updateUser: (id: number, patch: Partial<AdminUser>) => void;
  setUsersStatus: (ids: number[], status: AdminUser['status']) => void;
  deleteUsers: (ids: number[]) => void;
  importUsers: (count: number, filename: string) => void;
  savePermissions: (matrix: PermissionGroup[]) => void;
  sendAnnouncement: (a: Omit<Announcement, 'id' | 'at' | 'sentBy' | 'status'>, scheduled?: boolean) => void;
  runBackup: () => void;
  logAdminEvent: (module: string, action: string, detail?: string) => void;
  // reports
  addReport: (r: Omit<GeneratedReport, 'id' | 'at' | 'author'>) => GeneratedReport;
  updateReport: (id: string, patch: Partial<GeneratedReport>) => void;
  addFinding: (f: Omit<AnalystFinding, 'id' | 'at'>) => void;
  removeFinding: (id: string) => void;
  clearFindings: () => void;
}

interface Ctx {
  state: AppState;
  actions: AppActions;
  toasts: Toast[];
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<AppState>(loadState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable */
    }
  }, [state]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const update = useCallback((fn: Updater) => setState(fn), []);
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const toast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = uid('t');
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  const dismissToast = useCallback(
    (id: string) => setToasts((t) => t.filter((x) => x.id !== id)),
    []
  );

  const patchAlert = (s: AppState, id: string, fn: (a: Alert) => Alert) => ({
    ...s,
    alerts: s.alerts.map((a) => a.id === id ? fn(a) : a)
  });

  const markAlertNotificationsRead = (list: AppNotification[], alertId: string) =>
  list.map((n) => n.alertId === alertId ? { ...n, read: true } : n);

  const actions: AppActions = useMemo(() => {
    const actorName = () => stateRef.current.user?.name ?? 'AI Vital';

    // Prediction completion, shared by runPrediction + simulateIncomingAlert
    const createAlertsFromSignals = (
    s: AppState,
    signals: PredictionSignal[])
    : {state: AppState;created: string[];} => {
      let next = s;
      const created: string[] = [];
      for (const sig of signals) {
        const severity = severityForSignal(sig, next.thresholds, next.rules);
        if (severity === 'green') continue;
        const existing = next.alerts.find(
          (a) =>
          a.district === sig.district &&
          a.disease === sig.disease &&
          isOpenStatus(a.status)
        );
        if (existing) {
          // Refresh the open alert with the new probability instead of duplicating it.
          next = patchAlert(next, existing.id, (a) => ({
            ...a,
            probability: sig.probability,
            timeline: [
            ...a.timeline,
            {
              at: nowISO(),
              author: 'AI Vital',
              text: `Prediction refreshed: probability now ${sig.probability}%.`,
              kind: 'system'
            }]

          }));
          continue;
        }
        const id = nextAlertId(next.alerts);
        const alert = alertFromSignal(id, sig, severity, 'AI prediction');
        created.push(id);
        next = {
          ...next,
          alerts: [alert, ...next.alerts],
          notifications: alertNotifications(next.notifications, alert),
          activity: [
          {
            id: uid('act'),
            at: nowISO(),
            actor: 'AI Vital',
            actorEmail: 'system@aivital.rw',
            role: 'System',
            module: 'Early Warning',
            action: `Generated ${severity.toUpperCase()} Alert — ${id}`,
            detail: `${sig.disease}, ${sig.sector ? sig.sector + ', ' : ''}${sig.district}`,
            ip: '—',
            district: sig.district
          },
          ...next.activity]

        };
      }
      return { state: next, created };
    };

    const api: AppActions = {
      // ---------------------------------------------------------------- auth
      login: (role, opts) => {
        const user = PERSONAS[role];
        update((s) => ({
          ...s,
          user,
          activity: opts?.silent ?
          s.activity :
          withActivity({ ...s, user }, 'Auth', 'Logged In', 'Demo session (simulated authentication)')
        }));
        return user;
      },
      logout: () =>
      update((s) => ({
        ...s,
        activity: s.user ? withActivity(s, 'Auth', 'Logged Out') : s.activity,
        user: null
      })),
      resetDemo: () => {
        const user = stateRef.current.user;
        resetDemoClock();
        setState({ ...seedState(), user });
        toast('Demo data has been reset to its starting state.', 'info');
      },
      updateProfile: (patch) =>
      update((s) =>
      s.user ?
      {
        ...s,
        user: { ...s.user, ...patch },
        activity: withActivity(s, 'Profile', 'Updated profile details')
      } :
      s
      ),

      toast,
      dismissToast,

      // -------------------------------------------------------------- alerts
      acknowledgeAlert: (id, note) => {
        update((s) => {
          const who = actorName();
          const at = nowISO();
          let next = patchAlert(s, id, (a) => ({
            ...a,
            status: a.status === 'active' ? 'acknowledged' : a.status,
            acknowledgedBy: who,
            acknowledgedAt: at,
            timeline: [
            ...a.timeline,
            { at, author: who, text: 'Alert acknowledged.', kind: 'status' as const },
            ...(note ? [{ at, author: who, text: note, kind: 'note' as const }] : [])]

          }));
          const alert = next.alerts.find((a) => a.id === id);
          next = {
            ...next,
            notifications: markAlertNotificationsRead(next.notifications, id),
            activity: withActivity(
              next,
              'Early Warning',
              `Acknowledged ${alert?.severity.toUpperCase()} Alert — ${id}`,
              alert ? `${alert.disease}, ${alert.sector ?? alert.district}` : '',
              { district: alert?.district }
            )
          };
          return next;
        });
        toast(`Alert ${id} acknowledged. Response logged.`);
      },
      escalateAlert: (id, to, reason) => {
        update((s) => {
          const who = actorName();
          const at = nowISO();
          let next = patchAlert(s, id, (a) => ({
            ...a,
            status: 'escalated',
            acknowledgedBy: a.acknowledgedBy ?? who,
            acknowledgedAt: a.acknowledgedAt ?? at,
            escalatedTo: to,
            escalatedAt: at,
            timeline: [
            ...a.timeline,
            {
              at,
              author: who,
              text: `Escalated to ${to}.${reason ? ` Reason: ${reason}` : ''}`,
              kind: 'status' as const
            }]

          }));
          const alert = next.alerts.find((a) => a.id === id)!;
          next = {
            ...next,
            notifications: notify(markAlertNotificationsRead(next.notifications, id), {
              title: `Escalation — ${alert.disease} in ${alert.sector ?? alert.district}`,
              body: `${id} was escalated to ${to} by ${who}.${reason ? ` “${reason}”` : ''}`,
              severity: alert.severity,
              alertId: id,
              link: `/warning/detail?id=${id}`,
              roles: ['epi', 'admin']
            }),
            activity: withActivity(
              next,
              'Early Warning',
              `Escalated ${alert.severity.toUpperCase()} Alert — ${id}`,
              `To ${to}`,
              { district: alert.district }
            )
          };
          return next;
        });
        toast(`Alert ${id} escalated to ${to}.`, 'warning');
      },
      resolveAlert: (id, reason) => {
        update((s) => {
          const who = actorName();
          const at = nowISO();
          const next = patchAlert(s, id, (a) => ({
            ...a,
            status: 'resolved',
            closedAt: at,
            closeReason: reason,
            timeline: [
            ...a.timeline,
            { at, author: who, text: `Resolved — ${reason}`, kind: 'status' as const }]

          }));
          const alert = next.alerts.find((a) => a.id === id)!;
          return {
            ...next,
            notifications: markAlertNotificationsRead(next.notifications, id),
            activity: withActivity(next, 'Early Warning', `Resolved Alert — ${id}`, reason, {
              district: alert.district
            })
          };
        });
        toast(`Alert ${id} marked as resolved.`);
      },
      dismissAlert: (id, reason) => {
        update((s) => {
          const who = actorName();
          const at = nowISO();
          const next = patchAlert(s, id, (a) => ({
            ...a,
            status: 'dismissed',
            closedAt: at,
            closeReason: reason,
            timeline: [
            ...a.timeline,
            { at, author: who, text: `Dismissed — ${reason}`, kind: 'status' as const }]

          }));
          const alert = next.alerts.find((a) => a.id === id)!;
          return {
            ...next,
            notifications: markAlertNotificationsRead(next.notifications, id),
            activity: withActivity(next, 'Early Warning', `Dismissed Alert — ${id}`, reason, {
              district: alert.district
            })
          };
        });
        toast(`Alert ${id} dismissed.`, 'info');
      },
      addAlertNote: (id, text) => {
        update((s) => {
          const who = actorName();
          const next = patchAlert(s, id, (a) => ({
            ...a,
            timeline: [...a.timeline, { at: nowISO(), author: who, text, kind: 'note' as const }]
          }));
          return {
            ...next,
            activity: withActivity(next, 'Early Warning', `Added response note — ${id}`, text)
          };
        });
        toast('Response note added to the alert timeline.');
      },
      toggleAlertAction: (id, actionId) =>
      update((s) => {
        const who = actorName();
        let label = '';
        let done = false;
        const next = patchAlert(s, id, (a) => ({
          ...a,
          actions: a.actions.map((x) => {
            if (x.id !== actionId) return x;
            label = x.label;
            done = !x.done;
            return { ...x, done };
          })
        }));
        return patchAlert(next, id, (a) => ({
          ...a,
          timeline: [
          ...a.timeline,
          {
            at: nowISO(),
            author: who,
            text: `${done ? 'Completed' : 'Reopened'} action: ${label}`,
            kind: 'note' as const
          }]

        }));
      }),
      simulateIncomingAlert: (district) => {
        const s = stateRef.current;
        const candidates = DEMO_DHO_SIGNALS.filter(
          (sig) =>
          sig.district === district &&
          !s.alerts.some(
            (a) =>
            a.district === sig.district &&
            a.disease === sig.disease &&
            a.sector === sig.sector &&
            isOpenStatus(a.status)
          )
        );
        const sig = candidates[0];
        if (!sig) {
          toast('No further simulated signals are available for this district.', 'info');
          return null;
        }
        const id = nextAlertId(s.alerts);
        update((st) => {
          const { state: next } = createAlertsFromSignals(st, [sig]);
          return { ...next, demoSignalsUsed: st.demoSignalsUsed + 1 };
        });
        toast(`New AI alert ${id} received for ${sig.sector ?? district}.`, 'warning');
        return id;
      },

      // -------------------------------------------------------- notifications
      markNotificationRead: (id) =>
      update((s) => ({
        ...s,
        notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsRead: () =>
      update((s) => {
        const mine = new Set(notificationsFor(s, s.user).map((n) => n.id));
        return {
          ...s,
          notifications: s.notifications.map((n) => mine.has(n.id) ? { ...n, read: true } : n)
        };
      }),

      sendNotification: (n, activity) =>
      update((s) => ({
        ...s,
        notifications: notify(s.notifications, n),
        activity: withActivity(s, activity.module, activity.action, n.title, { district: n.district })
      })),

      // -------------------------------------------------------- investigations
      requestInvestigation: (alertId, input) => {
        const s = stateRef.current;
        const id = nextSeq(
          s.investigations.map((i) => i.id),
          'INV-2026-'
        );
        update((st) => {
          const alert = st.alerts.find((a) => a.id === alertId);
          if (!alert) return st;
          const who = actorName();
          const at = nowISO();
          const byEpi = st.user?.role === 'epi';
          const inv: Investigation = {
            id,
            alertId,
            disease: alert.disease,
            district: alert.district,
            sector: alert.sector,
            lead: input.lead,
            team: input.team,
            status: byEpi ? 'active' : 'requested',
            priority: input.priority,
            openedAt: at,
            cases: alert.cases,
            hypothesis: input.hypothesis,
            updates: [
            {
              at,
              author: who,
              text: byEpi ?
              `Investigation opened from alert ${alertId}.` :
              `Investigation requested from alert ${alertId}. Awaiting RBC epidemiology team.`,
              kind: 'status'
            }]

          };
          let next: AppState = {
            ...st,
            investigations: [inv, ...st.investigations]
          };
          next = patchAlert(next, alertId, (a) => ({
            ...a,
            investigationId: id,
            timeline: [
            ...a.timeline,
            { at, author: who, text: `Investigation ${id} ${byEpi ? 'opened' : 'requested'} (lead: ${input.lead}).`, kind: 'status' as const }]

          }));
          next = {
            ...next,
            notifications: notify(next.notifications, {
              title: `Investigation ${byEpi ? 'opened' : 'requested'} — ${alert.disease}, ${alert.sector ?? alert.district}`,
              body: `${id} linked to ${alertId}. Lead: ${input.lead}. Priority: ${input.priority}.`,
              severity: alert.severity,
              alertId,
              link: `/epi/investigations?id=${id}`,
              roles: ['epi']
            }),
            activity: withActivity(
              next,
              'Investigations',
              `${byEpi ? 'Opened' : 'Requested'} Investigation — ${id}`,
              `${alert.disease}, ${alert.district} (from ${alertId})`,
              { district: alert.district }
            )
          };
          return next;
        });
        toast(`Investigation ${id} ${s.user?.role === 'epi' ? 'opened' : 'requested'}.`);
        return id;
      },
      updateInvestigation: (id, patch, note) => {
        update((s) => {
          const who = actorName();
          const at = nowISO();
          const before = s.investigations.find((i) => i.id === id);
          if (!before) return s;
          const statusChanged = patch.status && patch.status !== before.status;
          const updates = [...before.updates];
          if (statusChanged)
          updates.push({ at, author: who, text: `Status changed to ${patch.status}.`, kind: 'status' });
          if (patch.lead && patch.lead !== before.lead)
          updates.push({ at, author: who, text: `Lead investigator assigned: ${patch.lead}.`, kind: 'status' });
          if (note) updates.push({ at, author: who, text: note, kind: 'note' });
          let next: AppState = {
            ...s,
            investigations: s.investigations.map((i) =>
            i.id === id ? { ...i, ...patch, updates } : i
            )
          };
          if (statusChanged || patch.lead && patch.lead !== before.lead) {
            next = {
              ...next,
              notifications: notify(next.notifications, {
                title: `Investigation ${id} updated`,
                body: `${before.disease}, ${before.sector ?? before.district}: ${
                statusChanged ? `status is now ${patch.status}` : `lead is now ${patch.lead}`}.`,
                severity: 'info',
                alertId: before.alertId,
                link: `/dho/investigations/${id}`,
                roles: ['dho'],
                district: before.district
              }),
              activity: withActivity(
                next,
                'Investigations',
                `Updated Investigation — ${id}`,
                statusChanged ? `Status: ${patch.status}` : `Lead: ${patch.lead}`
              )
            };
          }
          return next;
        });
        toast(`Investigation ${id} updated.`);
      },
      addInvestigationUpdate: (id, text) => {
        update((s) => ({
          ...s,
          investigations: s.investigations.map((i) =>
          i.id === id ?
          {
            ...i,
            updates: [...i.updates, { at: nowISO(), author: actorName(), text, kind: 'note' }]
          } :
          i
          ),
          activity: withActivity(s, 'Investigations', `Field update — ${id}`, text)
        }));
        toast('Field update added.');
      },

      // --------------------------------------------------------- interventions
      addIntervention: (input) => {
        const id = nextSeq(
          stateRef.current.interventions.map((i) => i.id),
          'INT-'
        );
        update((s) => {
          let next: AppState = {
            ...s,
            interventions: [{ ...input, id }, ...s.interventions]
          };
          if (input.alertId) {
            next = patchAlert(next, input.alertId, (a) => ({
              ...a,
              timeline: [
              ...a.timeline,
              {
                at: nowISO(),
                author: actorName(),
                text: `Intervention ${id} logged: ${input.action}.`,
                kind: 'note' as const
              }]

            }));
          }
          return {
            ...next,
            activity: withActivity(
              next,
              'Interventions',
              `Logged Intervention — ${id}`,
              `${input.action} (${input.sector})`,
              { district: input.district }
            )
          };
        });
        toast(`Intervention ${id} logged.`);
        return id;
      },
      updateIntervention: (id, patch, note) => {
        update((s) => {
          const before = s.interventions.find((i) => i.id === id);
          if (!before) return s;
          let next: AppState = {
            ...s,
            interventions: s.interventions.map((i) =>
            i.id === id ?
            { ...i, ...patch, notes: note ? `${i.notes ? i.notes + '\n' : ''}${note}` : i.notes } :
            i
            )
          };
          if (before.alertId && patch.status && patch.status !== before.status) {
            next = patchAlert(next, before.alertId, (a) => ({
              ...a,
              timeline: [
              ...a.timeline,
              {
                at: nowISO(),
                author: actorName(),
                text: `Intervention ${id} is now ${patch.status}${patch.outcome ? ` — ${patch.outcome}` : ''}.`,
                kind: 'note' as const
              }]

            }));
          }
          return {
            ...next,
            activity: withActivity(
              next,
              'Interventions',
              `Updated Intervention — ${id}`,
              patch.status ? `Status: ${patch.status}` : 'Details updated'
            )
          };
        });
        toast(`Intervention ${id} updated.`);
      },
      sendFacilityReminder: (facilities) => {
        update((s) => ({
          ...s,
          remindersSent: Array.from(new Set([...s.remindersSent, ...facilities])),
          activity: withActivity(
            s,
            'Facilities',
            `Sent reporting reminder to ${facilities.length} facilit${facilities.length === 1 ? 'y' : 'ies'}`,
            facilities.join(', ')
          )
        }));
        toast(`Reminder SMS queued for ${facilities.length} facilit${facilities.length === 1 ? 'y' : 'ies'} (simulated).`);
      },

      // ------------------------------------------------------------ integration
      syncSource: (id) => {
        const src = stateRef.current.sources.find((x) => x.id === id);
        if (!src) return;
        if (!src.enabled) {
          toast(`${src.name} is disabled. Enable it before syncing.`, 'error');
          return;
        }
        if (src.syncing) return;
        update((s) => ({
          ...s,
          sources: s.sources.map((x) => x.id === id ? { ...x, syncing: true } : x)
        }));
        later(1600, () => {
          const cur = stateRef.current.sources.find((x) => x.id === id);
          if (!cur) return;
          if (cur.status === 'disconnected') {
            update((s) => ({
              ...s,
              sources: s.sources.map((x) => x.id === id ? { ...x, syncing: false } : x),
              syncLog: [
              {
                id: uid('s'),
                at: nowISO(),
                sourceId: id,
                sourceName: cur.name,
                records: 0,
                status: 'failed',
                message: cur.error ?? 'Connection failed'
              },
              ...s.syncLog],

              activity: withActivity(s, 'Integration', `Sync failed — ${cur.name}`, cur.error ?? '')
            }));
            toast(`Sync failed for ${cur.name}: ${cur.error ?? 'source unreachable'}. Reconnect first.`, 'error');
            return;
          }
          const records = 40 + (cur.name.length * 37 + cur.recordsToday) % 420;
          update((s) => ({
            ...s,
            pendingRecords: s.pendingRecords + records,
            pipeline: { ...s.pipeline, staleSources: true },
            sources: s.sources.map((x) =>
            x.id === id ?
            {
              ...x,
              syncing: false,
              lastSync: nowISO(),
              recordsToday: x.recordsToday + records,
              status: x.status === 'delayed' ? 'active' : x.status,
              warning: x.status === 'delayed' ? undefined : x.warning,
              health: x.status === 'delayed' ? 88 : x.health
            } :
            x
            ),
            syncLog: [
            {
              id: uid('s'),
              at: nowISO(),
              sourceId: id,
              sourceName: cur.name,
              records,
              status: cur.status === 'partial' ? 'partial' : 'success',
              message:
              cur.status === 'partial' ?
              `Pulled ${records} records — some districts unavailable` :
              `Pulled ${records} records`
            },
            ...s.syncLog],

            activity: withActivity(s, 'Integration', `Synced — ${cur.name}`, `${records} records`)
          }));
          toast(`${cur.name}: ${records} new records imported (simulated sync).`);
        });
      },
      syncAllSources: () => {
        const list = stateRef.current.sources.filter((x) => x.enabled && x.connection === 'Automatic API');
        list.forEach((x, i) => later(i * 250, () => api.syncSource(x.id)));
      },
      reconnectSource: (id) => {
        const src = stateRef.current.sources.find((x) => x.id === id);
        if (!src || src.syncing) return;
        update((s) => ({
          ...s,
          sources: s.sources.map((x) => x.id === id ? { ...x, syncing: true, enabled: true } : x)
        }));
        later(2200, () => {
          const records = 312;
          update((s) => ({
            ...s,
            pendingRecords: s.pendingRecords + records,
            pipeline: { ...s.pipeline, staleSources: true },
            sources: s.sources.map((x) =>
            x.id === id ?
            {
              ...x,
              syncing: false,
              status: 'active',
              error: undefined,
              health: 90,
              quality: 95.2,
              lastSync: nowISO(),
              recordsToday: x.recordsToday + records
            } :
            x
            ),
            syncLog: [
            {
              id: uid('s'),
              at: nowISO(),
              sourceId: id,
              sourceName: src.name,
              records,
              status: 'success',
              message: `Reconnected — credentials renewed, ${records} records backfilled`
            },
            ...s.syncLog],

            notifications: notify(s.notifications, {
              title: `${src.name} reconnected`,
              body:
              id === 'met' ?
              'Weather data is flowing again. Re-run processing and prediction to restore environmental risk features.' :
              `${src.name} is connected and syncing normally.`,
              severity: 'info',
              link: '/integration/sources',
              roles: ['integration', 'admin', 'analyst']
            }),
            activity: withActivity(s, 'Integration', `Reconnected — ${src.name}`, `${records} records backfilled`)
          }));
          toast(`${src.name} reconnected. ${records} records backfilled.`);
        });
      },
      toggleSource: (id) => {
        const src = stateRef.current.sources.find((x) => x.id === id);
        if (!src) return;
        update((s) => ({
          ...s,
          sources: s.sources.map((x) => {
            if (x.id !== id) return x;
            return x.enabled ?
            { ...x, enabled: false, pausedStatus: x.status, status: 'disabled' } :
            { ...x, enabled: true, status: x.pausedStatus ?? 'active', pausedStatus: undefined };
          }),
          activity: withActivity(s, 'Integration', `${src.enabled ? 'Disabled' : 'Enabled'} source — ${src.name}`)
        }));
        toast(`${src.name} ${src.enabled ? 'disabled — no further data will be pulled' : 'enabled'}.`, src.enabled ? 'info' : 'success');
      },
      updateSource: (id, patch) => {
        update((s) => ({
          ...s,
          sources: s.sources.map((x) => x.id === id ? { ...x, ...patch } : x),
          activity: withActivity(s, 'Integration', `Updated configuration — ${s.sources.find((x) => x.id === id)?.name ?? id}`)
        }));
        toast('Source configuration saved.');
      },
      addSource: (input) => {
        update((s) => ({
          ...s,
          sources: [...s.sources, { ...input, id: uid('src') }],
          activity: withActivity(s, 'Integration', `Added data source — ${input.name}`)
        }));
        toast(`${input.name} added as a new data source.`);
      },
      recordUpload: (sourceId, filename, records, rejected) => {
        update((s) => {
          const src = s.sources.find((x) => x.id === sourceId);
          return {
            ...s,
            pendingRecords: s.pendingRecords + records,
            pipeline: { ...s.pipeline, staleSources: true },
            sources: s.sources.map((x) =>
            x.id === sourceId ?
            { ...x, lastSync: nowISO(), recordsToday: x.recordsToday + records } :
            x
            ),
            syncLog: [
            {
              id: uid('s'),
              at: nowISO(),
              sourceId,
              sourceName: src?.name ?? 'Manual upload',
              records,
              status: rejected > 0 ? 'partial' : 'success',
              message: `Manual upload ${filename}: ${records} accepted, ${rejected} rejected`
            },
            ...s.syncLog],

            activity: withActivity(s, 'Integration', `Manual upload — ${filename}`, `${records} accepted, ${rejected} rejected`)
          };
        });
        toast(`${filename}: ${records} records imported.`);
      },

      // ------------------------------------------------------------- processing
      runPipeline: () => {
        if (stateRef.current.pipeline.status === 'running') return;
        update((s) => ({
          ...s,
          pipeline: { ...s.pipeline, status: 'running', stageIndex: 0, progress: 0 },
          activity: withActivity(s, 'Processing', 'Started pipeline run')
        }));
        const tick = () => {
          const p = stateRef.current.pipeline;
          if (p.status !== 'running') return;
          let { stageIndex, progress } = p;
          progress += 20;
          if (progress >= 100) {
            if (stageIndex >= PIPELINE_STAGES.length - 1) {
              finish();
              return;
            }
            stageIndex += 1;
            progress = 0;
          }
          update((s) => ({ ...s, pipeline: { ...s.pipeline, stageIndex, progress } }));
          later(260, tick);
        };
        const finish = () => {
          update((s) => {
            const at = nowISO();
            const d = new Date(at);
            const batchId = `BATCH-${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${fmtTime(at).replace(':', '')}`;
            const live = s.sources.filter((x) => x.enabled && x.status !== 'disconnected');
            const quality = Math.round(
              live.reduce((sum, x) => sum + x.quality, 0) / Math.max(live.length, 1)
            );
            const records = s.pipeline.recordsProcessed + s.pendingRecords;
            const metDown = s.sources.some((x) => x.id === 'met' && x.status !== 'active');
            const newJobs: ProcessingJob[] = [
            { id: uid('j'), at, name: 'Data Cleaning', duration: '1 min', records, status: 'success' },
            { id: uid('j'), at, name: 'Metric Calculation', duration: '1 min', records, status: 'success' },
            { id: uid('j'), at, name: 'Geographic Aggregation', duration: '1 min', records, status: 'success' },
            { id: uid('j'), at, name: 'Feature Engineering', duration: '2 min', records, status: 'success' },
            ...(metDown ?
            [{ id: uid('j'), at, name: 'Met Agency Import', duration: '—', records: 0, status: 'failed' as const, detail: 'Source offline — environmental features skipped' }] :
            [])];

            return {
              ...s,
              pendingRecords: 0,
              pipeline: {
                status: 'complete',
                stageIndex: PIPELINE_STAGES.length - 1,
                progress: 100,
                lastRunAt: at,
                lastBatchId: batchId,
                recordsProcessed: records,
                qualityScore: quality,
                staleSources: false
              },
              jobs: [...newJobs, ...s.jobs],
              notifications: notify(s.notifications, {
                title: `Processing complete — ${batchId}`,
                body: `${records.toLocaleString('en-US')} records cleaned, aggregated and published for prediction.${metDown ? ' Weather features skipped (Met Agency offline).' : ''}`,
                severity: 'info',
                link: '/prediction',
                roles: ['integration', 'analyst', 'epi']
              }),
              activity: withActivity(s, 'Processing', `Pipeline run completed — ${batchId}`, `${records} records, quality ${quality}%`)
            };
          });
          toast('Pipeline complete — a new AI-ready batch is available for prediction.');
        };
        later(260, tick);
      },
      retryJob: (jobId) => {
        const job = stateRef.current.jobs.find((j) => j.id === jobId);
        if (!job) return;
        if (job.name === 'Met Agency Import') {
          const met = stateRef.current.sources.find((x) => x.id === 'met');
          if (met && met.status === 'disconnected') {
            toast('Retry failed: the Met Agency source is still disconnected. Reconnect it in Data Integration.', 'error');
            update((s) => ({
              ...s,
              activity: withActivity(s, 'Processing', `Retry failed — ${job.name}`, 'Source offline')
            }));
            return;
          }
        }
        update((s) => ({
          ...s,
          jobs: s.jobs.map((j) => j.id === jobId ? { ...j, status: 'running' } : j)
        }));
        later(1800, () => {
          update((s) => ({
            ...s,
            jobs: s.jobs.map((j) =>
            j.id === jobId ?
            { ...j, status: 'success', records: j.records || 312, duration: '2 min', detail: 'Retried successfully' } :
            j
            ),
            activity: withActivity(s, 'Processing', `Retried job — ${job.name}`, 'Success')
          }));
          toast(`${job.name} re-run completed successfully.`);
        });
      },

      // ------------------------------------------------------------- prediction
      runPrediction: ({ horizon, diseaseScope }) => {
        if (stateRef.current.predictionRuns.some((r) => r.status === 'running')) return;
        const s0 = stateRef.current;
        const id = `PRED-${uid('').slice(1, 7).toUpperCase()}`;
        const run: PredictionRun = {
          id,
          at: nowISO(),
          batchId: s0.pipeline.lastBatchId,
          horizon,
          diseaseScope,
          districtsScored: 30,
          confidence: 0,
          environmental: false,
          signals: [],
          alertsGenerated: [],
          status: 'running'
        };
        update((s) => ({
          ...s,
          predictionRuns: [run, ...s.predictionRuns],
          activity: withActivity(s, 'Prediction', `Started prediction run — ${id}`, `${horizon}, ${diseaseScope}`)
        }));
        later(3200, () => {
          update((s) => {
            const env = s.sources.some((x) => x.id === 'met' && x.status === 'active' && x.enabled);
            const horizonFactor = horizon.includes('7') ? 0.94 : horizon.includes('28') ? 1.06 : 1;
            const confidence = (env ? 86 : 78) - (s.pipeline.staleSources ? 3 : 0) - (horizon.includes('28') ? 5 : 0);
            const clamp = (n: number) => Math.max(1, Math.min(99, Math.round(n)));
            const scoped = (disease: string) =>
            diseaseScope === 'All priority diseases' || diseaseScope === disease;
            const signals = CANDIDATE_SIGNALS.filter((c) => scoped(c.disease)).map((c) => {
              const envBoost = env && (c.disease === 'Cholera' || c.disease === 'Malaria' || c.disease === 'Diarrheal Disease') ? 3 : 0;
              return {
                ...c,
                probability: clamp(c.probability * horizonFactor + envBoost),
                confidence: clamp(c.confidence + (env ? 4 : 0))
              };
            });
            const districtRisk = s.districtRisk.map((r) => {
              if (!scoped(r.disease)) return r;
              const sig = signals.find((x) => x.district === r.district && x.disease === r.disease);
              const hash = (r.district.charCodeAt(0) + r.district.length) % 3 - 1; // -1..1
              const target = sig ? Math.max(r.score, sig.probability + 3) : r.score + hash;
              const score = clamp(target * (sig ? 1 : horizonFactor));
              return {
                ...r,
                score,
                trend: score > r.score ? 'up' as const : score < r.score ? 'down' as const : 'stable' as const,
                confidence
              };
            });
            // Maraba's signal also lifts Huye's district score
            const withHuye = districtRisk.map((r) =>
            r.district === 'Huye' && signals.some((x) => x.district === 'Huye') ?
            { ...r, score: Math.max(r.score, 74), trend: 'up' as const } :
            r
            );
            const { state: next, created } = createAlertsFromSignals(
              { ...s, districtRisk: withHuye },
              signals
            );
            const finished: PredictionRun = {
              ...run,
              at: nowISO(),
              confidence,
              environmental: env,
              signals,
              alertsGenerated: created,
              status: 'complete'
            };
            return {
              ...next,
              predictionRuns: next.predictionRuns.map((r) => r.id === id ? finished : r),
              activity: withActivity(
                next,
                'Prediction',
                `Prediction run completed — ${id}`,
                `${signals.length} risk signals, ${created.length} new alert(s)`
              )
            };
          });
          later(120, () => {
            const run2 = stateRef.current.predictionRuns.find((r) => r.id === id);
            const n = run2?.alertsGenerated.length ?? 0;
            toast(
              n > 0 ?
              `Prediction complete — ${n} new alert${n > 1 ? 's' : ''} sent to Early Warning.` :
              'Prediction complete — no new alerts (existing alerts refreshed).',
              n > 0 ? 'warning' : 'success'
            );
          });
        });
      },

      overrideRisk: (district, score, decision, note) => {
        update((s) => {
          const before = s.districtRisk.find((r) => r.district === district);
          return {
            ...s,
            districtRisk: s.districtRisk.map((r) =>
            r.district === district && decision === 'Adjust' ?
            { ...r, score, trend: score > r.score ? 'up' : score < r.score ? 'down' : r.trend } :
            r
            ),
            activity: withActivity(
              s,
              'Prediction',
              `Analyst ${decision === 'Adjust' ? 'adjusted' : decision === 'Flag' ? 'flagged' : 'validated'} risk score — ${district}`,
              `${decision === 'Adjust' ? `${before?.score ?? '?'} → ${score}. ` : ''}${note}`
            )
          };
        });
        toast(
          decision === 'Adjust' ?
          `${district} risk score overridden to ${score}/100. Logged for model review.` :
          decision === 'Flag' ?
          `${district} prediction flagged for model review.` :
          `${district} prediction validated.`
        );
      },

      // --------------------------------------------------------- warning config
      updateThreshold: (disease, patch) => {
        update((s) => ({
          ...s,
          thresholds: s.thresholds.map((t) =>
          t.disease === disease ? { ...t, ...patch, updated: 'June 2026' } : t
          ),
          activity: withActivity(
            s,
            'Configuration',
            `Changed alert thresholds — ${disease}`,
            `Yellow ${patch.yellow} / Orange ${patch.orange} / Red ${patch.red}`
          )
        }));
        toast(`${disease} thresholds saved. New rules apply to the next prediction run.`);
      },
      updateRules: (patch) => {
        update((s) => ({
          ...s,
          rules: { ...s.rules, ...patch },
          activity: withActivity(s, 'Configuration', 'Updated advanced alert rules')
        }));
        toast('Alert rules saved.');
      },
      resetRules: () => {
        update((s) => ({
          ...s,
          rules: SEED_RULES,
          thresholds: SEED_THRESHOLDS,
          activity: withActivity(s, 'Configuration', 'Reset alert rules to RBC defaults')
        }));
        toast('Alert rules reset to RBC defaults.', 'info');
      },

      // ------------------------------------------------------------------ admin
      addUser: (u) =>
      update((s) => ({
        ...s,
        users: [{ ...u, id: Math.max(0, ...s.users.map((x) => x.id)) + 1, login: 'Never' }, ...s.users],
        activity: withActivity(s, 'User Mgmt', `Created User — ${u.email}`, `Role: ${u.role}`)
      })),
      updateUser: (id, patch) =>
      update((s) => ({
        ...s,
        users: s.users.map((x) => x.id === id ? { ...x, ...patch } : x),
        activity: withActivity(
          s,
          'User Mgmt',
          `Updated User — ${s.users.find((x) => x.id === id)?.email ?? id}`,
          Object.keys(patch).join(', ')
        )
      })),
      setUsersStatus: (ids, status) =>
      update((s) => ({
        ...s,
        users: s.users.map((x) => ids.includes(x.id) ? { ...x, status } : x),
        activity: withActivity(
          s,
          'User Mgmt',
          `${status === 'Active' ? 'Activated' : status === 'Inactive' ? 'Deactivated' : 'Updated'} ${ids.length} user(s)`,
          s.users.filter((x) => ids.includes(x.id)).map((x) => x.email).join(', ')
        )
      })),
      deleteUsers: (ids) =>
      update((s) => ({
        ...s,
        users: s.users.filter((x) => !ids.includes(x.id)),
        activity: withActivity(
          s,
          'User Mgmt',
          `Removed ${ids.length} user(s)`,
          s.users.filter((x) => ids.includes(x.id)).map((x) => x.email).join(', ')
        )
      })),
      importUsers: (count, filename) =>
      update((s) => {
        const base = Math.max(0, ...s.users.map((x) => x.id));
        const names = ['Jeanne Mukamurenzi', 'Innocent Hakizimana', 'Beatrice Nyiraneza', 'Fabrice Niyonzima', 'Solange Umutoni', 'Theogene Nshimiyimana'];
        const districts = ['Nyanza', 'Gisagara', 'Ngoma', 'Rwamagana', 'Karongi', 'Burera'];
        const imported: AdminUser[] = Array.from({ length: count }, (_, i) => ({
          id: base + i + 1,
          name: names[i % names.length],
          email: `${names[i % names.length].split(' ')[0].toLowerCase()}.${districts[i % districts.length].toLowerCase()}@moh.gov.rw`,
          phone: `788 ${300 + i * 7} ${100 + i * 13}`,
          role: 'District Health Officer',
          inst: `${districts[i % districts.length]} DHO`,
          dist: districts[i % districts.length],
          login: 'Never',
          status: 'Pending Approval',
          mfa: true
        }));
        return {
          ...s,
          users: [...imported, ...s.users],
          activity: withActivity(s, 'User Mgmt', `Imported ${count} users`, filename)
        };
      }),
      savePermissions: (matrix) =>
      update((s) => ({
        ...s,
        permissions: matrix,
        activity: withActivity(s, 'Roles', 'Updated role permissions matrix')
      })),
      sendAnnouncement: (a, scheduled) =>
      update((s) => {
        const ann: Announcement = {
          ...a,
          id: uid('ann'),
          at: nowISO(),
          sentBy: s.user?.name ?? 'Administrator',
          status: scheduled ? 'Scheduled' : 'Sent'
        };
        const roleMap: Record<string, Role> = {
          Administrator: 'admin',
          Epidemiologist: 'epi',
          'Public Health Analyst': 'analyst',
          'District Health Officer': 'dho',
          'Data Integration': 'integration'
        };
        let roles: Role[] = ['admin', 'dho', 'epi', 'analyst', 'integration'];
        let district: string | undefined;
        if (a.audience.startsWith('Roles: ')) {
          roles = a.audience.slice(7).split(', ').map((r) => roleMap[r]).filter(Boolean);
        } else if (a.audience.startsWith('District: ')) {
          district = a.audience.slice(10);
        }
        return {
          ...s,
          announcements: [ann, ...s.announcements],
          notifications: scheduled ?
          s.notifications :
          notify(s.notifications, {
            title: `📣 ${a.title}`,
            body: a.body,
            severity: a.priority === 'urgent' ? 'red' : a.priority === 'important' ? 'orange' : 'info',
            roles,
            district
          }),
          activity: withActivity(
            s,
            'Announcements',
            `${scheduled ? 'Scheduled' : 'Sent'} announcement — ${a.title}`,
            a.audience
          )
        };
      }),
      runBackup: () => {
        const id = uid('b');
        update((s) => ({
          ...s,
          backups: [{ id, at: nowISO(), type: 'Manual', size: '—', status: 'Running' }, ...s.backups],
          activity: withActivity(s, 'Backup', 'Started manual backup')
        }));
        later(2600, () => {
          update((s) => ({
            ...s,
            backups: s.backups.map((b) => b.id === id ? { ...b, status: 'Success', size: '12.5 GB' } : b),
            activity: withActivity(s, 'Backup', 'Manual backup completed', '12.5 GB')
          }));
          toast('Manual backup completed (12.5 GB, simulated).');
        });
      },
      logAdminEvent: (module, action, detail) =>
      update((s) => ({ ...s, activity: withActivity(s, module, action, detail) })),

      // ---------------------------------------------------------------- reports
      addReport: (r) => {
        const report: GeneratedReport = {
          ...r,
          id: `RPT-${uid('').slice(1, 6).toUpperCase()}`,
          at: nowISO(),
          author: stateRef.current.user?.name ?? 'AI Vital'
        };
        update((s) => ({
          ...s,
          reports: [report, ...s.reports],
          activity: withActivity(s, 'Reports', `Generated Report — ${r.title}`, `${r.format}, ${r.district}`, {
            district: r.district
          })
        }));
        return report;
      },
      updateReport: (id, patch) =>
      update((s) => ({
        ...s,
        reports: s.reports.map((x) => x.id === id ? { ...x, ...patch } : x),
        activity: patch.status ?
        withActivity(s, 'Reports', `Report ${id}: ${patch.status}`) :
        s.activity
      })),
      addFinding: (f) => {
        update((s) => ({
          ...s,
          analystFindings: [...s.analystFindings, { ...f, id: uid('F'), at: nowISO() }],
          activity: withActivity(s, 'Analytics', 'Added finding to report', f.title)
        }));
        toast(`Added to report draft: ${f.title}`);
      },
      removeFinding: (id) =>
      update((s) => ({ ...s, analystFindings: s.analystFindings.filter((x) => x.id !== id) })),
      clearFindings: () => update((s) => ({ ...s, analystFindings: [] }))
    };
    return api;
  }, [update, later, toast, dismissToast]);

  const value = useMemo(() => ({ state, actions, toasts }), [state, actions, toasts]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

/**
 * Returns the signed-in user. When a screen is opened directly by URL without
 * signing in, the role's demo persona is signed in silently so the screen
 * still shows coherent, role-scoped data.
 */
export function useCurrentUser(fallback: Role): User {
  const { state, actions } = useApp();
  useEffect(() => {
    if (!state.user) actions.login(fallback, { silent: true });
  }, [state.user, actions, fallback]);
  return state.user ?? PERSONAS[fallback];
}

export function severityCounts(alerts: Alert[]) {
  const c: Record<Severity, number> = { red: 0, orange: 0, yellow: 0, green: 0 };
  alerts.forEach((a) => {
    c[a.severity] += 1;
  });
  return c;
}

export function sortAlerts(alerts: Alert[], by: 'recent' | 'severity' | 'disease' = 'recent') {
  const list = [...alerts];
  if (by === 'severity')
  list.sort(
    (x, y) =>
    SEVERITY_RANK[y.severity] - SEVERITY_RANK[x.severity] ||
    y.triggeredAt.localeCompare(x.triggeredAt)
  );else
  if (by === 'disease') list.sort((x, y) => x.disease.localeCompare(y.disease));else
  list.sort((x, y) => y.triggeredAt.localeCompare(x.triggeredAt));
  return list;
}
