import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { itineraryPlans, itineraryItems, venues } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const itineraryRouter = createRouter({
  list: publicQuery
    .input(z.object({ cityId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(itineraryPlans.isActive, true)];
      if (input?.cityId) conditions.push(eq(itineraryPlans.cityId, input.cityId));
      return db.select().from(itineraryPlans).where(and(...conditions))
        .orderBy(desc(itineraryPlans.isFeatured));
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const plan = await db.select().from(itineraryPlans)
        .where(and(eq(itineraryPlans.slug, input.slug), eq(itineraryPlans.isActive, true)))
        .limit(1);
      if (!plan[0]) return null;
      const items = await db.select({
        id: itineraryItems.id, planId: itineraryItems.planId, venueId: itineraryItems.venueId,
        order: itineraryItems.order, timeOfDay: itineraryItems.timeOfDay, duration: itineraryItems.duration,
        note: itineraryItems.note,
        venueName: venues.name, venueSlug: venues.slug, venueImage: venues.image, venueAddress: venues.address,
        venueRating: venues.rating, venuePriceRange: venues.priceRange, venueCuisineType: venues.cuisineType,
        venuePhone: venues.phone, venueWebsite: venues.website,
      }).from(itineraryItems)
        .innerJoin(venues, eq(itineraryItems.venueId, venues.id))
        .where(eq(itineraryItems.planId, plan[0].id))
        .orderBy(itineraryItems.order);
      return { ...plan[0], items };
    }),
});
