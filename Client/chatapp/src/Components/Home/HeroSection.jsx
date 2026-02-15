import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import chatPreview from "../../assets/chat-preview.png";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] animate-pulse-glow pointer-events-none" />

      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col-reverse items-center gap-12 px-6 lg:flex-row lg:gap-16">
        {/* Chat preview */}
        <div className="relative flex-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="glass-card p-3 max-w-lg mx-auto lg:mx-0">
            <img
              src={chatPreview}
              alt="ConvoX chat application interface preview"
              className="w-full rounded-xl"
            />
          </div>
          {/* Floating glow behind image */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/20 blur-3xl rounded-full" />
        </div>

        {/* Hero text */}
        <div className="flex-1 text-center lg:text-left animate-fade-in-up pt-12 lg:pt-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-card/40 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Now in public beta</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">Real-time messaging.</span>
            <br />
            <span className="glow-text">Built for speed.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground lg:max-w-lg">
            Secure, scalable, and lightning-fast. ConvoX delivers end-to-end encrypted conversations with sub-100ms latency worldwide.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link to="/signup">
              <Button variant="glow" size="lg" className="gap-2 px-8 text-base">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            </Link>
            <Button variant="glass" size="lg" className="text-base">
              View Demo
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
            <div>
              <p className="font-display text-2xl font-bold text-foreground">10M+</p>
              <p className="text-xs text-muted-foreground">Messages daily</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-display text-2xl font-bold text-foreground">99.9%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-display text-2xl font-bold text-foreground">&lt;50ms</p>
              <p className="text-xs text-muted-foreground">Latency</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
