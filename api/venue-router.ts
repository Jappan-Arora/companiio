import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { venues, deals } from "@db/schema";
import { eq, and, like, or, sql, desc } from "drizzle-orm";

export const venueRouter = createRouter({
  list: publicQuery
    .input(z.object({
      cityId: z.number().optional(),
      categoryId: z.number().optional(),
      occasion: z.string().optional(),
      search: z.string().optional(),
      priceRange: z.string().optional(),
      featured: z.boolean().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(venues.isActive, true)];
      if (input.cityId) conditions.push(eq(venues.cityId, input.cityId));
      if (input.categoryId) conditions.push(eq(venues.categoryId, input.categoryId));
      if (input.occasion) conditions.push(sql`${venues.occasionTags} LIKE ${`%${input.occasion}%`}`);
      if (input.search) {
        const s = `%${input.search}%`;
        conditions.push(or(like(venues.name, s), like(venues.description, s), like(venues.neighborhood, s), like(venues.cuisineType, s))!);
      }
      if (input.priceRange) conditions.push(eq(venues.priceRange, input.priceRange as "$" | "$$" | "$$$" | "$$$$"));
      if (input.featured) conditions.push(eq(venues.isFeatured, true));

      return db.select().from(venues).where(and(...conditions))
        .orderBy(desc(venues.isFeatured), desc(venues.rating))
        .limit(input.limit).offset(input.offset);
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const v = await db.select().from(venues).where(and(eq(venues.slug, input.slug), eq(venues.isActive, true))).limit(1);
      if (!v[0]) return null;
      const venueDeals = await db.select().from(deals).where(and(eq(deals.venueId, v[0].id), eq(deals.isActive, true)));
      return { ...v[0], deals: venueDeals };
    }),

  featured: publicQuery
    .input(z.object({ cityId: z.number().optional(), limit: z.number().default(8) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(venues.isActive, true), eq(venues.isFeatured, true)];
      if (input?.cityId) conditions.push(eq(venues.cityId, input.cityId));
      return db.select().from(venues).where(and(...conditions))
        .orderBy(desc(venues.rating)).limit(input?.limit || 8);
    }),

  search: publicQuery
    .input(z.object({ query: z.string().min(1), cityId: z.number().optional(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = getDb();
      const s = `%${input.query}%`;
      const conditions = [eq(venues.isActive, true), or(like(venues.name, s), like(venues.description, s), like(venues.neighborhood, s), like(venues.cuisineType, s), like(venues.address, s))!];
      if (input.cityId) conditions.push(eq(venues.cityId, input.cityId));
      return db.select().from(venues).where(and(...conditions)).orderBy(desc(venues.rating)).limit(input.limit);
    }),

  surpriseMe: publicQuery
    .input(z.object({ cityId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(venues.isActive, true), sql`RAND() > 0.5`];
      if (input?.cityId) conditions.push(eq(venues.cityId, input.cityId));
      const results = await db.select().from(venues).where(and(...conditions)).orderBy(sql`RAND()`).limit(3);
      return results;
    }),
});
