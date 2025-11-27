-- Create table for storing OTP verification codes
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('signup', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  used BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_verification_codes_email_code ON public.verification_codes(email, code) WHERE used = false;
CREATE INDEX idx_verification_codes_expires ON public.verification_codes(expires_at) WHERE used = false;

-- Allow anyone to insert verification codes (needed for signup flow)
CREATE POLICY "Anyone can create verification codes"
  ON public.verification_codes
  FOR INSERT
  WITH CHECK (true);

-- Allow verification code validation (checking if code exists and is valid)
CREATE POLICY "Anyone can read verification codes for validation"
  ON public.verification_codes
  FOR SELECT
  USING (true);

-- Allow updating used status
CREATE POLICY "Anyone can mark codes as used"
  ON public.verification_codes
  FOR UPDATE
  USING (true);

-- Create function to clean up expired codes
CREATE OR REPLACE FUNCTION clean_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < now() OR (used = true AND created_at < now() - INTERVAL '1 day');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;