export const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Hackathon Announcement</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      color: #111827;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #0090ff 0%, #0071e2 100%);
      padding: 32px 24px 70px;
      text-align: center;
      position: relative;
    }
    .header::after {
      content: "";
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 40px;
      background-image: url("data:image/svg+xml,%3Csvg ... %3E"); /* keep wave SVG */
      background-size: cover;
    }
    .logo-text {
      color: white;
      font-size: 34px;
      font-weight: 800;
      margin: 0;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.25);
      color: white;
      font-size: 13px;
      padding: 6px 16px;
      border-radius: 50px;
      margin-top: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 30px 32px 40px;
      text-align: center;
      margin-top: -15px;
    }
    h1 {
      font-size: 26px;
      margin: 10px 0 16px;
      font-weight: 700;
      color: #111827;
    }
    p { font-size: 16px; color: #4b5563; }
    .event-card {
      text-align: left;
      margin: 24px 0;
      background: #f9fafb;
      padding: 20px 24px;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
    }
    .event-card h2 {
      margin: 0 0 12px;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }
    .event-detail {
      margin: 8px 0;
      font-size: 15px;
    }
    .event-detail strong {
      color: #111827;
    }
    .highlights {
      margin: 10px 0 0 0;
      padding-left: 18px;
    }
    .highlights li {
      margin: 6px 0;
      color: #374151;
    }
    .button {
      background: linear-gradient(135deg, #30a46c 0%, #2a9862 100%);
      color: white;
      padding: 14px 34px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      margin-top: 25px;
      font-size: 15px;
    }
    .notice {
      margin-top: 28px;
      text-align: left;
      padding: 16px 18px;
      border-left: 4px solid #f5d90a;
      background: rgba(245, 217, 10, 0.08);
      border-radius: 10px;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 22px 20px;
      text-align: center;
      border-top: 1px solid #f0f0f0;
    }
    .footer p {
      font-size: 13px;
      color: #6b7280;
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-text">ADSC</div>
      <div class="badge">NEW HACKATHON ANNOUNCEMENT</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1>🚀 Get Ready for the Hackathon!</h1>
      <p>Dear <strong>{{name}}</strong>,</p>
      <p>We’re thrilled to announce our upcoming hackathon at Atmiya University. Don’t miss the chance to innovate, collaborate, and win exciting rewards!</p>

      <div class="event-card">
        <h2>{{HACKATHON_NAME}}</h2>
        <p class="event-detail"><strong>Registration:</strong> {{REGISTRATION_START}} – {{REGISTRATION_END}}</p>
        <p class="event-detail"><strong>Hackathon:</strong> {{HACKATHON_START}} – {{HACKATHON_END}}</p>
        <p class="event-detail"><strong>Mode:</strong> {{HACKATHON_MODE}}</p>
        <p class="event-detail"><strong>Location:</strong> {{HACKATHON_LOCATION}}</p>
        <p class="event-detail"><strong>Registration Slots:</strong> {{REGISTRATION_LIMITS}}</p>
        <p class="event-detail"><strong>Team Size:</strong> Up to {{TEAM_SIZE_LIMIT}} members</p>
        <p class="event-detail"><strong>Organizer:</strong> {{ORGANIZER_NAME}} (<a href="mailto:{{ORGANIZER_EMAIL}}">{{ORGANIZER_EMAIL}}</a>)</p>
      </div>

      <a href="{{REGISTER_LINK}}" class="button">Register Now</a>

      <div class="notice">
        <p><strong>Note:</strong> Hurry! Limited slots available. Secure your spot before it’s gone.</p>
      </div>

      <p style="margin-top:20px;">We can’t wait to see your innovative ideas come alive!<br>— ADSC Team</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© 2025 ADSC  Event Management System. All rights reserved.</p>
      <p>This email was sent to {{email}}</p>
    </div>
  </div>
</body>
</html>
`

interface HackathonEmailData {
  Location: string;
  Registration_Start: Date;
  Registration_End: Date;
  Hackathon_Start: Date;
  Hackathon_End: Date;
  Hackathon_Start_Time: Date;
  Hackathon_End_Time: Date;
  Mode: "ONLINE" | "OFFLINE";
  Registration_Limits: number | null;
  Team_Size_Limit: number | null;
  Organizer_Name: string;
  Organizer_Email: string;
  Register_Link: string;
  Hackathon_Name: string;
}

export function generateHackathonEmailTemplate(data: HackathonEmailData): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };


  const html = template
    .replace("{{HACKATHON_NAME}}", data.Hackathon_Name)
    .replace("{{REGISTRATION_START}}", data.Registration_Start.toLocaleDateString("en-IN", dateOptions))
    .replace("{{REGISTRATION_END}}", data.Registration_End.toLocaleDateString("en-IN", dateOptions))
    .replace(
      "{{HACKATHON_START}}",
      `${data.Hackathon_Start.toLocaleDateString("en-IN", dateOptions)} ${data.Hackathon_Start_Time.toLocaleTimeString("en-IN", timeOptions)}`
    )
    .replace(
      "{{HACKATHON_END}}",
      `${data.Hackathon_End.toLocaleDateString("en-IN", dateOptions)} ${data.Hackathon_End_Time.toLocaleTimeString("en-IN", timeOptions)}`
    )
    .replace("{{HACKATHON_MODE}}", data.Mode === "ONLINE" ? "Online" : "Offline")
    .replace("{{HACKATHON_LOCATION}}", data.Location)
    .replace("{{REGISTRATION_LIMITS}}", data.Registration_Limits?.toString() || "Unlimited")
    .replace("{{TEAM_SIZE_LIMIT}}", data.Team_Size_Limit?.toString() || "No Limit")
    .replace("{{ORGANIZER_NAME}}", data.Organizer_Name)
    .replace("{{ORGANIZER_EMAIL}}", data.Organizer_Email || "N/A")
    .replace("{{REGISTER_LINK}}", data.Register_Link);

  return html;
}
