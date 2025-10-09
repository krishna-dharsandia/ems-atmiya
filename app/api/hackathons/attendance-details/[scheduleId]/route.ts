import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {

    const { scheduleId } = await params;

    // Get the attendance schedule with related data
    const attendanceSchedule = await prisma.hackathonAttendanceSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        hackathon: {
          select: {
            id: true,
            name: true,
            start_date: true,
            mode: true,            
            teams: {
              select: {
                id: true,
                teamName: true,
                teamId: true,
                leaderId: true,
                members: {
                  select: {
                    id: true,
                    studentId: true,
                    attended: true,
                    student: {
                      select: {
                        id: true,                        
                        user: {
                          select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                          },
                        },
                        department: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                    attendanceRecords: {
                      where: {
                        attendanceScheduleId: scheduleId,
                      },
                      select: {
                        id: true,
                        isPresent: true,
                        checkedInAt: true,
                        checkedInByUser: {
                          select: {
                            firstName: true,
                            lastName: true,
                          },
                        },
                      },
                    },
                  },
                  orderBy: [
                    {
                      student: {
                        user: {
                          firstName: 'asc'
                        }
                      }
                    }
                  ]
                },
              },
              orderBy: {
                teamId: 'asc'
              }
            },
          },
        },
        attendanceRecords: {
          include: {
            teamMember: {
              include: {
                student: {
                  include: {
                    user: true,
                    department: true,
                  },
                },
                team: true,
              },
            },
            checkedInByUser: true,
          },
        },
      },
    });

    if (!attendanceSchedule) {
      return NextResponse.json(
        { error: "Attendance schedule not found" },
        { status: 404 }
      );
    }    // Calculate stats
    const totalMembers = attendanceSchedule.hackathon.teams.reduce(
      (count, team) => count + team.members.length,
      0
    );

    const presentCount = attendanceSchedule.attendanceRecords.filter(
      (record) => record.isPresent
    ).length;

    const attendancePercentage = totalMembers > 0
      ? Math.round((presentCount / totalMembers) * 100)
      : 0;

    // Calculate team stats
    const totalTeams = attendanceSchedule.hackathon.teams.length;
    const presentTeams = attendanceSchedule.hackathon.teams.filter(team => {
      return team.members.some(member => {
        return member.attendanceRecords.some(record => record.isPresent);
      });
    }).length;

    const stats = {
      totalMembers,
      presentCount,
      absentCount: totalMembers - presentCount,
      attendancePercentage,
      totalTeams, 
      presentTeams,
      absentTeams: totalTeams - presentTeams,
    };

    return NextResponse.json({
      success: true,
      attendanceSchedule,
      stats,
    });
  } catch (error) {
    console.error("Error fetching attendance details:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance details" },
      { status: 500 }
    );
  }
}
