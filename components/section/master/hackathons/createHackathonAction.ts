"use server";

import { formattedHackathonSchema, FormattedHackathonSchema } from "@/schemas/hackathon";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function createHackathonAction(data: FormattedHackathonSchema) {
  let prisma: PrismaClient | undefined;

  try {
    console.log("Starting createHackathonAction");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Authorization failed: No user found");
      return { error: "Unauthorized" };
    }

    console.log("User authenticated:", user.id);

    const validatedData = formattedHackathonSchema.safeParse(data);
    if (!validatedData.success) {
      console.log("Validation errors:", validatedData.error.format());
      return { error: "Invalid hackathon data: " + validatedData.error.errors.map(e => e.message).join(", ") };
    }

    const { problemStatements, rules, evaluationCriteria } = validatedData.data;
    prisma = new PrismaClient();

    console.log("Creating hackathon in database");

    const result = await prisma.hackathon.create({
      data: {
        name: validatedData.data.name,
        description: validatedData.data.description,
        poster_url: validatedData.data.poster_url ?? "",
        location: validatedData.data.location ?? "",
        start_date: validatedData.data.start_date,
        end_date: validatedData.data.end_date,
        start_time: validatedData.data.start_time,
        end_time: validatedData.data.end_time,
        registration_start_date: validatedData.data.registration_start_date,
        registration_end_date: validatedData.data.registration_end_date,
        registration_limit: validatedData.data.registration_limit,
        mode: validatedData.data.mode,
        status: validatedData.data.status,
        team_size_limit: validatedData.data.team_size_limit,
        organizer_name: validatedData.data.organizer_name,
        organizer_contact: validatedData.data.organizer_contact,
        tags: validatedData.data.tags || [],
        problemStatements: {
          create: problemStatements.map((ps) => ({
            code: ps.code,
            title: ps.title,
            description: ps.description,
          })),
        },
        rules: {
          create: rules.map((rule) => ({
            rule,
          })),
        },
        evaluationCriteria: validatedData.data.evaluationCriteria || [],
      },
    });

    console.log("Hackathon created successfully:", result.id);
    return { success: true, hackathonId: result.id };
  } catch (error) {
    console.error("Error creating hackathon:", error);
    let errorMessage = "Failed to create hackathon";

    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    }

    return { error: errorMessage };
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
