import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GeoLayout } from '../../components/geo/GeoLayout';
import {
  Image,
  FileText,
  Video,
  Link as LinkIcon,
  Database,
  Loader2,
  Check } from
'lucide-react';
import { useApp } from '../../store/AppStore';
import { DISTRICT_XY } from '../../data/geo';
import { DISTRICT_PROVINCE } from '../../data/seed';
import { downloadFile, fmtDate, isOpenStatus, nowISO, toCSV } from '../../lib/format';

type View = 'risk' | 'alerts';
interface Pt {district: string;score: number;disease: string;alerts: number;}
const riskHex = (s: number) => s >= 80 ? '#D32F2F' : s >= 60 ? '#F57C00' : s >= 40 ? '#F59E0B' : '#00A550';

function mapSvg(pts: Pt[], view: View, w: number, h: number, title: string, opts: {bg?: string;frame?: (p: Pt) => number;} = {}) {
  const pad = 0.08;
  const circles = pts.map((p) => {
    const xy = DISTRICT_XY[p.district];
    const cx = (pad + xy.x / 100 * (1 - 2 * pad)) * w;
    const cy = (0.12 + xy.y / 100 * 0.8) * h;
    const k = opts.frame ? opts.frame(p) : 1;
    const value = view === 'risk' ? p.score : p.alerts * 30;
    const r = (view === 'risk' ? 6 + p.score / 6 : p.alerts ? 10 + p.alerts * 6 : 4) * (w / 960) * k;
    const color = view === 'risk' ? riskHex(p.score) : p.alerts ? riskHex(Math.min(100, 40 + value)) : '#4B5563';
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(0, r).toFixed(1)}" fill="${color}" fill-opacity="0.75" stroke="#fff" stroke-opacity="0.5"/>` +
    `<text x="${cx.toFixed(1)}" y="${(cy + r + 11 * w / 960).toFixed(1)}" font-size="${(10 * w / 960).toFixed(1)}" fill="#fff" fill-opacity="0.75" text-anchor="middle" font-family="Arial">${p.district}</text>`;
  }).join('');
  const fs = 16 * w / 960;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` + (
  opts.bg === 'transparent' ? '' : `<rect width="100%" height="100%" fill="${opts.bg ?? '#1A1A1A'}"/>`) +
  `<text x="${fs}" y="${fs * 1.6}" font-size="${fs}" font-weight="bold" fill="${opts.bg === '#FFFFFF' ? '#104E49' : '#fff'}" font-family="Arial">${title}</text>` +
  circles +
  `<text x="${fs}" y="${h - fs * 0.8}" font-size="${fs * 0.65}" fill="${opts.bg === '#FFFFFF' ? '#6B7280' : '#9CA3AF'}" font-family="Arial">AI Vital prototype · schematic district positions · demonstration data</text></svg>`;
}

function svgToCanvas(svg: string, w: number, h: number, bg?: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      if (bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c);
    };
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export function GeoExport() {
  const { state, actions } = useApp();
  const [view, setView] = useState<View>('risk');
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [res, setRes] = useState(1920);
  const [busy, setBusy] = useState<string | null>(null);
  const [dataFmt, setDataFmt] = useState<'Excel' | 'CSV' | 'GeoJSON'>('CSV');
  const [copied, setCopied] = useState(false);

  const pts: Pt[] = useMemo(() => state.districtRisk.map((r) => ({
    district: r.district,
    score: r.score,
    disease: r.disease,
    alerts: state.alerts.filter((a) => a.district === r.district && isOpenStatus(a.status)).length
  })), [state.districtRisk, state.alerts]);
  const viewLabel = view === 'risk' ? 'AI Risk Scores' : 'Active Alerts';
  const title = `Rwanda National Health Map — ${viewLabel} — ${fmtDate(nowISO())}`;
  const preview = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(mapSvg(pts, view, 960, 540, title))}`;
  const slug = `aivital-map-${view}-${nowISO().slice(0, 10)}`;
  const shareUrl = `${window.location.origin}/geo`;
  const supportsVideo = typeof window !== 'undefined' && 'MediaRecorder' in window && !!HTMLCanvasElement.prototype.captureStream;

  const exportImage = async () => {
    setBusy('image');
    try {
      const h = Math.round(res * 9 / 16);
      const bg = format === 'jpg' ? '#FFFFFF' : 'transparent';
      const canvas = await svgToCanvas(mapSvg(pts, view, res, h, title, { bg: format === 'jpg' ? '#FFFFFF' : 'transparent' }), res, h, format === 'jpg' ? bg : undefined);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, format === 'png' ? 'image/png' : 'image/jpeg', 0.92));
      if (blob) {
        downloadFile(`${slug}.${format}`, blob);
        actions.toast(`Map exported as ${format.toUpperCase()} (${res}px).`);
      }
    } catch {
      actions.toast('Image export failed in this browser.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const exportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) {
      actions.toast('Allow pop-ups to open the print view.', 'warning');
      return;
    }
    const legend = view === 'risk' ?
    '● Low (&lt;40) · ● Moderate (40–59) · ● High (60–79) · ● Critical (80+)' :
    'Circle size = number of open alerts in the district';
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;margin:24px;color:#1A1A2E}h1{color:#104E49;font-size:20px}img{width:100%;border:1px solid #E5E7EB}.f{color:#6B7280;font-size:12px;margin-top:12px}</style></head><body><h1>${title}</h1><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(mapSvg(pts, view, 1600, 900, title))}"/><p>${legend}</p><p class="f">Generated ${new Date().toLocaleString()} · AI Vital — Rwanda Biomedical Centre (prototype, demonstration data)</p><script>window.onload=function(){setTimeout(function(){window.print()},300)}</script></body></html>`);
    win.document.close();
  };

  const exportVideo = async () => {
    if (!supportsVideo) return;
    setBusy('video');
    try {
      const w = 1280,h = 720,frames = 8,perFrame = 500;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      const stream = canvas.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm' });
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<void>((r) => rec.onstop = () => r());
      rec.start();
      for (let day = 0; day < frames; day++) {
        // grow each district towards its current score over the 8 days
        const f = await svgToCanvas(mapSvg(pts, view, w, h, `${viewLabel} build-up — day ${day + 1} of ${frames}`, { frame: () => (day + 1) / frames }), w, h);
        ctx.drawImage(f, 0, 0);
        await new Promise((r) => setTimeout(r, perFrame));
      }
      rec.stop();
      await done;
      downloadFile(`${slug}.webm`, new Blob(chunks, { type: 'video/webm' }));
      actions.toast('Animation recorded as WebM video.');
    } catch {
      actions.toast('Video recording is not supported in this browser.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      actions.toast(`Copy failed — link: ${shareUrl}`, 'warning');
    }
  };

  const exportData = () => {
    const rows = pts.map((p) => ({ district: p.district, province: DISTRICT_PROVINCE[p.district], risk_score: p.score, top_disease: p.disease, open_alerts: p.alerts, schematic_x: DISTRICT_XY[p.district].x, schematic_y: DISTRICT_XY[p.district].y }));
    if (dataFmt === 'GeoJSON') {
      const gj = {
        type: 'FeatureCollection',
        note: 'Coordinates are schematic positions (0–100), not WGS84.',
        features: rows.map((r) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [r.schematic_x, r.schematic_y] }, properties: r }))
      };
      downloadFile(`${slug}.geojson`, JSON.stringify(gj, null, 2), 'application/geo+json');
    } else {
      // Excel opens the CSV directly; a native .xlsx writer would need an extra dependency
      downloadFile(`${slug}.csv`, toCSV(rows), 'text/csv');
    }
    actions.toast(`${pts.length} districts exported as ${dataFmt === 'GeoJSON' ? 'GeoJSON' : 'CSV'}.`);
  };

  const btn = 'px-6 py-2 bg-epi text-white text-[13px] font-bold rounded hover:bg-epi-dark transition-colors disabled:opacity-60 inline-flex items-center gap-2';

  return (
    <GeoLayout
      title="Export Map"
      subtitle="Save and share AI Vital maps for reports, presentations, and field use"
      breadcrumb="Export & Reports">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Map Preview */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-card border border-border p-4">
            <div className="relative w-full aspect-video bg-[#1A1A1A] rounded-lg overflow-hidden border border-border mb-4">
              <img src={preview} alt={`Map preview — ${viewLabel}`} className="absolute inset-0 w-full h-full" />
            </div>

            <div className="text-center">
              <div className="text-[14px] font-bold text-epi-text mb-2">
                Current view: {viewLabel} | Rwanda National | {fmtDate(nowISO())}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <select aria-label="Map view" value={view} onChange={(e) => setView(e.target.value as View)} className="text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1.5 bg-white">
                  <option value="risk">AI Risk Scores</option>
                  <option value="alerts">Active Alerts</option>
                </select>
                <Link to="/geo" className="text-[13px] font-bold text-epi hover:underline">
                  Configure map before export →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Export Options */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <Image className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">Static Image</h3>
              <p className="text-[13px] text-epi-muted mb-4">PNG or JPG — for reports and presentations</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value as 'png' | 'jpg')} className="w-full text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1.5 focus:outline-none bg-white">
                    <option value="png">PNG (transparent bg)</option>
                    <option value="jpg">JPG (white bg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-epi-muted uppercase tracking-wider mb-1">Resolution</label>
                  <select value={res} onChange={(e) => setRes(Number(e.target.value))} className="w-full text-[13px] font-medium text-epi-text border border-border rounded px-2 py-1.5 focus:outline-none bg-white">
                    <option value={1920}>Standard (1920px)</option>
                    <option value={3840}>High (3840px)</option>
                  </select>
                </div>
              </div>
              <button onClick={exportImage} disabled={!!busy} className={btn}>
                {busy === 'image' && <Loader2 className="w-4 h-4 animate-spin" />} Export as Image
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">Print-Ready PDF</h3>
              <p className="text-[13px] text-epi-muted mb-3">PDF with legend and title — for printing and field teams without internet</p>
              <div className="text-[12px] text-epi-text bg-epi-bg p-2 rounded border border-border mb-4">
                <span className="font-bold">Includes:</span> Map + legend + title + date + AI Vital footer. Opens the print dialog — choose “Save as PDF”.
              </div>
              <button onClick={exportPdf} className={btn}>Export as PDF</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">Animated Video</h3>
              <p className="text-[13px] text-epi-muted mb-3">Short video of the risk build-up — for presentations and meetings</p>
              <div className="flex flex-wrap gap-4 text-[12px] text-epi-text mb-4">
                <div><span className="text-epi-muted">Duration:</span> <span className="font-bold">8 days × 0.5 seconds = 4s</span></div>
                <div><span className="text-epi-muted">Format:</span> <span className="font-bold">WebM 720p (recorded in browser)</span></div>
              </div>
              <button onClick={exportVideo} disabled={!!busy || !supportsVideo} title={supportsVideo ? undefined : 'This browser cannot record canvas video'} className={btn}>
                {busy === 'video' && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy === 'video' ? 'Recording…' : supportsVideo ? 'Export Animation (WebM)' : 'Video export not supported'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">Interactive Link</h3>
              <p className="text-[13px] text-epi-muted mb-3">Link to the live map in this deployment — colleagues with access can explore it</p>
              <div className="bg-epi-bg p-2 rounded border border-border text-[12px] font-mono text-epi-text mb-4 break-all">{shareUrl}</div>
              <div className="flex flex-wrap gap-3">
                <button onClick={copyLink} className={btn}>{copied ? <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied</span> : 'Copy Link'}</button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`AI Vital map — ${viewLabel}`)}&body=${encodeURIComponent(`Live map: ${shareUrl}`)}`}
                  className="px-6 py-2 bg-white border border-border text-epi-text text-[13px] font-bold rounded hover:bg-epi-bg transition-colors">
                  Send by Email
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-border p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-epi-bg flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-epi" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-epi-text mb-1">Data Export</h3>
              <p className="text-[13px] text-epi-muted mb-3">Raw geographic data — for further analysis</p>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-[12px] text-epi-muted">Formats:</span>
                {(['Excel', 'CSV', 'GeoJSON'] as const).map((f) =>
                <button
                  key={f}
                  onClick={() => setDataFmt(f)}
                  title={f === 'Excel' ? 'Exports CSV, which opens directly in Excel' : undefined}
                  className={`text-[12px] font-bold px-2 py-1 rounded border ${dataFmt === f ? 'bg-epi text-white border-epi' : 'text-epi-text bg-epi-bg border-border'}`}>
                    {f}
                  </button>
                )}
              </div>
              <button onClick={exportData} className="px-6 py-2 bg-white border border-epi text-epi text-[13px] font-bold rounded hover:bg-epi/5 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </GeoLayout>);

}
