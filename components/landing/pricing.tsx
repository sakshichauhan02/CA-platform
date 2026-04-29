import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started with CA exam prep.",
    features: [
      "Access to basic mock tests",
      "Limited skill analysis",
      "Community forum access",
      "Basic progress tracking",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "PDF Report",
    price: "₹199",
    period: "one-time",
    description: "Comprehensive analysis of your exam readiness.",
    features: [
      "Everything in Free",
      "Detailed PDF performance report",
      "Topic-wise analysis",
      "Personalized study plan",
      "Weakness identification",
    ],
    cta: "Get Report",
    highlighted: true,
  },
  {
    name: "PDF + Mentoring",
    price: "₹299",
    period: "one-time",
    description: "Personal guidance to accelerate your preparation.",
    features: [
      "Everything in PDF Report",
      "1:1 mentoring session",
      "Expert strategy consultation",
      "Doubt clearing support",
      "Priority email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            Choose the plan that fits your preparation needs. Start free and upgrade anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.highlighted
                  ? "border-primary bg-card shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 font-sans text-xs font-medium text-primary-foreground">
                    Recommended
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-sans text-xl font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-sans text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="font-sans text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-3 font-sans text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-sans text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-8 w-full font-sans ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Link href="/login">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
