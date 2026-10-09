import React, { useEffect, useState } from 'react';
import { Camera, Shield, Smartphone, Mail, Monitor } from 'lucide-react';
import { useApp, useCurrentUser } from '../store/AppStore';
import { DhoLayout } from '../components/dho/DhoLayout';
import { AdminLayout } from '../components/admin/AdminLayout';
import { EpiLayout } from '../components/epi/EpiLayout';
import { AnalystLayout } from '../components/analyst/AnalystLayout';
import { IntegrationLayout } from '../components/integration/IntegrationLayout';
import type { Role } from '../types';

/** Renders profile content inside the signed-in user's own dashboard layout. */
function RoleShell({ role, children }: {role: Role;children: React.ReactNode;}) {
  const props = { title: 'Profile Settings', subtitle: 'Manage your account, security and alert preferences', breadcrumb: 'Profile' };
  if (role === 'dho') return <DhoLayout {...props}>{children}</DhoLayout>;
  if (role === 'analyst') return <AnalystLayout {...props}>{children}</AnalystLayout>;
  if (role === 'integration') return <IntegrationLayout {...props}>{children}</IntegrationLayout>;
  if (role === 'admin')
  return (
    <AdminLayout>
        <div className="mb-8">
          <div className="text-[13px] text-admin-muted font-medium mb-1">Admin Panel &gt; Profile</div>
          <h1 className="text-[24px] font-bold text-admin-text">Profile Settings</h1>
        </div>
        {children}
      </AdminLayout>);

  return <EpiLayout {...props}>{children}</EpiLayout>;
}

function Toggle({ on, onChange, label }: {on: boolean;onChange: () => void;label: string;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${on ? 'bg-primary' : 'bg-border'}`}>

      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? 'right-1' : 'left-1'}`} />
    </button>);

}

