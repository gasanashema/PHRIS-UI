import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../../components/auth/Logo';
import { useApp } from '../../store/AppStore';
import type { Role } from '../../types';

const MAX_ATTEMPTS = 3;

function pendingRole(stateRole?: Role): Role {
  if (stateRole) return stateRole;
  try {
    const r = sessionStorage.getItem('aivital-pending-role');
    if (r) return r as Role;
  } catch {
    /* storage unavailable */
  }
  return 'epi';
}

export function Mfa() {
  const location = useLocation() as {state?: {role?: Role;};};
  const { actions } = useApp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(272);
  const [resent, setResent] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const isComplete = code.every((digit) => digit !== '');

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const handleChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      // Paste of a full code
      const next = digits.slice(0, 6).split('');
      setCode([...next, ...Array(6 - next.length).fill('')]);
      inputRefs.current[Math.min(5, next.length)]?.focus();
      setError(false);
      return;
    }
    const newCode = [...code];
    newCode[index] = digits;
    setCode(newCode);
    setError(false);
    if (digits !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && isComplete) handleVerify();
  };
  const handleVerify = () => {
    if (seconds === 0) {
      setError(true);
      return;
    }
    if (code.join('') === '123456') {
      const role = pendingRole(location.state?.role);
      actions.login(role);
      navigate('/redirect');
    } else {
      const used = attempts + 1;
      setAttempts(used);
      setError(true);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      if (used >= MAX_ATTEMPTS) navigate('/locked');
    }
  };
  const resend = (channel: string) => {
    setSeconds(300);
    setAttempts(0);
    setError(false);
    setResent(channel);
  };
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return (
    <div className="min-h-screen bg-section flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-card p-8 sm:p-12 flex flex-col items-center text-center">
        <Logo className="mb-8" />

        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>

        <h1 className="text-[30px] font-bold text-text-primary mb-3">
          Two-Factor Verification
        </h1>

        <p className="text-[15px] text-text-secondary mb-8 leading-relaxed">
          We sent a 6-digit verification code to your phone +250 78X XXX XXX and
          email. Enter it below to continue.
        </p>

        <div className="flex gap-2 sm:gap-3 mb-6">
          {code.map((digit, index) =>
          <input
            key={index}
            ref={(el) => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            aria-label={`Digit ${index + 1}`}
            maxLength={index === 0 ? 6 : 1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-[24px] font-bold rounded-lg border ${error ? 'border-alert-red bg-alert-red/5 text-alert-red focus:ring-alert-red' : 'border-border bg-page text-text-primary focus:border-primary focus:ring-1 focus:ring-primary'} focus:outline-none transition-colors`} />

          )}
        </div>

        {error ?
        <p className="text-[14px] text-alert-red font-medium mb-6">
            {seconds === 0 ?
          'This code has expired. Request a new one below.' :
          `Invalid code. ${MAX_ATTEMPTS - attempts} attempt${MAX_ATTEMPTS - attempts === 1 ? '' : 's'} remaining.`}
          </p> :

        <div className="flex items-center gap-2 mb-6">
            <svg
            className="w-4 h-4 text-primary transform -rotate-90"
            viewBox="0 0 36 36">

              <path
              className="text-border"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />

              <path
              className="text-primary"
              strokeWidth="3"
              strokeDasharray={`${Math.round(seconds / 300 * 100)}, 100`}
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />

            </svg>
            <span className="text-[14px] text-text-secondary">
              {seconds > 0 ? `Code expires in ${mm}:${ss}` : 'Code expired'}
            </span>
          </div>
        }

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className={`w-full h-12 text-[15px] font-semibold rounded-lg transition-colors mb-3 ${isComplete ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}>

          Verify & Continue
        </button>
        <p className="text-[12px] text-text-secondary mb-6">
          Prototype: use code <span className="font-mono font-bold text-text-primary">123456</span>
        </p>

        {resent &&
        <p className="text-[13px] text-alert-green font-medium mb-3">
            New code sent via {resent} (simulated).
          </p>
        }
        <div className="flex items-center justify-center gap-4 mb-8">
          <button onClick={() => resend('SMS')} className="text-[14px] text-primary hover:underline font-medium">
            Resend code via SMS
          </button>
          <span className="text-border">|</span>
          <button onClick={() => resend('email')} className="text-[14px] text-primary hover:underline font-medium">
            Resend code via Email
          </button>
        </div>

        <Link
          to="/login"
          className="text-[14px] text-text-secondary hover:text-text-primary transition-colors">

          ← Back to login
        </Link>
      </div>
    </div>);

}
