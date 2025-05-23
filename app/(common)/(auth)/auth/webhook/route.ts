import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const token = searchParams.get("token");
  console.log("Received webhook body:", body);

  if (token !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const prisma = new PrismaClient();

  switch (body.type) {
    case "INSERT": {
      const { id, email, raw_user_meta_data } = body.record;
      try {
        await prisma.user.create({
          data: {
            supabaseId: id,
            email: email,
            firstName: raw_user_meta_data.full_name.split(" ")[0],
            lastName: raw_user_meta_data.full_name.split(" ")[1],
            role: "STUDENT",
            students: {
              create: {},
            },
          },
        });

        return NextResponse.json({ success: true }, { status: 200 });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      } finally {
        await prisma.$disconnect();
        break;
      }
    }

    case "DELETE": {
      const { id } = body.old_record;
      try {
        await prisma.user.delete({
          where: {
            supabaseId: id,
          },
        });

        return NextResponse.json({ success: true }, { status: 200 });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      } finally {
        await prisma.$disconnect();
        break;
      }
    }
  }
}
