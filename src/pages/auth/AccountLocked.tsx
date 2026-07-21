import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock } from 'lucide-react';
import { Logo } from '../../components/auth/Logo';
export function AccountLocked() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-card p-12 flex flex-col items-center text-center">
        <Logo className="mb-8" />

        <div className="w-16 h-16 bg-alert-red/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-alert-red" />
        </div>

        <h1 className="text-[30px] font-bold text-text-primary mb-3">
          Account Temporarily Locked
        </h1>

        <p className="text-[15px] text-text-secondary mb-8 leading-relaxed">
          Your account has been locked after 5 failed login attempts. For
          security, access is suspended for 30 minutes.
        </p>

        <div className="flex items-center gap-2 text-alert-red bg-alert-red/5 px-6 py-3 rounded-lg mb-8 border border-alert-red/20">
          <Clock className="w-5 h-5" />
          <span className="text-[15px] font-bold tracking-wide">
            Account unlocks in 28:14
          </span>
        </div>

        <div className="w-full space-y-4 mb-8">
          <button className="w-full h-12 bg-white border border-primary text-primary hover:bg-section text-[15px] font-semibold rounded-lg transition-colors">
            Contact System Administrator
          </button>

          <Link
            to="/reset-password"
            className="block text-[14px] text-primary hover:underline font-medium">
            
            Reset Password Instead
          </Link>
        </div>

        <div className="bg-page border border-border rounded-lg p-4 text-left">
          <p className="text-[13px] text-text-secondary leading-relaxed">
            <strong className="text-text-primary font-semibold">
              Security Tip:
            </strong>{' '}
            If you did not attempt these logins, your credentials may be
            compromised. Contact your administrator immediately.
          </p>
        </div>
      </div>
    </div>);

}