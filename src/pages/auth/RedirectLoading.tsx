import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/auth/Logo';
import { useApp } from '../../store/AppStore';
import { ROLE_HOME } from '../../data/seed';

const MESSAGES: Record<string, string> = {
  admin: 'Loading system administration…',
  dho: 'Loading district alerts and risk map…',
  epi: 'Loading national disease surveillance…',
  analyst: 'Loading health indicators and risk scores…',
  integration: 'Loading data source connections…'
};

export function RedirectLoading() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [progress, setProgress] = useState(0);
  const role = state.user?.role;
  const target = role ? ROLE_HOME[role] : '/login';

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) navigate(target, { replace: true });
  }, [progress, navigate, target]);

  return (
    <div className="min-h-screen bg-section flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <Logo className="mb-12 transform scale-125" />

      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
      </div>

      <h2 className="text-[24px] font-bold text-text-primary mb-2">
        {state.user ? `Welcome, ${state.user.name.split(' ').slice(-1)[0]}` : 'Setting up your dashboard...'}
      </h2>

      <p className="text-[16px] text-text-secondary font-medium mb-16">
        {role ? MESSAGES[role] : 'Preparing your session…'}
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-75 ease-linear"
          style={{
            width: `${progress}%`
          }} />

      </div>

      <div className="absolute bottom-6 text-[12px] text-text-secondary font-medium">
        AI Vital Rwanda · Secure Session Active · © 2026
      </div>
    </div>);

}
