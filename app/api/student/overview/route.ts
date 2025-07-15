import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request) {
  // Get supabase user

  const supabase = await createClient();
  const { data, error: userError } = await supabase.auth.getUser();
  const user = data?.user;
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find student by supabaseId
  const prisma = new PrismaClient();
  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      department: true,
      program: true,
      user: true,
    },
  });
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // Total events attended
  const totalEventsAttended = await prisma.eventRegistration.count({
    where: { userId: user.id },
  });

  // Upcoming registered events
  const upcomingEvents = await prisma.eventRegistration.findMany({
    where: {
      userId: user.id,
      event: { status: "UPCOMING" },
    },
    include: { event: true },
    orderBy: { event: { start_date: "asc" } },
    take: 5,
  });

  // Completed events attended
  const completedEvents = await prisma.eventRegistration.findMany({
    where: {
      userId: user.id,
      event: { status: "COMPLETED" },
    },
    include: { event: true },
    orderBy: { event: { end_date: "desc" } },
    take: 5,
  });

  // Feedback given
  const feedbackGiven = await prisma.eventFeedback.count({
    where: { userId: user.id },
  });

  // Recent feedback
  const recentFeedback = await prisma.eventFeedback.findMany({
    where: { userId: user.id },
    include: { event: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Event type distribution
  const eventTypeStats = await prisma.eventRegistration.groupBy({
    by: ["eventId"],
    where: { userId: user.id },
    _count: { eventId: true },
  });
  // For chart, you may need to join with event type

  // Participation over time (by month)
  // ...implement as needed...

  return NextResponse.json({
    student: {
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      department: student.department?.name,
      program: student.program?.name,
      currentSemester: student.currentSemester,
      currentYear: student.currentYear,
    },
    totalEventsAttended,
    feedbackGiven,
    upcomingEvents,
    completedEvents,
    recentFeedback,
    // eventTypeStats, // TODO: format for chart
  });
}
