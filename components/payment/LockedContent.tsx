'use client';

import React from 'react';
import { PaymentButton } from './PaymentButton';

interface LockedContentProps {
  hasAccess: boolean;
  children: React.ReactNode;
}

export const LockedContent: React.FC<LockedContentProps> = ({ hasAccess, children }) => {
  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-blue-500/5 h-auto min-h-[600px]">
      {/* Blurred Background Mockup - Simplified to reduce noise */}
      <div className="filter blur-2xl opacity-10 select-none pointer-events-none p-8 space-y-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
          <div className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        </div>
      </div>

      {/* Paywall Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-white/20 dark:bg-slate-950/20 backdrop-blur-[2px] overflow-y-auto">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-500 relative">
          
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Unlock Your <span className="text-blue-600">Success Roadmap</span>
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-base font-medium">
            Join 2,000+ CA aspirants using our data-backed strategy.
          </p>

          <div className="flex flex-col gap-8 w-full">
            {/* Option 1 */}
            <div className="relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                LIMITED TIME OFFER
              </div>
              <div className="flex flex-col gap-3">
                <PaymentButton planId="report" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  PDF REPORT + ANALYSIS
                </span>
              </div>
            </div>
            
            {/* Option 2 */}
            <div className="relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                BEST VALUE
              </div>
              <div className="flex flex-col gap-3">
                <PaymentButton planId="mentoring" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  REPORT + 1:1 MENTORING
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              SECURE CHECKOUT • VALID TODAY ONLY
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
