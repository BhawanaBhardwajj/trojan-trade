import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // If there's a hook secret, verify the webhook
    if (hookSecret) {
      const payload = await req.text();
      const headers = Object.fromEntries(req.headers);
      const wh = new Webhook(hookSecret);
      
      const {
        user,
        email_data: { token, token_hash, email_action_type },
      } = wh.verify(payload, headers) as {
        user: { email: string };
        email_data: {
          token: string;
          token_hash: string;
          email_action_type: string;
        };
      };

      console.log("Sending OTP email via webhook to:", user.email);

      const emailResponse = await resend.emails.send({
        from: "Trojan Trade <onboarding@resend.dev>",
        to: [user.email],
        subject: email_action_type === 'signup' ? "Verify your Trojan Trade account" : "Reset your password",
        html: generateEmailHTML(token, email_action_type),
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Hook secret not configured" }), {
      status: 500,
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

function generateEmailHTML(token: string, type: string): string {
  const isSignup = type === 'signup';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isSignup ? 'Verify Your Email' : 'Reset Your Password'}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #990000 0%, #FFCC00 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Trojan Trade</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">USC Student Marketplace</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #990000; margin-top: 0; font-size: 24px;">
            ${isSignup ? 'Verify Your Account' : 'Reset Your Password'}
          </h2>
          
          <p style="color: #333; font-size: 16px; margin: 20px 0;">
            ${isSignup 
              ? 'Thank you for joining Trojan Trade! Use the verification code below to complete your registration.' 
              : 'You requested to reset your password. Use the code below to create a new password.'}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #f5f5f5; border: 2px dashed #990000; border-radius: 8px; padding: 20px; display: inline-block;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Your Verification Code
              </p>
              <p style="margin: 0; font-size: 32px; font-weight: bold; color: #990000; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${token}
              </p>
            </div>
          </div>
          
          <div style="background: #FFF8DC; border-left: 4px solid #FFCC00; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong style="color: #333;">⚠️ Security Note:</strong> This code will expire in ${isSignup ? '60 minutes' : '60 minutes'}. Never share this code with anyone.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 13px; margin: 5px 0;">
              If you didn't ${isSignup ? 'create an account' : 'request a password reset'} with Trojan Trade, you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>Fight On! ✌️</p>
          <p>&copy; ${new Date().getFullYear()} Trojan Trade. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

serve(handler);
