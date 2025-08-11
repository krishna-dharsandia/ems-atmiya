"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function respondToInvitationAction(teamId: string, accept: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();

  try {
    // Check if the current user is a student
    const student = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!student) {
      return { error: "Only students can respond to team invitations" };
    }

    // Check if invitation exists
    const invitation = await prisma.hackathonTeamInvite.findFirst({
      where: {
        teamId,
        studentId: student.id,
        status: "PENDING",
      },
      include: {
        team: {
          include: {
            members: true,
            hackathon: true,
          },
        },
      },
    });

    if (!invitation) {
      return { error: "Invitation not found or already processed" };
    }

    if (accept) {
      // Check if team is full
      const maxTeamSize = invitation.team.hackathon.team_size_limit || 5;
      if (invitation.team.members.length >= maxTeamSize) {
        // Update invitation status to DECLINED and return error
        await prisma.hackathonTeamInvite.update({
          where: { id: invitation.id },
          data: { status: "DECLINED" },
        });
        return { error: "Cannot join: team is already full" };
      }

      // Check if the student is already in another team for this hackathon
      const existingMembership = await prisma.hackathonTeamMember.findFirst({
        where: {
          studentId: student.id,
          team: {
            hackathonId: invitation.team.hackathon.id,
          },
        },
      });

      if (existingMembership) {
        // Update invitation status to DECLINED and return error
        await prisma.hackathonTeamInvite.update({
          where: { id: invitation.id },
          data: { status: "DECLINED" },
        });
        return { error: "You are already a member of another team in this hackathon" };
      }

      // Begin a transaction
      await prisma.$transaction(async (tx) => {
        // Update invitation status
        await tx.hackathonTeamInvite.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" },
        });

        // Add student to team
        await tx.hackathonTeamMember.create({
          data: {
            teamId,
            studentId: student.id,
            attended: false,
          },
        });
      });

      return { success: true };
    } else {
      // Decline invitation
      await prisma.hackathonTeamInvite.update({
        where: { id: invitation.id },
        data: { status: "DECLINED" },
      });

      return { success: true };
    }
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return { error: "Failed to process invitation response" };
  } finally {
    await prisma.$disconnect();
  }
}
