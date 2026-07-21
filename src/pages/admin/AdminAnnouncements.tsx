import React, { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SuccessModal } from '../../components/admin/SuccessModal';
export function AdminAnnouncements() {
  const [sendTo, setSendTo] = useState('all');
  const [priority, setPriority] = useState('normal');
  const [delivery, setDelivery] = useState('now');
  const [showSuccess, setShowSuccess] = useState(false);
  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[13px] text-admin-muted font-medium mb-1">
          Admin Panel &gt; Announcements
        </div>
        <h1 className="text-[24px] font-bold text-admin-text">
          System Announcements
        </h1>
        <p className="text-[14px] text-admin-muted">
          Send messages to all users or specific roles and districts
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Compose */}
        <div className="w-full lg:w-[55%]">
          <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col">
            <div className="p-5 border-b border-border flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-admin" />
              <h2 className="text-[16px] font-bold text-admin-text">
                New Announcement
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. System maintenance scheduled"
                  className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin" />
                
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-admin-text">
                  Message Body
                </label>
                <textarea
                  rows={5}
                  placeholder="e.g. PHRIS will be unavailable on Sunday 8 June from 2AM–4AM for scheduled maintenance..."
                  className="w-full p-3 border border-border rounded-md focus:outline-none focus:border-admin resize-none" />
                
              </div>

              <div className="space-y-3">
                <label className="text-[14px] font-medium text-admin-text">
                  Send To
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendto"
                      checked={sendTo === 'all'}
                      onChange={() => setSendTo('all')}
                      className="text-admin focus:ring-admin" />
                    
                    <span className="text-[14px]">All Users</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendto"
                      checked={sendTo === 'role'}
                      onChange={() => setSendTo('role')}
                      className="text-admin focus:ring-admin" />
                    
                    <span className="text-[14px]">Specific Role</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendto"
                      checked={sendTo === 'district'}
                      onChange={() => setSendTo('district')}
                      className="text-admin focus:ring-admin" />
                    
                    <span className="text-[14px]">Specific District</span>
                  </label>
                </div>

                {sendTo === 'role' &&
                <div className="p-4 bg-admin-bg rounded-md grid grid-cols-2 gap-3 animate-in fade-in">
                    {[
                  'Administrator',
                  'Epidemiologist',
                  'Public Health Analyst',
                  'District Health Officer'].
                  map((r) =>
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer">
                    
                        <input
                      type="checkbox"
                      className="rounded border-border text-admin focus:ring-admin" />
                    
                        <span className="text-[13px]">{r}</span>
                      </label>
                  )}
                  </div>
                }

                {sendTo === 'district' &&
                <div className="animate-in fade-in">
                    <select className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin bg-white">
                      <option>Select district...</option>
                      <option>Kigali City</option>
                      <option>Huye</option>
                      <option>Musanze</option>
                    </select>
                  </div>
                }
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-admin-text">
                    Priority
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === 'normal'}
                        onChange={() => setPriority('normal')}
                        className="text-admin focus:ring-admin" />
                      
                      <span className="text-[14px]">Normal</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === 'important'}
                        onChange={() => setPriority('important')}
                        className="text-admin focus:ring-admin" />
                      
                      <span className="text-[14px]">Important</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === 'urgent'}
                        onChange={() => setPriority('urgent')}
                        className="text-admin focus:ring-admin" />
                      
                      <span className="text-[14px]">Urgent</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-admin-text">
                    Delivery
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery === 'now'}
                        onChange={() => setDelivery('now')}
                        className="text-admin focus:ring-admin" />
                      
                      <span className="text-[14px]">Send Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery === 'schedule'}
                        onChange={() => setDelivery('schedule')}
                        className="text-admin focus:ring-admin" />
                      
                      <span className="text-[14px]">Schedule</span>
                    </label>
                  </div>
                  {delivery === 'schedule' &&
                  <input
                    type="datetime-local"
                    className="w-full h-10 px-3 border border-border rounded-md focus:outline-none focus:border-admin text-[13px] animate-in fade-in" />

                  }
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-admin-bg/50 mt-auto">
              <button
                onClick={() => setShowSuccess(true)}
                className="w-full h-12 bg-admin hover:bg-admin-hover text-white text-[15px] font-semibold rounded-md transition-colors flex items-center justify-center gap-2">
                
                <Send className="w-4 h-4" /> Send Announcement
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - History */}
        <div className="w-full lg:w-[45%]">
          <div className="bg-white rounded-lg shadow-sm border border-border flex flex-col h-full">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-admin-text">
                Sent Announcements
              </h2>
            </div>

            <div className="divide-y divide-border">
              {[
              {
                badge: 'Important',
                bg: 'bg-admin-info/10 text-admin-info',
                title: 'System Update v2.1',
                date: 'Sent June 2',
                aud: 'All users',
                read: '189/247 opened (76%)'
              },
              {
                badge: 'Urgent',
                bg: 'bg-admin-red/10 text-admin-red',
                title: 'RBC Emergency Protocol Activated',
                date: 'Sent May 28',
                aud: 'Epidemiologists + District Officers',
                read: '44/48 opened (91%)'
              },
              {
                badge: 'Normal',
                bg: 'bg-admin-bg text-admin-muted',
                title: 'Monthly Report Reminder',
                date: 'Sent June 1',
                aud: 'Epidemiologists and district officers',
                read: '44/48 opened (92%)'
              }].
              map((item, i) =>
              <div
                key={i}
                className="p-5 hover:bg-admin-bg/30 transition-colors cursor-pointer">
                
                  <div className="flex items-center gap-2 mb-2">
                    <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${item.bg}`}>
                    
                      {item.badge}
                    </span>
                    <span className="text-[12px] text-admin-muted font-medium">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-admin-text mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-admin-muted mb-3 line-clamp-1">
                    Please be advised of the following updates to the system...
                  </p>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-admin-text">
                      To: {item.aud}
                    </span>
                    <span className="text-admin-muted">{item.read}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        title="Announcement sent"
        message="Your announcement has been delivered to the selected recipients."
        onClose={() => setShowSuccess(false)} />
      
    </AdminLayout>);

}