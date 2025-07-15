"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export default async function destroyDepartment(id: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { error: "User not authenticated" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.department.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting department:", error);
    return { error: "Failed to delete department" };
  } finally {
    await prisma.$disconnect();
  }
}
