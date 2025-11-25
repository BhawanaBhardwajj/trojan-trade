import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OTPInput } from "@/components/OTPInput";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupWithPassword, verifySignupOTP, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validateEmail = (email: string) => {
    const isValid = email.includes("@") && email.includes(".");
    if (!isValid && email) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
    return isValid;
  };

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Za-z]/.test(pass) || !/[0-9]/.test(pass)) {
      setPasswordError("Password must contain letters and numbers");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms and Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signupWithPassword(email, password, fullName);

      if (error) {
        if (error.message.includes("rate limit") || error.message.includes("Too many")) {
          toast.error("Too many requests. Try again in a few minutes.");
        } else if (error.message.includes("already exists")) {
          toast.error("Account already exists. Please log in.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error(error.message || "Failed to create account. Please try again.");
        }
        return;
      }

      setStep("verify");
      setResendCooldown(30);
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      toast.error("Service unavailable, please retry shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifySignupOTP(email, code);

      if (error) {
        if (error.message.includes("expired") || error.message.includes("Invalid")) {
          toast.error("Invalid or expired code.");
          setOtp(Array(6).fill(""));
        } else if (error.message.includes("attempt")) {
          toast.error("Too many attempts. Request a new code.");
          setOtp(Array(6).fill(""));
        } else {
          toast.error("Verification failed. Please try again.");
        }
        return;
      }

      toast.success("Account verified successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error("Service unavailable, please retry shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      const { error } = await signupWithPassword(email, password, fullName);

      if (error) {
        toast.error("Failed to resend code. Please try again.");
        return;
      }

      toast.success("New verification code sent!");
      setOtp(Array(6).fill(""));
      setResendCooldown(30);
    } catch (error: any) {
      toast.error("Service unavailable, please retry shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            {step === "form" ? "Sign Up" : "Verify Your Email"}
          </h1>
          <p className="text-muted-foreground">
            {step === "form" ? "Create your Trojan Trade account" : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Tommy Trojan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={(e) => validatePassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
              <p className="text-xs text-muted-foreground">At least 8 characters with letters and numbers</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-[hsl(var(--usc-cardinal))] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[hsl(var(--usc-cardinal))] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
              disabled={loading || !fullName || !email || !password || !confirmPassword || !agreedToTerms || !!emailError || !!passwordError}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-[hsl(var(--usc-cardinal))] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  We sent a code to
                  <br />
                  <span className="font-medium">{email}</span>
                </p>
              </div>

              <OTPInput value={otp} onChange={setOtp} />

              <div className="text-center text-sm text-muted-foreground">Code expires in 10 minutes</div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? "Verifying..." : "Verify and Create Account"}
            </Button>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOTP}
                disabled={loading || resendCooldown > 0}
                className="w-full"
              >
                {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Didn't get the code? Check your Junk or Other folder. You can request a new code.
              </p>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep("form");
                  setOtp(Array(6).fill(""));
                }}
                className="w-full"
              >
                Back to Sign Up
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
