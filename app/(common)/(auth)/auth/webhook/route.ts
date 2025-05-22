import { authWebhookBodySchema } from "@/schemas/authWebhookBodySchema";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const validatedBody = authWebhookBodySchema.safeParse(body);
  if (!validatedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, email, full_name, token } = validatedBody.data;
  if (token !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        supabaseId: id,
        email,
        firstName: full_name.split(" ")[0],
        lastName: full_name.split(" ")[1],
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
  }
}
