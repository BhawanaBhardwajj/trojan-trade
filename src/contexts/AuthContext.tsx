import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  lastOTP: string | null;
  signupWithPassword: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  verifySignupOTP: (email: string, code: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  sendOTP: (email: string, isSignup?: boolean) => Promise<{ error: Error | null }>;
  verifyOTP: (email: string, code: string, fullName?: string) => Promise<{ error: Error | null }>;
  loginWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (token: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastOTP, setLastOTP] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signupWithPassword = async (email: string, password: string, fullName: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Generate 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code in database
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute expiry
      
      const { error: codeError } = await supabase
        .from('verification_codes')
        .insert({
          email: normalizedEmail,
          code: code,
          type: 'signup',
          expires_at: expiresAt.toISOString(),
        });

      if (codeError) throw codeError;

      // Send OTP email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: normalizedEmail,
          code: code,
          type: 'signup',
        },
      });

      if (emailError) throw emailError;

      // Store email and password temporarily for later signup
      setLastOTP(code);
      
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const verifySignupOTP = async (email: string, code: string, password: string, fullName: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Verify the OTP code from database
      const { data: verificationData, error: verifyError } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('code', code)
        .eq('type', 'signup')
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (verifyError || !verificationData) {
        throw new Error('Invalid or expired verification code');
      }

      // Mark code as used
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', verificationData.id);

      // Now create the actual user account
      const { error: signupError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signupError) {
        // If user already exists, try to sign them in instead
        if (signupError.message?.includes('already') || signupError.status === 422) {
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
          if (loginError) throw new Error('Account exists but password is incorrect. Please login instead.');
        } else {
          throw signupError;
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { error };
    }
  };

  const sendOTP = async (email: string, isSignup: boolean = false) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { error };
    }
  };

  const verifyOTP = async (email: string, code: string, fullName?: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: code,
        type: 'email'
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { error };
    }
  };

  const loginWithPassword = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return { error };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        loading,
        lastOTP,
        signupWithPassword,
        verifySignupOTP,
        sendOTP,
        verifyOTP,
        loginWithPassword,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};