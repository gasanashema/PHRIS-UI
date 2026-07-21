import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldCheck as AdminIcon,
  MapPin,
  Microscope,
  BarChart3,
  Plug,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../../components/auth/Logo';

const demoAccounts = [
  {
    role: 'System Administrator',
    email: 'admin@rbc.gov.rw',
    route: '/admin',
    icon: AdminIcon
  },
  {
    role: 'District Health Officer',
    email: 'dho@huye.gov.rw',
    route: '/dho',
    icon: MapPin
  },
  {
    role: 'Epidemiologist',
    email: 'epi@rbc.gov.rw',
    route: '/epi',
    icon: Microscope
  },
  {
    role: 'Public Health Analyst',
    email: 'analyst@moh.gov.rw',
    route: '/analyst',
    icon: BarChart3
  },
  {
    role: 'Data Integration',
    email: 'integration@rbc.gov.rw',
    route: '/integration',
    icon: Plug
  }
];

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/mfa');
  };

  return (
    <div className="min-h-screen lg:h-screen bg-page flex font-sans overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white relative h-full overflow-y-auto">
        <div className="p-6 lg:p-8 pb-0">
          <Logo />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-4">
              <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.05em] mb-1 block">
                Welcome Back
              </span>
              <h1 className="text-[26px] font-bold text-text-primary mb-1">
                Sign in to AI Vital
              </h1>
              <p className="text-[14px] text-text-secondary">
                Access Rwanda's population health intelligence dashboard
              </p>
            </div>

            <div className="h-px bg-border w-full mb-4" />

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#374151] block">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-text-secondary" />
                  </div>
                  <input
                    type="email"
                    placeholder="your.email@rbc.gov.rw"
                    className="block w-full pl-9 pr-3 h-10 bg-page border border-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#374151] block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-text-secondary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="block w-full pl-9 pr-9 h-10 bg-page border border-border rounded-lg text-[14px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-[13px] text-text-secondary">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[13px] text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-lg transition-colors mt-1"
              >
                Sign In
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-4 border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-section hover:bg-primary/5 transition-colors"
                aria-expanded={showDemo}
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-text-primary">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Explore with a demo account
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-text-secondary transition-transform ${showDemo ? 'rotate-90' : ''}`}
                />
              </button>

              {showDemo && (
                <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white animate-in fade-in slide-in-from-top-2 max-h-[160px] overflow-y-auto">
                  {demoAccounts.map((acct) => (
                    <button
                      key={acct.route}
                      type="button"
                      onClick={() => navigate(acct.route)}
                      className="group flex items-center gap-2.5 p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-section group-hover:bg-white flex items-center justify-center text-primary shrink-0 transition-colors">
                        <acct.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-text-primary truncate">
                          {acct.role}
                        </div>
                        <div className="text-[11px] text-text-secondary truncate">
                          {acct.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 text-center">
              <span className="text-[14px] text-text-secondary">
                Don't have an account?{' '}
              </span>
              <Link
                to="/register"
                className="text-[14px] text-primary font-semibold hover:underline"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-primary-dark overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary opacity-90 z-10 mix-blend-multiply" />
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
          alt="Rwandan health professionals"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 flex flex-col h-full p-10 lg:p-12 justify-center w-full max-w-[720px] mx-auto">
          <h2 className="text-[32px] font-bold text-white leading-tight mb-10">
            "Protecting Rwanda's 14 million people through intelligent health
            surveillance"
          </h2>

          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="text-[28px] font-bold text-primary mb-1">
                30
              </div>
              <div className="text-[13px] font-medium text-text-secondary">
                Districts Monitored
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="text-[28px] font-bold text-primary mb-1">
                87%
              </div>
              <div className="text-[13px] font-medium text-text-secondary">
                AI Prediction Accuracy
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="text-[22px] font-bold text-primary mb-1 leading-tight mt-1">
                Real-time
              </div>
              <div className="text-[13px] font-medium text-text-secondary mt-1">
                Health Intelligence
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}