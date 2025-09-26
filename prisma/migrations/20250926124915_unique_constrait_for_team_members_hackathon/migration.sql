/*
  Warnings:

  - A unique constraint covering the columns `[teamId,studentId]` on the table `HackathonTeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HackathonTeamMember_teamId_studentId_key" ON "HackathonTeamMember"("teamId", "studentId");
