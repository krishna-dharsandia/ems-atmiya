import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { id } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (user.app_metadata.role != "MASTER" && user.app_metadata.role != "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Insufficient Permission" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { userId, hackathonId } = body;

  if (!hackathonId) {
    return NextResponse.json({ success: false, error: "Missing hackathon ID" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, error: "Missing User Id" }, { status: 400 });
  }

  const prisma = new PrismaClient();

  try {
    await prisma.hackathonTeamMember.update({
      where: {
        id: "id",
      },
      data: {
        attended: true,
      }
    })
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
