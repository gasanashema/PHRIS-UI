import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Map,
  Activity,
  FileText,
  Settings,
  LogOut,
  Camera,
  Shield,
  Smartphone,
  Mail,
  Monitor,
  AlertTriangle } from
'lucide-react';
import { Logo } from '../components/auth/Logo';
export function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  return (
    <div className="min-h-screen bg-page flex font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-primary flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6">
          <Logo variant="light" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
          {
            icon: LayoutDashboard,
            label: 'Dashboard'
          },
          {
            icon: Bell,
            label: 'Alerts'
          },
          {
            icon: Map,
            label: 'Map'
          },
          {
            icon: Activity,
            label: 'Surveillance'
          },
          {
            icon: FileText,
            label: 'Reports'
          }].
          map((item, i) =>
          <a
            key={i}
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            
              <item.icon className="w-5 h-5" />
              <span className="text-[14px] font-medium">{item.label}</span>
            </a>
          )}
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white font-semibold bg-white/15 border-l-2 border-white transition-colors">
            
            <Settings className="w-5 h-5" />
            <span className="text-[14px]">Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
              JH
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[14px] font-bold text-white truncate">
                Dr. J. Habimana
              </span>
              <span className="text-[12px] text-white/60 truncate">
                Epidemiologist
              </span>
            </div>
          </div>
          <Link
            to="/login"
            replace
            aria-label="Log out"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-alert-red hover:bg-alert-red/10 transition-colors w-full">
            
            <LogOut className="w-5 h-5" />
            <span className="text-[14px] font-medium">Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-[20px] font-bold text-text-primary">
              Profile Settings
            </h1>
            <div className="h-4 w-px bg-border" />
            <div className="text-[13px] text-text-secondary font-medium">
              Home <span className="mx-2">›</span> Settings{' '}
              <span className="mx-2">›</span>{' '}
              <span className="text-primary">Profile</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert-red rounded-full border border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
              JH
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1">
          <div className="max-w-[1080px] mx-auto flex gap-8 items-start">
            {/* Left Column - Profile Card */}
            <div className="w-[30%] bg-white rounded-xl shadow-card p-6 border border-border">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl">
                    JH
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-primary shadow-sm transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-[20px] font-bold text-text-primary mb-1">
                  Dr. Jean Paul Habimana
                </h2>
                <div className="bg-section text-primary px-3 py-1 rounded-full text-[13px] font-bold mb-4 inline-block">
                  Epidemiologist
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <div className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">
                    Institution
                  </div>
                  <div className="text-[14px] font-medium text-text-primary">
                    Rwanda Biomedical Centre
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">
                    District
                  </div>
                  <div className="text-[14px] font-medium text-text-primary">
                    National Level
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1">
                    Last Login
                  </div>
                  <div className="text-[14px] font-medium text-text-primary">
                    Today at 09:15 AM from Kigali
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-alert-green" />
                    <span className="text-[14px] font-medium text-text-primary">
                      Account Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tabs & Forms */}
            <div className="w-[70%] bg-white rounded-xl shadow-card border border-border overflow-hidden">
              <div className="flex border-b border-border px-2">
                {[
                {
                  id: 'personal',
                  label: 'Personal Info'
                },
                {
                  id: 'security',
                  label: 'Security'
                },
                {
                  id: 'notifications',
                  label: 'Notifications'
                },
                {
                  id: 'sessions',
                  label: 'Sessions'
                }].
                map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-[14px] font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                  
                    {tab.label}
                  </button>
                )}
              </div>

              <div className="p-8">
                {activeTab === 'personal' &&
                <form className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-[#374151]">
                          First Name
                        </label>
                        <input
                        type="text"
                        defaultValue="Jean Paul"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-[#374151]">
                          Last Name
                        </label>
                        <input
                        type="text"
                        defaultValue="Habimana"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[14px] font-medium text-[#374151]">
                        Email Address
                      </label>
                      <input
                      type="email"
                      defaultValue="jp.habimana@rbc.gov.rw"
                      disabled
                      className="w-full h-12 px-4 bg-page border border-border rounded-lg text-text-secondary cursor-not-allowed" />
                    
                      <p className="text-[12px] text-text-secondary mt-1">
                        Contact administrator to change email address.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[14px] font-medium text-[#374151]">
                        Phone Number
                      </label>
                      <div className="flex">
                        <div className="h-12 px-4 bg-section border border-border border-r-0 rounded-l-lg flex items-center gap-2 text-text-primary font-medium">
                          🇷🇼 +250
                        </div>
                        <input
                        type="tel"
                        defaultValue="788 123 456"
                        className="flex-1 h-12 px-4 bg-page border border-border rounded-r-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-[#374151]">
                          Organization
                        </label>
                        <input
                        type="text"
                        defaultValue="Rwanda Biomedical Centre"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-[#374151]">
                          Professional ID
                        </label>
                        <input
                        type="text"
                        defaultValue="RBC-EPI-2024-89"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                      type="button"
                      className="h-12 px-8 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-lg transition-colors">
                      
                        Save Changes
                      </button>
                    </div>
                  </form>
                }

                {activeTab === 'security' &&
                <div className="space-y-8 animate-in fade-in">
                    <section>
                      <h3 className="text-[16px] font-bold text-text-primary mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" /> Change
                        Password
                      </h3>
                      <div className="space-y-4 max-w-md">
                        <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                        <input
                        type="password"
                        placeholder="New Password"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                        <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                      
                        <button className="h-10 px-6 bg-white border border-border hover:bg-page text-text-primary text-[14px] font-semibold rounded-lg transition-colors">
                          Update Password
                        </button>
                      </div>
                    </section>

                    <div className="h-px bg-border w-full" />

                    <section>
                      <h3 className="text-[16px] font-bold text-text-primary mb-4">
                        Multi-Factor Authentication
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-text-secondary" />
                            <div>
                              <div className="font-medium text-text-primary text-[14px]">
                                SMS Authentication
                              </div>
                              <div className="text-[13px] text-text-secondary">
                                Receive codes via +250 788 *** ***
                              </div>
                            </div>
                          </div>
                          <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-text-secondary" />
                            <div>
                              <div className="font-medium text-text-primary text-[14px]">
                                Email Authentication
                              </div>
                              <div className="text-[13px] text-text-secondary">
                                Receive codes via jp.habimana@rbc.gov.rw
                              </div>
                            </div>
                          </div>
                          <div className="w-11 h-6 bg-border rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                }

                {activeTab === 'notifications' &&
                <div className="space-y-8 animate-in fade-in">
                    <section>
                      <h3 className="text-[16px] font-bold text-text-primary mb-4">
                        Alert Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-text-primary text-[14px]">
                              Email Alerts
                            </div>
                            <div className="text-[13px] text-text-secondary">
                              Receive outbreak alerts via email
                            </div>
                          </div>
                          <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-text-primary text-[14px]">
                              SMS Alerts
                            </div>
                            <div className="text-[13px] text-text-secondary">
                              Receive urgent alerts via SMS
                            </div>
                          </div>
                          <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="h-px bg-border w-full" />

                    <section>
                      <h3 className="text-[16px] font-bold text-text-primary mb-4">
                        Minimum Alert Level
                      </h3>
                      <p className="text-[13px] text-text-secondary mb-4">
                        Select the minimum severity level to trigger
                        notifications.
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-page">
                          <input
                          type="radio"
                          name="alertLevel"
                          className="w-4 h-4 text-primary focus:ring-primary border-border" />
                        
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-alert-yellow" />
                            <span className="text-[14px] font-medium text-text-primary">
                              Yellow and above (Watch)
                            </span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-primary bg-primary/5 rounded-lg cursor-pointer">
                          <input
                          type="radio"
                          name="alertLevel"
                          defaultChecked
                          className="w-4 h-4 text-primary focus:ring-primary border-border" />
                        
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-alert-orange" />
                            <span className="text-[14px] font-medium text-text-primary">
                              Orange and above (Alert)
                            </span>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-page">
                          <input
                          type="radio"
                          name="alertLevel"
                          className="w-4 h-4 text-primary focus:ring-primary border-border" />
                        
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-alert-red" />
                            <span className="text-[14px] font-medium text-text-primary">
                              Red only (Emergency)
                            </span>
                          </div>
                        </label>
                      </div>
                    </section>
                  </div>
                }

                {activeTab === 'sessions' &&
                <div className="space-y-6 animate-in fade-in">
                    <h3 className="text-[16px] font-bold text-text-primary mb-4">
                      Active Sessions
                    </h3>

                    <div className="flex items-center justify-between p-4 border border-primary bg-primary/5 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Monitor className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <div className="font-bold text-text-primary text-[14px] flex items-center gap-2">
                            Mac OS · Safari{' '}
                            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Current
                            </span>
                          </div>
                          <div className="text-[13px] text-text-secondary mt-1">
                            Kigali, Rwanda · IP: 197.243.x.x
                          </div>
                          <div className="text-[13px] text-text-secondary">
                            Active now
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-4">
                        <Smartphone className="w-6 h-6 text-text-secondary mt-1" />
                        <div>
                          <div className="font-bold text-text-primary text-[14px]">
                            iOS · AI Vital App
                          </div>
                          <div className="text-[13px] text-text-secondary mt-1">
                            Kigali, Rwanda · IP: 197.243.x.x
                          </div>
                          <div className="text-[13px] text-text-secondary">
                            Last active: 2 hours ago
                          </div>
                        </div>
                      </div>
                      <button className="text-[13px] font-semibold text-alert-red hover:bg-alert-red/10 px-3 py-1.5 rounded transition-colors">
                        Terminate
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>);

}