import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const prisma = new PrismaClient();
  const supabase = await createClient();

  // Get current user session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get current master info
  const currentMaster = await prisma.master.findUnique({
    where: { userId: user.id },
  });

  if (!currentMaster) {
    return NextResponse.json({ error: "Master not found" }, { status: 403 });
  }

  // Platform-wide statistics (no filtering)
  const totalStudents = await prisma.student.count();
  const totalEvents = await prisma.event.count();
  const totalFeedback = await prisma.eventFeedback.count();
  const totalRegistrations = await prisma.eventRegistration.count();
  const totalAdmins = await prisma.admin.count();
  const totalMasters = await prisma.master.count();
  const totalDepartments = await prisma.department.count();
  const totalPrograms = await prisma.program.count();

  // Upcoming and completed events
  const upcomingEvents = await prisma.event.count({ where: { status: "UPCOMING" } });
  const completedEvents = await prisma.event.count({ where: { status: "COMPLETED" } });
  const cancelledEvents = await prisma.event.count({ where: { status: "CANCELLED" } });

  // Students per department (all departments)
  const studentsByDepartment = await prisma.department.findMany({
    select: {
      name: true,
      students: { select: { id: true } },
    },
  });
  const departmentStats = studentsByDepartment.map((dep) => ({
    name: dep.name,
    count: dep.students.length,
  }));

  // Students per program (all programs)
  const studentsByProgram = await prisma.program.findMany({
    select: {
      name: true,
      students: { select: { id: true } },
    },
  });
  const programStats = studentsByProgram.map((prog) => ({
    name: prog.name,
    count: prog.students.length,
  }));

  // Event type distribution
  const eventsByType = await prisma.event.groupBy({
    by: ["event_type"],
    _count: {
      id: true,
    },
  });
  const eventTypeStats = eventsByType.map((type) => ({
    name: type.event_type,
    count: type._count.id,
  }));

  // Event mode distribution
  const eventsByMode = await prisma.event.groupBy({
    by: ["mode"],
    _count: {
      id: true,
    },
  });
  const eventModeStats = eventsByMode.map((mode) => ({
    name: mode.mode,
    count: mode._count.id,
  }));

  // Recent events (platform-wide)
  const recentEvents = await prisma.event.findMany({
    orderBy: { start_date: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      start_date: true,
      status: true,
      registration_required: true,
      current_registration_count: true,
      event_type: true,
      mode: true,
    },
  });

  // Recent registrations (platform-wide)
  const recentRegistrations = await prisma.eventRegistration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      event: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      createdAt: true,
    },
  });

  // Recent feedback (platform-wide)
  const recentFeedback = await prisma.eventFeedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      rating: true,
      comment: true,
      event: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      createdAt: true,
    },
  });

  // Top events by registration (platform-wide)
  const topEvents = await prisma.event.findMany({
    orderBy: { current_registration_count: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      current_registration_count: true,
      start_date: true,
    },
  });

  // Average event rating (platform-wide)
  const avgRatingAgg = await prisma.eventFeedback.aggregate({
    _avg: { rating: true },
  });
  const avgEventRating = avgRatingAgg._avg.rating || 0;

  // User growth stats
  const usersByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
  });
  const userRoleStats = usersByRole.map((role) => ({
    name: role.role,
    count: role._count.id,
  }));

  // Cleanup Prisma connection
  await prisma.$disconnect();

  return NextResponse.json({
    totalStudents,
    totalEvents,
    totalFeedback,
    totalRegistrations,
    totalAdmins,
    totalMasters,
    totalDepartments,
    totalPrograms,
    upcomingEvents,
    completedEvents,
    cancelledEvents,
    departmentStats,
    programStats,
    eventTypeStats,
    eventModeStats,
    userRoleStats,
    recentEvents,
    recentRegistrations,
    recentFeedback,
    topEvents,
    avgEventRating,
  });
}
