import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const prisma = new PrismaClient();

  try {
    const events = await prisma.event.findUnique({
      where: { id },
      include: {
        created_by: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        speakers: {
          select: {
            id: true,
            name: true,
            bio: true,
            photo_url: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json("Failed to fetch events", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
