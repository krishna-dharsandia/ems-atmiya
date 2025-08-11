import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { HackathonTeam, PrismaClient } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {id} = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();

  try {
    const hackathonId = id;

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        problemStatements: true,
        rules: true,
      },
    });

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    // Find if the current user is in a team for this hackathon
    let userTeam: HackathonTeam | null = null;
    let pendingInvites: { teamId: string; teamName: string }[] = [];

    // Find the student record
    const student = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (student) {
      // Check for team membership
      const teamMembership = await prisma.hackathonTeamMember.findFirst({
        where: {
          studentId: student.id,
          team: {
            hackathonId,
          },
        },
        include: {
          team: {
            include: {
              members: {
                include: {
                  student: {
                    include: {
                      user: {
                        select: {
                          firstName: true,
                          lastName: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
              invites: {
                include: {
                  student: {
                    include: {
                      user: {
                        select: {
                          firstName: true,
                          lastName: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
              problemStatement: {
                select: {
                  id: true,
                  code: true,
                  title: true,
                },
              },
              hackathon: {
                select: {
                  team_size_limit: true,
                }
              }
            },
          },
        },
      });

      if (teamMembership) {
        userTeam = teamMembership.team;
      } else {
        // Check for pending invites
        const invites = await prisma.hackathonTeamInvite.findMany({
          where: {
            studentId: student.id,
            team: {
              hackathonId,
            },
            status: "PENDING",
          },
          include: {
            team: {
              select: {
                id: true,
                teamName: true,
              },
            },
          },
        });

        pendingInvites = invites.map((invite) => ({
          teamId: invite.teamId,
          teamName: invite.team.teamName,
        }));
      }
    }

    return NextResponse.json({
      hackathon,
      userTeam,
      pendingInvites,
    });
  } catch (error) {
    console.error("Error fetching hackathon details:", error);
    return NextResponse.json(
      { error: "Failed to fetch hackathon details" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
