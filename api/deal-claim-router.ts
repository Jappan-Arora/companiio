import { z } from "zod";
import { eq, and, count } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { dealClaims, deals, venues } from "@db/schema";
import QRCode from "qrcode";

// Helper to generate unique QR code string
function generateQRCode(): string {
  return "CC" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export const dealClaimRouter = createRouter({
  // Claim a deal - creates a QR code
  claim: publicQuery
    .input(
      z.object({
        dealId: z.number().int().positive(),
        venueId: z.number().int().positive(),
        userId: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if deal exists and is active
      const dealRows = await db
        .select()
        .from(deals)
        .where(and(eq(deals.id, input.dealId), eq(deals.isActive, true)))
        .limit(1);

      if (dealRows.length === 0) {
        return { success: false, error: "Deal not found or inactive" };
      }

      const deal = dealRows[0];

      // Check if user already claimed this deal
      if (input.userId) {
        const existing = await db
          .select()
          .from(dealClaims)
          .where(
            and(
              eq(dealClaims.dealId, input.dealId),
              eq(dealClaims.userId, input.userId),
              eq(dealClaims.status, "claimed")
            )
          )
          .limit(1);

        if (existing.length > 0) {
          return { success: false, error: "You already claimed this deal" };
        }
      }

      // Check deal limits
      if (deal.totalLimit && deal.usageCount && deal.usageCount >= deal.totalLimit) {
        return { success: false, error: "This deal has reached its claim limit" };
      }

      // Generate QR code
      const qrString = generateQRCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      await db.insert(dealClaims).values({
        dealId: input.dealId,
        venueId: input.venueId,
        userId: input.userId || 0,
        qrCode: qrString,
        status: "claimed",
        expiresAt,
      });

      // Increment usage count
      await db
        .update(deals)
        .set({ usageCount: (deal.usageCount || 0) + 1 })
        .where(eq(deals.id, input.dealId));

      // Generate QR code image
      const qrImage = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: { dark: "#1A1A2E", light: "#FFFFFF" },
      });

      return {
        success: true,
        qrCode: qrString,
        qrImage,
        expiresAt: expiresAt.toISOString(),
      };
    }),

  // Verify/redeem a QR code (for venue staff)
  redeem: publicQuery
    .input(z.object({ qrCode: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const rows = await db
        .select()
        .from(dealClaims)
        .where(eq(dealClaims.qrCode, input.qrCode))
        .limit(1);

      if (rows.length === 0) {
        return { success: false, error: "Invalid QR code" };
      }

      const claim = rows[0];

      if (claim.status === "redeemed") {
        return { success: false, error: "This deal has already been redeemed" };
      }

      if (claim.status === "expired" || claim.status === "cancelled") {
        return { success: false, error: `This deal is ${claim.status}` };
      }

      if (new Date() > claim.expiresAt) {
        await db
          .update(dealClaims)
          .set({ status: "expired" })
          .where(eq(dealClaims.id, claim.id));
        return { success: false, error: "This deal has expired" };
      }

      // Redeem
      await db
        .update(dealClaims)
        .set({ status: "redeemed", redeemedAt: new Date() })
        .where(eq(dealClaims.id, claim.id));

      // Get deal and venue info
      const dealRows = await db.select().from(deals).where(eq(deals.id, claim.dealId)).limit(1);
      const venueRows = await db.select().from(venues).where(eq(venues.id, claim.venueId)).limit(1);

      return {
        success: true,
        deal: dealRows[0] || null,
        venue: venueRows[0] || null,
        redeemedAt: new Date().toISOString(),
      };
    }),

  // Get user's claimed deals
  myClaims: publicQuery
    .input(z.object({ userId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = getDb();

      const claims = await db
        .select()
        .from(dealClaims)
        .where(
          and(
            eq(dealClaims.userId, input.userId),
            eq(dealClaims.status, "claimed")
          )
        );

      // Enrich with deal and venue info
      const enriched = await Promise.all(
        claims.map(async (claim) => {
          const dealRows = await db.select().from(deals).where(eq(deals.id, claim.dealId)).limit(1);
          const venueRows = await db.select().from(venues).where(eq(venues.id, claim.venueId)).limit(1);
          return {
            ...claim,
            deal: dealRows[0] || null,
            venue: venueRows[0] || null,
            isExpired: new Date() > claim.expiresAt,
          };
        })
      );

      return enriched;
    }),

  // Stats for partner dashboard
  stats: publicQuery
    .input(z.object({ venueId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = getDb();

      const total = await db
        .select({ count: count() })
        .from(dealClaims)
        .where(eq(dealClaims.venueId, input.venueId));

      const redeemed = await db
        .select({ count: count() })
        .from(dealClaims)
        .where(
          and(eq(dealClaims.venueId, input.venueId), eq(dealClaims.status, "redeemed"))
        );

      return {
        totalClaims: total[0]?.count || 0,
        totalRedeemed: redeemed[0]?.count || 0,
        conversionRate: total[0]?.count ? Math.round(((redeemed[0]?.count || 0) / total[0].count) * 100) : 0,
      };
    }),
});
