import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Server,
  Copy,
  Check,
  AlertTriangle,
  FileCode2,
  Activity,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface DataSourceItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  time: string;
  recs: string;
  up: string;
  spark: { v: number }[];
  action: string;
  isRed?: boolean;
}

interface DataSourceDetailsModalProps {
  open: boolean;
  source: DataSourceItem | null;
  onClose: () => void;
  onConfigure: (sourceName: string, isReconnect: boolean) => void;
  /** When provided, “Trigger Sync” runs the shared store sync instead of a local simulation. */
  onSync?: () => void;
}

// Detailed Metadata mapping per source
const SOURCE_DETAILS_MAP: Record<string, {
  category: string;
  owner: string;
  endpoint: string;
  authMethod: string;
  syncFrequency: string;
  latency: string;
  format: string;
  description: string;
  entities: string[];
  recentLogs: { timestamp: string; status: 'success' | 'warning' | 'error'; records: string; duration: string; message: string }[];
}> = {
  'DHIS2 / HMIS': {
    category: 'Aggregate Health Facility Information',
    owner: 'Ministry of Health (MoH) / RBC',
    endpoint: 'https://dhis2.rbc.gov.rw/api/v33/dataValueSets',
    authMethod: 'OAuth 2.0 Bearer Token + mTLS',
    syncFrequency: 'Hourly (Automatic Pull)',
    latency: '124 ms',
    format: 'REST API (JSON / HL7 FHIR)',
    description: 'National aggregate health database collecting routine health facility reports, disease surveillance, and maternal health metrics across all 30 districts of Rwanda.',
    entities: ['Outpatient Consultations', 'Disease Surveillance Reports', 'Maternal & Child Health', 'Facility Staffing Metrics'],
    recentLogs: [
      { timestamp: 'Today, 15:30 CAT', status: 'success', records: '1,204 recs', duration: '1.2s', message: 'Batch sync complete with 0 errors.' },
      { timestamp: 'Today, 14:30 CAT', status: 'success', records: '1,180 recs', duration: '1.1s', message: 'Batch sync complete.' },
      { timestamp: 'Today, 13:30 CAT', status: 'warning', records: '950 recs', duration: '3.4s', message: 'High network latency detected during sync.' },
      { timestamp: 'Today, 12:30 CAT', status: 'success', records: '1,210 recs', duration: '1.0s', message: 'Batch sync complete.' },
    ]
  },
  'RBC National Laboratory': {
    category: 'Diagnostic & Pathological Testing',
    owner: 'Rwanda Biomedical Centre (RBC)',
    endpoint: 'https://lims.rbc.gov.rw/api/v2/results/feed',
    authMethod: 'API Key + IP Whitelisting',
    syncFrequency: 'Real-time Webhook',
    latency: '45 ms',
    format: 'HL7 FHIR v4 JSON',
    description: 'Centralized laboratory information management system tracking epidemic pathogen samples, viral loads, malaria microscopy, and TB GeneXpert diagnostics.',
    entities: ['Pathogen Sample Orders', 'Viral Load Results', 'Malaria Rapid Tests', 'GeneXpert TB Assays'],
    recentLogs: [
      { timestamp: 'Today, 16:15 CAT', status: 'success', records: '347 recs', duration: '0.4s', message: 'Real-time event stream push processed.' },
      { timestamp: 'Today, 15:15 CAT', status: 'success', records: '412 recs', duration: '0.5s', message: 'Stream active.' },
      { timestamp: 'Today, 14:15 CAT', status: 'success', records: '380 recs', duration: '0.4s', message: 'Stream active.' },
    ]
  },
  'CHW Mobile Reports': {
    category: 'Community Health Surveillance',
    owner: 'RBC Community Health Division (SISCom)',
    endpoint: 'https://siscom.moh.gov.rw/api/v1/chw/submissions',
    authMethod: 'Encrypted Mobile Gateway Token',
    syncFrequency: 'Every 15 Minutes',
    latency: '310 ms',
    format: 'JSON Payload',
    description: 'Community health worker reporting network capturing village-level RapidSMS alerts, maternal health registrations, and fever/malaria rapid testing.',
    entities: ['RapidSMS Pregnancy Alerts', 'Community Fever Screening', 'Child Malnutrition Screening', 'Home Visits'],
    recentLogs: [
      { timestamp: 'Today, 11:45 CAT', status: 'warning', records: '89 recs', duration: '4.1s', message: 'Cellular network packet loss in Southern Province.' },
      { timestamp: 'Today, 11:30 CAT', status: 'success', records: '142 recs', duration: '1.8s', message: 'Sync complete.' },
      { timestamp: 'Today, 11:15 CAT', status: 'success', records: '160 recs', duration: '1.6s', message: 'Sync complete.' },
    ]
  },
  'NISR Census & Demographics': {
    category: 'Demographic Baseline & Census',
    owner: 'National Institute of Statistics of Rwanda',
    endpoint: 'https://data.nisr.gov.rw/api/v1/demographics/districts',
    authMethod: 'Public Open Data REST Key',
    syncFrequency: 'Weekly Refresh',
    latency: '85 ms',
    format: 'JSON / GeoJSON',
    description: 'Master district and sector demographic data used as denominators for disease incidence rate calculations per 100,000 population.',
    entities: ['District Population Totals', 'Age & Gender Distributions', 'Population Density Maps', 'Household Estimates'],
    recentLogs: [
      { timestamp: 'Yesterday, 02:00 CAT', status: 'success', records: '30 District Datasets', duration: '0.8s', message: 'Weekly baseline validation passed.' },
      { timestamp: '7 days ago', status: 'success', records: '30 District Datasets', duration: '0.9s', message: 'Weekly sync complete.' },
    ]
  },
  'Rwanda Meteorological Agency': {
    category: 'Climate & Environmental Monitoring',
    owner: 'Meteo Rwanda',
    endpoint: 'https://api.meteorwanda.gov.rw/v1/weather/observations',
    authMethod: 'OAuth 2.0 Client Credentials',
    syncFrequency: 'Hourly Push',
    latency: 'Timeout (5000ms)',
    format: 'JSON / REST API',
    description: 'Meteorological observations feed providing rainfall, humidity, and temperature data required for predictive climate-sensitive disease outbreak models.',
    entities: ['Daily Rainfall (mm)', 'Relative Humidity (%)', 'Mean Surface Temp (°C)', 'Flood Warning Alerts'],
    recentLogs: [
      { timestamp: 'Today, 14:00 CAT', status: 'error', records: '0 recs', duration: '5.0s', message: 'Connection timed out. Remote server unreachable.' },
      { timestamp: 'Yesterday, 14:00 CAT', status: 'error', records: '0 recs', duration: '5.0s', message: 'HTTP 503 Service Unavailable.' },
      { timestamp: '3 days ago', status: 'warning', records: '12 recs', duration: '4.8s', message: 'Partial connection degradation.' },
    ]
  },
  'WASAC (Water & Sanitation)': {
    category: 'Water Quality & Sanitation Monitoring',
    owner: 'Water and Sanitation Corporation (WASAC)',
    endpoint: 'https://monitoring.wasac.rw/api/v1/water-quality',
    authMethod: 'HMAC Signature + TLS 1.3',
    syncFrequency: 'Every 6 Hours',
    latency: '190 ms',
    format: 'JSON Payload',
    description: 'Water treatment and distribution quality monitoring feed used for immediate alerts on waterborne pathogen risks and contamination events.',
    entities: ['Chlorine Residual Levels', 'Turbidity NTU Values', 'E. coli Detection Flags', 'Pumping Station Status'],
    recentLogs: [
      { timestamp: 'Today, 13:00 CAT', status: 'success', records: '56 recs', duration: '1.1s', message: 'Water telemetry ingested successfully.' },
      { timestamp: 'Today, 07:00 CAT', status: 'success', records: '58 recs', duration: '1.2s', message: 'Water telemetry ingested.' },
    ]
  },
  'MINAGRI (Agriculture/Nutrition)': {
    category: 'Food Security & Crop Nutrition',
    owner: 'Ministry of Agriculture and Animal Resources',
    endpoint: 'https://stats.minagri.gov.rw/api/v2/nutrition-security',
    authMethod: 'Bearer Token',
    syncFrequency: 'Daily Ingestion',
    latency: '420 ms',
    format: 'REST API (JSON)',
    description: 'Agricultural yield metrics and household food security index used to forecast child acute malnutrition indicators across vulnerable zones.',
    entities: ['District Crop Yields', 'Household Food Insecurity Index', 'Market Stalls Price Index', 'Livestock Disease Status'],
    recentLogs: [
      { timestamp: 'Today, 09:00 CAT', status: 'warning', records: '12 recs', duration: '3.2s', message: 'Delayed transmission from Eastern Province nodes.' },
      { timestamp: 'Yesterday, 09:00 CAT', status: 'success', records: '24 recs', duration: '1.5s', message: 'Daily update success.' },
    ]
  },
  'Electronic Medical Records (EMR)': {
    category: 'Clinical Facility Records (RwandaEMR)',
    owner: 'RBC Digital Health Division',
    endpoint: 'https://emr-gateway.moh.gov.rw/fhir/r4',
    authMethod: 'OAuth 2.0 / SMART on FHIR',
    syncFrequency: 'Real-time FHIR Feed',
    latency: '68 ms',
    format: 'HL7 FHIR v4 / JSON',
    description: 'Direct clinical encounter telemetry from district and referral hospitals across Rwanda tracking inpatient diagnoses, ICU admissions, and prescriptions.',
    entities: ['Patient Encounters (ICD-11)', 'Hospital Admissions & Discharges', 'ICU Bed Availability', 'Diagnostic Orders'],
    recentLogs: [
      { timestamp: 'Today, 14:45 CAT', status: 'success', records: '892 recs', duration: '0.6s', message: 'FHIR bundle stream synced.' },
      { timestamp: 'Today, 13:45 CAT', status: 'success', records: '810 recs', duration: '0.5s', message: 'FHIR bundle stream synced.' },
    ]
  },
  'Pharmacy & Medicine Dispensing': {
    category: 'Pharmaceutical Supply & Commodities',
    owner: 'Rwanda Medical Supply (RMS)',
    endpoint: 'https://elmis.rms.gov.rw/api/v1/stock-dispensing',
    authMethod: 'API Key + Mutual TLS',
    syncFrequency: 'Every 2 Hours',
    latency: '110 ms',
    format: 'JSON REST Feed',
    description: 'National e-LMIS logistics feed monitoring essential medicine stock levels, antimalarial dispensations, and vaccine cold-chain inventory.',
    entities: ['Antimalarial Drug Stockouts', 'Antibiotic Dispensing Rates', 'Vaccine Cold-Chain Temps', 'Facility Reorder Alerts'],
    recentLogs: [
      { timestamp: 'Today, 15:00 CAT', status: 'success', records: '234 recs', duration: '0.9s', message: 'Stock dispensing sync complete.' },
      { timestamp: 'Today, 13:00 CAT', status: 'success', records: '210 recs', duration: '0.8s', message: 'Stock dispensing sync complete.' },
    ]
  }
};

