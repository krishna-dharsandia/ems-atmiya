import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();
  try {
    // ✅ SECURITY FIX: Check role in database, not Supabase metadata
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { role: true }
    });

    if (!dbUser || !["ADMIN", "MASTER"].includes(dbUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const students = await prisma.student.findMany({
      include: {
        department: true,
        program: true,
        user: true,
      },
    });
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
