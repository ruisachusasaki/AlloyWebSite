import { google, calendar_v3 } from "googleapis";
import { addMinutes, startOfDay, endOfDay, format, setHours, setMinutes, subMinutes } from "date-fns";
import { bookingStorage } from "./bookingStorage";

const MEETING_DURATION = 30;
const BUFFER_BEFORE = 45;
const BUFFER_AFTER = 15;

const CALENDAR_IDS = [
  "ruisasaki0@gmail.com",
  "rui@themediaoptimizers.com",
  "rui@boostmode.com",
];

const OWNER_EMAIL = process.env.GOOGLE_OWNER_EMAIL || "ruisasaki0@gmail.com";

const WORKING_HOURS = {
  start: 9,
  end: 18,
};

function getOAuth2Client() {
  // Use environment variable for redirect URI, with fallback for the registered OAuth redirect
  const redirectUri = process.env.OAUTH_REDIRECT_URI || "https://systemforge-landing-page-ruisasaki.replit.app/api/oauth/callback";
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID?.trim(),
    process.env.GOOGLE_CLIENT_SECRET?.trim(),
    redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN?.trim(),
  });

  return oauth2Client;
}

function getCalendar() {
  const auth = getOAuth2Client();
  return google.calendar({ version: "v3", auth });
}

interface BusyPeriod {
  start: Date;
  end: Date;
}

export async function getAvailableSlots(date: Date): Promise<Array<{ time: string; displayTime: string; available: boolean }>> {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const busyPeriods: BusyPeriod[] = [];

  // Get local bookings from database (raw meeting times - buffer applied during slot check)
  try {
    const localBookings = await bookingStorage.getBookingsByDateRange(dayStart, dayEnd);
    for (const booking of localBookings) {
      busyPeriods.push({
        start: new Date(booking.meetingTime),
        end: new Date(booking.meetingEndTime),
      });
    }
  } catch (dbError) {
    console.error("Error fetching local bookings:", dbError);
  }

  // Also get Google Calendar busy times if configured
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      const calendar = getCalendar();
      const freeBusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: dayStart.toISOString(),
          timeMax: dayEnd.toISOString(),
          items: CALENDAR_IDS.map((id) => ({ id })),
        },
      });

      const calendars = freeBusyResponse.data.calendars || {};

      for (const calendarId of CALENDAR_IDS) {
        const calendarBusy = calendars[calendarId]?.busy || [];
        for (const period of calendarBusy) {
          if (period.start && period.end) {
            // Store raw event times - buffer applied during slot check
            busyPeriods.push({
              start: new Date(period.start),
              end: new Date(period.end),
            });
          }
        }
      }
    } catch (googleError) {
      console.error("Error fetching Google Calendar availability:", googleError);
    }
  }

  // Sort all busy periods
  busyPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Generate slots and check availability
  const slots: Array<{ time: string; displayTime: string; available: boolean }> = [];
  let currentTime = setMinutes(setHours(dayStart, WORKING_HOURS.start), 0);
  const workingEnd = setMinutes(setHours(dayStart, WORKING_HOURS.end), 0);

  while (currentTime < workingEnd) {
    const slotStart = currentTime;
    const slotEnd = addMinutes(slotStart, MEETING_DURATION);
    
    if (slotEnd > workingEnd) break;

    // For Google Calendar events, apply buffer when checking
    // For local bookings, buffer is already included in busyPeriods
    const bufferStart = subMinutes(slotStart, BUFFER_BEFORE);
    const bufferEnd = addMinutes(slotEnd, BUFFER_AFTER);

    const isAvailable = !busyPeriods.some((busy) => {
      // Check if the proposed slot (with buffer) overlaps with any busy period
      return bufferStart < busy.end && bufferEnd > busy.start;
    });

    const now = new Date();
    const isPast = slotStart <= now;

    slots.push({
      time: format(slotStart, "HH:mm"),
      displayTime: format(slotStart, "h:mm a"),
      available: isAvailable && !isPast,
    });

    currentTime = addMinutes(currentTime, 30);
  }

  return slots;
}

