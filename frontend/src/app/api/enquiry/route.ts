import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  workEmail: z.string().email('Please enter a valid work email address'),
  company: z.string().optional(),
  website: z.string().optional(),
  servicesNeeded: z.array(z.string()).default([]),
  businessChallenge: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy to proceed',
  }),
  website_hp: z.string().optional(), // Honeypot
  turnstileToken: z.string().optional(),
  attribution: z.any().optional(),
});

async function verifyTurnstileToken(token?: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey || !token) return true; // Gracefully bypass if Turnstile is not active

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });
    const outcome = await res.json();
    return outcome.success === true;
  } catch {
    return true; // Fail open in development
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Honeypot check
    if (body.website_hp && body.website_hp.trim().length > 0) {
      // Silently return success to mislead spambots
      return NextResponse.json({ success: true, message: 'Enquiry received' });
    }

    // 2. Validate input schema
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 3. Optional Turnstile validation
    const isHuman = await verifyTurnstileToken(data.turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, message: 'Bot verification failed. Please try again.' },
        { status: 403 }
      );
    }

    // 4. Email dispatch with Resend (if API key configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const toEmail = process.env.ENQUIRY_NOTIFICATION_EMAIL || 'hello@thunspark.agency';

      await resend.emails.send({
        from: 'ThunSpark Notifications <onboarding@resend.dev>',
        to: toEmail,
        subject: `New Growth Enquiry from ${data.name} (${data.company || 'Direct'})`,
        html: `
          <h2>New Strategy Call Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Work Email:</strong> ${data.workEmail}</p>
          <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
          <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
          <p><strong>Services Needed:</strong> ${data.servicesNeeded.join(', ') || 'General growth review'}</p>
          <p><strong>Primary Challenge:</strong> ${data.businessChallenge || 'Not specified'}</p>
          <p><strong>Budget Range:</strong> ${data.budgetRange || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
          <p><strong>Notes:</strong><br />${(data.message || 'None').replace(/\n/g, '<br />')}</p>
          <hr />
          <h3>Attribution Telemetry</h3>
          <pre style="background: #f4f4f4; padding: 10px; border-radius: 4px;">${JSON.stringify(
            data.attribution || {},
            null,
            2
          )}</pre>
        `,
      });
    } else {
      console.log('⚡ [DEV] Lead enquiry received with attribution:', JSON.stringify(data, null, 2));
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you. We have received your inquiry and will respond within 24 hours.',
    });
  } catch (error: any) {
    console.error('Error handling enquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
