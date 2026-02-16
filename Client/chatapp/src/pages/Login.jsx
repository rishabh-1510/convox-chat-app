import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight, Lock, Mail, Zap, Shield, Users } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { toast } from "sonner";
import api from "../services/api";
const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      if(!email || !password ){
        toast.error("Fill all the fields properly");
        return;
      }
      setLoading(true);
      const res=await api.post("/auth/login", { email,password });
      console.log(res)
      toast.success(`Welcome Back ${res.data.user.firstName}`);
      navigate('/')

    }
    catch(error){
      console.log(error);
      console.log(error.response?.data);

      toast.error(error.response.data.message)
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold tracking-tight">ConvoX</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your conversations.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-border bg-secondary/50 pl-10 placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-border bg-secondary/50 pl-10 placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full gap-2 bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-sm font-semibold shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Right — Marketing Panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(228,76%,20%)] via-[hsl(240,50%,12%)] to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(228,76%,30%,0.3),transparent_60%)]" />

        <div className="relative z-10 flex max-w-md flex-col items-center px-10 text-center">
          {/* Floating chat illustration */}
          <div className="mb-10 w-full space-y-3">
            {/* Mock chat bubbles */}
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-border/30 bg-card/80 px-5 py-3 text-sm backdrop-blur-sm">
                Hey team! The new release is live 🚀
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] px-5 py-3 text-sm text-primary-foreground">
                Amazing work! Deployment was smooth ✨
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-border/30 bg-card/80 px-5 py-3 text-sm backdrop-blur-sm">
                Let's sync tomorrow at 10am?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] px-5 py-3 text-sm text-primary-foreground">
                Sounds good! See you then 👋
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Connect with your team,{" "}
            <span className="bg-gradient-to-r from-[hsl(228,76%,60%)] to-[hsl(252,70%,55%)] bg-clip-text text-transparent">
              instantly.
            </span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Secure, real-time messaging trusted by thousands of teams worldwide.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, label: "Real-time" },
              { icon: Shield, label: "Encrypted" },
              { icon: Users, label: "Teams" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/40 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm"
              >
                <item.icon className="h-3.5 w-3.5 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
