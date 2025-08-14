# QR Code System Documentation

## Overview

The QR code system has been updated to use **event-based QR codes** instead of individual event registration QR codes. This new approach is more efficient and user-friendly.

## System Architecture

### 1. User QR Codes
- Each user has one personal QR code containing their encrypted ID
- **Lifetime validity** - QR codes never expire
- Used for check-in at any event they're registered for

### 2. Event QR Codes
- Each event has one QR code for the event itself
- Two types: URL-based (for easy access) and data-based (for secure scanning)
- Links directly to the event check-in page

## API Endpoints

### User QR Code APIs
- `GET /api/user/qr-code` - Fetch user's QR code
- `POST /api/user/qr-code` - Generate user's QR code

### Event QR Code APIs
- `GET /api/events/[eventId]/qr-code` - Fetch event QR code
- `POST /api/events/[eventId]/qr-code` - Generate event QR code
- `GET /api/events/[eventId]/registration/status` - Check registration status
- `POST /api/events/[eventId]/register` - Register for event

### QR Code Scanning
- `POST /api/qr-code/scan` - Scan and verify QR codes (Admin/Master only)

## Database Schema Changes

### Event Model
```prisma
model Event {
  // ...existing fields...
  qrCode     String? // Base64 encoded QR code for the event
  qrCodeData String? // JSON data encoded in QR code for the event
  // ...
}
```

### EventRegistration Model
- Removed: `qrCode`, `qrCodeData` fields
- Kept: `checkedInAt`, `checkedInBy` for attendance tracking

## QR Code Types

### 1. User QR Code Data Structure
```typescript
{
  id: string;
  type: 'user';
  userId: string;
  timestamp: number;
  signature: string;
}
```

### 2. Event QR Code Data Structure
```typescript
{
  id: string;
  type: 'event';
  userId: string; // Creator's ID
  eventId: string;
  timestamp: number;
  signature: string;
}
```

## Workflow

### For Event Organizers
1. Create an event
2. Generate event QR code (both URL and data types)
3. Share URL QR code on posters/digital media
4. Use data QR code for admin scanning

### For Attendees
1. Scan event QR code OR visit event page
2. Register for the event (if not already registered)
3. Generate personal QR code
4. Show personal QR code to staff for check-in

### For Event Staff
1. Use admin panel to scan attendee QR codes
2. Alternatively, manually search and check-in attendees
3. Both methods update attendance status

## Security Features

- **HMAC Signature**: All QR codes are cryptographically signed
- **Lifetime Validity**: QR codes never expire (timestamp kept for tracking only)
- **Permission Checks**: Only Admins/Masters can scan QR codes
- **Data Encryption**: Sensitive data is encrypted within QR codes

## Components

### Frontend Components
- `EventQRCodeDisplay` - Shows event QR codes with dual modes
- `UserQRCodeDisplay` - Shows user's personal QR code
- Event check-in page at `/events/[eventId]/check-in`

### Key Features
- Download QR codes as PNG images
- Copy QR code data to clipboard
- Share event check-in links
- Real-time registration status
- Responsive design for mobile scanning

## Environment Variables

```env
QR_CODE_SECRET="your-secret-key-for-hmac-signing"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

## Migration Summary

1. ✅ Added QR code fields to Event model
2. ✅ Removed QR code fields from EventRegistration model
3. ✅ Updated QR code service to support event-based codes
4. ✅ Created new API endpoints for event QR codes
5. ✅ Updated scanning logic to handle event QR codes
6. ✅ Created event check-in page
7. ✅ Built React components for QR code display
8. ✅ Added registration APIs for seamless workflow

## Benefits of New System

1. **Simplified Management**: One QR code per event instead of per registration
2. **Better User Experience**: Direct link to event information and registration
3. **Flexible Check-in**: Multiple ways to check in (QR scan, manual search)
4. **Scalable**: No need to generate QR codes for every registration
5. **Secure**: Maintains cryptographic security with HMAC signatures
6. **Mobile-Friendly**: Works well on all devices

## Usage Examples

### Generate Event QR Code
```bash
POST /api/events/123/qr-code
# Returns both URL and data-based QR codes
```

### Scan User QR Code for Event Check-in
```bash
POST /api/qr-code/scan
{
  "qrCodeData": "encrypted-user-qr-data",
  "eventId": "event-123"
}
# Marks user as attended if registered
```

### Check Registration and Register
```bash
GET /api/events/123/registration/status
POST /api/events/123/register
```

This new system provides a more efficient and user-friendly approach to event check-ins while maintaining security and flexibility.
