// Seed data for the AI Vital demo store.
// This is the single source of truth for mock data that is shared across
// screens. Values are consolidated from the original static screens so that
// the same alert / district / user reads identically everywhere.
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
  Intervention,
  Investigation,
  PermissionGroup,
  PipelineState,
  PredictionRun,
  ProcessingJob,
  Role,
  SectorProfile,
  SyncLogEntry,
  Threshold,
  User } from
'../types';

// ---------------------------------------------------------------------------
// Personas (one per demo account)
// ---------------------------------------------------------------------------
export const PERSONAS: Record<Role, User> = {
  admin: {
    id: 'u-admin',
    name: 'Claudine Ingabire',
    initials: 'CI',
    email: 'admin@rbc.gov.rw',
    role: 'admin',
    roleLabel: 'System Administrator',
    institution: 'Rwanda Biomedical Centre',
    district: 'National',
    phone: '788 100 200',
    professionalId: 'RBC-ADM-2023-04'
  },
  dho: {
    id: 'u-dho',
    name: 'Emmanuel Nkurunziza',
    initials: 'EN',
    email: 'dho@huye.gov.rw',
    role: 'dho',
    roleLabel: 'District Health Officer',
    institution: 'Huye District Health Office',
    district: 'Huye',
    phone: '788 432 118',
    professionalId: 'HUYE-DHO-2022-11'
  },
  epi: {
    id: 'u-epi',
    name: 'Dr. Jean Paul Habimana',
    initials: 'JH',
    email: 'epi@rbc.gov.rw',
    role: 'epi',
    roleLabel: 'Epidemiologist',
    institution: 'Rwanda Biomedical Centre',
    district: 'National',
    phone: '788 123 456',
    professionalId: 'RBC-EPI-2024-89'
  },
  analyst: {
    id: 'u-analyst',
    name: 'Aline Uwimana',
    initials: 'AU',
    email: 'analyst@moh.gov.rw',
    role: 'analyst',
    roleLabel: 'Public Health Analyst',
    institution: 'Ministry of Health',
    district: 'National',
    phone: '788 555 031',
    professionalId: 'MOH-PHA-2023-17'
  },
  integration: {
    id: 'u-integration',
    name: 'Celestin Nzeyimana',
    initials: 'CN',
    email: 'integration@rbc.gov.rw',
    role: 'integration',
    roleLabel: 'Data Integration Engineer',
    institution: 'Rwanda Biomedical Centre',
    district: 'National',
    phone: '788 902 764',
    professionalId: 'RBC-DIE-2024-02'
  }
};

export const ROLE_HOME: Record<Role, string> = {
  admin: '/admin',
  dho: '/dho',
  epi: '/epi',
  analyst: '/analyst',
  integration: '/integration'
};

// ---------------------------------------------------------------------------
// Geography
// ---------------------------------------------------------------------------
export const DISTRICT_PROVINCE: Record<string, string> = {
  Gasabo: 'Kigali',
  Kicukiro: 'Kigali',
  Nyarugenge: 'Kigali',
  Burera: 'Northern',
  Gakenke: 'Northern',
  Gicumbi: 'Northern',
  Musanze: 'Northern',
  Rulindo: 'Northern',
  Gisagara: 'Southern',
  Huye: 'Southern',
  Kamonyi: 'Southern',
  Muhanga: 'Southern',
  Nyamagabe: 'Southern',
  Nyanza: 'Southern',
  Nyaruguru: 'Southern',
  Ruhango: 'Southern',
  Bugesera: 'Eastern',
  Gatsibo: 'Eastern',
  Kayonza: 'Eastern',
  Kirehe: 'Eastern',
  Ngoma: 'Eastern',
  Nyagatare: 'Eastern',
  Rwamagana: 'Eastern',
  Karongi: 'Western',
  Ngororero: 'Western',
  Nyabihu: 'Western',
  Nyamasheke: 'Western',
  Rubavu: 'Western',
  Rusizi: 'Western',
  Rutsiro: 'Western'
};

export const DISTRICTS = Object.keys(DISTRICT_PROVINCE).sort();

export const DISEASES = [
'Cholera',
'Malaria',
'Measles',
'Typhoid',
'Diarrheal Disease',
'Mpox',
'Malnutrition',
'Respiratory',
'COVID-19',
'VHF'];


export const HUYE_SECTORS: SectorProfile[] = [
{
  name: 'Tumba',
  district: 'Huye',
  baseRisk: 'yellow',
  population: 28450,
  facilities: ['Tumba HC'],
  chwActive: 3,
  chwInactive: 0,
  casesThisWeek: 38,
  densityPerKm2: 1120,
  chwCoverage: 92,
  recommended:
  'Deploy oral rehydration supplies. Inspect water sources. Alert community health workers.'
},
{
  name: 'Ngoma',
  district: 'Huye',
  baseRisk: 'yellow',
  population: 31200,
  facilities: ['Ngoma HC'],
  chwActive: 4,
  chwInactive: 1,
  casesThisWeek: 87,
  densityPerKm2: 980,
  chwCoverage: 84,
  recommended:
  'Distribute bed nets to households without coverage. Confirm spray campaign schedule.'
},
{
  name: 'Maraba',
  district: 'Huye',
  baseRisk: 'orange',
  population: 26800,
  facilities: ['Maraba HC'],
  chwActive: 3,
  chwInactive: 1,
  casesThisWeek: 24,
  densityPerKm2: 640,
  chwCoverage: 78,
  recommended:
  'Monitor diarrheal cases daily. Check latrine and water point hygiene near the market.'
},
{
  name: 'Huye',
  district: 'Huye',
  baseRisk: 'orange',
  population: 52300,
  facilities: ['Huye District Hospital', 'CHUB'],
  chwActive: 6,
  chwInactive: 0,
  casesThisWeek: 29,
  densityPerKm2: 2140,
  chwCoverage: 95,
  recommended:
  'Urban malaria vector control. Reinforce referral readiness at CHUB.'
},
{
  name: 'Mukura',
  district: 'Huye',
  baseRisk: 'green',
  population: 22100,
  facilities: ['Mukura Health Post'],
  chwActive: 2,
  chwInactive: 1,
  casesThisWeek: 6,
  densityPerKm2: 510,
  chwCoverage: 71,
  recommended:
  'Organize measles catch-up vaccination. Follow up with families of unvaccinated children.'
},
{
  name: 'Kinazi',
  district: 'Huye',
  baseRisk: 'yellow',
  population: 19800,
  facilities: ['Kinazi Health Post'],
  chwActive: 2,
  chwInactive: 1,
  casesThisWeek: 11,
  densityPerKm2: 470,
  chwCoverage: 74,
  recommended: 'Ensure facility submits weekly report. Routine surveillance.'
},
{
  name: 'Sovu',
  district: 'Huye',
  baseRisk: 'green',
  population: 18200,
  facilities: ['Sovu Health Post'],
  chwActive: 2,
  chwInactive: 0,
  casesThisWeek: 3,
  densityPerKm2: 430,
  chwCoverage: 88,
  recommended: 'Routine surveillance.'
},
{
  name: 'Mbazi',
  district: 'Huye',
  baseRisk: 'green',
  population: 24900,
  facilities: ['Mbazi HC'],
  chwActive: 3,
  chwInactive: 0,
  casesThisWeek: 4,
  densityPerKm2: 560,
  chwCoverage: 90,
  recommended: 'Routine surveillance.'
},
{
  name: 'Ruhashya',
  district: 'Huye',
  baseRisk: 'green',
  population: 21400,
  facilities: ['Ruhashya Health Post'],
  chwActive: 2,
  chwInactive: 0,
  casesThisWeek: 2,
  densityPerKm2: 410,
  chwCoverage: 86,
  recommended: 'Routine surveillance.'
}];


