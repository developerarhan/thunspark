import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, email, bookingDetails } = body as {
      leadId?: string;
      email?: string;
      bookingDetails?: {
        eventTitle?: string;
        date?: string;
        time?: string;
        bookingId?: string;
        url?: string;
      };
    };

    if (!leadId && !email) {
      return NextResponse.json(
        { error: 'A leadId or email is required to record a booking.' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        simulated: true,
        message: '[Dev] Database not connected. Simulated CRM booking recorded.',
      });
    }

    // Find the lead by ID or email
    let lead = null;
    if (leadId) {
      lead = await db.lead.findUnique({
        where: { id: leadId },
      });
    }

    if (!lead && email) {
      lead = await db.lead.findFirst({
        where: {
          email: {
            equals: email.trim().toLowerCase(),
            mode: 'insensitive',
          },
        },
      });
    }

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found in CRM.' },
        { status: 404 }
      );
    }

    const meetingContent = bookingDetails
      ? `📅 Strategy Call Scheduled on Cal.com\n` +
        (bookingDetails.date ? `Date: ${bookingDetails.date}\n` : '') +
        (bookingDetails.time ? `Time: ${bookingDetails.time}\n` : '') +
        (bookingDetails.eventTitle ? `Type: ${bookingDetails.eventTitle}\n` : '') +
        (bookingDetails.bookingId ? `Booking ID: ${bookingDetails.bookingId}\n` : '') +
        (bookingDetails.url ? `Link: ${bookingDetails.url}\n` : '')
      : 'Strategy Call scheduled via in-page Cal.com booking calendar.';

    // Update Lead stage to DISCOVERY, increment score, and log MEETING activity
    const [updatedLead, activity] = await db.$transaction([
      db.lead.update({
        where: { id: lead.id },
        data: {
          stage: 'DISCOVERY',
          score: { increment: 25 },
          lastActivity: new Date(),
        },
      }),
      db.activity.create({
        data: {
          leadId: lead.id,
          type: 'MEETING',
          title: 'Strategy Call Scheduled via Cal.com',
          content: meetingContent,
        },
      }),
    ]);

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${lead.id}`);

    console.log(`✅ [CRM Booking Sync] Lead ${lead.id} advanced to DISCOVERY. Meeting activity ${activity.id} created.`);

    return NextResponse.json({
      success: true,
      leadId: updatedLead.id,
      stage: updatedLead.stage,
      activityId: activity.id,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[CRM Record Booking Error]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
