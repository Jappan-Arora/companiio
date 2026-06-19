import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookingRequests, venues } from "@db/schema";
import { TRPCError } from "@trpc/server";

const FROM_EMAIL = "contactcompaniio@gmail.com";
const FROM_NAME = "Companiio";

// Send email via SendGrid
async function sendEmail(payload: { to: string; subject: string; text: string; html: string }): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.log("[EMAIL - NO SENDGRID KEY] Would send to:", payload.to, "| Subject:", payload.subject);
    return true;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        reply_to: { email: FROM_EMAIL, name: FROM_NAME },
        subject: payload.subject,
        content: [
          { type: "text/plain", value: payload.text },
          { type: "text/html", value: payload.html },
        ],
      }),
    });
    return response.status >= 200 && response.status < 300;
  } catch (err: any) {
    console.error("[EMAIL ERROR]", err.message);
    return false;
  }
}

function createVenueEmail(params: {
  venueName: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  date: string;
  time: string;
  partySize: number;
  occasion?: string;
  specialRequests?: string;
}) {
  const subject = `New Booking Request - ${params.userName} - ${params.date} at ${params.time}`;

  const text = `
Hi ${params.venueName} Team,

You have a new booking request through Companiio!

GUEST DETAILS:
Name: ${params.userName}
Email: ${params.userEmail}
Phone: ${params.userPhone || "Not provided"}

BOOKING DETAILS:
Date: ${params.date}
Time: ${params.time}
Party Size: ${params.partySize}
${params.occasion ? `Occasion: ${params.occasion}` : ""}
${params.specialRequests ? `Special Requests: ${params.specialRequests}` : ""}

To confirm or decline this booking, log into your Partner Dashboard at https://companiio.com/dashboard

Reply to this email or contact us at contactcompaniio@gmail.com

---
Sent via Companiio - Canada's Venue Discovery Platform
https://companiio.com
  `.trim();

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A2E;background:#FAF8F5;padding:20px;">
<div style="max-width:480px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
<div style="background:#FF6B4A;padding:24px;text-align:center;"><h2 style="color:white;margin:0;font-size:18px;">Companiio</h2><p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:12px;">New Booking Request</p></div>
<div style="padding:24px;">
<h3 style="margin-top:0;font-size:16px;">${params.venueName}</h3>
<div style="background:#FAF8F5;border-radius:12px;padding:16px;margin:16px 0;">
<h4 style="margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:0.5px;">Guest Details</h4>
<p style="margin:4px 0;font-size:14px;"><strong>${params.userName}</strong></p>
<p style="margin:4px 0;font-size:13px;color:#666;">${params.userEmail}</p>
${params.userPhone ? `<p style="margin:4px 0;font-size:13px;color:#666;">${params.userPhone}</p>` : ""}
</div>
<div style="background:#FAF8F5;border-radius:12px;padding:16px;margin:16px 0;">
<h4 style="margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:0.5px;">Booking Details</h4>
<p style="margin:4px 0;font-size:14px;"><strong>Date:</strong> ${params.date}</p>
<p style="margin:4px 0;font-size:14px;"><strong>Time:</strong> ${params.time}</p>
<p style="margin:4px 0;font-size:14px;"><strong>Party Size:</strong> ${params.partySize}</p>
${params.occasion ? `<p style="margin:4px 0;font-size:14px;"><strong>Occasion:</strong> ${params.occasion}</p>` : ""}
${params.specialRequests ? `<p style="margin:4px 0;font-size:14px;"><strong>Special Requests:</strong> ${params.specialRequests}</p>` : ""}
</div>
<div style="text-align:center;margin:24px 0;">
<a href="https://companiio.com/dashboard" style="display:inline-block;background:#FF6B4A;color:white;text-decoration:none;padding:12px 32px;border-radius:12px;font-weight:600;font-size:14px;">Manage in Dashboard</a>
</div>
<p style="font-size:12px;color:#999;margin-top:16px;">Reply to this email with questions. Contact us at contactcompaniio@gmail.com</p>
</div></div></body></html>`;

  return { subject, text, html };
}

function createUserConfirmation(params: {
  userName: string;
  venueName: string;
  date: string;
  time: string;
  partySize: number;
}) {
  const subject = `Booking Request Sent - ${params.venueName}`;

  const text = `
Hi ${params.userName},

Your booking request has been sent to ${params.venueName}!

BOOKING DETAILS:
Venue: ${params.venueName}
Date: ${params.date}
Time: ${params.time}
Party Size: ${params.partySize}
Status: PENDING

The venue will review your request and respond within 24 hours.

Find more venues at https://companiio.com

---
Companiio - Never run out of plans
https://companiio.com
  `.trim();

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A2E;background:#FAF8F5;padding:20px;">
<div style="max-width:480px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
<div style="background:#FF6B4A;padding:24px;text-align:center;"><h2 style="color:white;margin:0;font-size:18px;">Companiio</h2><p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:12px;">Booking Confirmation</p></div>
<div style="padding:24px;">
<h3 style="margin-top:0;font-size:16px;">Hi ${params.userName},</h3>
<p style="font-size:14px;color:#666;">Your booking request has been sent to <strong>${params.venueName}</strong>!</p>
<div style="background:#FAF8F5;border-radius:12px;padding:16px;margin:16px 0;">
<p style="margin:4px 0;font-size:14px;"><strong>Venue:</strong> ${params.venueName}</p>
<p style="margin:4px 0;font-size:14px;"><strong>Date:</strong> ${params.date}</p>
<p style="margin:4px 0;font-size:14px;"><strong>Time:</strong> ${params.time}</p>
<p style="margin:4px 0;font-size:14px;"><strong>Party Size:</strong> ${params.partySize}</p>
<p style="margin:4px 0;font-size:14px;"><strong>Status:</strong> <span style="color:#f59e0b;">PENDING</span></p>
</div>
<p style="font-size:13px;color:#666;">The venue will review your request and respond within 24 hours.</p>
<div style="text-align:center;margin:24px 0;">
<a href="https://companiio.com/discover" style="display:inline-block;background:#FF6B4A;color:white;text-decoration:none;padding:12px 32px;border-radius:12px;font-weight:600;font-size:14px;">Discover More Venues</a>
</div>
<p style="font-size:12px;color:#999;margin-top:16px;">Questions? Contact us at contactcompaniio@gmail.com</p>
</div></div></body></html>`;

  return { subject, text, html };
}

