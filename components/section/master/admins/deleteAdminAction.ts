"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export default async function destroyAdmin(id: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.admin.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return { error: "Failed to delete admin" };
  } finally {
    await prisma.$disconnect();
  }
}
