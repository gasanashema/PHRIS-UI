import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  ShieldAlert } from
'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { EpiLayout } from '../../components/epi/EpiLayout';
import { sortAlerts, useApp } from '../../store/AppStore';
import { isOpenStatus, timeAgo } from '../../lib/format';

const DISEASES = ['All priority diseases', 'Cholera', 'Malaria', 'Measles', 'Mpox'];
const PERIODS = ['Last 7 days', 'Last 30 days', 'Year to date'];

// Share of national priority-disease cases by disease (illustrative)
const SHARE: Record<string, number> = {
  'All priority diseases': 1,
  Cholera: 0.09,
  Malaria: 0.46,
  Measles: 0.035,
  Mpox: 0.006
};

const SERIES: Record<string, {label: string;cases: number;}[]> = {
  'Last 7 days': [
  { label: 'Mon', cases: 142 },
  { label: 'Tue', cases: 156 },
  { label: 'Wed', cases: 168 },
  { label: 'Thu', cases: 183 },
  { label: 'Fri', cases: 201 },
  { label: 'Sat', cases: 214 },
  { label: 'Sun', cases: 228 }],

  'Last 30 days': [
  { label: 'Wk 19', cases: 910 },
  { label: 'Wk 20', cases: 960 },
  { label: 'Wk 21', cases: 1040 },
  { label: 'Wk 22', cases: 1150 },
  { label: 'Wk 23', cases: 1240 }],

  'Year to date': [
  { label: 'Jan', cases: 3100 },
  { label: 'Feb', cases: 2900 },
  { label: 'Mar', cases: 4200 },
  { label: 'Apr', cases: 5300 },
  { label: 'May', cases: 5600 },
  { label: 'Jun', cases: 1240 }]

};
const THRESHOLD: Record<string, number> = { 'Last 7 days': 120, 'Last 30 days': 900, 'Year to date': 4000 };
const TOTAL: Record<string, number> = { 'Last 7 days': 1240, 'Last 30 days': 5300, 'Year to date': 22340 };

