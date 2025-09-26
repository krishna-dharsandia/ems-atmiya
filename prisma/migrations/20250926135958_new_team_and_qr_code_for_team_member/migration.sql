/*
  Warnings:

  - A unique constraint covering the columns `[hackathonId,leaderId]` on the table `HackathonTeam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hackathonId,teamId]` on the table `HackathonTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HackathonTeamMember" ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "qrCodeData" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "HackathonTeam_hackathonId_leaderId_key" ON "HackathonTeam"("hackathonId", "leaderId");

-- CreateIndex
CREATE UNIQUE INDEX "HackathonTeam_hackathonId_teamId_key" ON "HackathonTeam"("hackathonId", "teamId");
