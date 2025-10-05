import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AttendanceDetails from "@/components/section/master/hackathons/attendance/AttendanceDetails";

export const metadata: Metadata = {
  title: "Hackathon Attendance Details",
  description: "View detailed attendance information for hackathon schedules",
};

async function getAttendanceSchedule(scheduleId: string) {
  try {
    const attendanceSchedule = await prisma.hackathonAttendanceSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        hackathon: {
          select: {
            id: true,
            name: true,
            start_date: true,
          },
        },
      },
    });

    if (!attendanceSchedule) {
      return null;
    }

    return attendanceSchedule;
  } catch (error) {
    console.error("Error fetching attendance schedule:", error);
    return null;
  }
}

export default async function AttendanceDetailsPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>;
}) {
  const { scheduleId } = await params;
  const scheduleBasicInfo = await getAttendanceSchedule(scheduleId);

  if (!scheduleBasicInfo) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <AttendanceDetails scheduleId={scheduleId} scheduleInfo={scheduleBasicInfo} />
    </div>
  );
}