// ---------------------------------------------------------------------------
// Alerts — one consolidated national list
// ---------------------------------------------------------------------------
const a = (x: Omit<Alert, 'province'>): Alert => ({
  ...x,
  province: DISTRICT_PROVINCE[x.district] ?? 'Unknown'
});

export const SEED_ALERTS: Alert[] = [
a({
  id: 'ALT-2026-051',
  disease: 'Cholera',
  district: 'Huye',
  sector: 'Tumba',
  severity: 'red',
  status: 'active',
  triggeredAt: '2026-06-03T06:14:00',
  probability: 82,
  cases: 38,
  threshold: 20,
  change: '+340%',
  source: 'AI prediction',
  reasons: [
  'Cases increased 340% week-over-week',
  'Outbreak probability: 82%',
  'R0 = 2.3 (rapidly spreading)',
  'Rainy season — cholera risk multiplier active',
  'WASAC flagged water quality issue in Tumba on June 1'],

  actions: [
  { id: 'a1', label: 'Deploy ORS and chlorine tablets to Tumba Health Center', phase: 'immediate', done: false },
  { id: 'a2', label: 'Inspect all water sources in Tumba Sector', phase: 'immediate', done: false },
  { id: 'a3', label: 'Alert and brief CHWs in Tumba', phase: 'immediate', done: false },
  { id: 'a4', label: 'Conduct active case search in Tumba households', phase: 'short', done: false },
  { id: 'a5', label: 'Set up oral rehydration point at Tumba market', phase: 'short', done: false }],

  timeline: [
  { at: '2026-06-03T06:14:00', author: 'AI Vital', text: 'Alert generated by the prediction engine (probability 82%).', kind: 'system' },
  { at: '2026-06-03T06:14:30', author: 'AI Vital', text: 'SMS and email sent to Emmanuel Nkurunziza (Huye DHO).', kind: 'system' }]

}),
a({
  id: 'ALT-2026-049',
  disease: 'Malaria',
  district: 'Huye',
  sector: 'Ngoma',
  severity: 'orange',
  status: 'acknowledged',
  triggeredAt: '2026-06-04T07:40:00',
  probability: 71,
  cases: 87,
  threshold: 50,
  change: '+18%',
  source: 'Threshold rule',
  reasons: [
  '87 cases this week vs sector threshold of 50',
  'AI probability 71% > 60% rule',
  'Rainy season multiplier active'],

  actions: [
  { id: 'a1', label: 'Contact Ngoma Health Center in-charge', phase: 'immediate', done: true },
  { id: 'a2', label: 'Request indoor residual spray campaign', phase: 'immediate', done: true },
  { id: 'a3', label: 'Distribute bed nets to uncovered households', phase: 'short', done: false }],

  timeline: [
  { at: '2026-06-04T07:40:00', author: 'AI Vital', text: 'Alert generated: weekly case threshold crossed.', kind: 'system' },
  { at: '2026-06-04T09:22:00', author: 'Emmanuel Nkurunziza', text: 'Alert acknowledged.', kind: 'status' },
  { at: '2026-06-04T09:25:00', author: 'Emmanuel Nkurunziza', text: 'Contacted Ngoma HC. Spray campaign requested for June 7.', kind: 'note' }],

  acknowledgedBy: 'Emmanuel Nkurunziza',
  acknowledgedAt: '2026-06-04T09:22:00'
}),
a({
  id: 'ALT-2026-047',
  disease: 'Measles',
  district: 'Huye',
  sector: 'Mukura',
  severity: 'yellow',
  status: 'acknowledged',
  triggeredAt: '2026-06-02T11:05:00',
  probability: 44,
  cases: 4,
  threshold: 3,
  change: '+33%',
  source: 'Threshold rule',
  reasons: [
  'Measles vaccination coverage 61% vs 95% target',
  '4 suspected cases this week (yellow threshold: 3)'],

  actions: [
  { id: 'a1', label: 'Organize catch-up vaccination outreach', phase: 'short', done: true },
  { id: 'a2', label: 'Trace contacts of suspected cases', phase: 'immediate', done: true }],

  timeline: [
  { at: '2026-06-02T11:05:00', author: 'AI Vital', text: 'Alert generated: low vaccination coverage.', kind: 'system' },
  { at: '2026-06-02T11:30:00', author: 'Emmanuel Nkurunziza', text: 'Alert acknowledged.', kind: 'status' }],

  acknowledgedBy: 'Emmanuel Nkurunziza',
  acknowledgedAt: '2026-06-02T11:30:00'
}),
a({
  id: 'ALT-2026-001',
  disease: 'Cholera',
  district: 'Rusizi',
  sector: 'Bugarama',
  severity: 'red',
  status: 'escalated',
  triggeredAt: '2026-06-03T09:15:00',
  probability: 91,
  cases: 87,
  threshold: 50,
  change: '+45%',
  source: 'AI prediction',
  reasons: [
  'Cases (87) > Red threshold (50)',
  'Growth rate (+45%) > 30% rule',
  'AI probability (91%) > 60% rule',
  'Water quality (2/10) < 5/10',
  'Doubling time (4.2 days) < 5 days'],

  actions: [
  { id: 'a1', label: 'Deploy ORS to Bugarama HC', phase: 'immediate', done: true },
  { id: 'a2', label: 'Dispatch water inspection team', phase: 'immediate', done: true },
  { id: 'a3', label: 'Open outbreak investigation', phase: 'immediate', done: true },
  { id: 'a4', label: 'Cross-border coordination with DRC health authorities', phase: 'short', done: false }],

  timeline: [
  { at: '2026-06-03T09:15:00', author: 'AI Vital', text: 'Alert generated — 5 of 5 trigger rules met.', kind: 'system' },
  { at: '2026-06-03T10:30:00', author: 'Rusizi DHO', text: 'Alert acknowledged.', kind: 'status' },
  { at: '2026-06-03T10:35:00', author: 'Rusizi DHO', text: 'ORS deployed to Bugarama HC. Water inspection team dispatched.', kind: 'note' },
  { at: '2026-06-03T14:00:00', author: 'Rusizi DHO', text: 'Escalated to RBC Epidemiology (Level 3).', kind: 'status' }],

  acknowledgedBy: 'Rusizi DHO',
  acknowledgedAt: '2026-06-03T10:30:00',
  escalatedTo: 'RBC Epidemiology (Level 3)',
  escalatedAt: '2026-06-03T14:00:00',
  investigationId: 'INV-2026-003'
}),
a({
  id: 'ALT-2026-002',
  disease: 'Malaria',
  district: 'Kayonza',
  sector: 'Rwinkwavu',
  severity: 'red',
  status: 'acknowledged',
  triggeredAt: '2026-06-04T14:22:00',
  probability: 84,
  cases: 450,
  threshold: 300,
  change: '+12%',
  source: 'AI prediction',
  reasons: [
  'Cases (450) > Orange threshold (300)',
  'AI probability (84%) > 80% red rule',
  'Rainy season multiplier active'],

  actions: [
  { id: 'a1', label: 'Indoor residual spraying in Rwinkwavu', phase: 'immediate', done: true },
  { id: 'a2', label: 'Stock check of antimalarials at district pharmacy', phase: 'short', done: false }],

  timeline: [
  { at: '2026-06-04T14:22:00', author: 'AI Vital', text: 'Alert generated by the prediction engine (probability 84%).', kind: 'system' },
  { at: '2026-06-04T15:47:00', author: 'Kayonza DHO', text: 'Alert acknowledged.', kind: 'status' }],

  acknowledgedBy: 'Kayonza DHO',
  acknowledgedAt: '2026-06-04T15:47:00',
  investigationId: 'INV-2026-002'
}),
a({
  id: 'ALT-2026-003',
  disease: 'Measles',
  district: 'Gicumbi',
  sector: 'Mukarange',
  severity: 'orange',
  status: 'active',
  triggeredAt: '2026-06-04T16:00:00',
  probability: 64,
  cases: 12,
  threshold: 10,
  change: '+50%',
  source: 'Threshold rule',
  reasons: ['Cases (12) > Orange threshold (10)', 'Growth rate (+50%) > 30% rule'],
  actions: [
  { id: 'a1', label: 'Isolate suspected cases', phase: 'immediate', done: false },
  { id: 'a2', label: 'Ring vaccination around confirmed cases', phase: 'short', done: false }],

  timeline: [
  { at: '2026-06-04T16:00:00', author: 'AI Vital', text: 'Alert generated: weekly case threshold crossed.', kind: 'system' },
  { at: '2026-06-04T16:00:30', author: 'AI Vital', text: 'SMS sent to Gicumbi DHO — no response yet.', kind: 'system' }]

}),
a({
  id: 'ALT-2026-006',
  disease: 'Malaria',
  district: 'Bugesera',
  severity: 'orange',
  status: 'acknowledged',
  triggeredAt: '2026-06-05T08:30:00',
  probability: 72,
  cases: 340,
  threshold: 300,
  change: '+9%',
  source: 'AI prediction',
  reasons: ['Cases (340) > Orange threshold (300)', 'AI probability (72%) > 60% rule'],
  actions: [{ id: 'a1', label: 'Bed net distribution in wetland villages', phase: 'short', done: false }],
  timeline: [
  { at: '2026-06-05T08:30:00', author: 'AI Vital', text: 'Alert generated by the prediction engine.', kind: 'system' },
  { at: '2026-06-05T09:10:00', author: 'Bugesera DHO', text: 'Alert acknowledged.', kind: 'status' }],

  acknowledgedBy: 'Bugesera DHO',
  acknowledgedAt: '2026-06-05T09:10:00'
}),
a({
  id: 'ALT-2026-008',
  disease: 'Typhoid',
  district: 'Nyamagabe',
  severity: 'orange',
  status: 'acknowledged',
  triggeredAt: '2026-06-05T10:05:00',
  probability: 61,
  cases: 34,
  threshold: 30,
  change: '+21%',
  source: 'Threshold rule',
  reasons: ['Cases (34) > Orange threshold (30)'],
  actions: [{ id: 'a1', label: 'Test drinking water at affected villages', phase: 'immediate', done: false }],
  timeline: [
  { at: '2026-06-05T10:05:00', author: 'AI Vital', text: 'Alert generated: weekly case threshold crossed.', kind: 'system' },
  { at: '2026-06-05T11:02:00', author: 'Nyamagabe DHO', text: 'Alert acknowledged.', kind: 'status' }],

  acknowledgedBy: 'Nyamagabe DHO',
  acknowledgedAt: '2026-06-05T11:02:00'
}),
a({
  id: 'ALT-2026-009',
  disease: 'Mpox',
  district: 'Rubavu',
  severity: 'orange',
  status: 'acknowledged',
  triggeredAt: '2026-06-05T11:20:00',
  probability: 48,
  cases: 3,
  threshold: 3,
  change: '+200%',
  source: 'Cross-border signal',
  reasons: [
  '3 suspected cases (orange threshold: 3)',
  'Active Mpox outbreak reported in Goma, DRC'],

  actions: [{ id: 'a1', label: 'Enhanced screening at Gisenyi border post', phase: 'immediate', done: true }],
  timeline: [
  { at: '2026-06-05T11:20:00', author: 'AI Vital', text: 'Cross-border rule triggered.', kind: 'system' },
  { at: '2026-06-05T11:45:00', author: 'Rubavu DHO', text: 'Alert acknowledged.', kind: 'status' }],

  acknowledgedBy: 'Rubavu DHO',
  acknowledgedAt: '2026-06-05T11:45:00'
}),
...([
['ALT-2026-010', 'Typhoid', 'Nyaruguru', 'active', '2026-06-05T09:40:00', 44, 12, 10],
['ALT-2026-011', 'Diarrheal Disease', 'Nyarugenge', 'acknowledged', '2026-06-05T07:15:00', 41, 96, 80],
['ALT-2026-012', 'Respiratory', 'Musanze', 'acknowledged', '2026-06-04T18:30:00', 40, 61, 50],
['ALT-2026-013', 'Malaria', 'Nyagatare', 'active', '2026-06-05T12:10:00', 42, 128, 100],
['ALT-2026-014', 'Measles', 'Karongi', 'acknowledged', '2026-06-04T13:00:00', 43, 4, 3]] as
const).map(([id, disease, district, status, at, p, cases, th]) =>
a({
  id,
  disease,
  district,
  severity: 'yellow',
  status,
  triggeredAt: at,
  probability: p,
  cases,
  threshold: th,
  change: '+15%',
  source: 'Threshold rule',
  reasons: [`Cases (${cases}) > Yellow threshold (${th})`],
  actions: [{ id: 'a1', label: 'Monitor weekly and verify facility reports', phase: 'short', done: false }],
  timeline: [
  { at, author: 'AI Vital', text: 'Alert generated: weekly case threshold crossed.', kind: 'system' },
  ...(status === 'acknowledged' ?
  [{ at, author: `${district} DHO`, text: 'Alert acknowledged.', kind: 'status' as const }] :
  [])],

  ...(status === 'acknowledged' ?
  { acknowledgedBy: `${district} DHO`, acknowledgedAt: at } :
  {})
})
),
a({
  id: 'ALT-2026-040',
  disease: 'Cholera',
  district: 'Rubavu',
  severity: 'orange',
  status: 'resolved',
  triggeredAt: '2026-05-27T09:00:00',
  probability: 66,
  cases: 22,
  threshold: 20,
  change: '+30%',
  source: 'Threshold rule',
  reasons: ['Cases (22) > Orange threshold (20)'],
  actions: [],
  timeline: [
  { at: '2026-05-27T09:00:00', author: 'AI Vital', text: 'Alert generated.', kind: 'system' },
  { at: '2026-06-05T08:10:00', author: 'Rubavu DHO', text: 'Resolved — no new cases for 7 days.', kind: 'status' }],

  acknowledgedBy: 'Rubavu DHO',
  acknowledgedAt: '2026-05-27T10:00:00',
  closedAt: '2026-06-05T08:10:00',
  closeReason: 'No new cases for 7 days'
}),
a({
  id: 'ALT-2026-042',
  disease: 'Diarrheal Disease',
  district: 'Gasabo',
  severity: 'yellow',
  status: 'resolved',
  triggeredAt: '2026-05-30T12:00:00',
  probability: 42,
  cases: 88,
  threshold: 80,
  change: '+12%',
  source: 'Threshold rule',
  reasons: ['Cases (88) > Yellow threshold (80)'],
  actions: [],
  timeline: [
  { at: '2026-05-30T12:00:00', author: 'AI Vital', text: 'Alert generated.', kind: 'system' },
  { at: '2026-06-05T09:30:00', author: 'Gasabo DHO', text: 'Resolved — cases back below threshold.', kind: 'status' }],

  acknowledgedBy: 'Gasabo DHO',
  acknowledgedAt: '2026-05-30T13:00:00',
  closedAt: '2026-06-05T09:30:00',
  closeReason: 'Cases back below threshold'
}),
a({
  id: 'ALT-2026-044',
  disease: 'Malaria',
  district: 'Kirehe',
  severity: 'yellow',
  status: 'dismissed',
  triggeredAt: '2026-06-01T08:00:00',
  probability: 40,
  cases: 104,
  threshold: 100,
  change: '+4%',
  source: 'Threshold rule',
  reasons: ['Cases (104) > Yellow threshold (100)'],
  actions: [],
  timeline: [
  { at: '2026-06-01T08:00:00', author: 'AI Vital', text: 'Alert generated.', kind: 'system' },
  { at: '2026-06-05T10:15:00', author: 'Kirehe DHO', text: 'Dismissed — duplicate facility report (data error).', kind: 'status' }],

  closedAt: '2026-06-05T10:15:00',
  closeReason: 'Duplicate facility report (data error)'
})];


// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const SEED_NOTIFICATIONS: AppNotification[] = [
{
  id: 'n-1',
  at: '2026-06-03T06:14:30',
  title: 'RED alert — Cholera in Tumba',
  body: 'ALT-2026-051: cases up 340% week-over-week. Outbreak probability 82%. Acknowledge within 4 hours.',
  severity: 'red',
  read: false,
  alertId: 'ALT-2026-051',
  link: '/dho/alerts/ALT-2026-051',
  roles: ['dho', 'epi'],
  district: 'Huye'
},
{
  id: 'n-2',
  at: '2026-06-05T13:05:00',
  title: '12 CHW reports received from Tumba',
  body: 'Community health workers submitted 12 new household reports, including 6 suspected diarrhea cases.',
  severity: 'info',
  read: false,
  link: '/dho/chw-reports',
  roles: ['dho'],
  district: 'Huye'
},
{
  id: 'n-3',
  at: '2026-06-05T09:00:00',
  title: '3 facilities have not reported today',
  body: 'Mukura Health Post, Kinazi Health Post and Maraba Health Center have not submitted today’s report.',
  severity: 'yellow',
  read: true,
  link: '/dho/facilities',
  roles: ['dho'],
  district: 'Huye'
},
{
  id: 'n-4',
  at: '2026-06-04T07:40:30',
  title: 'ORANGE alert — Malaria in Ngoma',
  body: 'ALT-2026-049: 87 cases this week vs threshold of 50.',
  severity: 'orange',
  read: true,
  alertId: 'ALT-2026-049',
  link: '/dho/alerts/ALT-2026-049',
  roles: ['dho'],
  district: 'Huye'
},
{
  id: 'n-5',
  at: '2026-06-02T08:00:00',
  title: 'System Update v2.1',
  body: 'AI Vital has been updated with improved district risk maps and faster report generation.',
  severity: 'info',
  read: true,
  roles: ['admin', 'dho', 'epi', 'analyst', 'integration']
},
{
  id: 'n-6',
  at: '2026-06-04T16:00:30',
  title: 'ORANGE alert pending — Measles in Gicumbi',
  body: 'ALT-2026-003 has not been acknowledged by Gicumbi DHO. Auto-escalation is due.',
  severity: 'orange',
  read: false,
  alertId: 'ALT-2026-003',
  link: '/warning/detail?id=ALT-2026-003',
  roles: ['epi', 'admin']
},
{
  id: 'n-7',
  at: '2026-06-05T04:30:00',
  title: 'Rwanda Met Agency feed disconnected',
  body: 'The weather API has been unreachable since June 2 (SSL certificate expired). Environmental features are missing from predictions.',
  severity: 'red',
  read: false,
  link: '/integration/sources',
  roles: ['integration', 'admin', 'analyst']
},
{
  id: 'n-8',
  at: '2026-06-05T12:10:30',
  title: 'YELLOW alert — Malaria in Nyagatare',
  body: 'ALT-2026-013: 128 cases this week (yellow threshold 100).',
  severity: 'yellow',
  read: false,
  alertId: 'ALT-2026-013',
  link: '/warning/detail?id=ALT-2026-013',
  roles: ['epi', 'analyst']
}];


