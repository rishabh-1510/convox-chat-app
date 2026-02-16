import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "hsl(var(--background) / 0.75)",
        borderBottom: "1px solid hsl(var(--border) / 0.5)"
      }}
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "hsl(var(--primary))" }}
          >
            <MessageSquare
              className="h-5 w-5"
              style={{ color: "hsl(var(--background))" }}
            />
          </div>

          <span className="text-xl font-semibold tracking-tight">
            ConvoX
          </span>
        </div>

        {/* NAV LINKS */}
        <div className=" md:flex items-center gap-10">
          <a
            href="#features"
            className="text-sm opacity-70 hover:opacity-100 transition"
          >
            Features
          </a>

          <a
            href="#"
            className="text-sm opacity-70 hover:opacity-100 transition"
          >
            Pricing
          </a>

          <a
            href="#"
            className="text-sm opacity-70 hover:opacity-100 transition"
          >
            Docs
          </a>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button

              variant="ghost"
              size="sm"
              className="opacity-80 hover:opacity-100"
            >
              Log in
            </Button>
          </Link>

          <Link to="/signup">
            <Button
              size="sm"
              className="rounded-xl shadow-md"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--background))"
              }}
            >
              Sign up
            </Button>
          </Link>


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
