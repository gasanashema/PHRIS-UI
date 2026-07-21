import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/auth/Logo';
export function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setIsSent(true);
  };
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-card p-12 flex flex-col items-center text-center">
        <Logo className="mb-8" />

        {!isSent ?
        <>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
              <Lock className="w-6 h-6 text-primary" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm">?</span>
              </div>
            </div>

            <h1 className="text-[30px] font-bold text-text-primary mb-3">
              Forgot Your Password?
            </h1>

            <p className="text-[15px] text-text-secondary mb-8 leading-relaxed">
              Enter your registered email address and we will send you a secure
              reset link.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@rbc.gov.rw"
              className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[15px]"
              required />
            

              <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-lg transition-colors">
              
                Send Reset Link
              </button>
            </form>
          </> :

        <>
            <div className="w-12 h-12 bg-alert-green/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-alert-green" />
            </div>

            <h1 className="text-[30px] font-bold text-text-primary mb-3">
              Reset Link Sent
            </h1>

            <p className="text-[15px] text-text-secondary mb-8 leading-relaxed">
              We sent a password reset link to{' '}
              <span className="font-medium text-text-primary">{email}</span>.
              Check your inbox and click the link within 30 minutes.
            </p>

            <div className="w-full space-y-4">
              <button className="w-full h-12 bg-white border border-primary text-primary hover:bg-section text-[15px] font-semibold rounded-lg transition-colors">
                Open Gmail
              </button>

              <button className="text-[14px] text-primary hover:underline font-medium">
                Resend email
              </button>
            </div>
          </>
        }

        <div className="mt-8 pt-6 border-t border-border w-full">
          <Link
            to="/login"
            className="text-[14px] text-text-secondary hover:text-text-primary transition-colors font-medium">
            
            ← Back to Sign In
          </Link>

          {isSent &&
          <p className="text-[13px] text-text-secondary mt-6">
              Did not receive it? Check your spam folder or contact your system
              administrator.
            </p>
          }
        </div>
      </div>
    </div>);

}