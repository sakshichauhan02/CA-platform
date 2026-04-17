import { FileText, BarChart3, ClipboardCheck } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Mock Tests",
    description:
      "Practice with thousands of exam-style questions covering all CA levels. Our AI adapts difficulty based on your performance to maximize learning efficiency.",
  },
  {
    icon: BarChart3,
    title: "Skill Analysis",
    description:
      "Get deep insights into your strengths and weaknesses across all subjects. Track your progress with detailed analytics and personalized recommendations.",
  },
  {
    icon: FileText,
    title: "PDF Reports",
    description:
      "Receive comprehensive performance reports with topic-wise breakdowns, improvement suggestions, and comparison with top performers.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
            Our platform combines cutting-edge AI technology with proven exam preparation 
            strategies to help you achieve your CA qualification goals.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 font-sans text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 font-sans text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
