"use server";

import { programSchema, ProgramSchema } from "@/schemas/program";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createProgram(data: ProgramSchema) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedData = programSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid data", issues: validatedData.error.issues };
  }

  const { name, departmentId } = validatedData.data;
  const prisma = new PrismaClient();

  try {
    await prisma.program.create({
      data: {
        name,
        departmentId,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "Internal Server Error" };
  } finally {
    await prisma.$disconnect();
  }
}
