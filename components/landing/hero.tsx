import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background gradient effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-sans text-sm text-muted-foreground">AI-Powered Learning Platform</span>
        </div>

        <h1 className="text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Crack CA Exams with <span className="text-primary">Smart Practice</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty font-sans text-lg text-muted-foreground md:text-xl">
          Take mock tests, track performance, and improve your score with our comprehensive suite of practice tools.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="group font-sans text-base bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "10K+", label: "Active Students" },
            { value: "50K+", label: "Mock Tests Taken" },
            { value: "85%", label: "Pass Rate" },
            { value: "4.9", label: "Student Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-sans text-3xl font-bold text-foreground md:text-4xl">{stat.value}</div>
              <div className="mt-1 font-sans text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
