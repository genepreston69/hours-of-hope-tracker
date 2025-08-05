import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');

interface NotificationRequest {
  reportId: string;
  reportType: 'incident' | 'director';
  reportData: any;
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  if (!twilioSid || !twilioToken) {
    console.log('Twilio not configured, skipping SMS');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    console.log(`Attempting to send SMS to: ${to}`);
    const auth = btoa(`${twilioSid}:${twilioToken}`);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: '+18884169408',
        To: to,
        Body: message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio SMS error:', error);
      return { success: false, error: error };
    }

    console.log(`SMS sent successfully to: ${to}`);
    return { success: true };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Attempting to send email to: ${to}`);
    const { error } = await resend.emails.send({
      from: 'Recovery Point <notifications@rpwv.org>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: JSON.stringify(error) };
    }

    console.log(`Email sent successfully to: ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

function generateEmailContent(reportType: string, reportData: any): { subject: string; html: string } {
  const isIncident = reportType === 'incident';
  const subject = `New ${isIncident ? 'Incident Report' : 'Director Report'} Submitted`;
  
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: ${isIncident ? '#dc2626' : '#059669'};">
            ${isIncident ? '🚨 Incident Report' : '📊 Director Report'} Submitted
          </h2>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Report Details:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${isIncident ? `
                <li><strong>Incident Type:</strong> ${reportData.incident_type || 'N/A'}</li>
                <li><strong>Location:</strong> ${reportData.location || 'N/A'}</li>
                <li><strong>Date:</strong> ${reportData.incident_date || 'N/A'}</li>
                <li><strong>Severity:</strong> ${reportData.severity_level || 'N/A'}</li>
              ` : `
                <li><strong>Program:</strong> ${reportData.program_name || 'N/A'}</li>
                <li><strong>Reporter:</strong> ${reportData.reporter_name || 'N/A'}</li>
                <li><strong>Report Date:</strong> ${reportData.report_date || 'N/A'}</li>
              `}
              <li><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p style="margin: 20px 0;">
            A new ${reportType} report has been submitted and is ready for review.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')}/dashboard" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Report Dashboard
            </a>
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
  
  return { subject, html };
}

function generateSMSContent(reportType: string, reportData: any): string {
  const isIncident = reportType === 'incident';
  
  if (isIncident) {
    return `🚨 New Incident Report: ${reportData.incident_type || 'Unknown'} at ${reportData.location || 'Unknown location'} - Severity: ${reportData.severity_level || 'Unknown'}. Review needed.`;
  } else {
    return `📊 New Director Report from ${reportData.reporter_name || 'Unknown'} - ${reportData.program_name || 'Unknown program'}. Review needed.`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportId, reportType, reportData }: NotificationRequest = await req.json();

    console.log(`Processing notifications for ${reportType} report: ${reportId}`);

    // Get notification recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from('notification_recipients')
      .select('*')
      .eq(reportType === 'incident' ? 'incident_reports_enabled' : 'director_reports_enabled', true);

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch recipients' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { subject, html } = generateEmailContent(reportType, reportData);
    const smsMessage = generateSMSContent(reportType, reportData);

    const notificationPromises = [];
    let emailDelay = 0;

    for (const recipient of recipients || []) {
      // Send email if enabled
      if (recipient.email_enabled && recipient.email) {
        const currentDelay = emailDelay;
        emailDelay += 1000; // Add 1 second delay between emails to avoid rate limits
        
        notificationPromises.push(
          (async () => {
            // Add delay to avoid rate limiting
            if (currentDelay > 0) {
              await new Promise(resolve => setTimeout(resolve, currentDelay));
            }
            const result = await sendEmail(recipient.email, subject, html);
            
            // Log the attempt
            await supabase.from('notification_logs').insert({
              report_id: reportId,
              report_type: reportType,
              recipient_email: recipient.email,
              notification_type: 'email',
              status: result.success ? 'sent' : 'failed',
              sent_at: result.success ? new Date().toISOString() : null,
              error_message: result.success ? null : result.error || 'Failed to send email'
            });

            return { type: 'email', recipient: recipient.email, success: result.success };
          })()
        );
      }

      // Send SMS if enabled
      if (recipient.sms_enabled && recipient.phone) {
        notificationPromises.push(
          (async () => {
            const result = await sendSMS(recipient.phone, smsMessage);
            
            // Log the attempt
            await supabase.from('notification_logs').insert({
              report_id: reportId,
              report_type: reportType,
              recipient_email: recipient.email,
              recipient_phone: recipient.phone,
              notification_type: 'sms',
              status: result.success ? 'sent' : 'failed',
              sent_at: result.success ? new Date().toISOString() : null,
              error_message: result.success ? null : result.error || 'Failed to send SMS'
            });

            return { type: 'sms', recipient: recipient.phone, success: result.success };
          })()
        );
      }
    }

    const results = await Promise.all(notificationPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Notifications sent: ${successful} successful, ${failed} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successful, 
      failed: failed,
      details: results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-notifications function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});