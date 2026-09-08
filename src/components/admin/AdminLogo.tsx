import React from 'react';
import { Shield, Activity } from 'lucide-react';
interface AdminLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}
export function AdminLogo({
  variant = 'dark',
  className = ''
}: AdminLogoProps) {
  const isLight = variant === 'light';
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative w-8 h-8 flex items-center justify-center shrink-0`}>
        
        <Shield
          className={`w-8 h-8 ${isLight ? 'text-white' : 'text-admin'}`}
          strokeWidth={1.5} />
        
        <Activity
          className={`absolute w-4 h-4 ${isLight ? 'text-admin-accent' : 'text-admin-accent'}`}
          strokeWidth={3} />
        
      </div>
      <div className="flex flex-col">
        <span
          className={`text-xl font-bold leading-none tracking-tight ${isLight ? 'text-white' : 'text-admin-text'}`}>
          AI Vital
        </span>
      </div>
    </div>);

}