export function Profile() {
  const { actions } = useApp();
  const user = useCurrentUser('epi');
  const [activeTab, setActiveTab] = useState('personal');
  const [first, ...rest] = user.name.replace('Dr. ', '').split(' ');
  const [form, setForm] = useState({ first, last: rest.join(' '), phone: user.phone, institution: user.institution, professionalId: user.professionalId });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [mfa, setMfa] = useState({ sms: true, email: false });
  const [alerts, setAlerts] = useState({ email: true, sms: true, level: 'orange' });
  const [sessions, setSessions] = useState([
  { id: 'current', device: 'Mac OS · Safari', where: 'Kigali, Rwanda · IP: 197.243.x.x', when: 'Active now', icon: Monitor, current: true },
  { id: 'ios', device: 'iOS · AI Vital App', where: 'Kigali, Rwanda · IP: 197.243.x.x', when: 'Last active: 2 hours ago', icon: Smartphone, current: false }]
  );

  useEffect(() => {
    const [f, ...r] = user.name.replace('Dr. ', '').split(' ');
    setForm({ first: f, last: r.join(' '), phone: user.phone, institution: user.institution, professionalId: user.professionalId });
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProfile = () => {
    const title = user.name.startsWith('Dr. ') ? 'Dr. ' : '';
    const name = `${title}${form.first.trim()} ${form.last.trim()}`.trim();
    actions.updateProfile({
      name,
      initials: `${form.first[0] ?? ''}${form.last[0] ?? ''}`.toUpperCase(),
      phone: form.phone,
      institution: form.institution,
      professionalId: form.professionalId
    });
    actions.toast('Profile saved.');
  };

  const updatePassword = () => {
    if (!pw.current) return setPwError('Enter your current password.');
    if (pw.next.length < 12) return setPwError('New password must be at least 12 characters.');
    if (pw.next !== pw.confirm) return setPwError('New passwords do not match.');
    setPwError('');
    setPw({ current: '', next: '', confirm: '' });
    actions.toast('Password updated (simulated — no credentials are stored).');
  };

  const inputCls = 'w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none';

  return (
    <RoleShell role={user.role}>
      <div className="max-w-[1080px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Profile Card */}
        <div className="w-full lg:w-[30%] bg-white rounded-xl shadow-card p-6 border border-border">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl">
                {user.initials}
              </div>
              <button
                onClick={() => actions.toast('Photo upload is not available in this prototype.', 'info')}
                aria-label="Change photo"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-primary shadow-sm transition-colors">

                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-[20px] font-bold text-text-primary mb-1">{user.name}</h2>
            <div className="bg-section text-primary px-3 py-1 rounded-full text-[13px] font-bold mb-4 inline-block">
              {user.roleLabel}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            {[
            ['Institution', user.institution],
            ['District', user.district === 'National' ? 'National Level' : `${user.district} District`],
            ['Email', user.email],
            ['Last Login', 'Today from Kigali']].
            map(([k, v]) =>
            <div key={k}>
                <div className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">{k}</div>
                <div className="text-[14px] font-medium text-text-primary break-all">{v}</div>
              </div>
            )}
            <div className="pt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-alert-green" />
              <span className="text-[14px] font-medium text-text-primary">Account Active</span>
            </div>
          </div>
        </div>

        {/* Right Column - Tabs & Forms */}
        <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-card border border-border overflow-hidden">
          <div className="flex border-b border-border px-2 overflow-x-auto">
            {[
            { id: 'personal', label: 'Personal Info' },
            { id: 'security', label: 'Security' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'sessions', label: 'Sessions' }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-[14px] font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>

                {tab.label}
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'personal' &&
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-[#374151]">First Name</label>
                    <input type="text" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} className={inputCls} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-[#374151]">Last Name</label>
                    <input type="text" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} className={inputCls} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">Email Address</label>
                  <input type="email" value={user.email} disabled className="w-full h-12 px-4 bg-page border border-border rounded-lg text-text-secondary cursor-not-allowed" />
                  <p className="text-[12px] text-text-secondary mt-1">Contact administrator to change email address.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">Phone Number</label>
                  <div className="flex">
                    <div className="h-12 px-4 bg-section border border-border border-r-0 rounded-l-lg flex items-center gap-2 text-text-primary font-medium">
                      RW +250
                    </div>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1 min-w-0 h-12 px-4 bg-page border border-border rounded-r-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-[#374151]">Organization</label>
                    <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-[#374151]">Professional ID</label>
                    <input type="text" value={form.professionalId} onChange={(e) => setForm({ ...form, professionalId: e.target.value })} className={inputCls} />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="h-12 px-8 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            }

            {activeTab === 'security' &&
            <div className="space-y-8">
                <section>
                  <h3 className="text-[16px] font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Change Password
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <input type="password" placeholder="Current Password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputCls} />
                    <input type="password" placeholder="New Password (min. 12 characters)" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} />
                    <input type="password" placeholder="Confirm New Password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputCls} />
                    {pwError && <p className="text-[13px] text-alert-red font-medium">{pwError}</p>}
                    <button onClick={updatePassword} className="h-10 px-6 bg-white border border-border hover:bg-page text-text-primary text-[14px] font-semibold rounded-lg transition-colors">
                      Update Password
                    </button>
                  </div>
                </section>

                <div className="h-px bg-border w-full" />

                <section>
                  <h3 className="text-[16px] font-bold text-text-primary mb-4">Multi-Factor Authentication</h3>
                  <div className="space-y-4">
                    {[
                  { k: 'sms' as const, icon: Smartphone, title: 'SMS Authentication', sub: `Receive codes via +250 ${user.phone.slice(0, 3)} *** ***` },
                  { k: 'email' as const, icon: Mail, title: 'Email Authentication', sub: `Receive codes via ${user.email}` }].
                  map((m) =>
                  <div key={m.k} className="flex items-center justify-between gap-3 p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <m.icon className="w-5 h-5 text-text-secondary" />
                          <div>
                            <div className="font-medium text-text-primary text-[14px]">{m.title}</div>
                            <div className="text-[13px] text-text-secondary break-all">{m.sub}</div>
                          </div>
                        </div>
                        <Toggle
                      label={m.title}
                      on={mfa[m.k]}
                      onChange={() => {
                        const next = { ...mfa, [m.k]: !mfa[m.k] };
                        if (!next.sms && !next.email) {
                          actions.toast('At least one MFA method must stay enabled.', 'warning');
                          return;
                        }
                        setMfa(next);
                      }} />

                      </div>
                  )}
                  </div>
                </section>
              </div>
            }

            {activeTab === 'notifications' &&
            <div className="space-y-8">
                <section>
                  <h3 className="text-[16px] font-bold text-text-primary mb-4">Alert Preferences</h3>
                  <div className="space-y-4">
                    {[
                  { k: 'email' as const, title: 'Email Alerts', sub: 'Receive outbreak alerts via email' },
                  { k: 'sms' as const, title: 'SMS Alerts', sub: 'Receive urgent alerts via SMS' }].
                  map((m) =>
                  <div key={m.k} className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-text-primary text-[14px]">{m.title}</div>
                          <div className="text-[13px] text-text-secondary">{m.sub}</div>
                        </div>
                        <Toggle label={m.title} on={alerts[m.k]} onChange={() => setAlerts({ ...alerts, [m.k]: !alerts[m.k] })} />
                      </div>
                  )}
                  </div>
                </section>

                <div className="h-px bg-border w-full" />

                <section>
                  <h3 className="text-[16px] font-bold text-text-primary mb-4">Minimum Alert Level</h3>
                  <p className="text-[13px] text-text-secondary mb-4">Select the minimum severity level to trigger notifications.</p>
                  <div className="space-y-3">
                    {[
                  { v: 'yellow', dot: 'bg-alert-yellow', label: 'Yellow and above (Watch)' },
                  { v: 'orange', dot: 'bg-alert-orange', label: 'Orange and above (Alert)' },
                  { v: 'red', dot: 'bg-alert-red', label: 'Red only (Emergency)' }].
                  map((o) =>
                  <label
                    key={o.v}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${alerts.level === o.v ? 'border-primary bg-primary/5' : 'border-border hover:bg-page'}`}>

                        <input
                      type="radio"
                      name="alertLevel"
                      checked={alerts.level === o.v}
                      onChange={() => setAlerts({ ...alerts, level: o.v })}
                      className="w-4 h-4 text-primary focus:ring-primary border-border" />

                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${o.dot}`} />
                          <span className="text-[14px] font-medium text-text-primary">{o.label}</span>
                        </div>
                      </label>
                  )}
                  </div>
                  <button
                  onClick={() => actions.toast('Notification preferences saved.')}
                  className="mt-6 h-10 px-6 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-lg">

                    Save Preferences
                  </button>
                </section>
              </div>
            }

            {activeTab === 'sessions' &&
            <div className="space-y-6">
                <h3 className="text-[16px] font-bold text-text-primary mb-4">Active Sessions</h3>
                {sessions.map((s) =>
              <div
                key={s.id}
                className={`flex items-center justify-between gap-3 p-4 border rounded-lg ${s.current ? 'border-primary bg-primary/5' : 'border-border'}`}>

                    <div className="flex items-start gap-4">
                      <s.icon className={`w-6 h-6 mt-1 ${s.current ? 'text-primary' : 'text-text-secondary'}`} />
                      <div>
                        <div className="font-bold text-text-primary text-[14px] flex items-center gap-2">
                          {s.device}
                          {s.current &&
                      <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Current</span>
                      }
                        </div>
                        <div className="text-[13px] text-text-secondary mt-1">{s.where}</div>
                        <div className="text-[13px] text-text-secondary">{s.when}</div>
                      </div>
                    </div>
                    {!s.current &&
                <button
                  onClick={() => {
                    setSessions((list) => list.filter((x) => x.id !== s.id));
                    actions.toast(`Session on ${s.device} terminated.`);
                  }}
                  className="text-[13px] font-semibold text-alert-red hover:bg-alert-red/10 px-3 py-1.5 rounded transition-colors">

                        Terminate
                      </button>
                }
                  </div>
              )}
              </div>
            }
          </div>
        </div>
      </div>
    </RoleShell>);

}
