import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();

  try {
    // Get all hackathons
    const hackathons = await prisma.hackathon.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    // Check for user registrations if user is a student
    const userRegistrations: Record<string, boolean> = {};

    // Find the student record
    const student = await prisma.student.findFirst({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
      },
    });

    if (student) {
      // Get all teams the student is a member of
      const teamMemberships = await prisma.hackathonTeamMember.findMany({
        where: {
          studentId: student.id,
        },
        include: {
          team: {
            select: {
              hackathonId: true,
            },
          },
        },
      });

      // Map hackathon IDs to registration status
      teamMemberships.forEach((membership) => {
        userRegistrations[membership.team.hackathonId] = true;
      });
    }

    return NextResponse.json({
      hackathons,
      userRegistrations,
    });
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Failed to fetch hackathons" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
