import { Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Logo } from '../components/auth/Logo';
import { useApp } from '../store/AppStore';
import { ROLE_HOME } from '../data/seed';

export function NotFound() {
  const { pathname } = useLocation();
  const { state } = useApp();
  const home = state.user ? ROLE_HOME[state.user.role] : '/';
  return (
    <div className="min-h-screen bg-section flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-card p-10 flex flex-col items-center text-center">
        <Logo className="mb-8" />
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Compass className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-[26px] font-bold text-text-primary mb-2">Page not found</h1>
        <p className="text-[14px] text-text-secondary mb-2">
          There is no AI Vital screen at
        </p>
        <code className="text-[13px] bg-page border border-border rounded px-2 py-1 mb-8 break-all">
          {pathname}
        </code>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to={home}
            className="h-11 px-6 inline-flex items-center bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-lg">

            {state.user ? 'Back to my dashboard' : 'Back to home'}
          </Link>
          {!state.user &&
          <Link
            to="/login"
            className="h-11 px-6 inline-flex items-center border border-primary text-primary text-[14px] font-semibold rounded-lg hover:bg-primary/5">

              Sign in
            </Link>
          }
        </div>
      </div>
    </div>);

}
