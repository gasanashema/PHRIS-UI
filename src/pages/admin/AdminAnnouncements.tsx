import { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
import { useApp } from '../../store/AppStore';
import { DISTRICTS } from '../../data/seed';
import { fmtDateTime } from '../../lib/format';
import type { Announcement } from '../../types';

const ROLES = ['Administrator', 'Epidemiologist', 'Public Health Analyst', 'District Health Officer', 'Data Integration'];
const PRIORITY_CLS: Record<Announcement['priority'], string> = {
  urgent: 'bg-admin-red/10 text-admin-red',
  important: 'bg-admin-info/10 text-admin-info',
  normal: 'bg-admin-bg text-admin-muted'
};

export function AdminAnnouncements() {
  const { state, actions } = useApp();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendTo, setSendTo] = useState('all');
  const [roles, setRoles] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');
  const [delivery, setDelivery] = useState('now');
  const [when, setWhen] = useState('');
  const [channels, setChannels] = useState<string[]>(['In-app', 'Email']);
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const audience =
  sendTo === 'all' ? 'All users' : sendTo === 'role' ? `Roles: ${roles.join(', ')}` : `District: ${district}`;
  const errors = {
    subject: !subject.trim(),
    body: !body.trim(),
    audience: sendTo === 'role' && roles.length === 0 || sendTo === 'district' && !district,
    when: delivery === 'schedule' && !when
  };
  const valid = !Object.values(errors).some(Boolean);

  const send = () => {
    setTouched(true);
    if (!valid) return;
    actions.sendAnnouncement({ title: subject.trim(), body: body.trim(), audience, priority, channels }, delivery === 'schedule');
    setSent(delivery === 'schedule' ? `Scheduled for ${fmtDateTime(when)} to ${audience}.` : `Delivered in-app to ${audience}${channels.length > 1 ? ` (${channels.filter((c) => c !== 'In-app').join(' & ')} simulated)` : ''}.`);
    setSubject('');
    setBody('');
    setRoles([]);
    setDistrict('');
    setTouched(false);
  };

  const err = (bad: boolean) => touched && bad ? 'border-admin-red' : 'border-border';

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; Announcements</div>
        <h1 className="text-[24px] font-bold text-admin-text">System Announcements</h1>
        <p className="text-[14px] text-admin-muted">Send messages to all users or specific roles and districts</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[55%]">
          <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
            <div className="p-5 border-b border-border flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-admin" />
              <h2 className="text-[16px] font-bold text-admin-text">New Announcement</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. System maintenance scheduled"
                  className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:border-admin ${err(errors.subject)}`} />

                {touched && errors.subject && <p className="text-[12px] text-admin-red">Enter a subject.</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">Message Body</label>
                <textarea
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="e.g. AI Vital will be unavailable on Sunday 8 June from 2AM–4AM for scheduled maintenance..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:border-admin resize-none ${err(errors.body)}`} />

                {touched && errors.body && <p className="text-[12px] text-admin-red">Enter a message.</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[14px] font-medium text-admin-text">Send To</label>
                <div className="flex flex-wrap gap-4">
                  {[
                  ['all', 'All Users'],
                  ['role', 'Specific Role'],
                  ['district', 'Specific District']].
                  map(([v, l]) =>
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="sendto" checked={sendTo === v} onChange={() => setSendTo(v)} className="text-admin focus:ring-admin" />
                      <span className="text-[14px]">{l}</span>
                    </label>
                  )}
                </div>

                {sendTo === 'role' &&
                <div className="p-4 bg-admin-bg rounded-md grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLES.map((r) =>
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={roles.includes(r)}
                      onChange={() => setRoles((x) => x.includes(r) ? x.filter((y) => y !== r) : [...x, r])}
                      className="rounded border-border text-admin focus:ring-admin" />

                        <span className="text-[13px]">{r}</span>
                      </label>
                  )}
                  </div>
                }

                {sendTo === 'district' &&
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:border-admin bg-white ${err(errors.audience)}`}>
                    <option value="">Select district...</option>
                    {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                }
                {touched && errors.audience && <p className="text-[12px] text-admin-red">Choose at least one recipient group.</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-admin-text">Priority</label>
                  <div className="flex flex-col gap-2">
                    {(['normal', 'important', 'urgent'] as const).map((p) =>
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="priority" checked={priority === p} onChange={() => setPriority(p)} className="text-admin focus:ring-admin" />
                        <span className="text-[14px] capitalize">{p}</span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-admin-text">Channels</label>
                  <div className="flex flex-col gap-2">
                    {['In-app', 'Email', 'SMS'].map((c) =>
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={channels.includes(c)}
                        disabled={c === 'In-app'}
                        onChange={() => setChannels((x) => x.includes(c) ? x.filter((y) => y !== c) : [...x, c])}
                        className="rounded border-border text-admin focus:ring-admin" />

                        <span className="text-[14px]">{c}</span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-admin-text">Delivery</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="delivery" checked={delivery === 'now'} onChange={() => setDelivery('now')} className="text-admin focus:ring-admin" />
                      <span className="text-[14px]">Send Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="delivery" checked={delivery === 'schedule'} onChange={() => setDelivery('schedule')} className="text-admin focus:ring-admin" />
                      <span className="text-[14px]">Schedule</span>
                    </label>
                  </div>
                  {delivery === 'schedule' &&
                  <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:border-admin text-[13px] ${err(errors.when)}`} />
                  }
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-admin-bg/50 mt-auto">
              <button
                onClick={send}
                className="w-full h-12 bg-admin hover:bg-admin-hover text-white text-[15px] font-semibold rounded-md transition-colors flex items-center justify-center gap-2">

                <Send className="w-4 h-4" /> {delivery === 'schedule' ? 'Schedule Announcement' : 'Send Announcement'}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[45%]">
          <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col h-full">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-admin-text">Sent Announcements ({state.announcements.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {state.announcements.map((item) =>
              <button
                key={item.id}
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full text-left p-5 hover:bg-admin-bg/30 transition-colors">

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${PRIORITY_CLS[item.priority]}`}>{item.priority}</span>
                    <span className="text-[12px] text-admin-muted font-medium">
                      {item.status} {fmtDateTime(item.at)}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-admin-text mb-1">{item.title}</h3>
                  <p className={`text-[13px] text-admin-muted mb-3 ${openId === item.id ? '' : 'line-clamp-1'}`}>{item.body}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                    <span className="font-medium text-admin-text">To: {item.audience}</span>
                    <span className="text-admin-muted">{item.channels.join(' · ')} · by {item.sentBy}</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        open={!!sent}
        title={sent?.startsWith('Scheduled') ? 'Announcement scheduled' : 'Announcement sent'}
        message={sent ?? ''}
        onClose={() => setSent(null)} />

    </AdminLayout>);

}
