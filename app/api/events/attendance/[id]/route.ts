import { createClient } from "@/utils/supabase/server";
import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (user.user_metadata.role !== Role.MASTER) {
    return NextResponse.json(
      { success: false, error: "Insufficent Permission" },
      { status: 401 }
    );
  }

  const { id: eventId } = await params;

  if (!eventId) {
    return NextResponse.json({ success: false, error: "Missing event ID" }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("id");

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
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
