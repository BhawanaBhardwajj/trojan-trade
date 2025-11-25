import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const isValid = email.toLowerCase().endsWith('@usc.edu');
    if (!isValid && email) {
      setEmailError('Only @usc.edu email addresses are allowed.');
    } else {
      setEmailError('');
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await forgotPassword(email);

      if (error) {
        if (error.message.includes('Only @usc.edu')) {
          setEmailError('Only @usc.edu email addresses are allowed.');
        } else if (error.message.includes('rate limit') || error.message.includes('Too many')) {
          toast.error('Too many requests. Try again in a few minutes.');
        } else {
          toast.error(error.message || 'Failed to send reset email. Please try again.');
        }
        return;
      }

      setSubmitted(true);
      toast.success('If this USC email exists, a reset link has been sent.');
    } catch (error: any) {
      toast.error('Service unavailable, please retry shortly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[hsl(var(--usc-beige))] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 md:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[hsl(var(--usc-cardinal))]">
              Check Your Email
            </h1>
            <p className="text-muted-foreground">
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
          </div>

          <div className="bg-[hsl(var(--usc-gold))]/10 p-4 rounded-lg border border-[hsl(var(--usc-gold))]/20">
            <p className="text-sm">
              The link will expire in 15 minutes. Check your spam folder if you don't see it.
            </p>
          </div>

          <Link to="/login">
            <Button className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
              Back to Log In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <Link to="/login" className="inline-flex items-center text-sm text-[hsl(var(--usc-cardinal))] hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Log In
          </Link>

          <h1 className="text-3xl font-bold text-[hsl(var(--usc-cardinal))]">
            Forgot Password
          </h1>
          <p className="text-muted-foreground">
            Enter your USC email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">USC Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="trojans@usc.edu"
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

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
            disabled={loading || !email || !!emailError}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
