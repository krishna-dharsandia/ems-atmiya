-- AlterTable
ALTER TABLE "HackathonTeam" ADD COLUMN     "leaderId" TEXT;

-- AddForeignKey
ALTER TABLE "HackathonTeam" ADD CONSTRAINT "HackathonTeam_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
