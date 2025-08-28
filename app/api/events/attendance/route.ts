import { createClient } from "@/utils/supabase/server";
import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (user.user_metadata.role !== Role.MASTER) {
    return NextResponse.json(
      { success: false, error: "Insufficient Permission" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { userId, eventId } = body;

  if (!eventId) {
    return NextResponse.json({ success: false, error: "Missing event ID" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing User Id" }, { status: 400 });
  }

  const prisma = new PrismaClient();
  try {
    await prisma.eventRegistration.update({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        }
      },
      data: {
        attended: true,
        checkedInAt: new Date(),
        checkedInBy: user.id,
      }
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
