import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  bigint,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 50 }),
  role: mysqlEnum("role", ["user", "admin", "venue_owner"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const cities = mysqlTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  image: text("image"),
  venueCount: int("venueCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  description: text("description"),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const venues = mysqlTable("venues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  address: varchar("address", { length: 500 }).notNull(),
  cityId: bigint("cityId", { mode: "number", unsigned: true }).notNull(),
  province: varchar("province", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
  subcategories: json("subcategories").$type<string[]>(),
  occasionTags: json("occasionTags").$type<string[]>(),
  phone: varchar("phone", { length: 50 }),
  website: text("website"),
  email: varchar("email", { length: 320 }),
  instagram: varchar("instagram", { length: 100 }),
  priceRange: mysqlEnum("priceRange", ["$", "$$", "$$$", "$$$$"]).default("$$"),
  cuisineType: varchar("cuisineType", { length: 100 }),
  dressCode: varchar("dressCode", { length: 100 }),
  features: json("features").$type<string[]>(),
  hours: json("hours").$type<Record<string, string>>(),
  acceptsReservations: boolean("acceptsReservations").default(true),
  reservationLink: text("reservationLink"),
  minPartySize: int("minPartySize").default(1),
  maxPartySize: int("maxPartySize").default(20),
  image: text("image"),
  gallery: json("gallery").$type<string[]>(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: int("reviewCount").default(0),
  avgCostPerPerson: int("avgCostPerPerson"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  isVerified: boolean("isVerified").default(false),
  yelpBusinessId: varchar("yelpBusinessId", { length: 255 }),
  stripeConnectId: varchar("stripeConnectId", { length: 255 }),
  commissionRate: decimal("commissionRate", { precision: 4, scale: 2 }).default("8.00"),
  cancellationPolicy: mysqlEnum("cancellationPolicy", ["free", "24h_full", "48h_full", "72h_full", "24h_90", "24h_80", "non_refundable"]).default("24h_full"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const deals = mysqlTable("deals", {
  id: serial("id").primaryKey(),
  venueId: bigint("venueId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  code: varchar("code", { length: 50 }),
  discountType: mysqlEnum("discountType", ["percentage", "fixed_amount", "free_item", "bogo"]).default("percentage"),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }),
  minSpend: int("minSpend"),
  maxDiscount: int("maxDiscount"),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  daysOfWeek: json("daysOfWeek").$type<string[]>(),
  timeStart: varchar("timeStart", { length: 10 }),
  timeEnd: varchar("timeEnd", { length: 10 }),
  totalLimit: int("totalLimit"),
  perUserLimit: int("perUserLimit").default(1),
  usageCount: int("usageCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const reservations = mysqlTable("reservations", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  venueId: bigint("venueId", { mode: "number", unsigned: true }).notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  time: varchar("time", { length: 10 }).notNull(),
  duration: int("duration").default(120),
  partySize: int("partySize").notNull(),
  partyName: varchar("partyName", { length: 255 }),
  occasion: varchar("occasion", { length: 100 }),
  specialRequests: text("specialRequests"),
  guestName: varchar("guestName", { length: 255 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  guestPhone: varchar("guestPhone", { length: 50 }),
  status: mysqlEnum("status", ["pending", "confirmed", "declined", "cancelled", "no_show", "completed"]).default("pending").notNull(),
  depositRequired: boolean("depositRequired").default(false),
  depositAmount: int("depositAmount"),
  depositPaid: boolean("depositPaid").default(false),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  totalAmount: int("totalAmount"),
  confirmationEmailSent: boolean("confirmationEmailSent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  confirmedAt: timestamp("confirmedAt"),
  cancelledAt: timestamp("cancelledAt"),
});

export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  venueId: bigint("venueId", { mode: "number", unsigned: true }).notNull(),
  reservationId: bigint("reservationId", { mode: "number", unsigned: true }),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  foodRating: int("foodRating"),
  serviceRating: int("serviceRating"),
  ambianceRating: int("ambianceRating"),
  valueRating: int("valueRating"),
  isVerified: boolean("isVerified").default(false),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const favorites = mysqlTable("favorites", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  venueId: bigint("venueId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const itineraryPlans = mysqlTable("itineraryPlans", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  cityId: bigint("cityId", { mode: "number", unsigned: true }).notNull(),
  occasion: varchar("occasion", { length: 100 }),
  totalDuration: varchar("totalDuration", { length: 50 }),
  estimatedCost: int("estimatedCost"),
  image: text("image"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const itineraryItems = mysqlTable("itineraryItems", {
  id: serial("id").primaryKey(),
  planId: bigint("planId", { mode: "number", unsigned: true }).notNull(),
  venueId: bigint("venueId", { mode: "number", unsigned: true }).notNull(),
  order: int("order").notNull(),
  timeOfDay: varchar("timeOfDay", { length: 50 }),
  duration: varchar("duration", { length: 50 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contactMessages = mysqlTable("contactMessages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const waitlist = mysqlTable("waitlist", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  city: varchar("city", { length: 100 }),
  userType: mysqlEnum("userType", ["user", "venue_owner", "both"]).default("user"),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type City = typeof cities.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type ItineraryPlan = typeof itineraryPlans.$inferSelect;
