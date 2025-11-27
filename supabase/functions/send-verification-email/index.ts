import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  token: string;
  type: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, type }: VerificationEmailRequest = await req.json();
    
    const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token}&type=${type}`;

    const emailResponse = await resend.emails.send({
      from: "Trojan Trade <onboarding@resend.dev>",
      to: [email],
      subject: type === 'signup' ? "Verify your USC email" : "Reset your password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${type === 'signup' ? 'Verify Email' : 'Reset Password'}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #990000 0%, #FFCC00 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Trojan Trade</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">USC Student Marketplace</p>
            </div>
            
            <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #990000; margin-top: 0; font-size: 24px;">
                ${type === 'signup' ? 'Verify Your USC Email' : 'Reset Your Password'}
              </h2>
              
              <p style="color: #333; font-size: 16px; margin: 20px 0;">
                ${type === 'signup' 
                  ? 'Thank you for joining Trojan Trade! Click the button below to verify your USC email address and start buying and selling with fellow Trojans.' 
                  : 'You requested to reset your password. Click the button below to create a new password for your Trojan Trade account.'}
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: #990000; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  ${type === 'signup' ? 'Verify Email' : 'Reset Password'}
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin: 20px 0;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #990000; font-size: 12px; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">
                ${confirmationUrl}
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 13px; margin: 5px 0;">
                  ${type === 'signup' 
                    ? 'This link will expire in 24 hours.' 
                    : 'This link will expire in 1 hour for security reasons.'}
                </p>
                <p style="color: #999; font-size: 13px; margin: 5px 0;">
                  If you didn't ${type === 'signup' ? 'create an account' : 'request a password reset'}, you can safely ignore this email.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Fight On! ✌️</p>
              <p>&copy; ${new Date().getFullYear()} Trojan Trade. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
