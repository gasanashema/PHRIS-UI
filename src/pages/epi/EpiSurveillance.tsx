import React, { useState } from 'react';
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

const trendData = [
{ day: 'Mon', cases: 142, threshold: 120 },
{ day: 'Tue', cases: 156, threshold: 120 },
{ day: 'Wed', cases: 168, threshold: 120 },
{ day: 'Thu', cases: 183, threshold: 120 },
{ day: 'Fri', cases: 201, threshold: 120 },
{ day: 'Sat', cases: 214, threshold: 120 },
{ day: 'Sun', cases: 228, threshold: 120 }];


const signals = [
{
  disease: 'Cholera',
  location: 'Rusizi District',
  cases: '87 cases',
  change: '+45%',
  status: 'Outbreak threshold exceeded',
  tone: 'red'
},
{
  disease: 'Malaria',
  location: 'Kayonza District',
  cases: '450 cases',
  change: '+12%',
  status: 'Accelerating above baseline',
  tone: 'amber'
},
{
  disease: 'Mpox',
  location: 'Rubavu District',
  cases: '3 suspected cases',
  change: '+200%',
  status: 'Border surveillance signal',
  tone: 'amber'
}];


export function EpiSurveillance() {
  const [disease, setDisease] = useState('All priority diseases');
  const [period, setPeriod] = useState('Last 7 days');

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
              
              <option>All priority diseases</option>
              <option>Cholera</option>
              <option>Malaria</option>
              <option>Measles</option>
              <option>Mpox</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] font-medium text-epi-muted">
            Period
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-9 rounded-md border border-border bg-white px-3 text-[13px] text-epi-text outline-none focus:border-epi">
              
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Year to date</option>
            </select>
          </label>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-epi-accent/30 bg-epi-accent/10 px-3 py-1.5 text-[12px] font-bold text-epi-accent">
          <CheckCircle2 className="h-4 w-4" />
          Data refreshed 8 minutes ago
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Activity} label="New cases reported" value="1,240" detail="Across 12 monitored diseases" />
        <MetricCard icon={ShieldAlert} label="Priority signals" value="3" detail="Require epidemiologist review" tone="amber" />
        <MetricCard icon={MapPin} label="Reporting facilities" value="94.8%" detail="1,428 of 1,507 facilities" tone="success" />
        <MetricCard icon={AlertTriangle} label="Active outbreaks" value="2" detail="Cholera in Rusizi; malaria in Kayonza" tone="red" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="rounded-lg border border-border bg-white p-5 shadow-card">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-epi-text">National priority disease trend</h2>
              <p className="mt-1 text-[13px] text-epi-muted">
                Cases reported versus the national alert threshold
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-epi-amber/10 px-2.5 py-1 text-[12px] font-bold text-epi-amber">
              <ArrowUpRight className="h-3.5 w-3.5" /> 14% above baseline
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
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
            <p className="mt-1 text-[13px] text-epi-muted">Sorted by urgency and recent acceleration</p>
          </div>
          <div className="divide-y divide-border">
            {signals.map((signal) => {
              const isRed = signal.tone === 'red';
              return (
                <article key={signal.disease} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[14px] font-bold text-epi-text">{signal.disease}</h3>
                      <p className="mt-0.5 text-[12px] text-epi-muted">{signal.location}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[11px] font-bold ${isRed ? 'bg-epi-red/10 text-epi-red' : 'bg-epi-amber/10 text-epi-amber'}`}>
                      {signal.change}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[12px]">
                    <span className="font-bold text-epi-text">{signal.cases}</span>
                    <span className={isRed ? 'font-medium text-epi-red' : 'font-medium text-epi-amber'}>{signal.status}</span>
                  </div>
                </article>);

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