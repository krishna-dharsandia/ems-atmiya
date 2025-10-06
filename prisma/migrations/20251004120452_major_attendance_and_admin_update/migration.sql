/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `Admin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_programId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "departmentId",
DROP COLUMN "position",
DROP COLUMN "programId";

-- CreateTable
CREATE TABLE "HackathonAttendanceSchedule" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackathonAttendanceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HackathonAttendance" (
    "id" TEXT NOT NULL,
    "attendanceScheduleId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3) NOT NULL,
    "checkedInBy" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackathonAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HackathonAttendanceSchedule_hackathonId_day_checkInTime_key" ON "HackathonAttendanceSchedule"("hackathonId", "day", "checkInTime");

-- CreateIndex
CREATE UNIQUE INDEX "HackathonAttendance_attendanceScheduleId_teamMemberId_key" ON "HackathonAttendance"("attendanceScheduleId", "teamMemberId");

-- AddForeignKey
ALTER TABLE "HackathonAttendanceSchedule" ADD CONSTRAINT "HackathonAttendanceSchedule_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonAttendance" ADD CONSTRAINT "HackathonAttendance_attendanceScheduleId_fkey" FOREIGN KEY ("attendanceScheduleId") REFERENCES "HackathonAttendanceSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonAttendance" ADD CONSTRAINT "HackathonAttendance_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "HackathonTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonAttendance" ADD CONSTRAINT "HackathonAttendance_checkedInBy_fkey" FOREIGN KEY ("checkedInBy") REFERENCES "User"("supabaseId") ON DELETE RESTRICT ON UPDATE CASCADE;