// ---------------------------------------------------------------------------
// Investigations, interventions
// ---------------------------------------------------------------------------
export const SEED_INVESTIGATIONS: Investigation[] = [
{
  id: 'INV-2026-003',
  alertId: 'ALT-2026-001',
  disease: 'Cholera',
  district: 'Rusizi',
  sector: 'Bugarama',
  lead: 'Dr. Jean Paul Habimana',
  team: ['Dr. Aline Uwimana (MOH)', 'Celestin Nzeyimana (RBC Laboratory)', 'Marie Mukamana (Rusizi DHO)'],
  status: 'active',
  priority: 'Critical',
  openedAt: '2026-06-01T10:00:00',
  cases: 87,
  hypothesis: 'Contaminated water — Ruzizi River water point, Bugarama Sector',
  updates: [
  { at: '2026-06-01T10:00:00', author: 'Dr. Jean Paul Habimana', text: 'Investigation opened. Case definition established.', kind: 'status' },
  { at: '2026-06-02T15:00:00', author: 'Marie Mukamana', text: 'Field team deployed to Bugarama. Initial case mapping completed.', kind: 'note' },
  { at: '2026-06-04T11:00:00', author: 'Dr. Jean Paul Habimana', text: 'Suspected source identified: Ruzizi River water point. Water treatment started.', kind: 'note' }]

},
{
  id: 'INV-2026-002',
  alertId: 'ALT-2026-002',
  disease: 'Malaria',
  district: 'Kayonza',
  sector: 'Rwinkwavu',
  lead: 'Dr. Patrick Bizimana',
  team: ['Kayonza DHO'],
  status: 'active',
  priority: 'High',
  openedAt: '2026-06-04T17:00:00',
  cases: 450,
  hypothesis: 'Vector density increase after heavy rainfall; bed-net coverage gap in Rwinkwavu',
  updates: [
  { at: '2026-06-04T17:00:00', author: 'Dr. Patrick Bizimana', text: 'Investigation opened following red alert.', kind: 'status' }]

},
{
  id: 'INV-2026-001',
  disease: 'Measles',
  district: 'Nyabihu',
  lead: 'Dr. Jean Paul Habimana',
  team: ['Nyabihu DHO'],
  status: 'closed',
  priority: 'Medium',
  openedAt: '2026-05-10T09:00:00',
  cases: 9,
  hypothesis: 'Importation from neighbouring district; low coverage in one cell',
  updates: [
  { at: '2026-05-10T09:00:00', author: 'Dr. Jean Paul Habimana', text: 'Investigation opened.', kind: 'status' },
  { at: '2026-05-24T16:00:00', author: 'Dr. Jean Paul Habimana', text: 'Closed — outbreak contained after ring vaccination.', kind: 'status' }]

}];


