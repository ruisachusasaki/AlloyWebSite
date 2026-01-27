import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  businessDescription: text("business_description").notNull(),
  meetingTime: timestamp("meeting_time").notNull(),
  meetingEndTime: timestamp("meeting_end_time").notNull(),
  googleEventId: varchar("google_event_id", { length: 255 }),
  googleMeetLink: varchar("google_meet_link", { length: 500 }),
  status: varchar("status", { length: 50 }).default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  googleEventId: true,
  googleMeetLink: true,
  status: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
