import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET endpoint to retrieve attendance schedule details for admin
 * Returns simplified data without team member details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // // Verify user is an admin
    // const admin = await prisma.admin.findFirst({
    //   where: {
    //     userId: user.id,
    //   },
    // });

    // if (!admin) {
    //   return NextResponse.json(
    //     { error: "Only admin users can access this resource" },
    //     { status: 403 }
    //   );
    // }

    // Get the attendance schedule with minimal related data
    const attendanceSchedule = await prisma.hackathonAttendanceSchedule.findUnique({
      where: { id },
      include: {
        hackathon: {
          select: {
            id: true,
            name: true,
            start_date: true,
            end_date: true,
            mode: true,
            status: true,
            location: true,
            _count: {
              select: {
                teams: true
              }
            }
          },
        },
        attendanceRecords: {
          select: {
            id: true,
            isPresent: true,
          },
        },
      },
    });

    if (!attendanceSchedule) {
      return NextResponse.json(
        { error: "Attendance schedule not found" },
        { status: 404 }
      );
    }

    // Get total member count and present member count
    const totalMembersData = await prisma.hackathonTeamMember.count({
      where: {
        team: {
          hackathonId: attendanceSchedule.hackathonId,
        },
      },
    });

    const presentMembersCount = attendanceSchedule.attendanceRecords.filter(
      (record) => record.isPresent
    ).length;

    // Calculate statistics
    const totalMembers = totalMembersData;
    const presentCount = presentMembersCount;
    const absentCount = totalMembers - presentCount;
    const attendancePercentage = totalMembers > 0
      ? Math.round((presentCount / totalMembers) * 100)
      : 0;

    // Get team attendance stats (count only, no details)
    const totalTeams = await prisma.hackathonTeam.count({
      where: {
        hackathonId: attendanceSchedule.hackathonId,
      },
    });

    // Get teams with at least one member present
    const teamsWithPresentMembers = await prisma.hackathonTeam.count({
      where: {
        hackathonId: attendanceSchedule.hackathonId,
        members: {
          some: {
            attendanceRecords: {
              some: {
                attendanceScheduleId: id,
                isPresent: true,
              },
            },
          },
        },
      },
    });

    const stats = {
      totalMembers,
      presentCount,
      absentCount,
      attendancePercentage,
      totalTeams,
      presentTeams: teamsWithPresentMembers,
      absentTeams: totalTeams - teamsWithPresentMembers,
    };

    // Return simplified response with just the essential data
    return NextResponse.json({
      success: true,
      attendanceSchedule: {
        id: attendanceSchedule.id,
        day: attendanceSchedule.day,
        checkInTime: attendanceSchedule.checkInTime,
        description: attendanceSchedule.description,
        hackathon: {
          id: attendanceSchedule.hackathon.id,
          name: attendanceSchedule.hackathon.name,
          start_date: attendanceSchedule.hackathon.start_date,
          end_date: attendanceSchedule.hackathon.end_date,
          mode: attendanceSchedule.hackathon.mode,
          status: attendanceSchedule.hackathon.status,
          location: attendanceSchedule.hackathon.location,
          teamCount: attendanceSchedule.hackathon._count.teams,
        }
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching attendance schedule details:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance schedule details" },
      { status: 500 }
    );
  }
}