export const SEED_INTERVENTIONS: Intervention[] = [
{
  id: 'INT-001',
  date: '2026-06-04T09:00:00',
  due: '2026-06-08T17:00:00',
  action: 'Deployed ORS supplies to Tumba HC',
  disease: 'Cholera',
  sector: 'Tumba',
  district: 'Huye',
  who: 'Emmanuel Nkurunziza',
  status: 'Ongoing',
  outcome: 'Pending evaluation',
  alertId: 'ALT-2026-051'
},
{
  id: 'INT-002',
  date: '2026-06-03T10:00:00',
  due: '2026-06-06T17:00:00',
  action: 'Water source inspection',
  disease: 'Cholera',
  sector: 'Tumba',
  district: 'Huye',
  who: 'WASAC + DHO',
  status: 'Ongoing',
  outcome: '2 of 4 sources inspected',
  alertId: 'ALT-2026-051'
},
{
  id: 'INT-003',
  date: '2026-06-04T10:00:00',
  due: '2026-06-07T17:00:00',
  action: 'Indoor residual spray campaign requested',
  disease: 'Malaria',
  sector: 'Ngoma',
  district: 'Huye',
  who: 'RBC + District',
  status: 'Planned',
  outcome: 'Scheduled for June 7',
  alertId: 'ALT-2026-049'
},
{
  id: 'INT-004',
  date: '2026-05-28T08:00:00',
  action: 'Organized measles vaccination outreach',
  disease: 'Measles',
  sector: 'Mukura',
  district: 'Huye',
  who: 'Mukura Health Center',
  status: 'Completed',
  outcome: '847 children vaccinated',
  alertId: 'ALT-2026-047'
},
{
  id: 'INT-005',
  date: '2026-05-25T08:00:00',
  action: 'Malaria spray campaign',
  disease: 'Malaria',
  sector: 'Ngoma',
  district: 'Huye',
  who: 'RBC + District',
  status: 'Completed',
  outcome: '1,240 households covered'
},
{
  id: 'INT-006',
  date: '2026-05-20T08:00:00',
  due: '2026-06-01T17:00:00',
  action: 'CHW refresher training',
  disease: 'General',
  sector: 'All sectors',
  district: 'Huye',
  who: 'Emmanuel Nkurunziza',
  status: 'Overdue',
  outcome: 'Scheduled for June 1 — not completed'
}];


// ---------------------------------------------------------------------------
// Data sources + integration
// ---------------------------------------------------------------------------
export const SEED_SOURCES: DataSource[] = [
{
  id: 'dhis2',
  name: 'DHIS2 / HMIS',
  shortName: 'DHIS2',
  icon: 'hospital',
  description: 'Hospital & health center reports',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'dhis2.moh.gov.rw/api',
  auth: 'API Key ••••••••••',
  frequency: 'Every 2 hours',
  format: 'JSON',
  coverage: 'Districts: All 30',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-05T13:00:00',
  recordsToday: 4230,
  quality: 99.1,
  health: 98
},
{
  id: 'lab',
  name: 'RBC Laboratory System',
  shortName: 'RBC Lab',
  icon: 'lab',
  description: 'Lab test results & confirmations',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'labsystem.rbc.gov.rw/api',
  auth: 'Username + Password',
  frequency: 'Every 1 hour',
  format: 'JSON',
  coverage: 'National Reference Laboratory + 4 regional labs',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-05T12:45:00',
  recordsToday: 340,
  quality: 98.4,
  health: 95
},
{
  id: 'chw',
  name: 'CHW Mobile Reports',
  shortName: 'CHW App',
  icon: 'phone',
  description: 'Village-level health reports',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'chwapp.moh.gov.rw/api',
  auth: 'API Key',
  frequency: 'Daily 7:00 AM',
  format: 'JSON',
  coverage: '45,000+ community health workers',
  status: 'delayed',
  enabled: true,
  lastSync: '2026-06-05T07:12:00',
  recordsToday: 1240,
  quality: 91.2,
  health: 78,
  warning: '34 failed runs this month — investigate'
},
{
  id: 'nisr',
  name: 'NISR Census Data',
  shortName: 'NISR',
  icon: 'census',
  description: 'Demographics & population figures',
  connection: 'Manual Upload',
  apiType: 'Manual Upload',
  url: '',
  auth: '',
  frequency: 'On upload',
  format: 'Excel / CSV',
  coverage: 'Uploaded by: Jean Paul Habimana',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-02T10:00:00',
  recordsToday: 0,
  quality: 100,
  health: 98
},
{
  id: 'met',
  name: 'Rwanda Met Agency',
  shortName: 'Met Agency',
  icon: 'weather',
  description: 'Rainfall & climate data',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'meteo.gov.rw/api/v2',
  auth: 'API Key',
  frequency: 'Every 6 hours',
  format: 'JSON',
  coverage: 'National weather stations',
  status: 'disconnected',
  enabled: true,
  lastSync: '2026-06-02T04:30:00',
  recordsToday: 0,
  quality: 0,
  health: 45,
  error: 'Connection timeout — SSL certificate expired'
},
{
  id: 'pharmacy',
  name: 'Pharmacy / Rwanda FDA',
  shortName: 'Pharmacy',
  icon: 'pharmacy',
  description: 'Medicine availability & stock',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'api.rwandafda.gov.rw/stock',
  auth: 'OAuth 2.0',
  frequency: 'Every 4 hours',
  format: 'JSON',
  coverage: 'District pharmacies',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-05T11:00:00',
  recordsToday: 890,
  quality: 97.8,
  health: 95
},
{
  id: 'emr',
  name: 'EMR Systems',
  shortName: 'EMR',
  icon: 'emr',
  description: 'Electronic medical records',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'emr.moh.gov.rw/fhir',
  auth: 'OAuth 2.0',
  frequency: 'Every 6 hours',
  format: 'XML → JSON',
  coverage: 'Coverage: 12 of 30 districts',
  status: 'partial',
  enabled: true,
  lastSync: '2026-06-05T09:30:00',
  recordsToday: 2100,
  quality: 84.3,
  health: 84,
  warning: '18 districts not yet on EMR system'
},
{
  id: 'wasac',
  name: 'WASAC',
  shortName: 'WASAC',
  icon: 'water',
  description: 'Water & sanitation coverage',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'data.wasac.rw/api',
  auth: 'API Key',
  frequency: 'Daily 6:00 AM',
  format: 'CSV',
  coverage: 'Water quality tests, all districts',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-05T06:00:00',
  recordsToday: 120,
  quality: 98.0,
  health: 92
},
{
  id: 'minagri',
  name: 'MINAGRI',
  shortName: 'MINAGRI',
  icon: 'agri',
  description: 'Food security & nutrition data',
  connection: 'Automatic API',
  apiType: 'REST API',
  url: 'api.minagri.gov.rw',
  auth: 'API Key',
  frequency: 'Daily 8:00 AM',
  format: 'JSON',
  coverage: 'Crop & food security surveys',
  status: 'active',
  enabled: true,
  lastSync: '2026-06-05T08:00:00',
  recordsToday: 860,
  quality: 96.5,
  health: 92
}];


