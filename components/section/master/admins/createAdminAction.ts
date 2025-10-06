"use server";

import { adminSchema, AdminSchema } from "@/schemas/admin";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createAdminAction(data: AdminSchema, captchaToken: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedData = adminSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid data" };
  }

  const { firstName, lastName, email, password, departmentId, programId, position } = validatedData.data;

  const { data: admin, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
      },
      emailRedirectTo: `${process.env.BASE_URL}/admin`,
      captchaToken,
    },
  });

  if (error || !admin || !admin.user) {
    return { error: error ? error.message : "Failed to register user with Supabase" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        supabaseId: admin.user.id,
        firstName,
        lastName,
        email,
        role: "ADMIN",
        admins: {
          create: {
          }
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Internal Server Error" };
  } finally {
    await prisma.$disconnect();
  }
}