export const bookingRequestRouter = createRouter({
  // Submit a booking request
  create: publicQuery
    .input(
      z.object({
        venueId: z.number().int().positive(),
        userName: z.string().min(1).max(255),
        userEmail: z.string().email().max(320),
        userPhone: z.string().max(50).optional(),
        date: z.string().max(20),
        time: z.string().max(10),
        partySize: z.number().int().min(1).max(100),
        occasion: z.string().max(100).optional(),
        specialRequests: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Get venue details
      const venueRows = await db
        .select()
        .from(venues)
        .where(eq(venues.id, input.venueId))
        .limit(1);

      const venue = venueRows[0];
      if (!venue) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Venue not found" });
      }

      // Save booking request
      const result = await db.insert(bookingRequests).values({
        venueId: input.venueId,
        userName: input.userName,
        userEmail: input.userEmail,
        userPhone: input.userPhone,
        date: input.date,
        time: input.time,
        partySize: input.partySize,
        occasion: input.occasion,
        specialRequests: input.specialRequests,
        status: "pending",
        emailSent: false,
      });

      const requestId = Number(result[0].insertId);

      // 1. Send email to VENUE
      const venueEmail = createVenueEmail({
        venueName: venue.name,
        userName: input.userName,
        userEmail: input.userEmail,
        userPhone: input.userPhone,
        date: input.date,
        time: input.time,
        partySize: input.partySize,
        occasion: input.occasion,
        specialRequests: input.specialRequests,
      });
      const venueEmailSent = await sendEmail({
        to: venue.email || FROM_EMAIL,
        subject: venueEmail.subject,
        text: venueEmail.text,
        html: venueEmail.html,
      });

      // 2. Send confirmation to USER
      const userEmail = createUserConfirmation({
        userName: input.userName,
        venueName: venue.name,
        date: input.date,
        time: input.time,
        partySize: input.partySize,
      });
      await sendEmail({
        to: input.userEmail,
        subject: userEmail.subject,
        text: userEmail.text,
        html: userEmail.html,
      });

      // Update email_sent status
      if (venueEmailSent) {
        await db
          .update(bookingRequests)
          .set({ emailSent: true })
          .where(eq(bookingRequests.id, requestId));
      }

      return {
        success: true,
        requestId,
        emailSent: venueEmailSent,
        venueName: venue.name,
      };
    }),

  // Get booking requests for a venue (partner dashboard)
  listByVenue: publicQuery
    .input(z.object({ venueId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = getDb();

      const requests = await db
        .select()
        .from(bookingRequests)
        .where(eq(bookingRequests.venueId, input.venueId))
        .orderBy(bookingRequests.createdAt);

      return requests;
    }),

  // Update booking status (confirm/decline)
  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "confirmed", "declined"]),
        venueResponse: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(bookingRequests)
        .set({
          status: input.status,
          venueResponse: input.venueResponse,
        })
        .where(eq(bookingRequests.id, input.id));

      return { success: true };
    }),
});
