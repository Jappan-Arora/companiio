import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cities } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const cityRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(cities).where(eq(cities.isActive, true))
      .orderBy(sql`CASE WHEN ${cities.name} = 'Vancouver' THEN 0 ELSE 1 END`, cities.name);
  }),
});