export const SEED_SYNC_LOG: SyncLogEntry[] = [
{ id: 's-1', at: '2026-06-05T13:00:00', sourceId: 'dhis2', sourceName: 'DHIS2 / HMIS', records: 1410, status: 'success', message: 'Pulled 1,410 facility data values' },
{ id: 's-2', at: '2026-06-05T12:45:00', sourceId: 'lab', sourceName: 'RBC Laboratory System', records: 86, status: 'success', message: 'Pulled 86 lab results' },
{ id: 's-3', at: '2026-06-05T11:00:00', sourceId: 'pharmacy', sourceName: 'Pharmacy / Rwanda FDA', records: 220, status: 'success', message: 'Pulled 220 stock records' },
{ id: 's-4', at: '2026-06-05T09:30:00', sourceId: 'emr', sourceName: 'EMR Systems', records: 700, status: 'partial', message: '18 districts unavailable' },
{ id: 's-5', at: '2026-06-05T07:12:00', sourceId: 'chw', sourceName: 'CHW Mobile Reports', records: 1240, status: 'partial', message: 'Delayed — Nyamagabe batch rejected (mapping)' },
{ id: 's-6', at: '2026-06-05T04:30:00', sourceId: 'met', sourceName: 'Rwanda Met Agency', records: 0, status: 'failed', message: 'Connection timeout — SSL certificate expired' }];


// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------
export const PIPELINE_STAGES = [
{ key: 'ingest', label: 'Raw Data In', desc: 'Records pulled from all enabled sources' },
{ key: 'clean', label: 'Data Cleaning', desc: 'Errors fixed · Duplicates removed · Names standardized' },
{ key: 'metrics', label: 'Metrics Calculated', desc: 'Incidence · CFR · Attack rates · R0 · Doubling time' },
{ key: 'aggregate', label: 'Aggregated', desc: 'Cell → Sector → District → Province → National' },
{ key: 'features', label: 'Feature Engineering', desc: 'AI-ready inputs prepared' },
{ key: 'model', label: 'Sent to AI Model', desc: 'Batch published for risk prediction' }] as
const;

export const SEED_PIPELINE: PipelineState = {
  status: 'complete',
  stageIndex: PIPELINE_STAGES.length - 1,
  progress: 100,
  lastRunAt: '2026-06-05T13:00:00',
  lastBatchId: 'BATCH-0605-1300',
  recordsProcessed: 47230,
  qualityScore: 89,
  staleSources: false
};

export const SEED_JOBS: ProcessingJob[] = [
{ id: 'j-1', at: '2026-06-05T13:00:00', name: 'Data Cleaning', duration: '14 min', records: 12340, status: 'success' },
{ id: 'j-2', at: '2026-06-05T13:00:00', name: 'Metric Calculation', duration: '19 min', records: 12340, status: 'success' },
{ id: 'j-3', at: '2026-06-05T10:00:00', name: 'Feature Engineering', duration: '43 min', records: 47230, status: 'success' },
{ id: 'j-4', at: '2026-06-05T07:00:00', name: 'Trend Analysis', duration: '28 min', records: 47230, status: 'success' },
{ id: 'j-5', at: '2026-06-05T07:00:00', name: 'Geographic Aggregation', duration: '24 min', records: 47230, status: 'success' },
{ id: 'j-6', at: '2026-06-05T04:30:00', name: 'Data Cleaning', duration: '18 min', records: 9840, status: 'failed', detail: 'Kinyarwanda disease name mapping failed — 3 unknown terms (Nyamagabe CHW batch)' },
{ id: 'j-7', at: '2026-06-05T04:30:00', name: 'Met Agency Import', duration: '—', records: 0, status: 'failed', detail: 'Source offline — connection timeout' }];


// ---------------------------------------------------------------------------
// Prediction
// ---------------------------------------------------------------------------
const dr = (
district: string,
disease: string,
score: number,
trend: DistrictRisk['trend'])
: DistrictRisk => ({
  district,
  province: DISTRICT_PROVINCE[district],
  disease,
  score,
  trend,
  confidence: 84
});

export const SEED_DISTRICT_RISK: DistrictRisk[] = [
dr('Rusizi', 'Cholera', 91, 'up'),
dr('Kayonza', 'Malaria', 84, 'up'),
dr('Bugesera', 'Malaria', 72, 'stable'),
dr('Huye', 'Cholera', 68, 'up'),
dr('Nyamagabe', 'Malnutrition', 61, 'stable'),
dr('Gicumbi', 'Measles', 54, 'stable'),
dr('Rubavu', 'Mpox', 48, 'up'),
dr('Nyaruguru', 'Typhoid', 44, 'up'),
dr('Nyagatare', 'Malaria', 42, 'up'),
dr('Karongi', 'Measles', 40, 'stable'),
dr('Nyarugenge', 'Diarrheal Disease', 38, 'stable'),
dr('Musanze', 'Respiratory', 36, 'down'),
dr('Ngororero', 'Cholera', 33, 'up'),
dr('Nyamasheke', 'Cholera', 31, 'stable'),
dr('Kirehe', 'Malaria', 30, 'down'),
dr('Ngoma', 'Malaria', 29, 'stable'),
dr('Gatsibo', 'Malaria', 27, 'stable'),
dr('Gisagara', 'Malaria', 26, 'stable'),
dr('Rwamagana', 'Malaria', 25, 'down'),
dr('Nyanza', 'Typhoid', 24, 'stable'),
dr('Ruhango', 'Typhoid', 22, 'stable'),
dr('Muhanga', 'Respiratory', 21, 'down'),
dr('Kamonyi', 'Respiratory', 20, 'stable'),
dr('Rutsiro', 'Malnutrition', 20, 'stable'),
dr('Nyabihu', 'Measles', 19, 'down'),
dr('Burera', 'Respiratory', 18, 'stable'),
dr('Gakenke', 'Malnutrition', 17, 'stable'),
dr('Rulindo', 'Respiratory', 16, 'down'),
dr('Kicukiro', 'Diarrheal Disease', 15, 'down'),
dr('Gasabo', 'Diarrheal Disease', 14, 'down')];


export const SEED_PREDICTION_RUNS: PredictionRun[] = [
{
  id: 'PRED-0605-1300',
  at: '2026-06-05T13:00:00',
  batchId: 'BATCH-0605-1300',
  horizon: 'Next 14 days',
  diseaseScope: 'All priority diseases',
  districtsScored: 30,
  confidence: 78,
  environmental: false,
  signals: [],
  alertsGenerated: [],
  status: 'complete'
},
{
  id: 'PRED-0605-0700',
  at: '2026-06-05T07:00:00',
  batchId: 'BATCH-0605-0400',
  horizon: 'Next 14 days',
  diseaseScope: 'All priority diseases',
  districtsScored: 30,
  confidence: 77,
  environmental: false,
  signals: [],
  alertsGenerated: ['ALT-2026-006'],
  status: 'complete'
}];


