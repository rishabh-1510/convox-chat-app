import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight, ArrowLeft, User, Mail, Lock } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../Components/ui/input-otp";
import api from "../services/api";
import { toast } from "sonner";
const Signup = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleStepOne = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/send-otp", { email });
      setStep(2);
      toast.success("OTP Send Successfully")
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      toast.error(message);
    }
    finally {
      setLoading(false);
    }
  };


  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        otp,
      });

      navigate("/login");
      toast.success("User created successfully now login")
    } catch (error) {
      console.log(error);
      toast.error("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold tracking-tight">ConvoX</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/70 p-8 shadow-2xl shadow-primary/5 backdrop-blur-xl">
          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Step {s}
                  </span>
                  {s === step && (
                    <span className="text-[11px] font-medium text-primary">
                      {s === 1 ? "Details" : "Verify"}
                    </span>
                  )}
                </div>
                <div className="h-1 rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] transition-all duration-500 ${s < step ? "w-full" : s === step ? "w-1/2" : "w-0"
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight">Create your account</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Start chatting with your team in seconds.
              </p>

              <form onSubmit={handleStepOne} className="mt-7 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">First name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 border-border bg-secondary/50 pl-10 placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Last name</label>
                    <Input
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 border-border bg-secondary/50 placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                    />
                  </div>
                </div>

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
                  <label className="text-xs font-medium text-muted-foreground">Password</label>
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
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <h2 className="text-2xl font-extrabold tracking-tight">Verify your email</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email || "you@example.com"}</span>
              </p>

              <form onSubmit={handleVerify} className="mt-8">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-12 rounded-xl border-border bg-secondary/50 text-lg font-semibold"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="mt-8 h-11 w-full gap-2 bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-sm font-semibold shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                >
                  Verify & Continue <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Didn't receive the code?{" "}
                  <button type="button" className="font-medium text-primary hover:underline">
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
