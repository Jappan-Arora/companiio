import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reservations, venues } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const reservationRouter = createRouter({
  create: publicQuery
    .input(z.object({
      venueId: z.number(), date: z.string(), time: z.string(), partySize: z.number().min(1).max(50),
      partyName: z.string().optional(), occasion: z.string().optional(), specialRequests: z.string().optional(),
      guestName: z.string(), guestEmail: z.string().email(), guestPhone: z.string(),
      duration: z.number().default(120), depositRequired: z.boolean().default(false), depositAmount: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user?.id || 1;
      const result = await db.insert(reservations).values({
        userId, venueId: input.venueId, date: input.date, time: input.time, partySize: input.partySize,
        partyName: input.partyName, occasion: input.occasion, specialRequests: input.specialRequests,
        guestName: input.guestName, guestEmail: input.guestEmail, guestPhone: input.guestPhone,
        duration: input.duration, depositRequired: input.depositRequired, depositAmount: input.depositAmount, status: "confirmed",
      });
      return { success: true, reservationId: Number(result[0].insertId) };
    }),

  myReservations: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user?.id;
    if (!userId) return [];
    return db.select({
      id: reservations.id, venueId: reservations.venueId, date: reservations.date, time: reservations.time,
      partySize: reservations.partySize, partyName: reservations.partyName, occasion: reservations.occasion,
      status: reservations.status, specialRequests: reservations.specialRequests, guestName: reservations.guestName,
      guestEmail: reservations.guestEmail, guestPhone: reservations.guestPhone, depositRequired: reservations.depositRequired,
      depositPaid: reservations.depositPaid, totalAmount: reservations.totalAmount, createdAt: reservations.createdAt,
      confirmedAt: reservations.confirmedAt, venueName: venues.name, venueSlug: venues.slug, venueImage: venues.image,
      venueAddress: venues.address, venuePhone: venues.phone,
    }).from(reservations).innerJoin(venues, eq(reservations.venueId, venues.id))
      .where(eq(reservations.userId, userId)).orderBy(desc(reservations.createdAt));
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const results = await db.select({
      id: reservations.id, venueId: reservations.venueId, date: reservations.date, time: reservations.time,
      partySize: reservations.partySize, partyName: reservations.partyName, occasion: reservations.occasion,
      status: reservations.status, specialRequests: reservations.specialRequests, guestName: reservations.guestName,
      guestEmail: reservations.guestEmail, guestPhone: reservations.guestPhone, depositRequired: reservations.depositRequired,
      depositPaid: reservations.depositPaid, depositAmount: reservations.depositAmount, totalAmount: reservations.totalAmount,
      createdAt: reservations.createdAt, confirmedAt: reservations.confirmedAt, cancelledAt: reservations.cancelledAt,
      venueName: venues.name, venueSlug: venues.slug, venueImage: venues.image, venueAddress: venues.address, venuePhone: venues.phone,
    }).from(reservations).innerJoin(venues, eq(reservations.venueId, venues.id))
      .where(eq(reservations.id, input.id)).limit(1);
    return results[0] || null;
  }),

  cancel: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.update(reservations).set({ status: "cancelled", cancelledAt: new Date() }).where(eq(reservations.id, input.id));
    return { success: true };
  }),

  getTimeSlots: publicQuery.input(z.object({ venueId: z.number(), date: z.string(), partySize: z.number() })).query(async () => {
    const slots: string[] = [];
    for (let h = 11; h <= 14; h++) for (const m of ['00', '30']) slots.push(`${h}:${m}`);
    for (let h = 17; h <= 21; h++) for (const m of ['00', '30']) slots.push(`${h}:${m}`);
    return slots.map(time => ({ time, available: Math.random() > 0.3 }));
  }),
});
