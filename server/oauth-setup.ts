import { google } from "googleapis";
import http from "http";
import url from "url";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.send",
];

async function getRefreshToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("\n❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in your environment.");
    console.log("\nPlease add these secrets in the Replit Secrets tab before running this script.");
    process.exit(1);
  }

  const redirectUri = process.env.OAUTH_REDIRECT_URI || "http://localhost:3333/oauth2callback";
  const port = parseInt(process.env.OAUTH_PORT || "3333");
  
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n🔐 Google OAuth Setup for SystemForge\n");
  console.log("━".repeat(50));
  console.log("\nThis script will help you get a refresh token for:");
  console.log("  • Google Calendar (check availability, create events)");
  console.log("  • Gmail API (send notification emails - FREE!)");
  console.log("\n━".repeat(50));

  return new Promise<void>((resolve) => {
    const server = http.createServer(async (req, res) => {
      if (req.url?.startsWith("/oauth2callback")) {
        const parsedUrl = url.parse(req.url, true);
        const code = parsedUrl.query.code as string;

        if (code) {
          try {
            const { tokens } = await oauth2Client.getToken(code);
            
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>Authorization Successful</title>
                <style>
                  body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                  .success { background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                  .token { background: #f8f9fa; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; }
                  h1 { color: #28a745; }
                  .step { margin: 10px 0; padding-left: 20px; }
                </style>
              </head>
              <body>
                <div class="success">
                  <h1>✅ Authorization Successful!</h1>
                </div>
                <h2>Your Refresh Token:</h2>
                <div class="token">${tokens.refresh_token}</div>
                <h2>Next Steps:</h2>
                <div class="step">1. Copy the refresh token above</div>
                <div class="step">2. Go to your Replit Secrets tab</div>
                <div class="step">3. Add a new secret: <code>GOOGLE_REFRESH_TOKEN</code></div>
                <div class="step">4. Paste the token as the value</div>
                <div class="step">5. You can close this window</div>
              </body>
              </html>
            `);

            console.log("\n✅ Authorization successful!\n");
            console.log("━".repeat(50));
            console.log("\n📋 Your refresh token is displayed in the browser window.");
            console.log("   (Not printed here to avoid exposing secrets in logs)");
            console.log("\n📝 Next steps:");
            console.log("   1. Copy the token from the browser");
            console.log("   2. Add it to Replit Secrets as: GOOGLE_REFRESH_TOKEN\n");
            console.log("━".repeat(50));

            server.close();
            resolve();
          } catch (error) {
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("<h1>Error getting token</h1><p>Check console for details.</p>");
            console.error("Error exchanging code for tokens:", error);
            server.close();
            resolve();
          }
        } else {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>No authorization code received</h1>");
        }
      }
    });

    server.listen(port, () => {
      console.log(`\n🌐 OAuth callback server listening on port ${port}`);
      console.log("\nPlease visit this URL to authorize the application:\n");
      console.log(authUrl);
      console.log("\n⚠️  Important: Make sure this redirect URI is added to your");
      console.log("   Google Cloud Console OAuth 2.0 credentials:");
      console.log(`   ${redirectUri}`);
      console.log("\n⏳ Waiting for authorization...\n");
    });
  });
}

getRefreshToken().then(() => {
  console.log("🎉 Setup complete! You can now restart your application.\n");
  process.exit(0);
});
