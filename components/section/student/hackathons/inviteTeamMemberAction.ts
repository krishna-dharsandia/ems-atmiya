"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function inviteTeamMemberAction(teamId: string, studentEmail: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();

  try {
    // Check if the team exists
    const team = await prisma.hackathonTeam.findUnique({
      where: { id: teamId },
      include: {
        hackathon: true,
        members: true,
        invites: true,
      },
    });

    if (!team) {
      return { error: "Team not found" };
    }

    // Check if the current user is a member of the team
    const currentStudent = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!currentStudent) {
      return { error: "Only students can invite team members" };
    }

    const isTeamMember = team.members.some(
      (member) => member.studentId === currentStudent.id
    );

    if (!isTeamMember) {
      return { error: "You must be a team member to invite others" };
    }

    // Check team size limit
    const maxTeamSize = team.hackathon.team_size_limit || 5;
    if (team.members.length >= maxTeamSize) {
      return { error: "Team has reached maximum size" };
    }

    // Find the student by email
    const invitedUser = await prisma.user.findFirst({
      where: {
        email: studentEmail,
        role: "STUDENT",
      },
      include: {
        students: true,
      },
    });

    if (!invitedUser) {
      return { error: "User not found with that email" };
    }

    if (!invitedUser.students || !invitedUser.students) {
      return {
        error: `Student profile not found for ${studentEmail}. This user exists but has no student record. Please ask an administrator to complete their student profile setup.`
      };
    }

    const invitedStudent = invitedUser.students;

    // Check if student is already a member of the team
    const isAlreadyMember = team.members.some(
      (member) => member.studentId === invitedStudent.id
    );

    if (isAlreadyMember) {
      return { error: "This student is already a member of the team" };
    }

    // Check if there's already a pending invite for this student
    const existingInvite = await prisma.hackathonTeamInvite.findFirst({
      where: {
        teamId: team.id,
        studentId: invitedStudent.id,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return { error: "An invitation has already been sent to this student" };
    }

    // Check if student is already in another team for this hackathon
    const otherTeamMembership = await prisma.hackathonTeamMember.findFirst({
      where: {
        studentId: invitedStudent.id,
        team: {
          hackathonId: team.hackathon.id,
        },
      },
    });

    if (otherTeamMembership) {
      return { error: "This student is already a member of another team in this hackathon" };
    }

    // Create the invitation
    await prisma.hackathonTeamInvite.create({
      data: {
        teamId: team.id,
        studentId: invitedStudent.id,
        status: "PENDING",
      },
    });

    // In a real application, you would send an email notification here
    // For now, we'll just return success

    return { success: true };
  } catch (error) {
    console.error("Error inviting team member:", error);
    return { error: "Failed to invite team member" };
  } finally {
    await prisma.$disconnect();
  }
}
