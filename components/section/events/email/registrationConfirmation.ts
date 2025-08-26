export const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Event Registration Confirmation</title>
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
      padding: 32px 24px 60px;
      text-align: center;
      position: relative;
    }
    .header::after {
      content: "";
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 40px;
      background-image: url("data:image/svg+xml,%3Csvg ... %3E"); /* keep your SVG wave */
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
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 13px;
      padding: 6px 16px;
      border-radius: 50px;
      margin-top: 12px;
      font-weight: 600;
    }
    .content {
      padding: 20px 32px 40px;
      text-align: center;
      margin-top: -15px;
    }
    h1 {
      font-size: 26px;
      margin: 10px 0 20px;
      font-weight: 700;
      color: #111827;
    }
    p { font-size: 16px; color: #4b5563; }
    .event-card {
      text-align: left;
      margin: 20px 0;
      background: #f9fafb;
      padding: 16px 20px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }
    .event-card p { margin: 8px 0; }
    .button {
      background: linear-gradient(135deg, #30a46c 0%, #2a9862 100%);
      color: white;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      margin-top: 20px;
    }
    .notice {
      margin-top: 30px;
      text-align: left;
      padding: 16px;
      border-left: 4px solid #f5d90a;
      background: rgba(245, 217, 10, 0.08);
      border-radius: 8px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 20px;
      text-align: center;
      border-top: 1px solid #f0f0f0;
    }
    .footer p {
      font-size: 13px;
      color: #6b7280;
      margin: 6px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-text">ADSC</div>
      <div class="badge">EVENT CONFIRMATION</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1>You're Registered 🎉</h1>
      <p>Dear <strong>{{USER_FULL_NAME}}</strong>,</p>
      <p>We’re excited to confirm your registration for the event. Here are the details:</p>

      <div class="event-card">
        <p><strong>Event Name:</strong> {{EVENT_NAME}}</p>
        <p><strong>Date:</strong> {{EVENT_DATE}}</p>
        <p><strong>Time:</strong> {{EVENT_TIME}}</p>
        <p><strong>Venue:</strong> {{EVENT_VENUE}}</p>
      </div>

      <p>📌 Please present your <strong>QR Code</strong> at the entrance for attendance.</p>
      <p>You can access your QR Code via:</p>
      <ol style="text-align:left; display:inline-block;">
        <li>Go to Dashboard</li>
        <li>Scroll to the bottom of Sidebar</li>
        <li>Select <b>Account Option</b></li>
        <li>Click on <b>Personal QR</b></li>
      </ol>

      <br/>

      <a href="https://events.adsc-atmiya.in{{USER_ROLE}}/account" class="button">View My QR Code</a>
      <br/>

      <div class="notice">
        <p><strong>Note:</strong> Please arrive 15 minutes before the event starts to ensure smooth check-in.</p>
      </div>

      <p>See you at the event!<br>— ADSC Team</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© 2025 ADSC Event Management System. All rights reserved.</p>
      <p>This email was sent to {{USER_EMAIL}}</p>
    </div>
  </div>
</body>
</html>
`
