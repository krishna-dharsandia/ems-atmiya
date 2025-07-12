"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export default async function destroyStudent(id: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.student.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete student" };
  } finally {
    await prisma.$disconnect();
  }
}