export const SEED_THRESHOLDS: Threshold[] = [
{ disease: 'Cholera', yellow: 5, orange: 20, red: 50, unit: 'Cases/week', updated: 'March 2026' },
{ disease: 'Malaria', yellow: 100, orange: 300, red: 600, unit: 'Cases/week', updated: 'March 2026' },
{ disease: 'Measles', yellow: 3, orange: 10, red: 25, unit: 'Cases/week', updated: 'March 2026' },
{ disease: 'Typhoid', yellow: 10, orange: 30, red: 70, unit: 'Cases/week', updated: 'March 2026' },
{ disease: 'Diarrheal Disease', yellow: 80, orange: 150, red: 300, unit: 'Cases/week', updated: 'March 2026' },
{ disease: 'Malnutrition', yellow: 15, orange: 25, red: 35, unit: '% of children', updated: 'March 2026' },
{ disease: 'Mpox', yellow: 1, orange: 3, red: 8, unit: 'Cases/week', updated: 'May 2026' },
{ disease: 'VHF', yellow: 0, orange: 1, red: 3, unit: 'Cases/week', updated: 'March 2026' },
{ disease: 'COVID-19', yellow: 20, orange: 80, red: 200, unit: 'Cases/week', updated: 'March 2026' }];


export const SEED_RULES: AlertRules = {
  growthEnabled: true,
  growthPct: 30,
  aiEnabled: true,
  aiPct: 60,
  doublingEnabled: true,
  doublingDays: 5,
  crossBorderEnabled: true,
  rainyEnabled: true,
  compoundEnabled: true,
  autoEscalateHours: 4
};

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const SEED_USERS: AdminUser[] = [
{ id: 1, name: 'Jean Paul Habimana', email: 'jp.habimana@rbc.gov.rw', phone: '788 123 456', role: 'Epidemiologist', inst: 'RBC', dist: 'National', login: 'Today 08:22', status: 'Active', mfa: true },
{ id: 2, name: 'Aline Uwimana', email: 'a.uwimana@moh.gov.rw', phone: '788 555 031', role: 'Public Health Analyst', inst: 'MOH', dist: 'National', login: 'Today 07:45', status: 'Active', mfa: true },
{ id: 3, name: 'Emmanuel Nkurunziza', email: 'e.nkurunziza@huye.gov.rw', phone: '788 432 118', role: 'District Health Officer', inst: 'Huye DHO', dist: 'Huye', login: 'Yesterday', status: 'Active', mfa: true },
{ id: 4, name: 'Marie Mukamana', email: 'm.mukamana@musanze.gov.rw', phone: '788 610 204', role: 'District Health Officer', inst: 'Musanze DHO', dist: 'Musanze', login: '3 days ago', status: 'Inactive', mfa: true },
{ id: 5, name: 'Patrick Bizimana', email: 'p.bizimana@rbc.gov.rw', phone: '788 377 900', role: 'Epidemiologist', inst: 'RBC', dist: 'National', login: 'Never', status: 'Pending Approval', mfa: true },
{ id: 6, name: 'Celestin Nzeyimana', email: 'c.nzeyimana@rbc.gov.rw', phone: '788 902 764', role: 'Data Integration Engineer', inst: 'RBC', dist: 'National', login: 'Today 06:58', status: 'Active', mfa: true },
{ id: 7, name: 'Claudine Ingabire', email: 'c.ingabire@rbc.gov.rw', phone: '788 100 200', role: 'Administrator', inst: 'RBC', dist: 'National', login: 'Today 09:02', status: 'Active', mfa: true },
{ id: 8, name: 'Eric Mugisha', email: 'e.mugisha@rusizi.gov.rw', phone: '788 721 540', role: 'District Health Officer', inst: 'Rusizi DHO', dist: 'Rusizi', login: 'Today 10:30', status: 'Active', mfa: true },
{ id: 9, name: 'Grace Uwase', email: 'g.uwase@kayonza.gov.rw', phone: '788 118 332', role: 'District Health Officer', inst: 'Kayonza DHO', dist: 'Kayonza', login: 'Yesterday', status: 'Active', mfa: false },
{ id: 10, name: 'Olivier Ndayisaba', email: 'o.ndayisaba@nisr.gov.rw', phone: '788 404 991', role: 'Public Health Analyst', inst: 'NISR', dist: 'National', login: '5 days ago', status: 'Active', mfa: true },
{ id: 11, name: 'Diane Mukeshimana', email: 'd.mukeshimana@gicumbi.gov.rw', phone: '788 267 150', role: 'District Health Officer', inst: 'Gicumbi DHO', dist: 'Gicumbi', login: '2 days ago', status: 'Active', mfa: false },
{ id: 12, name: 'Samuel Habyarimana', email: 's.habyarimana@rbc.gov.rw', phone: '788 845 612', role: 'Epidemiologist', inst: 'RBC', dist: 'National', login: 'Never', status: 'Pending Approval', mfa: true }];


export const ROLE_COLUMNS = [
'Administrator',
'Epidemiologist',
'Public Health Analyst',
'District Health Officer'];


export const SEED_PERMISSIONS: PermissionGroup[] = [
{
  group: 'DATA ACCESS',
  perms: [
  { name: 'View national-level data', vals: [true, true, true, false] },
  { name: 'View all 30 districts', vals: [true, true, true, false] },
  { name: 'View own district only', vals: [true, true, true, true] },
  { name: 'Access laboratory data', vals: [true, true, true, false] }]

},
{
  group: 'AI & ANALYTICS',
  perms: [
  { name: 'Run AI risk predictions', vals: [true, true, true, false] },
  { name: 'Configure AI models', vals: [true, false, false, false] },
  { name: 'View risk scores', vals: [true, true, true, true] }]

},
{
  group: 'ALERTS',
  perms: [
  { name: 'Receive alerts', vals: [true, true, true, true] },
  { name: 'Configure alert thresholds', vals: [true, true, false, false] },
  { name: 'Acknowledge alerts', vals: [true, true, true, true] },
  { name: 'Escalate alerts', vals: [true, true, false, true] }]

},
{
  group: 'REPORTS',
  perms: [
  { name: 'Generate reports', vals: [true, true, true, true] },
  { name: 'Approve reports', vals: [true, true, false, false] },
  { name: 'Schedule auto-reports', vals: [true, false, false, false] }]

},
{
  group: 'USER & SYSTEM',
  perms: [
  { name: 'Manage users', vals: [true, false, false, false] },
  { name: 'View audit trail', vals: [true, false, false, false] },
  { name: 'System configuration', vals: [true, false, false, false] }]

}];


