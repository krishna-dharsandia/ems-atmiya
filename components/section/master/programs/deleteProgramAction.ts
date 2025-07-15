"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export default async function destroyProgram(id: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.program.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting program:", error);
    return { error: "Failed to delete program" };
  } finally {
    await prisma.$disconnect();
  }
}
