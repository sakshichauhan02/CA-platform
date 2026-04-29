'use client';

import React, { useState } from 'react';
import { PRICING_PLANS, PlanType, simulatePayment } from '@/lib/pricing';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  planId: PlanType;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  planId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const plan = PRICING_PLANS[planId];

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await simulatePayment(planId);
      if (response.success) {
        router.push(response.redirectUrl);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      // We don't set loading false here because we're navigating
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`
        relative px-10 py-5 rounded-[1.5rem] font-black transition-all duration-300
        active:scale-95 hover:scale-[1.02]
        flex items-center justify-center gap-3 overflow-hidden group w-full
        disabled:opacity-70
        ${planId === 'report' 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40' 
          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40'}
      `}
    >
      <span className="relative z-10">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          `Get ${planId === 'report' ? 'Detailed Report' : 'Full Mentorship'} — ₹${plan.price}`
        )}
      </span>
      {!isLoading && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      )}
      
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </button>
  );
};

