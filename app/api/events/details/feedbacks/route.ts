import { createClient } from "@/utils/supabase/server";
import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ SECURITY FIX: Check role in database, not Supabase metadata
  const prisma = new PrismaClient();
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true }
  });

  if (!dbUser || dbUser.role !== Role.MASTER) {
    await prisma.$disconnect();
    return NextResponse.json(
      { error: "Insufficient Permission" },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
  }

  try {
    const feedbacks = await prisma.eventFeedback.findMany({
      where: {
        eventId: id,
      },
      include: {
        user: {
          include: {
            students: {
              include: {
                department: {
                  select: {
                    name: true,
                    id: true,
                    faculty: true,
                  },
                },
                program: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
