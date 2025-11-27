import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPEmailRequest {
  email: string;
  code: string;
  type: 'signup' | 'password_reset';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, type }: OTPEmailRequest = await req.json();

    console.log(`Sending ${type} OTP to ${email}`);

    const subject = type === 'signup' 
      ? 'Verify Your Trojan Trade Account' 
      : 'Reset Your Trojan Trade Password';

    const html = generateEmailHTML(code, type);

    const emailResponse = await resend.emails.send({
      from: "Trojan Trade <noreply@trojan-trade.com>",
      to: [email],
      subject: subject,
      html: html,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending OTP email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateEmailHTML(code: string, type: string): string {
  const title = type === 'signup' ? 'Verify Your Account' : 'Reset Your Password';
  const message = type === 'signup'
    ? 'Thank you for signing up for Trojan Trade! Please use the verification code below to complete your registration:'
    : 'You requested to reset your password. Please use the code below to proceed:';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #9D1535 0%, #FFCC00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Trojan Trade</h1>
      </div>
      
      <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #9D1535; margin-top: 0;">${title}</h2>
        <p style="font-size: 16px; color: #555;">${message}</p>
        
        <div style="background: #f8f8f8; border: 2px solid #9D1535; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code:</p>
          <p style="font-size: 32px; font-weight: bold; color: #9D1535; letter-spacing: 8px; margin: 0;">${code}</p>
        </div>
        
        <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
        <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Trojan Trade. USC Student Marketplace.
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
