export type PlanType = 'report' | 'mentoring';

export interface PricingPlan {
  id: PlanType;
  name: string;
  price: number;
  description: string;
}

export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  report: {
    id: 'report',
    name: 'PDF Report',
    price: 199,
    description: 'Get a comprehensive analysis of your performance in a downloadable PDF format.',
  },
  mentoring: {
    id: 'mentoring',
    name: 'PDF + 1:1 Mentoring',
    price: 299,
    description: 'Detailed PDF report plus a 30-minute personalized session with a CA mentor.',
  },
};

/**
 * Simulates a payment process.
 * In a real app, this would call a backend API to create a Razorpay/Stripe order.
 */
export const simulatePayment = async (planId: PlanType) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return a mock success response with a redirect URL
  return {
    success: true,
    redirectUrl: `/success?plan=${planId}`,
    message: "Payment simulation successful",
  };
};
