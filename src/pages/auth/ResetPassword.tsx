import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Check, Clock } from 'lucide-react';
import { Logo } from '../../components/auth/Logo';
import { useApp } from '../../store/AppStore';
export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const { actions } = useApp();
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const score = getPasswordStrength();
  const strengthColors = [
  'bg-border',
  'bg-alert-red',
  'bg-alert-orange',
  'bg-alert-yellow',
  'bg-alert-green'];

  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirm && score >= 3) {
      actions.toast('Password updated. Please sign in with your new password.');
      navigate('/login');
    }
  };
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-card p-12 flex flex-col items-center">
        <Logo className="mb-8" />

        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Key className="w-6 h-6 text-primary" />
        </div>

        <h1 className="text-[30px] font-bold text-text-primary mb-3 text-center">
          Create New Password
        </h1>

        <p className="text-[15px] text-text-secondary mb-8 leading-relaxed text-center">
          Your new password must be different from your previous 10 passwords.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[#374151]">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              required />
            

            <div className="pt-2">
              <div className="flex gap-1 h-1.5 mb-2">
                {[1, 2, 3, 4].map((segment) =>
                <div
                  key={segment}
                  className={`flex-1 rounded-full ${password.length > 0 && score >= segment ? strengthColors[score] : 'bg-border'}`} />

                )}
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-text-secondary">
                  Password strength:
                </span>
                <span
                  className={`text-[13px] font-bold ${password.length > 0 ? strengthColors[score].replace('bg-', 'text-') : 'text-text-secondary'}`}>
                  
                  {password.length > 0 ? strengthLabels[score] : 'None'}
                </span>
              </div>
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-2 text-[13px] ${password.length >= 12 ? 'text-alert-green' : 'text-text-secondary'}`}>
                  
                  <Check className="w-4 h-4" /> At least 12 characters
                </div>
                <div
                  className={`flex items-center gap-2 text-[13px] ${/[A-Z]/.test(password) ? 'text-alert-green' : 'text-text-secondary'}`}>
                  
                  <Check className="w-4 h-4" /> Uppercase letter
                </div>
                <div
                  className={`flex items-center gap-2 text-[13px] ${/[0-9]/.test(password) ? 'text-alert-green' : 'text-text-secondary'}`}>
                  
                  <Check className="w-4 h-4" /> Number
                </div>
                <div
                  className={`flex items-center gap-2 text-[13px] ${/[^A-Za-z0-9]/.test(password) ? 'text-alert-green' : 'text-text-secondary'}`}>
                  
                  <Check className="w-4 h-4" /> Special character
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[#374151]">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              required />
            
          </div>

          <button
            type="submit"
            disabled={password !== confirm || score < 3}
            className="w-full h-12 bg-primary hover:bg-primary-hover disabled:bg-border disabled:text-text-secondary text-white text-[15px] font-semibold rounded-lg transition-colors mt-2">
            
            Reset Password & Sign In
          </button>
        </form>

        <div className="mt-8 flex items-center gap-2 text-alert-orange bg-alert-orange/10 px-4 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span className="text-[13px] font-medium">
            This link expires in 28:45
          </span>
        </div>
      </div>
    </div>);

}