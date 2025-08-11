"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createTeamAction(hackathonId: string, teamName: string, problemStatementId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();

  try {
    // Check if user is a student
    const student = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!student) {
      return { error: "Only students can create or join teams" };
    }

    // Check if user is already in a team for this hackathon
    const existingMembership = await prisma.hackathonTeamMember.findFirst({
      where: {
        studentId: student.id,
        team: {
          hackathonId,
        },
      },
      include: {
        team: true,
      },
    });

    if (existingMembership) {
      return { error: "You are already part of a team for this hackathon" };
    }

    // Check if there's a pending invitation
    const pendingInvitation = await prisma.hackathonTeamInvite.findFirst({
      where: {
        studentId: student.id,
        team: {
          hackathonId,
        },
        status: "PENDING",
      },
    });

    if (pendingInvitation) {
      return { error: "You have a pending invitation to join a team. Please respond to that first." };
    }

    // Check if hackathon exists and is open for registration
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      return { error: "Hackathon not found" };
    }

    const now = new Date();
    const registrationStartDate = new Date(hackathon.registration_start_date);
    const registrationEndDate = new Date(hackathon.registration_end_date);

    if (now < registrationStartDate || now > registrationEndDate) {
      return { error: "Registration is not open for this hackathon" };
    }

    // Check if registration limit is reached
    if (hackathon.registration_limit) {
      const teamCount = await prisma.hackathonTeam.count({
        where: { hackathonId },
      });

      if (teamCount >= hackathon.registration_limit) {
        return { error: "Registration limit for this hackathon has been reached" };
      }
    }

    // Verify the problem statement belongs to this hackathon
    const problemStatement = await prisma.hackathonProblemStatement.findFirst({
      where: {
        id: problemStatementId,
        hackathonId,
      },
    });

    if (!problemStatement) {
      return { error: "Invalid problem statement" };
    }

    // Create team and add the creator as a member
    const team = await prisma.hackathonTeam.create({
      data: {
        hackathonId,
        teamName,
        problemStatementId,
        teamId: `${teamName.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
        members: {
          create: {
            studentId: student.id,
          },
        },
      },
    });

    return {
      success: true,
      teamId: team.id,
      teamName: team.teamName
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return { error: "Failed to create team" };
  } finally {
    await prisma.$disconnect();
  }
}
