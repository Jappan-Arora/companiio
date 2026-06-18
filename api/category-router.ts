import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder));
  }),
});
