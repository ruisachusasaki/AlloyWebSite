import { db } from "./db";
import { bookings, type Booking, type InsertBooking } from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IBookingStorage {
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingWithEvent(id: number, googleEventId: string, googleMeetLink: string): Promise<Booking | null>;
  getBookingById(id: number): Promise<Booking | null>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
}

class BookingStorage implements IBookingStorage {
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async updateBookingWithEvent(id: number, googleEventId: string, googleMeetLink: string): Promise<Booking | null> {
    const [booking] = await db
      .update(bookings)
      .set({ googleEventId, googleMeetLink })
      .where(eq(bookings.id, id))
      .returning();
    return booking || null;
  }

  async getBookingById(id: number): Promise<Booking | null> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || null;
  }

  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.meetingTime, startDate),
          lte(bookings.meetingTime, endDate)
        )
      );
  }
}

export const bookingStorage = new BookingStorage();
