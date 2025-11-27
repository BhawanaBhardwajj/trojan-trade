-- Fix search path for security
DROP FUNCTION IF EXISTS clean_expired_verification_codes();

CREATE OR REPLACE FUNCTION clean_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < now() OR (used = true AND created_at < now() - INTERVAL '1 day');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;