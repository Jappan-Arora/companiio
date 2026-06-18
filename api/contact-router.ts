import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactMessages, waitlist } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery.input(z.object({
    name: z.string().min(1), email: z.string().email(), subject: z.string().optional(), message: z.string().min(1),
  })).mutation(async ({ input }) => {
    await getDb().insert(contactMessages).values({ name: input.name, email: input.email, subject: input.subject, message: input.message });
    return { success: true };
  }),
  joinWaitlist: publicQuery.input(z.object({
    email: z.string().email(), city: z.string().optional(), userType: z.enum(["user", "venue_owner", "both"]).default("user"), message: z.string().optional(),
  })).mutation(async ({ input }) => {
    await getDb().insert(waitlist).values({ email: input.email, city: input.city, userType: input.userType, message: input.message });
    return { success: true };
  }),
});
