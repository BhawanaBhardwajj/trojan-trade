import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Za-z]/.test(pass) || !/[0-9]/.test(pass)) {
      setPasswordError('Password must contain letters and numbers');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(token, password);

      if (error) {
        if (error.message.includes('invalid') || error.message.includes('expired')) {
          toast.error('This link is invalid or has expired. Request a new reset email.');
        } else {
          toast.error(error.message || 'Failed to reset password. Please try again.');
        }
        return;
      }

      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      toast.error('Service unavailable, please retry shortly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[hsl(var(--usc-beige))] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 md:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[hsl(var(--usc-cardinal))]">
              Password Updated!
            </h1>
            <p className="text-muted-foreground">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
          </div>

          <Link to="/login">
            <Button className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
              Go to Log In
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
          <h1 className="text-3xl font-bold text-[hsl(var(--usc-cardinal))]">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
            disabled={loading || !password || !confirmPassword || !!passwordError}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="text-[hsl(var(--usc-cardinal))] hover:underline font-medium">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
