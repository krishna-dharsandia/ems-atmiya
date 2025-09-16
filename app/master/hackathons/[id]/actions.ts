"use server";

import { editTeamSchema } from "@/schemas/team";
import { prisma } from "@/lib/prisma";

export async function editTeamAction(input: unknown) {
  const parsed = editTeamSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }
  const data = parsed.data;
  try {
    // Update team
    await prisma.hackathonTeam.update({
      where: { id: data.id },
      data: {
        mentor: data.mentor,
        mentor_mail: data.mentor_mail,
        disqualified: data.disqualified,
        problemStatementId: data.problemStatementId || null,
        teamName: data.teamName,
        // For members, remove all and re-create (simple approach)
        members: {
          deleteMany: {},
          create: data.members.map((m) => ({ studentId: m.studentId, attended: m.attended ?? false })),
        },
      },
    });
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
