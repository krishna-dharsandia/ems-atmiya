// Script to update existing teams with leader information
// Run this with: npx ts-node scripts/update-team-leaders.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTeamLeaders() {
  try {
    console.log('Updating team leaders for existing teams...');

    // Get all teams that don't have a leader set
    const teamsWithoutLeader = await prisma.hackathonTeam.findMany({
      where: {
        leaderId: null,
      },
      include: {
        members: {
          orderBy: {
            id: 'asc', // Get the first member by creation time
          },
        },
      },
    });

    console.log(`Found ${teamsWithoutLeader.length} teams without leaders.`);

    for (const team of teamsWithoutLeader) {
      if (team.members.length > 0) {
        const firstMember = team.members[0];

        await prisma.hackathonTeam.update({
          where: { id: team.id },
          data: {
            leaderId: firstMember.studentId,
          },
        });

        console.log(`✅ Updated team "${team.teamName}" - Leader: ${firstMember.studentId}`);
      } else {
        console.log(`⚠️  Team "${team.teamName}" has no members, skipping...`);
      }
    }

    console.log(`\n🎉 Successfully updated ${teamsWithoutLeader.filter(t => t.members.length > 0).length} teams!`);

  } catch (error) {
    console.error('❌ Error updating team leaders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateTeamLeaders();
