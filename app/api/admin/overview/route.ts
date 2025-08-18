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

  // Get current admin's department and program info
  const currentAdmin = await prisma.admin.findUnique({
    where: { userId: user.id },
    select: {
      departmentId: true,
      programId: true,
    },
  });

  if (!currentAdmin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const departmentFilter = currentAdmin.departmentId ? { departmentId: currentAdmin.departmentId } : {};

  const totalStudents = await prisma.student.count({ where: departmentFilter });
  const totalEvents = await prisma.event.count();
  const totalFeedback = await prisma.eventFeedback.count();
  const totalRegistrations = await prisma.eventRegistration.count();
  const totalAdmins = await prisma.admin.count({ where: departmentFilter });
  const totalDepartments = currentAdmin.departmentId ? 1 : await prisma.department.count();
  const totalPrograms = currentAdmin.programId ? 1 : await prisma.program.count();

  // Upcoming and completed events
  const upcomingEvents = await prisma.event.count({ where: { status: "UPCOMING" } });
  const completedEvents = await prisma.event.count({ where: { status: "COMPLETED" } });

  // Students per department (filtered by admin's department)
  const studentsByDepartment = await prisma.department.findMany({
    where: currentAdmin.departmentId ? { id: currentAdmin.departmentId } : {},
    select: {
      name: true,
      students: { select: { id: true } },
    },
  });
  const departmentStats = studentsByDepartment.map((dep) => ({
    name: dep.name,
    count: dep.students.length,
  }));

  // Students per program (filtered by admin's program or department)
  const programWhere = currentAdmin.programId ? { id: currentAdmin.programId } : currentAdmin.departmentId ? { departmentId: currentAdmin.departmentId } : {};

  const studentsByProgram = await prisma.program.findMany({
    where: programWhere,
    select: {
      name: true,
      students: { select: { id: true } },
    },
  });
  const programStats = studentsByProgram.map((prog) => ({
    name: prog.name,
    count: prog.students.length,
  }));

  // Recent events (all events for now, could be filtered by department later)
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
    },
  });

  // Recent registrations (filtered by department students)
  const recentRegistrations = await prisma.eventRegistration.findMany({
    where: {
      user: {
        students: {
          some: departmentFilter,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      event: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      createdAt: true,
    },
  });

  // Recent feedback (filtered by department students)
  const recentFeedback = await prisma.eventFeedback.findMany({
    where: {
      user: {
        students: {
          some: departmentFilter,
        },
      },
    },
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

  // Top events by registration
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

  // Average event rating (filtered by department students)
  const avgRatingAgg = await prisma.eventFeedback.aggregate({
    where: {
      user: {
        students: {
          some: departmentFilter,
        },
      },
    },
    _avg: { rating: true },
  });
  const avgEventRating = avgRatingAgg._avg?.rating || 0;

  // Cleanup Prisma connection
  await prisma.$disconnect();

  return NextResponse.json({
    totalStudents,
    totalEvents,
    totalFeedback,
    totalRegistrations,
    totalAdmins,
    totalDepartments,
    totalPrograms,
    upcomingEvents,
    completedEvents,
    departmentStats,
    programStats,
    recentEvents,
    recentRegistrations,
    recentFeedback,
    topEvents,
    avgEventRating,
  });
}
