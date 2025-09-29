"use server";

import { createClient } from "@/utils/supabase/server";
import { SubmissionsFormValues, submissionsSchema } from "./TeamManagement";
import { PrismaClient } from "@prisma/client";

export async function submissionsAction(data: SubmissionsFormValues, hackathonId: string, teamId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const parsedData = submissionsSchema.safeParse(data);
  if (!parsedData.success) {
    return { error: "Invalid data" };
  }
  const { url } = parsedData.data;

  const prisma = new PrismaClient();

  let hackathon;
  try {
    hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      select: { open_submissions: true },
    });
  } catch (error) {
    return { error: "Failed to fetch hackathon details" };
  }

  if (!hackathon) {
    return { error: "Hackathon not found" };
  }

  if (!hackathon.open_submissions) {
    return { error: "Submissions are closed for this hackathon" };
  }

  let team;
  try {
    team = await prisma.hackathonTeam.findFirst({
      where: {
        id: teamId,
      },
    });
  } catch (error) {
    return { error: "Failed to fetch team details" };
  }

  if (!team) {
    return { error: "Team not found" };
  }

  if (team.disqualified) {
    return { error: "Team is disqualified" };
  }

  try {
    await prisma.hackathonTeam.update({
      where: { id: teamId },
      data: { submissionUrl: url },
    });

    return { success: true };
  } catch (error) {
    return { error: "Database error" };
  } finally {
    await prisma.$disconnect();
  }
}
