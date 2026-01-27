import { Express, Request, Response } from "express";
import { z } from "zod";
import { format } from "date-fns";
import { getAvailableSlots, createMeetingEvent, sendNotificationEmail } from "./calendar";
import { storage } from "./storage";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  businessDescription: z.string().min(1, "Business description is required"),
  meetingTime: z.string().datetime(),
});

export function registerCalendarRoutes(app: Express) {
  app.get("/api/calendar/availability", async (req: Request, res: Response) => {
    try {
      const dateParam = req.query.date as string;
      
      if (!dateParam) {
        return res.status(400).json({ error: "Date parameter is required" });
      }

      const date = new Date(dateParam);
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const slots = await getAvailableSlots(date);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  app.post("/api/calendar/book", async (req: Request, res: Response) => {
    try {
      const validatedData = bookingSchema.parse(req.body);
      const meetingTime = new Date(validatedData.meetingTime);
      const meetingEndTime = new Date(meetingTime.getTime() + 30 * 60 * 1000);

      const availableSlots = await getAvailableSlots(meetingTime);
      const requestedSlot = format(meetingTime, "HH:mm");
      const slotInfo = availableSlots.find(slot => slot.time === requestedSlot);
      
      if (!slotInfo || !slotInfo.available) {
        return res.status(400).json({ 
          error: "Selected time slot is no longer available. Please choose another time." 
        });
      }

      let eventId = "";
      let meetLink = "";

      try {
        const result = await createMeetingEvent(
          validatedData.name,
          validatedData.email,
          validatedData.businessDescription,
          meetingTime
        );
        eventId = result.eventId;
        meetLink = result.meetLink;
      } catch (calendarError) {
        console.error("Calendar API error:", calendarError);
      }

      const booking = await storage.createBooking({
        name: validatedData.name,
        email: validatedData.email,
        businessDescription: validatedData.businessDescription,
        meetingTime,
        meetingEndTime,
      });

      if (eventId) {
        await storage.updateBookingWithEvent(booking.id, eventId, meetLink);
      }

      try {
        await sendNotificationEmail(
          validatedData.name,
          validatedData.email,
          validatedData.businessDescription,
          meetingTime,
          meetLink
        );
      } catch (emailError) {
        console.error("Email notification error:", emailError);
      }

      res.json({
        success: true,
        booking: {
          id: booking.id,
          meetingTime: meetingTime.toISOString(),
          meetLink,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });
}
