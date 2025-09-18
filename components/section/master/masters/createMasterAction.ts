"use server";

import { masterSchema, MasterSchema } from "@/schemas/master";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createMasterAction(data: MasterSchema, captchaToken: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedData = masterSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid data", details: validatedData.error.errors };
  }

  const { firstName, lastName, email, password } = validatedData.data;
  const { data: master, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
      },
      emailRedirectTo: `${process.env.BASE_URL}/master`,
      captchaToken,
    },
  });

  if (error || !master || !master.user) {
    return { error: error ? error.message : "Failed to register user with Supabase" };
  }

  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        supabaseId: master.user.id,
        firstName,
        lastName,
        email,
        role: "MASTER",
        masters: {
          create: {},
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
