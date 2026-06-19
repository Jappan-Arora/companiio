import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { TRPCError } from "@trpc/server";

// Stripe is initialized lazily to avoid loading if not configured
let stripeInstance: any = null;
function getStripe() {
  if (stripeInstance) return stripeInstance;
  try {
    const Stripe = require("stripe");
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return null;
    stripeInstance = new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" });
    return stripeInstance;
  } catch {
    return null;
  }
}

export const stripeRouter = createRouter({
  // Create a payment intent for booking deposits
  createPaymentIntent: publicQuery
    .input(
      z.object({
        amount: z.number().int().min(100), // amount in cents, min $1
        currency: z.string().default("cad"),
        venueName: z.string(),
        bookingId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not configured",
        });
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: input.amount,
          currency: input.currency,
          automatic_payment_methods: { enabled: true },
          metadata: {
            venueName: input.venueName,
            bookingId: input.bookingId,
            platform: "companiio",
          },
        });

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message || "Failed to create payment intent",
        });
      }
    }),

  // Create a connected account for venue onboarding (Stripe Connect)
  createConnectAccount: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        businessName: z.string(),
        country: z.string().default("CA"),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not configured",
        });
      }

      try {
        const account = await stripe.accounts.create({
          type: "express",
          country: input.country,
          email: input.email,
          business_type: "individual",
          business_profile: {
            name: input.businessName,
            url: "https://companiio.com",
            product_description: "Restaurant and venue services",
          },
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });

        // Create account onboarding link
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "https://companiio.com/dashboard",
          return_url: "https://companiio.com/dashboard?stripe=success",
          type: "account_onboarding",
        });

        return {
          accountId: account.id,
          onboardingUrl: accountLink.url,
        };
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message || "Failed to create Connect account",
        });
      }
    }),

  // Transfer commission to venue (after deal is redeemed)
  transferToVenue: publicQuery
    .input(
      z.object({
        amount: z.number().int().min(1), // in cents
        connectedAccountId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not configured",
        });
      }

      try {
        const transfer = await stripe.transfers.create({
          amount: input.amount,
          currency: "cad",
          destination: input.connectedAccountId,
          description: input.description,
        });

        return {
          transferId: transfer.id,
          status: transfer.status,
        };
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message || "Transfer failed",
        });
      }
    }),

  // Get Stripe publishable key (safe to share with frontend)
  getPublishableKey: publicQuery.query(() => {
    return {
      key: process.env.STRIPE_PUBLISHABLE_KEY || null,
    };
  }),

  // Calculate commission (Companiio takes 5%)
  calculateCommission: publicQuery
    .input(
      z.object({
        dealValue: z.number().int().positive(), // in cents
      })
    )
    .query(({ input }) => {
      const platformFeePercent = 5; // 5% commission
      const stripeFeePercent = 2.9; // Stripe processing fee
      const stripeFixedFee = 30; // 30 cents fixed

      const platformFee = Math.round(input.dealValue * (platformFeePercent / 100));
      const stripeFee = Math.round(input.dealValue * (stripeFeePercent / 100)) + stripeFixedFee;
      const venueReceives = input.dealValue - platformFee - stripeFee;

      return {
        dealValue: input.dealValue,
        platformFee,
        platformFeePercent,
        stripeFee,
        venueReceives,
        breakdown: {
          gross: `$${(input.dealValue / 100).toFixed(2)}`,
          companiioTakes: `$${(platformFee / 100).toFixed(2)} (${platformFeePercent}%)`,
          stripeTakes: `$${(stripeFee / 100).toFixed(2)}`,
          venueGets: `$${(venueReceives / 100).toFixed(2)}`,
        },
      };
    }),
});
