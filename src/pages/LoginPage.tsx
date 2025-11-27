import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithPassword, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false);

  const returnUrl = (location.state as any)?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnUrl);
    }
  }, [isAuthenticated, navigate, returnUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await loginWithPassword(email, password);

      if (error) {
        if (error.message.includes("not found") || error.message.includes("No account") || error.message.includes("Invalid login credentials") || error.message.includes("invalid credentials")) {
          setShowNoAccountDialog(true);
        } else if (error.message.includes("verify your email") || error.message.includes("not verified")) {
          toast.error("Please verify your email. Check your inbox for the verification code.");
        } else if (error.message.includes("Invalid") || error.message.includes("incorrect")) {
          toast.error("Invalid email or password");
        } else if (error.message.includes("rate limit") || error.message.includes("Too many")) {
          toast.error("Too many requests. Try again in a few minutes.");
        } else {
          toast.error(error.message || "Failed to log in. Please try again.");
        }
        return;
      }

      toast.success("Logged in successfully!");
      navigate(returnUrl);
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
            Log In
          </h1>
          <p className="text-muted-foreground">
            Access your Trojan Trade account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[hsl(var(--usc-cardinal))] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
            disabled={loading || !email || !password}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[hsl(var(--usc-cardinal))] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </Card>

      <AlertDialog open={showNoAccountDialog} onOpenChange={setShowNoAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Account Not Found</AlertDialogTitle>
            <AlertDialogDescription>
              No account exists with this email address. Please sign up first to create an account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => {
                  setShowNoAccountDialog(false);
                  navigate("/signup");
                }}
                className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
              >
                Go to Sign Up
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