export function DataSourceDetailsModal({
  open,
  source,
  onClose,
  onConfigure,
  onSync
}: DataSourceDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'schema'>('overview');
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  if (!open || !source) return null;

  const detail = SOURCE_DETAILS_MAP[source.name] || {
    category: 'Health Data Source',
    owner: 'Ministry of Health Rwanda',
    endpoint: `https://api.health.gov.rw/v1/${source.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    authMethod: 'OAuth 2.0 / API Token',
    syncFrequency: 'Hourly Automatic Sync',
    latency: '150 ms',
    format: 'JSON / REST API',
    description: 'Health information system connected to Rwanda PHRIS data exchange pipeline.',
    entities: ['Clinical Records', 'Demographic Reports', 'System Status Logs'],
    recentLogs: [
      { timestamp: 'Today, 15:00 CAT', status: 'success', records: source.recs, duration: '1.2s', message: 'Normal sync completed successfully.' }
    ]
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(detail.endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerSync = () => {
    if (onSync) {
      onSync();
      setSyncToast(source.isRed ? 'Sync attempted — the source is disconnected. Use Reconnect.' : 'Sync started — progress is shown on the source card.');
      setTimeout(() => setSyncToast(null), 5000);
      return;
    }
    setIsSyncing(true);
    setSyncToast(null);
    setTimeout(() => {
      setIsSyncing(false);
      if (source.isRed) {
        setSyncToast('Sync attempt failed: Connection timed out. Please check network credentials.');
      } else {
        setSyncToast(`Sync completed successfully! 42 new records ingested in 0.8s.`);
      }
      setTimeout(() => setSyncToast(null), 5000);
    }, 1400);
  };

  const IconComponent = source.icon || Database;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col border border-border">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-admin-bg via-white to-white flex items-start justify-between shrink-0">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${source.isRed ? 'bg-admin-red/10 text-admin-red' : 'bg-admin/10 text-admin'}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[20px] font-bold text-admin-text leading-snug">
                  {source.name}
                </h2>
                <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${
                  source.isRed
                    ? 'bg-red-50 text-admin-red border-admin-red/30'
                    : source.status.includes('Delayed')
                    ? 'bg-amber-50 text-admin-amber border-admin-amber/30'
                    : 'bg-emerald-50 text-admin-accent border-admin-accent/30'
                }`}>
                  {source.status}
                </span>
              </div>
              <p className="text-[13px] text-admin-muted flex items-center gap-1.5">
                <span>{detail.category}</span>
                <span>•</span>
                <span className="font-medium text-admin-text">{detail.owner}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted hover:text-admin-text hover:bg-admin-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Toast Notification */}
        {syncToast && (
          <div className={`px-6 py-2.5 text-[13px] font-medium flex items-center justify-between border-b ${
            source.isRed ? 'bg-red-50 text-admin-red border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              {source.isRed ? <AlertTriangle className="w-4 h-4 text-admin-red" /> : <CheckCircle2 className="w-4 h-4 text-admin-accent" />}
              <span>{syncToast}</span>
            </div>
            <button onClick={() => setSyncToast(null)} className="text-current opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-border bg-white flex gap-6 shrink-0 text-[14px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-admin text-admin'
                : 'border-transparent text-admin-muted hover:text-admin-text'
            }`}
          >
            <Server className="w-4 h-4" />
            Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'border-admin text-admin'
                : 'border-transparent text-admin-muted hover:text-admin-text'
            }`}
          >
            <Clock className="w-4 h-4" />
            Sync Logs ({detail.recentLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'border-admin text-admin'
                : 'border-transparent text-admin-muted hover:text-admin-text'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Data Schema ({detail.entities.length})
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-admin-bg/60 p-4 rounded-lg border border-border/60">
                  <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider mb-1">
                    Last Sync
                  </div>
                  <div className="text-[15px] font-bold text-admin-text">
                    {source.time}
                  </div>
                  <div className="text-[11px] text-admin-muted mt-0.5">
                    {detail.syncFrequency}
                  </div>
                </div>

                <div className="bg-admin-bg/60 p-4 rounded-lg border border-border/60">
                  <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider mb-1">
                    Records Ingested
                  </div>
                  <div className="text-[15px] font-bold text-admin-text">
                    {source.recs}
                  </div>
                  <div className="text-[11px] text-admin-muted mt-0.5">
                    Processed Today
                  </div>
                </div>

                <div className="bg-admin-bg/60 p-4 rounded-lg border border-border/60">
                  <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider mb-1">
                    Uptime (30d)
                  </div>
                  <div className={`text-[15px] font-bold ${source.isRed ? 'text-admin-red' : 'text-admin-accent'}`}>
                    {source.up}
                  </div>
                  <div className="text-[11px] text-admin-muted mt-0.5">
                    Target SLA: 99.0%
                  </div>
                </div>

                <div className="bg-admin-bg/60 p-4 rounded-lg border border-border/60">
                  <div className="text-[11px] font-semibold text-admin-muted uppercase tracking-wider mb-1">
                    Avg Latency
                  </div>
                  <div className="text-[15px] font-bold text-admin-text">
                    {detail.latency}
                  </div>
                  <div className="text-[11px] text-admin-muted mt-0.5">
                    Response time
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-4 rounded-lg border border-border space-y-1">
                <h4 className="text-[13px] font-bold text-admin-text uppercase tracking-wider text-admin-muted">
                  System Overview
                </h4>
                <p className="text-[14px] text-admin-text leading-relaxed">
                  {detail.description}
                </p>
              </div>

              {/* Tech Specs & Configuration Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-border space-y-3">
                  <h4 className="text-[13px] font-bold text-admin-text uppercase tracking-wider text-admin-muted flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-admin" /> Connection Specs
                  </h4>

                  <div className="space-y-2 text-[13px]">
                    <div>
                      <span className="text-admin-muted">Endpoint URL:</span>
                      <div className="mt-1 flex items-center gap-2 bg-admin-bg p-2 rounded border border-border font-mono text-[12px] text-admin-text break-all">
                        <span className="flex-1 select-all">{detail.endpoint}</span>
                        <button
                          onClick={handleCopyEndpoint}
                          className="p-1 hover:bg-white rounded text-admin-muted hover:text-admin-text shrink-0"
                          title="Copy Endpoint"
                        >
                          {copied ? <Check className="w-4 h-4 text-admin-accent" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-admin-muted">Data Format:</span>
                      <span className="font-semibold text-admin-text">{detail.format}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-admin-muted">Auth Protocol:</span>
                      <span className="font-semibold text-admin-text">{detail.authMethod}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-admin-muted">Sync Schedule:</span>
                      <span className="font-semibold text-admin-text">{detail.syncFrequency}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-border space-y-3">
                  <h4 className="text-[13px] font-bold text-admin-text uppercase tracking-wider text-admin-muted flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-admin" /> Governance & Security
                  </h4>

                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-admin-muted">Data Controller:</span>
                      <span className="font-semibold text-admin-text">{detail.owner}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-admin-muted">Transport Security:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[12px]">
                        TLS 1.3 Encrypted
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-admin-muted">Data Privacy Level:</span>
                      <span className="font-semibold text-admin-text">Rwanda MoH Class-A Health Data</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-admin-muted">Compliance Standard:</span>
                      <span className="font-semibold text-admin-text">PHRIS Interoperability Spec v2.1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volume Trend Sparkline */}
              <div className="bg-white p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-admin-text uppercase tracking-wider text-admin-muted flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-admin" /> Recent Payload Ingestion Activity
                  </h4>
                  <span className="text-[12px] text-admin-muted">Last 7 sync windows</span>
                </div>
                <div className="h-28 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={source.spark}>
                      <XAxis dataKey="v" hide />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1A1A2E', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`Volume metric: ${val}`, 'Payload']}
                      />
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={source.isRed ? '#D32F2F' : '#104E49'}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: source.isRed ? '#D32F2F' : '#104E49' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[14px] font-bold text-admin-text">
                  Recent Synchronization Audit Log
                </h4>
                <span className="text-[12px] text-admin-muted">
                  Showing last {detail.recentLogs.length} events
                </span>
              </div>

              <div className="border border-border rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-admin-bg border-b border-border text-admin-muted font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Time</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Volume</th>
                      <th className="py-2.5 px-4">Duration</th>
                      <th className="py-2.5 px-4">Log Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {detail.recentLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-admin-bg/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-admin-text whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {log.status === 'success' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-admin-accent px-2 py-0.5 rounded text-[12px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Success
                            </span>
                          )}
                          {log.status === 'warning' && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-admin-amber px-2 py-0.5 rounded text-[12px] font-bold">
                              <AlertTriangle className="w-3.5 h-3.5" /> Warning
                            </span>
                          )}
                          {log.status === 'error' && (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-admin-red px-2 py-0.5 rounded text-[12px] font-bold">
                              <X className="w-3.5 h-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-admin-text whitespace-nowrap">
                          {log.records}
                        </td>
                        <td className="py-3 px-4 text-admin-muted whitespace-nowrap">
                          {log.duration}
                        </td>
                        <td className="py-3 px-4 text-admin-muted">
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <h4 className="text-[14px] font-bold text-admin-text">
                Mapped Data Entities & Schema Types
              </h4>
              <p className="text-[13px] text-admin-muted">
                The following data elements are extracted and standardized into the PHRIS central warehouse schema during each synchronization cycle:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detail.entities.map((entity, idx) => (
                  <div key={idx} className="p-3.5 bg-admin-bg/50 border border-border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white border border-border flex items-center justify-center text-admin font-bold text-[13px]">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-admin-text">{entity}</div>
                        <div className="text-[11px] text-admin-muted">Active Pipeline Entity</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-admin-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-border bg-admin-bg flex items-center justify-between shrink-0">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="h-10 px-4 bg-white border border-border hover:bg-admin-bg text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-admin ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Testing Connection...' : 'Run Test Sync'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                onConfigure(source.name, source.isRed || false);
              }}
              className="h-10 px-4 bg-admin-bg border border-border hover:bg-border text-admin-text text-[13px] font-semibold rounded-md transition-colors flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-admin-muted" />
              Configure Settings
            </button>
            <button
              onClick={onClose}
              className="h-10 px-5 bg-admin hover:bg-admin-hover text-white text-[13px] font-semibold rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