function generateDefaultSlots(date: Date): Array<{ time: string; displayTime: string; available: boolean }> {
  const slots: Array<{ time: string; displayTime: string; available: boolean }> = [];
  const dayStart = startOfDay(date);
  let currentTime = setMinutes(setHours(dayStart, WORKING_HOURS.start), 0);
  const workingEnd = setMinutes(setHours(dayStart, WORKING_HOURS.end), 0);
  const now = new Date();

  while (currentTime < workingEnd) {
    const slotEnd = addMinutes(currentTime, MEETING_DURATION);
    if (slotEnd > workingEnd) break;

    const isPast = currentTime <= now;

    slots.push({
      time: format(currentTime, "HH:mm"),
      displayTime: format(currentTime, "h:mm a"),
      available: !isPast,
    });

    currentTime = addMinutes(currentTime, 30);
  }

  return slots;
}

export async function createMeetingEvent(
  name: string,
  email: string,
  businessDescription: string,
  meetingTime: Date
): Promise<{ eventId: string; meetLink: string }> {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    console.log("Google Calendar credentials not configured, skipping event creation");
    return { eventId: "", meetLink: "" };
  }

  const calendar = getCalendar();
  const meetingEnd = addMinutes(meetingTime, MEETING_DURATION);

  const event: calendar_v3.Schema$Event = {
    summary: `SystemForge Discovery Call - ${name}`,
    description: `
Discovery call with ${name}

Business Description/Goals:
${businessDescription}

Contact: ${email}
    `.trim(),
    start: {
      dateTime: meetingTime.toISOString(),
      timeZone: "America/New_York",
    },
    end: {
      dateTime: meetingEnd.toISOString(),
      timeZone: "America/New_York",
    },
    attendees: [
      { email: OWNER_EMAIL },
      { email },
    ],
    conferenceData: {
      createRequest: {
        requestId: `systemforge-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: OWNER_EMAIL,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const eventId = response.data.id || "";
    const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || "";

    return { eventId, meetLink };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return { eventId: "", meetLink: "" };
  }
}

export async function sendNotificationEmail(
  name: string,
  email: string,
  businessDescription: string,
  meetingTime: Date,
  meetLink: string
): Promise<void> {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    console.log("Google credentials not configured, skipping email notification");
    return;
  }

  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: "v1", auth });

  const formattedTime = format(meetingTime, "EEEE, MMMM d, yyyy 'at' h:mm a");
  
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1a1a1a; margin-bottom: 24px;">New Meeting Scheduled</h1>
      
      <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">Contact Details</h2>
        <p style="margin: 8px 0; color: #4a4a4a;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 8px 0; color: #4a4a4a;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0; color: #4a4a4a;"><strong>Time:</strong> ${formattedTime}</p>
      </div>
      
      <div style="background: #f0f7ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px;">Business Description</h2>
        <p style="margin: 0; color: #4a4a4a; white-space: pre-wrap;">${businessDescription}</p>
      </div>
      
      ${meetLink ? `
      <a href="${meetLink}" style="display: inline-block; background: #0066ff; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Join Google Meet
      </a>
      ` : ''}
      
      <p style="margin-top: 24px; color: #888; font-size: 14px;">
        This meeting was scheduled via SystemForge website.
      </p>
    </div>
  `;

  const subject = `New Discovery Call Scheduled: ${name}`;
  
  const messageParts = [
    `From: "SystemForge" <${OWNER_EMAIL}>`,
    `To: ${OWNER_EMAIL}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlContent,
  ];
  
  const message = messageParts.join("\r\n");
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log("Email notification sent successfully via Gmail API");
  } catch (error) {
    console.error("Error sending notification email via Gmail API:", error);
  }
}