export const SEED_ANNOUNCEMENTS: Announcement[] = [
{
  id: 'ann-1',
  at: '2026-06-02T08:00:00',
  title: 'System Update v2.1',
  body: 'AI Vital has been updated with improved district risk maps and faster report generation.',
  audience: 'All users',
  priority: 'important',
  channels: ['In-app', 'Email'],
  sentBy: 'Claudine Ingabire',
  status: 'Sent'
},
{
  id: 'ann-2',
  at: '2026-06-01T09:00:00',
  title: 'Monthly Report Reminder',
  body: 'Monthly district reports are due to RBC by June 10.',
  audience: 'Epidemiologists and district officers',
  priority: 'normal',
  channels: ['In-app'],
  sentBy: 'Claudine Ingabire',
  status: 'Sent'
},
{
  id: 'ann-3',
  at: '2026-05-28T16:00:00',
  title: 'RBC Emergency Protocol Activated',
  body: 'The RBC cholera emergency protocol is active for all Western Province districts.',
  audience: 'Epidemiologists + District Officers',
  priority: 'urgent',
  channels: ['In-app', 'Email', 'SMS'],
  sentBy: 'Claudine Ingabire',
  status: 'Sent'
}];


export const SEED_BACKUPS: Backup[] = [
{ id: 'b-1', at: '2026-06-05T03:00:00', type: 'Auto', size: '12.4 GB', status: 'Success' },
{ id: 'b-2', at: '2026-06-04T03:00:00', type: 'Auto', size: '12.1 GB', status: 'Success' },
{ id: 'b-3', at: '2026-06-03T14:15:00', type: 'Manual', size: '12.0 GB', status: 'Success' },
{ id: 'b-4', at: '2026-06-02T03:00:00', type: 'Auto', size: '11.8 GB', status: 'Failed' }];


export const SEED_ACTIVITY: Activity[] = [
{ id: 'act-1', at: '2026-06-05T09:15:22', actor: 'Dr. Jean Paul Habimana', actorEmail: 'jp.habimana@rbc.gov.rw', role: 'Epidemiologist', module: 'Auth', action: 'Logged In', detail: 'Successful login with SMS MFA', ip: '197.243.x.x' },
{ id: 'act-2', at: '2026-06-05T09:22:47', actor: 'Dr. Jean Paul Habimana', actorEmail: 'jp.habimana@rbc.gov.rw', role: 'Epidemiologist', module: 'Reports', action: 'Generated Report — Malaria Weekly', detail: 'PDF, national scope', ip: '197.243.x.x' },
{ id: 'act-3', at: '2026-06-05T10:05:13', actor: 'Claudine Ingabire', actorEmail: 'admin@rbc.gov.rw', role: 'Administrator', module: 'User Mgmt', action: 'Created User — p.bizimana@rbc.gov.rw', detail: 'Role: Epidemiologist (pending approval)', ip: '41.186.x.x' },
{ id: 'act-4', at: '2026-06-05T11:02:00', actor: 'Nyamagabe DHO', actorEmail: 'officer@nyamagabe.gov.rw', role: 'District Officer', module: 'Early Warning', action: 'Acknowledged ORANGE Alert — ALT-2026-008', detail: 'Typhoid, Nyamagabe', ip: '102.90.x.x' },
{ id: 'act-5', at: '2026-06-05T11:45:03', actor: 'unknown', actorEmail: 'unknown@external.com', role: '—', module: 'Auth', action: 'Failed Login Attempt (×3)', detail: 'Blocked after 3 attempts', ip: '91.134.x.x', flagged: true },
{ id: 'act-6', at: '2026-06-05T13:00:00', actor: 'AI Vital', actorEmail: 'system@aivital.rw', role: 'System', module: 'Processing', action: 'Pipeline run completed — BATCH-0605-1300', detail: '47,230 records processed', ip: '—' },
{ id: 'act-7', at: '2026-06-05T13:00:30', actor: 'AI Vital', actorEmail: 'system@aivital.rw', role: 'System', module: 'Prediction', action: 'Prediction run completed — PRED-0605-1300', detail: '30 districts scored, no new alerts', ip: '—' },
{ id: 'act-8', at: '2026-06-04T09:22:00', actor: 'Emmanuel Nkurunziza', actorEmail: 'dho@huye.gov.rw', role: 'District Officer', module: 'Early Warning', action: 'Acknowledged ORANGE Alert — ALT-2026-049', detail: 'Malaria, Ngoma sector', ip: '102.90.x.x', district: 'Huye' }];


export const SEED_REPORTS: GeneratedReport[] = [
{
  id: 'RPT-0602',
  at: '2026-06-02T16:00:00',
  title: 'Weekly Situation Report — Huye District',
  type: 'weekly',
  format: 'PDF',
  language: 'English',
  periodFrom: '2026-05-26',
  periodTo: '2026-06-01',
  district: 'Huye',
  sections: ['Executive Summary', 'Disease Trends', 'Alert Summary', 'Facility Data', 'CHW Activity'],
  status: 'Submitted to RBC',
  ok: true,
  author: 'Emmanuel Nkurunziza',
  summary: {
    alertsTotal: 2,
    alertsBySeverity: { red: 0, orange: 1, yellow: 1, green: 0 },
    alertsOpen: 1,
    alertsAcknowledged: 2,
    alertsResolved: 0,
    interventionsTotal: 3,
    interventionsCompleted: 2,
    investigationsActive: 0,
    topDiseases: [{ name: 'Malaria', cases: 74 }, { name: 'Diarrheal', cases: 30 }],
    highlights: ['Measles catch-up vaccination completed in Mukura (847 children).']
  }
},
{
  id: 'RPT-0601',
  at: '2026-06-01T11:00:00',
  title: 'Disease Outbreak Summary — Huye District',
  type: 'outbreak',
  format: 'PDF',
  language: 'English',
  periodFrom: '2026-05-25',
  periodTo: '2026-06-01',
  district: 'Huye',
  sections: ['Executive Summary', 'Alert Summary', 'Interventions'],
  status: 'Shared with District Mayor',
  ok: true,
  author: 'Emmanuel Nkurunziza',
  summary: {
    alertsTotal: 1,
    alertsBySeverity: { red: 0, orange: 0, yellow: 1, green: 0 },
    alertsOpen: 0,
    alertsAcknowledged: 1,
    alertsResolved: 0,
    interventionsTotal: 2,
    interventionsCompleted: 2,
    investigationsActive: 0,
    topDiseases: [{ name: 'Malaria', cases: 70 }],
    highlights: ['No red alerts in the reporting period.']
  }
},
{
  id: 'RPT-0519',
  at: '2026-05-19T10:00:00',
  title: 'CHW Activity Report — Huye District',
  type: 'chw',
  format: 'PDF',
  language: 'English',
  periodFrom: '2026-05-12',
  periodTo: '2026-05-18',
  district: 'Huye',
  sections: ['Executive Summary', 'CHW Activity'],
  status: 'Not yet submitted',
  ok: false,
  author: 'Emmanuel Nkurunziza',
  summary: {
    alertsTotal: 0,
    alertsBySeverity: { red: 0, orange: 0, yellow: 0, green: 0 },
    alertsOpen: 0,
    alertsAcknowledged: 0,
    alertsResolved: 0,
    interventionsTotal: 1,
    interventionsCompleted: 0,
    investigationsActive: 0,
    topDiseases: [],
    highlights: ['CHW reporting rate 91% across 10 sectors.']
  }
}];
