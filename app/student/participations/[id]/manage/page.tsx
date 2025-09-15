import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { TeamManagement } from "@/components/section/student/participations/TeamManagement";
import { Hackathon, HackathonTeam } from "@/types/hackathon";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

export default async function TeamManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: hackathonId } = await params;
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const prisma = new PrismaClient();

  try {
    // Find the student record
    const student = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!student) {
      redirect("/onboarding");
    }

    // Get hackathon details
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        problemStatements: true,
        rules: true,
      },
    });

    if (!hackathon) {
      notFound();
    }

    // Check if student is a member of any team for this hackathon
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
              },
            },
          },
        },
      },
    });

    if (!teamMembership) {
      // Student is not a member of any team for this hackathon
      redirect(`/hackathons/${hackathonId}`);
    }

    const team = teamMembership.team;
    
    // Determine if current student is team owner (first member)
    const isTeamOwner = team.members.length > 0 && team.members[0].studentId === student.id;

    // Transform hackathon data to match component interface
    const transformedHackathon = {
      ...hackathon,
      start_date: hackathon.start_date.toISOString(),
      end_date: hackathon.end_date.toISOString(),
      start_time: hackathon.start_time.toISOString(),
      end_time: hackathon.end_time.toISOString(),
      registration_start_date: hackathon.registration_start_date?.toISOString(),
      registration_end_date: hackathon.registration_end_date?.toISOString(),
      created_at: hackathon.created_at.toISOString(),
    };

    return (
      <ErrorBoundary>
        <TeamManagement
          hackathon={transformedHackathon as Hackathon}
          team={team as HackathonTeam}
          isTeamOwner={isTeamOwner}
          studentId={student.id}
          currentUser={student.user}
        />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Error fetching team management data:", error);
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground">
            Failed to load team management. Please try again later.
          </p>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
