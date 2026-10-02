import { Activity } from 'lucide-react';
interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}
export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const isLight = variant === 'light';
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isLight ? 'bg-white/20' : 'bg-section'}`}>
        
        <Activity
          className={`w-6 h-6 ${isLight ? 'text-white' : 'text-primary'}`} />
        
      </div>
      <div className="flex flex-col">
        <span
          className={`text-xl font-bold leading-none ${isLight ? 'text-white' : 'text-primary-dark'}`}>
          
          AI Vital
        </span>
        <span
          className={`text-xs font-medium leading-none mt-1 ${isLight ? 'text-white/80' : 'text-text-secondary'}`}>
          
          Rwanda Health Intelligence Platform
        </span>
      </div>
    </div>);

}