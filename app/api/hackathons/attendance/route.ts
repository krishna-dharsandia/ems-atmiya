import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
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
  const { id, hackathonId, teamId } = body;

  if (!hackathonId) {
    return NextResponse.json({ success: false, error: "Missing hackathon ID" }, { status: 400 });
  }

  if (!teamId) {
    return NextResponse.json({ success: false, error: "Missing Team Id" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing User Id" }, { status: 400 });
  }


  const prisma = new PrismaClient();

  try {
    // verify team exists in the hackathon
    const team = await prisma.hackathonTeam.findFirst({
      where: {
        id: teamId,
        hackathonId,
      }
    });

    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found in this hackathon" }, { status: 404 });
    }

    if (team.disqualified) {
      return NextResponse.json({ success: false, error: "Team is disqualified" }, { status: 400 });
    }

    // Verify member exists
    const member = await prisma.hackathonTeamMember.findFirst({
      where: {
        studentId: id,
      }
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }

    if (member.attended) {
      return NextResponse.json({ success: false, error: "Attendance already marked" }, { status: 400 });
    }

    // Update attendance status
    await prisma.hackathonTeamMember.updateMany({
      where: {
        studentId: id,
        teamId: teamId,
      },
      data: {
        attended: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Marked attendance successfully`,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
