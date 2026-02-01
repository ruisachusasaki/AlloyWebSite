import { Express, Request, Response } from "express";
import { z } from "zod";
import { format } from "date-fns";
import { google } from "googleapis";
import { getAvailableSlots, createMeetingEvent, sendNotificationEmail } from "./calendar";
import { storage } from "./storage";

const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.send",
];

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

  // OAuth Setup Routes
  app.get("/api/oauth/setup", (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret) {
      return res.status(400).send(`
        <html>
        <head><title>OAuth Setup Error</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1 style="color: #dc3545;">Missing Credentials</h1>
          <p>Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your Replit Secrets first.</p>
        </body>
        </html>
      `);
    }

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/oauth/callback`;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: OAUTH_SCOPES,
      prompt: "consent",
    });

    res.send(`
      <html>
      <head>
        <title>Google OAuth Setup - ALLOY</title>
        <style>
          body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f8f9fa; }
          .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          h1 { color: #1a1a1a; margin-bottom: 20px; }
          p { color: #666; line-height: 1.6; }
          .btn { display: inline-block; background: #0066ff; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          .btn:hover { background: #0052cc; }
          .note { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Google OAuth Setup</h1>
          <p>Click the button below to authorize ALLOY to access your Google Calendar and Gmail for sending notifications.</p>
          <a href="${authUrl}" class="btn">Authorize with Google</a>
          <div class="note">
            <strong>Important:</strong> Make sure you've added this redirect URI to your Google Cloud Console OAuth credentials:<br>
            <code>${redirectUri}</code>
          </div>
        </div>
      </body>
      </html>
    `);
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error) {
      return res.status(400).send(`
        <html>
        <head><title>Authorization Failed</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1 style="color: #dc3545;">Authorization Failed</h1>
          <p>Error: ${error}</p>
          <p><a href="/api/oauth/setup">Try again</a></p>
        </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send(`
        <html>
        <head><title>No Authorization Code</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1 style="color: #dc3545;">No Authorization Code</h1>
          <p>No authorization code was received. <a href="/api/oauth/setup">Try again</a></p>
        </body>
        </html>
      `);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/oauth/callback`;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    try {
      const { tokens } = await oauth2Client.getToken(code);
      const refreshToken = tokens.refresh_token;

      res.send(`
        <html>
        <head>
          <title>Authorization Successful!</title>
          <style>
            body { font-family: -apple-system, sans-serif; max-width: 700px; margin: 50px auto; padding: 20px; background: #f8f9fa; }
            .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .success { background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            h1 { color: #28a745; margin: 0; }
            .token-box { background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 11px; word-break: break-all; margin: 20px 0; border: 1px solid #dee2e6; }
            .steps { background: #e7f3ff; padding: 20px; border-radius: 8px; }
            .step { margin: 10px 0; padding-left: 10px; }
            .copy-btn { background: #0066ff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 10px; }
            .copy-btn:hover { background: #0052cc; }
          </style>
          <script>
            function copyToken() {
              const token = document.getElementById('token').innerText;
              navigator.clipboard.writeText(token);
              document.getElementById('copyBtn').innerText = 'Copied!';
              setTimeout(() => { document.getElementById('copyBtn').innerText = 'Copy Token'; }, 2000);
            }
          </script>
        </head>
        <body>
          <div class="card">
            <div class="success">
              <h1>Authorization Successful!</h1>
            </div>
            <h2>Your Refresh Token:</h2>
            <div class="token-box" id="token">${refreshToken}</div>
            <button class="copy-btn" id="copyBtn" onclick="copyToken()">Copy Token</button>
            
            <div class="steps">
              <h3>Next Steps:</h3>
              <div class="step">1. Click "Copy Token" above</div>
              <div class="step">2. Go to your Replit <strong>Secrets</strong> tab</div>
              <div class="step">3. Find or create: <code>GOOGLE_REFRESH_TOKEN</code></div>
              <div class="step">4. Paste the token as the value</div>
              <div class="step">5. Restart your app or wait for it to auto-restart</div>
            </div>
          </div>
        </body>
        </html>
      `);
    } catch (err) {
      console.error("OAuth token exchange error:", err);
      res.status(500).send(`
        <html>
        <head><title>Token Exchange Failed</title></head>
        <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h1 style="color: #dc3545;">Token Exchange Failed</h1>
          <p>Error exchanging authorization code for tokens.</p>
          <p>Make sure you've added the correct redirect URI to your Google Cloud Console.</p>
          <p><a href="/api/oauth/setup">Try again</a></p>
        </body>
        </html>
      `);
    }
  });
}
