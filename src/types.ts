// Shared domain types for the AI Vital frontend prototype.
// All data lives in the in-browser store (see src/store/AppStore.tsx) — there is no backend.

export type Role = 'admin' | 'dho' | 'epi' | 'analyst' | 'integration';

export type Severity = 'red' | 'orange' | 'yellow' | 'green';

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  roleLabel: string;
  institution: string;
  district: string; // 'National' for national-level roles
  phone: string;
  professionalId: string;
}

export type AlertStatus =
'active' |
'acknowledged' |
'escalated' |
'resolved' |
'dismissed';

export interface AlertAction {
  id: string;
  label: string;
  phase: 'immediate' | 'short';
  done: boolean;
}

export interface TimelineEntry {
  at: string;
  author: string;
  text: string;
  kind: 'system' | 'note' | 'status';
}

export interface Alert {
  id: string;
  disease: string;
  district: string;
  sector?: string;
  province: string;
  severity: Severity;
  status: AlertStatus;
  triggeredAt: string;
  probability: number; // 0-100 AI outbreak probability
  cases: number;
  threshold: number;
  change: string; // e.g. '+340%'
  source: 'AI prediction' | 'Threshold rule' | 'Cross-border signal';
  reasons: string[];
  actions: AlertAction[];
  timeline: TimelineEntry[];
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalatedTo?: string;
  escalatedAt?: string;
  closedAt?: string;
  closeReason?: string;
  investigationId?: string;
}

export interface AppNotification {
  id: string;
  at: string;
  title: string;
  body: string;
  severity: Severity | 'info';
  read: boolean;
  link?: string;
  alertId?: string;
  roles: Role[];
  district?: string; // applies to DHO audiences only
}

export interface Activity {
  id: string;
  at: string;
  actor: string;
  actorEmail: string;
  role: string;
  module: string;
  action: string;
  detail: string;
  ip: string;
  flagged?: boolean;
  district?: string;
}

export type InvestigationStatus = 'requested' | 'active' | 'closed';

export interface Investigation {
  id: string;
  alertId?: string;
  disease: string;
  district: string;
  sector?: string;
  lead: string;
  team: string[];
  status: InvestigationStatus;
  priority: 'Critical' | 'High' | 'Medium';
  openedAt: string;
  cases: number;
  hypothesis: string;
  updates: TimelineEntry[];
}

export type InterventionStatus = 'Planned' | 'Ongoing' | 'Completed' | 'Overdue';

export interface Intervention {
  id: string;
  date: string; // ISO
  due?: string; // ISO
  action: string;
  disease: string;
  sector: string;
  district: string;
  who: string;
  status: InterventionStatus;
  outcome: string;
  alertId?: string;
  notes?: string;
}

export type SourceStatus = 'active' | 'delayed' | 'partial' | 'disconnected' | 'disabled';

export interface DataSource {
  id: string;
  name: string;
  shortName: string;
  icon: 'hospital' | 'lab' | 'phone' | 'census' | 'weather' | 'pharmacy' | 'emr' | 'water' | 'agri' | 'generic';
  description: string;
  connection: 'Automatic API' | 'Manual Upload';
  apiType: string;
  url: string;
  auth: string;
  frequency: string;
  format: string;
  coverage: string;
  status: SourceStatus;
  enabled: boolean;
  lastSync: string; // ISO
  recordsToday: number;
  quality: number; // % validation pass
  health: number; // 0-100 health score
  warning?: string;
  error?: string;
  syncing?: boolean;
  pausedStatus?: SourceStatus; // status to restore when re-enabled
}

export interface SyncLogEntry {
  id: string;
  at: string;
  sourceId: string;
  sourceName: string;
  records: number;
  status: 'success' | 'failed' | 'partial';
  message: string;
}

export type StageKey = 'ingest' | 'clean' | 'metrics' | 'aggregate' | 'features' | 'model';

export interface ProcessingJob {
  id: string;
  at: string;
  name: string;
  duration: string;
  records: number;
  status: 'success' | 'failed' | 'running';
  detail?: string;
}

export interface PipelineState {
  status: 'idle' | 'running' | 'complete';
  stageIndex: number; // index into PIPELINE_STAGES currently running (or last completed)
  progress: number; // 0-100 for the running stage
  lastRunAt: string;
  lastBatchId: string;
  recordsProcessed: number;
  qualityScore: number;
  // true when source data changed after the last processing run
  staleSources: boolean;
}

export interface DistrictRisk {
  district: string;
  province: string;
  disease: string;
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  confidence: number; // 0-100
}

export interface PredictionSignal {
  district: string;
  sector?: string;
  province: string;
  disease: string;
  probability: number;
  confidence: number;
  cases: number;
  threshold: number;
  change: string;
  reasons: string[];
}

export interface PredictionRun {
  id: string;
  at: string;
  batchId: string;
  horizon: string;
  diseaseScope: string;
  districtsScored: number;
  confidence: number;
  environmental: boolean;
  signals: PredictionSignal[];
  alertsGenerated: string[];
  status: 'running' | 'complete';
}

// Case-count thresholds per disease (per week, district level)
export interface Threshold {
  disease: string;
  yellow: number;
  orange: number;
  red: number;
  unit: string;
  updated: string;
}

export interface AlertRules {
  growthEnabled: boolean;
  growthPct: number; // weekly growth % that triggers Orange
  aiEnabled: boolean;
  aiPct: number; // AI probability % that triggers Orange (+20 → Red)
  doublingEnabled: boolean;
  doublingDays: number;
  crossBorderEnabled: boolean;
  rainyEnabled: boolean;
  compoundEnabled: boolean;
  autoEscalateHours: number;
}

export interface SectorProfile {
  name: string;
  district: string;
  baseRisk: Severity;
  population: number;
  facilities: string[];
  chwActive: number;
  chwInactive: number;
  casesThisWeek: number;
  densityPerKm2: number;
  chwCoverage: number; // %
  recommended: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  inst: string;
  dist: string;
  login: string;
  status: 'Active' | 'Inactive' | 'Pending Approval';
  mfa: boolean;
}

export interface PermissionGroup {
  group: string;
  perms: {name: string;vals: boolean[];}[];
}

export interface Announcement {
  id: string;
  at: string;
  title: string;
  body: string;
  audience: string;
  priority: 'normal' | 'important' | 'urgent';
  channels: string[];
  sentBy: string;
  status: 'Sent' | 'Scheduled';
}

export interface Backup {
  id: string;
  at: string;
  type: 'Auto' | 'Manual';
  size: string;
  status: 'Success' | 'Failed' | 'Running';
}

export interface GeneratedReport {
  id: string;
  at: string;
  title: string;
  type: string;
  format: string;
  language: string;
  periodFrom: string;
  periodTo: string;
  district: string;
  sections: string[];
  status: string;
  ok: boolean;
  author: string;
  summary: ReportSummary;
}

export interface ReportSummary {
  alertsTotal: number;
  alertsBySeverity: Record<Severity, number>;
  alertsOpen: number;
  alertsAcknowledged: number;
  alertsResolved: number;
  interventionsTotal: number;
  interventionsCompleted: number;
  investigationsActive: number;
  topDiseases: {name: string;cases: number;}[];
  highlights: string[];
}

export interface Toast {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'warning' | 'error';
}

export interface AnalystFinding {
  id: string;
  at: string;
  source: string; // e.g. 'Correlation Analysis'
  title: string;
  detail: string;
}
