import { MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">ConvoX</span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 ConvoX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;