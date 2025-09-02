import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CertificateService } from "@/lib/certificate-service";
import { getAuthUserFromRequest } from "@/utils/functions/getAuthUserFromRequest";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prisma = new PrismaClient();

    try {
      // Get the event details
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          name: true,
          start_date: true,
          status: true,
        },
      });

      if (!event) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }

      // Get full event details with certificate data
      const eventWithCertificate = await prisma.event.findUnique({
        where: { id: eventId },
      }) as any; // Cast as any to handle the certificate fields

      if (!event) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }

      // Check if the event has a certificate template
      if (!eventWithCertificate?.certificate_template_url) {
        return NextResponse.json(
          { error: "No certificate template available for this event" },
          { status: 404 }
        );
      }

      // Check if user has registered and attended the event
      const registration = await prisma.eventRegistration.findUnique({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId: eventId,
          },
        },
      });

      if (!registration) {
        return NextResponse.json(
          { error: "You are not registered for this event" },
          { status: 403 }
        );
      }

      // Check if the event is completed
      // Comment this check out if you want to test with upcoming events
      if (event.status !== "COMPLETED") {
        return NextResponse.json(
          { error: "Certificates are only available for completed events" },
          { status: 403 }
        );
      }

      // Check if user has attended the event
      // Comment this check out during testing if needed
      if (!registration.attended) {
        return NextResponse.json(
          { error: "You must have attended the event to receive a certificate" },
          { status: 403 }
        );
      }

      // Get user data
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          students: true,
        }
      });

      if (!fullUser) {
        return NextResponse.json(
          { error: "User data not found" },
          { status: 404 }
        );
      }

      // Format date
      const eventDate = new Date(event.start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Prepare user data for certificate
      const userData = {
        name: `${fullUser.firstName} ${fullUser.lastName}`,
        event_name: event.name,
        date: eventDate,
        registration_id: fullUser.students ? fullUser.students.registrationNumber || "" : "",
      };

      // Generate certificate
      const certificateBytes = await CertificateService.generateCertificate({
        templateUrl: eventWithCertificate.certificate_template_url as string,
        placeholders: eventWithCertificate.certificate_placeholders as any,
        userData,
        eventName: event.name,
      });

      // Return the PDF as a download
      const response = new NextResponse(certificateBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.pdf"`,
        },
      });

      return response;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
