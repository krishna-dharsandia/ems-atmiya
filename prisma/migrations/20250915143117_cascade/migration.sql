-- DropForeignKey
ALTER TABLE "HackathonTeamInvite" DROP CONSTRAINT "HackathonTeamInvite_teamId_fkey";

-- DropForeignKey
ALTER TABLE "HackathonTeamMember" DROP CONSTRAINT "HackathonTeamMember_teamId_fkey";

-- AddForeignKey
ALTER TABLE "HackathonTeamMember" ADD CONSTRAINT "HackathonTeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "HackathonTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonTeamInvite" ADD CONSTRAINT "HackathonTeamInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "HackathonTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
