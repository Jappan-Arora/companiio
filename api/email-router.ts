import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { TRPCError } from "@trpc/server";

const FROM_EMAIL = "contactcompaniio@gmail.com";
const FROM_NAME = "Companiio";

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.log("[EMAIL - NO API KEY] Would send:");
    console.log("  To:", payload.to);
    console.log("  Subject:", payload.subject);
    console.log("  Body preview:", payload.text.substring(0, 200));
    return true; // Simulate success for development
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

    if (response.status >= 200 && response.status < 300) {
      console.log("[EMAIL SENT] to:", payload.to, "| subject:", payload.subject);
      return true;
    }
    console.error("[EMAIL FAILED] Status:", response.status, await response.text());
    return false;
  } catch (err: any) {
    console.error("[EMAIL ERROR]", err.message);
    return false;
  }
}

// Booking request email to venue
function createBookingEmail(params: {
  venueName: string;
  venueEmail: string;
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
Party Size: ${params.partySize} ${params.partySize === 1 ? "person" : "people"}
${params.occasion ? `Occasion: ${params.occasion}` : ""}
${params.specialRequests ? `Special Requests: ${params.specialRequests}` : ""}

NEXT STEPS:
1. Log into your Companiio Partner Dashboard at https://companiio.com/dashboard
2. Confirm or decline this booking
3. The guest will receive an email with your response

Questions? Reply to this email or contact us at contactcompaniio@gmail.com

---
Sent via Companiio - Canada's Venue Discovery Platform
https://companiio.com
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1A1A2E; background: #FAF8F5; padding: 20px;">
<div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
  <div style="background: #FF6B4A; padding: 24px; text-align: center;">
    <h2 style="color: white; margin: 0; font-size: 18px;">Companiio</h2>
    <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 12px;">New Booking Request</p>
  </div>
  <div style="padding: 24px;">
    <h3 style="margin-top: 0; font-size: 16px;">${params.venueName}</h3>
    
    <div style="background: #FAF8F5; border-radius: 12px; padding: 16px; margin: 16px 0;">
      <h4 style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 0.5px;">Guest Details</h4>
      <p style="margin: 4px 0; font-size: 14px;"><strong>${params.userName}</strong></p>
      <p style="margin: 4px 0; font-size: 13px; color: #666;">${params.userEmail}</p>
      ${params.userPhone ? `<p style="margin: 4px 0; font-size: 13px; color: #666;">${params.userPhone}</p>` : ""}
    </div>
    
    <div style="background: #FAF8F5; border-radius: 12px; padding: 16px; margin: 16px 0;">
      <h4 style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 0.5px;">Booking Details</h4>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${params.date}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${params.time}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Party Size:</strong> ${params.partySize}</p>
      ${params.occasion ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Occasion:</strong> ${params.occasion}</p>` : ""}
      ${params.specialRequests ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Special Requests:</strong> ${params.specialRequests}</p>` : ""}
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://companiio.com/dashboard" style="display: inline-block; background: #FF6B4A; color: white; text-decoration: none; padding: 12px 32px; border-radius: 12px; font-weight: 600; font-size: 14px;">Manage in Dashboard</a>
    </div>
    
    <p style="font-size: 12px; color: #999; margin-top: 16px;">Reply to this email with questions. Questions? contactcompaniio@gmail.com</p>
  </div>
</div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

// Booking confirmation to user
function createConfirmationEmail(params: {
  userName: string;
  userEmail: string;
  venueName: string;
  date: string;
  time: string;
  partySize: number;
  status: "confirmed" | "declined" | "pending";
}) {
  const subject = params.status === "confirmed"
    ? `Booking Confirmed - ${params.venueName}`
    : params.status === "declined"
    ? `Booking Update - ${params.venueName}`
    : `Booking Request Sent - ${params.venueName}`;

  const text = `
Hi ${params.userName},

${params.status === "confirmed"
  ? `Great news! Your booking at ${params.venueName} has been CONFIRMED.`
  : params.status === "declined"
  ? `Unfortunately, ${params.venueName} is unable to accommodate your booking request.`
  : `Your booking request has been sent to ${params.venueName}.`}

BOOKING DETAILS:
Venue: ${params.venueName}
Date: ${params.date}
Time: ${params.time}
Party Size: ${params.partySize}
Status: ${params.status.toUpperCase()}

${params.status === "pending"
  ? "The venue will review your request and respond within 24 hours."
  : ""}

Find more venues at https://companiio.com

---
Companiio - Never run out of plans
https://companiio.com
  `.trim();

  return { subject, text, html: text.replace(/\n/g, "<br>") };
}

export const emailRouter = createRouter({
  // Send booking request to venue
  sendBookingRequest: publicQuery
    .input(
      z.object({
        venueName: z.string(),
        venueEmail: z.string().email(),
        userName: z.string(),
        userEmail: z.string().email(),
        userPhone: z.string().optional(),
        date: z.string(),
        time: z.string(),
        partySize: z.number().int().positive(),
        occasion: z.string().optional(),
        specialRequests: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const email = createBookingEmail(input);
      const sent = await sendEmail({
        to: input.venueEmail,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });

      // Also send confirmation to user
      const userEmail = createConfirmationEmail({
        userName: input.userName,
        userEmail: input.userEmail,
        venueName: input.venueName,
        date: input.date,
        time: input.time,
        partySize: input.partySize,
        status: "pending",
      });
      await sendEmail({
        to: input.userEmail,
        subject: userEmail.subject,
        text: userEmail.text,
        html: userEmail.html,
      });

      return { success: sent };
    }),

  // Send booking status update (confirm/decline)
  sendStatusUpdate: publicQuery
    .input(
      z.object({
        userName: z.string(),
        userEmail: z.string().email(),
        venueName: z.string(),
        date: z.string(),
        time: z.string(),
        partySize: z.number(),
        status: z.enum(["confirmed", "declined"]),
      })
    )
    .mutation(async ({ input }) => {
      const email = createConfirmationEmail(input);
      const sent = await sendEmail({
        to: input.userEmail,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
      return { success: sent };
    }),

  // Test email (verify SendGrid is working)
  test: publicQuery
    .input(z.object({ to: z.string().email() }))
    .mutation(async ({ input }) => {
      const sent = await sendEmail({
        to: input.to,
        subject: "Companiio Test Email",
        text: "If you're seeing this, SendGrid is working! Your booking emails are ready.",
        html: "<p>If you're seeing this, <strong>SendGrid is working!</strong> Your booking emails are ready.</p>",
      });
      return { success: sent };
    }),
});
