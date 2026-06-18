import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { deals, venues } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const dealRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select({
      id: deals.id, venueId: deals.venueId, title: deals.title, description: deals.description,
      code: deals.code, discountType: deals.discountType, discountValue: deals.discountValue,
      minSpend: deals.minSpend, maxDiscount: deals.maxDiscount, daysOfWeek: deals.daysOfWeek,
      timeStart: deals.timeStart, timeEnd: deals.timeEnd, perUserLimit: deals.perUserLimit,
      usageCount: deals.usageCount, venueName: venues.name, venueSlug: venues.slug, venueImage: venues.image,
    }).from(deals).innerJoin(venues, eq(deals.venueId, venues.id))
      .where(eq(deals.isActive, true)).orderBy(desc(deals.createdAt));
  }),
});
