# Certificate Generation Feature Implementation

This document describes the implementation of the certificate generation feature for the EMS-Atmiya system.

## Overview

The certificate generation feature allows event organizers to:

1. Upload a certificate design template during event creation
2. Define and position text placeholders on the certificate
3. Customize font, size, and color for each placeholder

After an event is completed, attendees can download their personalized certificates with their information automatically inserted into the template.

## Technical Components

### 1. Certificate Designer Component

- Located at: `/components/section/master/events/CertificateDesigner.tsx`
- Allows drag-and-drop positioning of text placeholders
- Provides controls for customizing text appearance (font, size, color)
- Built using react-konva for interactive canvas manipulation

### 2. Certificate Generation Service

- Located at: `/lib/certificate-service.ts`
- Uses pdf-lib for PDF generation and manipulation
- Handles both image-based and PDF-based templates
- Places dynamic text on the certificate based on saved placeholder positions

### 3. Certificate Download API

- Located at: `/app/api/events/[eventId]/certificate/route.ts`
- Verifies user eligibility (registered and attended the event)
- Generates a personalized certificate on-demand
- Returns the certificate as a downloadable PDF

### 4. UI Components

- Download button: `/components/section/events/DownloadCertificateButton.tsx`
- Event card with certificate: `/components/section/events/EventCardWithCertificate.tsx`
- Integration in event form: Step 6 in `/components/section/master/events/EventForm.tsx`

## Database Schema

The Event model has been extended with:
- `certificate_template_url`: Stores the path to the uploaded certificate template
- `certificate_placeholders`: JSON field storing the position, text, and styling information for each placeholder

## Storage

Certificate templates are stored in the `event-certificates` bucket in Supabase Storage.

## Setup Instructions

1. Run `bun run setup-certificates` to view instructions for setting up the required Supabase storage bucket
2. Create appropriate RLS policies as outlined in the setup script
3. Install required dependencies:
   ```
   bun add pdf-lib react-konva konva use-image react-colorful sharp
   ```

## User Flow

### For Event Organizers:
1. Create or edit an event
2. Navigate to Step 6 (Certificates)
3. Upload a certificate design template
4. Add and position text placeholders for name, event name, date, etc.
5. Customize the appearance of each placeholder
6. Complete event creation

### For Attendees:
1. Register and attend an event
2. After event completion, view the event card showing a "Download Certificate" button
3. Click the button to get a personalized certificate with their details

## Libraries Used

- pdf-lib: PDF generation and manipulation
- react-konva: Interactive canvas for certificate designer
- konva: Core canvas library
- use-image: Image loading for the canvas
- react-colorful: Color picker for text styling
- sharp: Image processing and conversion
