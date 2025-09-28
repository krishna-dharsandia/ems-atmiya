-- DropForeignKey
ALTER TABLE "HackathonTeamInvite" DROP CONSTRAINT "HackathonTeamInvite_studentId_fkey";

-- AddForeignKey
ALTER TABLE "HackathonTeamInvite" ADD CONSTRAINT "HackathonTeamInvite_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
