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

  if (user.user_metadata.role !== Role.MASTER) {
    return NextResponse.json(
      { error: "Insufficent Permission" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
  }

  const prisma = new PrismaClient();
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
            admins: {
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
