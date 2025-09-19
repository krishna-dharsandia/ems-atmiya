import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateTeamLeaders() {
  try {
    console.log('Starting to populate team leaders...');

    // Get all teams that don't have a leader set
    const teamsWithoutLeader = await prisma.hackathonTeam.findMany({
      where: {
        leaderId: null,
      },
      include: {
        members: {
          orderBy: {
            id: 'asc', // Order by creation to get the first member
          },
          take: 1, // Only get the first member
        },
      },
    });

    console.log(`Found ${teamsWithoutLeader.length} teams without leaders.`);

    let updatedCount = 0;

    for (const team of teamsWithoutLeader) {
      if (team.members.length > 0) {
        const firstMember = team.members[0];

        await prisma.hackathonTeam.update({
          where: { id: team.id },
          data: {
            leaderId: firstMember.studentId,
          },
        });

        console.log(`Set leader for team "${team.teamName}" (ID: ${team.id}) to student ID: ${firstMember.studentId}`);
        updatedCount++;
      } else {
        console.warn(`Team "${team.teamName}" (ID: ${team.id}) has no members, skipping...`);
      }
    }

    console.log(`Successfully updated ${updatedCount} teams with leaders.`);
  } catch (error) {
    console.error('Error populating team leaders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateTeamLeaders();
