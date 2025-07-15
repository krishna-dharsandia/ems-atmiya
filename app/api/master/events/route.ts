import { createClient } from "@/utils/supabase/server";
import { PrismaClient, Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.user_metadata.role !== Role.MASTER) {
    return NextResponse.json({ error: "Insufficent Permission" }, { status: 401 });
  }

  const prisma = new PrismaClient();

  try {
    const events = await prisma.event.findMany({
      include: {
        created_by: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { start_date: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
