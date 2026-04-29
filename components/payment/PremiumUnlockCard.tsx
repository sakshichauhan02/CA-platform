'use client';

import React from 'react';
import { PaymentButton } from './PaymentButton';

export const PremiumUnlockCard = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-700 relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
      
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight relative z-10">
        Unlock Your <span className="text-blue-600">Success Roadmap</span>
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg md:text-xl font-medium max-w-xl mx-auto relative z-10">
        Join 2,000+ CA aspirants using our data-backed strategy.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto mb-12 relative z-10">
        {/* Option 1 */}
        <div className="flex-1 relative group">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-xl animate-pulse whitespace-nowrap">
            LIMITED TIME OFFER
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-lg">
            <div className="flex flex-col gap-4">
              <PaymentButton planId="report" />
              <span className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">
                PDF REPORT + ANALYSIS
              </span>
            </div>
          </div>
        </div>
        
        {/* Option 2 */}
        <div className="flex-1 relative group">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-xl whitespace-nowrap">
            BEST VALUE
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-lg">
            <div className="flex flex-col gap-4">
              <PaymentButton planId="mentoring" />
              <span className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">
                REPORT + 1:1 MENTORING
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100 dark:border-slate-800 text-[12px] text-slate-400 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 relative z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        SECURE CHECKOUT • VALID TODAY ONLY
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
    </div>
  );
};
