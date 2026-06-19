import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { venueRouter } from "./venue-router";
import { cityRouter } from "./city-router";
import { categoryRouter } from "./category-router";
import { reservationRouter } from "./reservation-router";
import { dealRouter } from "./deal-router";
import { contactRouter } from "./contact-router";
import { itineraryRouter } from "./itinerary-router";
import { dealClaimRouter } from "./deal-claim-router";
import { bookingRequestRouter } from "./booking-request-router";
import { stripeRouter } from "./stripe-router";
import { emailRouter } from "./email-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  venue: venueRouter,
  city: cityRouter,
  category: categoryRouter,
  reservation: reservationRouter,
  deal: dealRouter,
  contact: contactRouter,
  itinerary: itineraryRouter,
  dealClaim: dealClaimRouter,
  bookingRequest: bookingRequestRouter,
  stripe: stripeRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
