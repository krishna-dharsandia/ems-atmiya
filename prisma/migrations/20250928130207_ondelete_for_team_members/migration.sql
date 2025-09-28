-- DropForeignKey
ALTER TABLE "HackathonTeamMember" DROP CONSTRAINT "HackathonTeamMember_studentId_fkey";

-- AddForeignKey
ALTER TABLE "HackathonTeamMember" ADD CONSTRAINT "HackathonTeamMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
