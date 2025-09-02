export const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Event Announcement</title>
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
      <div class="badge">NEW EVENT ANNOUNCEMENT</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1>📢 You’re Invited!</h1>
      <p>Dear <strong>{{name}}</strong>,</p>
      <p>We are thrilled to share details of an upcoming event at Atmiya University. Don’t miss this opportunity to be part of it!</p>

      <div class="event-card">
        <h2>{{EVENT_NAME}}</h2>
        <p class="event-detail"><strong>Description:</strong> {{EVENT_DESCRIPTION}}</p>
        <p class="event-detail"><strong>Date:</strong> {{EVENT_DATE_START}} – {{EVENT_DATE_END}}</p>
        <p class="event-detail"><strong>Time:</strong> {{EVENT_TIME_START}} – {{EVENT_TIME_END}}</p>
        <p class="event-detail"><strong>Mode:</strong> {{EVENT_MODE}}</p>
        <p class="event-detail"><strong>Venue / Address:</strong> {{EVENT_ADDRESS}}</p>
        <p class="event-detail"><strong>Organizer:</strong> {{ORGANIZER_NAME}} (<a href="mailto:{{ORGANIZER_EMAIL}}">{{ORGANIZER_EMAIL}}</a>)</p>

        <p class="event-detail"><strong>Key Highlights:</strong></p>
        <ul class="highlights">
          {{#each EVENT_HIGHLIGHTS}}
            <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>

      <a href="https://events.adsc-atmiya.in/events/{{EVENT_ID}}" class="button">Register Now</a>

      <div class="notice">
        <p><strong>Note:</strong> {{EVENT_NOTE}}</p>
      </div>

      <p style="margin-top:20px;">Looking forward to seeing you at the event!<br>— ADSC Team</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© 2025 ADSC Event Management System. All rights reserved.</p>
      <p>This email was sent to {{email}}</p>
    </div>
  </div>
</body>
</html>
`

interface EventEmailData {
  EVENT_NAME: string;
  EVENT_DESCRIPTION: string;
  EVENT_DATE_START: Date;
  EVENT_DATE_END?: Date | null;
  EVENT_TIME_START: Date;
  EVENT_TIME_END?: Date | null;
  EVENT_MODE: string;
  EVENT_ADDRESS?: string | null;
  ORGANIZER_NAME: string;
  ORGANIZER_EMAIL?: string | null;
  EVENT_HIGHLIGHTS: string[];
  EVENT_ID: string;
  EVENT_NOTE?: string | null;
}

export function generateEventEmailHTML(data: EventEmailData): string {
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

  const highlightsHTML = data.EVENT_HIGHLIGHTS.map(h => `<li>${h}</li>`).join('');
  const html = template
    .replace(/\{\{EVENT_NAME\}\}/g, data.EVENT_NAME)
    .replace(/\{\{EVENT_DESCRIPTION\}\}/g, data.EVENT_DESCRIPTION)
    .replace(/\{\{EVENT_DATE_START\}\}/g, data.EVENT_DATE_START.toLocaleDateString("en-IN", dateOptions))
    .replace(/\{\{EVENT_DATE_END\}\}/g, data.EVENT_DATE_END?.toLocaleDateString("en-IN", dateOptions) || '')
    .replace(/\{\{EVENT_TIME_START\}\}/g, data.EVENT_TIME_START?.toLocaleString("en-IN", timeOptions))
    .replace(/\{\{EVENT_TIME_END\}\}/g, data.EVENT_TIME_END?.toLocaleString("en-IN", timeOptions) || '')
    .replace(/\{\{EVENT_MODE\}\}/g, data.EVENT_MODE)
    .replace(/\{\{EVENT_ADDRESS\}\}/g, data.EVENT_ADDRESS || 'Its an online event. Join us from anywhere!')
    .replace(/\{\{ORGANIZER_NAME\}\}/g, data.ORGANIZER_NAME)
    .replace(/\{\{ORGANIZER_EMAIL\}\}/g, data.ORGANIZER_EMAIL || 'adsc@atmiyauni.ac.in')
    .replace(/\{\{EVENT_ID\}\}/g, data.EVENT_ID)
    .replace(/\{\{EVENT_NOTE\}\}/g, data.EVENT_NOTE || 'Be sure to register early as spots are limited!')
    .replace(/\{\{#each EVENT_HIGHLIGHTS\}\}([\s\S]*?)\{\{\/each\}\}/g, highlightsHTML);
  return html;
}
