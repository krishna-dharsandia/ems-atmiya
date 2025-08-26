"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { template as registrationConfirmationTemplate } from "@/components/section/events/email/registrationConfirmation";
import { sendMail } from "@/utils/functions/sendMail";
import { format } from "date-fns";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";

type RegistrationEmailData = {
  userFullName: string;
  email: string;
  role: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
};

/** Basic HTML-escape to avoid injecting raw values into the template */
function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Render the registration confirmation HTML by replacing placeholders */
function renderRegistrationConfirmationEmail(data: RegistrationEmailData) {
  const replacements: Record<string, string> = {
    "{{USER_FULL_NAME}}": data.userFullName,
    "{{EVENT_NAME}}": data.eventName,
    "{{EVENT_DATE}}": data.eventDate,
    "{{EVENT_TIME}}": data.eventTime,
    "{{EVENT_VENUE}}": data.eventVenue,
    "{{USER_ROLE}}": data.role,
    "{{USER_EMAIL}}": data.email,
  };

  let html = registrationConfirmationTemplate;

  for (const [placeholder, value] of Object.entries(replacements)) {
    // replace all occurrences of the placeholder
    html = html.split(placeholder).join(escapeHtml(String(value)));
  }

  return html;
}

export async function registerInEventAction(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();
  try {
    // Fetch event to validate registration window / limits
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        name: true,
        registration_limit: true,
        current_registration_count: true,
        status: true,
        start_date: true,
        end_date: true,
        start_time: true,
        end_time: true,
        address: true,
      },
    });

    if (!event) {
      return { error: "Event not found" };
    }

    if (event.status !== "UPCOMING") {
      return { error: "Registration is closed for this event" };
    }

    // If registration limit exists, check it
    if (event.registration_limit && event.current_registration_count >= event.registration_limit) {
      return { error: "Registration limit reached" };
    }

    // Helper to combine a date (date part) and a time (time part) into a single Date
    function combineDateAndTime(datePart?: Date | null, timePart?: Date | null) {
      if (!datePart && !timePart) return null;
      const base = datePart ? new Date(datePart) : new Date();
      if (timePart) {
        const t = new Date(timePart);
        base.setHours(t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds());
      }
      return base;
    }

    const now = new Date();
    // Only disallow registration after the event end datetime has passed.
    // Use end_date (fallback to start_date) with end_time to compute the end datetime.
    const eventEnd = combineDateAndTime(event.end_date ?? event.start_date ?? null, event.end_time ?? null);

    if (eventEnd && now > eventEnd) {
      return { error: "Registration closed: event already ended" };
    }

    try {
      await prisma.eventRegistration.findFirstOrThrow({
        where: {
          eventId,
          userId: user.id,
        },
      });
      return { error: "Already registered in this event" };
    } catch {
      try {
        await prisma.event.update({
          where: { id: eventId },
          data: {
            current_registration_count: {
              increment: 1,
            },
            registrations: {
              create: {
                userId: user.id,
              },
            },
          },
        });

        const userQRCode = await prisma.user.findFirst({
          where: { id: user.id },
          select: { qrCode: true }
        })

        const startDate = event.start_date ? new Date(event.start_date) : null;
        const endDate = event.end_date ? new Date(event.end_date) : null;
        const startTime = event.start_time ? new Date(event.start_time) : null;
        const endTime = event.end_time ? new Date(event.end_time) : null;

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

        const formattedEventDate = startDate
          ? endDate
            ? `${startDate.toLocaleDateString("en-IN", dateOptions)} - ${endDate.toLocaleDateString(
          "en-IN",
          dateOptions
              )}`
            : startDate.toLocaleDateString("en-IN", dateOptions)
          : "TBA";

        const formattedEventTime = startTime
          ? endTime
            ? `${startTime.toLocaleTimeString("en-IN", timeOptions)} - ${endTime.toLocaleTimeString(
          "en-IN",
          timeOptions
              )}`
            : startTime.toLocaleTimeString("en-IN", timeOptions)
          : "TBA";

        await sendMail({
          to: user.email!,
          subject: `Registration Confirmed: ${event.name}`,
          html: renderRegistrationConfirmationEmail({
            userFullName: user.user_metadata.full_name || "Participant",
            email: user.email!,
            role: getDashboardPath(user.user_metadata.role || "STUDENT"),
            eventName: event.name,
            eventDate: formattedEventDate,
            eventTime: formattedEventTime,
            eventVenue: event.address || "TBA",
          }),
          attachments: [
            {
              filename: "personal-qr-code.png",
              content: userQRCode?.qrCode || "",
              encoding: "base64",
            },
          ],
        });

        return { success: true };
      } catch (error) {
        console.error("Error registering in event:", error);
        return { error: "Failed to register in event" };
      } finally {
        await prisma.$disconnect();
      }
    }
  } catch (error) {
    console.error("Error during registration flow:", error);
    await prisma.$disconnect();
    return { error: "Failed to register in event" };
  }
}
