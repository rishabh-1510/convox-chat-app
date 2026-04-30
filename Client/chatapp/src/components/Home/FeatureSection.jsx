import { Zap, Shield, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time",
    description:
      "Messages delivered instantly with WebSocket connections. No polling, no delays — just pure speed.",
  },
  {
    icon: Shield,
    title: "Secure",
    description:
      "End-to-end encryption ensures your conversations stay private. Zero-knowledge architecture by default.",
  },
  {
    icon: Layers,
    title: "Scalable",
    description:
      "Built on distributed infrastructure that auto-scales to millions of concurrent connections effortlessly.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Why <span className="glow-text">ConvoX</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Everything you need for seamless team communication, nothing you don't.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card-hover p-8 text-center animate-fade-in-up border border-gray-400 rounded-md transition-transform duration-300 hover:scale-105"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
