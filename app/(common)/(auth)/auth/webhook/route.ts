import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const token = searchParams.get("token");

  if (token !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const prisma = new PrismaClient();

  switch (body.type) {
    case "INSERT": {
      const { id, email, raw_user_meta_data, raw_app_meta_data } = body.record;

      console.log("Processing INSERT webhook for user:", {
        id,
        email,
        raw_user_meta_data,
      });

      if (
        raw_app_meta_data.provider !== "google" &&
        raw_user_meta_data.role !== "STUDENT"
      ) {
        return NextResponse.json({ error: "Invalid role" }, { status: 403 });
      }

      const fullName = raw_user_meta_data?.full_name || "";
      const nameParts = fullName.trim().split(/\s+/); // Split on any whitespace
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      if (!id || !email) {
        console.error("Missing required fields:", { id, email });
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      try {
        const result = await prisma.user.create({
          data: {
            supabaseId: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: "STUDENT",
            students: {
              create: {},
            },
          },
          include: {
            students: true,
          },
        });
        console.log("Successfully created user and student:", result);
        return NextResponse.json({ success: true }, { status: 200 });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect();
        break;
      }
    }

    case "DELETE": {
      const { id } = body.old_record;

      if (!id) {
        return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
      }
      try {
        await prisma.user.delete({
          where: {
            supabaseId: id,
          },
        });

        return NextResponse.json({ success: true }, { status: 200 });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      } finally {
        await prisma.$disconnect();
        break;
      }
    }
  }
}
