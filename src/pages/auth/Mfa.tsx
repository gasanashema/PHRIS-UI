import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../../components/auth/Logo';
export function Mfa() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const isComplete = code.every((digit) => digit !== '');
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(false);
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleVerify = () => {
    if (code.join('') === '123456') {
      navigate('/redirect');
    } else {
      setError(true);
    }
  };
  return (
    <div className="min-h-screen bg-section flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-card p-12 flex flex-col items-center text-center">
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

        <div className="flex gap-3 mb-6">
          {code.map((digit, index) =>
          <input
            key={index}
            ref={(el) => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-14 h-16 text-center text-[24px] font-bold rounded-lg border ${error ? 'border-alert-red bg-alert-red/5 text-alert-red focus:ring-alert-red' : 'border-border bg-page text-text-primary focus:border-primary focus:ring-1 focus:ring-primary'} focus:outline-none transition-colors`} />

          )}
        </div>

        {error ?
        <p className="text-[14px] text-alert-red font-medium mb-6">
            Invalid code. 2 attempts remaining.
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
              strokeDasharray="75, 100"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            
            </svg>
            <span className="text-[14px] text-text-secondary">
              Code expires in 04:32
            </span>
          </div>
        }

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className={`w-full h-12 text-[15px] font-semibold rounded-lg transition-colors mb-6 ${isComplete ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}>
          
          Verify & Continue
        </button>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button className="text-[14px] text-primary hover:underline font-medium">
            Resend code via SMS
          </button>
          <span className="text-border">|</span>
          <button className="text-[14px] text-primary hover:underline font-medium">
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