export function EpiSurveillance() {
  const { state } = useApp();
  const [disease, setDisease] = useState('All priority diseases');
  const [period, setPeriod] = useState('Last 7 days');

  const share = SHARE[disease];
  const trendData = useMemo(
    () =>
    SERIES[period].map((p) => ({
      day: p.label,
      cases: Math.max(0, Math.round(p.cases * share)),
      threshold: Math.round(THRESHOLD[period] * share)
    })),
    [period, share]
  );
  const last = trendData[trendData.length - 1];
  const above = last.threshold ? Math.round((last.cases / last.threshold - 1) * 100) : 0;

  const alerts = sortAlerts(
    state.alerts.filter(
      (a) => isOpenStatus(a.status) && (disease === 'All priority diseases' || a.disease === disease)
    ),
    'severity'
  );
  const signals = alerts.filter((a) => a.severity !== 'yellow');
  const outbreaks = alerts.filter((a) => a.severity === 'red');

  return (
    <EpiLayout
      title="Disease Surveillance"
      subtitle="National case signals, reporting completeness, and priority outbreak detection"
      breadcrumb="Disease Surveillance">

      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
            Disease
            <select
              value={disease}
              onChange={(event) => setDisease(event.target.value)}
              className="h-9 rounded-md border border-border bg-white px-3 text-[13px] text-epi-text outline-none focus:border-epi">

              {DISEASES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
            Period
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-9 rounded-md border border-border bg-white px-3 text-[13px] text-epi-text outline-none focus:border-epi">

              {PERIODS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-epi-accent/30 bg-epi-accent/10 px-3 py-1.5 text-[12px] font-bold text-epi-accent">
          <CheckCircle2 className="h-4 w-4" />
          Data processed {timeAgo(state.pipeline.lastRunAt)}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="New cases reported"
          value={Math.round(TOTAL[period] * share).toLocaleString('en-US')}
          detail={`${disease === 'All priority diseases' ? 'Across 12 monitored diseases' : disease} · ${period.toLowerCase()}`} />

        <MetricCard icon={ShieldAlert} label="Priority signals" value={String(signals.length)} detail="Orange/red alerts requiring review" tone="amber" />
        <MetricCard icon={MapPin} label="Reporting facilities" value="94.8%" detail="1,428 of 1,507 facilities" tone="success" />
        <MetricCard
          icon={AlertTriangle}
          label="Active outbreaks (red)"
          value={String(outbreaks.length)}
          detail={outbreaks.map((a) => `${a.disease} in ${a.district}`).join('; ') || 'None at red level'}
          tone="red" />

      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="rounded-lg border border-border bg-white p-5 shadow-card">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-epi-text">
                {disease === 'All priority diseases' ? 'National priority disease trend' : `${disease} — national trend`}
              </h2>
              <p className="mt-1 text-[13px] text-epi-muted">Cases reported versus the alert threshold · {period.toLowerCase()}</p>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ${above > 0 ? 'bg-epi-amber/10 text-epi-amber' : 'bg-epi-accent/10 text-epi-accent'}`}>

              <ArrowUpRight className="h-3.5 w-3.5" /> {above > 0 ? `${above}% above threshold` : 'Within threshold'}
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="surveillanceCases" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#104E49" stopOpacity={0.34} />
                    <stop offset="100%" stopColor="#104E49" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                  cursor={{ stroke: '#9CA3AF', strokeDasharray: '3 3' }} />

                <Area type="monotone" dataKey="threshold" stroke="#F59E0B" strokeDasharray="5 4" fill="none" strokeWidth={2} name="Alert threshold" />
                <Area type="monotone" dataKey="cases" stroke="#104E49" fill="url(#surveillanceCases)" strokeWidth={3} name="Reported cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-bold text-epi-text">Priority signals</h2>
            <p className="mt-1 text-[13px] text-epi-muted">Open alerts sorted by severity</p>
          </div>
          <div className="divide-y divide-border">
            {alerts.length === 0 &&
            <div className="p-6 text-center text-[13px] text-epi-muted">No open alerts for {disease}.</div>
            }
            {alerts.slice(0, 5).map((a) => {
              const isRed = a.severity === 'red';
              return (
                <Link key={a.id} to={`/warning/detail?id=${a.id}`} className="block p-4 hover:bg-epi-bg/40">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[14px] font-bold text-epi-text">{a.disease}</h3>
                      <p className="mt-0.5 text-[12px] text-epi-muted">
                        {a.sector ? `${a.sector}, ` : ''}{a.district} District
                      </p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[11px] font-bold ${isRed ? 'bg-epi-red/10 text-epi-red' : 'bg-epi-amber/10 text-epi-amber'}`}>
                      {a.change}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[12px]">
                    <span className="font-bold text-epi-text">{a.cases} cases</span>
                    <span className={isRed ? 'font-medium text-epi-red' : 'font-medium text-epi-amber'}>
                      {a.status === 'active' ? 'Awaiting acknowledgement' : a.status === 'escalated' ? `Escalated — ${a.escalatedTo?.split(' (')[0]}` : 'Response in progress'}
                    </span>
                  </div>
                </Link>);

            })}
          </div>
        </div>
      </section>
    </EpiLayout>);

}

interface MetricCardProps {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  tone?: 'amber' | 'red' | 'success';
}

function MetricCard({ icon: Icon, label, value, detail, tone }: MetricCardProps) {
  const toneClass = tone === 'red' ?
  'bg-epi-red/10 text-epi-red' :
  tone === 'amber' ?
  'bg-epi-amber/10 text-epi-amber' :
  tone === 'success' ?
  'bg-epi-accent/10 text-epi-accent' :
  'bg-epi/10 text-epi';

  return (
    <article className="rounded-lg border border-border bg-white p-5 shadow-card">
      <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-md ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[13px] font-medium text-epi-muted">{label}</p>
      <p className="mt-1 text-[26px] font-bold leading-none text-epi-text">{value}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-epi-muted">{detail}</p>
    </article>);

}
